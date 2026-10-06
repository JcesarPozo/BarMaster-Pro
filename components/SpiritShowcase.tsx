import React from 'react';
import { CocktailCategory } from '../types';
import { 
  Sparkles, 
  Wine, 
  Beer, 
  Martini, 
  Flame, 
  Droplet, 
  GlassWater 
} from 'lucide-react';

interface SpiritItem {
  id: CocktailCategory;
  name: string;
  subtitle: string;
  notes: string;
  icon: React.ReactNode;
}

const SPIRIT_ITEMS: SpiritItem[] = [
  {
    id: 'Todos',
    name: 'Barra Completa',
    subtitle: 'Colección General',
    notes: 'Todas las recetas',
    icon: <Sparkles size={20} className="text-amber-400" />
  },
  {
    id: 'Ron',
    name: 'Ron',
    subtitle: 'Caña & Caribe',
    notes: 'Dulzor, cítrico y menta',
    icon: <Droplet size={20} className="text-amber-500" />
  },
  {
    id: 'Whisky',
    name: 'Whisky & Bourbon',
    subtitle: 'Roble & Malta',
    notes: 'Caramelo, turba y ahumado',
    icon: <GlassWater size={20} className="text-amber-600" />
  },
  {
    id: 'Ginebra',
    name: 'Ginebra',
    subtitle: 'Enebro & Botánicos',
    notes: 'Herbal, seco y cítrico',
    icon: <Martini size={20} className="text-cyan-400" />
  },
  {
    id: 'Tequila',
    name: 'Tequila & Mezcal',
    subtitle: 'Agave Azul',
    notes: 'Tierra, sal y fuego',
    icon: <Flame size={20} className="text-orange-500" />
  },
  {
    id: 'Brandy',
    name: 'Brandy & Cognac',
    subtitle: 'Uva & Barrica',
    notes: 'Fruta madura y calidez',
    icon: <Wine size={20} className="text-amber-400" />
  },
  {
    id: 'Vino',
    name: 'Aperitivos & Vino',
    subtitle: 'Vermouth & Spritz',
    notes: 'Amargor noble y frescura',
    icon: <Wine size={20} className="text-rose-400" />
  },
  {
    id: 'Cerveza',
    name: 'Cerveza & Malta',
    subtitle: 'Lúpulo Artesanal',
    notes: 'Espuma y efervescencia',
    icon: <Beer size={20} className="text-amber-300" />
  },
];

interface SpiritShowcaseProps {
  selectedCategory: CocktailCategory;
  onSelectCategory: (category: CocktailCategory) => void;
  categoryCounts: Record<string, number>;
}

export const SpiritShowcase: React.FC<SpiritShowcaseProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts
}) => {
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-500 mb-1">
            Exploración por Familia de Destilados
          </p>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100">
            Selecciona tu Licor Base
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          Haz clic para filtrar instantáneamente el catálogo de recetas
        </p>
      </div>

      {/* Horizontal Carousel / Grid */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar snap-x">
        {SPIRIT_ITEMS.map((spirit) => {
          const isSelected = selectedCategory === spirit.id;
          const count = spirit.id === 'Todos' 
            ? Object.values(categoryCounts).reduce((a: number, b: number) => a + b, 0)
            : categoryCounts[spirit.id] || 0;

          return (
            <button
              key={spirit.id}
              onClick={() => onSelectCategory(spirit.id)}
              className={`
                shrink-0 snap-start text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer w-44 sm:w-48 group
                ${isSelected 
                  ? 'bg-gradient-to-b from-amber-500/20 to-amber-950/20 border-amber-500/60 shadow-lg shadow-amber-500/10 -translate-y-0.5' 
                  : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800/80 hover:border-slate-700 text-slate-300'}
              `}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg transition-transform group-hover:scale-110 ${isSelected ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
                  {spirit.icon}
                </div>
                <span className={`text-xs font-mono font-medium px-2 py-0.5 rounded-full ${isSelected ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                  {count}
                </span>
              </div>

              <h4 className={`text-sm font-serif font-bold mb-0.5 transition-colors ${isSelected ? 'text-amber-300' : 'text-slate-100 group-hover:text-amber-200'}`}>
                {spirit.name}
              </h4>
              <p className="text-[11px] text-slate-400 truncate">
                {spirit.subtitle}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
