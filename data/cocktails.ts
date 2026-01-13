import { Cocktail } from '../types';

// Colección curada de cocteles.
// FUENTE DE IMÁGENES: TheCocktailDB (Enlaces directos verificados).
// Garantiza que la imagen corresponda exactamente a la bebida.
export const COCKTAILS: Cocktail[] = [
  // --- RON ---
  {
    id: 'r1',
    name: 'Mojito Clásico',
    category: 'Ron',
    description: 'El rey de la frescura cubana. Un equilibrio perfecto entre acidez, dulzor y menta.',
    ingredients: [
      { name: 'Ron Blanco', amount: '60ml' },
      { name: 'Jugo de Lima', amount: '30ml' },
      { name: 'Azúcar', amount: '2 cdtas' },
      { name: 'Menta', amount: '8 hojas' },
      { name: 'Soda', amount: 'Top' }
    ],
    instructions: [
      'Macerar suavemente la menta con el azúcar y la lima.',
      'Añadir ron y hielo picado.',
      'Completar con soda y remover.',
      'Decorar con menta fresca.'
    ],
    imageUrl: 'https://www.thecocktaildb.com/images/media/drink/3z6xdi1589574603.jpg',
    difficulty: 'Medio'
  },
  {
    id: 'r2',
    name: 'Daiquiri Clásico',
    category: 'Ron',
    description: 'La trinidad sagrada: Ron, cítrico y endulzante. Sin fresas, solo pureza.',
    ingredients: [
      { name: 'Ron Blanco', amount: '60ml' },
      { name: 'Jugo de Lima', amount: '30ml' },
      { name: 'Jarabe Simple', amount: '22ml' }
    ],
    instructions: [
      'Agitar todos los ingredientes con hielo.',
      'Colar doblemente en copa coupé fría.',
      'Sin decoración, la belleza está en el líquido.'
    ],
    imageUrl: 'https://www.thecocktaildb.com/images/media/drink/mrz9091589574515.jpg',
    difficulty: 'Fácil'
  },
  {
    id: 'r3',
    name: 'Piña Colada',
    category: 'Ron',
    description: 'El clásico tropical de Puerto Rico. Cremoso y dulce.',
    ingredients: [
      { name: 'Ron Blanco', amount: '60ml' },
      { name: 'Crema de Coco', amount: '60ml' },
      { name: 'Jugo de Piña', amount: '120ml' },
      { name: 'Piña Fresca', amount: 'Trozos' }
    ],
    instructions: [
      'Licuar todos los ingredientes con hielo hasta obtener textura frappé.',
      'Servir en copa huracán.',
      'Decorar con un triángulo de piña.'
    ],
    imageUrl: 'https://www.thecocktaildb.com/images/media/drink/cpf4j51504371346.jpg',
    difficulty: 'Fácil'
  },
  {
    id: 'r4',
    name: 'Cuba Libre',
    category: 'Ron',
    description: 'Más que un ron con cola. La clave es el limón fresco y un ron añejo decente.',
    ingredients: [
      { name: 'Ron Añejo', amount: '50ml' },
      { name: 'Cola', amount: '120ml' },
      { name: 'Lima', amount: 'Media unidad' }
    ],
    instructions: [
      'Llenar un vaso alto con mucho hielo.',
      'Exprimir la lima sobre el hielo y dejar caer la cáscara dentro.',
      'Añadir el ron y completar con cola.'
    ],
    imageUrl: 'https://www.thecocktaildb.com/images/media/drink/ck6d0p1504388696.jpg',
    difficulty: 'Fácil'
  },

  // --- WHISKY ---
  {
    id: 'w1',
    name: 'Old Fashioned',
    category: 'Whisky',
    description: 'El cóctel original. Una lección de paciencia y respeto por el destilado.',
    ingredients: [
      { name: 'Bourbon/Rye', amount: '60ml' },
      { name: 'Azúcar', amount: '1 terrón' },
      { name: 'Angostura', amount: '3 dashes' },
      { name: 'Agua', amount: 'Splash' }
    ],
    instructions: [
      'Disolver azúcar con amargos y agua.',
      'Añadir hielo cubo grande y whisky.',
      'Remover para diluir y enfriar.',
      'Perfumar con piel de naranja.'
    ],
    imageUrl: 'https://www.thecocktaildb.com/images/media/drink/vrwquq1478252802.jpg',
    difficulty: 'Experto'
  },
  {
    id: 'w2',
    name: 'Whisky Sour',
    category: 'Whisky',
    description: 'Cremosidad sedosa y carácter. La clara de huevo es esencial para la textura.',
    ingredients: [
      { name: 'Bourbon', amount: '60ml' },
      { name: 'Jugo Limón', amount: '30ml' },
      { name: 'Jarabe', amount: '22ml' },
      { name: 'Clara Huevo', amount: '15ml' }
    ],
    instructions: [
      'Dry Shake (agitar sin hielo) para emulsionar la clara.',
      'Shake vigoroso con hielo.',
      'Colar sobre vaso bajo con hielo nuevo.',
      'Decorar con gotas de amargo.'
    ],
    imageUrl: 'https://www.thecocktaildb.com/images/media/drink/hbkfsh1589574990.jpg',
    difficulty: 'Medio'
  },
  {
    id: 'w3',
    name: 'Mint Julep',
    category: 'Whisky',
    description: 'El ícono del Kentucky Derby. Hielo picado y mucha menta refrescante.',
    ingredients: [
      { name: 'Bourbon', amount: '60ml' },
      { name: 'Menta Fresca', amount: '10 hojas' },
      { name: 'Azúcar', amount: '1 cdta' }
    ],
    instructions: [
      'Macerar menta y azúcar suavemente en vaso julep (metal).',
      'Llenar con hielo picado hasta el tope.',
      'Verter bourbon y remover hasta que el vaso se congele por fuera.'
    ],
    imageUrl: 'https://www.thecocktaildb.com/images/media/drink/squyyq1439907312.jpg',
    difficulty: 'Medio'
  },
  {
    id: 'w4',
    name: 'Boulevardier',
    category: 'Whisky',
    description: 'El primo sofisticado del Negroni, sustituyendo la ginebra por whisky.',
    ingredients: [
      { name: 'Bourbon/Rye', amount: '45ml' },
      { name: 'Campari', amount: '30ml' },
      { name: 'Vermouth Rosso', amount: '30ml' }
    ],
    instructions: [
      'Verter ingredientes en vaso mezclador con hielo.',
      'Remover hasta enfriar perfectamente.',
      'Colar en copa o vaso bajo con hielo.',
      'Piel de naranja.'
    ],
    imageUrl: 'https://www.thecocktaildb.com/images/media/drink/km84qi1513705868.jpg',
    difficulty: 'Fácil'
  },

  // --- GINEBRA ---
  {
    id: 'g1',
    name: 'Negroni',
    category: 'Ginebra',
    description: 'Amargo, dulce y botánico. El aperitivo por excelencia.',
    ingredients: [
      { name: 'Gin Dry', amount: '30ml' },
      { name: 'Campari', amount: '30ml' },
      { name: 'Vermouth Rosso', amount: '30ml' }
    ],
    instructions: [
      'Construir en vaso bajo con hielo.',
      'Remover suavemente.',
      'Piel de naranja.'
    ],
    imageUrl: 'https://www.thecocktaildb.com/images/media/drink/qgdu971561574065.jpg',
    difficulty: 'Fácil'
  },
  {
    id: 'g2',
    name: 'Gin Tonic',
    category: 'Ginebra',
    description: 'Clásico refrescante. La clave es una tónica de calidad.',
    ingredients: [
      { name: 'Gin Premium', amount: '60ml' },
      { name: 'Tónica', amount: 'Top' },
      { name: 'Lima', amount: 'Rodaja' }
    ],
    instructions: [
      'Copa balón con mucho hielo.',
      'Verter gin y tónica suavemente.',
      'Decorar con lima.'
    ],
    imageUrl: 'https://www.thecocktaildb.com/images/media/drink/z0omyp1582480573.jpg',
    difficulty: 'Fácil'
  },
  {
    id: 'g3',
    name: 'Dry Martini',
    category: 'Ginebra',
    description: 'Elegancia pura. Gin frío, vermouth susurrado.',
    ingredients: [
      { name: 'Gin London Dry', amount: '75ml' },
      { name: 'Vermouth Seco', amount: '15ml' },
      { name: 'Aceituna/Limón', amount: 'Decoración' }
    ],
    instructions: [
      'Enfriar copa martini.',
      'Remover ingredientes en vaso mezclador con hielo (nunca agitar).',
      'Colar y decorar.'
    ],
    imageUrl: 'https://www.thecocktaildb.com/images/media/drink/71t8581504353095.jpg',
    difficulty: 'Experto'
  },
  {
    id: 'g4',
    name: 'Tom Collins',
    category: 'Ginebra',
    description: 'Una limonada para adultos. Refrescante y alto.',
    ingredients: [
      { name: 'Gin Old Tom', amount: '60ml' },
      { name: 'Jugo Limón', amount: '30ml' },
      { name: 'Jarabe', amount: '22ml' },
      { name: 'Soda', amount: 'Top' }
    ],
    instructions: [
      'Agitar gin, limón y jarabe con hielo.',
      'Colar en vaso alto con hielo nuevo.',
      'Completar con soda.',
      'Rodaja de limón y cereza.'
    ],
    imageUrl: 'https://www.thecocktaildb.com/images/media/drink/7cll921606854636.jpg',
    difficulty: 'Fácil'
  },

  // --- TEQUILA ---
  {
    id: 't1',
    name: 'Margarita',
    category: 'Tequila',
    description: 'Equilibrio cítrico perfecto.',
    ingredients: [
      { name: 'Tequila Blanco', amount: '60ml' },
      { name: 'Cointreau', amount: '30ml' },
      { name: 'Jugo Lima', amount: '30ml' },
      { name: 'Sal', amount: 'Borde' }
    ],
    instructions: [
      'Escarchar borde con sal.',
      'Agitar vigorosamente con hielo.',
      'Colar en copa.'
    ],
    imageUrl: 'https://www.thecocktaildb.com/images/media/drink/wpxpvu1439905379.jpg',
    difficulty: 'Medio'
  },
  {
    id: 't2',
    name: 'Paloma',
    category: 'Tequila',
    description: 'El favorito de México. Toronja y tequila.',
    ingredients: [
      { name: 'Tequila Reposado', amount: '60ml' },
      { name: 'Lima', amount: '15ml' },
      { name: 'Refresco Toronja', amount: 'Top' },
      { name: 'Sal', amount: 'Pizca' }
    ],
    instructions: [
      'Vaso alto con hielo y borde de sal.',
      'Añadir tequila y lima.',
      'Top de refresco de toronja.'
    ],
    imageUrl: 'https://www.thecocktaildb.com/images/media/drink/s00d6f1504883945.jpg',
    difficulty: 'Fácil'
  },
  {
    id: 't3',
    name: 'Tequila Sunrise',
    category: 'Tequila',
    description: 'Un amanecer en el vaso. Visualmente impactante.',
    ingredients: [
      { name: 'Tequila Blanco', amount: '60ml' },
      { name: 'Jugo Naranja', amount: '120ml' },
      { name: 'Granadina', amount: '15ml' }
    ],
    instructions: [
      'Servir tequila y jugo de naranja en vaso alto con hielo.',
      'Verter granadina lentamente para que se asiente al fondo.',
      'No remover para mantener el efecto degradado.'
    ],
    imageUrl: 'https://www.thecocktaildb.com/images/media/drink/v0at4i1582478473.jpg',
    difficulty: 'Fácil'
  },
  {
    id: 't4',
    name: 'Tequila Slammer',
    category: 'Tequila',
    description: 'Una mezcla explosiva para los más atrevidos.',
    ingredients: [
      { name: 'Tequila Blanco', amount: '45ml' },
      { name: 'Ginger Ale', amount: '45ml' }
    ],
    instructions: [
      'Servir en vaso de chupito (shot).',
      'Tapar con la mano, golpear en la mesa y beber de golpe mientras burbujea.'
    ],
    imageUrl: 'https://www.thecocktaildb.com/images/media/drink/2bcase1504889637.jpg',
    difficulty: 'Fácil'
  },

  // --- BRANDY ---
  {
    id: 'c1',
    name: 'Sidecar',
    category: 'Brandy',
    description: 'Elegante, seco y cítrico desde París. El padre de muchos sours.',
    ingredients: [
      { name: 'Brandy/Cognac', amount: '60ml' },
      { name: 'Cointreau', amount: '30ml' },
      { name: 'Jugo Limón', amount: '30ml' }
    ],
    instructions: [
      'Borde de azúcar opcional en copa coupé.',
      'Agitar bien todos los ingredientes con hielo.',
      'Colar en la copa fría.'
    ],
    imageUrl: 'https://www.thecocktaildb.com/images/media/drink/ewjxui1504820428.jpg',
    difficulty: 'Medio'
  },
  {
    id: 'c2',
    name: 'Stinger',
    category: 'Brandy',
    description: 'Un digestivo clásico y refrescante. La menta corta la fuerza del brandy de forma elegante.',
    ingredients: [
      { name: 'Brandy', amount: '60ml' },
      { name: 'Crème de Menthe Blanca', amount: '22ml' }
    ],
    instructions: [
      'Verter ingredientes en vaso mezclador con hielo.',
      'Agitar o remover según preferencia (tradicionalmente agitado).',
      'Colar en una copa de cóctel fría o servir en las rocas.'
    ],
    imageUrl: 'https://www.thecocktaildb.com/images/media/drink/yqvvqs1475667388.jpg',
    difficulty: 'Medio'
  },
  {
    id: 'c3',
    name: 'Brandy Alexander',
    category: 'Brandy',
    description: 'Postre líquido. Rico, cremoso y decadente.',
    ingredients: [
      { name: 'Brandy', amount: '45ml' },
      { name: 'Crema de Cacao', amount: '30ml' },
      { name: 'Crema Leche', amount: '30ml' },
      { name: 'Nuez Moscada', amount: 'Pizca' }
    ],
    instructions: [
      'Agitar vigorosamente con hielo para generar textura.',
      'Colar en copa cocktail.',
      'Rallar nuez moscada fresca por encima.'
    ],
    imageUrl: 'https://www.thecocktaildb.com/images/media/drink/x894cs1504388670.jpg',
    difficulty: 'Fácil'
  },
  {
    id: 'c4',
    name: 'Horse\'s Neck',
    category: 'Brandy',
    description: 'Reconocible por su larga cáscara de limón. Especiado y refrescante.',
    ingredients: [
      { name: 'Brandy', amount: '60ml' },
      { name: 'Ginger Ale', amount: 'Top' },
      { name: 'Bitters', amount: '2 dashes' },
      { name: 'Cáscara de Limón', amount: 'Espiral larga' }
    ],
    instructions: [
      'Pelar una espiral larga de limón y colocarla en un vaso alto.',
      'Añadir hielo y el brandy.',
      'Completar con Ginger Ale y añadir los bitters.'
    ],
    imageUrl: 'https://www.thecocktaildb.com/images/media/drink/006k4e1504370092.jpg',
    difficulty: 'Fácil'
  },

  // --- VINO ---
  {
    id: 'v1',
    name: 'Sangría Española',
    category: 'Vino',
    description: 'Fiesta en una jarra. Fruta macerada y vino tinto.',
    ingredients: [
      { name: 'Vino Tinto', amount: '750ml' },
      { name: 'Brandy', amount: '60ml' },
      { name: 'Frutas', amount: 'Varias' },
      { name: 'Azúcar', amount: '2 cdas' }
    ],
    instructions: [
      'Macerar fruta con azúcar y brandy.',
      'Añadir vino y reposar 2h.',
      'Servir con hielo.'
    ],
    imageUrl: 'https://www.thecocktaildb.com/images/media/drink/xrvxpp1441249280.jpg',
    difficulty: 'Fácil'
  },
  {
    id: 'v2',
    name: 'New York Sour',
    category: 'Vino',
    description: 'Whisky Sour coronado con una capa de vino tinto.',
    ingredients: [
      { name: 'Bourbon', amount: '60ml' },
      { name: 'Limón/Jarabe', amount: '30/22ml' },
      { name: 'Vino Tinto', amount: '15ml' }
    ],
    instructions: [
      'Hacer Whisky Sour clásico.',
      'Flotar vino tinto suavemente usando una cuchara.',
      'Crear capa bicolor.'
    ],
    imageUrl: 'https://www.thecocktaildb.com/images/media/drink/61wgch1504882795.jpg',
    difficulty: 'Medio'
  },
  {
    id: 'v3',
    name: 'Mimosa',
    category: 'Vino',
    description: 'El clásico del brunch. Jugo de naranja y burbujas.',
    ingredients: [
      { name: 'Champagne', amount: '75ml' },
      { name: 'Jugo Naranja', amount: '75ml' }
    ],
    instructions: [
      'Asegúrate de que ambos ingredientes estén muy fríos.',
      'Servir el jugo en copa flauta.',
      'Completar con champagne suavemente.'
    ],
    imageUrl: 'https://www.thecocktaildb.com/images/media/drink/juhcuu1504370685.jpg',
    difficulty: 'Fácil'
  },
  {
    id: 'v4',
    name: 'Bellini',
    category: 'Vino',
    description: 'Inventado en Venecia. La dulzura del durazno con la elegancia del Prosecco.',
    ingredients: [
      { name: 'Prosecco', amount: '100ml' },
      { name: 'Puré de Durazno', amount: '50ml' }
    ],
    instructions: [
      'Verter el puré de durazno en una copa flauta.',
      'Añadir lentamente el Prosecco.',
      'Remover suavemente para integrar.'
    ],
    imageUrl: 'https://www.thecocktaildb.com/images/media/drink/eaag491504367543.jpg',
    difficulty: 'Fácil'
  },

  // --- CERVEZA ---
  {
    id: 'b1',
    name: 'Michelada',
    category: 'Cerveza',
    description: 'El remedio picante y salado definitivo.',
    ingredients: [
      { name: 'Cerveza Clara', amount: '355ml' },
      { name: 'Lima', amount: '30ml' },
      { name: 'Salsas', amount: 'Varias' },
      { name: 'Tajín', amount: 'Borde' }
    ],
    instructions: [
      'Escarchar vaso con Tajín.',
      'Hielo, lima y salsas al fondo.',
      'Cerveza poco a poco.'
    ],
    imageUrl: 'https://www.thecocktaildb.com/images/media/drink/u736bd1605907086.jpg',
    difficulty: 'Fácil'
  },
  {
    id: 'b2',
    name: 'Black Velvet',
    category: 'Cerveza',
    description: 'Terciopelo negro: Stout y Champagne.',
    ingredients: [
      { name: 'Stout (Guinness)', amount: 'Mitad' },
      { name: 'Champagne', amount: 'Mitad' }
    ],
    instructions: [
      'Llenar media copa con Stout.',
      'Completar con Champagne usando cuchara para no espumar.'
    ],
    imageUrl: 'https://www.thecocktaildb.com/images/media/drink/j9evx11504373665.jpg',
    difficulty: 'Medio'
  },
  {
    id: 'b3',
    name: 'Black & Tan',
    category: 'Cerveza',
    description: 'Un clásico visual de pub. Capas separadas de cerveza pálida y oscura.',
    ingredients: [
      { name: 'Pale Ale', amount: 'Mitad' },
      { name: 'Stout (Guinness)', amount: 'Mitad' }
    ],
    instructions: [
      'Llenar medio vaso de pinta con Pale Ale.',
      'Verter la Stout lentamente sobre el dorso de una cuchara para que flote sobre la Pale Ale.',
      'Servir inmediatamente.'
    ],
    imageUrl: 'https://www.thecocktaildb.com/images/media/drink/rwpswp1454511017.jpg',
    difficulty: 'Medio'
  },
  {
    id: 'b4',
    name: 'Shandy',
    category: 'Cerveza',
    description: 'Bajo alcohol, máxima frescura para el verano.',
    ingredients: [
      { name: 'Cerveza Lager', amount: 'Mitad' },
      { name: 'Limonada', amount: 'Mitad' },
      { name: 'Limón', amount: 'Rodaja' }
    ],
    instructions: [
      'Mezclar cerveza y limonada fría en un vaso alto.',
      'Servir con o sin hielo según preferencia.',
      'Decorar con limón.'
    ],
    imageUrl: 'https://www.thecocktaildb.com/images/media/drink/kvvd4z1485621283.jpg',
    difficulty: 'Fácil'
  }
];