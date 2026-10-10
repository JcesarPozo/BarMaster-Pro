import React from 'react';
import { Wine, Beer, Martini, GlassWater, Sparkles, X, Compass, Droplet, Flame, HelpCircle } from 'lucide-react';
import { CocktailCategory } from '../types';

interface SidebarProps {
  selectedCategory: CocktailCategory;
  onSelectCategory: (category: CocktailCategory) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpenAIBartender: () => void;
  onOpenUserGuide: () => void;
}

const CATEGORIES: { id: CocktailCategory; icon: React.ReactNode; label: string; desc: string }[] = [
  { id: 'Todos', icon: <GlassWater size={18} />, label: 'Barra Completa', desc: 'Todo el catálogo' },
  { id: 'Ron', icon: <Droplet size={18} />, label: 'Ron', desc: 'Caña y cítricos' },
  { id: 'Whisky', icon: <GlassWater size={18} />, label: 'Whisky & Bourbon', desc: 'Roble y malta' },
  { id: 'Ginebra', icon: <Martini size={18} />, label: 'Ginebra', desc: 'Enebro y botánicos' },
  { id: 'Tequila', icon: <Flame size={18} />, label: 'Tequila & Mezcal', desc: 'Agave y notas de humo' },
  { id: 'Brandy', icon: <Wine size={18} />, label: 'Brandy & Cognac', desc: 'Destilado de uva' },
  { id: 'Vino', icon: <Wine size={18} />, label: 'Aperitivos & Vino', desc: 'Vermouth y spritz' },
  { id: 'Cerveza', icon: <Beer size={18} />, label: 'Cerveza & Malta', desc: 'Lúpulo y fermentación' },
];

export const Sidebar: React.FC<SidebarProps> = ({ 
  selectedCategory, 
  onSelectCategory, 
  isOpen, 
  onClose,
  onOpenAIBartender,
  onOpenUserGuide
}) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/75 z-40 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 w-72 sm:w-80 bg-slate-950 border-r border-slate-800/80 shadow-2xl transform transition-transform duration-300 ease-out flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-amber-500/40 shadow-sm shrink-0 bg-slate-950">
              <img 
                src="/assets/images/app_pwa_logo.jpg" 
                alt="BarMaster Pro Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-serif text-xl font-bold text-white tracking-wide">
              BarMaster <span className="text-amber-500 font-normal italic">Pro</span>
            </span>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Cerrar panel"
          >
            <X size={20} />
          </button>
        </div>

        {/* AI Bartender & Guide Quick Actions */}
        <div className="p-4 border-b border-slate-800/80 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent space-y-2">
          <button
            onClick={() => {
              onClose();
              onOpenAIBartender();
            }}
            className="w-full p-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Sparkles size={15} />
            <span>Consultar al Maestro IA</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenUserGuide();
            }}
            className="w-full p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-850 text-slate-300 hover:text-amber-300 font-semibold text-xs border border-slate-800 hover:border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <HelpCircle size={15} className="text-amber-400" />
            <span>¿Cómo usar la app? (Guía)</span>
          </button>
        </div>

        {/* Spirits List */}
        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-1">
          <div className="px-3 pb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Compass size={13} className="text-amber-500" />
            <span>Familias de Destilados</span>
          </div>

          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  onClose();
                }}
                className={`
                  w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-200 text-left cursor-pointer group
                  ${isSelected 
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-medium' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'}
                `}
              >
                <div className="flex items-center gap-3">
                  <span className={`p-1.5 rounded-lg transition-colors ${isSelected ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-900 text-slate-500 group-hover:text-slate-300'}`}>
                    {cat.icon}
                  </span>
                  <div>
                    <p className={`text-sm leading-snug font-serif ${isSelected ? 'text-amber-200 font-bold' : 'text-slate-200 group-hover:text-white'}`}>
                      {cat.label}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {cat.desc}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 text-xs text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Servicio de Barra Activo</span>
          </div>
          <span className="font-mono text-[11px] text-slate-400">30+ Cócteles</span>
        </div>
      </aside>
    </>
  );
};
