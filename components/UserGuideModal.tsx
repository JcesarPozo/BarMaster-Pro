import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  Compass, 
  BookOpen, 
  Sparkles, 
  Layers, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Martini, 
  Search, 
  SlidersHorizontal,
  Droplet,
  ExternalLink
} from 'lucide-react';
import { CocktailCategory } from '../types';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory?: (category: CocktailCategory) => void;
  onOpenAIBartender?: () => void;
  onOpenSampleCocktail?: () => void;
}

interface GuideStep {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  tips: string[];
  actionLabel?: string;
  onAction?: () => void;
  demoVisual: React.ReactNode;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
  onOpenAIBartender,
  onOpenSampleCocktail
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps: GuideStep[] = [
    {
      id: 0,
      badge: 'Paso 1 de 4 · Navegación',
      title: 'Explora por Familia de Destilados',
      subtitle: 'Encuentra al instante el trago ideal según lo que te apetezca beber',
      description: 'En lugar de un menú escondido, BarMaster Pro te presenta la Galería de Destilados directamente en pantalla. Puedes navegar horizontalmente por Ron, Whisky, Ginebra, Tequila, Brandy, Aperitivos o Cerveza.',
      icon: <Compass size={24} className="text-amber-400" />,
      tips: [
        'Haz clic en cualquier destilado para filtrar todas las recetas de la carta.',
        'Utiliza el buscador en la barra superior para escribir cualquier ingrediente (ej. "menta", "fresa", "limón").',
        'Filtra por nivel de dificultad: Fácil, Medio o Experto para ajustar a tu tiempo y destreza.'
      ],
      actionLabel: 'Probar filtro: Cócteles con Ginebra',
      onAction: () => {
        onSelectCategory?.('Ginebra');
        onClose();
      },
      demoVisual: (
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 shadow-inner">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
            <span className="font-semibold text-amber-400 flex items-center gap-1">
              <Compass size={13} /> Carrusel Táctil
            </span>
            <span>8 Familias Disponibles</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Martini size={15} />
                <span className="font-bold">Ginebra</span>
              </div>
              <span className="text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded font-bold">Activo</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center justify-between opacity-70">
              <div className="flex items-center gap-2">
                <Droplet size={15} className="text-amber-500" />
                <span>Ron</span>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">6 recetas</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 pt-1">
            <SlidersHorizontal size={12} className="text-amber-400 shrink-0" />
            <span>También puedes alternar entre niveles: Fácil · Medio · Experto</span>
          </div>
        </div>
      )
    },
    {
      id: 1,
      badge: 'Paso 2 de 4 · Fórmulas',
      title: 'Abre la Ficha Técnica de Cada Cóctel',
      subtitle: 'Medidas exactas en mililitros, tipo de hielo y pasos cronológicos',
      description: 'Cada tarjeta en la carta es interactiva. Al hacer clic sobre ella se abrirá la fórmula completa formulada por bartenders profesionales para que prepares la bebida sin dudas.',
      icon: <BookOpen size={24} className="text-cyan-400" />,
      tips: [
        'Lista de ingredientes con cantidades milimétricas exactas (ml / oz).',
        'Paso a paso cronológico con técnicas de agitado (shaking) o refrescado (stirring).',
        'Consejos de cristalería recomendada (copa coupé, vaso rocks, highball) para mantener el frío.'
      ],
      actionLabel: 'Ver receta de ejemplo: Negroni Clásico',
      onAction: () => {
        onOpenSampleCocktail?.();
        onClose();
      },
      demoVisual: (
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 shadow-inner">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
            <span className="font-semibold text-cyan-400 flex items-center gap-1">
              <BookOpen size={13} /> Ficha de Receta
            </span>
            <span className="text-emerald-400 font-medium">Fórmula Verificada</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between p-1.5 bg-slate-900 rounded-lg">
              <span className="text-slate-200">Ginebra London Dry</span>
              <span className="font-mono text-amber-300 font-semibold">30 ml</span>
            </div>
            <div className="flex justify-between p-1.5 bg-slate-900 rounded-lg">
              <span className="text-slate-200">Campari Bitter</span>
              <span className="font-mono text-amber-300 font-semibold">30 ml</span>
            </div>
            <div className="flex justify-between p-1.5 bg-slate-900 rounded-lg">
              <span className="text-slate-200">Vermouth Rojo Dulce</span>
              <span className="font-mono text-amber-300 font-semibold">30 ml</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 italic">
            "Servir sobre un cubo de hielo grande y perfumar con piel de naranja."
          </p>
        </div>
      )
    },
    {
      id: 2,
      badge: 'Paso 3 de 4 · Inteligencia Artificial',
      title: 'El Maestro Mezclador IA (100% Gratis)',
      subtitle: 'Tu bartender privado en vivo para resolver dudas o inventar bebidas',
      description: 'Pulsa el botón dorado "Preguntar al Maestro" en cualquier momento. El bartender IA está entrenado en alta coctelería internacional y responde siempre sin coste ni requerir facturación.',
      icon: <Sparkles size={24} className="text-amber-400" />,
      tips: [
        'Dile qué botellas o frutas tienes en casa y te creará una receta personalizada.',
        'Pídele sustituciones de ingredientes si te falta alguno en tu mueble bar.',
        'Aprende la historia, anécdotas y secretos técnicos de cualquier cóctel del mundo.'
      ],
      actionLabel: 'Abrir el Maestro Mezclador IA',
      onAction: () => {
        onOpenAIBartender?.();
        onClose();
      },
      demoVisual: (
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5 shadow-inner">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 border-b border-slate-800 pb-2">
            <Sparkles size={14} />
            <span>Consultas que puedes hacerle</span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px]">
              💬 <em>"Tengo ron blanco, café y azúcar, ¿qué cóctel me inventas?"</em>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px]">
              💬 <em>"¿Cuál es el secreto técnico para que un Daiquiri no quede aguado?"</em>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px]">
              💬 <em>"¿Con qué puedo sustituir el triple sec si no tengo Cointreau?"</em>
            </div>
          </div>
          <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 pt-1">
            <Check size={12} />
            <span>Modelo gratuito · Sin facturación ni necesidad de tarjeta</span>
          </div>
        </div>
      )
    },
    {
      id: 3,
      badge: 'Paso 4 de 4 · Visualización',
      title: 'Laboratorio de Capas y Presentación Fiel',
      subtitle: 'Alterna entre la fotografía real y el corte transversal de densidades',
      description: 'Cuando el Maestro IA formula un cóctel, el sistema asigna una fotografía fiel calibrada al color y cristalería de la bebida, además de un diagrama técnico de densidades.',
      icon: <Layers size={24} className="text-emerald-400" />,
      tips: [
        'En la tarjeta del cóctel generado verás dos botones: "Foto" y "Capas".',
        'El modo "Foto" muestra la presentación de barra con la cristalería y decoración adecuada.',
        'El modo "Capas" dibuja dinámicamente las densidades de líquido, el tipo de hielo (cubo grande, picado o copa fría) y las burbujas.'
      ],
      actionLabel: '¡Entendido! Empezar a explorar',
      onAction: () => {
        onClose();
      },
      demoVisual: (
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 shadow-inner">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <Layers size={13} /> Vista Dual del Cóctel
            </span>
            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[10px]">
              <span className="px-1.5 py-0.5 bg-amber-500 text-slate-950 font-bold rounded">Foto</span>
              <span className="px-1.5 py-0.5 text-slate-400">Capas</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
            <div className="w-12 h-12 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 font-bold">
              🍸
            </div>
            <div>
              <p className="font-semibold text-white">Visualización Organoléptica</p>
              <p className="text-[11px] text-slate-400">
                Los colores y la cristalería coinciden siempre con los ingredientes de tu cóctel.
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const current = steps[currentStep];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-slate-900 w-full max-w-2xl rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <HelpCircle size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-serif font-bold text-white">
                  Guía de Navegación & Uso
                </h3>
                <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 hidden sm:inline">
                  BarMaster Pro
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Descubre cómo sacar el máximo provecho de tu carta y el Maestro IA
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Cerrar guía"
          >
            <X size={20} />
          </button>
        </div>

        {/* Step Navigation Tabs */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950/40 px-5 overflow-x-auto no-scrollbar">
          {steps.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentStep(idx)}
              className={`
                py-3 px-3.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all flex items-center gap-2 cursor-pointer
                ${currentStep === idx 
                  ? 'border-amber-500 text-amber-300' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'}
              `}
            >
              <span className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-bold ${currentStep === idx ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                {idx + 1}
              </span>
              <span>{idx === 0 ? 'Destilados' : idx === 1 ? 'Recetas' : idx === 2 ? 'Maestro IA' : 'Laboratorio'}</span>
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5">
          {/* Header of Step */}
          <div>
            <span className="text-[11px] uppercase font-bold tracking-wider text-amber-400/90 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
              {current.badge}
            </span>
            <h4 className="text-2xl font-serif font-bold text-white mt-2 mb-1">
              {current.title}
            </h4>
            <p className="text-sm text-slate-300 font-light leading-relaxed">
              {current.subtitle}
            </p>
          </div>

          {/* Description Prose */}
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
            {current.description}
          </p>

          {/* Visual Interactive Preview */}
          <div className="pt-1">
            {current.demoVisual}
          </div>

          {/* Key Tips */}
          <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80 space-y-2">
            <p className="text-xs uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
              <Sparkles size={12} className="text-amber-400" />
              <span>Consejos Clave de Uso</span>
            </p>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {current.tips.map((tip, tIdx) => (
                <li key={tIdx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
                  <span className="leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/90 flex flex-wrap items-center justify-between gap-3">
          {/* Direct contextual trial action */}
          {current.actionLabel && current.onAction && (
            <button
              onClick={current.onAction}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer hover:underline"
            >
              <span>{current.actionLabel}</span>
              <ExternalLink size={12} />
            </button>
          )}

          {/* Next / Previous Controls */}
          <div className="flex items-center gap-2 ml-auto">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Anterior</span>
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
              >
                <span>Siguiente paso</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/25 cursor-pointer"
              >
                <Check size={14} />
                <span>¡Entendido! Entrar a la Barra</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
