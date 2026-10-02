import React from 'react';
import { DetectedCocktail } from '../types';
import { Sparkles, Layers, Droplets } from 'lucide-react';

interface CocktailVisualizerProps {
  cocktail: DetectedCocktail;
}

export const CocktailVisualizer: React.FC<CocktailVisualizerProps> = ({ cocktail }) => {
  const profile = cocktail.visualProfile || {
    archetypeId: 'amber',
    primaryColor: '#d97706',
    secondaryColor: '#92400e',
    liquidName: 'Ámbar Especiado',
    iceStyle: 'Cubos cristalinos',
    technique: 'Agitado'
  };

  const layers = cocktail.extractedIngredients || [];
  const glassName = cocktail.glass?.toLowerCase() || '';

  // Glass profile type
  const isCoupeOrMartini = glassName.includes('coup') || glassName.includes('martini') || glassName.includes('nick');
  const isHighball = glassName.includes('highball') || glassName.includes('collins') || glassName.includes('alto');
  const isFlute = glassName.includes('flauta') || glassName.includes('flute');
  const isHurricane = glassName.includes('hurac');
  // Default is rocks / old fashioned

  const hasFoam = profile.hasFoam || profile.isCreamy;
  const hasBubbles = profile.hasBubbles;
  const isCrushedIce = profile.iceStyle?.toLowerCase().includes('picado') || profile.iceStyle?.toLowerCase().includes('frapp');
  const hasIce = !profile.iceStyle?.toLowerCase().includes('sin hielo');

  return (
    <div className="w-full h-full min-h-[220px] p-4 flex flex-col justify-between bg-gradient-to-b from-slate-900 via-slate-950 to-black text-slate-100 relative overflow-hidden select-none">
      {/* Background ambient liquid glow */}
      <div 
        className="absolute -top-10 -left-10 w-44 h-44 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: profile.primaryColor }}
      />
      <div 
        className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: profile.secondaryColor }}
      />

      {/* Header Info */}
      <div className="flex items-center justify-between text-xs z-10 border-b border-slate-800/80 pb-2">
        <div className="flex items-center gap-1.5">
          <Layers size={13} className="text-amber-400" />
          <span className="font-semibold text-amber-200">Diagrama Técnico de Capas</span>
        </div>
        <span 
          className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-slate-700 bg-slate-850"
          style={{ color: profile.secondaryColor }}
        >
          {profile.liquidName}
        </span>
      </div>

      {/* Center Illustrated Glass */}
      <div className="flex-1 flex items-center justify-center my-3 relative">
        <svg 
          viewBox="0 0 200 190" 
          className="w-48 h-44 drop-shadow-[0_10px_15px_rgba(0,0,0,0.6)]"
        >
          <defs>
            {/* Liquid Linear Gradient */}
            <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={profile.secondaryColor} stopOpacity="0.95" />
              <stop offset="60%" stopColor={profile.primaryColor} stopOpacity="0.9" />
              <stop offset="100%" stopColor={profile.secondaryColor} stopOpacity="0.95" />
            </linearGradient>

            {/* Glass Rim Reflection */}
            <linearGradient id="glassReflect" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="25%" stopColor="#ffffff" stopOpacity="0.05" />
              <stop offset="75%" stopColor="#38bdf8" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
            </linearGradient>

            {/* Foam Gradient */}
            <linearGradient id="foamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#fef3c7" stopOpacity="0.75" />
            </linearGradient>
          </defs>

          {/* Conditional Glass Rendering based on detected glassware */}
          {isCoupeOrMartini ? (
            /* Stemmed Coupe / Martini */
            <g>
              {/* Liquid Body */}
              <path 
                d="M 45 42 Q 100 115 155 42 Z" 
                fill="url(#liquidGrad)" 
              />
              {/* Optional Foam Head */}
              {hasFoam && (
                <path 
                  d="M 45 42 Q 100 48 155 42 Q 100 37 45 42 Z" 
                  fill="url(#foamGrad)" 
                />
              )}
              {/* Glass Outline & Stem */}
              <path 
                d="M 40 40 Q 100 120 160 40" 
                fill="none" 
                stroke="url(#glassReflect)" 
                strokeWidth="3.5" 
                strokeLinecap="round"
              />
              {/* Stem */}
              <line x1="100" y1="110" x2="100" y2="165" stroke="url(#glassReflect)" strokeWidth="3.5" strokeLinecap="round" />
              {/* Base */}
              <path d="M 68 165 Q 100 162 132 165" fill="none" stroke="url(#glassReflect)" strokeWidth="4" strokeLinecap="round" />
              {/* Garnish on rim */}
              <circle cx="155" cy="40" r="11" fill="#f59e0b" stroke="#78350f" strokeWidth="2" opacity="0.9" />
              <circle cx="155" cy="40" r="8" fill="#fbbf24" opacity="0.8" />
            </g>
          ) : isHighball ? (
            /* Highball / Collins Glass */
            <g>
              {/* Liquid Body */}
              <rect 
                x="65" 
                y="38" 
                width="70" 
                height="115" 
                rx="6" 
                fill="url(#liquidGrad)" 
              />
              {/* Ice Cubes */}
              {hasIce && (
                <>
                  <rect x="75" y="52" width="22" height="22" rx="4" fill="#ffffff" fillOpacity="0.25" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.4" />
                  <rect x="103" y="75" width="22" height="22" rx="4" fill="#ffffff" fillOpacity="0.25" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.4" />
                  <rect x="75" y="105" width="22" height="22" rx="4" fill="#ffffff" fillOpacity="0.25" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.4" />
                </>
              )}
              {/* Effervescence Bubbles */}
              {hasBubbles && (
                <>
                  <circle cx="85" cy="130" r="2.5" fill="#ffffff" opacity="0.7" />
                  <circle cx="115" cy="115" r="2" fill="#ffffff" opacity="0.6" />
                  <circle cx="95" cy="90" r="3" fill="#ffffff" opacity="0.8" />
                  <circle cx="108" cy="65" r="2" fill="#ffffff" opacity="0.7" />
                  <circle cx="80" cy="48" r="2.5" fill="#ffffff" opacity="0.9" />
                </>
              )}
              {/* Foam on Top */}
              {hasFoam && (
                <rect x="65" y="38" width="70" height="14" rx="4" fill="url(#foamGrad)" />
              )}
              {/* Glass Outline */}
              <rect 
                x="63" 
                y="30" 
                width="74" 
                height="130" 
                rx="7" 
                fill="none" 
                stroke="url(#glassReflect)" 
                strokeWidth="3.5" 
              />
              {/* Straw */}
              <line x1="88" y1="18" x2="112" y2="150" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
            </g>
          ) : isFlute ? (
            /* Champagne Flute */
            <g>
              <path d="M 80 32 L 80 115 Q 100 135 120 115 L 120 32 Z" fill="url(#liquidGrad)" />
              {/* Bubbles stream */}
              <circle cx="100" cy="110" r="1.5" fill="#fff" opacity="0.8" />
              <circle cx="98" cy="90" r="1.5" fill="#fff" opacity="0.8" />
              <circle cx="102" cy="70" r="2" fill="#fff" opacity="0.9" />
              <circle cx="99" cy="50" r="2" fill="#fff" opacity="0.9" />
              <circle cx="101" cy="35" r="2.5" fill="#fff" opacity="1" />
              {/* Outline */}
              <path d="M 77 30 L 77 115 Q 100 140 123 115 L 123 30" fill="none" stroke="url(#glassReflect)" strokeWidth="3" />
              <line x1="100" y1="135" x2="100" y2="170" stroke="url(#glassReflect)" strokeWidth="3.5" />
              <path d="M 76 170 Q 100 167 124 170" fill="none" stroke="url(#glassReflect)" strokeWidth="4" />
            </g>
          ) : isHurricane ? (
            /* Hurricane Glass */
            <g>
              <path d="M 68 40 Q 60 70 75 95 Q 85 110 82 125 L 118 125 Q 115 110 125 95 Q 140 70 132 40 Z" fill="url(#liquidGrad)" />
              {hasFoam && (
                <ellipse cx="100" cy="42" rx="30" ry="6" fill="url(#foamGrad)" />
              )}
              <path d="M 65 38 Q 57 70 73 95 Q 83 110 80 130 L 120 130 Q 117 110 127 95 Q 143 70 135 38" fill="none" stroke="url(#glassReflect)" strokeWidth="3.5" />
              <line x1="100" y1="130" x2="100" y2="165" stroke="url(#glassReflect)" strokeWidth="4" />
              <path d="M 72 165 Q 100 162 128 165" fill="none" stroke="url(#glassReflect)" strokeWidth="4" />
              {/* Cherry garnish */}
              <circle cx="132" cy="36" r="8" fill="#dc2626" />
            </g>
          ) : (
            /* Default: Rocks / Old Fashioned Glass */
            <g>
              {/* Liquid Body */}
              <rect 
                x="58" 
                y="55" 
                width="84" 
                height="80" 
                rx="6" 
                fill="url(#liquidGrad)" 
              />
              {/* Giant Clear Ice Cube */}
              {hasIce && (
                <rect 
                  x="76" 
                  y="68" 
                  width="48" 
                  height="48" 
                  rx="6" 
                  fill="#ffffff" 
                  fillOpacity="0.22" 
                  stroke="#ffffff" 
                  strokeWidth="1.5" 
                  strokeOpacity="0.45" 
                />
              )}
              {/* Foam on top if sour/froth */}
              {hasFoam && (
                <rect x="58" y="55" width="84" height="14" rx="4" fill="url(#foamGrad)" />
              )}
              {/* Glass Outline */}
              <rect 
                x="54" 
                y="48" 
                width="92" 
                height="96" 
                rx="8" 
                fill="none" 
                stroke="url(#glassReflect)" 
                strokeWidth="3.5" 
              />
              {/* Orange peel twist */}
              <path 
                d="M 52 46 Q 60 40 68 47 Q 76 54 84 48" 
                fill="none" 
                stroke="#f97316" 
                strokeWidth="4" 
                strokeLinecap="round" 
              />
            </g>
          )}
        </svg>
      </div>

      {/* Layer Components Breakdown */}
      {layers.length > 0 && (
        <div className="z-10 bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 text-[11px] space-y-1.5">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
            <Droplets size={10} className="text-amber-400" />
            <span>Capas e Ingredientes Estimados</span>
          </p>
          <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
            {layers.map((layer, idx) => (
              <div key={idx} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 truncate">
                  <span 
                    className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/20"
                    style={{ backgroundColor: layer.color }}
                  />
                  <span className="text-slate-200 truncate">{layer.name}</span>
                </div>
                {layer.amount && (
                  <span className="text-amber-300 font-mono text-[10px] shrink-0">
                    {layer.amount}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Technical Spec Footer */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 z-10 border-t border-slate-800/60 mt-1">
        <span>Técnica: <strong className="text-slate-300">{profile.technique || 'Agitado'}</strong></span>
        <span>Hielo: <strong className="text-slate-300">{profile.iceStyle || 'Cubos'}</strong></span>
      </div>
    </div>
  );
};
