import React, { useState } from 'react';
import { Cocktail } from '../types';
import { Droplet, ExternalLink, Martini } from 'lucide-react';

interface CocktailCardProps {
  cocktail: Cocktail;
  onClick: () => void;
}

export const CocktailCard: React.FC<CocktailCardProps> = ({ cocktail, onClick }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div 
      onClick={onClick}
      className="group bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-amber-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 flex flex-col h-full cursor-pointer relative"
    >
      {/* Image Container with Overlay */}
      <div className="relative h-48 overflow-hidden bg-slate-800">
        {!imgError ? (
          <img 
            src={cocktail.imageUrl} 
            alt={cocktail.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 relative p-4">
             {/* Fallback estilo 'Blueprint' */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:8px_8px]"></div>
            <div className="border-2 border-slate-700 border-dashed rounded-full p-6 mb-2">
               <Martini size={32} className="text-slate-600" />
            </div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Receta Confidencial</span>
            <div className="absolute bottom-2 right-2 text-[8px] text-slate-700 font-mono">REF: {cocktail.id.toUpperCase()}</div>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
        
        {/* View Recipe Badge */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
          <span className="bg-black/60 backdrop-blur-md text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            Ver Receta <ExternalLink size={10} />
          </span>
        </div>

        <div className="absolute bottom-3 left-3">
          <span className={`
            px-2 py-1 text-[10px] uppercase tracking-wider font-bold rounded-sm
            ${cocktail.difficulty === 'Fácil' ? 'bg-green-500/20 text-green-400' : 
              cocktail.difficulty === 'Medio' ? 'bg-yellow-500/20 text-yellow-400' : 
              'bg-red-500/20 text-red-400'}
          `}>
            {cocktail.difficulty}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="font-serif text-xl font-bold text-slate-100 mb-1 group-hover:text-amber-500 transition-colors">
            {cocktail.name}
          </h3>
          <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
            {cocktail.description}
          </p>
        </div>

        {/* Ingredients Preview */}
        <div className="mt-auto pt-4 border-t border-slate-800/50">
          <div className="flex items-center gap-2 mb-2 text-xs text-slate-500 font-semibold uppercase tracking-wider">
            <Droplet size={12} />
            <span>Ingredientes Clave</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {cocktail.ingredients.slice(0, 3).map((ing, idx) => (
              <span key={idx} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">
                {ing.name}
              </span>
            ))}
            {cocktail.ingredients.length > 3 && (
              <span className="text-xs text-slate-500 px-1 py-1">+{cocktail.ingredients.length - 3}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};