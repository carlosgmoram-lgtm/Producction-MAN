import React from 'react';
import { DayLogEntry } from '../types/game';
import { ClipboardList, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface DecisionLogProps {
  logs: DayLogEntry[];
}

export const DecisionLog: React.FC<DecisionLogProps> = ({ logs }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-amber-400" />
            <span>Bitácora de Decisiones Gerenciales</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Registro cronológico de resoluciones operativas, contingencias y metodologías aplicadas.
          </p>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {logs.length} eventos registrados
        </span>
      </div>

      {logs.length === 0 ? (
        <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl text-slate-400 text-xs">
          Aún no se han ejecutado decisiones en la jornada actual. A medida que resuelvas comités y contingencias, aparecerán aquí.
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log, index) => (
            <div
              key={index}
              className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Día {log.day} · {log.hour.toString().padStart(2, '0')}:00 hrs
                  </span>
                  <span className="text-xs font-mono text-slate-400 uppercase">
                    [{log.type}]
                  </span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>

              <h3 className="text-sm font-bold text-white pt-0.5">
                {log.title}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                {log.description}
              </p>

              <div className="text-[11px] font-mono text-amber-400 bg-slate-950/60 p-2 rounded border border-slate-800/80 mt-1">
                <strong>Impacto Operativo: </strong>
                {log.impact}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
