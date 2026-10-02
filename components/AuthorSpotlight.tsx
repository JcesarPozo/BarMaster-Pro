import React from 'react';
import { Sparkles, Wine, GlassWater, Flame, Compass, ChevronRight } from 'lucide-react';
import { Cocktail } from '../types';

interface AuthorSpotlightProps {
  cocktail: Cocktail;
  onSelectCocktail: (cocktail: Cocktail) => void;
  onOpenAIBartender: () => void;
}

export const AuthorSpotlight: React.FC<AuthorSpotlightProps> = ({
  cocktail,
  onSelectCocktail,
  onOpenAIBartender
}) => {
  return (
    <section id="autor" className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-2xl p-6 sm:p-10 my-10">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Visual Showcase */}
        <div className="lg:col-span-5 relative group overflow-hidden rounded-2xl bg-black">
          <img 
            src={cocktail.imageUrl} 
            alt={cocktail.name} 
            className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
          
          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-amber-400/40 text-[11px] font-semibold text-amber-300">
            Fórmula de Autor Destacada
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-300 bg-slate-950/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
            <span>Dificultad: <strong className="text-amber-400">{cocktail.difficulty}</strong></span>
            <span>Base: <strong className="text-slate-100">{cocktail.category}</strong></span>
          </div>
        </div>

        {/* Right Column: Narrative & Mixology Notes */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <p className="text-xs uppercase font-bold tracking-widest text-amber-400">
              La Recomendación de la Noche
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              {cocktail.name}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans font-light">
              {cocktail.description}
            </p>
          </div>

          {/* Flavor & Technique Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1">
                <GlassWater size={15} />
                <span>Perfil</span>
              </div>
              <p className="text-slate-300">Equilibrio aromático con notas botánicas y cítricas.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold mb-1">
                <Wine size={15} />
                <span>Servicio</span>
              </div>
              <p className="text-slate-300">En cristalería pre-enfriada para preservar los aceites esenciales.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
                <Flame size={15} />
                <span>Técnica</span>
              </div>
              <p className="text-slate-300">Dilución controlada y colado doble para máxima textura.</p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onSelectCocktail(cocktail)}
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
            >
              <span>Ver Proporciones & Preparación</span>
              <ChevronRight size={16} />
            </button>

            <button
              onClick={onOpenAIBartender}
              className="px-4 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 hover:text-amber-300 text-xs sm:text-sm border border-slate-700/80 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles size={14} className="text-amber-400" />
              <span>Pedir al Maestro una variación</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
