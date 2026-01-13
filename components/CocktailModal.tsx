import React from 'react';
import { Cocktail } from '../types';
import { X, Droplet, ListOrdered, Clock, BarChart } from 'lucide-react';

interface CocktailModalProps {
  cocktail: Cocktail;
  onClose: () => void;
}

export const CocktailModal: React.FC<CocktailModalProps> = ({ cocktail, onClose }) => {
  // Cierra el modal si se hace clic fuera del contenido
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="bg-slate-900 w-full max-w-4xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Columna de Imagen (Izquierda en desktop, Arriba en móvil) */}
        <div className="w-full md:w-2/5 h-48 md:h-auto relative">
          <img 
            src={cocktail.imageUrl} 
            alt={cocktail.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 md:bg-gradient-to-r via-transparent to-transparent opacity-60 md:opacity-40" />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 md:hidden bg-black/50 p-2 rounded-full text-white backdrop-blur-md"
          >
            <X size={20} />
          </button>
        </div>

        {/* Columna de Contenido */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-900 relative">
          <button 
            onClick={onClose}
            className="hidden md:block absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          {/* Encabezado */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
                {cocktail.category}
              </span>
              <span className={`
                px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border
                ${cocktail.difficulty === 'Fácil' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                  cocktail.difficulty === 'Medio' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                  'bg-red-500/10 text-red-400 border-red-500/20'}
              `}>
                {cocktail.difficulty}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-100 mb-2">
              {cocktail.name}
            </h2>
            <p className="text-slate-400 text-sm italic leading-relaxed border-l-2 border-slate-700 pl-3">
              "{cocktail.description}"
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Ingredientes */}
            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-200 mb-4 pb-2 border-b border-slate-800">
                <Droplet size={16} className="text-amber-500" />
                Ingredientes
              </h3>
              <ul className="space-y-3">
                {cocktail.ingredients.map((ing, idx) => (
                  <li key={idx} className="flex justify-between items-center text-sm group">
                    <span className="text-slate-300 group-hover:text-amber-100 transition-colors">{ing.name}</span>
                    <span className="font-mono text-amber-500/80 text-xs bg-amber-500/10 px-2 py-1 rounded">
                      {ing.amount}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instrucciones */}
            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-200 mb-4 pb-2 border-b border-slate-800">
                <ListOrdered size={16} className="text-amber-500" />
                Preparación
              </h3>
              <ol className="space-y-4 relative border-l border-slate-800 ml-1.5">
                {cocktail.instructions.map((step, idx) => (
                  <li key={idx} className="pl-6 relative">
                    <span className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-slate-800 border-2 border-amber-500/50"></span>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-800 text-center md:text-left">
            <p className="text-xs text-slate-600 font-medium">
              Consejo de BarMaster: Sirve siempre en cristalería fría para mantener la temperatura ideal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};