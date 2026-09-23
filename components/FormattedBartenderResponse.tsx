import React, { useState } from 'react';
import { 
  Droplets, 
  Martini, 
  Wine, 
  ChefHat, 
  BookOpen, 
  Lightbulb, 
  Sparkles, 
  Copy, 
  Check, 
  Utensils, 
  ChevronRight,
  Eye,
  Camera,
  X
} from 'lucide-react';
import { DetectedCocktail } from '../types';

interface FormattedBartenderResponseProps {
  rawText: string;
  query?: string;
  cocktail?: DetectedCocktail | null;
}

type SectionType = 'intro' | 'ingredients' | 'glassware' | 'preparation' | 'history' | 'tip' | 'pairing' | 'general';

interface ParsedItem {
  type: 'p' | 'bullet' | 'step' | 'tip';
  number?: number;
  text: string;
}

interface ParsedSection {
  type: SectionType;
  title: string;
  items: ParsedItem[];
}

/**
 * Strips raw markdown symbols (#, *, ~, _, `) from inline strings
 * while converting **bold** and *italic* tokens into clean React nodes.
 */
export const renderCleanInlineText = (text: string): React.ReactNode => {
  if (!text) return null;

  // Pattern matches **bold**, *italic*, or `code`
  const tokenRegex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  const sanitizePlain = (str: string) => str.replace(/[*#_~`]/g, '');

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const plain = sanitizePlain(text.substring(lastIndex, match.index));
      if (plain) {
        nodes.push(plain);
      }
    }

    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      const content = sanitizePlain(token.slice(2, -2));
      if (content) {
        nodes.push(
          <strong key={`bold-${lastIndex}`} className="font-semibold text-amber-200">
            {content}
          </strong>
        );
      }
    } else if (token.startsWith('*') && token.endsWith('*')) {
      const content = sanitizePlain(token.slice(1, -1));
      if (content) {
        nodes.push(
          <em key={`italic-${lastIndex}`} className="italic text-slate-300">
            {content}
          </em>
        );
      }
    } else if (token.startsWith('`') && token.endsWith('`')) {
      const content = sanitizePlain(token.slice(1, -1));
      if (content) {
        nodes.push(
          <code key={`code-${lastIndex}`} className="bg-slate-800 text-amber-300 px-1 py-0.5 rounded text-xs font-mono">
            {content}
          </code>
        );
      }
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    const plain = sanitizePlain(text.substring(lastIndex));
    if (plain) {
      nodes.push(plain);
    }
  }

  return <>{nodes}</>;
};

/**
 * Splits ingredient item into Clean Name & Measure/Notes
 */
