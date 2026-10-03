import React, { useState } from 'react';
import { 
  TrainingProgramDefinition, 
  ActiveTrainingPlan, 
  PlantUnit, 
  UnitId 
} from '../types/game';
import { TRAINING_PROGRAMS } from '../data/methodologiesData';
import { 
  GraduationCap, Users, Clock, DollarSign, 
  CheckCircle2, BookOpen, Award, ArrowRight, ShieldCheck, Zap
} from 'lucide-react';
import { sound } from '../utils/audio';

interface TrainingManagerProps {
  activePlans: ActiveTrainingPlan[];
  units: PlantUnit[];
  cashBalance: number;
  onCreatePlan: (plan: Omit<ActiveTrainingPlan, 'id' | 'progressHours' | 'status' | 'dayStarted' | 'hourStarted'>) => void;
  preselectedUnitId?: UnitId | null;
}

export const TrainingManager: React.FC<TrainingManagerProps> = ({
  activePlans,
  units,
  cashBalance,
  onCreatePlan,
  preselectedUnitId
}) => {
  const [selectedProgramId, setSelectedProgramId] = useState<string>('JI_WORK_INSTRUCTION');
  const [targetAudience, setTargetAudience] = useState<string>('Operadores de Producción');
  const [selectedUnitId, setSelectedUnitId] = useState<UnitId | 'all'>(preselectedUnitId || 'proceso');
  const [workersCount, setWorkersCount] = useState<number>(8);
  const [durationOption, setDurationOption] = useState<'BASE' | 'INTENSIVO'>('BASE');

  const selectedProgram = TRAINING_PROGRAMS.find((p) => p.id === selectedProgramId) || TRAINING_PROGRAMS[0];

  const effectiveHours = durationOption === 'BASE' 
    ? selectedProgram.durationHours 
    : Math.round(selectedProgram.durationHours * 1.5);

  const effectiveCostPerWorker = durationOption === 'BASE'
    ? selectedProgram.costPerWorker
    : Math.round(selectedProgram.costPerWorker * 1.4);

  const totalCost = workersCount * effectiveCostPerWorker;
  const canAfford = cashBalance >= totalCost;

  const handleLaunchPlan = () => {
    if (!canAfford) {
      sound.playWarning();
      return;
    }
    sound.playShiftStart();
    onCreatePlan({
      programId: selectedProgram.id,
      title: selectedProgram.title,
      targetAudience: `${targetAudience} (${selectedUnitId === 'all' ? 'Toda la Planta' : units.find(u => u.id === selectedUnitId)?.name})`,
      unitId: selectedUnitId === 'all' ? undefined : selectedUnitId,
      workersCount,
      totalCost,
      totalHours: effectiveHours
    });
  };

  const audiences = [
    'Operadores de Producción',
    'Técnicos de Mantenimiento',
    'Inspectores de Calidad',
    'Personal de Bodegas y Despacho',
    'Supervisores de Turno',
    'Personal Polivalente de Planta'
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Top Header Banner */}
      <div className="p-4 sm:p-6 bg-[#0f141c] border-2 border-[#222c3a] rounded-xl shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <GraduationCap className="w-4 h-4" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-sans">
                Gestión & Planes de Capacitación Laboral
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 font-mono max-w-3xl leading-relaxed">
              Diseña e impulsa planes de formación técnica continua en el Gemba para elevar las competencias del personal, reducir la curva de aprendizaje, erradicar accidentes y estandarizar la operación.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#151c26] p-3 rounded-lg border border-[#263342] text-xs font-mono">
            <div>
              <span className="text-zinc-400 block text-[10px] uppercase">Caja Disponible para Capacitación</span>
              <strong className="text-emerald-400 text-base font-bold">${cashBalance.toLocaleString()}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Formulator / Plan Designer (Left) + Selected Curriculum Syllabus (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Program Selection & Formulation Form */}
        <div className="lg:col-span-6 bg-[#111721] border-2 border-[#222f3e] rounded-xl p-5 space-y-4 shadow-xl">
          <div className="border-b border-[#212c3b] pb-3 flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase text-zinc-300 font-bold flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>1. Configurar Nuevo Plan de Formación</span>
            </h2>
            <span className="text-xs text-zinc-400 font-mono">
              Inversión en Capital Humano
            </span>
          </div>

          {/* Program Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-zinc-400 block">
              Programa Temático de Formación:
            </label>
            <select
              value={selectedProgramId}
              onChange={(e) => {
                sound.playClick();
                setSelectedProgramId(e.target.value);
              }}
              className="w-full px-3 py-2 bg-[#0e141c] border border-[#273445] rounded-lg text-xs text-white font-mono focus:outline-none focus:border-amber-500"
            >
              {TRAINING_PROGRAMS.map((prog) => (
                <option key={prog.id} value={prog.id}>
                  {prog.title} ({prog.durationHours} hrs)
                </option>
              ))}
            </select>
          </div>

          {/* Target Audience */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-zinc-400 block">
              Público Objetivo / Perfil:
            </label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full px-3 py-2 bg-[#0e141c] border border-[#273445] rounded-lg text-xs text-white font-mono focus:outline-none focus:border-amber-500"
            >
              {audiences.map((aud) => (
                <option key={aud} value={aud}>
                  {aud}
                </option>
              ))}
            </select>
          </div>

          {/* Target Unit */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-zinc-400 block">
              Área / Departamento Asignado:
            </label>
            <select
              value={selectedUnitId}
              onChange={(e) => setSelectedUnitId(e.target.value as UnitId | 'all')}
              className="w-full px-3 py-2 bg-[#0e141c] border border-[#273445] rounded-lg text-xs text-white font-mono focus:outline-none focus:border-amber-500"
            >
              <option value="all">Toda la Planta (Capacitación Transversal)</option>
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} (Jefe: {u.chiefName})
                </option>
              ))}
            </select>
          </div>

          {/* Number of Workers & Duration Modality */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-400 block">
                Dotación a Formar:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={2}
                  max={30}
                  value={workersCount}
                  onChange={(e) => setWorkersCount(Math.max(2, Math.min(30, Number(e.target.value))))}
                  className="w-full px-3 py-2 bg-[#0e141c] border border-[#273445] rounded-lg text-xs text-white font-mono focus:outline-none focus:border-amber-500 text-center font-bold"
                />
                <span className="text-xs text-zinc-400 font-mono">personas</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-400 block">
                Modalidad / Intensidad:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setDurationOption('BASE')}
                  className={`py-2 px-1 text-center rounded border text-xs font-mono cursor-pointer transition-colors ${
                    durationOption === 'BASE'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                      : 'bg-[#0e141c] border-[#253242] text-zinc-400'
                  }`}
                >
                  Estándar ({selectedProgram.durationHours}h)
                </button>
                <button
                  type="button"
                  onClick={() => setDurationOption('INTENSIVO')}
                  className={`py-2 px-1 text-center rounded border text-xs font-mono cursor-pointer transition-colors ${
                    durationOption === 'INTENSIVO'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-[#0e141c] border-[#253242] text-zinc-400'
                  }`}
                >
                  Intensivo ({Math.round(selectedProgram.durationHours * 1.5)}h)
                </button>
              </div>
            </div>
          </div>

          {/* Financial Calculation Box */}
          <div className="p-3 bg-[#0c1017] rounded-lg border border-[#212c3b] font-mono text-xs space-y-1.5">
            <div className="flex justify-between text-zinc-400">
              <span>Costo unitario por persona:</span>
              <strong className="text-white">${effectiveCostPerWorker.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Duración total estimada:</span>
              <strong className="text-zinc-200">{effectiveHours} horas pedagógicas en Gemba</strong>
            </div>
            <div className="pt-1.5 border-t border-[#1e2736] flex justify-between text-sm">
              <span className="text-zinc-300 font-bold">Inversión Total Requerida:</span>
              <strong className={`${canAfford ? 'text-emerald-400' : 'text-rose-400'} font-bold`}>
                ${totalCost.toLocaleString()}
              </strong>
            </div>
          </div>

          {!canAfford && (
            <div className="text-xs text-rose-400 font-mono flex items-center gap-1.5">
              <span>Saldo insuficiente en caja de la planta (${cashBalance.toLocaleString()}).</span>
            </div>
          )}

          {/* Launch Button */}
          <button
            onClick={handleLaunchPlan}
            disabled={!canAfford}
            className={`w-full py-3 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer font-sans shadow-lg ${
              canAfford
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Aprobar & Lanzar Plan de Capacitación (${totalCost.toLocaleString()})</span>
          </button>
        </div>

        {/* Right: Program Syllabus & Pedagogy Details */}
        <div className="lg:col-span-6 bg-[#101621] border-2 border-[#243142] rounded-xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-[#212c3b] pb-3">
              <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/40 rounded text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
                Programa Seleccionado
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight font-sans mt-1.5">
                {selectedProgram.title}
              </h3>
              <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                {selectedProgram.shortDesc}
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-mono uppercase text-zinc-400 font-bold flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Competencia Clave a Desarrollar:</span>
              </span>
              <p className="text-xs text-emerald-300 font-mono bg-[#0c1017] p-2.5 rounded border border-[#1e2736]">
                {selectedProgram.competencyTarget}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-zinc-400 font-bold block">
                Módulos del Plan de Estudios (Syllabus):
              </span>
              <div className="space-y-2">
                {selectedProgram.syllabus.map((topic, i) => (
                  <div
                    key={i}
                    className="p-2.5 bg-[#0e131b] rounded border border-[#1e2836] text-xs text-zinc-200 flex items-start gap-2.5"
                  >
                    <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      {i + 1}
                    </span>
                    <span className="leading-snug">{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#131922] rounded-lg border border-[#212c3b] text-xs text-zinc-400 font-mono">
            <span className="text-zinc-300 font-bold block mb-0.5">Dinámica Operativa:</span>
            Las horas de capacitación se van completando ciclo a ciclo conforme avanza la jornada de la planta. Al finalizar el plan, los operarios aplicarán los nuevos estándares de inmediato.
          </div>
        </div>
      </div>

      {/* Active & Completed Training Plans */}
      <div className="p-5 bg-[#0f141c] border-2 border-[#222c3a] rounded-xl shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#212c3b] pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Planes de Capacitación en Ejecución ({activePlans.length})
            </h2>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            Seguimiento de Avance Horario
          </span>
        </div>

        {activePlans.length === 0 ? (
          <div className="py-12 text-center text-zinc-400 font-mono text-xs">
            <p className="text-zinc-300 font-bold mb-1">No hay planes de capacitación activos en este momento.</p>
            <p className="text-zinc-400">Formula un programa en el panel superior para capacitar al personal de la planta.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {activePlans.map((plan) => {
              const percent = Math.min(100, Math.round((plan.progressHours / plan.totalHours) * 100));
              const isCompleted = plan.status === 'COMPLETADO' || percent >= 100;

              return (
                <div
                  key={plan.id}
                  className={`p-4 rounded-xl border space-y-3 ${
                    isCompleted
                      ? 'bg-[#101b17] border-emerald-500/50'
                      : 'bg-[#131922] border-[#253242]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-white font-sans">{plan.title}</h4>
                      <span className="text-[11px] font-mono text-zinc-400 block mt-0.5">
                        {plan.targetAudience}
                      </span>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                    }`}>
                      {isCompleted ? 'COMPLETADO' : 'EN CURSO'}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono text-zinc-400">
                      <span>Progreso:</span>
                      <strong className="text-white">
                        {plan.progressHours} / {plan.totalHours} hrs ({percent}%)
                      </strong>
                    </div>
                    <div className="w-full h-2 bg-[#1b232f] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-emerald-400'} rounded-full transition-all duration-300`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#0b0f16] rounded border border-[#1e2736] font-mono text-xs flex justify-between text-zinc-400">
                    <span>Dotación: <strong className="text-zinc-200">{plan.workersCount} personas</strong></span>
                    <span>Inversión: <strong className="text-emerald-400">${plan.totalCost.toLocaleString()}</strong></span>
                  </div>

                  {isCompleted ? (
                    <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Competencias certificadas. Reducción de variabilidad en Gemba.</span>
                    </div>
                  ) : (
                    <div className="text-[11px] text-zinc-400 font-mono italic">
                      Sesiones en desarrollo durante los turnos de operación.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
