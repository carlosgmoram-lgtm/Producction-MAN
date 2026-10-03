import React, { useState } from 'react';
import { 
  Building2, Users, Cpu, ShieldCheck, Target, 
  ArrowRight, CheckCircle2, AlertTriangle, Layers, 
  TrendingUp, Truck, Cog, CheckSquare, Wrench, Package, Send, Globe2, Headphones, RotateCcw
} from 'lucide-react';
import { sound } from '../utils/audio';
import { INITIAL_CHARACTERS } from '../data/plantData';
import { ProcessConfig } from '../types/game';
import { PROCESS_OPTIONS } from '../data/processesData';

interface PlantBriefingModalProps {
  isOpen: boolean;
  onStartGame: () => void;
  onClose?: () => void;
  onBackToTitle?: () => void;
  isInitialLaunch?: boolean;
  processConfig?: ProcessConfig;
}

export const PlantBriefingModal: React.FC<PlantBriefingModalProps> = ({
  isOpen,
  onStartGame,
  onClose,
  onBackToTitle,
  isInitialLaunch = true,
  processConfig = PROCESS_OPTIONS[1]
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'org' | 'kpis' | 'protocol'>('overview');

  if (!isOpen) return null;

  const handleStart = () => {
    sound.playShiftStart();
    onStartGame();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#090c0f]/95 backdrop-blur-md p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#13171e] border-2 border-[#2b3543] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] text-zinc-100 flex flex-col max-h-[92vh] overflow-hidden my-auto">
        
        {/* Industrial Hazard Top Banner */}
        <div className="h-2 w-full bg-[repeating-linear-gradient(45deg,#f59e0b,#f59e0b_12px,#181e25_12px,#181e25_24px)] opacity-90"></div>

        {/* Executive Header */}
        <div className="p-5 sm:p-6 border-b border-[#252f3d] bg-[#10141a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded bg-[#1a222c] border border-amber-500/40 flex items-center justify-center font-mono font-bold text-amber-400 text-lg shadow-inner">
              <Building2 className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-mono text-[11px] text-amber-400 uppercase tracking-widest">
                <span>Dossier de Inducción Gerencial</span>
                <span className="text-zinc-600">·</span>
                <span className="text-zinc-400">Ref: {processConfig.id}</span>
              </div>
              <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight font-sans">
                {processConfig.plantName} <span className="text-zinc-400 text-sm font-normal">| {processConfig.title}</span>
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5 font-mono">
                Cargo Asignado: <strong className="text-zinc-200">Gerente de Operaciones y Planta (Ingeniero Industrial)</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            {onBackToTitle && (
              <button
                onClick={() => { sound.playClick(); onBackToTitle(); }}
                className="px-3 py-2 bg-[#1b222c] hover:bg-[#252f3d] text-zinc-300 text-xs rounded border border-[#2e3a4b] transition-colors flex items-center gap-1.5 cursor-pointer font-mono"
                title="Cambiar tipo de proceso"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Cambiar Proceso</span>
              </button>
            )}
            {!isInitialLaunch && onClose && (
              <button
                onClick={() => { sound.playClick(); onClose(); }}
                className="px-3 py-2 bg-[#1b222c] hover:bg-[#252f3d] text-zinc-300 text-xs rounded border border-[#2e3a4b] transition-colors cursor-pointer"
              >
                Volver
              </button>
            )}
            <button
              onClick={handleStart}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm rounded flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(245,158,11,0.35)] cursor-pointer"
            >
              <span>{isInitialLaunch ? 'TOMAR EL MANDO E INICIAR OPERACIÓN' : 'CONTINUAR OPERACIÓN'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Industrial Section Selector Tabs */}
        <div className="bg-[#0e1217] border-b border-[#222b37] px-6 flex items-center gap-2 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => { sound.playClick(); setActiveTab('overview'); }}
            className={`py-3 px-3.5 border-b-2 font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-amber-400 text-amber-400 font-bold bg-[#151b22]'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>1. La Planta & Producción</span>
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveTab('org'); }}
            className={`py-3 px-3.5 border-b-2 font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'org'
                ? 'border-amber-400 text-amber-400 font-bold bg-[#151b22]'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>2. Equipo & 9 Jefaturas</span>
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveTab('kpis'); }}
            className={`py-3 px-3.5 border-b-2 font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'kpis'
                ? 'border-amber-400 text-amber-400 font-bold bg-[#151b22]'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>3. Mandato del Directorio (KPIs)</span>
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveTab('protocol'); }}
            className={`py-3 px-3.5 border-b-2 font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'protocol'
                ? 'border-amber-400 text-amber-400 font-bold bg-[#151b22]'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>4. Protocolo de Gestión Diaria</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#13171e]">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-[#181f28] rounded border border-[#293544] space-y-2">
                  <div className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                    ¿Qué fabricamos?
                  </div>
                  <h3 className="text-sm font-bold text-white font-sans">
                    {processConfig.title}
                  </h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {processConfig.productDescription}
                  </p>
                  <div className="text-[11px] text-zinc-400 pt-1 font-mono">
                    <strong className="text-zinc-300">Insumos principales: </strong>
                    {processConfig.rawMaterialName}
                  </div>
                </div>

                <div className="p-4 bg-[#181f28] rounded border border-[#293544] space-y-2">
                  <div className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                    Capacidad Instalada
                  </div>
                  <h3 className="text-sm font-bold text-white font-sans">
                    {processConfig.nominalCapacity}
                  </h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Operación actual a 3 turnos rotativos. La meta programada hoy es de <strong>{processConfig.defaultTargetUnits.toLocaleString()} unidades</strong>. El tiempo de ciclo óptimo es de 38 segundos por unidad, con un Takt Time exigido de 38 segundos.
                  </p>
                </div>

                <div className="p-4 bg-[#181f28] rounded border border-[#293544] space-y-2">
                  <div className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                    Restricción Inicial (TOC)
                  </div>
                  <h3 className="text-sm font-bold text-white font-sans">
                    {processConfig.bottleneckStation}
                  </h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {processConfig.specialChallenge}
                  </p>
                </div>
              </div>

              {/* Physical Flow Schematic */}
              <div className="p-4 bg-[#10141a] rounded-lg border border-[#242e3b]">
                <div className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-3 flex items-center justify-between">
                  <span>Esquema de Cadena de Valor Física · {processConfig.tagline}</span>
                  <span className="text-amber-400">Flujo Continuo Pull</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs font-mono">
                  <div className="p-2.5 bg-[#171e27] border border-[#283444] rounded">
                    <Truck className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                    <div className="font-bold text-white text-[11px]">1. Recepción MP</div>
                    <div className="text-[10px] text-zinc-400">Descarga y Silos</div>
                  </div>
                  <div className="p-2.5 bg-[#171e27] border border-[#283444] rounded">
                    <Cog className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                    <div className="font-bold text-white text-[11px]">2. Proceso</div>
                    <div className="text-[10px] text-zinc-400">{processConfig.bottleneckStation}</div>
                  </div>
                  <div className="p-2.5 bg-[#171e27] border border-[#283444] rounded">
                    <CheckSquare className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                    <div className="font-bold text-white text-[11px]">3. Calidad QA</div>
                    <div className="text-[10px] text-zinc-400">Escáner y Ensayos</div>
                  </div>
                  <div className="p-2.5 bg-[#171e27] border border-[#283444] rounded">
                    <Package className="w-4 h-4 mx-auto mb-1 text-indigo-400" />
                    <div className="font-bold text-white text-[11px]">4. Almacén PT</div>
                    <div className="text-[10px] text-zinc-400">Racks y FIFO</div>
                  </div>
                  <div className="p-2.5 bg-[#171e27] border border-[#283444] rounded col-span-2 sm:col-span-1">
                    <Send className="w-4 h-4 mx-auto mb-1 text-teal-400" />
                    <div className="font-bold text-white text-[11px]">5. Despacho</div>
                    <div className="text-[10px] text-zinc-400">Andén y Ruteo</div>
                  </div>
                </div>
              </div>

              {/* Plant Snapshot Numbers */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 bg-[#161c24] border border-[#252f3d] rounded">
                  <span className="text-zinc-500 text-[10px]">Caja Operativa:</span>
                  <div className="text-base font-bold text-emerald-400 mt-0.5">${processConfig.initialCash.toLocaleString()} USD</div>
                </div>
                <div className="p-3 bg-[#161c24] border border-[#252f3d] rounded">
                  <span className="text-zinc-500 text-[10px]">Seguridad Laboral:</span>
                  <div className="text-base font-bold text-emerald-400 mt-0.5">142 días sin accidentes</div>
                </div>
                <div className="p-3 bg-[#161c24] border border-[#252f3d] rounded">
                  <span className="text-zinc-500 text-[10px]">Personal Total:</span>
                  <div className="text-base font-bold text-zinc-200 mt-0.5">74 trabajadores</div>
                </div>
                <div className="p-3 bg-[#161c24] border border-[#252f3d] rounded">
                  <span className="text-zinc-500 text-[10px]">Precio Unitario:</span>
                  <div className="text-base font-bold text-amber-400 mt-0.5">${processConfig.unitPrice.toFixed(2)} USD / unidad</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORGANIZATIONAL STRUCTURE (THE 9 HEADS) */}
          {activeTab === 'org' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="text-xs text-zinc-300 leading-relaxed bg-[#10141a] p-3.5 rounded border border-[#252f3d]">
                Como Gerente de Planta, tienes bajo tu supervisión directa a <strong>9 Jefaturas de Área</strong>. Cada uno tiene personalidad, metodologías y presiones específicas. Te reportan novedades, solicitan recursos y presentan dilemas durante el turno.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {Object.values(INITIAL_CHARACTERS).map((char) => (
                  <div key={char.id} className="p-3.5 bg-[#171d26] border border-[#293544] rounded-lg space-y-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full ${char.avatarColor} text-white font-mono font-bold text-xs flex items-center justify-center shrink-0`}>
                        {char.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">{char.name}</div>
                        <div className="text-[10px] text-amber-400 font-mono truncate">{char.title}</div>
                      </div>
                    </div>
                    <p className="text-[11px] text-zinc-300 line-clamp-2 italic">
                      "{char.personality}"
                    </p>
                    <div className="pt-2 border-t border-[#26313f] flex items-center justify-between text-[10px] font-mono text-zinc-400">
                      <span>Metodología:</span>
                      <span className="text-zinc-200 font-semibold truncate ml-1">{char.methodology}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: KPIS & BOARD OBJECTIVES */}
          {activeTab === 'kpis' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="text-xs text-zinc-300 bg-[#10141a] p-3.5 rounded border border-[#252f3d]">
                El Directorio de Accionistas evaluará tu gestión al final de cada jornada (18:00 hrs) según 4 pilares de la Ingeniería Industrial:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                <div className="p-4 bg-[#181f28] border border-[#2b3747] rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-400 font-bold text-sm">1. OEE Global (Eficacia de Equipos)</span>
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded text-[10px]">Meta: &gt; 82.0%</span>
                  </div>
                  <p className="text-zinc-300 text-[11px] font-sans">
                    Multiplica Disponibilidad mecánica (mantenimiento sin averías), Rendimiento (velocidad real vs teórica) y Calidad (piezas conformes vs total).
                  </p>
                  <div className="text-[10px] text-zinc-500">
                    OEE = Disponibilidad × Rendimiento × Calidad
                  </div>
                </div>

                <div className="p-4 bg-[#181f28] border border-[#2b3747] rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-teal-400 font-bold text-sm">2. OTIF (On-Time In-Full)</span>
                    <span className="px-2 py-0.5 bg-teal-500/20 text-teal-300 rounded text-[10px]">Meta: &gt; 94.0%</span>
                  </div>
                  <p className="text-zinc-300 text-[11px] font-sans">
                    Porcentaje de pedidos entregados a los clientes en la fecha convenida y con el 100% de la cantidad solicitada. Evita multas de retail.
                  </p>
                  <div className="text-[10px] text-zinc-500">
                    SLA crítico para retener grandes contratos comerciales.
                  </div>
                </div>

                <div className="p-4 bg-[#181f28] border border-[#2b3747] rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 font-bold text-sm">3. EBITDA y Flujo de Caja</span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[10px]">Positivo</span>
                  </div>
                  <p className="text-zinc-300 text-[11px] font-sans">
                    Ingresos por facturación menos costos de materias primas, mano de obra, sobretiempos, energía y no conformidades de calidad.
                  </p>
                  <div className="text-[10px] text-zinc-500">
                    Mantener liquidez para contingencias y repuestos críticos.
                  </div>
                </div>

                <div className="p-4 bg-[#181f28] border border-[#2b3747] rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-rose-400 font-bold text-sm">4. Seguridad Cero Accidentes</span>
                    <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 rounded text-[10px]">Innegociable</span>
                  </div>
                  <p className="text-zinc-300 text-[11px] font-sans">
                    La integridad de los operarios es prioridad sobre cualquier cuota de producción. Si fuerzas maquinaria al límite arriesgas accidentes graves.
                  </p>
                  <div className="text-[10px] text-zinc-500">
                    Cultura Lean de Seguridad (Safety First).
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PROTOCOL / HOW TO PLAY */}
          {activeTab === 'protocol' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 bg-[#181f28] border border-[#293544] rounded-lg space-y-3">
                <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Dinámica de Trabajo del Gerente (Ciclo Diario)</span>
                </h3>

                <div className="space-y-2.5 text-xs text-zinc-300">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded bg-[#273240] text-amber-400 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                    <div>
                      <strong className="text-white">Comité de Inicio de Turno (08:00 hrs):</strong> Revisa el estado de las 9 estaciones, escucha las novedades de los jefes y atiende dilemas de contingencia.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded bg-[#273240] text-amber-400 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                    <div>
                      <strong className="text-white">Operación en Vivo Animada (08:00 a 18:00 hrs):</strong> Observa el movimiento de materias primas, bandas transportadoras, escaneo de calidad y andenes. Puedes pausar o acelerar a 3x.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded bg-[#273240] text-amber-400 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                    <div>
                      <strong className="text-white">Intervenciones Tácticas:</strong> Haz clic en cualquier estación para activar turnos extra, ordenar mantenimiento preventivo, cambiar criterios de inspección o consultar a la jefatura.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded bg-[#273240] text-amber-400 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">4</span>
                    <div>
                      <strong className="text-white">Resolución de Incidentes:</strong> Cuando suene la alarma de contingencia, convoca al comité y toma la decisión que mejor equilibre costo, OEE, calidad y seguridad.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded bg-[#273240] text-amber-400 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">5</span>
                    <div>
                      <strong className="text-white">Cierre de Jornada (18:00 hrs):</strong> Recibe el informe diario con el balance de producción, EBITDA y retroalimentación del Directorio antes de comenzar el día siguiente.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-4 sm:p-5 border-t border-[#252f3d] bg-[#10141a] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs font-mono text-zinc-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Sistema SCADA listo para arranque de línea</span>
          </div>

          <button
            onClick={handleStart}
            className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm rounded flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(245,158,11,0.4)] cursor-pointer"
          >
            <span>{isInitialLaunch ? 'ASUMIR GERENCIA E INICIAR OPERACIÓN' : 'CONTINUAR OPERACIÓN'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

