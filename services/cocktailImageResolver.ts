import { COCKTAILS } from '../data/cocktails.ts';
import { DetectedCocktail, CocktailVisualProfile, ExtractedIngredientLayer } from '../types.ts';

const cocktailImageCache = new Map<string, string>();

function normalize(str: string): string {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

/**
 * Searches local curated database with strict matching.
 * Avoids false positive partial word matching (e.g. "Cóctel con Café y Ron"
 * must NEVER match "Mojito Clásico" just because both contain the word "ron").
 */
function findInLocalDatabase(cocktailName: string) {
  const norm = normalize(cocktailName);
  
  const cleanNorm = norm
    .replace(/\b(clasico|clasica|original|tradicional|cubano|cubana|perfecto|receta|coctel|cocktail|el|la|un|una|de|del)\b/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // 1. Direct or strict normalized match
  for (const c of COCKTAILS) {
    const cNorm = normalize(c.name);
    const cleanCNorm = cNorm
      .replace(/\b(clasico|clasica|original|tradicional|cubano|cubana|perfecto|receta|coctel|cocktail|el|la|un|una|de|del)\b/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (cNorm === norm || cleanCNorm === cleanNorm) {
      return c;
    }
  }

  // 2. Exact compound match only (e.g. "Old Fashioned" in "Old Fashioned Clásico")
  // Reject if the candidate has modifier flavor tokens that the database item lacks
  const flavorModifiers = ['fresa', 'cafe', 'mango', 'maracuya', 'coco', 'mora', 'arandano', 'frambuesa', 'chocolate', 'humo', 'picante', 'autor'];
  const candidateHasFlavor = flavorModifiers.some(f => norm.includes(f));

  if (!candidateHasFlavor) {
    for (const c of COCKTAILS) {
      const cleanCNorm = normalize(c.name)
        .replace(/\b(clasico|clasica|original|tradicional)\b/g, '')
        .trim();
      if (cleanNorm.length >= 4 && cleanCNorm === cleanNorm) {
        return c;
      }
    }
  }

  return null;
}

/**
 * Searches TheCocktailDB online catalog with caching
 */
async function searchTheCocktailDB(drinkName: string): Promise<string | null> {
  const cleanName = drinkName
    .replace(/(clásico|clasico|original|tradicional|cubano|perfecto|receta|cóctel|coctel|de|del|el|la)\s+/gi, '')
    .trim();

  const cacheKey = cleanName.toLowerCase();
  if (cocktailImageCache.has(cacheKey)) {
    return cocktailImageCache.get(cacheKey) || null;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(cleanName)}`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) return null;
    const data = await res.json();
    const drink = data.drinks?.[0];

    if (drink?.strDrinkThumb) {
      cocktailImageCache.set(cacheKey, drink.strDrinkThumb);
      return drink.strDrinkThumb;
    }
  } catch {
    // Ignore timeout or network errors silently
  }

  return null;
}

/**
 * Maps raw ingredient mentions to realistic liquid layer colors
 */
function getIngredientColor(name: string): string {
  const n = normalize(name);
  if (/cafe|espresso|kahlua|kahlúa|tia maria/i.test(n)) return '#2b1810';
  if (/fresa|frutilla|frambuesa|arandano|mora|grenadina|granadina|campari|vino tinto|hibisco/i.test(n)) return '#b91c1c';
  if (/blue cura[cç]ao|cura[cç]ao azul|curacao/i.test(n)) return '#0284c7';
  if (/menta|hierbabuena|albahaca|pepino|midori/i.test(n)) return '#059669';
  if (/maracuya|maracuyá|mango|naranja|aperol|pomelo/i.test(n)) return '#ea580c';
  if (/coco|crema|nata|leche|baileys|clara de huevo/i.test(n)) return '#fef3c7';
  if (/whisky|whiskey|bourbon|ron a[nñ]ejo|ron dorado|cognac|brandy|amaretto|vermouth rosso|angostura/i.test(n)) return '#d97706';
  if (/lima|limon|jugo de limon|jugo de lima/i.test(n)) return '#a3e635';
  if (/jarabe simple|sirope|almibar|azucar/i.test(n)) return '#fde68a';
  if (/soda|tonica|club soda|gasificada/i.test(n)) return '#e2e8f0';
  return '#cbd5e1';
}

/**
 * Extracts structured ingredient layers from recipe text
 */
function extractIngredientLayers(text: string): ExtractedIngredientLayer[] {
  const layers: ExtractedIngredientLayer[] = [];
  const lines = text.split('\n');

  let inIngredients = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (/###?\s*(ingrediente|proporci)/i.test(trimmed) || /\*\*(ingrediente|proporci)/i.test(trimmed)) {
      inIngredients = true;
      continue;
    }
    if (inIngredients && (/###?\s*(cristal|prepara|paso|consejo)/i.test(trimmed) || /\*\*(cristal|prepara|paso)/i.test(trimmed))) {
      break;
    }

    if (inIngredients && /^[\*\-\•\d+\.]\s+/.test(trimmed)) {
      const clean = trimmed.replace(/^[\*\-\•\d+\.]+\s*/, '').replace(/[*#_~`]/g, '').trim();
      const parts = clean.split(/:\s*/);
      const ingName = parts[0]?.trim();
      const ingAmount = parts[1]?.trim() || '';

      if (ingName && ingName.length < 50) {
        layers.push({
          name: ingName,
          amount: ingAmount,
          color: getIngredientColor(ingName)
        });
      }
    }
  }

  // Calculate approximate percentage split for visualization
  if (layers.length > 0) {
    const each = Math.floor(100 / layers.length);
    layers.forEach((l, i) => {
      l.percentage = i === layers.length - 1 ? 100 - each * (layers.length - 1) : each;
    });
  }

  return layers;
}

