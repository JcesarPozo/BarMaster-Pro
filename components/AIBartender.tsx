import React, { useState } from 'react';
import { Search, Sparkles, MessageSquare, ExternalLink, Loader2 } from 'lucide-react';
import { askBartender } from '../services/geminiService';
import { SearchResult } from '../types';

export const AIBartender: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!query.trim()) return;

  setIsLoading(true);
  setError(null);
  setResult(null); // Limpiamos el anterior para que aparezca el cargando

  try {
    const response = await askBartender(query);
    setResult(response);
    setQuery(''); // <--- ESTO LIMPIA EL BUSCADOR AUTOMÁTICAMENTE
  } catch (err: any) {
    setError(err.message || 'Error de conexión con el bartender.');
  } finally {
    setIsLoading(false);
  }
};
  
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-amber-500 hover:bg-amber-600 text-slate-950 p-4 rounded-full shadow-lg shadow-amber-500/20 transition-all hover:scale-105 flex items-center gap-2 font-bold"
      >
        <Sparkles size={20} />
        <span className="hidden md:inline">Consultar al Maestro</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 w-full max-w-2xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-slate-100">Maestro Mezclador IA</h2>
              <p className="text-xs text-slate-400">Impulsado por Borrachos y Mas...</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!result && !isLoading && !error && (
            <div className="text-center text-slate-500 py-10">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium text-slate-400">¿Qué deseas saber hoy, aprendiz?</p>
              <p className="text-sm mt-2">Pregunta por historia, tendencias o consejos técnicos.</p>
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                <button onClick={() => setQuery("Dame una receta de un cóctel con Ron y piña")} className="text-xs border border-slate-700 hover:border-amber-500/50 px-3 py-1.5 rounded-full transition-colors">Dame una receta de un cóctel con ron y piña</button>
                <button onClick={() => setQuery("Tendencias de coctelería 2026")} className="text-xs border border-slate-700 hover:border-amber-500/50 px-3 py-1.5 rounded-full transition-colors">Tendencias 2026</button>
                <button onClick={() => setQuery("Historia de los Cócteles")} className="text-xs border border-slate-700 hover:border-amber-500/50 px-3 py-1.5 rounded-full transition-colors">Historia de los Cócteles</button>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="animate-spin text-amber-500" size={32} />
              <p className="text-sm text-slate-400 animate-pulse">Mezclando conocimiento...</p>
            </div>
          )}

          {result && (
           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="prose prose-invert prose-amber max-w-none">
              <p className="whitespace-pre-line leading-relaxed text-slate-200">
                {/* CAMBIO CLAVE AQUÍ: Usamos .answer o .response que es lo que manda el servicio */}
                {result.answer || result.text || (result as any).response}
              </p>
            </div>

              {result.sources.length > 0 && (
                <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-800">
                  <h4 className="text-xs font-bold uppercase text-slate-500 mb-3 tracking-wider">Fuentes de Información</h4>
                  <ul className="space-y-2">
                    {result.sources.map((source, idx) => (
                      <li key={idx}>
                        <a 
                          href={source.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-amber-500 hover:text-amber-400 transition-colors truncate"
                        >
                          <ExternalLink size={12} />
                          <span className="truncate">{source.title}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-800 bg-slate-900">
          <form onSubmit={handleAsk} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pregúntale al Maestro sobre historias, recetas, ingredientes o técnicas..."
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-600"
            />
            <button 
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute right-2 top-2 p-1.5 bg-amber-500 text-slate-950 rounded hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
