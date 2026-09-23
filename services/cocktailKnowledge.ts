import { COCKTAILS } from '../data/cocktails';

interface CuratedTopic {
  keywords: string[];
  response: string;
}

const SPECIAL_TOPICS: CuratedTopic[] = [
  {
    keywords: ['tequila', 'mezcal', 'diferencia'],
    response: `El tequila y el mezcal son hermanos de sangre con personalidades radicalmente diferentes:

### Ingredientes y Proporciones
* Destilado Base: Ambos provienen del corazón (piña) de la planta del agave.
* Variedad de Agave: El tequila solo puede elaborarse con Agave Tequilana Weber (Agave Azul). El mezcal puede usar más de 30 especies de agave (siendo Espadín el más común, además de Tobalá, Arroqueño o Tepeztate).
* Denominación de Origen: El tequila se produce principalmente en Jalisco (y zonas de Guanajuato, Michoacán, Nayarit y Tamaulipas). El mezcal se produce primordialmente en Oaxaca (y otros estados autorizados como Guerrero, Durango y Puebla).

### Cristalería y Hielo
* Cristalería para cata: Copa flauta para tequila o vaso veladora / jícara tradicional de barro para mezcal.
* Temperatura: Siempre a temperatura ambiente para no adormecer los aromas.

### Preparación Paso a Paso
1. Observación: Analiza el cuerpo y las lágrimas en la copa.
2. Nariz: Acerca la copa sin inhalar bruscamente; busca notas cítricas y herbáceas en el tequila, y notas ahumadas, minerales y terrosas en el mezcal.
3. El primer sorbo: Da un pequeño sorbo ("a besitos"), distribuye por todo el paladar y exhala suavemente.

### Consejos del Maestro
* Cocción del agave: La gran diferencia organoléptica proviene de la cocción. El mezcal hornea sus piñas en fosas cónicas bajo tierra con leña y piedras volcánicas, otorgándole ese toque ahumado inconfundible. El tequila las cuece en autoclaves u hornos de mampostería al vapor, preservando un perfil más limpio y fresco.
* Nunca con sal y limón de baja calidad: Los destilados 100% de agave se degustan puros para apreciar su complejidad artesanal.`
  },
  {
    keywords: ['martini', 'dry martini'],
    response: `El Dry Martini es la máxima expresión de sobriedad y elegancia en la coctelería clásica.

### Ingredientes y Proporciones
* Ginebra London Dry: 60 ml (2 oz) – Se requiere un perfil botánico clásico con enebro prominente (como Tanqueray o Beefeater).
* Vermouth Seco (Dry Vermouth): 10 ml a 15 ml (según cuán "dry" lo prefieras).
* Bitter de Naranja: 1 golpe opcional para redondear notas cítricas.

### Cristalería y Hielo
* Cristalería: Copa Cóctel o Nick & Nora, previamente congelada a -18°C.
* Hielo: Bloques o cubos grandes de hielo macizo en el vaso mezclador.

### Preparación Paso a Paso
1. Enfriar el vaso mezclador: Añade hielo al vaso mezclador para atemperarlo y desecha el agua residual.
2. Verter los destilados: Añade el vermouth seco, la ginebra y el dash de bitter.
3. Refrescado (Stirring): Con la cuchara imperial de bar, remueve suave y fluidamente durante 25 a 30 segundos sin romper el hielo ni generar burbujas.
4. Colado: Vierte usando el colador Julep en la copa helada.
5. Garnish: Exprime suavemente los aceites de un twist de piel de limón sobre la superficie o adorna con una aceituna verde de calidad pinchada en brocheta.

### Consejos del Maestro
* La regla de oro: El Dry Martini nunca se agita en coctelera (salvo que seas James Bond). El refrescado preserva una textura sedosa, cristalina y sin enturbiar el líquido.`
  },
  {
    keywords: ['negroni'],
    response: `El Negroni es el aperitivo por excelencia, un monumento al balance entre amargor, dulzor y botánicos.

### Ingredientes y Proporciones
* Ginebra London Dry: 30 ml (1 oz)
* Campari (Bitter rojo italiano): 30 ml (1 oz)
* Vermouth Rojo Dulce (Rosso): 30 ml (1 oz)

### Cristalería y Hielo
* Cristalería: Vaso bajo tipo Old Fashioned / Rocks.
* Hielo: Un solo cubo grande o esfera de hielo transparente para una dilución lenta y elegante.

### Preparación Paso a Paso
1. Preparar el vaso: Coloca el cubo de hielo en el vaso Old Fashioned.
2. Añadir en partes iguales: Vierte los 30 ml de ginebra, 30 ml de Campari y 30 ml de vermouth dulce.
3. Integrar: Remueve suavemente con la cuchara de bar durante 15 a 20 segundos para integrar y refrescar.
4. Perfumar: Corta una rodaja o media luna de naranja fresca (o un twist de piel de naranja) y aromatiza el borde de la copa antes de depositarlo.

### Consejos del Maestro
* Calidad del vermouth: Conserva siempre tu vermouth en el refrigerador tras abrirlo; al ser un vino fortificado, se oxida con facilidad perdiendo su riqueza aromática.`
  }
];

export function getCuratedCocktailResponse(query: string): string | null {
  const normalized = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // 1. Check special curated topics
  for (const topic of SPECIAL_TOPICS) {
    const match = topic.keywords.every(kw => normalized.includes(kw));
    if (match) {
      return topic.response;
    }
  }

  // 2. Check in COCKTAILS collection
  const found = COCKTAILS.find(c => {
    const nameNorm = c.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return normalized.includes(nameNorm) || nameNorm.includes(normalized);
  });

  if (found) {
    const ingredientsFormatted = found.ingredients
      .map(i => `* ${i.name}: ${i.amount}`)
      .join('\n');

    const stepsFormatted = found.instructions
      .map((step, idx) => `${idx + 1}. **Paso ${idx + 1}:** ${step}`)
      .join('\n');

    const glasswareText = found.category === 'Whisky' ? 'Vaso tipo Rocks / Old Fashioned con hielo macizo' :
      found.category === 'Ginebra' ? 'Copa Cóctel, Copa Balón o Nick & Nora' :
      found.category === 'Tequila' ? 'Vaso Highball o copa Cóctel escarchada' :
      'Copa Coupé o Highball con hielo abundante';

    return `El **${found.name}** es una joya de nuestra carta de ${found.category}. ${found.description}

### Ingredientes y Proporciones
${ingredientsFormatted}

### Cristalería y Hielo
* Cristalería: ${glasswareText}.
* Temperatura: Servir siempre a temperatura adecuada para realzar su perfil organoléptico.

### Preparación Paso a Paso
${stepsFormatted}

### Consejos del Maestro
* Selección de insumos: En cócteles como el ${found.name}, la pureza y frescura de los ingredientes marcan la diferencia entre un trago ordinario y una obra de arte.
* Técnica: Cuida la dilución justa según si la receta exige batido vigoroso en coctelera o refrescado suave en vaso mezclador.`;
  }

  return null;
}