const splitIngredient = (text: string) => {
  const clean = text.replace(/^[#\*\-•]+\s*/, '').trim();
  const boldColonMatch = clean.match(/^\s*\*\*(.*?)\*\*:\s*(.*)$/);
  if (boldColonMatch) {
    return {
      name: boldColonMatch[1].replace(/[*#_~`]/g, '').trim(),
      detail: boldColonMatch[2].replace(/[*#_~`]/g, '').trim()
    };
  }
  const plainColonMatch = clean.match(/^\s*([^:]+):\s*(.*)$/);
  if (plainColonMatch) {
    return {
      name: plainColonMatch[1].replace(/[*#_~`]/g, '').trim(),
      detail: plainColonMatch[2].replace(/[*#_~`]/g, '').trim()
    };
  }
  return {
    name: clean.replace(/[*#_~`]/g, '').trim(),
    detail: ''
  };
};

/**
 * Splits step item into Step Title & Step Instruction
 */
const splitStep = (text: string) => {
  const clean = text.replace(/^\d+[\.\)]\s*/, '').trim();
  const boldColonMatch = clean.match(/^\s*\*\*(.*?)\*\*:\s*(.*)$/);
  if (boldColonMatch) {
    return {
      title: boldColonMatch[1].replace(/[*#_~`]/g, '').trim(),
      text: boldColonMatch[2].replace(/[*#_~`]/g, '').trim()
    };
  }
  const plainColonMatch = clean.match(/^\s*([^:]+):\s*(.*)$/);
  if (plainColonMatch && plainColonMatch[1].length < 35) {
    return {
      title: plainColonMatch[1].replace(/[*#_~`]/g, '').trim(),
      text: plainColonMatch[2].replace(/[*#_~`]/g, '').trim()
    };
  }
  return {
    title: '',
    text: clean.replace(/[*#_~`]/g, '').trim()
  };
};

/**
 * Splits tip item into Tip Title & Tip Content
 */
const splitTip = (text: string) => {
  const clean = text.replace(/^[#\*\-•]+\s*/, '').trim();
  const boldColonMatch = clean.match(/^\s*\*\*(.*?)\*\*:\s*(.*)$/);
  if (boldColonMatch) {
    return {
      title: boldColonMatch[1].replace(/[*#_~`]/g, '').trim(),
      text: boldColonMatch[2].replace(/[*#_~`]/g, '').trim()
    };
  }
  const plainColonMatch = clean.match(/^\s*([^:]+):\s*(.*)$/);
  if (plainColonMatch && plainColonMatch[1].length < 35) {
    return {
      title: plainColonMatch[1].replace(/[*#_~`]/g, '').trim(),
      text: plainColonMatch[2].replace(/[*#_~`]/g, '').trim()
    };
  }
  return {
    title: '',
    text: clean.replace(/[*#_~`]/g, '').trim()
  };
};

/**
 * Categorizes a section title into a semantic cocktail section type
 */
const detectSectionType = (title: string): SectionType => {
  const lower = title.toLowerCase();
  if (lower.includes('ingrediente') || lower.includes('proporci') || lower.includes('formula') || lower.includes('componente') || lower.includes('medida')) {
    return 'ingredients';
  }
  if (lower.includes('cristal') || lower.includes('vaso') || lower.includes('copa') || lower.includes('hielo') || lower.includes('herramienta') || lower.includes('equipo')) {
    return 'glassware';
  }
  if (lower.includes('paso') || lower.includes('preparaci') || lower.includes('elaboraci') || lower.includes('técnica') || lower.includes('tecnica') || lower.includes('método') || lower.includes('metodo') || lower.includes('instrucci')) {
    return 'preparation';
  }
  if (lower.includes('historia') || lower.includes('origen') || lower.includes('leyenda') || lower.includes('nacimiento') || lower.includes('curiosidad')) {
    return 'history';
  }
  if (lower.includes('consejo') || lower.includes('tip') || lower.includes('secreto') || lower.includes('nota') || lower.includes('recomendaci') || lower.includes('regla') || lower.includes('maestro')) {
    return 'tip';
  }
  if (lower.includes('maridaje') || lower.includes('acompaña') || lower.includes('degustaci')) {
    return 'pairing';
  }
  return 'general';
};

/**
 * Returns icon, theme colors and badge labels according to section type
 */
const getSectionMeta = (type: SectionType) => {
  switch (type) {
    case 'ingredients':
      return {
        icon: <Droplets size={17} className="text-amber-400" />,
        badge: 'Ingredientes & Medidas',
        badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        borderColor: 'border-amber-500/25',
      };
    case 'glassware':
      return {
        icon: <Martini size={17} className="text-cyan-400" />,
        badge: 'Cristalería & Hielo',
        badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
        borderColor: 'border-cyan-500/25',
      };
    case 'preparation':
      return {
        icon: <ChefHat size={17} className="text-emerald-400" />,
        badge: 'Técnica & Preparación',
        badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        borderColor: 'border-emerald-500/25',
      };
    case 'history':
      return {
        icon: <BookOpen size={17} className="text-rose-400" />,
        badge: 'Historia & Notas',
        badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        borderColor: 'border-rose-500/25',
      };
    case 'tip':
      return {
        icon: <Lightbulb size={17} className="text-amber-300" />,
        badge: 'Consejos del Maestro',
        badgeColor: 'bg-amber-400/15 text-amber-300 border-amber-400/40',
        borderColor: 'border-amber-500/30',
      };
    case 'pairing':
      return {
        icon: <Utensils size={17} className="text-purple-400" />,
        badge: 'Maridaje Sugerido',
        badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
        borderColor: 'border-purple-500/25',
      };
    default:
      return {
        icon: <Sparkles size={17} className="text-amber-400" />,
        badge: 'Mixología',
        badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
        borderColor: 'border-slate-800',
      };
  }
};

/**
 * Main parser that translates raw response into structured sections
 */
const parseBartenderResponse = (raw: string): ParsedSection[] => {
  const lines = raw.split('\n');
  const sections: ParsedSection[] = [];
  let currentSection: ParsedSection = { type: 'intro', title: '', items: [] };

  for (let rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed) continue;

    // Discard markdown dividers: --- or *** or ___
    if (/^(\-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      continue;
    }

    // Check for markdown headers like ### Header or ## Header
    const headerMatch = trimmed.match(/^#{1,6}\s*(.*)$/);
    if (headerMatch) {
      if (currentSection.items.length > 0 || currentSection.title) {
        sections.push(currentSection);
      }
      const title = headerMatch[1].replace(/[*#_~`]/g, '').trim();
      currentSection = {
        type: detectSectionType(title),
        title,
        items: []
      };
      continue;
    }

    // Check for standalone bold headers like **Ingredientes:** or **Preparación:**
    const boldHeaderMatch = trimmed.match(/^\s*\*\*([^*]{3,45})\*\*:?\s*$/);
    if (boldHeaderMatch && !/^\s*\*\*(Consejo|Tip|Nota)/i.test(trimmed)) {
      if (currentSection.items.length > 0 || currentSection.title) {
        sections.push(currentSection);
      }
      const title = boldHeaderMatch[1].replace(/[:*#_~`]/g, '').trim();
      currentSection = {
        type: detectSectionType(title),
        title,
        items: []
      };
      continue;
    }

    // Check for Callout / Tips like "**Consejo de Maestro:** ..." or "Tip: ..."
    if (/^\s*(\*\*|\*)?(Consejo|Tip|Nota|Recomendación|Regla de oro|Secreto)/i.test(trimmed)) {
      currentSection.items.push({
        type: 'tip',
        text: trimmed
      });
      continue;
    }

    // Check for numbered steps: 1. Step, 2. Step
    const numberMatch = trimmed.match(/^(\d+)[\.\)]\s+(.*)$/);
    if (numberMatch) {
      currentSection.items.push({
        type: 'step',
        number: parseInt(numberMatch[1], 10),
        text: numberMatch[2]
      });
      continue;
    }

    // Check for bullet list items: * item, - item, • item
    const bulletMatch = trimmed.match(/^[\*\-\•]\s+(.*)$/);
    if (bulletMatch) {
      currentSection.items.push({
        type: 'bullet',
        text: bulletMatch[1]
      });
      continue;
    }

    // Regular paragraph
    currentSection.items.push({
      type: 'p',
      text: trimmed
    });
  }

  if (currentSection.items.length > 0 || currentSection.title) {
    sections.push(currentSection);
  }

  return sections;
};

export const FormattedBartenderResponse: React.FC<FormattedBartenderResponseProps> = ({ 
  rawText, 
  query,
  cocktail
}) => {
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const sections = parseBartenderResponse(rawText);

  const handleCopy = () => {
    // Copy clean readable text without markdown symbols
    const cleanText = rawText
      .replace(/^[#\*\-•]+\s*/gm, '')
      .replace(/[*#_~`]/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    navigator.clipboard.writeText(cleanText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasDetectedCocktail = Boolean(cocktail && cocktail.isElaborating && cocktail.imageUrl && !imageError);

  return (
    <div className="space-y-5">
      {/* Top action bar: Query & Clean Copy */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-slate-400 truncate max-w-md">
          <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 animate-pulse" />
          <span className="text-slate-500">Consulta:</span>
          <span className="text-slate-300 font-medium truncate italic">
            "{query || 'Mixología y Coctelería'}"
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-amber-400 border border-slate-700/80 transition-colors shrink-0 shadow-sm"
          title="Copiar respuesta limpia sin símbolos de formato"
        >
          {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          <span className="font-medium">{copied ? '¡Copiado!' : 'Copiar receta'}</span>
        </button>
      </div>

      {/* COCKTAIL PRESENTATION CARD: Displayed when AI detects cocktail elaboration */}
      {hasDetectedCocktail && cocktail && (
        <div className="relative rounded-2xl overflow-hidden border border-amber-500/40 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-xl shadow-black/40 group">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
            {/* Cocktail Photo */}
            <div className="relative md:col-span-5 h-56 md:h-auto overflow-hidden bg-slate-950">
              <img 
                src={cocktail.imageUrl} 
                alt={cocktail.name} 
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                onClick={() => setIsZoomed(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />
              
              {/* Badge over photo */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-400/40 text-[11px] font-semibold text-amber-300">
                <Sparkles size={12} className="animate-spin text-amber-400" />
                <span>Cóctel Elaborado</span>
              </div>

              {/* Zoom action button */}
              <button 
                onClick={() => setIsZoomed(true)}
                className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-slate-300 hover:text-amber-300 border border-white/10 backdrop-blur-sm transition-all"
                title="Ampliar presentación del cóctel"
              >
                <Eye size={14} />
              </button>
            </div>

            {/* Cocktail Details & Specifications */}
            <div className="md:col-span-7 p-4 sm:p-5 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/25">
                    {cocktail.category || 'Coctelería de Autor'}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Camera size={11} className="text-slate-500" />
                    {cocktail.source === 'database' ? 'Receta de Nuestra Barra' :
                     cocktail.source === 'cocktaildb' ? 'Fotografía de Archivo Mixológico' :
                     'Presentación Generada por IA'}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                  {cocktail.name}
                </h3>
              </div>

              {/* Fast specs pills */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {cocktail.glass && (
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/90 border border-cyan-500/20 text-cyan-200">
                    <Martini size={15} className="text-cyan-400 shrink-0" />
                    <div className="truncate">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Cristal</p>
                      <p className="font-medium truncate text-cyan-200">{cocktail.glass}</p>
                    </div>
                  </div>
                )}
                {cocktail.garnish && (
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/90 border border-amber-500/20 text-amber-200">
                    <Sparkles size={15} className="text-amber-400 shrink-0" />
                    <div className="truncate">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Decoración</p>
                      <p className="font-medium truncate text-amber-200">{cocktail.garnish}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="italic flex items-center gap-1 text-slate-400">
                  <Wine size={13} className="text-amber-400" />
                  Listo para servir con técnica profesional
                </span>
                <button
                  onClick={() => setIsZoomed(true)}
                  className="text-amber-400 hover:text-amber-300 text-xs font-semibold flex items-center gap-1"
                >
                  Ver foto
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Render Sections */}
      {sections.map((section, sIdx) => {
        const meta = getSectionMeta(section.type);

        // Intro section: Opening greeting and context
        if (section.type === 'intro' && !section.title) {
          return (
            <div key={sIdx} className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-4 md:p-5 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
                <Sparkles size={14} />
                <span>Palabra de Maestro</span>
              </div>
              <div className="space-y-2 text-slate-200 leading-relaxed text-sm md:text-base">
                {section.items.map((item, iIdx) => (
                  <p key={iIdx} className="leading-relaxed">
                    {renderCleanInlineText(item.text)}
                  </p>
                ))}
              </div>
            </div>
          );
        }

        return (
          <div 
            key={sIdx} 
            className={`rounded-2xl border ${meta.borderColor} bg-slate-900/80 p-4 md:p-5 space-y-4 shadow-lg shadow-black/20`}
          >
            {/* Section Header with Icon and Badge */}
            {section.title && (
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-800/80">
                <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 shadow-inner">
                  {meta.icon}
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-slate-100 flex items-center gap-2">
                    {section.title.replace(/[*#_~`]/g, '')}
                  </h3>
                </div>
                <span className={`ml-auto text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${meta.badgeColor} hidden sm:inline-block`}>
                  {meta.badge}
                </span>
              </div>
            )}

            {/* Section Content Layouts */}
            <div>
              {/* Ingredients Layout */}
              {section.type === 'ingredients' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {section.items.map((item, iIdx) => {
                    const { name, detail } = splitIngredient(item.text);

                    return (
                      <div 
                        key={iIdx}
                        className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-amber-500/30 transition-all group"
                      >
                        <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                          <Droplets size={13} />
                        </div>
                        <div className="text-xs sm:text-sm leading-snug">
                          <p className="font-semibold text-amber-200">
                            {name}
                          </p>
                          {detail && (
                            <p className="text-slate-300 mt-0.5 text-xs">
                              {detail}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : section.type === 'glassware' ? (
                /* Glassware & Ice Layout */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {section.items.map((item, iIdx) => {
                    const { name, detail } = splitIngredient(item.text);

                    return (
                      <div 
                        key={iIdx}
                        className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-cyan-500/20 hover:border-cyan-500/40 transition-all"
                      >
                        <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Martini size={13} />
                        </div>
                        <div className="text-xs sm:text-sm leading-snug">
                          <p className="font-semibold text-cyan-200">
                            {name}
                          </p>
                          {detail && (
                            <p className="text-slate-300 mt-0.5 text-xs">
                              {detail}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : section.type === 'preparation' ? (
                /* Numbered Step-by-Step Preparation Layout */
                <div className="space-y-3">
                  {section.items.map((item, iIdx) => {
                    const stepNumber = item.number || (iIdx + 1);
                    const { title, text } = splitStep(item.text);

                    return (
                      <div 
                        key={iIdx}
                        className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-emerald-500/30 transition-all"
                      >
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">
                          {stepNumber}
                        </div>
                        <div className="text-xs sm:text-sm text-slate-200 leading-relaxed pt-0.5">
                          {title && (
                            <span className="font-bold text-amber-200 mr-1.5">
                              {title}:
                            </span>
                          )}
                          <span className="text-slate-200">
                            {text}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : section.type === 'tip' ? (
                /* Tips / Maestro Secrets Layout */
                <div className="space-y-3">
                  {section.items.map((item, iIdx) => {
                    const { title, text } = splitTip(item.text);

                    return (
                      <div 
                        key={iIdx}
                        className="flex items-start gap-3.5 p-3.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-slate-950/50 border border-amber-500/35 text-amber-100 shadow-sm"
                      >
                        <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/30">
                          <Lightbulb size={15} />
                        </div>
                        <div className="text-xs sm:text-sm leading-relaxed">
                          {title && (
                            <p className="font-bold text-amber-300 mb-0.5">
                              {title}
                            </p>
                          )}
                          <p className="text-amber-100/90">
                            {text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Standard Section Items with custom item styling */
                <div className="space-y-2.5">
                  {section.items.map((item, iIdx) => {
                    // Check if it's a Callout / Tip
                    if (item.type === 'tip') {
                      const { title, text } = splitTip(item.text);
                      return (
                        <div 
                          key={iIdx}
                          className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-100"
                        >
                          <div className="p-1 rounded-md bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                            <Lightbulb size={15} />
                          </div>
                          <div className="text-xs sm:text-sm leading-relaxed text-amber-100/90">
                            {title && <span className="font-bold text-amber-300 mr-1">{title}:</span>}
                            <span>{text}</span>
                          </div>
                        </div>
                      );
                    }

                    // Bullet item
                    if (item.type === 'bullet') {
                      const { name, detail } = splitIngredient(item.text);
                      return (
                        <div key={iIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                          <ChevronRight size={14} className="text-amber-400 shrink-0 mt-0.5" />
                          <div className="leading-relaxed">
                            {detail ? (
                              <>
                                <span className="font-semibold text-amber-200">{name}:</span>
                                <span className="text-slate-300 ml-1">{detail}</span>
                              </>
                            ) : (
                              <span>{name}</span>
                            )}
                          </div>
                        </div>
                      );
                    }

                    // Regular paragraph
                    return (
                      <p key={iIdx} className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {renderCleanInlineText(item.text)}
                      </p>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Full-view Zoom Modal for the Cocktail Image */}
      {isZoomed && hasDetectedCocktail && cocktail && (
        <div 
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg w-full bg-slate-900 border border-amber-500/40 rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="relative h-80 sm:h-96 w-full bg-black">
              <img 
                src={cocktail.imageUrl} 
                alt={cocktail.name} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <button 
                onClick={() => setIsZoomed(false)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/70 hover:bg-black text-white transition-colors"
                title="Cerrar vista"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-4 bg-slate-950 flex items-center justify-between">
              <div>
                <h4 className="text-lg font-serif font-bold text-amber-300">
                  {cocktail.name}
                </h4>
                <p className="text-xs text-slate-400">
                  {cocktail.glass} · {cocktail.garnish}
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {cocktail.category}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
