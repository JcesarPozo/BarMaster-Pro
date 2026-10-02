import React, { useState } from 'react';
import { ShieldCheck, Copyright, Sparkles, Heart } from 'lucide-react';

export const FooterSignature: React.FC = () => {
  const [imgError, setImgError] = useState(false);

  return (
    <footer className="border-t border-slate-850 bg-gradient-to-b from-slate-950 via-slate-950 to-black pt-14 pb-12 px-6 sm:px-8 mt-16 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Main Signature Block */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-slate-800/80">
          
          {/* Brand Signature: Logo + Name */}
          <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 sm:gap-5">
            {/* Logo Emblem from User */}
            <div className="relative group shrink-0">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden bg-slate-900 border border-slate-700/80 shadow-2xl shadow-black/80 flex items-center justify-center p-1 group-hover:border-amber-500/50 transition-all duration-300">
                {!imgError ? (
                  <img
                    src="/assets/images/logo_borrachos_y_mas.jpg"
                    alt="Logo Borrach@s y mas..."
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-amber-400 font-serif font-bold text-lg">
                    B&M
                  </div>
                )}
              </div>
              {/* Subtle amber ambient glow behind the logo */}
              <div className="absolute inset-0 bg-amber-500/10 rounded-2xl blur-lg -z-10 group-hover:bg-amber-500/20 transition-colors pointer-events-none" />
            </div>

            {/* Signature Titles */}
            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Firma Oficial
                </span>
                <span className="text-slate-500 text-[11px]">·</span>
                <span className="text-slate-400 text-[11px]">Mixología & Cultura de Barra</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                Borrach@s y mas...
              </h3>
              <p className="text-xs text-slate-400 font-light max-w-sm">
                Pasión por el buen beber, la coctelería clásica y las creaciones de autor.
              </p>
            </div>
          </div>

          {/* Reserved Rights Seal (Sello de Derechos Reservados) */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right space-y-2">
            <div className="inline-flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2 shadow-inner">
              <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
              <div className="text-left">
                <p className="text-[11px] font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1">
                  <span>Sello de Derechos Reservados</span>
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  Certificación de Marca & Contenido Registrado
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-400 flex items-center gap-1.5 pt-1">
              <Copyright size={13} className="text-slate-500 shrink-0" />
              <span>{new Date().getFullYear()} <strong>Borrach@s y mas...</strong> Todos los derechos reservados.</span>
            </div>
          </div>

        </div>

        {/* Lower Sub-Footer: BarMaster Pro info & Responsible Consumption */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-300">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-slate-300">BarMaster Pro</span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <span className="text-amber-400 font-sans">Desarrollado para amantes de la alta mixología</span>
          </div>

          <p className="text-center sm:text-right text-slate-400">
            Disfrute con responsabilidad. Prohibida la venta a menores de edad según la legislación local vigente.
          </p>
        </div>

      </div>
    </footer>
  );
};
