import React from 'react';
import { Wine, Beer, Martini, GlassWater } from 'lucide-react';
import { CocktailCategory } from '../types';

interface SidebarProps {
  selectedCategory: CocktailCategory;
  onSelectCategory: (category: CocktailCategory) => void;
  isOpen: boolean;
}

const CATEGORIES: { id: CocktailCategory; icon: React.ReactNode; label: string }[] = [
  { id: 'Todos', icon: <GlassWater size={20} />, label: 'Barra Completa' },
  { id: 'Ron', icon: <GlassWater size={20} />, label: 'Ron' },
  { id: 'Whisky', icon: <GlassWater size={20} />, label: 'Whisky' },
  { id: 'Ginebra', icon: <Martini size={20} />, label: 'Ginebra' },
  { id: 'Tequila', icon: <GlassWater size={20} />, label: 'Tequila' },
  { id: 'Brandy', icon: <GlassWater size={20} />, label: 'Brandy' },
  { id: 'Vino', icon: <Wine size={20} />, label: 'Vino' },
  { id: 'Cerveza', icon: <Beer size={20} />, label: 'Cerveza' },
];

export const Sidebar: React.FC<SidebarProps> = ({ selectedCategory, onSelectCategory, isOpen }) => {
  return (
    <aside 
      className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}
    >
      <div className="flex flex-col h-full">
        <div className="h-20 flex items-center px-8 border-b border-slate-800">
          <h1 className="font-serif text-2xl font-bold text-amber-500 tracking-wider">
            BarMaster<span className="text-slate-100">Pro</span>
          </h1>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Licor Base
          </p>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
                ${selectedCategory === cat.id 
                  ? 'bg-amber-500/10 text-amber-500 border-l-4 border-amber-500' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
              `}
            >
              <span className={`transition-colors ${selectedCategory === cat.id ? 'text-amber-500' : 'text-slate-500 group-hover:text-slate-300'}`}>
                {cat.icon}
              </span>
              <span className="font-medium text-sm">{cat.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-xs text-slate-500 mb-1">Estado de la Barra</p>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm font-medium text-slate-300">Abierto</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};