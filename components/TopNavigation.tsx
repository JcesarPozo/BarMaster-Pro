import React from 'react';
import { Search, Sparkles, Menu, X, Martini, HelpCircle } from 'lucide-react';

interface TopNavigationProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAIBartender: () => void;
  onOpenUserGuide: () => void;
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
  onNavClick: (sectionId: string) => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  searchQuery,
  onSearchChange,
  onOpenAIBartender,
  onOpenUserGuide,
  onToggleMobileMenu,
  isMobileMenuOpen,
  onNavClick
}) => {
  return (
    <header className="sticky top-0 z-30 h-20 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 flex items-center justify-between transition-colors">
      
      {/* Zone 1: Brand Wordmark (Single text element with refined serif) */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-900 transition-colors"
          title="Abrir menú"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-500/40 group-hover:border-amber-400 transition-all shadow-md shadow-amber-500/10 group-hover:scale-105 shrink-0 bg-slate-950">
            <img 
              src="/assets/images/app_pwa_logo.jpg" 
              alt="BarMaster Pro Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">
            BarMaster <span className="text-amber-500 font-normal italic">Pro</span>
          </span>
        </a>
      </div>

      {/* Zone 2: Navigation Links (Clean text links, single-line) */}
      <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-400">
        <button 
          onClick={() => onNavClick('destilados')}
          className="hover:text-amber-300 transition-colors cursor-pointer"
        >
          Destilados
        </button>
        <button 
          onClick={() => onNavClick('carta')}
          className="hover:text-amber-300 transition-colors cursor-pointer"
        >
          Carta de Cócteles
        </button>
        <button 
          onClick={() => onNavClick('autor')}
          className="hover:text-amber-300 transition-colors cursor-pointer"
        >
          Cóctel de Autor
        </button>
        <button 
          onClick={onOpenAIBartender}
          className="hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1.5 text-amber-400/90 font-semibold"
        >
          <Sparkles size={14} className="text-amber-400" />
          <span>El Maestro IA</span>
        </button>
        <button 
          onClick={onOpenUserGuide}
          className="hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1.5 text-slate-300 hover:text-white"
        >
          <HelpCircle size={14} className="text-amber-400" />
          <span>Guía de Uso</span>
        </button>
      </nav>

      {/* Zone 3: Search, Guide & Primary Action */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Visible User Guide Button for Client Onboarding */}
        <button
          onClick={onOpenUserGuide}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-amber-300 border border-slate-700/80 transition-all text-xs font-semibold shadow-sm cursor-pointer whitespace-nowrap"
          title="Ver guía visual interactiva para navegar y usar BarMaster Pro"
        >
          <HelpCircle size={15} className="text-amber-400 shrink-0" />
          <span className="hidden sm:inline">¿Cómo usar la app?</span>
          <span className="sm:hidden">Guía</span>
        </button>

        {/* Search Input */}
        <div className="relative hidden md:block w-48 lg:w-60">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search size={14} />
          </div>
          <input
            type="text"
            placeholder="Buscar cóctel o ingrediente..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 text-slate-200 placeholder-slate-500 rounded-xl pl-8 pr-3 py-2 text-xs focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 transition-all"
          />
        </div>

        {/* Primary Action Button */}
        <button
          onClick={onOpenAIBartender}
          className="px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-amber-500/20 hover:scale-102 transition-all cursor-pointer whitespace-nowrap"
          title="Consultar al Maestro Mezclador IA"
        >
          <Sparkles size={15} className="shrink-0" />
          <span className="hidden xl:inline">Preguntar al Maestro</span>
          <span className="xl:hidden">Maestro IA</span>
        </button>
      </div>

    </header>
  );
};
