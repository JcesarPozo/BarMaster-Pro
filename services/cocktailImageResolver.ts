import { COCKTAILS } from '../data/cocktails.ts';
import { DetectedCocktail } from '../types.ts';

const cocktailImageCache = new Map<string, string>();

function normalize(str: string): string {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

/**
 * Searches local curated database
 */
function findInLocalDatabase(cocktailName: string) {
  const norm = normalize(cocktailName);

  // Exact or substring match
  const exact = COCKTAILS.find(c => {
    const cNorm = normalize(c.name);
    return cNorm === norm || cNorm.includes(norm) || norm.includes(cNorm);
  });
  if (exact) return exact;

  // Keyword token match
  const ignored = new Set([
    'clasico', 'clasica', 'cubano', 'cubana', 'original', 'receta',
    'cocktail', 'coctel', 'de', 'del', 'el', 'la', 'un', 'una',
    'tradicional', 'perfecto', 'artesanal'
  ]);
  const words = norm.split(/\s+/).filter(w => !ignored.has(w) && w.length > 2);

  return COCKTAILS.find(c => {
    const cNorm = normalize(c.name);
    return words.some(w => cNorm.includes(w));
  });
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
 * Detects if the response is elaborating a cocktail recipe,
 * extracts cocktail attributes, and resolves or generates the image.
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

  // Look for bold name in the first paragraph: e.g. El **Daiquiri**, **"El Ocaso del Jaguar"** o **Beso Tropical**
  const boldNameMatch = text.slice(0, 450).match(/\*\*["'«“]?([A-ZÁÉÍÓÚ][^"*#]{2,32}?)["'»”]?\*\*/);
  if (boldNameMatch) {
    const candidate = boldNameMatch[1].replace(/["'«»“”:]/g, '').trim();
    if (!['Ingredientes', 'Preparación', 'Cristalería', 'Consejos', 'Historia', 'Paso'].some(w => candidate.startsWith(w))) {
      name = candidate;
    }
  }

  // Fallback to query extraction
  if (!name) {
    const cleanedQuery = query
      .replace(/(cómo hacer|como hacer|cómo preparar|como preparar|receta de|receta del|receta|preparar|hacer|elaborar)\s+/gi, '')
      .replace(/[?¿!¡]/g, '')
      .trim();

    if (cleanedQuery.length >= 3 && cleanedQuery.length <= 30) {
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

  // 3. Extract Garnish
  let garnish = 'Twist cítrico';
  const garnishMatch = text.match(/(decoraci[oó]n|garnish|adorno|presentaci[oó]n).*?:\s*([^\.\n]+)/i);
  if (garnishMatch && garnishMatch[2].length < 60) {
    garnish = garnishMatch[2].replace(/[*#_~`]/g, '').trim();
  } else if (/rueda de lima|rodaja de lima/i.test(text)) {
    garnish = 'Rueda de lima fresca';
  } else if (/twist de lim[oó]n|piel de lim[oó]n/i.test(text)) {
    garnish = 'Twist de piel de limón';
  } else if (/piel de naranja|twist de naranja/i.test(text)) {
    garnish = 'Twist de piel de naranja';
  } else if (/aceituna/i.test(text)) {
    garnish = 'Aceituna verde sevillana';
  } else if (/cereza|maraschino/i.test(text)) {
    garnish = 'Cereza al marrasquino';
  } else if (/menta|hierbabuena/i.test(text)) {
    garnish = 'Ramillete de hierbabuena fresca';
  }

  // 4. Extract Category / Primary Spirit
  let category = 'Coctelería Clásica';
  if (/ron\b|rum\b/i.test(text)) category = 'Ron';
  else if (/ginebra\b|gin\b/i.test(text)) category = 'Ginebra';
  else if (/tequila\b/i.test(text)) category = 'Tequila';
  else if (/mezcal\b/i.test(text)) category = 'Mezcal';
  else if (/whisky\b|whiskey\b|bourbon\b|rye\b/i.test(text)) category = 'Whisky';
  else if (/vodka\b/i.test(text)) category = 'Vodka';
  else if (/brandy\b|cognac\b/i.test(text)) category = 'Brandy';
  else if (/pisco\b/i.test(text)) category = 'Pisco';
  else if (/campari\b|aperol\b|vermouth\b|aperitivo/i.test(text)) category = 'Aperitivo';

  // 5. Image Resolution
  // 5a. Check local database
  const localMatch = findInLocalDatabase(name);
  if (localMatch?.imageUrl) {
    return {
      isElaborating: true,
      name: localMatch.name,
      category: localMatch.category,
      glass,
      garnish,
      imageUrl: localMatch.imageUrl,
      source: 'database'
    };
  }

  // 5b. Search TheCocktailDB
  const onlineImage = await searchTheCocktailDB(name);
  if (onlineImage) {
    return {
      isElaborating: true,
      name,
      category,
      glass,
      garnish,
      imageUrl: onlineImage,
      source: 'cocktaildb'
    };
  }

  // 5c. Custom or Signature cocktail: use generated bespoke crystal cocktail asset
  return {
    isElaborating: true,
    name,
    category,
    glass,
    garnish,
    imageUrl: '/assets/custom_cocktail_default.jpg',
    source: 'generated'
  };
}
