import React from 'react';
import { PlantUnit, Character, MachineDefinition } from '../types/game';
import { X, MessageSquare, AlertCircle, Wrench, Shield, CheckCircle2, Layers, GraduationCap, Settings, Cpu, Zap } from 'lucide-react';
import { sound } from '../utils/audio';

interface UnitModalProps {
  unit: PlantUnit | null;
  character: Character | null;
  onClose: () => void;
  onToggleTactical: (unitId: PlantUnit['id'], toggleKey: keyof PlantUnit['tacticalToggles']) => void;
  onStartDialogue: (character: Character) => void;
  onApplyMethodology?: (unitId: PlantUnit['id']) => void;
  onCreateTraining?: (unitId: PlantUnit['id']) => void;
  onViewMaintenance?: (unitId: PlantUnit['id']) => void;
  onOpenBottleneckModal?: () => void;
  machines?: MachineDefinition[];
}

export const UnitModal: React.FC<UnitModalProps> = ({
  unit,
  character,
  onClose,
  onToggleTactical,
  onStartDialogue,
  onApplyMethodology,
  onCreateTraining,
  onViewMaintenance,
  onOpenBottleneckModal,
  machines = []
}) => {
  if (!unit || !character) return null;

  const unitMachines = machines.filter((m) => m.unitId === unit.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400">
              {character.initials}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{unit.name}</span>
                <span className="text-xs px-2 py-0.5 rounded font-mono bg-slate-800 text-slate-300 border border-slate-700">
                  {unit.status}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Liderado por {character.name} ({character.title})
              </p>
            </div>
          </div>

          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Unit Description & Health / Efficiency Meters */}
          <div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {unit.description}
            </p>

            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400 font-mono">Confiabilidad / Salud</span>
                <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">{unit.health}%</div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${unit.health}%` }}></div>
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400 font-mono">Eficiencia Operativa</span>
                <div className="text-lg font-bold text-blue-400 font-mono mt-0.5">{unit.efficiency}%</div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${unit.efficiency}%` }}></div>
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400 font-mono">Nivel de Estrés / Carga</span>
                <div className="text-lg font-bold text-amber-400 font-mono mt-0.5">{unit.stressLevel}%</div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${unit.stressLevel}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Engineering Metrics Grid */}
          <div>
            <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-2.5">
              Parámetros de Ingeniería & Rendimiento
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {Object.entries(unit.metrics).map(([key, item]) => (
                <div key={key} className="p-2.5 bg-slate-950/40 rounded border border-slate-800/80">
                  <div className="text-[10px] text-slate-400 truncate">{item.label}</div>
                  <div className="text-sm font-bold text-white font-mono mt-0.5">
                    {item.value} {item.unit}
                  </div>
                  {item.ideal && (
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Meta: {item.ideal}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Chief Character Spotlight & Advice */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 flex flex-col sm:flex-row gap-4 items-start">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-bold text-slate-950 text-base shrink-0 shadow-md">
              {character.initials}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">{character.name}</h4>
                <span className="text-[11px] font-mono text-amber-400">{character.methodology}</span>
              </div>
              <p className="text-xs text-slate-400 italic">
                "{character.dialogueGreeting}"
              </p>
              <div className="mt-2 text-xs text-slate-300 bg-slate-900 p-2.5 rounded border border-slate-800">
                <span className="text-amber-400 font-semibold">Consejo Técnico: </span>
                {character.currentAdvice}
              </div>
            </div>
          </div>

          {/* Engineering & Methodology Direct Actions */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2.5">
            <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider flex items-center justify-between">
              <span>Gestión de Ingeniería Aplicada a esta Unidad</span>
              <span className="text-[10px] text-amber-400 font-mono">Facultad del Gerente</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {onApplyMethodology && (
                <button
                  onClick={() => {
                    sound.playClick();
                    onApplyMethodology(unit.id);
                  }}
                  className="p-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-mono flex items-center gap-2 transition-colors cursor-pointer text-left"
                >
                  <Layers className="w-4 h-4 shrink-0 text-amber-400" />
                  <div>
                    <strong className="block text-white">Aplicar Metodología</strong>
                    <span className="text-[10px] text-slate-400">Lean, 5S, TPM, SOP, JI</span>
                  </div>
                </button>
              )}

              {onCreateTraining && (
                <button
                  onClick={() => {
                    sound.playClick();
                    onCreateTraining(unit.id);
                  }}
                  className="p-2.5 bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-mono flex items-center gap-2 transition-colors cursor-pointer text-left"
                >
                  <GraduationCap className="w-4 h-4 shrink-0 text-emerald-400" />
                  <div>
                    <strong className="block text-white">Capacitar Dotación</strong>
                    <span className="text-[10px] text-slate-400">{unit.activeWorkers} operarios</span>
                  </div>
                </button>
              )}

              {onViewMaintenance && (
                <button
                  onClick={() => {
                    sound.playClick();
                    onViewMaintenance(unit.id);
                  }}
                  className="p-2.5 bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/30 rounded-lg text-xs font-mono flex items-center gap-2 transition-colors cursor-pointer text-left"
                >
                  <Wrench className="w-4 h-4 shrink-0 text-cyan-400" />
                  <div>
                    <strong className="block text-white">Ver Mantenimiento</strong>
                    <span className="text-[10px] text-slate-400">Activos y confiabilidad</span>
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Specific Station Machinery */}
          {unitMachines.length > 0 && (
            <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2.5">
              <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-amber-400" />
                  <span>Maquinaria & Activos Físicos Asignados ({unitMachines.length})</span>
                </span>
                <span className="text-[10px] text-amber-400/80 font-mono">Específico de este Proceso</span>
              </h3>
              <div className="space-y-2">
                {unitMachines.map((m) => (
                  <div key={m.id} className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0">
                      <div className="font-semibold text-white flex items-center gap-2 truncate">
                        <span>{m.name}</span>
                        {m.status === 'CUELLO_BOTELLA' && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded">
                            Restricción TOC
                          </span>
                        )}
                        {m.status === 'EN_ALERTA' && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded">
                            En Alerta
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">{m.type}</div>
                    </div>
                    <div className="text-right font-mono shrink-0">
                      <div className="text-[10px] text-slate-400">Desgaste: <strong className={m.wearPercent > 60 ? 'text-rose-400' : 'text-emerald-400'}>{Math.round(m.wearPercent)}%</strong></div>
                      <div className="text-[10px] text-zinc-500">{m.operatingHours.toLocaleString()}h uso</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Manager Tactical Toggles */}
          <div>
            <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-2.5">
              Ajustes Tácticos del Gerente
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Overtime Toggle */}
              <button
                onClick={() => { sound.playClick(); onToggleTactical(unit.id, 'overtime'); }}
                className={`p-3 rounded-lg border text-left flex items-start justify-between transition-colors ${
                  unit.tacticalToggles.overtime
                    ? 'bg-amber-950/30 border-amber-500/80 text-amber-200'
                    : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold">Turno Extra / Horas Extra</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Aumenta producción un +15%, incrementa costo y fatiga del personal.
                  </div>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-mono rounded font-bold ${
                  unit.tacticalToggles.overtime ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {unit.tacticalToggles.overtime ? 'ACTIVO' : 'INACTIVO'}
                </span>
              </button>

              {/* Preventive Check Toggle */}
              <button
                onClick={() => { sound.playClick(); onToggleTactical(unit.id, 'preventiveCheck'); }}
                className={`p-3 rounded-lg border text-left flex items-start justify-between transition-colors ${
                  unit.tacticalToggles.preventiveCheck
                    ? 'bg-emerald-950/30 border-emerald-500/80 text-emerald-200'
                    : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold">Inspección Preventiva Sistemática</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Previene fallas catastróficas y eleva la disponibilidad a largo plazo.
                  </div>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-mono rounded font-bold ${
                  unit.tacticalToggles.preventiveCheck ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {unit.tacticalToggles.preventiveCheck ? 'ACTIVO' : 'INACTIVO'}
                </span>
              </button>

              {/* Strict Standard */}
              <button
                onClick={() => { sound.playClick(); onToggleTactical(unit.id, 'strictStandard'); }}
                className={`p-3 rounded-lg border text-left flex items-start justify-between transition-colors ${
                  unit.tacticalToggles.strictStandard
                    ? 'bg-blue-950/30 border-blue-500/80 text-blue-200'
                    : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold">Tolerancia Cero y Muestreo Riguroso</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Reduce defectos en clientes finales, aumenta tiempo de inspección.
                  </div>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-mono rounded font-bold ${
                  unit.tacticalToggles.strictStandard ? 'bg-blue-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {unit.tacticalToggles.strictStandard ? 'ACTIVO' : 'INACTIVO'}
                </span>
              </button>

              {/* High Priority */}
              <button
                onClick={() => { sound.playClick(); onToggleTactical(unit.id, 'highPriority'); }}
                className={`p-3 rounded-lg border text-left flex items-start justify-between transition-colors ${
                  unit.tacticalToggles.highPriority
                    ? 'bg-rose-950/30 border-rose-500/80 text-rose-200'
                    : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold">Prioridad de Despacho / Expediting</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Concentra recursos de grúas y operadores para desatascar la estación.
                  </div>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-mono rounded font-bold ${
                  unit.tacticalToggles.highPriority ? 'bg-rose-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {unit.tacticalToggles.highPriority ? 'ACTIVO' : 'INACTIVO'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="text-xs text-slate-400 font-mono">
            Dotación: {unit.activeWorkers} operadores activos
          </div>
          <div className="flex items-center gap-3">
            {onOpenBottleneckModal && unit.id === 'proceso' && (
              <button
                onClick={() => { sound.playClick(); onOpenBottleneckModal(); }}
                className="px-3.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Abrir Centro de Control de Cuellos de Botella (TOC)"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Restricción TOC</span>
              </button>
            )}
            <button
              onClick={() => { sound.playClick(); onStartDialogue(character); }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-2 transition-colors shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Dialogar con {character.name.split(' ')[0]}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
