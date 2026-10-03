import React from 'react';
import { PlantIndicators, PlantUnit, UnitId } from '../types/game';
import { Activity, ShieldCheck, DollarSign, TrendingUp, AlertTriangle, Layers, Clock, Cpu, BarChart3 } from 'lucide-react';

interface KpiDashboardProps {
  indicators: PlantIndicators;
  units: PlantUnit[];
}

export const KpiDashboard: React.FC<KpiDashboardProps> = ({ indicators, units }) => {
  const getUnit = (id: UnitId) => units.find((u) => u.id === id);
  const bottleneck = getUnit(indicators.bottleneckUnit);

  const ebitda = indicators.dailyRevenue - indicators.dailyCost;
  const oeeColor = indicators.oee >= 85 ? 'text-emerald-400' : indicators.oee >= 75 ? 'text-amber-400' : 'text-rose-400';

  return (
    <div className="space-y-6">
      {/* Top Banner: OEE Deep Dive & Little's Law */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* OEE Formula Card */}
        <div className="lg:col-span-2 p-5 bg-slate-900 border border-slate-800 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white tracking-tight">
                Eficacia Global de Equipos (OEE)
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Estándar World Class: &gt; 85%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
            {/* OEE Main Number */}
            <div className="p-4 bg-slate-950/80 rounded-lg border border-slate-800 text-center sm:text-left">
              <span className="text-[11px] font-mono text-slate-400 uppercase">OEE Total</span>
              <div className={`text-3xl font-bold font-mono tracking-tight ${oeeColor} mt-1`}>
                {indicators.oee.toFixed(1)}%
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-1">
                {indicators.oee >= 85 ? 'Nivel Clase Mundial' : indicators.oee >= 75 ? 'Aceptable con Brechas' : 'Bajo Estándar'}
              </div>
            </div>

            {/* Disponibilidad */}
            <div className="p-3 bg-slate-950/40 rounded border border-slate-800/80">
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                <span>Disponibilidad (A)</span>
                <strong className="text-white">{indicators.availability.toFixed(1)}%</strong>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${indicators.availability}%` }}></div>
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-1">
                Tiempo Operativo / Programado
              </div>
            </div>

            {/* Rendimiento */}
            <div className="p-3 bg-slate-950/40 rounded border border-slate-800/80">
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                <span>Rendimiento (P)</span>
                <strong className="text-white">{indicators.performance.toFixed(1)}%</strong>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${indicators.performance}%` }}></div>
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-1">
                Velocidad Real / Velocidad Ideal
              </div>
            </div>

            {/* Calidad */}
            <div className="p-3 bg-slate-950/40 rounded border border-slate-800/80">
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                <span>Calidad (Q)</span>
                <strong className="text-white">{indicators.qualityRate.toFixed(1)}%</strong>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${indicators.qualityRate}%` }}></div>
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-1">
                Unidades Buenas / Producidas
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Fórmula: OEE = Disponibilidad × Rendimiento × Calidad</span>
            <span className="text-slate-500">
              ({indicators.availability.toFixed(1)}% × {indicators.performance.toFixed(1)}% × {indicators.qualityRate.toFixed(1)}%)
            </span>
          </div>
        </div>

        {/* Theory of Constraints & Little's Law Card */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="w-5 h-5 text-blue-400" />
              <h2 className="text-base font-bold text-white tracking-tight">
                Teoría de Restricciones (TOC)
              </h2>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-lg border border-amber-500/40 mb-3">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block mb-1">
                Cuello de Botella del Sistema
              </span>
              <div className="text-sm font-bold text-white">
                {bottleneck?.name}
              </div>
              <div className="text-xs text-slate-300 mt-1">
                Determina el ritmo máximo (Throughput) de toda la planta. Aplicar Drum-Buffer-Rope.
              </div>
            </div>

            <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Ley de Little:</span>
                <span className="text-slate-200">WIP = TH × Lead Time</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">WIP en Planta:</span>
                <strong className="text-white">{indicators.wip.toLocaleString()} un.</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Lead Time Promedio:</span>
                <strong className="text-amber-400">{indicators.leadTimeHours.toFixed(1)} hrs</strong>
              </div>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-slate-500 font-mono">
            *Reducir el WIP disminuye directamente el tiempo de ciclo total.
          </div>
        </div>
      </div>

      {/* Financial & Production Scorecard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* EBITDA & Revenue */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>EBITDA Diario Estimado</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            ${ebitda.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-1 space-y-0.5">
            <div>Ingresos: +${indicators.dailyRevenue.toLocaleString()}</div>
            <div>Costos Ops: -${indicators.dailyCost.toLocaleString()}</div>
          </div>
        </div>

        {/* OTIF Fulfillment */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>Cumplimiento OTIF</span>
            <TrendingUp className="w-4 h-4 text-teal-400" />
          </div>
          <div className={`text-2xl font-bold font-mono ${indicators.otif >= 93 ? 'text-teal-400' : 'text-amber-400'}`}>
            {indicators.otif.toFixed(1)}%
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">
            On-Time In-Full de pedidos a clientes mayoristas e industriales.
          </div>
        </div>

        {/* Quality & PPM */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>Tasa de Defectos (PPM)</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {indicators.scrapPpm} <span className="text-xs text-slate-400 font-normal">PPM</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">
            Rendimiento Yield: <strong className="text-emerald-400">{indicators.qualityRate.toFixed(2)}%</strong>
          </div>
        </div>

        {/* Safety & Environment */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>Seguridad Laboral (HSE)</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {indicators.daysWithoutIncidents} <span className="text-xs text-slate-400 font-normal">días</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">
            Cero Accidentes con tiempo perdido en la planta.
          </div>
        </div>
      </div>

      {/* Unit by Unit Efficiency Comparison Table */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-amber-400" />
          <span>Matriz de Desempeño por Unidad Operativa</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="py-2.5 px-3">Unidad</th>
                <th className="py-2.5 px-3">Jefatura</th>
                <th className="py-2.5 px-3">Estado</th>
                <th className="py-2.5 px-3">Salud Máquinas</th>
                <th className="py-2.5 px-3">Eficiencia</th>
                <th className="py-2.5 px-3">Estrés</th>
                <th className="py-2.5 px-3">Personal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {units.map((unit) => (
                <tr key={unit.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-white">{unit.name}</td>
                  <td className="py-2.5 px-3 text-slate-300">{unit.chiefName}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      unit.id === indicators.bottleneckUnit
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {unit.id === indicators.bottleneckUnit ? 'RESTRICCIÓN (TOC)' : unit.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-emerald-400 font-bold">{unit.health}%</td>
                  <td className="py-2.5 px-3 text-blue-400 font-bold">{unit.efficiency}%</td>
                  <td className="py-2.5 px-3 text-amber-400">{unit.stressLevel}%</td>
                  <td className="py-2.5 px-3 text-slate-300">{unit.activeWorkers} op.</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