/**
 * Deep analysis of the cocktail text to compute the accurate visual archetype,
 * color palette, ice structure, and technique.
 */
function computeVisualProfile(
  name: string,
  text: string,
  category: string
): CocktailVisualProfile {
  const norm = normalize(`${name} ${text}`);

  let espressoScore = 0;
  let rubyScore = 0;
  let cyanScore = 0;
  let emeraldScore = 0;
  let sunsetScore = 0;
  let creamyScore = 0;
  let amberScore = 0;
  let clearScore = 0;

  // Espresso / Coffee
  if (/cafe|espresso|kahlua|kahlúa|tia maria|coffee|cold brew|granos de cafe/i.test(norm)) espressoScore += 6;
  if (/licor de cafe|espresso martini|carajillo/i.test(norm)) espressoScore += 8;

  // Ruby / Red Berry / Campari / Wine
  if (/fresa|frutilla|frambuesa|arandano|mora|frutos rojos|sangria|vino tinto|hibisco|flor de jamaica|cranberry/i.test(norm)) rubyScore += 6;
  if (/campari|granadina|negroni|boulevardier|cosmopolitan/i.test(norm)) rubyScore += 5;

  // Cyan / Blue Curaçao
  if (/blue cura[cç]ao|cura[cç]ao azul|curacao azul|azul electrico|blue lagoon|hpnotiq|zafiro/i.test(norm)) cyanScore += 8;

  // Emerald / Herbal Green / Mint
  if (/menta|hierbabuena|albahaca|pepino|midori|manzana verde|matcha/i.test(norm)) emeraldScore += 6;

  // Sunset / Tropical Citrus & Ombre
  if (/maracuya|maracuyá|mango|aperol|jugo de naranja|naranja sanguina|tequila sunrise|sunset|pomelo|toronja|tropical/i.test(norm)) sunsetScore += 5;

  // Creamy / Frothy / Coconut / Egg White
  if (/crema de coco|leche de coco|nata|crema|clara de huevo|egg white|pina colada|piña colada|baileys|espuma densa/i.test(norm)) creamyScore += 6;

  // Amber / Aged Whiskey / Dark Rum
  if (/whisky|whiskey|bourbon|rye|scotch|ron a[nñ]ejo|ron dorado|cognac|brandy|amaretto|vermouth rosso|angostura|roble/i.test(norm)) amberScore += 4;
  if (category === 'Whisky' || category === 'Brandy') amberScore += 3;

  // Clear / Translucent
  if (/ginebra|gin|vodka|tequila blanco|dry vermouth|vermut seco|tonica|tónica|translucido|cristalino/i.test(norm)) clearScore += 3;
  if (category === 'Ginebra' || category === 'Vodka') clearScore += 2;

  // Determine ice style
  let iceStyle = 'Cubos cristalinos';
  if (/frapp[eé]|hielo picado|crushed ice|licuado/i.test(norm)) {
    iceStyle = 'Hielo picado / Frappé';
  } else if (/hielo en cubo grande|bloque de hielo|cubo artesanal|esfera/i.test(norm)) {
    iceStyle = 'Cubo de hielo artesanal';
  } else if (/sin hielo|straight up|copa helada|copa fria|doble colado/i.test(norm)) {
    iceStyle = 'Sin hielo (Copa fría / Straight Up)';
  }

  // Determine technique
  let technique = 'Agitado en coctelera';
  if (/refresca|stir|cuchara de bar|vaso mezclador/i.test(norm)) technique = 'Refrescado (Stirred)';
  else if (/licu|blender|frapp/i.test(norm)) technique = 'Licuado (Blended)';
  else if (/directo|construid|vaso con hielo/i.test(norm)) technique = 'Construido directo en vaso';

  const scores = [
    { id: 'espresso', score: espressoScore },
    { id: 'ruby', score: rubyScore },
    { id: 'cyan', score: cyanScore },
    { id: 'emerald', score: emeraldScore },
    { id: 'sunset', score: sunsetScore },
    { id: 'creamy', score: creamyScore },
    { id: 'amber', score: amberScore },
    { id: 'clear', score: clearScore }
  ];

  scores.sort((a, b) => b.score - a.score);
  const best = scores[0].score > 0 ? scores[0].id : (category === 'Ginebra' ? 'clear' : category === 'Whisky' ? 'amber' : 'sunset');

  switch (best) {
    case 'espresso':
      return {
        archetypeId: 'espresso',
        primaryColor: '#2b1810',
        secondaryColor: '#d4a373',
        liquidName: 'Moka Tostado & Crema Café',
        isCreamy: true,
        hasFoam: true,
        iceStyle,
        technique
      };
    case 'ruby':
      return {
        archetypeId: 'ruby',
        primaryColor: '#b91c1c',
        secondaryColor: '#991b1b',
        liquidName: 'Rubí Carmesí & Frutos Rojos',
        iceStyle,
        technique
      };
    case 'cyan':
      return {
        archetypeId: 'cyan',
        primaryColor: '#0284c7',
        secondaryColor: '#38bdf8',
        liquidName: 'Zafiro Azul & Cítricos Eléctricos',
        iceStyle,
        technique
      };
    case 'emerald':
      return {
        archetypeId: 'emerald',
        primaryColor: '#059669',
        secondaryColor: '#10b981',
        liquidName: 'Esmeralda Herbal & Menta Fresca',
        hasBubbles: true,
        iceStyle,
        technique
      };
    case 'creamy':
      return {
        archetypeId: 'creamy',
        primaryColor: '#fef3c7',
        secondaryColor: '#fde68a',
        liquidName: 'Seda Marfil & Espuma Aterciopelada',
        isCreamy: true,
        hasFoam: true,
        iceStyle,
        technique
      };
    case 'sunset':
      return {
        archetypeId: 'sunset',
        primaryColor: '#ea580c',
        secondaryColor: '#fbbf24',
        liquidName: 'Atardecer Dorado & Pulpa Tropical',
        iceStyle,
        technique
      };
    case 'clear':
      return {
        archetypeId: 'clear',
        primaryColor: '#cbd5e1',
        secondaryColor: '#94a3b8',
        liquidName: 'Cristal Traslúcido & Botánicos Puros',
        iceStyle,
        technique
      };
    case 'amber':
    default:
      return {
        archetypeId: 'amber',
        primaryColor: '#d97706',
        secondaryColor: '#92400e',
        liquidName: 'Ámbar Roble & Notas Especiadas',
        iceStyle,
        technique
      };
  }
}

