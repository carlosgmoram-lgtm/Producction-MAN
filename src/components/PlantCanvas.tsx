import React, { useState, useEffect } from 'react';
import { PlantUnit, Character, UnitId } from '../types/game';
import { 
  Truck, Cog, CheckCircle2, Wrench, Package, 
  Send, TrendingUp, Headphones, Globe2, AlertCircle, ChevronRight, Zap
} from 'lucide-react';
import { sound } from '../utils/audio';

interface PlantCanvasProps {
  units: PlantUnit[];
  characters: Record<string, Character>;
  bottleneckUnit: UnitId;
  isSimulating: boolean;
  onSelectUnit: (unit: PlantUnit) => void;
  onOpenCharacterDialogue: (character: Character) => void;
}

export const PlantCanvas: React.FC<PlantCanvasProps> = ({
  units,
  characters,
  bottleneckUnit,
  isSimulating,
  onSelectUnit,
  onOpenCharacterDialogue
}) => {
  // Animation ticks for conveyor movement, machine pistons, and forklifts
  const [animTick, setAnimTick] = useState<number>(0);
  const [hoveredUnitId, setHoveredUnitId] = useState<UnitId | null>(null);

  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setAnimTick((prev) => (prev + 1) % 100);
    }, 120);
    return () => clearInterval(interval);
  }, [isSimulating]);

  const getUnit = (id: UnitId) => units.find((u) => u.id === id)!;

  const renderStatusBadge = (unit: PlantUnit) => {
    const isBottleneck = unit.id === bottleneckUnit;
    if (isBottleneck) {
      return (
        <span className="flex items-center gap-1 text-[11px] font-mono font-semibold text-amber-400">
          <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />
          <span>Cuello de Botella (TOC)</span>
        </span>
      );
    }
    if (unit.status === 'DETENIDA' || unit.status === 'EN_ALERTA') {
      return (
        <span className="flex items-center gap-1 text-[11px] font-mono font-semibold text-rose-400">
          <AlertCircle className="w-3 h-3 text-rose-400 shrink-0" />
          <span>{unit.status}</span>
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>Operando Normal</span>
      </span>
    );
  };

  return (
    <div className="w-full bg-[#0d1117] p-4 lg:p-6 rounded-xl border-2 border-[#242e3b] shadow-2xl text-zinc-100">
      {/* Industrial Safety Top Line */}
      <div className="h-1.5 w-full bg-[repeating-linear-gradient(45deg,#f59e0b,#f59e0b_10px,#1a222c_10px,#1a222c_20px)] rounded-t mb-4 opacity-75"></div>

      {/* Plant Canvas Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#222b37] gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight font-sans">
              Línea de Producción & Distribución SCADA
            </h2>
            <span className="text-[11px] text-amber-400 font-mono bg-[#1c2430] px-2 py-0.5 rounded border border-amber-500/30">
              SISTEMA EN VIVO
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5 font-mono">
            Supervisión continua de la planta. Haz clic en cualquier estación para ajustar parámetros tácticos o dialogar con su jefatura.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/20 border border-emerald-500"></span>
            <span>Flujo Nominal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/20 border border-amber-500 animate-pulse"></span>
            <span>Restricción / Cuello Botella</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500/20 border border-rose-500"></span>
            <span>Alerta Crítica</span>
          </div>
        </div>
      </div>

      {/* Main Physical Production Stream: Left to Right */}
      <div className="relative mb-6 p-4 rounded-lg bg-[#11161d] border border-[#232c39] overflow-hidden">
        <div className="text-[11px] font-mono uppercase text-zinc-400 tracking-wider mb-3 flex items-center justify-between">
          <span>Línea Troncal de Transformación Física</span>
          <span className="text-zinc-500">Sentido del Flujo: MP → Proceso → QA → Bodega → Despacho</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative z-10">
          {/* Station 1: Recepción de Materia Prima */}
          {(() => {
            const unit = getUnit('recepcion');
            const char = characters[unit.characterId];
            const isHovered = hoveredUnitId === 'recepcion';
            return (
              <div
                onClick={() => { sound.playClick(); onSelectUnit(unit); }}
                onMouseEnter={() => setHoveredUnitId('recepcion')}
                onMouseLeave={() => setHoveredUnitId(null)}
                className={`group relative p-3.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                  isHovered ? 'bg-[#1a232f] border-amber-500/80 shadow-lg' : 'bg-[#151c24] border-[#293544] hover:border-zinc-500'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded bg-[#1f2937] border border-amber-500/40 flex items-center justify-center text-amber-400">
                      <Truck className="w-4 h-4" />
                    </div>
                    {renderStatusBadge(unit)}
                  </div>

                  <h3 className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
                    {unit.name}
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                    {unit.description}
                  </p>

                  {/* Animated Visual Diagram: Truck unloading & Silo */}
                  <div className="mt-3 p-2 bg-[#0d1117] rounded border border-[#242e3b] flex items-center justify-between gap-2">
                    <div className="relative w-12 h-10 bg-[#161c24] rounded border border-[#273240] flex items-center justify-center overflow-hidden">
                      <Truck className={`w-5 h-5 text-zinc-400 transition-transform ${isSimulating ? 'translate-x-0.5' : ''}`} />
                      {isSimulating && (
                        <span className="absolute bottom-0.5 left-1 w-2 h-0.5 bg-amber-400 animate-ping"></span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-1 font-mono">
                        <span>Silos MP</span>
                        <span className="text-zinc-200">{unit.metrics.stockMP?.value} {unit.metrics.stockMP?.unit}</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#202936] rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '72%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chief mini footer */}
                <div className="mt-3 pt-2.5 border-t border-[#252f3d] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-5 h-5 rounded bg-amber-600 text-[10px] font-bold flex items-center justify-center text-white shrink-0">
                      {char?.initials}
                    </span>
                    <span className="text-zinc-300 truncate text-[11px]">{char?.name}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            );
          })()}

          {/* Station 2: Proceso / Manufactura */}
          {(() => {
            const unit = getUnit('proceso');
            const char = characters[unit.characterId];
            const isHovered = hoveredUnitId === 'proceso';
            const isBottleneck = bottleneckUnit === 'proceso';
            return (
              <div
                onClick={() => { sound.playClick(); onSelectUnit(unit); }}
                onMouseEnter={() => setHoveredUnitId('proceso')}
                onMouseLeave={() => setHoveredUnitId(null)}
                className={`group relative p-3.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                  isBottleneck
                    ? 'bg-[#221c16] border-amber-500/70 shadow-lg'
                    : isHovered
                    ? 'bg-[#1a232f] border-blue-500/80 shadow-lg'
                    : 'bg-[#151c24] border-[#293544] hover:border-zinc-500'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded bg-[#1f2937] border border-blue-500/40 flex items-center justify-center text-blue-400">
                      <Cog className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
                    </div>
                    {renderStatusBadge(unit)}
                  </div>

                  <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {unit.name}
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                    {unit.description}
                  </p>

                  {/* Animated Visual Diagram: Hydraulic press & Conveyor */}
                  <div className="mt-3 p-2 bg-[#0d1117] rounded border border-[#242e3b] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-8 bg-[#1a222c] rounded border border-[#2d3847] flex flex-col justify-end p-0.5">
                        <div
                          className="w-full bg-blue-500 rounded transition-all duration-300"
                          style={{ height: `${20 + (animTick % 60)}%` }}
                        ></div>
                      </div>
                      <div className="text-[10px] font-mono text-zinc-400">
                        <div>Takt: <strong className="text-zinc-200">{unit.metrics.taktTime?.value}s</strong></div>
                        <div>Ciclo: <strong className="text-amber-400">{unit.metrics.cycleTime?.value}s</strong></div>
                      </div>
                    </div>

                    <div className="text-right text-[10px] font-mono">
                      <span className="text-zinc-500">Tasa Horaria</span>
                      <div className="text-xs font-bold text-white">{unit.metrics.unidadesHora?.value} u/h</div>
                    </div>
                  </div>
                </div>

                {/* Chief mini footer */}
                <div className="mt-3 pt-2.5 border-t border-[#252f3d] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-5 h-5 rounded bg-blue-600 text-[10px] font-bold flex items-center justify-center text-white shrink-0">
                      {char?.initials}
                    </span>
                    <span className="text-zinc-300 truncate text-[11px]">{char?.name}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            );
          })()}

          {/* Station 3: Calidad y Aseguramiento */}
          {(() => {
            const unit = getUnit('calidad');
            const char = characters[unit.characterId];
            const isHovered = hoveredUnitId === 'calidad';
            return (
              <div
                onClick={() => { sound.playClick(); onSelectUnit(unit); }}
                onMouseEnter={() => setHoveredUnitId('calidad')}
                onMouseLeave={() => setHoveredUnitId(null)}
                className={`group relative p-3.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                  isHovered ? 'bg-[#1a232f] border-emerald-500/80 shadow-lg' : 'bg-[#151c24] border-[#293544] hover:border-zinc-500'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded bg-[#1f2937] border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    {renderStatusBadge(unit)}
                  </div>

                  <h3 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                    {unit.name}
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                    {unit.description}
                  </p>

                  {/* Animated Visual Diagram: Optical laser inspection & rejection */}
                  <div className="mt-3 p-2 bg-[#0d1117] rounded border border-[#242e3b] flex items-center justify-between gap-2">
                    <div className="relative w-10 h-8 bg-[#161c24] rounded border border-[#273240] flex items-center justify-center overflow-hidden">
                      <span className="w-2.5 h-2.5 bg-emerald-400 rounded-sm"></span>
                      {isSimulating && (
                        <div
                          className="absolute inset-x-0 h-0.5 bg-rose-500 animate-pulse"
                          style={{ top: `${(animTick * 3) % 100}%` }}
                        ></div>
                      )}
                    </div>
                    <div className="text-[10px] font-mono text-zinc-400 flex-1">
                      <div className="flex justify-between">
                        <span>Yield:</span>
                        <strong className="text-emerald-400">{unit.metrics.yield?.value}%</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Scrap:</span>
                        <strong className="text-zinc-200">{unit.metrics.scrapRate?.value} PPM</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chief mini footer */}
                <div className="mt-3 pt-2.5 border-t border-[#252f3d] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-5 h-5 rounded bg-emerald-600 text-[10px] font-bold flex items-center justify-center text-white shrink-0">
                      {char?.initials}
                    </span>
                    <span className="text-zinc-300 truncate text-[11px]">{char?.name}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            );
          })()}

          {/* Station 4: Producto Terminado (Almacén PT) */}
          {(() => {
            const unit = getUnit('producto_terminado');
            const char = characters[unit.characterId];
            const isHovered = hoveredUnitId === 'producto_terminado';
            return (
              <div
                onClick={() => { sound.playClick(); onSelectUnit(unit); }}
                onMouseEnter={() => setHoveredUnitId('producto_terminado')}
                onMouseLeave={() => setHoveredUnitId(null)}
                className={`group relative p-3.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                  isHovered ? 'bg-[#1a232f] border-indigo-500/80 shadow-lg' : 'bg-[#151c24] border-[#293544] hover:border-zinc-500'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded bg-[#1f2937] border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                      <Package className="w-4 h-4" />
                    </div>
                    {renderStatusBadge(unit)}
                  </div>

                  <h3 className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">
                    {unit.name}
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                    {unit.description}
                  </p>

                  {/* Animated Visual Diagram: High bay racking & Forklift */}
                  <div className="mt-3 p-2 bg-[#0d1117] rounded border border-[#242e3b] flex items-center justify-between gap-2">
                    <div className="grid grid-cols-3 gap-0.5 w-10">
                      <div className="h-2 bg-indigo-500/60 rounded-xs"></div>
                      <div className="h-2 bg-indigo-500/80 rounded-xs"></div>
                      <div className="h-2 bg-indigo-500/40 rounded-xs"></div>
                      <div className="h-2 bg-indigo-500 rounded-xs"></div>
                      <div className="h-2 bg-indigo-500/90 rounded-xs"></div>
                      <div className="h-2 bg-[#1c2430] rounded-xs"></div>
                    </div>
                    <div className="text-[10px] font-mono text-zinc-400 flex-1">
                      <div className="flex justify-between">
                        <span>Ocupación:</span>
                        <strong className="text-indigo-300">{unit.metrics.ocupacionRacks?.value}%</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Stock:</span>
                        <strong className="text-zinc-200">{unit.metrics.stockPT?.value} pal.</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chief mini footer */}
                <div className="mt-3 pt-2.5 border-t border-[#252f3d] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-5 h-5 rounded bg-indigo-600 text-[10px] font-bold flex items-center justify-center text-white shrink-0">
                      {char?.initials}
                    </span>
                    <span className="text-zinc-300 truncate text-[11px]">{char?.name}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-indigo-400 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            );
          })()}

          {/* Station 5: Despacho y Distribución */}
          {(() => {
            const unit = getUnit('despacho');
            const char = characters[unit.characterId];
            const isHovered = hoveredUnitId === 'despacho';
            return (
              <div
                onClick={() => { sound.playClick(); onSelectUnit(unit); }}
                onMouseEnter={() => setHoveredUnitId('despacho')}
                onMouseLeave={() => setHoveredUnitId(null)}
                className={`group relative p-3.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                  isHovered ? 'bg-[#1a232f] border-teal-500/80 shadow-lg' : 'bg-[#151c24] border-[#293544] hover:border-zinc-500'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded bg-[#1f2937] border border-teal-500/40 flex items-center justify-center text-teal-400">
                      <Send className="w-4 h-4" />
                    </div>
                    {renderStatusBadge(unit)}
                  </div>

                  <h3 className="text-sm font-semibold text-white group-hover:text-teal-400 transition-colors">
                    {unit.name}
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                    {unit.description}
                  </p>

                  {/* Animated Visual Diagram: Loading dock & outgoing trailer */}
                  <div className="mt-3 p-2 bg-[#0d1117] rounded border border-[#242e3b] flex items-center justify-between gap-2">
                    <div className="relative w-10 h-8 bg-[#161c24] rounded border border-[#273240] flex items-center justify-center overflow-hidden">
                      <Truck className="w-4 h-4 text-teal-400" />
                      {isSimulating && (
                        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      )}
                    </div>
                    <div className="text-[10px] font-mono text-zinc-400 flex-1">
                      <div className="flex justify-between">
                        <span>OTIF:</span>
                        <strong className="text-teal-300">{unit.metrics.otifHoy?.value}%</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Hoy:</span>
                        <strong className="text-zinc-200">{unit.metrics.camionesDespachados?.value} camiones</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chief mini footer */}
                <div className="mt-3 pt-2.5 border-t border-[#252f3d] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-5 h-5 rounded bg-teal-600 text-[10px] font-bold flex items-center justify-center text-white shrink-0">
                      {char?.initials}
                    </span>
                    <span className="text-zinc-300 truncate text-[11px]">{char?.name}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-teal-400 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            );
          })()}
        </div>

        {/* Industrial Roller Track / Conveyor Belt */}
        <div className="mt-4 pt-3 border-t border-[#222b37] flex items-center justify-between text-xs text-zinc-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
            <span>Cinta de Rodillos Motrices Principal:</span>
            <span className="text-zinc-200 font-bold">14.8 m/min</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-zinc-500">
            <span>Piezas en tránsito (WIP): 1.850 unid.</span>
            <span>·</span>
            <span>Lead Time: 2.1 hrs</span>
          </div>
        </div>
      </div>

      {/* Support, Maintenance & Commercial Strategic Units */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Support 1: Mantenimiento y Confiabilidad (TPM) */}
        {(() => {
          const unit = getUnit('mantenimiento');
          const char = characters[unit.characterId];
          const isHovered = hoveredUnitId === 'mantenimiento';
          return (
            <div
              onClick={() => { sound.playClick(); onSelectUnit(unit); }}
              onMouseEnter={() => setHoveredUnitId('mantenimiento')}
              onMouseLeave={() => setHoveredUnitId(null)}
              className={`p-3.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                isHovered ? 'bg-[#1a232f] border-orange-500/80 shadow-lg' : 'bg-[#151c24] border-[#273240] hover:border-zinc-500'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded bg-[#1f2937] border border-orange-500/40 flex items-center justify-center text-orange-400">
                    <Wrench className="w-4 h-4" />
                  </div>
                  {renderStatusBadge(unit)}
                </div>
                <h3 className="text-sm font-semibold text-white">{unit.name}</h3>
                <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">{unit.description}</p>

                <div className="mt-3 p-2 bg-[#0d1117] rounded border border-[#242e3b] text-[10px] font-mono text-zinc-400 space-y-1">
                  <div className="flex justify-between">
                    <span>MTBF (Confiabilidad):</span>
                    <strong className="text-zinc-200">{unit.metrics.mtbf?.value} hrs</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>MTTR (Reparación):</span>
                    <strong className="text-zinc-200">{unit.metrics.mttr?.value} hrs</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Disponibilidad:</span>
                    <strong className="text-emerald-400">{unit.metrics.disponibilidad?.value}%</strong>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#252f3d] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-5 h-5 rounded bg-orange-600 text-[10px] font-bold flex items-center justify-center text-white shrink-0">
                    {char?.initials}
                  </span>
                  <span className="text-zinc-300 truncate text-[11px]">{char?.name}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
              </div>
            </div>
          );
        })()}

        {/* Support 2: Cadena de Suministro */}
        {(() => {
          const unit = getUnit('logistica');
          const char = characters[unit.characterId];
          const isHovered = hoveredUnitId === 'logistica';
          return (
            <div
              onClick={() => { sound.playClick(); onSelectUnit(unit); }}
              onMouseEnter={() => setHoveredUnitId('logistica')}
              onMouseLeave={() => setHoveredUnitId(null)}
              className={`p-3.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                isHovered ? 'bg-[#1a232f] border-cyan-500/80 shadow-lg' : 'bg-[#151c24] border-[#273240] hover:border-zinc-500'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded bg-[#1f2937] border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                    <Globe2 className="w-4 h-4" />
                  </div>
                  {renderStatusBadge(unit)}
                </div>
                <h3 className="text-sm font-semibold text-white">{unit.name}</h3>
                <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">{unit.description}</p>

                <div className="mt-3 p-2 bg-[#0d1117] rounded border border-[#242e3b] text-[10px] font-mono text-zinc-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Efecto Látigo:</span>
                    <strong className="text-zinc-200">{unit.metrics.efectoLatigo?.value}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Rotación Anual:</span>
                    <strong className="text-cyan-300">{unit.metrics.rotacionInventario?.value}x</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Order Lead Time:</span>
                    <strong className="text-zinc-200">{unit.metrics.leadTimeTotal?.value} días</strong>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#252f3d] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-5 h-5 rounded bg-cyan-600 text-[10px] font-bold flex items-center justify-center text-white shrink-0">
                    {char?.initials}
                  </span>
                  <span className="text-zinc-300 truncate text-[11px]">{char?.name}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
              </div>
            </div>
          );
        })()}

        {/* Support 3: Marketing y Comercial */}
        {(() => {
          const unit = getUnit('marketing');
          const char = characters[unit.characterId];
          const isHovered = hoveredUnitId === 'marketing';
          return (
            <div
              onClick={() => { sound.playClick(); onSelectUnit(unit); }}
              onMouseEnter={() => setHoveredUnitId('marketing')}
              onMouseLeave={() => setHoveredUnitId(null)}
              className={`p-3.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                isHovered ? 'bg-[#1a232f] border-rose-500/80 shadow-lg' : 'bg-[#151c24] border-[#273240] hover:border-zinc-500'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded bg-[#1f2937] border border-rose-500/40 flex items-center justify-center text-rose-400">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  {renderStatusBadge(unit)}
                </div>
                <h3 className="text-sm font-semibold text-white">{unit.name}</h3>
                <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">{unit.description}</p>

                <div className="mt-3 p-2 bg-[#0d1117] rounded border border-[#242e3b] text-[10px] font-mono text-zinc-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Demanda Diaria:</span>
                    <strong className="text-zinc-200">{unit.metrics.demandaDiaria?.value} u.</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Backlog Pendiente:</span>
                    <strong className="text-rose-300">{unit.metrics.backlogPedidos?.value} u.</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Forecast Accuracy:</span>
                    <strong className="text-zinc-200">{unit.metrics.cumplimientoForecast?.value}%</strong>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#252f3d] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-5 h-5 rounded bg-rose-600 text-[10px] font-bold flex items-center justify-center text-white shrink-0">
                    {char?.initials}
                  </span>
                  <span className="text-zinc-300 truncate text-[11px]">{char?.name}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
              </div>
            </div>
          );
        })()}

        {/* Support 4: Post-Venta y Servicio al Cliente */}
        {(() => {
          const unit = getUnit('post_venta');
          const char = characters[unit.characterId];
          const isHovered = hoveredUnitId === 'post_venta';
          return (
            <div
              onClick={() => { sound.playClick(); onSelectUnit(unit); }}
              onMouseEnter={() => setHoveredUnitId('post_venta')}
              onMouseLeave={() => setHoveredUnitId(null)}
              className={`p-3.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                isHovered ? 'bg-[#1a232f] border-purple-500/80 shadow-lg' : 'bg-[#151c24] border-[#273240] hover:border-zinc-500'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded bg-[#1f2937] border border-purple-500/40 flex items-center justify-center text-purple-400">
                    <Headphones className="w-4 h-4" />
                  </div>
                  {renderStatusBadge(unit)}
                </div>
                <h3 className="text-sm font-semibold text-white">{unit.name}</h3>
                <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">{unit.description}</p>

                <div className="mt-3 p-2 bg-[#0d1117] rounded border border-[#242e3b] text-[10px] font-mono text-zinc-400 space-y-1">
                  <div className="flex justify-between">
                    <span>NPS Clientes:</span>
                    <strong className="text-purple-300">{unit.metrics.nps?.value}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Reclamos / Millón:</span>
                    <strong className="text-zinc-200">{unit.metrics.tasaReclamos?.value}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Tiempo Resolución:</span>
                    <strong className="text-zinc-200">{unit.metrics.tiempoResolucion?.value} días</strong>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#252f3d] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-5 h-5 rounded bg-purple-600 text-[10px] font-bold flex items-center justify-center text-white shrink-0">
                    {char?.initials}
                  </span>
                  <span className="text-zinc-300 truncate text-[11px]">{char?.name}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
              </div>
            </div>
          );
        })()}
      </div>

      {/* Quick Tactical Strip at bottom */}
      <div className="mt-4 pt-3 border-t border-[#222b37] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-zinc-400">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Acciones del Gerente: Activa turnos extra, mantenimientos preventivos o dialoga con cada jefatura.</span>
        </div>
        <div className="text-zinc-500 text-[11px]">
          Planta: Manufacturas Andinas S.A. · Capacidad Nominal: 10.000 u/día
        </div>
      </div>
    </div>
  );
};
