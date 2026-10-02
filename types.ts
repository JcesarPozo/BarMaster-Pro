export type CocktailCategory = 'Ron' | 'Whisky' | 'Ginebra' | 'Tequila' | 'Brandy' | 'Vino' | 'Cerveza' | 'Todos';

export interface Ingredient {
  name: string;
  amount: string;
}

export interface Cocktail {
  id: string;
  name: string;
  category: CocktailCategory;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  imageUrl: string;
  difficulty: 'Fácil' | 'Medio' | 'Experto';
}

export interface CocktailVisualProfile {
  archetypeId: 'espresso' | 'ruby' | 'emerald' | 'cyan' | 'amber' | 'sunset' | 'creamy' | 'clear';
  primaryColor: string;
  secondaryColor: string;
  liquidName: string;
  isCreamy?: boolean;
  hasFoam?: boolean;
  hasBubbles?: boolean;
  iceStyle?: string;
  technique?: string;
}

export interface ExtractedIngredientLayer {
  name: string;
  amount?: string;
  color: string;
  percentage?: number;
}

export interface DetectedCocktail {
  isElaborating: boolean;
  name: string;
  category?: string;
  glass?: string;
  garnish?: string;
  imageUrl?: string;
  source?: 'database' | 'cocktaildb' | 'generated' | 'curated' | 'ai_profile';
  visualProfile?: CocktailVisualProfile;
  extractedIngredients?: ExtractedIngredientLayer[];
}

export interface SearchResult {
  text: string;
  sources: { title: string; uri: string }[];
  cocktail?: DetectedCocktail | null;
  cached?: boolean;
}
