import React from 'react';
import { Sparkles, ArrowDown, Wine, Compass, Clock, Award, HelpCircle } from 'lucide-react';
import { Cocktail } from '../types';

interface SpeakeasyHeroProps {
  featuredCocktail: Cocktail;
  onSelectCocktail: (cocktail: Cocktail) => void;
  onOpenAIBartender: () => void;
  onOpenUserGuide: () => void;
  onExploreMenu: () => void;
}

export const SpeakeasyHero: React.FC<SpeakeasyHeroProps> = ({
  featuredCocktail,
  onSelectCocktail,
  onOpenAIBartender,
  onOpenUserGuide,
  onExploreMenu
}) => {
  return (
    <section className="relative overflow-hidden bg-slate-950 border-b border-slate-800/80">
      {/* Background Cinematic Atmosphere */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/assets/images/hero_speakeasy_bar.jpg" 
          alt="BarMaster Pro Speakeasy Lounge" 
          className="w-full h-full object-cover object-center brightness-75 scale-102 transition-transform duration-1000"
        />
        {/* Deep ambient dark scrim for WCAG AA readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
        
        {/* Subtle radial amber ambient glow */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Brand Statement & Primary Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Kicker Tag */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/25 backdrop-blur-md">
              <Award size={13} className="text-amber-400" />
              <span>Alta Mixología & Recetario de Autor</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white tracking-tight leading-[1.1] text-balance">
              Donde cada copa cuenta una historia.
            </h1>

            {/* Editorial Subtitle */}
            <p className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed font-sans font-light">
              Explora fórmulas clásicas de barra, proporciones alquímicas exactas y técnicas de autor. Diseñado para mixólogos, aficionados y amantes de la coctelería refinada.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreMenu}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 flex items-center gap-2 group cursor-pointer"
              >
                <span>Explorar la Carta</span>
                <ArrowDown size={15} className="group-hover:translate-y-0.5 transition-transform" />
              </button>

              <button
                onClick={onOpenAIBartender}
                className="px-4 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-850 text-slate-100 hover:text-amber-300 font-semibold text-sm border border-slate-700/80 hover:border-amber-500/40 transition-all flex items-center gap-2 backdrop-blur-sm hover:-translate-y-0.5 cursor-pointer shadow-md"
              >
                <Sparkles size={15} className="text-amber-400" />
                <span>Consultar Maestro IA</span>
              </button>

              <button
                onClick={onOpenUserGuide}
                className="px-4 py-3 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white font-medium text-sm border border-slate-800 hover:border-slate-700 transition-all flex items-center gap-2 backdrop-blur-sm cursor-pointer shadow-sm"
                title="Aprende a usar el catálogo, filtros y bartender IA"
              >
                <HelpCircle size={15} className="text-amber-400" />
                <span>¿Cómo usar la app?</span>
              </button>
            </div>

            {/* Quiet Unboxed Metadata Indicators */}
            <div className="pt-4 flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-slate-400 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Barra Abierta & Catálogo Activo</span>
              </div>
              <span aria-hidden="true" className="text-slate-600 hidden sm:inline">·</span>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Compass size={14} className="text-amber-400" />
                <span>8 Familias de Destilados</span>
              </div>
              <span aria-hidden="true" className="text-slate-600 hidden sm:inline">·</span>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Wine size={14} className="text-amber-400" />
                <span>Fórmulas con Medidas Exactas</span>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Cocktail Spotlight Card */}
          <div className="lg:col-span-5">
            <div 
              onClick={() => onSelectCocktail(featuredCocktail)}
              className="group relative bg-slate-900/90 hover:bg-slate-900 rounded-2xl overflow-hidden border border-amber-500/30 hover:border-amber-500/60 shadow-2xl shadow-black/80 transition-all duration-300 hover:-translate-y-1 cursor-pointer backdrop-blur-md"
            >
              {/* Image Frame */}
              <div className="relative h-60 sm:h-64 overflow-hidden bg-slate-950">
                <img 
                  src={featuredCocktail.imageUrl} 
                  alt={featuredCocktail.name} 
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30" />
                
                {/* Spotlight Kicker Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-amber-400/40 text-[11px] font-semibold text-amber-300 shadow-md">
                  <Sparkles size={12} className="text-amber-400" />
                  <span>Selección del Maestro</span>
                </div>

                <div className="absolute bottom-3 left-3 text-xs text-slate-300 flex items-center gap-2">
                  <span className="font-semibold text-amber-300">{featuredCocktail.category}</span>
                  <span aria-hidden="true" className="text-slate-500">·</span>
                  <span className="text-slate-300 flex items-center gap-1">
                    <Clock size={12} className="text-amber-400" />
                    Dificultad {featuredCocktail.difficulty}
                  </span>
                </div>
              </div>

              {/* Card Summary */}
              <div className="p-5 sm:p-6 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                      {featuredCocktail.name}
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 shrink-0 pt-1 group-hover:translate-x-0.5 transition-transform">
                    Ver Receta →
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-2">
                  {featuredCocktail.description}
                </p>

                <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Ingredientes: <strong className="text-slate-300 font-normal">{featuredCocktail.ingredients.slice(0, 3).map(i => i.name).join(', ')}</strong></span>
                  <span className="text-amber-400 font-medium">Fórmula Verificada</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
