import React from 'react';
import { VisualTheme } from '../types/game';
import { VISUAL_THEMES } from '../data/themeData';
import { sound } from '../utils/audio';
import { 
  X, Check, Palette, Moon, Sun, Compass, Terminal, Sparkles
} from 'lucide-react';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: VisualTheme;
  onSelectTheme: (theme: VisualTheme) => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme
}) => {
  if (!isOpen) return null;

  const getThemeIcon = (themeId: VisualTheme) => {
    switch (themeId) {
      case 'dark':
        return <Moon className="w-5 h-5 text-amber-400" />;
      case 'light':
        return <Sun className="w-5 h-5 text-blue-500" />;
      case 'blueprint':
        return <Compass className="w-5 h-5 text-cyan-400" />;
      case 'amber':
        return <Terminal className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#12161e] border border-[#2a3545] rounded-2xl shadow-2xl text-zinc-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222b37] bg-[#0c1017]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Personalización HMI / SCADA</span>
              </div>
              <h2 className="text-lg font-bold text-white">
                Estilos Visuales de Planta Industrial
              </h2>
            </div>
          </div>

          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-[#1a2330] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list of themes */}
        <div className="p-6 overflow-y-auto space-y-4">
          <p className="text-xs text-zinc-400 font-mono">
            Selecciona el entorno cromático para la simulación. Todos los estilos mantienen la rigurosidad técnica, diagramas de maquinaria y telemetría en tiempo real:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {VISUAL_THEMES.map((theme) => {
              const isSelected = currentTheme === theme.id;

              return (
                <div
                  key={theme.id}
                  onClick={() => {
                    sound.playClick();
                    onSelectTheme(theme.id);
                  }}
                  className={`group relative p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between overflow-hidden ${
                    isSelected 
                      ? 'border-amber-500 bg-[#17202c] shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/50' 
                      : 'border-[#263140] bg-[#141a24] hover:border-[#38485c] hover:bg-[#18212e]'
                  }`}
                  style={{
                    backgroundColor: isSelected ? undefined : undefined
                  }}
                >
                  {/* Miniature Visual Mockup */}
                  <div 
                    className="w-full h-20 rounded-lg border mb-3 p-2.5 flex flex-col justify-between overflow-hidden relative"
                    style={{
                      backgroundColor: theme.previewBg,
                      borderColor: theme.previewBorder
                    }}
                  >
                    {/* Simulated header bar inside mini mockup */}
                    <div className="flex items-center justify-between border-b pb-1.5" style={{ borderColor: theme.previewBorder }}>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.previewAccent }}></div>
                        <span className="text-[10px] font-mono font-bold" style={{ color: theme.previewText }}>
                          PLANT_SCADA
                        </span>
                      </div>
                      <span className="text-[8px] font-mono px-1 rounded" style={{ backgroundColor: theme.previewBorder, color: theme.previewText }}>
                        OEE 84.2%
                      </span>
                    </div>

                    {/* Simulated pipeline & gauge inside mockup */}
                    <div className="flex items-center justify-between text-[9px] font-mono pt-1">
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: theme.previewAccent }}></div>
                        <span style={{ color: theme.previewAccent }}>MAQ_01: RUN</span>
                      </div>
                      <div className="h-1.5 w-14 rounded-full overflow-hidden" style={{ backgroundColor: theme.previewBorder }}>
                        <div className="h-full rounded-full" style={{ width: '75%', backgroundColor: theme.previewAccent }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Theme Info */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        {getThemeIcon(theme.id)}
                        <h3 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                          {theme.name}
                        </h3>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold border"
                        style={{
                          backgroundColor: `${theme.accent}15`,
                          color: theme.accent,
                          borderColor: `${theme.accent}40`
                        }}
                      >
                        {theme.badge}
                      </span>
                    </div>

                    <p className="text-[11px] font-mono text-zinc-400 mb-2">
                      {theme.tagline}
                    </p>

                    <p className="text-xs text-zinc-300/80 leading-relaxed line-clamp-2">
                      {theme.description}
                    </p>
                  </div>

                  {/* Active Indicator checkmark */}
                  {isSelected && (
                    <div className="mt-3 pt-2 border-t border-amber-500/30 flex items-center justify-between text-xs font-mono font-bold text-amber-400">
                      <span className="flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        <span>Activo</span>
                      </span>
                      <span className="text-[10px] opacity-75">Configuración Aplicada</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#222b37] bg-[#0c1017] flex items-center justify-between">
          <span className="text-xs font-mono text-zinc-500">
            El tema se guarda automáticamente en tu navegador.
          </span>
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-lg transition-colors font-mono cursor-pointer"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
