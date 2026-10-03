import React from 'react';
import { DayReport } from '../types/game';
import { Award, ArrowRight, DollarSign, Activity, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';
import { sound } from '../utils/audio';

interface DayEndModalProps {
  report: DayReport | null;
  onNextDay: () => void;
  isOpen: boolean;
}

export const DayEndModal: React.FC<DayEndModalProps> = ({ report, onNextDay, isOpen }) => {
  if (!isOpen || !report) return null;

  const isTargetAchieved = report.unitsProduced >= report.targetUnits;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Cierre de Turno y Jornada Operativa
              </h2>
              <p className="text-xs text-slate-400">
                Resumen de desempeño entregado al Directorio · Día {report.day}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Target status banner */}
          <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
            isTargetAchieved
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
              : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
          }`}>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 shrink-0" />
              <div>
                <div className="text-sm font-bold">
                  {isTargetAchieved ? 'Meta de Producción Cumplida' : 'Meta Parcial Alcanzada'}
                </div>
                <div className="text-xs opacity-90 mt-0.5">
                  Fabricadas {report.unitsProduced.toLocaleString()} de {report.targetUnits.toLocaleString()} unidades programadas ({((report.unitsProduced / report.targetUnits) * 100).toFixed(1)}%).
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400">OEE Promedio</div>
              <div className="text-lg font-bold text-amber-400 mt-0.5">{report.oee.toFixed(1)}%</div>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400">OTIF Despacho</div>
              <div className="text-lg font-bold text-teal-400 mt-0.5">{report.otif.toFixed(1)}%</div>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400">EBITDA Diario</div>
              <div className="text-lg font-bold text-emerald-400 mt-0.5">${report.ebitda.toLocaleString()}</div>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400">Defectos / Scrap</div>
              <div className="text-lg font-bold text-white mt-0.5">{report.defectsCount} u.</div>
            </div>
          </div>

          {/* Board of Directors Feedback */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase text-slate-400 font-bold">
                Evaluación del Directorio de Accionistas
              </h3>
              <span className="text-xs text-amber-400 font-mono">Índice de Aprobación: Alta</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
              "{report.boardComments}"
            </p>
          </div>

          {/* Chief Department Quotes */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase text-slate-400 font-bold">
              Comentarios del Comité de Jefaturas
            </h3>
            <div className="space-y-2">
              {report.chiefFeedback.map((fb, idx) => (
                <div key={idx} className="p-3 bg-slate-950/40 rounded-lg border border-slate-800/80 text-xs text-slate-300">
                  {fb.comment}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <div className="text-xs text-slate-400 font-mono">
            Planificación Día {report.day + 1} lista para ejecución
          </div>
          <button
            onClick={() => { sound.playShiftStart(); onNextDay(); }}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 transition-colors shadow-lg"
          >
            <span>Iniciar Día {report.day + 1}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
