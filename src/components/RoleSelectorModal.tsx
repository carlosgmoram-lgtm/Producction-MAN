import React from 'react';
import { PlantRoleId } from '../types/game';
import { PLANT_ROLES, getRoleById } from '../data/rolesData';
import { sound } from '../utils/audio';
import { 
  X, Check, Users, ShieldAlert, Zap, Target, ArrowRight, Sparkles
} from 'lucide-react';

interface RoleSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: PlantRoleId;
  onSelectRole: (roleId: PlantRoleId) => void;
}

export const RoleSelectorModal: React.FC<RoleSelectorModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onSelectRole
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-150 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#12161e] border border-[#2a3545] rounded-2xl shadow-2xl text-zinc-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222b37] bg-[#0c1017]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulación de Roles Operativos e Interdependencia Sistémica</span>
              </div>
              <h2 className="text-lg font-bold text-white">
                Selecciona Tu Cargo en la Planta Industrial
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

        {/* Description Callout */}
        <div className="px-6 py-3 bg-[#17202c] border-b border-[#222b37] text-xs font-mono text-zinc-300 flex items-center justify-between gap-4">
          <p>
            Cada rol tiene <strong>atributos propios de su área</strong> (KPIs departamentales), pero todas sus decisiones <strong>generan trade-offs e impactos cruzados en las demás jefaturas</strong>.
          </p>
          <span className="text-[10px] text-amber-400 whitespace-nowrap hidden sm:inline">
            6 Cargos Disponibles
          </span>
        </div>

        {/* Roles Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {PLANT_ROLES.map((role) => {
            const isSelected = currentRole === role.id;

            return (
              <div
                key={role.id}
                onClick={() => {
                  sound.playClick();
                  onSelectRole(role.id);
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? 'border-amber-500 bg-[#19222f] shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/50'
                    : 'border-[#263140] bg-[#141a24] hover:border-[#38485c] hover:bg-[#18212e]'
                }`}
              >
                <div>
                  {/* Top Bar of Role Card */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${role.avatarColor} text-white font-mono font-bold flex items-center justify-center text-sm shadow-md border border-white/20 shrink-0`}>
                        {role.avatarInitials}
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.2 rounded bg-white/10 text-zinc-300 border border-white/10">
                          {role.department}
                        </span>
                        <h3 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors">
                          {role.name}
                        </h3>
                        <div className="text-[11px] text-zinc-400 font-mono">
                          {role.characterName}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-amber-500 text-zinc-950 flex items-center gap-1 shadow-sm">
                        <Check className="w-3.5 h-3.5" />
                        <span>Activo</span>
                      </span>
                    )}
                  </div>

                  {/* Mission */}
                  <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                    {role.mission}
                  </p>

                  {/* Primary KPIs of this Role */}
                  <div className="mb-3 p-2.5 rounded-lg bg-[#0e1218] border border-[#1f2835]">
                    <div className="text-[10px] font-mono uppercase text-amber-400/90 font-bold mb-1.5 flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      <span>Tus Atributos & KPIs Primarios:</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono text-zinc-300">
                      {role.primaryKpis.map((kpi, kIdx) => (
                        <div key={kIdx} className="truncate">
                          • <strong className="text-white">{kpi.label}</strong> ({kpi.unit})
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cross-Impact Warning */}
                  <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/30 text-[11px] text-rose-200">
                    <strong className="text-rose-300 block mb-0.5">⚠️ Impacto en las demás áreas:</strong>
                    {role.crossImpactWarning}
                  </div>
                </div>

                {/* Footer of Card */}
                <div className="mt-4 pt-3 border-t border-[#222b37] flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500">
                    {role.tacticalActions.length} Acciones Tácticas
                  </span>
                  <span className="text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>{isSelected ? 'Rol en uso' : 'Asumir este cargo'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#222b37] bg-[#0c1017] flex items-center justify-between">
          <span className="text-xs font-mono text-zinc-500">
            Puedes cambiar de rol en cualquier momento durante la simulación.
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
