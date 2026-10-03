import React, { useState } from 'react';
import { 
  MaintenancePlanState, 
  MachineDefinition, 
  MaintenanceStrategy, 
  PlantUnit 
} from '../types/game';
import { 
  Wrench, ShieldAlert, Cpu, CheckCircle2, 
  AlertTriangle, DollarSign, Activity, Settings, 
  Layers, HardHat, RefreshCw, Radio
} from 'lucide-react';
import { sound } from '../utils/audio';

interface MaintenanceManagerProps {
  maintenancePlan: MaintenancePlanState;
  machines: MachineDefinition[];
  units: PlantUnit[];
  cashBalance: number;
  onUpdateStrategy: (strategy: MaintenanceStrategy) => void;
  onTriggerOverhaul: (machineId: string) => void;
  onUpdateFrequency: (days: number) => void;
  onToggleSparePolicy: (policy: 'STOCK_PAÑOL' | 'JUST_IN_TIME') => void;
  onToggleAutonomousRoutine: () => void;
  onInstallSensors: () => void;
  onOpenMethodologyTarget?: (machineId: string) => void;
}

export const MaintenanceManager: React.FC<MaintenanceManagerProps> = ({
  maintenancePlan,
  machines,
  units,
  cashBalance,
  onUpdateStrategy,
  onTriggerOverhaul,
  onUpdateFrequency,
  onToggleSparePolicy,
  onToggleAutonomousRoutine,
  onInstallSensors,
  onOpenMethodologyTarget
}) => {
  const [selectedMachineId, setSelectedMachineId] = useState<string>(machines[2]?.id || machines[0]?.id);
  const [filterCriticality, setFilterCriticality] = useState<string>('TODAS');

  const selectedMachine = machines.find((m) => m.id === selectedMachineId) || machines[0];

  const filteredMachines = machines.filter((m) => {
    if (filterCriticality === 'TODAS') return true;
    return m.criticality === filterCriticality;
  });

  const getHealthBadge = (wearPercent: number) => {
    if (wearPercent >= 75) {
      return (
        <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 border border-rose-500/40 rounded text-[10px] font-mono font-bold animate-pulse">
          Riesgo Crítico ({wearPercent}% desgaste)
        </span>
      );
    }
    if (wearPercent >= 50) {
      return (
        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded text-[10px] font-mono font-bold">
          Desgaste Moderado ({wearPercent}%)
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded text-[10px] font-mono font-bold">
        Óptimo ({wearPercent}% desgaste)
      </span>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Industrial Top Header */}
      <div className="p-4 sm:p-6 bg-[#0f141c] border-2 border-[#222c3a] rounded-xl shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded bg-orange-500/10 border border-orange-500/30 text-orange-400">
                <Wrench className="w-4 h-4" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-sans">
                Plan de Mantenimiento & Confiabilidad de Activos
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 font-mono max-w-3xl leading-relaxed">
              Supervisa el plan de mantenimiento actual, el desgaste en tiempo real de la maquinaria crítica y toma decisiones estratégicas sobre paradas, inspecciones y stock de repuestos.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#141b25] p-3 rounded-lg border border-[#253242] text-xs font-mono">
            <div>
              <span className="text-zinc-400 block text-[10px] uppercase">Estrategia Vigente</span>
              <strong className="text-amber-400 text-sm font-sans">{maintenancePlan.strategyName}</strong>
            </div>
          </div>
        </div>

        {/* Maintenance Core KPI Dashboard Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-5">
          <div className="p-3 bg-[#131922] rounded-lg border border-[#232f3e]">
            <span className="text-[10px] font-mono text-zinc-400 uppercase">MTBF (Confiabilidad)</span>
            <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
              {maintenancePlan.mtbfHours} hrs
            </div>
            <span className="text-[10px] text-zinc-400">Tiempo medio entre fallas</span>
          </div>

          <div className="p-3 bg-[#131922] rounded-lg border border-[#232f3e]">
            <span className="text-[10px] font-mono text-zinc-400 uppercase">MTTR (Reparabilidad)</span>
            <div className="text-lg font-bold text-blue-400 font-mono mt-0.5">
              {maintenancePlan.mttrHours} hrs
            </div>
            <span className="text-[10px] text-zinc-400">Tiempo medio de reparación</span>
          </div>

          <div className="p-3 bg-[#131922] rounded-lg border border-[#232f3e]">
            <span className="text-[10px] font-mono text-zinc-400 uppercase">Disponibilidad Técnica</span>
            <div className="text-lg font-bold text-white font-mono mt-0.5">
              {((maintenancePlan.mtbfHours / (maintenancePlan.mtbfHours + maintenancePlan.mttrHours)) * 100).toFixed(1)}%
            </div>
            <span className="text-[10px] text-zinc-400">OEE Disponibilidad global</span>
          </div>

          <div className="p-3 bg-[#131922] rounded-lg border border-[#232f3e]">
            <span className="text-[10px] font-mono text-zinc-400 uppercase">Cumplimiento Plan</span>
            <div className="text-lg font-bold text-amber-400 font-mono mt-0.5">
              {maintenancePlan.compliancePercent}%
            </div>
            <span className="text-[10px] text-zinc-400">Preventivos ejecutados a tiempo</span>
          </div>

          <div className="p-3 bg-[#131922] rounded-lg border border-[#232f3e]">
            <span className="text-[10px] font-mono text-zinc-400 uppercase">Frecuencia Rutinas</span>
            <div className="text-lg font-bold text-cyan-400 font-mono mt-0.5">
              Cada {maintenancePlan.inspectionFrequencyDays} días
            </div>
            <span className="text-[10px] text-zinc-400">Inspección sistemática</span>
          </div>

          <div className="p-3 bg-[#131922] rounded-lg border border-[#232f3e]">
            <span className="text-[10px] font-mono text-zinc-400 uppercase">Stock Pañol Repuestos</span>
            <div className="text-lg font-bold text-white font-mono mt-0.5">
              {maintenancePlan.sparePartsStockCount} unid.
            </div>
            <span className="text-[10px] text-zinc-400">
              {maintenancePlan.sparePartsPolicy === 'STOCK_PAÑOL' ? 'En Pañol (Seguridad)' : 'Bajo Demanda (JIT)'}
            </span>
          </div>
        </div>
      </div>

      {/* Decision Center: Managerial Actions on Maintenance Plan */}
      <div className="p-5 bg-[#111721] border-2 border-amber-500/40 rounded-xl shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#212c3b] pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Centro de Decisiones del Ingeniero sobre el Plan de Mantenimiento
            </h2>
          </div>
          <span className="text-xs text-amber-400 font-mono font-semibold">
            Saldo de Caja: ${cashBalance.toLocaleString()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Decision 1: Change Maintenance Strategy */}
          <div className="p-4 bg-[#141b25] border border-[#263342] rounded-lg flex flex-col justify-between space-y-3">
            <div>
              <span className="text-xs font-mono uppercase text-zinc-400 font-bold block mb-1">
                Estrategia Global de Mantenimiento
              </span>
              <p className="text-xs text-zinc-300 leading-snug">
                Define el enfoque rector de confiabilidad operacional de toda la planta.
              </p>
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              <button
                onClick={() => { sound.playClick(); onUpdateStrategy('PREVENTIVO_SISTEMATICO'); }}
                className={`w-full p-2 rounded text-left border cursor-pointer transition-colors ${
                  maintenancePlan.strategy === 'PREVENTIVO_SISTEMATICO'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                    : 'bg-[#0f141c] border-[#222c39] text-zinc-400 hover:text-white'
                }`}
              >
                1. Preventivo Programado (Horas marcha)
              </button>

              <button
                onClick={() => { sound.playClick(); onUpdateStrategy('PREDICTIVO_CONDICION'); }}
                className={`w-full p-2 rounded text-left border cursor-pointer transition-colors ${
                  maintenancePlan.strategy === 'PREDICTIVO_CONDICION'
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                    : 'bg-[#0f141c] border-[#222c39] text-zinc-400 hover:text-white'
                }`}
              >
                2. Predictivo por Condición (Vibración / Térmico)
              </button>

              <button
                onClick={() => { sound.playClick(); onUpdateStrategy('TPM_AUTONOMO'); }}
                className={`w-full p-2 rounded text-left border cursor-pointer transition-colors ${
                  maintenancePlan.strategy === 'TPM_AUTONOMO'
                    ? 'bg-orange-500/20 border-orange-500 text-orange-300 font-bold'
                    : 'bg-[#0f141c] border-[#222c39] text-zinc-400 hover:text-white'
                }`}
              >
                3. TPM Integrado (Operadores en Gemba)
              </button>

              <button
                onClick={() => { sound.playClick(); onUpdateStrategy('REACTIVO'); }}
                className={`w-full p-2 rounded text-left border cursor-pointer transition-colors ${
                  maintenancePlan.strategy === 'REACTIVO'
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold'
                    : 'bg-[#0f141c] border-[#222c39] text-zinc-400 hover:text-white'
                }`}
              >
                4. Reactivo (Reparar solo tras rotura)
              </button>
            </div>
          </div>

          {/* Decision 2: Inspection Frequency & Spare Parts Policy */}
          <div className="p-4 bg-[#141b25] border border-[#263342] rounded-lg flex flex-col justify-between space-y-3">
            <div>
              <span className="text-xs font-mono uppercase text-zinc-400 font-bold block mb-1">
                Frecuencia del Plan & Política de Repuestos
              </span>
              <p className="text-xs text-zinc-300 leading-snug">
                Balance entre costo de mano de obra/pañol versus riesgo de desabastecimiento.
              </p>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Frecuencia de Inspección Preventiva:</label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => { sound.playClick(); onUpdateFrequency(7); }}
                    className={`py-1.5 px-2 rounded border text-center cursor-pointer ${
                      maintenancePlan.inspectionFrequencyDays === 7
                        ? 'bg-blue-500/20 border-blue-500 text-blue-300 font-bold'
                        : 'bg-[#0e141c] border-[#232f3e] text-zinc-400'
                    }`}
                  >
                    Semanal (7d)
                  </button>
                  <button
                    onClick={() => { sound.playClick(); onUpdateFrequency(14); }}
                    className={`py-1.5 px-2 rounded border text-center cursor-pointer ${
                      maintenancePlan.inspectionFrequencyDays === 14
                        ? 'bg-blue-500/20 border-blue-500 text-blue-300 font-bold'
                        : 'bg-[#0e141c] border-[#232f3e] text-zinc-400'
                    }`}
                  >
                    Quincenal (14d)
                  </button>
                  <button
                    onClick={() => { sound.playClick(); onUpdateFrequency(30); }}
                    className={`py-1.5 px-2 rounded border text-center cursor-pointer ${
                      maintenancePlan.inspectionFrequencyDays === 30
                        ? 'bg-blue-500/20 border-blue-500 text-blue-300 font-bold'
                        : 'bg-[#0e141c] border-[#232f3e] text-zinc-400'
                    }`}
                  >
                    Mensual (30d)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Política de Stock de Repuestos:</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => { sound.playClick(); onToggleSparePolicy('STOCK_PAÑOL'); }}
                    className={`p-2 rounded border text-left cursor-pointer ${
                      maintenancePlan.sparePartsPolicy === 'STOCK_PAÑOL'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-[#0e141c] border-[#232f3e] text-zinc-400'
                    }`}
                  >
                    <div className="font-bold">Stock Pañol</div>
                    <div className="text-[10px] text-zinc-400">Repuestos críticos in situ</div>
                  </button>

                  <button
                    onClick={() => { sound.playClick(); onToggleSparePolicy('JUST_IN_TIME'); }}
                    className={`p-2 rounded border text-left cursor-pointer ${
                      maintenancePlan.sparePartsPolicy === 'JUST_IN_TIME'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                        : 'bg-[#0e141c] border-[#232f3e] text-zinc-400'
                    }`}
                  >
                    <div className="font-bold">Just in Time</div>
                    <div className="text-[10px] text-zinc-400">Compra bajo pedido</div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Decision 3: Technological Upgrades & Operator Routines */}
          <div className="p-4 bg-[#141b25] border border-[#263342] rounded-lg flex flex-col justify-between space-y-3">
            <div>
              <span className="text-xs font-mono uppercase text-zinc-400 font-bold block mb-1">
                Tecnología & Mantenimiento Autónomo
              </span>
              <p className="text-xs text-zinc-300 leading-snug">
                Inversiones en instrumentación industrial y rutinas del operador.
              </p>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <button
                onClick={() => { sound.playClick(); onToggleAutonomousRoutine(); }}
                className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between cursor-pointer transition-colors ${
                  maintenancePlan.autonomousMaintenanceActive
                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                    : 'bg-[#0f141c] border-[#242f3d] text-zinc-300 hover:border-zinc-500'
                }`}
              >
                <div>
                  <div className="font-bold">Rutina Diaria de Operadores (15m)</div>
                  <div className="text-[10px] text-zinc-400">Limpieza, lubricación e inspección básica en Gemba</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  maintenancePlan.autonomousMaintenanceActive ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {maintenancePlan.autonomousMaintenanceActive ? 'ACTIVA' : 'INACTIVA'}
                </span>
              </button>

              <button
                onClick={() => { sound.playClick(); onInstallSensors(); }}
                className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between cursor-pointer transition-colors ${
                  maintenancePlan.predictiveSensorsActive
                    ? 'bg-cyan-950/40 border-cyan-500 text-cyan-200'
                    : 'bg-[#0f141c] border-[#242f3d] text-zinc-300 hover:border-zinc-500'
                }`}
              >
                <div>
                  <div className="font-bold">Monitoreo IoT en Tiempo Real</div>
                  <div className="text-[10px] text-zinc-400">Sensores de vibración y termografía continua</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  maintenancePlan.predictiveSensorsActive ? 'bg-cyan-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {maintenancePlan.predictiveSensorsActive ? 'INSTALADO' : 'PENDIENTE'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Assets Registry & Overhaul Center */}
      <div className="p-5 bg-[#0f141c] border-2 border-[#222c3a] rounded-xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#212c3b] pb-3">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>Matriz de Maquinaria Crítica & Estado de Desgaste ({machines.length} activos)</span>
            </h2>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Selecciona una máquina para auditar sus parámetros de ingeniería o autorizar una orden de parada preventiva / overhaul.
            </p>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="text-zinc-500 text-[11px]">Filtrar criticidad:</span>
            {['TODAS', 'CRITICA', 'ALTA', 'MEDIA'].map((crit) => (
              <button
                key={crit}
                onClick={() => setFilterCriticality(crit)}
                className={`px-2 py-0.5 rounded text-[11px] cursor-pointer transition-colors ${
                  filterCriticality === crit
                    ? 'bg-amber-500 text-zinc-950 font-bold'
                    : 'bg-[#151c26] text-zinc-400 hover:text-white border border-[#242f3d]'
                }`}
              >
                {crit}
              </button>
            ))}
          </div>
        </div>

        {/* Machine Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredMachines.map((machine) => {
            const isSelected = machine.id === selectedMachineId;
            const wearColor = 
              machine.wearPercent >= 75 ? 'bg-rose-500' :
              machine.wearPercent >= 50 ? 'bg-amber-500' : 'bg-emerald-500';

            return (
              <div
                key={machine.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedMachineId(machine.id);
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#182332] border-amber-500 shadow-md ring-1 ring-amber-500/40'
                    : 'bg-[#131922] border-[#232f3e] hover:border-zinc-500 hover:bg-[#161d28]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white font-sans">
                          {machine.name}
                        </h3>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {machine.unitName} · {machine.type}
                      </span>
                    </div>

                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                      machine.criticality === 'CRITICA' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                      machine.criticality === 'ALTA' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                      'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    }`}>
                      {machine.criticality}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-snug line-clamp-2 mt-1">
                    {machine.description}
                  </p>

                  {/* Wear & Hours Meters */}
                  <div className="mt-3 p-2.5 bg-[#0b0f16] rounded border border-[#1e2736] space-y-1.5 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400 text-[11px]">Nivel de Desgaste:</span>
                      {getHealthBadge(machine.wearPercent)}
                    </div>
                    <div className="w-full h-1.5 bg-[#1a222e] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${wearColor} rounded-full transition-all duration-300`}
                        style={{ width: `${machine.wearPercent}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                      <span>Horas Operadas: <strong className="text-zinc-200">{machine.operatingHours.toLocaleString()}h</strong></span>
                      <span>Capacidad: <strong className="text-zinc-200">{machine.nominalCapacity}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Overhaul & Methodology Quick Actions */}
                <div className="mt-3 pt-2.5 border-t border-[#1f2937] flex items-center justify-between gap-2 text-xs font-mono">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.playClick();
                      onTriggerOverhaul(machine.id);
                    }}
                    className={`px-2.5 py-1 rounded font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                      machine.wearPercent >= 50
                        ? 'bg-rose-600 hover:bg-rose-500 text-white'
                        : 'bg-[#1b2533] hover:bg-[#253346] text-zinc-300'
                    }`}
                    title="Ejecutar parada programada y overhaul para renovar el activo al 0% de desgaste"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Overhaul ({machine.wearPercent >= 50 ? 'Urgente' : 'Preventivo'})</span>
                  </button>

                  {onOpenMethodologyTarget && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.playClick();
                        onOpenMethodologyTarget(machine.id);
                      }}
                      className="px-2 py-1 text-amber-400 hover:text-amber-300 hover:underline text-[11px] flex items-center gap-1"
                    >
                      <Layers className="w-3 h-3" />
                      <span>Metodología</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
