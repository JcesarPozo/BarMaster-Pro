import React, { useState } from 'react';
import { Cocktail } from '../types';
import { ExternalLink, Martini, Sparkles } from 'lucide-react';

interface CocktailCardProps {
  cocktail: Cocktail;
  onClick: () => void;
}

export const CocktailCard: React.FC<CocktailCardProps> = ({ cocktail, onClick }) => {
  const [imgError, setImgError] = useState(false);

  // Difficulty color tint for subtle text indicator
  const difficultyLabel = cocktail.difficulty;
  const difficultyClass = 
    difficultyLabel === 'Fácil' ? 'text-emerald-400' :
    difficultyLabel === 'Medio' ? 'text-amber-400' :
    'text-rose-400';

  return (
    <article 
      onClick={onClick}
      className="group bg-slate-900/90 rounded-2xl overflow-hidden border border-slate-800/90 hover:border-amber-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-black/60 hover:-translate-y-1 flex flex-col h-full cursor-pointer relative"
    >
      {/* Image Container with Ambient Scrim */}
      <div className="relative h-52 sm:h-56 overflow-hidden bg-slate-950">
        {!imgError ? (
          <img 
            src={cocktail.imageUrl} 
            alt={cocktail.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 relative p-4">
            <div className="border border-slate-700/80 rounded-full p-5 mb-2 bg-slate-950/60">
              <Martini size={28} className="text-amber-400/80" />
            </div>
            <span className="text-[11px] font-serif tracking-wider text-slate-400">Receta de la Barra</span>
          </div>
        )}
        
        {/* Measured dark gradient scrim for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-80" />
        
        {/* Subtle category and difficulty metadata over photo - Zero-Pill discipline */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-slate-300 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
          <span>{cocktail.category}</span>
          <span aria-hidden="true" className="text-slate-500">·</span>
          <span className={difficultyClass}>{difficultyLabel}</span>
        </div>

        {/* Hover action affordance */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
          <span className="bg-amber-500 text-slate-950 text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-lg">
            Ver Fórmula <ExternalLink size={11} />
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-serif text-xl font-bold text-slate-100 mb-1.5 group-hover:text-amber-300 transition-colors leading-snug">
            {cocktail.name}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed font-sans">
            {cocktail.description}
          </p>
        </div>

        {/* Unboxed Ingredients Preview */}
        <div className="pt-3 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-2">
            <Sparkles size={11} className="text-amber-400" />
            <span>Composición</span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed line-clamp-1">
            {cocktail.ingredients.map(ing => ing.name).join(' · ')}
          </p>
        </div>
      </div>
    </article>
  );
};
