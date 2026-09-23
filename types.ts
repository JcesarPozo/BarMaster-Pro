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

export interface DetectedCocktail {
  isElaborating: boolean;
  name: string;
  category?: string;
  glass?: string;
  garnish?: string;
  imageUrl?: string;
  source?: 'database' | 'cocktaildb' | 'generated' | 'curated';
}

export interface SearchResult {
  text: string;
  sources: { title: string; uri: string }[];
  cocktail?: DetectedCocktail | null;
  cached?: boolean;
}
