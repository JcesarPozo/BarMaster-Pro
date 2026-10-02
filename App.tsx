import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopNavigation } from './components/TopNavigation';
import { SpeakeasyHero } from './components/SpeakeasyHero';
import { SpiritShowcase } from './components/SpiritShowcase';
import { AuthorSpotlight } from './components/AuthorSpotlight';
import { CocktailCard } from './components/CocktailCard';
import { CocktailModal } from './components/CocktailModal';
import { AIBartender } from './components/AIBartender';
import { UserGuideModal } from './components/UserGuideModal';
import { COCKTAILS } from './data/cocktails';
import { CocktailCategory, Cocktail } from './types';
import { Sparkles, SlidersHorizontal, Search, RotateCcw, Wine, Check } from 'lucide-react';

type DifficultyFilter = 'Todos' | 'Fácil' | 'Medio' | 'Experto';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<CocktailCategory>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyFilter>('Todos');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCocktail, setSelectedCocktail] = useState<Cocktail | null>(null);
  const [isAIBartenderOpen, setIsAIBartenderOpen] = useState(false);
  const [isUserGuideOpen, setIsUserGuideOpen] = useState(false);

  // Compute category count map for the spirit selector
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of COCKTAILS) {
      counts[c.category] = (counts[c.category] || 0) + 1;
    }
    return counts;
  }, []);

  // Featured cocktails for Hero and Spotlight
  const heroFeaturedCocktail = useMemo(() => {
    return COCKTAILS.find(c => c.name.includes('Old Fashioned')) || COCKTAILS[0];
  }, []);

  const authorSpotlightCocktail = useMemo(() => {
    return COCKTAILS.find(c => c.name.includes('Negroni')) || COCKTAILS[1];
  }, []);

  // Filtered cocktails calculation
  const filteredCocktails = useMemo(() => {
    return COCKTAILS.filter(cocktail => {
      const matchesCategory = selectedCategory === 'Todos' || cocktail.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'Todos' || cocktail.difficulty === selectedDifficulty;
      
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        cocktail.name.toLowerCase().includes(q) || 
        cocktail.category.toLowerCase().includes(q) ||
        cocktail.description.toLowerCase().includes(q) ||
        cocktail.ingredients.some(i => i.name.toLowerCase().includes(q));

      return matchesCategory && matchesDifficulty && matchesSearch;
    });
  }, [selectedCategory, selectedDifficulty, searchQuery]);

  const handleNavClick = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('Todos');
    setSelectedDifficulty('Todos');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-amber-500/30 selection:text-amber-200 flex flex-col">
      
      {/* Top 3-Zone Sticky Navigation Bar */}
      <TopNavigation 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAIBartender={() => setIsAIBartenderOpen(true)}
        onOpenUserGuide={() => setIsUserGuideOpen(true)}
        onToggleMobileMenu={() => setSidebarOpen(!sidebarOpen)}
        isMobileMenuOpen={sidebarOpen}
        onNavClick={handleNavClick}
      />

      {/* Slide-out Speakeasy Drawer for Mobile & Fast Nav */}
      <Sidebar 
        selectedCategory={selectedCategory} 
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          handleNavClick('carta');
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenAIBartender={() => setIsAIBartenderOpen(true)}
        onOpenUserGuide={() => setIsUserGuideOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        
        {/* Grand Speakeasy Hero Section */}
        <SpeakeasyHero 
          featuredCocktail={heroFeaturedCocktail}
          onSelectCocktail={setSelectedCocktail}
          onOpenAIBartender={() => setIsAIBartenderOpen(true)}
          onOpenUserGuide={() => setIsUserGuideOpen(true)}
          onExploreMenu={() => handleNavClick('destilados')}
        />

        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 space-y-16">
          
          {/* Section: Spirit Showcase Gallery (Tactile Horizontal Selector) */}
          <section id="destilados" className="scroll-mt-24">
            <SpiritShowcase 
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              categoryCounts={categoryCounts}
            />
          </section>

          {/* Section: Main Curated Cocktail Collection */}
          <section id="carta" className="scroll-mt-24 space-y-6">
            
            {/* Collection Header & Filter Toolbar */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-800/80">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-500 mb-1">
                  Catálogo de Alta Barra
                </p>
                <div className="flex items-baseline gap-3">
                  <h2 className="text-3xl font-serif font-bold text-slate-100">
                    {selectedCategory === 'Todos' ? 'Carta Completa' : `Cócteles con ${selectedCategory}`}
                  </h2>
                  <span className="text-xs text-slate-400 font-mono">
                    ({filteredCocktails.length} {filteredCocktails.length === 1 ? 'receta' : 'recetas'})
                  </span>
                </div>
              </div>

              {/* Controls: Difficulty segmented tabs */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 px-2 flex items-center gap-1">
                    <SlidersHorizontal size={11} className="text-amber-500" />
                    <span>Nivel</span>
                  </span>
                  {(['Todos', 'Fácil', 'Medio', 'Experto'] as DifficultyFilter[]).map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`
                        px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer
                        ${selectedDifficulty === diff 
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' 
                          : 'text-slate-400 hover:text-slate-200'}
                      `}
                    >
                      {diff}
                    </button>
                  ))}
                </div>

                {/* Reset button if filters active */}
                {(selectedCategory !== 'Todos' || selectedDifficulty !== 'Todos' || searchQuery) && (
                  <button
                    onClick={handleResetFilters}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-amber-400 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                    title="Restablecer todos los filtros"
                  >
                    <RotateCcw size={13} />
                    <span className="hidden sm:inline">Limpiar</span>
                  </button>
                )}
              </div>
            </div>

            {/* Active search filter reminder banner if searching */}
            {searchQuery && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300">
                <span>Resultados para la búsqueda: <strong className="text-amber-300">"{searchQuery}"</strong></span>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-white underline cursor-pointer"
                >
                  Borrar búsqueda
                </button>
              </div>
            )}

            {/* Cocktails Grid */}
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
              /* Empty state with helpful actions */
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl border border-slate-800/80 bg-slate-900/40 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-500">
                  <Search size={28} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-serif font-bold text-slate-200">
                    No encontramos cócteles con esos criterios
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                    Intenta buscar con otro término, o pídele a El Maestro Mezclador que cree una fórmula a tu medida.
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    Ver todas las recetas
                  </button>
                  <button
                    onClick={() => setIsAIBartenderOpen(true)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles size={13} />
                    <span>Preguntar al Maestro</span>
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Section: Editorial Author Spotlight */}
          <AuthorSpotlight 
            cocktail={authorSpotlightCocktail}
            onSelectCocktail={setSelectedCocktail}
            onOpenAIBartender={() => setIsAIBartenderOpen(true)}
          />

          {/* Section: Interactive Speakeasy Maestro Banner */}
          <section className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 p-8 sm:p-10 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 space-y-3">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest">
                  <Sparkles size={13} />
                  <span>Servicio Privado de Barra</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  ¿Tienes ingredientes en casa y no sabes qué preparar?
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed max-w-xl font-light">
                  Dile a nuestro Maestro Bartender qué botellas tienes a mano. Creará una fórmula a medida con proporciones de alta coctelería, técnica de agitado y cristalería recomendada.
                </p>
              </div>

              <div className="md:col-span-4 flex md:justify-end">
                <button
                  onClick={() => setIsAIBartenderOpen(true)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 hover:scale-102 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles size={16} />
                  <span>Hablar con el Bartender</span>
                </button>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-10 px-6 sm:px-8 mt-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-300 font-serif text-base font-bold">
            <span>BarMaster Pro</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-xs text-amber-400 font-sans font-normal">Plataforma Mixológica de Autor</span>
          </div>

          <p className="text-slate-400 text-center sm:text-right">
            Disfrute con responsabilidad. Prohibida la venta a menores de edad según la legislación local.
          </p>
        </div>
      </footer>

      {/* Recipe Detail Modal */}
      {selectedCocktail && (
        <CocktailModal 
          cocktail={selectedCocktail} 
          onClose={() => setSelectedCocktail(null)} 
        />
      )}

      {/* User Guide Interactive Walkthrough Modal */}
      <UserGuideModal
        isOpen={isUserGuideOpen}
        onClose={() => setIsUserGuideOpen(false)}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          handleNavClick('carta');
        }}
        onOpenAIBartender={() => setIsAIBartenderOpen(true)}
        onOpenSampleCocktail={() => setSelectedCocktail(authorSpotlightCocktail)}
      />

      {/* AI Assistant Modal & Floating Widget */}
      <AIBartender 
        isOpen={isAIBartenderOpen}
        onOpenChange={setIsAIBartenderOpen}
      />

    </div>
  );
}
