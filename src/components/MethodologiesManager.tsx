import React, { useState } from 'react';
import { 
  MethodologyDefinition, 
  MethodologyScope, 
  ActiveImplementation, 
  PlantUnit, 
  MachineDefinition,
  UnitId
} from '../types/game';
import { METHODOLOGIES_CATALOGUE } from '../data/methodologiesData';
import { 
  Layers, CheckCircle2, Clock, Search, 
  ShieldCheck, AlertCircle, Compass, ChevronRight, Zap
} from 'lucide-react';
import { sound } from '../utils/audio';

interface MethodologiesManagerProps {
  units: PlantUnit[];
  machines: MachineDefinition[];
  activeImplementations: ActiveImplementation[];
  onImplementMethodology: (
    methodology: MethodologyDefinition,
    scope: MethodologyScope,
    targetId: string,
    targetName: string
  ) => void;
  preselectedUnitId?: UnitId | null;
  preselectedMachineId?: string | null;
}

export const MethodologiesManager: React.FC<MethodologiesManagerProps> = ({
  units,
  machines,
  activeImplementations,
  onImplementMethodology,
  preselectedUnitId,
  preselectedMachineId
}) => {
  const [selectedMethodologyId, setSelectedMethodologyId] = useState<string>('5S');
  const [selectedScope, setSelectedScope] = useState<MethodologyScope>(
    preselectedMachineId ? 'MACHINE' : preselectedUnitId ? 'UNIT' : 'PLANT'
  );
  const [selectedTargetId, setSelectedTargetId] = useState<string>(
    preselectedMachineId || preselectedUnitId || 'all'
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('TODAS');
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);

  const categories = [
    'TODAS',
    'Estandarización & Calidad',
    'Mantenimiento & Confiabilidad',
    'Flujo & Cuellos de Botella',
    'Productividad & Personas'
  ];

  const filteredMethodologies = METHODOLOGIES_CATALOGUE.filter((m) => {
    const matchesCategory = selectedCategory === 'TODAS' || m.category === selectedCategory;
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.definition.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const currentMethodology = METHODOLOGIES_CATALOGUE.find((m) => m.id === selectedMethodologyId) || METHODOLOGIES_CATALOGUE[0];

  // Derive target name from scope and targetId
  const getTargetDisplayName = (): string => {
    if (selectedScope === 'PLANT') {
      return 'Proceso Completo (Toda la Planta)';
    }
    if (selectedScope === 'UNIT') {
      const u = units.find((unit) => unit.id === selectedTargetId);
      return u ? `Unidad: ${u.name}` : 'Unidad Seleccionada';
    }
    if (selectedScope === 'MACHINE') {
      const m = machines.find((mac) => mac.id === selectedTargetId);
      return m ? `Máquina: ${m.name} (${m.unitName})` : 'Máquina Seleccionada';
    }
    return 'Objetivo no especificado';
  };

  const handleApplyClick = () => {
    sound.playClick();
    setConfirmModalOpen(true);
  };

  const handleConfirmDeploy = () => {
    sound.playShiftStart();
    onImplementMethodology(
      currentMethodology,
      selectedScope,
      selectedTargetId,
      getTargetDisplayName()
    );
    setConfirmModalOpen(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Industrial Header Banner */}
      <div className="p-4 sm:p-6 bg-[#0f141c] border-2 border-[#222c3a] rounded-xl shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Compass className="w-4 h-4" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-sans">
                Centro de Metodologías & Herramientas de Ingeniería
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 font-mono max-w-3xl leading-relaxed">
              Despliega herramientas de manufactura esbelta, confiabilidad y estandarización a nivel de planta global, área operativa o equipo puntual.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#151c26] p-3 rounded-lg border border-[#263342] text-xs font-mono">
            <div>
              <span className="text-zinc-400 block text-[10px] uppercase">Implementaciones en Curso</span>
              <strong className="text-amber-400 text-base">{activeImplementations.length} activas</strong>
            </div>
          </div>
        </div>

        {/* Engineering Caution Notice - No Decision Hints */}
        <div className="mt-4 p-3 bg-[#161a22] border-l-4 border-amber-500 rounded text-xs text-zinc-300 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <strong className="text-amber-300 font-mono">CRITERIO PROFESIONAL DEL INGENIERO:</strong> En conformidad con los principios de gestión industrial, el sistema <strong className="text-white">no suministra sugerencias predictivas ni calificaciones de impacto previo</strong>. Las metodologías requieren rigor, tiempo de maduración y compromiso del personal; su efecto real (favorable o desfavorable) se manifestará tras varios ciclos operativos posteriores en la planta.
          </div>
        </div>
      </div>

      {/* Target Selector Bar: Complete Process / Specific Unit / Specific Machine */}
      <div className="p-4 bg-[#111720] border border-[#232f3e] rounded-xl shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1f2a38] pb-3">
          <span className="text-xs font-mono uppercase text-zinc-300 font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            1. Definir Alcance de Aplicación
          </span>
          <span className="text-[11px] text-zinc-400 font-mono">
            Objetivo actual: <strong className="text-amber-400">{getTargetDisplayName()}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Scope 1: Complete Process */}
          <button
            onClick={() => {
              sound.playClick();
              setSelectedScope('PLANT');
              setSelectedTargetId('all');
            }}
            className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
              selectedScope === 'PLANT'
                ? 'bg-amber-500/10 border-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                : 'bg-[#151c26] border-[#253242] text-zinc-400 hover:text-zinc-200 hover:border-zinc-500'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase font-mono">Proceso Completo</span>
              <span className={`w-2 h-2 rounded-full ${selectedScope === 'PLANT' ? 'bg-amber-400' : 'bg-zinc-600'}`}></span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Toda la planta de forma transversal (Recepción, Transformación, Calidad, Almacenes y Logística).
            </p>
          </button>

          {/* Scope 2: Specific Unit */}
          <div
            onClick={() => {
              if (selectedScope !== 'UNIT') {
                sound.playClick();
                setSelectedScope('UNIT');
                if (selectedTargetId === 'all' || machines.some((m) => m.id === selectedTargetId)) {
                  setSelectedTargetId('proceso');
                }
              }
            }}
            className={`p-3 rounded-lg border text-left transition-all ${
              selectedScope === 'UNIT'
                ? 'bg-blue-500/10 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                : 'bg-[#151c26] border-[#253242] text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 cursor-pointer'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase font-mono">Por Unidad / Área de Proceso</span>
              <span className={`w-2 h-2 rounded-full ${selectedScope === 'UNIT' ? 'bg-blue-400' : 'bg-zinc-600'}`}></span>
            </div>
            {selectedScope === 'UNIT' ? (
              <select
                value={selectedTargetId}
                onChange={(e) => {
                  sound.playClick();
                  setSelectedTargetId(e.target.value);
                }}
                className="w-full mt-1 px-2.5 py-1.5 bg-[#0e141c] border border-blue-500/50 rounded text-xs text-white font-mono focus:outline-none"
              >
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.chiefName})
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-[11px] leading-relaxed">
                Focalizar en un departamento específico (ej. Manufactura, Aseguramiento de Calidad, Despacho).
              </p>
            )}
          </div>

          {/* Scope 3: Specific Machine */}
          <div
            onClick={() => {
              if (selectedScope !== 'MACHINE') {
                sound.playClick();
                setSelectedScope('MACHINE');
                if (selectedTargetId === 'all' || units.some((u) => u.id === selectedTargetId)) {
                  setSelectedTargetId(machines[2]?.id || machines[0]?.id);
                }
              }
            }}
            className={`p-3 rounded-lg border text-left transition-all ${
              selectedScope === 'MACHINE'
                ? 'bg-purple-500/10 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                : 'bg-[#151c26] border-[#253242] text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 cursor-pointer'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase font-mono">Por Máquina / Activo Puntual</span>
              <span className={`w-2 h-2 rounded-full ${selectedScope === 'MACHINE' ? 'bg-purple-400' : 'bg-zinc-600'}`}></span>
            </div>
            {selectedScope === 'MACHINE' ? (
              <select
                value={selectedTargetId}
                onChange={(e) => {
                  sound.playClick();
                  setSelectedTargetId(e.target.value);
                }}
                className="w-full mt-1 px-2.5 py-1.5 bg-[#0e141c] border border-purple-500/50 rounded text-xs text-white font-mono focus:outline-none"
              >
                {machines.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} [{m.unitName}]
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-[11px] leading-relaxed">
                Intervenir una estación crítica (ej. Prensa hidráulica, Horno térmico, Sistema de visión).
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Methodology Catalog (Left) + Detailed Technical Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Methodology Browser & Filters */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase text-zinc-300 font-bold flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>2. Seleccionar Metodología ({filteredMethodologies.length})</span>
            </h2>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por nombre o concepto (ej. 5S, TPM, SOP, Kaizen)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#121822] border border-[#253242] rounded-lg text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-zinc-950 font-bold'
                    : 'bg-[#151c26] text-zinc-400 hover:text-zinc-200 border border-[#253242]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* List of Methodology Cards */}
          <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
            {filteredMethodologies.map((methodology) => {
              const isSelected = methodology.id === selectedMethodologyId;
              const hasActiveImpl = activeImplementations.some(
                (ai) => ai.methodologyId === methodology.id
              );
              return (
                <div
                  key={methodology.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedMethodologyId(methodology.id);
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#182230] border-amber-500 shadow-md ring-1 ring-amber-500/40'
                      : 'bg-[#111720] border-[#222e3d] hover:border-zinc-500 hover:bg-[#141b25]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white font-sans">
                          {methodology.name}
                        </h3>
                        {hasActiveImpl && (
                          <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 text-[10px] font-mono rounded border border-emerald-500/30">
                            En Uso
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {methodology.category}
                      </span>
                    </div>

                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: methodology.color }}
                    ></div>
                  </div>

                  <p className="text-xs text-zinc-300 leading-snug line-clamp-2">
                    {methodology.tagline}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-[#1e2836] flex items-center justify-between text-[11px] font-mono text-zinc-400">
                    <span className="truncate max-w-[220px]">{methodology.origin}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: In-depth Engineering Dossier of Selected Methodology */}
        <div className="lg:col-span-7 bg-[#101621] border-2 border-[#243142] rounded-xl p-5 sm:p-6 flex flex-col justify-between shadow-xl">
          <div className="space-y-5">
            {/* Header info */}
            <div className="border-b border-[#212c3b] pb-4">
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/40 rounded text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
                  {currentMethodology.category}
                </span>

                <span className="text-xs font-mono text-zinc-400">
                  ID: <strong className="text-zinc-200">{currentMethodology.id}</strong>
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-sans">
                {currentMethodology.name}
              </h2>
              <p className="text-xs sm:text-sm text-amber-300 font-mono mt-1">
                {currentMethodology.tagline}
              </p>
            </div>

            {/* Formal Engineering Definition */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-mono uppercase text-zinc-400 tracking-wider flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Definición Formal de Ingeniería</span>
              </h3>
              <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed bg-[#0b0f16] p-3.5 rounded-lg border border-[#1e2735]">
                {currentMethodology.definition}
              </p>
            </div>

            {/* Historical Foundation & Origin */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-mono uppercase text-zinc-400 tracking-wider flex items-center gap-1.5 font-bold">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>Origen & Fundamento Teórico</span>
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed bg-[#0b0f16] p-3 rounded-lg border border-[#1e2735] font-mono">
                {currentMethodology.origin}
              </p>
            </div>

            {/* Real Industrial Applications & Use Cases */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-mono uppercase text-zinc-400 tracking-wider flex items-center gap-1.5 font-bold">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Campos de Aplicación & Usos en Planta Industrial</span>
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {currentMethodology.industrialUses.map((use, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-[#0e131b] rounded border border-[#1e2836] text-xs text-zinc-200 flex items-start gap-2.5"
                  >
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{use}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prerequisites */}
            <div className="p-3 bg-[#131922] rounded-lg border border-[#212c3b] text-xs">
              <span className="text-zinc-400 font-mono block text-[10px] uppercase font-bold">
                Requisitos Previos en Gemba:
              </span>
              <p className="text-zinc-300 mt-0.5 italic">
                {currentMethodology.prerequisites}
              </p>
            </div>
          </div>

          {/* Action Deploy Bar */}
          <div className="mt-6 pt-4 border-t border-[#212c3b] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs font-mono">
              <span className="text-zinc-400 block text-[10px]">ALCANCE SELECCIONADO:</span>
              <span className="font-bold text-amber-400">{getTargetDisplayName()}</span>
            </div>

            <button
              onClick={handleApplyClick}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg font-sans"
            >
              <Zap className="w-4 h-4" />
              <span>Implementar {currentMethodology.id} en {selectedScope === 'PLANT' ? 'Toda la Planta' : selectedScope === 'UNIT' ? 'esta Unidad' : 'esta Máquina'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Implementations Table / Registry */}
      <div className="p-5 bg-[#0f141c] border-2 border-[#222c3a] rounded-xl shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#212c3b] pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Registro de Metodologías Implementadas & Maduración de Ciclos ({activeImplementations.length})
            </h2>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            Evolución operacional en planta
          </span>
        </div>

        {activeImplementations.length === 0 ? (
          <div className="py-12 text-center text-zinc-400 font-mono text-xs">
            <p className="text-zinc-300 font-bold mb-1">Aún no se han implementado metodologías en este proceso.</p>
            <p className="text-zinc-400">Selecciona una herramienta y un alcance arriba para iniciar el despliegue técnico.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {activeImplementations.map((impl) => {
              const def = METHODOLOGIES_CATALOGUE.find((m) => m.id === impl.methodologyId);
              const getStatusBadge = () => {
                switch (impl.status) {
                  case 'INICIANDO':
                    return <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/40 rounded text-[10px] font-mono font-bold">1. Iniciando (Lanzamiento)</span>;
                  case 'CURVA_APRENDIZAJE':
                    return <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded text-[10px] font-mono font-bold animate-pulse">2. Curva de Aprendizaje</span>;
                  case 'EN_MADURACION':
                    return <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 rounded text-[10px] font-mono font-bold">3. En Maduración</span>;
                  case 'ESTABILIZADA':
                    return <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded text-[10px] font-mono font-bold">4. Estabilizada / Cultura</span>;
                }
              };

              return (
                <div
                  key={impl.id}
                  className="p-4 bg-[#141b24] border border-[#263344] rounded-lg space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white flex items-center gap-1.5 font-sans">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: def?.color || '#f59e0b' }}></span>
                      {def?.name || impl.methodologyId}
                    </span>
                    {getStatusBadge()}
                  </div>

                  <div className="text-xs font-mono space-y-1 bg-[#0c1017] p-2.5 rounded border border-[#1e2836]">
                    <div className="flex justify-between text-zinc-400">
                      <span>Alcance:</span>
                      <strong className="text-white truncate max-w-[170px]">{impl.targetName}</strong>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Desplegado en:</span>
                      <strong className="text-zinc-200">Día {impl.implementedDay}, {impl.implementedHour}:00 hrs</strong>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Ciclos transcurridos:</span>
                      <strong className="text-amber-400">{impl.cyclesActive} ciclos operativos</strong>
                    </div>
                  </div>

                  {/* Progress bar of maturation */}
                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-1">
                      <span>Maduración de la Metodología</span>
                      <span>{Math.min(100, Math.round((impl.cyclesActive / 30) * 100))}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#202938] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(5, (impl.cyclesActive / 30) * 100))}%` }}
                      ></div>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-300 italic leading-relaxed">
                    "{impl.statusNote}"
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#111721] border-2 border-amber-500/80 rounded-xl shadow-2xl p-6 text-zinc-100 space-y-4">
            <div className="flex items-center gap-3 border-b border-[#243142] pb-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold font-mono">
                II
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-sans">
                  Confirmar Implementación Metodológica
                </h3>
                <p className="text-xs text-zinc-400 font-mono">
                  Orden Ejecutiva del Ingeniero Industrial
                </p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-[#161e2a] rounded border border-[#273648] space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Metodología:</span>
                  <strong className="text-amber-400 text-sm">{currentMethodology.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Alcance Seleccionado:</span>
                  <strong className="text-white">{getTargetDisplayName()}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Categoría:</span>
                  <span className="text-zinc-300">{currentMethodology.category}</span>
                </div>
              </div>

              <p className="text-zinc-300 leading-relaxed text-xs">
                Se notificará a la jefatura de área y a los supervisores de turno para iniciar la capacitación y estandarización en Gemba. El impacto técnico se consolidará de manera progresiva tras varios ciclos de operación continua.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#243142]">
              <button
                onClick={() => { sound.playClick(); setConfirmModalOpen(false); }}
                className="px-4 py-2 bg-[#1b2432] hover:bg-[#253244] text-zinc-300 rounded text-xs font-mono transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDeploy}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded transition-colors cursor-pointer font-sans"
              >
                Confirmar & Lanzar Despliegue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
