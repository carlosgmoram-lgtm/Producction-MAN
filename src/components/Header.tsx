import React from 'react';
import { Play, Pause, FastForward, AlertTriangle, ShieldCheck, DollarSign, Activity } from 'lucide-react';
import { PlantIndicators } from '../types/game';
import { sound } from '../utils/audio';

interface HeaderProps {
  currentTab: 'plant' | 'kpis' | 'meeting' | 'log' | 'cases';
  setCurrentTab: (tab: 'plant' | 'kpis' | 'meeting' | 'log' | 'cases') => void;
  day: number;
  hour: number;
  isSimulating: boolean;
  simSpeed: number;
  onToggleSimulate: () => void;
  onSetSpeed: (speed: number) => void;
  indicators: PlantIndicators;
  activeDilemmasCount: number;
  onOpenMeeting: () => void;
  onOpenEndDay: () => void;
  onOpenBriefing: () => void;
  onBackToTitle?: () => void;
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
  onOpenMeeting,
  onOpenEndDay,
  onOpenBriefing,
  onBackToTitle
}) => {
  const formattedTime = `${hour.toString().padStart(2, '0')}:00 hrs`;
  const isShiftEnd = hour >= 18;

  return (
    <header className="sticky top-0 z-30 bg-[#10151c]/95 backdrop-blur-md border-b border-[#242e3b] text-zinc-100">
      {/* Primary Top Bar Contract: 3 zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Zone 1: Single text wordmark with industrial badge */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-bold text-zinc-950 text-sm shadow-inner font-mono">
            II
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap font-sans">
            Production Man <span className="text-amber-400 font-normal text-xs sm:text-sm hidden md:inline font-mono">· SCADA Ops</span>
          </span>
        </div>

        {/* Zone 2: 4-5 Navigation Links (Clean text with active indicator) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs sm:text-sm font-medium text-zinc-400 font-mono">
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
            Casos de Estudio
          </button>
          <button
            onClick={() => { sound.playClick(); onOpenBriefing(); }}
            className="transition-colors pb-0.5 text-zinc-400 hover:text-amber-400 flex items-center gap-1"
            title="Ver Contexto General de Planta y Mandato"
          >
            <span>Dossier / Planta</span>
          </button>
          {onBackToTitle && (
            <button
              onClick={() => { sound.playClick(); onBackToTitle(); }}
              className="transition-colors pb-0.5 text-amber-400/90 hover:text-amber-300 font-semibold"
              title="Volver a la Pantalla de Título Production Man"
            >
              <span>Menú / Plantas</span>
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
      <div className="flex lg:hidden items-center justify-around bg-[#10151c] border-t border-[#242e3b] text-xs py-2 px-1 font-mono">
        <button
          onClick={() => { sound.playClick(); setCurrentTab('plant'); }}
          className={`px-2 py-1 rounded ${currentTab === 'plant' ? 'text-amber-400 font-semibold' : 'text-zinc-400'}`}
        >
          Planta
        </button>
        <button
          onClick={() => { sound.playClick(); setCurrentTab('kpis'); }}
          className={`px-2 py-1 rounded ${currentTab === 'kpis' ? 'text-amber-400 font-semibold' : 'text-zinc-400'}`}
        >
          KPIs
        </button>
        <button
          onClick={() => { sound.playClick(); setCurrentTab('meeting'); }}
          className={`px-2 py-1 rounded relative ${currentTab === 'meeting' ? 'text-amber-400 font-semibold' : 'text-zinc-400'}`}
        >
          Comité
          {activeDilemmasCount > 0 && (
            <span className="ml-1 px-1 bg-rose-600 text-white rounded text-[10px]">{activeDilemmasCount}</span>
          )}
        </button>
        <button
          onClick={() => { sound.playClick(); setCurrentTab('log'); }}
          className={`px-2 py-1 rounded ${currentTab === 'log' ? 'text-amber-400 font-semibold' : 'text-zinc-400'}`}
        >
          Bitácora
        </button>
        <button
          onClick={() => { sound.playClick(); onOpenBriefing(); }}
          className="px-2 py-1 rounded text-zinc-400 hover:text-amber-400"
        >
          Contexto
        </button>
      </div>
    </header>
  );
};