/**
 * Returns canonical image URL for a visual archetype
 */
function getArchetypeImage(archetypeId: string): string {
  switch (archetypeId) {
    case 'espresso':
      return '/assets/images/cocktail_espresso.jpg';
    case 'ruby':
      return '/assets/images/cocktail_ruby.jpg';
    case 'cyan':
      return '/assets/images/cocktail_cyan.jpg';
    case 'emerald':
      return '/assets/images/cocktail_emerald.jpg';
    case 'sunset':
      return '/assets/images/cocktail_sunset.jpg';
    case 'creamy':
      return '/assets/images/cocktail_creamy.jpg';
    case 'clear':
      return '/assets/images/cocktail_clear.jpg';
    case 'amber':
    default:
      return '/assets/images/cocktail_amber.jpg';
  }
}

/**
 * Detects if the response is elaborating a cocktail recipe,
 * extracts cocktail attributes, and resolves or generates the exact matching image.
 */
export async function detectAndResolveCocktail(
  query: string,
  text: string
): Promise<DetectedCocktail | null> {
  const normText = text.toLowerCase();
  const normQuery = query.toLowerCase();

  // Must have ingredients AND preparation/technique to be considered an elaboration
  const hasIngredients = /ingrediente/i.test(text);
  const hasPreparation = /(paso a paso|preparaci|elaboraci|técnica|shaker|coctelera|agitado|refrescado|colar|doble colado)/i.test(text);

  // Exclude conceptual comparisons that aren't elaborating a drink
  const isComparisonOnly = normQuery.includes('diferencia entre') && !normQuery.includes('receta');

  if (!hasIngredients || !hasPreparation || isComparisonOnly) {
    return null;
  }

  // 1. Extract Cocktail Name
  let name = '';

  // Look for creation announcements: e.g. mi creación: **"El Legado de la Habana"**, presentamos el **"Beso de Fresa"**, etc.
  const creationMatch = text.slice(0, 500).match(/(?:mi creación|creación|presento|bautizado|llamado|titulado|el cóctel|cóctel)\s*:\s*\*\*["'«“\\]*([^"*#]{2,40}?)["'»”\\]*\*\*/i);
  if (creationMatch) {
    name = creationMatch[1].replace(/["'«»“”\\:]/g, '').trim();
  }

  // Look for bold name in the first paragraph: e.g. El **Daiquiri**, **"El Ocaso del Jaguar"** o **Beso Tropical**
  if (!name) {
    const boldNameMatch = text.slice(0, 500).match(/\*\*["'«“\\]*([A-ZÁÉÍÓÚ][^"*#]{2,38}?)["'»”\\]*\*\*/);
    if (boldNameMatch) {
      const candidate = boldNameMatch[1].replace(/["'«»“”\\:]/g, '').trim();
      if (!['Ingredientes', 'Preparación', 'Cristalería', 'Consejos', 'Historia', 'Paso', 'Técnica', 'Maridaje'].some(w => candidate.startsWith(w))) {
        name = candidate;
      }
    }
  }

  // Fallback to query extraction
  if (!name) {
    const cleanedQuery = query
      .replace(/(cómo hacer|como hacer|cómo preparar|como preparar|receta de|receta del|receta|preparar|hacer|elaborar|inventa un|crea un|crear un|inventar un|un cóctel|un coctel)\s+/gi, '')
      .replace(/[?¿!¡]/g, '')
      .trim();

    if (cleanedQuery.length >= 3 && cleanedQuery.length <= 32) {
      name = cleanedQuery;
    }
  }

  if (!name) {
    name = 'Cóctel de Autor';
  }

  // 2. Extract Glassware
  let glass = 'Copa Cóctel / Coupé';
  if (/coupé|coupe/i.test(text)) glass = 'Copa Coupé';
  else if (/nick & nora|nick and nora/i.test(text)) glass = 'Copa Nick & Nora';
  else if (/rocks|old fashioned|vaso bajo/i.test(text)) glass = 'Vaso Old Fashioned / Rocks';
  else if (/collins|highball|vaso alto/i.test(text)) glass = 'Vaso Highball / Collins';
  else if (/hurac[aá]n/i.test(text)) glass = 'Copa Huracán';
  else if (/flauta|flute/i.test(text)) glass = 'Copa Flauta';
  else if (/bal[oó]n/i.test(text)) glass = 'Copa Balón';
  else if (/j[ií]cara|veladora|tequilero|chupito/i.test(text)) glass = 'Vaso Tequilero / Veladora';
  else if (/martini/i.test(text)) glass = 'Copa Martini';

  // 3. Extract Garnish
  let garnish = 'Twist cítrico';
  const garnishMatch = text.match(/(decoraci[oó]n|garnish|adorno|presentaci[oó]n).*?:\s*([^\.\n]+)/i);
  if (garnishMatch && garnishMatch[2].length < 60) {
    garnish = garnishMatch[2].replace(/[*#_~`]/g, '').trim();
  } else if (/granos de caf[eé]/i.test(text)) {
    garnish = 'Tres granos de café tostado';
  } else if (/rueda de lima|rodaja de lima/i.test(text)) {
    garnish = 'Rueda de lima fresca';
  } else if (/twist de lim[oó]n|piel de lim[oó]n/i.test(text)) {
    garnish = 'Twist de piel de limón';
  } else if (/piel de naranja|twist de naranja/i.test(text)) {
    garnish = 'Twist de piel de naranja';
  } else if (/aceituna/i.test(text)) {
    garnish = 'Aceitunas en púa coctelera';
  } else if (/cereza|maraschino/i.test(text)) {
    garnish = 'Cereza al marrasquino';
  } else if (/menta|hierbabuena/i.test(text)) {
    garnish = 'Ramillete de hierbabuena fresca';
  } else if (/borde de sal|escarchado de sal/i.test(text)) {
    garnish = 'Borde escarchado con sal';
  }

  // 4. Extract Category / Primary Spirit
  let category = 'Coctelería de Autor';
  if (/ron\b|rum\b/i.test(text)) category = 'Ron';
  else if (/ginebra\b|gin\b/i.test(text)) category = 'Ginebra';
  else if (/tequila\b/i.test(text)) category = 'Tequila';
  else if (/mezcal\b/i.test(text)) category = 'Mezcal';
  else if (/whisky\b|whiskey\b|bourbon\b|rye\b/i.test(text)) category = 'Whisky';
  else if (/vodka\b/i.test(text)) category = 'Vodka';
  else if (/brandy\b|cognac\b/i.test(text)) category = 'Brandy';
  else if (/pisco\b/i.test(text)) category = 'Pisco';
  else if (/campari\b|aperol\b|vermouth\b|aperitivo/i.test(text)) category = 'Aperitivo';

  // 5. Deep Visual Profile & Ingredient Layers
  const visualProfile = computeVisualProfile(name, text, category);
  const extractedIngredients = extractIngredientLayers(text);

  // 6. Image Resolution
  // 6a. Check local database with strict match
  const localMatch = findInLocalDatabase(name);
  if (localMatch?.imageUrl) {
    return {
      isElaborating: true,
      name: localMatch.name,
      category: localMatch.category,
      glass,
      garnish,
      imageUrl: localMatch.imageUrl,
      source: 'database',
      visualProfile,
      extractedIngredients
    };
  }

  // 6b. Search TheCocktailDB (only if classic name)
  const onlineImage = await searchTheCocktailDB(name);
  if (onlineImage) {
    return {
      isElaborating: true,
      name,
      category,
      glass,
      garnish,
      imageUrl: onlineImage,
      source: 'cocktaildb',
      visualProfile,
      extractedIngredients
    };
  }

  // 6c. AI-invented or custom cocktail:
  // Match faithfully using computed visual profile (color, spirit, foam, garnish)
  const bespokeImageUrl = getArchetypeImage(visualProfile.archetypeId);

  return {
    isElaborating: true,
    name,
    category,
    glass,
    garnish,
    imageUrl: bespokeImageUrl,
    source: 'ai_profile',
    visualProfile,
    extractedIngredients
  };
}
