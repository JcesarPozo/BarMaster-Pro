import React, { useState, useMemo } from 'react';
import { Menu, Search } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { CocktailCard } from './components/CocktailCard';
import { CocktailModal } from './components/CocktailModal';
import { AIBartender } from './components/AIBartender';
import { COCKTAILS } from './data/cocktails';
import { CocktailCategory, Cocktail } from './types';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<CocktailCategory>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCocktail, setSelectedCocktail] = useState<Cocktail | null>(null);

  // Filtrado eficiente usando useMemo para evitar recálculos innecesarios
  const filteredCocktails = useMemo(() => {
    return COCKTAILS.filter(cocktail => {
      const matchesCategory = selectedCategory === 'Todos' || cocktail.category === selectedCategory;
      const matchesSearch = cocktail.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           cocktail.ingredients.some(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Sidebar */}
      <Sidebar 
        selectedCategory={selectedCategory} 
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSidebarOpen(false); // Close mobile sidebar on select
        }}
        isOpen={sidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full w-full relative">
        
        {/* Mobile Header Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Top Header */}
        <header className="h-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-slate-400 hover:text-amber-500 transition-colors"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-serif font-bold text-slate-100 hidden sm:block">
              {selectedCategory === 'Todos' ? 'Menú Completo' : `Selección de ${selectedCategory}`}
            </h2>
          </div>

          <div className="relative w-full max-w-md ml-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-500" />
            </div>
            <input
              type="text"
              placeholder="Buscar cóctel o ingrediente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-800 rounded-lg leading-5 bg-slate-900 text-slate-300 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 sm:text-sm transition-all"
            />
          </div>
        </header>

        {/* Dashboard Grid */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Stats / Welcome */}
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-sm text-amber-500 font-medium uppercase tracking-wider mb-1">
                  Panel de Control
                </p>
                <h1 className="text-3xl font-serif font-bold text-white">
                  {filteredCocktails.length} <span className="text-slate-500 font-sans text-xl font-normal">Recetas Disponibles</span>
                </h1>
              </div>
            </div>

            {/* Grid */}
            {filteredCocktails.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCocktails.map(cocktail => (
                  <CocktailCard 
                    key={cocktail.id} 
                    cocktail={cocktail} 
                    onClick={() => setSelectedCocktail(cocktail)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mb-4 border border-slate-800">
                  <Menu className="text-slate-600" size={40} />
                </div>
                <h3 className="text-xl font-medium text-slate-300">No hay bebidas que coincidan</h3>
                <p className="text-slate-500 mt-2">Intenta ajustar tus filtros o consulta al Maestro Mezclador.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Recipe Modal */}
      {selectedCocktail && (
        <CocktailModal 
          cocktail={selectedCocktail} 
          onClose={() => setSelectedCocktail(null)} 
        />
      )}

      {/* AI Assistant Widget */}
     {/*  <AIBartender />*/}
      
    </div>
  );
}
