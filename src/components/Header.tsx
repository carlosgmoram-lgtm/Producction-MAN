import React from 'react';
import { Play, Pause, FastForward, AlertTriangle, ShieldCheck, DollarSign, Activity, FileText, Palette, Moon, Sun, Compass, Terminal, Users, User } from 'lucide-react';
import { PlantIndicators, VisualTheme, PlantRoleId } from '../types/game';
import { getRoleById } from '../data/rolesData';
import { sound } from '../utils/audio';

interface HeaderProps {
  currentTab: 'plant' | 'kpis' | 'methodologies' | 'maintenance' | 'training' | 'meeting' | 'log' | 'cases';
  setCurrentTab: (tab: 'plant' | 'kpis' | 'methodologies' | 'maintenance' | 'training' | 'meeting' | 'log' | 'cases') => void;
  day: number;
  hour: number;
  isSimulating: boolean;
  simSpeed: number;
  onToggleSimulate: () => void;
  onSetSpeed: (speed: number) => void;
  indicators: PlantIndicators;
  activeDilemmasCount: number;
  activeImplementationsCount?: number;
  activeTrainingPlansCount?: number;
  onOpenMeeting: () => void;
  onOpenEndDay: () => void;
  onOpenBriefing: () => void;
  onBackToTitle?: () => void;
  onOpenReport: () => void;
  currentTheme?: VisualTheme;
  onOpenThemeSelector?: () => void;
  currentRole?: PlantRoleId;
  onOpenRoleSelector?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  day,
  hour,
  isSimulating,
  simSpeed,
  onToggleSimulate,
  onSetSpeed,
  indicators,
  activeDilemmasCount,
  activeImplementationsCount = 0,
  activeTrainingPlansCount = 0,
  onOpenMeeting,
  onOpenEndDay,
  onOpenBriefing,
  onBackToTitle,
  onOpenReport,
  currentTheme = 'dark',
  onOpenThemeSelector,
  currentRole = 'GERENTE_PLANTA',
  onOpenRoleSelector
}) => {
  const formattedTime = `${hour.toString().padStart(2, '0')}:00 hrs`;
  const isShiftEnd = hour >= 18;
  const activeRoleDef = getRoleById(currentRole);

  return (
    <header className="sticky top-0 z-30 bg-[#10151c]/95 backdrop-blur-md border-b border-[#242e3b] text-zinc-100">
      {/* Primary Top Bar Contract: 3 zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Zone 1: Single text wordmark with industrial badge + Role Badge */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-bold text-zinc-950 text-sm shadow-inner font-mono">
            II
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap font-sans">
            Production Man <span className="text-amber-400 font-normal text-xs sm:text-sm hidden md:inline font-mono">· SCADA Ops</span>
          </span>

          {onOpenRoleSelector && (
            <button
              onClick={() => { sound.playClick(); onOpenRoleSelector(); }}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-[#171e27] hover:bg-[#202936] border border-[#2a3749] hover:border-amber-500/50 rounded-lg text-xs font-mono transition-all cursor-pointer shadow-sm group"
              title={`Cargo Activo: ${activeRoleDef.name} (${activeRoleDef.characterName}). Haz clic para cambiar de rol.`}
            >
              <div className={`w-5 h-5 rounded bg-gradient-to-br ${activeRoleDef.avatarColor} text-white font-bold flex items-center justify-center text-[10px] shadow-xs`}>
                {activeRoleDef.avatarInitials}
              </div>
              <span className="text-zinc-200 group-hover:text-amber-300 font-medium hidden sm:inline">
                {activeRoleDef.name.split(' ')[0]}
              </span>
              <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1 rounded border border-amber-500/20">
                ROL
              </span>
            </button>
          )}
        </div>

        {/* Zone 2: Navigation Links (Clean text with active indicator) */}
        <nav className="hidden xl:flex items-center gap-5 text-xs sm:text-sm font-medium text-zinc-400 font-mono">
          <button
            onClick={() => { sound.playClick(); setCurrentTab('plant'); }}
            className={`transition-colors pb-0.5 ${currentTab === 'plant' ? 'text-amber-400 font-semibold border-b-2 border-amber-400' : 'hover:text-zinc-100'}`}
          >
            Planta en Vivo
          </button>
          <button
            onClick={() => { sound.playClick(); setCurrentTab('kpis'); }}
            className={`transition-colors pb-0.5 ${currentTab === 'kpis' ? 'text-amber-400 font-semibold border-b-2 border-amber-400' : 'hover:text-zinc-100'}`}
          >
            Indicadores (OEE)
          </button>
          <button
            onClick={() => { sound.playClick(); setCurrentTab('methodologies'); }}
            className={`transition-colors pb-0.5 relative ${currentTab === 'methodologies' ? 'text-amber-400 font-semibold border-b-2 border-amber-400' : 'hover:text-zinc-100'}`}
          >
            Metodologías
            {activeImplementationsCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 text-[10px] font-bold bg-amber-500 text-zinc-950 rounded">
                {activeImplementationsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => { sound.playClick(); setCurrentTab('maintenance'); }}
            className={`transition-colors pb-0.5 ${currentTab === 'maintenance' ? 'text-amber-400 font-semibold border-b-2 border-amber-400' : 'hover:text-zinc-100'}`}
          >
            Mantenimiento
          </button>
          <button
            onClick={() => { sound.playClick(); setCurrentTab('training'); }}
            className={`transition-colors pb-0.5 relative ${currentTab === 'training' ? 'text-amber-400 font-semibold border-b-2 border-amber-400' : 'hover:text-zinc-100'}`}
          >
            Capacitación
            {activeTrainingPlansCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 text-[10px] font-bold bg-emerald-500 text-zinc-950 rounded">
                {activeTrainingPlansCount}
              </span>
            )}
          </button>
          <button
            onClick={() => { sound.playClick(); setCurrentTab('meeting'); }}
            className={`transition-colors pb-0.5 relative ${currentTab === 'meeting' ? 'text-amber-400 font-semibold border-b-2 border-amber-400' : 'hover:text-zinc-100'}`}
          >
            Comité Diario
            {activeDilemmasCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 text-[10px] font-bold bg-rose-600 text-white rounded">
                {activeDilemmasCount}
              </span>
            )}
          </button>
          <button
            onClick={() => { sound.playClick(); setCurrentTab('log'); }}
            className={`transition-colors pb-0.5 ${currentTab === 'log' ? 'text-amber-400 font-semibold border-b-2 border-amber-400' : 'hover:text-zinc-100'}`}
          >
            Bitácora
          </button>
          <button
            onClick={() => { sound.playClick(); setCurrentTab('cases'); }}
            className={`transition-colors pb-0.5 ${currentTab === 'cases' ? 'text-amber-400 font-semibold border-b-2 border-amber-400' : 'hover:text-zinc-100'}`}
          >
            Casos
          </button>
          <button
            onClick={() => { sound.playClick(); onOpenBriefing(); }}
            className="transition-colors pb-0.5 text-zinc-400 hover:text-amber-400 flex items-center gap-1"
            title="Ver Contexto General de Planta y Mandato"
          >
            <span>Dossier</span>
          </button>
          <button
            onClick={() => { sound.playClick(); onOpenReport(); }}
            className="transition-colors pb-0.5 text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
            title="Solicitar Informe Técnico y Resumen Ejecutivo de la Planta"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Informe</span>
          </button>
          {onOpenThemeSelector && (
            <button
              onClick={() => { sound.playClick(); onOpenThemeSelector(); }}
              className="transition-colors pb-0.5 text-zinc-400 hover:text-amber-400 flex items-center gap-1 font-mono text-xs"
              title="Cambiar Estilo Visual (Oscuro, Claro, Blueprint, Ámbar)"
            >
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>Estilo</span>
            </button>
          )}
          {onBackToTitle && (
            <button
              onClick={() => { sound.playClick(); onBackToTitle(); }}
              className="transition-colors pb-0.5 text-amber-400/90 hover:text-amber-300 font-semibold"
              title="Volver a la Pantalla de Título Production Man"
            >
              <span>Plantas</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Primary operational controls and actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Time & Shift indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#171e27] rounded border border-[#283544] text-xs font-mono tabular-nums text-zinc-200">
            <span className="font-semibold text-amber-400">Día {day}</span>
            <span className="text-zinc-600">·</span>
            <span>{formattedTime}</span>
          </div>

          {/* Theme Switcher Quick Button */}
          {onOpenThemeSelector && (
            <button
              onClick={() => { sound.playClick(); onOpenThemeSelector(); }}
              className="px-2 py-1 bg-[#171e27] hover:bg-[#202936] border border-[#283544] hover:border-[#38485c] rounded text-zinc-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono"
              title={`Estilo Visual Activo: ${
                currentTheme === 'light' ? 'Claro Sala Limpia' :
                currentTheme === 'blueprint' ? 'Plano Blueprint CAD' :
                currentTheme === 'amber' ? 'Terminal CRT Ámbar' :
                'Oscuro SCADA'
              }. Clic para cambiar.`}
            >
              {currentTheme === 'light' && <Sun className="w-3.5 h-3.5 text-blue-500" />}
              {currentTheme === 'blueprint' && <Compass className="w-3.5 h-3.5 text-cyan-400" />}
              {currentTheme === 'amber' && <Terminal className="w-3.5 h-3.5 text-amber-500" />}
              {(!currentTheme || currentTheme === 'dark') && <Moon className="w-3.5 h-3.5 text-amber-400" />}
              <span className="hidden xl:inline text-[11px] capitalize">
                {currentTheme === 'light' ? 'Claro' : currentTheme === 'blueprint' ? 'Blueprint' : currentTheme === 'amber' ? 'Ámbar' : 'Oscuro'}
              </span>
            </button>
          )}

          {/* Solicitar Informe Action Button */}
          <button
            onClick={() => { sound.playClick(); onOpenReport(); }}
            className="px-2.5 py-1.5 bg-gradient-to-r from-blue-950 via-[#131d2b] to-indigo-950 hover:from-blue-900 hover:to-indigo-900 text-blue-300 border border-blue-500/40 rounded text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer whitespace-nowrap"
            title="Solicitar informe técnico y resumen ejecutivo de la planta"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden md:inline">Solicitar Informe</span>
            <span className="md:hidden">Informe</span>
          </button>

          {/* Simulation Play/Pause & Speed Segmented Control */}
          <div className="flex items-center bg-[#171e27] rounded border border-[#283544] p-0.5 font-mono">
            <button
              onClick={() => { sound.playClick(); onToggleSimulate(); }}
              className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                isSimulating ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-300 hover:text-white'
              }`}
              title={isSimulating ? 'Pausar Simulación' : 'Iniciar Simulación'}
            >
              {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => { sound.playClick(); onSetSpeed(1); }}
              className={`px-1.5 py-0.5 text-[11px] rounded transition-colors cursor-pointer ${
                simSpeed === 1 && isSimulating ? 'bg-[#293546] text-amber-300 font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              1x
            </button>
            <button
              onClick={() => { sound.playClick(); onSetSpeed(3); }}
              className={`px-1.5 py-0.5 text-[11px] rounded transition-colors cursor-pointer ${
                simSpeed === 3 && isSimulating ? 'bg-[#293546] text-amber-300 font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              3x
            </button>
          </div>

          {/* Action button: Shift close or Urgent dilemma */}
          {activeDilemmasCount > 0 ? (
            <button
              onClick={() => { sound.playWarning(); onOpenMeeting(); }}
              className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-medium flex items-center gap-1.5 animate-pulse transition-colors whitespace-nowrap cursor-pointer shadow-md"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Comité Urgente</span> ({activeDilemmasCount})
            </button>
          ) : isShiftEnd ? (
            <button
              onClick={() => { sound.playShiftStart(); onOpenEndDay(); }}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shadow-sm cursor-pointer"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span>Cerrar Jornada</span>
            </button>
          ) : (
            <button
              onClick={() => { sound.playClick(); onOpenMeeting(); }}
              className="px-2.5 py-1.5 bg-[#171e27] hover:bg-[#232d3b] text-zinc-200 border border-[#283544] rounded text-xs font-medium transition-colors hidden sm:flex items-center gap-1.5 cursor-pointer font-mono"
            >
              <span>Reunión Diaria</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-bar with Live Key Metrics ticker (Industrial SCADA line) */}
      <div className="bg-[#0b0e13] border-t border-[#1d2633] px-4 sm:px-6 py-1.5 text-xs text-zinc-400 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 min-w-max">
          <div className="flex items-center gap-4 text-xs font-mono tabular-nums">
            <span className="flex items-center gap-1 text-zinc-300">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Caja:</span>
              <strong className="text-white">${indicators.cashBalance.toLocaleString()}</strong>
            </span>
            <span className="text-zinc-600">·</span>
            <span className="flex items-center gap-1 text-zinc-300">
              <Activity className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>OEE Global:</span>
              <strong className={`${indicators.oee >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {indicators.oee.toFixed(1)}%
              </strong>
            </span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-300">
              <span>Producción:</span>{' '}
              <strong className="text-white">
                {indicators.unitsProducedToday.toLocaleString()} / {indicators.dailyProductionTarget.toLocaleString()} un.
              </strong>
            </span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-300">
              <span>OTIF:</span>{' '}
              <strong className={`${indicators.otif >= 93 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {indicators.otif.toFixed(1)}%
              </strong>
            </span>
            <span className="text-zinc-600">·</span>
            <span className="flex items-center gap-1 text-zinc-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Seguridad:</span>
              <strong className="text-emerald-400">{indicators.daysWithoutIncidents} días sin accidentes</strong>
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-mono">
            <span>Moral: <strong className="text-zinc-200">{indicators.plantMorale}%</strong></span>
            <span>·</span>
            <span>Directorio: <strong className="text-zinc-200">{indicators.boardApproval}%</strong></span>
          </div>
        </div>
      </div>

      {/* Mobile nav buttons */}
      <div className="flex xl:hidden items-center justify-start overflow-x-auto bg-[#10151c] border-t border-[#242e3b] text-xs py-2 px-2 gap-1 font-mono">
        <button
          onClick={() => { sound.playClick(); setCurrentTab('plant'); }}
          className={`px-2.5 py-1 rounded shrink-0 ${currentTab === 'plant' ? 'text-amber-400 font-semibold bg-[#1a232f]' : 'text-zinc-400'}`}
        >
          Planta
        </button>
        <button
          onClick={() => { sound.playClick(); setCurrentTab('kpis'); }}
          className={`px-2.5 py-1 rounded shrink-0 ${currentTab === 'kpis' ? 'text-amber-400 font-semibold bg-[#1a232f]' : 'text-zinc-400'}`}
        >
          KPIs
        </button>
        <button
          onClick={() => { sound.playClick(); setCurrentTab('methodologies'); }}
          className={`px-2.5 py-1 rounded shrink-0 relative ${currentTab === 'methodologies' ? 'text-amber-400 font-semibold bg-[#1a232f]' : 'text-zinc-400'}`}
        >
          Metodologías
        </button>
        <button
          onClick={() => { sound.playClick(); setCurrentTab('maintenance'); }}
          className={`px-2.5 py-1 rounded shrink-0 ${currentTab === 'maintenance' ? 'text-amber-400 font-semibold bg-[#1a232f]' : 'text-zinc-400'}`}
        >
          Mantenimiento
        </button>
        <button
          onClick={() => { sound.playClick(); setCurrentTab('training'); }}
          className={`px-2.5 py-1 rounded shrink-0 ${currentTab === 'training' ? 'text-amber-400 font-semibold bg-[#1a232f]' : 'text-zinc-400'}`}
        >
          Capacitación
        </button>
        <button
          onClick={() => { sound.playClick(); setCurrentTab('meeting'); }}
          className={`px-2.5 py-1 rounded shrink-0 relative ${currentTab === 'meeting' ? 'text-amber-400 font-semibold bg-[#1a232f]' : 'text-zinc-400'}`}
        >
          Comité
          {activeDilemmasCount > 0 && (
            <span className="ml-1 px-1 bg-rose-600 text-white rounded text-[10px]">{activeDilemmasCount}</span>
          )}
        </button>
        <button
          onClick={() => { sound.playClick(); setCurrentTab('log'); }}
          className={`px-2.5 py-1 rounded shrink-0 ${currentTab === 'log' ? 'text-amber-400 font-semibold bg-[#1a232f]' : 'text-zinc-400'}`}
        >
          Bitácora
        </button>
        <button
          onClick={() => { sound.playClick(); onOpenBriefing(); }}
          className="px-2.5 py-1 rounded shrink-0 text-zinc-400 hover:text-amber-400"
        >
          Dossier
        </button>
        <button
          onClick={() => { sound.playClick(); onOpenReport(); }}
          className="px-2.5 py-1 rounded shrink-0 text-blue-400 font-semibold bg-blue-950/40 border border-blue-500/30 flex items-center gap-1"
        >
          <FileText className="w-3 h-3" />
          <span>Informe</span>
        </button>
      </div>
    </header>
  );
};
