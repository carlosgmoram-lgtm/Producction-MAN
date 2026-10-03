import React from 'react';
import { 
  BottleneckTOCState, 
  LinePacingMode, 
  MachineDefinition, 
  PlantIndicators, 
  ProcessConfig 
} from '../types/game';
import { sound } from '../utils/audio';
import { 
  X, AlertTriangle, Gauge, Wrench, RefreshCw, Zap, 
  Check, ArrowRight, TrendingDown, Layers, DollarSign, 
  Sparkles, ShieldCheck, Activity, Cpu, ArrowUpRight
} from 'lucide-react';

interface BottleneckManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  bottleneckState: BottleneckTOCState;
  bottleneckMachine: MachineDefinition | undefined;
  indicators: PlantIndicators;
  processConfig: ProcessConfig;
  onSetLinePacing: (mode: LinePacingMode) => void;
  onImplementImprovement: () => void;
  onAssignReplacementProject: () => void;
}

export const BottleneckManagerModal: React.FC<BottleneckManagerModalProps> = ({
  isOpen,
  onClose,
  bottleneckState,
  bottleneckMachine,
  indicators,
  processConfig,
  onSetLinePacing,
  onImplementImprovement,
  onAssignReplacementProject
}) => {
  if (!isOpen) return null;

  const machineName = bottleneckMachine ? bottleneckMachine.name : processConfig.bottleneckStation;
  const machineWear = bottleneckMachine ? bottleneckMachine.wearPercent : 68;
  const isBottleneckResolved = bottleneckState.replacementProjectExecuted;
  const ebitda = indicators.dailyRevenue - indicators.dailyCost;

  const IMPROVEMENT_COST = 950;
  const REPLACEMENT_COST = 5500;
  const PACING_SYNC_COST = 180;
  const PACING_REBALANCE_COST = 450;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-150 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#12161e] border border-[#2a3545] rounded-2xl shadow-2xl text-zinc-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222b37] bg-[#0c1017]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Teoría de Restricciones (TOC) · Drum-Buffer-Rope</span>
              </div>
              <h2 className="text-lg font-bold text-white">
                Centro de Gestión de Cuellos de Botella & Cadencia
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Card 1: Diagnóstico de la Restricción Activa */}
          <div className="p-4 rounded-xl bg-[#17202c] border border-amber-500/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {isBottleneckResolved ? 'RESTRICCIÓN DESPEJADA' : 'EQUIPO RESTRICCIÓN (DRUM)'}
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  {processConfig.plantName}
                </span>
              </div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-400" />
                <span>{machineName}</span>
              </h3>
              <p className="text-xs text-zinc-300 font-mono">
                {bottleneckMachine?.description || 'Equipo limitante de la tasa de transformación global de la fábrica.'}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 shrink-0 text-xs font-mono">
              <div className="p-2 bg-[#0e131b] rounded-lg border border-[#243142]">
                <span className="text-zinc-500 text-[10px] block">Capacidad Nominal</span>
                <strong className="text-amber-400">{bottleneckState.nominalBottleneckCapacity} u/h</strong>
              </div>
              <div className="p-2 bg-[#0e131b] rounded-lg border border-[#243142]">
                <span className="text-zinc-500 text-[10px] block">Desgaste Mecánico</span>
                <strong className={machineWear >= 70 ? 'text-rose-400' : machineWear >= 40 ? 'text-amber-400' : 'text-emerald-400'}>
                  {machineWear}%
                </strong>
              </div>
              <div className="p-2 bg-[#0e131b] rounded-lg border border-[#243142] col-span-2 sm:col-span-1">
                <span className="text-zinc-500 text-[10px] block">WIP en Espera</span>
                <strong className={bottleneckState.wipBufferUnits > 1200 ? 'text-rose-400' : 'text-emerald-400'}>
                  {bottleneckState.wipBufferUnits.toLocaleString()} u.
                </strong>
              </div>
            </div>
          </div>

          {/* Card 2: Decision 1 - Reordenar Líneas & Velocidad de Producción */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#232f3e] pb-2">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  1. Regulación de Velocidad de Producción & Reordenamiento de Línea
                </h3>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">
                Principio TOC: Subordinar el ritmo al equipo restrictivo
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Option A: Producir a velocidad nominal de equipo más bajo */}
              <div
                onClick={() => onSetLinePacing('SUBORDINADA_CUELLO_BOTELLA')}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  bottleneckState.pacingMode === 'SUBORDINADA_CUELLO_BOTELLA'
                    ? 'bg-amber-500/10 border-amber-500 shadow-md ring-1 ring-amber-500/50'
                    : 'bg-[#151c26] border-[#293648] hover:border-zinc-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Sincronización TOC
                    </span>
                    {bottleneckState.pacingMode === 'SUBORDINADA_CUELLO_BOTELLA' && (
                      <Check className="w-4 h-4 text-amber-400" />
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-white mb-1">
                    Producir a Velocidad Nominal del Equipo Más Bajo
                  </h4>
                  <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                    Subordina toda la línea fabril al ritmo seguro de la máquina cuello de botella ({bottleneckState.nominalBottleneckCapacity} u/h).
                  </p>
                  <div className="space-y-1 text-[11px] font-mono text-zinc-400">
                    <div className="text-emerald-400 flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" />
                      <span>WIP en tránsito cae de 1.850 a 650 u</span>
                    </div>
                    <div className="text-emerald-400 flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" />
                      <span>Desgaste de máquinas se reduce en 35%</span>
                    </div>
                    <div className="text-emerald-400 flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" />
                      <span>Microdefectos disminuyen -30 PPM</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2.5 border-t border-[#232f3e] flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">Costo Operacional:</span>
                  <strong className="text-amber-400">+${PACING_SYNC_COST}/día</strong>
                </div>
              </div>

              {/* Option B: Reordenamiento de Líneas & Balanceo de Carga */}
              <div
                onClick={() => onSetLinePacing('REORDENAMIENTO_LINEAS')}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  bottleneckState.pacingMode === 'REORDENAMIENTO_LINEAS'
                    ? 'bg-blue-500/10 border-blue-500 shadow-md ring-1 ring-blue-500/50'
                    : 'bg-[#151c26] border-[#293648] hover:border-zinc-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Reordenar Flujos
                    </span>
                    {bottleneckState.pacingMode === 'REORDENAMIENTO_LINEAS' && (
                      <Check className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-white mb-1">
                    Reordenamiento de Líneas & Split Routing
                  </h4>
                  <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                    Reconfigura el flujo de transporte dividiendo un 25% de la carga hacia líneas secundarias y buffers de desacople.
                  </p>
                  <div className="space-y-1 text-[11px] font-mono text-zinc-400">
                    <div className="text-blue-300 flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      <span>Desvía 25% de carga del cuello de botella</span>
                    </div>
                    <div className="text-blue-300 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      <span>Cadencia efectiva alta (~840 u/h)</span>
                    </div>
                    <div className="text-zinc-400 flex items-center gap-1">
                      <span>Requiere sincronización de andenes</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2.5 border-t border-[#232f3e] flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">Costo Operacional:</span>
                  <strong className="text-blue-400">+${PACING_REBALANCE_COST}/día</strong>
                </div>
              </div>

              {/* Option C: Máxima Velocidad Desbalanceada (Push Puro) */}
              <div
                onClick={() => onSetLinePacing('MAXIMA_VELOCIDAD')}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  bottleneckState.pacingMode === 'MAXIMA_VELOCIDAD'
                    ? 'bg-zinc-800/80 border-zinc-400 shadow-md ring-1 ring-zinc-400'
                    : 'bg-[#151c26] border-[#293648] hover:border-zinc-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-zinc-700 text-zinc-300 border border-zinc-600">
                      Push Tradicional
                    </span>
                    {bottleneckState.pacingMode === 'MAXIMA_VELOCIDAD' && (
                      <Check className="w-4 h-4 text-zinc-200" />
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-white mb-1">
                    Máxima Velocidad Desbalanceada (Empuje)
                  </h4>
                  <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                    Cada estación produce a su velocidad individual sin sincronización. Provoca acumulación masiva de WIP frente al cuello de botella.
                  </p>
                  <div className="space-y-1 text-[11px] font-mono text-zinc-400">
                    <div className="text-rose-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>WIP elevado (&gt;1.850 unidades)</span>
                    </div>
                    <div className="text-rose-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Mayor fatiga térmica en máquinas</span>
                    </div>
                    <div className="text-zinc-400 flex items-center gap-1">
                      <span>Sobreproducción en etapas previas</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2.5 border-t border-[#232f3e] flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">Costo Operacional:</span>
                  <strong className="text-zinc-300">$0/día directo</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Decision 2 & 3 - Implementar Mejoras o Asignar Proyecto de Reemplazo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Action 2: Implementar Mejora en Dicho Equipo (Kaizen / SMED) */}
            <div className="p-4 rounded-xl bg-[#141b25] border border-[#2b3a4f] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-mono font-bold uppercase text-amber-400">
                      2. Implementar Mejora en Dicho Equipo
                    </span>
                  </div>
                  <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20">
                    KAIZEN & SMED
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mb-1">
                  Desembotellamiento Técnico & Puesta a Punto
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                  Intervención mecánica y metrológica en <strong>{machineName}</strong>: cambio rápido de matrices (SMED), lubricación de alta fricción y calibración térmica.
                </p>

                <div className="p-2.5 bg-[#0e141c] rounded-lg border border-[#222d3d] space-y-1.5 text-[11px] font-mono text-zinc-300 mb-4">
                  <div className="flex justify-between">
                    <span>Aumento de Capacidad del Equipo:</span>
                    <strong className="text-emerald-400">+20% rendimiento</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Alivio de Desgaste Mecánico:</span>
                    <strong className="text-emerald-400">-25% desgaste acumulado</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Mejoras previas ejecutadas:</span>
                    <strong className="text-zinc-300">{bottleneckState.improvementsAppliedCount} vez(ces)</strong>
                  </div>
                </div>

                <div className="p-2 bg-amber-950/20 rounded border border-amber-500/30 text-[10px] text-amber-300 font-mono mb-4">
                  ℹ️ El costo de <strong>${IMPROVEMENT_COST.toLocaleString()}</strong> se imputa directamente al <strong>Costo Operacional diario</strong> (afecta el EBITDA del día).
                </div>
              </div>

              <button
                onClick={onImplementImprovement}
                disabled={indicators.cashBalance < IMPROVEMENT_COST}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  indicators.cashBalance >= IMPROVEMENT_COST
                    ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-md hover:shadow-amber-500/20'
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                }`}
              >
                <Wrench className="w-4 h-4" />
                <span>EJECUTAR MEJORA TÉCNICA (-${IMPROVEMENT_COST} USD)</span>
              </button>
            </div>

            {/* Action 3: Asignar Proyecto de Reemplazo (CAPEX Operacional) */}
            <div className="p-4 rounded-xl bg-[#141b25] border border-blue-500/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-mono font-bold uppercase text-blue-400">
                      3. Proyecto de Reemplazo de Equipo
                    </span>
                  </div>
                  <span className="text-[10px] font-mono bg-blue-500/10 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/20">
                    INGENIERÍA CAPEX
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mb-1">
                  Sustitución Integral por Equipo de Alta Tecnología
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                  Reemplaza el activo cuello de botella por una unidad automatizada de última generación, eliminando la restricción física de la línea.
                </p>

                <div className="p-2.5 bg-[#0e141c] rounded-lg border border-[#222d3d] space-y-1.5 text-[11px] font-mono text-zinc-300 mb-4">
                  <div className="flex justify-between">
                    <span>Aumento de Capacidad Nominal:</span>
                    <strong className="text-blue-300">+50% capacidad</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Desgaste de Nueva Máquina:</span>
                    <strong className="text-emerald-400">0% (Completamente Nueva)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Estado del Cuello de Botella:</span>
                    <strong className="text-emerald-400">Despejado y Resuelto</strong>
                  </div>
                </div>

                <div className="p-2 bg-blue-950/20 rounded border border-blue-500/30 text-[10px] text-blue-300 font-mono mb-4">
                  ⚠️ El costo de inversión de <strong>${REPLACEMENT_COST.toLocaleString()}</strong> se imputa al <strong>Costo Operacional diario</strong> del turno.
                </div>
              </div>

              <button
                onClick={onAssignReplacementProject}
                disabled={indicators.cashBalance < REPLACEMENT_COST || isBottleneckResolved}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isBottleneckResolved
                    ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/40 cursor-default'
                    : indicators.cashBalance >= REPLACEMENT_COST
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md hover:shadow-blue-500/20'
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                }`}
              >
                {isBottleneckResolved ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>PROYECTO DE REEMPLAZO YA EJECUTADO</span>
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="w-4 h-4" />
                    <span>ASIGNAR PROYECTO DE REEMPLAZO (-${REPLACEMENT_COST} USD)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Financial Summary & Live EBITDA Box */}
          <div className="p-4 bg-[#0d1219] border border-[#202c3b] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block uppercase font-bold">
                  Impacto Directo en Cuenta de Resultados (P&L del Día)
                </span>
                <span className="text-zinc-200">
                  Todo gasto de mejora o reemplazo incrementa el costo operacional y reduce el EBITDA diario.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-right">
              <div>
                <span className="text-[10px] text-zinc-400 block">Costo Operacional Día</span>
                <strong className="text-rose-400 text-sm">${indicators.dailyCost.toLocaleString()}</strong>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block">EBITDA Actual</span>
                <strong className={ebitda >= 0 ? 'text-emerald-400 text-sm' : 'text-rose-400 text-sm'}>
                  ${ebitda.toLocaleString()}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#222b37] bg-[#0c1017] flex items-center justify-between">
          <span className="text-xs font-mono text-zinc-400">
            Modo Activo: <strong className="text-amber-400 capitalize">{bottleneckState.pacingMode.replace(/_/g, ' ').toLowerCase()}</strong>
          </span>
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="px-5 py-2 bg-[#17202c] hover:bg-[#222c3d] text-zinc-200 hover:text-white rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border border-[#2a3648]"
          >
            Cerrar Centro de Control TOC
          </button>
        </div>
      </div>
    </div>
  );
};
