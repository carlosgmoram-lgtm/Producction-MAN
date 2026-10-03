import React, { useState } from 'react';
import { 
  PlantUnit, 
  Character, 
  PlantIndicators, 
  EngineerProfile, 
  ProcessConfig, 
  MachineDefinition, 
  ActiveImplementation, 
  ActiveTrainingPlan, 
  MaintenancePlanState, 
  DayLogEntry 
} from '../types/game';
import { 
  X, FileText, Printer, Award, TrendingUp, AlertTriangle, 
  CheckCircle2, Wrench, Shield, DollarSign, Activity, Cpu, 
  Layers, Users, Clock, Target, BarChart3, ChevronRight, Download
} from 'lucide-react';
import { sound } from '../utils/audio';

interface PlantReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: number;
  hour: number;
  processConfig: ProcessConfig;
  indicators: PlantIndicators;
  units: PlantUnit[];
  characters: Record<string, Character>;
  engineer: EngineerProfile;
  machines: MachineDefinition[];
  activeImplementations: ActiveImplementation[];
  activeTrainingPlans: ActiveTrainingPlan[];
  maintenancePlan: MaintenancePlanState;
  logs: DayLogEntry[];
}

export const PlantReportModal: React.FC<PlantReportModalProps> = ({
  isOpen,
  onClose,
  day,
  hour,
  processConfig,
  indicators,
  units,
  characters,
  engineer,
  machines,
  activeImplementations,
  activeTrainingPlans,
  maintenancePlan,
  logs
}) => {
  const [reportType, setReportType] = useState<'executive' | 'technical'>('executive');

  if (!isOpen) return null;

  // Key Calculations
  const ebitda = indicators.dailyRevenue - indicators.dailyCost;
  const targetUnits = indicators.dailyProductionTarget;
  const producedUnits = indicators.unitsProducedToday;
  const progressPercent = Math.min(100, Math.round((producedUnits / targetUnits) * 100));
  
  // OEE Components
  const avail = indicators.availability;
  const perf = indicators.performance;
  const qual = indicators.qualityRate;
  const calculatedOee = Number(((avail * perf * qual) / 10000).toFixed(1));

  // Machines analytics
  const highWearMachines = machines.filter((m) => m.wearPercent >= 60);
  const avgMachineWear = machines.length > 0 
    ? Math.round(machines.reduce((acc, m) => acc + m.wearPercent, 0) / machines.length)
    : 0;

  // Decisions logged
  const decisionLogs = logs.filter((l) => l.type === 'DILEMMA');

  // Overall Score Calculation (0-100)
  const healthScore = Math.round(
    indicators.oee * 0.35 + 
    indicators.otif * 0.25 + 
    (indicators.plantMorale) * 0.20 + 
    (indicators.cashBalance > 300000 ? 20 : (indicators.cashBalance / 300000) * 20)
  );

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200 print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:border-none print:shadow-none print:rounded-none print:text-black print:bg-white">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-800 bg-slate-950/80 print:bg-white print:border-b-2 print:border-black">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 print:hidden">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white print:text-black font-sans">
                  Informe de Operaciones & Auditoría de Planta
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 print:border print:border-black print:text-black">
                  AUDITORÍA SCADA
                </span>
              </div>
              <p className="text-xs text-slate-400 print:text-gray-600 font-mono">
                {processConfig.plantName} · Día {day}, {hour < 10 ? `0${hour}` : hour}:00 hrs · Responsable: {engineer.name} ({engineer.title})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#17202c] hover:bg-[#222e3f] text-blue-300 border border-blue-500/40 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Imprimir o guardar como PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Imprimir / PDF</span>
            </button>
            <button
              onClick={() => { sound.playClick(); onClose(); }}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Switcher Tabs: Resumen Ejecutivo vs Informe Técnico */}
        <div className="px-5 sm:px-6 pt-3 pb-2 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between gap-4 overflow-x-auto print:hidden">
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => { sound.playClick(); setReportType('executive'); }}
              className={`px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-2 ${
                reportType === 'executive'
                  ? 'bg-blue-600 text-white border-blue-500 font-bold shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Resumen Ejecutivo (Directorio)</span>
            </button>

            <button
              onClick={() => { sound.playClick(); setReportType('technical'); }}
              className={`px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-2 ${
                reportType === 'technical'
                  ? 'bg-amber-600 text-white border-amber-500 font-bold shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Informe Técnico de Ingeniería (Gemba)</span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-slate-400 hidden md:flex items-center gap-2">
            <span>Puntuación de Planta:</span>
            <strong className={`font-bold ${healthScore >= 80 ? 'text-emerald-400' : healthScore >= 65 ? 'text-amber-400' : 'text-rose-400'}`}>
              {healthScore} / 100
            </strong>
          </div>
        </div>

        {/* Report Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 print:overflow-visible print:p-0 print:space-y-4">
          
          {/* Print Only Header */}
          <div className="hidden print:block pb-4 mb-4 border-b border-black">
            <h1 className="text-2xl font-bold uppercase">{processConfig.plantName}</h1>
            <p className="text-sm text-gray-700">{processConfig.productDescription}</p>
            <div className="text-xs text-gray-600 mt-1 flex justify-between">
              <span>Informe Oficial de Gestión de Operaciones</span>
              <span>Día {day} · {hour}:00 hrs · Ing. Residente: {engineer.name}</span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* TAB 1: RESUMEN EJECUTIVO (GERENCIA GENERAL Y DIRECTORIO)  */}
          {/* ========================================================= */}
          {reportType === 'executive' && (
            <div className="space-y-6">
              {/* Executive Snapshot Card */}
              <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-[#121924] via-[#10151c] to-[#0c1015] border border-slate-700/80 shadow-md">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-blue-400 tracking-wider font-bold">
                      Estado General de Operaciones
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                      Diagnóstico Integral: {healthScore >= 85 ? 'Operación Sobresaliente y Altamente Competitiva' : healthScore >= 70 ? 'Operación Estable con Oportunidades de Mejora Continua' : 'Operación Bajo Tensión Operativa y Riesgo de Cuello de Botella'}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right font-mono">
                      <span className="text-[10px] text-slate-400 block">Aprobación Directorio</span>
                      <span className="text-base font-bold text-amber-400">{indicators.boardApproval}%</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-lg font-bold text-emerald-400 font-mono">
                      {healthScore}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">OEE Global</span>
                    <strong className="text-base font-bold text-emerald-400">{indicators.oee}%</strong>
                    <span className="text-[10px] text-slate-500 block">Clase mundial: &gt;85%</span>
                  </div>

                  <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Cumplimiento OTIF</span>
                    <strong className="text-base font-bold text-blue-400">{indicators.otif.toFixed(1)}%</strong>
                    <span className="text-[10px] text-slate-500 block">Meta entrega: &gt;95%</span>
                  </div>

                  <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Caja Disponible</span>
                    <strong className="text-base font-bold text-emerald-400">${indicators.cashBalance.toLocaleString()}</strong>
                    <span className="text-[10px] text-slate-500 block">EBITDA día: ${ebitda.toLocaleString()}</span>
                  </div>

                  <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Seguridad Laboral</span>
                    <strong className="text-base font-bold text-amber-300">{indicators.daysWithoutIncidents} días</strong>
                    <span className="text-[10px] text-slate-500 block">Cero incidentes</span>
                  </div>
                </div>
              </div>

              {/* Progress Against Master Schedule */}
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-amber-400" />
                    <span>Cumplimiento del Plan Maestro de Producción (MPS)</span>
                  </span>
                  <span className="text-slate-300">
                    <strong>{producedUnits.toLocaleString()}</strong> / {targetUnits.toLocaleString()} unidades ({progressPercent}%)
                  </span>
                </div>

                <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500" 
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Ritmo actual: <strong>{units.find(u => u.id === 'proceso')?.metrics.unidadesHora?.value || '880'} u/hora</strong></span>
                  <span>Restricción física activa: <strong className="text-amber-400">{processConfig.bottleneckStation}</strong></span>
                </div>
              </div>

              {/* Strategic Insights & Risks Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Critical Risks & Bottlenecks */}
                <div className="p-4 bg-slate-950/70 rounded-xl border border-rose-900/40 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Puntos Críticos de Atención para la Gerencia</span>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5"></span>
                      <span>
                        <strong>Cuello de Botella Operativo:</strong> La estación de {processConfig.bottleneckStation} marca el ritmo de facturación. Cualquier microparada en este equipo destruye directamente el OEE de toda la planta.
                      </span>
                    </li>
                    {highWearMachines.length > 0 ? (
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5"></span>
                        <span>
                          <strong>Activos en Zona de Fatiga:</strong> Se detectan {highWearMachines.length} máquina(s) con desgaste &gt; 60% ({highWearMachines.map(m => m.name).join(', ')}). Riesgo inminente de detención forzada.
                        </span>
                      </li>
                    ) : (
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5"></span>
                        <span>
                          <strong>Salud del Parque de Máquinas:</strong> Desgaste mecánico promedio controlado en {avgMachineWear}%. Ningún equipo supera el umbral crítico.
                        </span>
                      </li>
                    )}
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5"></span>
                      <span>
                        <strong>Costo de la No Conformidad:</strong> La tasa de defectos actual es de <strong>{indicators.scrapPpm} PPM</strong>. Cada 100 PPM representan mermas en materia prima y reprocesos.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Managerial Directives & Next Steps */}
                <div className="p-4 bg-slate-950/70 rounded-xl border border-blue-900/40 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                    <Award className="w-4 h-4" />
                    <span>Directrices Estratégicas Recomendadas</span>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5"></span>
                      <span>
                        <strong>Subordinación al Cuello de Botella (TOC):</strong> Asegurar que las estaciones previas alimenten de forma continua a {processConfig.bottleneckStation} sin saturar los almacenes de producto intermedio (WIP).
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5"></span>
                      <span>
                        <strong>Consolidación Metodológica:</strong> Hay {activeImplementations.length} iniciativa(s) en curso. Se recomienda esperar la fase de Maduración (&gt;15 ciclos) antes de agregar nuevas cargas administrativas al personal.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5"></span>
                      <span>
                        <strong>S&OP y Sincronización Comercial:</strong> Mantener el OTIF por encima del 95% para preservar las alianzas clave y evitar sanciones contractuales por atrasos.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Chief Department Perspectives Brief */}
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                  Evaluación por Departamento (Comité de Operaciones)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  {Object.values(characters).slice(0, 6).map((char) => {
                    const unit = units.find(u => u.id === char.unitId);
                    return (
                      <div key={char.id} className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800/80">
                        <div className="flex items-center justify-between mb-1">
                          <strong className="text-white text-xs truncate">{char.name}</strong>
                          <span className="text-[10px] font-mono text-emerald-400">{char.morale}% moral</span>
                        </div>
                        <div className="text-[10px] text-amber-400/90 font-mono mb-1">{unit?.shortName}</div>
                        <p className="text-[11px] text-slate-300 italic line-clamp-2">
                          "{char.currentAdvice}"
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: INFORME TÉCNICO DETALLADO DE INGENIERÍA (GEMBA)    */}
          {/* ========================================================= */}
          {reportType === 'technical' && (
            <div className="space-y-6">
              
              {/* OEE Mathematical Decomposition */}
              <div className="p-4 sm:p-5 rounded-xl bg-slate-950/80 border border-amber-500/40 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
                      Descomposición Matemática del OEE (Overall Equipment Effectiveness)
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                    OEE: {calculatedOee}%
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                      <span>Disponibilidad (A)</span>
                      <strong className="text-emerald-400 text-sm">{avail}%</strong>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-emerald-500" style={{ width: `${avail}%` }}></div>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      MTBF: <strong>{maintenancePlan.mtbfHours} hrs</strong> · MTTR: <strong>{maintenancePlan.mttrHours} hrs</strong>. Estrategia: {maintenancePlan.strategyName}.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                      <span>Rendimiento (P)</span>
                      <strong className="text-blue-400 text-sm">{perf}%</strong>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-blue-500" style={{ width: `${perf}%` }}></div>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Takt Time: <strong>38 seg</strong> · Tiempo de Ciclo Real: <strong>41 seg</strong>. Brecha de velocidad por microrretenciones.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                      <span>Tasa de Calidad (Q)</span>
                      <strong className="text-amber-400 text-sm">{qual}%</strong>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-amber-500" style={{ width: `${qual}%` }}></div>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Scrap Rate: <strong>{indicators.scrapPpm} PPM</strong> · Rendimiento (First Pass Yield): <strong>{(100 - indicators.scrapPpm / 10000).toFixed(2)}%</strong>.
                    </p>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-400 p-2.5 bg-[#0a0d12] rounded border border-slate-800 flex items-center justify-between">
                  <span>Fórmula TPM Estándar: OEE = Disponibilidad ({avail}%) × Rendimiento ({perf}%) × Calidad ({qual}%)</span>
                  <span className="font-bold text-white">= {calculatedOee}%</span>
                </div>
              </div>

              {/* Physical Machines Audit Table */}
              <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-mono uppercase text-slate-300 font-bold tracking-wider">
                      Inventario Físico de Maquinarias & Estado de Confiabilidad ({machines.length} Activos)
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Desgaste Medio: <strong>{avgMachineWear}%</strong>
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/90">
                        <th className="p-2">Equipo / Activo</th>
                        <th className="p-2">Estación</th>
                        <th className="p-2">Criticidad</th>
                        <th className="p-2">Desgaste</th>
                        <th className="p-2">Horas Uso</th>
                        <th className="p-2">Sensores IoT</th>
                        <th className="p-2">Condición</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {machines.map((m) => (
                        <tr key={m.id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="p-2 font-semibold text-white">
                            <div>{m.name}</div>
                            <div className="text-[10px] text-slate-500 font-sans">{m.type}</div>
                          </td>
                          <td className="p-2 text-slate-400">{m.unitName}</td>
                          <td className="p-2">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              m.criticality === 'CRITICA' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                              m.criticality === 'ALTA' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                              'bg-slate-800 text-slate-300'
                            }`}>
                              {m.criticality}
                            </span>
                          </td>
                          <td className="p-2">
                            <div className="flex items-center gap-1.5">
                              <span className={m.wearPercent > 60 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                                {Math.round(m.wearPercent)}%
                              </span>
                              <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${m.wearPercent > 60 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                                  style={{ width: `${m.wearPercent}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="p-2 tabular-nums">{m.operatingHours.toLocaleString()}h</td>
                          <td className="p-2">
                            {m.installedSensors ? (
                              <span className="text-emerald-400 flex items-center gap-1 text-[10px]">
                                <CheckCircle2 className="w-3 h-3" /> Telemetría
                              </span>
                            ) : (
                              <span className="text-slate-500 text-[10px]">Manual</span>
                            )}
                          </td>
                          <td className="p-2">
                            <span className={`text-[10px] font-bold ${
                              m.status === 'CUELLO_BOTELLA' ? 'text-amber-400' :
                              m.status === 'EN_ALERTA' ? 'text-rose-400 animate-pulse' :
                              'text-emerald-400'
                            }`}>
                              {m.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Methodologies & Training Maturation Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Active Methodologies */}
                <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-400 uppercase">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-4 h-4" />
                      <span>Metodologías en Gemba ({activeImplementations.length})</span>
                    </span>
                  </div>

                  {activeImplementations.length === 0 ? (
                    <p className="text-xs text-slate-400 italic p-3 bg-slate-900 rounded border border-slate-800">
                      No hay metodologías implementadas. Ve a la pestaña "Metodologías" para implementar 5S, TPM, Lean o Procedimientos Estandarizados.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {activeImplementations.map((impl) => (
                        <div key={impl.id} className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-xs font-mono">
                          <div className="flex items-center justify-between mb-1">
                            <strong className="text-white">{impl.methodologyId}</strong>
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              {impl.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 mb-1">
                            Alcance: {impl.targetName} ({impl.scopeType}) · {impl.cyclesActive} ciclos activos
                          </div>
                          <p className="text-[10px] text-slate-300 italic">
                            {impl.statusNote}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Training Plans */}
                <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-400 uppercase">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      <span>Planes de Capacitación ({activeTrainingPlans.length})</span>
                    </span>
                  </div>

                  {activeTrainingPlans.length === 0 ? (
                    <p className="text-xs text-slate-400 italic p-3 bg-slate-900 rounded border border-slate-800">
                      No hay planes de capacitación activos. Diseña mallas formativas en la pestaña "Capacitación" para elevar la moral y reducir defectos.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {activeTrainingPlans.map((plan) => (
                        <div key={plan.id} className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-xs font-mono">
                          <div className="flex items-center justify-between mb-1">
                            <strong className="text-white">{plan.title}</strong>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                              plan.status === 'COMPLETADO' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'
                            }`}>
                              {plan.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                            <span>Dotación: {plan.workersCount} operarios</span>
                            <span>{plan.progressHours} / {plan.totalHours} hrs</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500" 
                              style={{ width: `${Math.round((plan.progressHours / plan.totalHours) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Decision Evolution Chronology */}
              <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300 uppercase">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Curva de Decisiones Tomadas por el Ingeniero ({decisionLogs.length} Contingencias)</span>
                  </span>
                </div>

                {decisionLogs.length === 0 ? (
                  <p className="text-xs text-slate-400 italic p-3 bg-slate-900 rounded border border-slate-800">
                    Aún no se han presentado contingencias operacionales. Cuando ocurran eventos imprevistos, aquí se registrará cómo evolucionaron tus decisiones.
                  </p>
                ) : (
                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {decisionLogs.map((log, idx) => (
                      <div key={idx} className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs">
                        <div className="flex items-center justify-between text-[11px] font-mono text-amber-400 mb-1">
                          <span>Día {log.day}, {log.hour}:00 hrs</span>
                          <span className="text-slate-400">{log.title}</span>
                        </div>
                        <p className="text-slate-200 font-medium mb-1">
                          {log.description}
                        </p>
                        <div className="text-[11px] text-emerald-400 font-mono pl-2 border-l-2 border-emerald-500/50">
                          Desenlace Operacional: {log.impact}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Official Engineering Sign-off Box */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
            <div>
              <span className="block text-slate-300 font-bold">V°B° AUDITORÍA TÉCNICA DE OPERACIONES</span>
              <span>Colegio de Ingenieros Industriales de Chile · Certificación ISO 9001 / HACCP / TPM</span>
            </div>
            <div className="text-right">
              <span className="text-amber-400 font-bold block">{engineer.name}</span>
              <span className="text-slate-500">{engineer.specialty} · {engineer.level}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs font-mono text-slate-400 print:hidden">
          <span>Production Man · Sistema de Simulación & Evaluación Docente</span>
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors cursor-pointer"
          >
            Cerrar Informe
          </button>
        </div>
      </div>
    </div>
  );
};
