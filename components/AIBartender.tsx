import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  MessageSquare, 
  ExternalLink, 
  Loader2, 
  Martini, 
  Flame, 
  Wine, 
  Droplets,
  RotateCcw,
  X
} from 'lucide-react';
import { askBartender } from '../services/geminiService';
import { SearchResult } from '../types';
import { FormattedBartenderResponse } from './FormattedBartenderResponse';

interface AIBartenderProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const AIBartender: React.FC<AIBartenderProps> = ({ 
  isOpen: externalIsOpen, 
  onOpenChange 
}) => {
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const abortControllerRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Sync external open state
  useEffect(() => {
    if (externalIsOpen !== undefined) {
      if (externalIsOpen) {
        handleReset();
        setTimeout(() => {
          inputRef.current?.focus();
        }, 150);
      }
    }
  }, [externalIsOpen]);

  // Abort any ongoing request and reset the component state cleanly
  const handleReset = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    setResult(null);
    setError(null);
    setQuery('');
    setActiveQuery('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  // When opening or re-entering, always refresh cleanly to avoid stuck states
  const handleOpen = () => {
    handleReset();
    setInternalIsOpen(true);
    onOpenChange?.(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
  };

  // When closing, abort any pending request and clean up
  const handleClose = () => {
    handleReset();
    setInternalIsOpen(false);
    onOpenChange?.(false);
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleAsk = async (textToAsk?: string) => {
    const q = (textToAsk ?? query).trim();
    if (!q) return;

    // Abort any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setActiveQuery(q);
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await askBartender(q, controller.signal);
      if (!controller.signal.aborted) {
        setResult(response);
      }
    } catch (err: any) {
      if (controller.signal.aborted || err.message === 'Consulta cancelada.') {
        // Ignored as it was intentionally cancelled/refreshed
        return;
      }
      setError(err.message || 'Error de conexión con el bartender.');
    } finally {
      if (abortControllerRef.current === controller) {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAsk();
  };

  const handleQuickQuestion = (quickText: string) => {
    setQuery(quickText);
    handleAsk(quickText);
  };

  if (!isOpen) {
    return (
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-5 py-3.5 rounded-full shadow-xl shadow-amber-500/25 transition-all hover:scale-105 flex items-center gap-2.5 font-bold border border-amber-300/30 group"
        title="Consultar al Maestro Mezclador IA"
      >
        <div className="w-6 h-6 rounded-full bg-slate-950/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
          <Sparkles size={16} />
        </div>
        <span className="hidden md:inline">Consultar al Maestro</span>
      </button>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        // Close on clicking backdrop
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="bg-slate-900 w-full max-w-2xl rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80 backdrop-blur flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner shrink-0">
              <Martini size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-serif font-bold text-slate-100">Maestro Mezclador IA</h2>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  Bar Expert
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Respuestas formuladas con alta coctelería
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Always accessible Refresh / New Query button */}
            <button
              onClick={handleReset}
              className="text-xs text-slate-300 hover:text-amber-300 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 shadow-sm cursor-pointer"
              title="Refrescar y comenzar nueva consulta"
            >
              <RotateCcw size={13} className="text-amber-400" />
              <span className="font-medium hidden sm:inline">Refrescar</span>
            </button>

            <button 
              onClick={handleClose}
              className="text-slate-400 hover:text-slate-100 transition-colors p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
              title="Cerrar ventana (Esc)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {!result && !isLoading && !error && (
            <div className="text-center py-6 sm:py-8 px-4">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 mx-auto flex items-center justify-center mb-4 text-amber-400">
                <MessageSquare size={32} />
              </div>
              <h3 className="text-xl font-serif font-bold text-slate-200">
                ¿Qué deseas preparar hoy, aprendiz?
              </h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
                Pregunta por recetas exactas, técnicas de agitado, cristalería, historia o sustitutos de ingredientes.
              </p>

              {/* Quick Suggestion Chips with Icons */}
              <div className="mt-8">
                <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">
                  Sugerencias Rápidas
                </p>
                <div className="flex flex-wrap justify-center gap-2.5">
                  <button 
                    onClick={() => handleQuickQuestion("Inventa un cóctel de autor con Ron y Café")} 
                    className="flex items-center gap-2 text-xs bg-slate-950/70 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/60 text-slate-300 hover:text-amber-300 px-3.5 py-2 rounded-xl transition-all"
                  >
                    <Sparkles size={14} className="text-amber-400" />
                    <span>Inventar Cóctel con Café</span>
                  </button>
                  <button 
                    onClick={() => handleQuickQuestion("Crea un cóctel original con Fresa y cítricos")} 
                    className="flex items-center gap-2 text-xs bg-slate-950/70 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/60 text-slate-300 hover:text-amber-300 px-3.5 py-2 rounded-xl transition-all"
                  >
                    <Wine size={14} className="text-rose-400" />
                    <span>Cóctel de Autor con Fresa</span>
                  </button>
                  <button 
                    onClick={() => handleQuickQuestion("¿Cuál es la historia y receta original del Negroni?")} 
                    className="flex items-center gap-2 text-xs bg-slate-950/70 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/60 text-slate-300 hover:text-amber-300 px-3.5 py-2 rounded-xl transition-all"
                  >
                    <Flame size={14} className="text-orange-400" />
                    <span>Historia del Negroni</span>
                  </button>
                  <button 
                    onClick={() => handleQuickQuestion("¿Cuál es la proporción clásica y técnica de un Daiquiri?")} 
                    className="flex items-center gap-2 text-xs bg-slate-950/70 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/60 text-slate-300 hover:text-amber-300 px-3.5 py-2 rounded-xl transition-all"
                  >
                    <Droplets size={14} className="text-emerald-400" />
                    <span>Fórmula del Daiquiri</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading / Waiting state: with explicit Cancel & Refresh button */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-14 space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
                  <Martini size={30} className="animate-bounce" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Loader2 size={20} className="animate-spin text-amber-400" />
                </div>
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-semibold text-slate-100">El Maestro está formulando la respuesta...</p>
                <p className="text-xs text-slate-400">Ajustando proporciones, botánicos y técnicas de barra</p>
              </div>

              {/* Direct exit button from waiting mode */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-amber-300 border border-slate-700/80 transition-all text-xs font-medium shadow-sm hover:scale-102"
                >
                  <RotateCcw size={13} className="text-amber-400" />
                  <span>Cancelar espera y refrescar</span>
                </button>
              </div>
            </div>
          )}

          {result && (
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-400 space-y-6">
              {/* Formatted Response with Clean Typography, Icons & Cocktail Photo */}
              <FormattedBartenderResponse 
                rawText={result.text} 
                query={activeQuery}
                cocktail={result.cocktail}
              />

              {/* Bottom Quick-Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-amber-300 border border-slate-700 transition-colors text-xs font-semibold shadow-sm"
                >
                  <RotateCcw size={13} className="text-amber-400" />
                  <span>Hacer otra consulta / Refrescar</span>
                </button>
                <p className="text-[11px] text-slate-500 italic">
                  O escribe tu siguiente pregunta directamente abajo ↓
                </p>
              </div>

              {/* Sources if present */}
              {result.sources.length > 0 && (
                <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800">
                  <h4 className="text-xs font-bold uppercase text-slate-500 mb-2.5 tracking-wider flex items-center gap-1.5">
                    <ExternalLink size={12} />
                    <span>Fuentes de Información</span>
                  </h4>
                  <ul className="space-y-1.5">
                    {result.sources.map((source, idx) => (
                      <li key={idx}>
                        <a 
                          href={source.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs text-amber-400 hover:text-amber-300 transition-colors truncate"
                        >
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
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 sm:p-5 rounded-2xl text-sm space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-bold flex items-center gap-2 text-red-200">
                  <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs">✕</span>
                  <span>Aviso del Servicio</span>
                </p>
                <button
                  onClick={handleReset}
                  className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
                >
                  <RotateCcw size={12} />
                  <span>Refrescar</span>
                </button>
              </div>
              <p className="text-xs leading-relaxed text-red-300/90">{error}</p>
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => handleAsk()}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw size={12} />
                  <span>Reintentar consulta</span>
                </button>
                <button
                  onClick={handleReset}
                  className="text-xs font-medium text-amber-400 hover:underline"
                >
                  Probar otra pregunta
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={result ? "Haz otra consulta al Maestro..." : "Pregúntale al Maestro (ej: Proporciones de un Old Fashioned)..."}
              className="w-full bg-slate-900 border border-slate-700/80 text-slate-100 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-500"
            />
            <button 
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute right-2 p-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 rounded-lg hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold shadow-sm"
              title="Enviar consulta"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
