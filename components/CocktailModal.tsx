import React from 'react';
import { Cocktail } from '../types';
import { X, Droplet, ListOrdered, Wine, Clock, Sparkles } from 'lucide-react';

interface CocktailModalProps {
  cocktail: Cocktail;
  onClose: () => void;
}

export const CocktailModal: React.FC<CocktailModalProps> = ({ cocktail, onClose }) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const difficultyClass = 
    cocktail.difficulty === 'Fácil' ? 'text-emerald-400' :
    cocktail.difficulty === 'Medio' ? 'text-amber-400' :
    'text-rose-400';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="bg-slate-900 w-full max-w-4xl rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Left Column: Atmospheric Image Frame */}
        <div className="w-full md:w-5/12 h-64 md:h-auto relative bg-slate-950">
          <img 
            src={cocktail.imageUrl} 
            alt={cocktail.name} 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 md:hidden bg-black/70 p-2 rounded-full text-white backdrop-blur-md transition-colors"
            title="Cerrar modal"
          >
            <X size={18} />
          </button>

          <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 backdrop-blur-md p-3 rounded-xl border border-white/10 hidden md:block text-xs text-slate-300">
            <p className="font-semibold text-amber-300 flex items-center gap-1.5 mb-0.5">
              <Sparkles size={12} />
              <span>Regla de Oro Mixológica</span>
            </p>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Enfría la cristalería con antelación y respeta las medidas para el balance alquímico perfecto.
            </p>
          </div>
        </div>

        {/* Right Column: Recipe Details */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto bg-slate-900 relative space-y-6">
          <button 
            onClick={onClose}
            className="hidden md:block absolute top-6 right-6 text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
            title="Cerrar receta"
          >
            <X size={20} />
          </button>

          {/* Header & Clean Unboxed Metadata */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-2">
              <span className="text-amber-400">{cocktail.category}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className={difficultyClass}>Dificultad {cocktail.difficulty}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-300">Fórmula Clásica</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-3">
              {cocktail.name}
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed border-l-2 border-amber-500/60 pl-3.5 italic bg-slate-950/40 py-1 rounded-r-lg">
              "{cocktail.description}"
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 pt-2">
            {/* Ingredients */}
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 pb-2 border-b border-slate-800">
                <Droplet size={14} className="text-amber-400" />
                <span>Ingredientes & Medidas</span>
              </h3>
              <ul className="space-y-2.5">
                {cocktail.ingredients.map((ing, idx) => (
                  <li key={idx} className="flex justify-between items-center text-xs sm:text-sm p-2 rounded-lg bg-slate-950/50 border border-slate-800/80">
                    <span className="text-slate-200 font-medium">{ing.name}</span>
                    <span className="font-mono text-amber-300 text-xs font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {ing.amount}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Preparation Steps */}
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 pb-2 border-b border-slate-800">
                <ListOrdered size={14} className="text-emerald-400" />
                <span>Paso a Paso</span>
              </h3>
              <ol className="space-y-3">
                {cocktail.instructions.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-emerald-500/30">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
