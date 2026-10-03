import React from 'react';
import { EngineerProfile, PlantIndicators } from '../types/game';
import { X, Award, GraduationCap, CheckCircle, ShieldCheck, Briefcase } from 'lucide-react';
import { sound } from '../utils/audio';

interface EngineerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: EngineerProfile;
  indicators: PlantIndicators;
}

export const EngineerProfileModal: React.FC<EngineerProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  indicators
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
              II
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Ficha del Ingeniero Industrial
              </h2>
              <p className="text-xs text-slate-400">
                Rol gerencial y trayectoria profesional en Manufacturas Andinas
              </p>
            </div>
          </div>
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Identity card */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg">
              AS
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{profile.name}</h3>
              <div className="text-xs text-amber-400 font-mono font-medium">
                {profile.title} · {profile.level}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Especialidad: {profile.specialty} · Experiencia en Plantas de Manufactura Continua y Discreta.
              </p>
            </div>
          </div>

          {/* Managerial Reputation Meters */}
          <div>
            <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-2.5">
              Reputación y Confianza Organizacional
            </h4>
            <div className="space-y-3">
              <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800 text-xs font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Aprobación del Directorio / Accionistas:</span>
                  <strong className="text-emerald-400">{indicators.boardApproval}%</strong>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${indicators.boardApproval}%` }}></div>
                </div>
              </div>

              <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800 text-xs font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Clima Laboral y Moral de Planta:</span>
                  <strong className="text-blue-400">{indicators.plantMorale}%</strong>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${indicators.plantMorale}%` }}></div>
                </div>
              </div>

              <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800 text-xs font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Satisfacción de Clientes (NPS):</span>
                  <strong className="text-amber-400">+{indicators.customerNps} pts</strong>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${indicators.customerNps}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Certifications and Engineering Badges */}
          <div>
            <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-2.5">
              Acreditaciones & Metodologías Activas
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {profile.certifications.map((cert, i) => (
                <div key={i} className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800 flex items-center gap-2.5 text-xs">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-200">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Decisiones ejecutadas: {profile.decisionsMadeCount}</span>
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium"
          >
            Cerrar Ficha
          </button>
        </div>
      </div>
    </div>
  );
};
