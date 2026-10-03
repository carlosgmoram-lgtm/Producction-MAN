import React, { useState } from 'react';
import { Dilemma, Character, PlantUnit, DilemmaChoice, PlantRoleId } from '../types/game';
import { getRoleById } from '../data/rolesData';
import { 
  X, Users, AlertTriangle, CheckCircle, ChevronRight, MessageSquare, 
  Lightbulb, ShieldAlert, Sparkles, Check, HelpCircle
} from 'lucide-react';
import { sound } from '../utils/audio';

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeDilemma: Dilemma | null;
  characters: Record<string, Character>;
  units: PlantUnit[];
  onResolveDilemma: (dilemma: Dilemma, choice: DilemmaChoice) => void;
  focusedCharacter?: Character | null;
  currentRole?: PlantRoleId;
}

export const MeetingModal: React.FC<MeetingModalProps> = ({
  isOpen,
  onClose,
  activeDilemma,
  characters,
  units,
  onResolveDilemma,
  focusedCharacter,
  currentRole
}) => {
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>(
    focusedCharacter?.id || activeDilemma?.characterId || 'camila'
  );
  const [consultingChoiceId, setConsultingChoiceId] = useState<string | null>(null);
  const [consultedNpcId, setConsultedNpcId] = useState<string>(activeDilemma?.characterId || 'camila');
  const [showAllNpcTranscript, setShowAllNpcTranscript] = useState<boolean>(false);
  const [confirmingChoice, setConfirmingChoice] = useState<DilemmaChoice | null>(null);
  const [showResolvedToast, setShowResolvedToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const activeChar = characters[selectedCharacterId] || Object.values(characters)[0];
  const charUnit = units.find((u) => u.id === activeChar.unitId);

  // Fallback perspective for any NPC if a specific opinion is missing
  const getNpcPerspective = (npc: Character, choice: DilemmaChoice) => {
    if (choice.npcOpinions && choice.npcOpinions[npc.id]) {
      return choice.npcOpinions[npc.id]!;
    }
    // Check alias if felipe / carlos
    if (npc.id === 'felipe' && choice.npcOpinions && (choice.npcOpinions as Record<string, string>)['carlos']) {
      return (choice.npcOpinions as Record<string, string>)['carlos'];
    }

    switch (npc.id) {
      case 'camila':
        return `Desde la Superintendencia de Producción: esta alternativa incidirá directamente sobre el ritmo de línea y el tiempo de ciclo. Debemos sopesar si la parada o ajuste compensa las horas extras necesarias para recuperar la meta del turno.`;
      case 'marcela':
        return `Desde Aseguramiento de Calidad: cualquier atajo o medida provisional debe ser respaldada por ensayos analíticos. La tolerancia cero a defectos es lo único que nos protege de recalls y reclamos de clientes.`;
      case 'hernan':
        return `Desde Mantenimiento y Confiabilidad: mi deber es velar por no someter los equipos a sobrecargas térmicas o mecánicas. Un parche rápido hoy puede convertirse en una rotura catastrófica mañana.`;
      case 'roberto':
        return `Desde Abastecimiento y Recepción: debemos considerar si contamos con materias primas de recambio en silos y si los proveedores responderán a tiempo sin cobrarnos sobrecostos por flete express.`;
      case 'esteban':
        return `Desde Bodega de Producto Terminado: mi preocupación es el flujo en los andenes de salida. Si retenemos lotes o generamos baches irregulares, los racks se saturarán y bloquearemos la línea de envasado.`;
      case 'sofia':
        return `Desde Despacho y Transporte: los camiones tienen ventanas de entrega estrictas (SLA). Cualquier retraso mayor a 45 minutos pone en riesgo nuestro indicador OTIF frente al retail.`;
      case 'felipe':
        return `Desde Supply Chain: debemos mirar el cuadro global de costos. Hay que evitar que esta contingencia genere un efecto látigo en los pedidos de insumos o desgaste innecesario de capital de trabajo.`;
      case 'rodrigo':
        return `Desde Comercial y Marketing: lo fundamental es no romper los compromisos con las cadenas compradoras. Si fallamos, la competencia no dudarán en quitarnos espacio en góndola.`;
      case 'paulina':
        return `Desde Post-Venta y Experiencia del Cliente: el consumidor final no perdona fallas de empaque o calidad. Una mala experiencia se traduce de inmediato en quejas en redes sociales y caída del NPS.`;
      default:
        return `Como parte del equipo técnico de la planta, considero que esta alternativa debe evaluarse cuidadosamente considerando la seguridad y la estabilidad operativa.`;
    }
  };

  const handleExecuteChoice = (choice: DilemmaChoice) => {
    if (!activeDilemma) return;
    sound.playSuccess();
    setConfirmingChoice(null);
    setShowResolvedToast(choice.consequences.summaryMessage);
    setTimeout(() => {
      onResolveDilemma(activeDilemma, choice);
      setShowResolvedToast(null);
      setConsultingChoiceId(null);
    }, 2400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Comité Operativo de Planta</span>
                {activeDilemma && (
                  <span className="text-[11px] px-2 py-0.5 rounded font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Contingencia Operativa</span>
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Ingeniería Industrial · Consulta a tu equipo técnico y evalúa trade-offs antes de decidir.
              </p>
            </div>
          </div>

          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Cerrar reunión"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Role Voting Perspective */}
        {currentRole && (
          <div className="px-5 py-2.5 bg-gradient-to-r from-[#17202d] to-[#121924] border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Decidiendo con la investidura de:</span>
              <strong className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full bg-gradient-to-br ${getRoleById(currentRole).avatarColor}`}></span>
                <span>{getRoleById(currentRole).name} ({getRoleById(currentRole).characterName})</span>
              </strong>
            </div>
            <span className="text-[11px] text-zinc-400 hidden md:inline">
              Objetivo: {getRoleById(currentRole).tagline.split('·')[0]}
            </span>
          </div>
        )}

        {/* Meeting Room Layout */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          {/* Left Column: Chiefs roster around the table (4 cols) */}
          <div className="lg:col-span-4 p-4 bg-slate-950/40 space-y-2 overflow-y-auto max-h-[75vh]">
            <div className="text-[11px] font-mono uppercase text-slate-400 tracking-wider mb-2 px-1 flex items-center justify-between">
              <span>Jefaturas de Departamento</span>
              <span className="text-[10px] text-amber-400/80">9 Áreas Activas</span>
            </div>

            {Object.values(characters).map((char) => {
              const unit = units.find((u) => u.id === char.unitId);
              const isSelected = char.id === selectedCharacterId;
              const isLeadDilemma = activeDilemma?.characterId === char.id;

              return (
                <button
                  key={char.id}
                  onClick={() => { sound.playClick(); setSelectedCharacterId(char.id); }}
                  className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 border-amber-500 text-white shadow-md'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-full ${char.avatarColor} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-inner relative`}>
                    {char.initials}
                    {isLeadDilemma && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-500 border-2 border-slate-900 animate-pulse" title="Responsable del área del incidente"></span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-semibold truncate text-white">{char.name}</div>
                      <span className="text-[10px] font-mono text-slate-400">{char.morale}% moral</span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">{unit?.shortName}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Active Dilemma or Character Dialogue & Advice (8 cols) */}
          <div className="lg:col-span-8 p-4 sm:p-6 space-y-6 flex flex-col justify-between">
            {/* If there is an active emergency/dilemma */}
            {activeDilemma ? (
              <div className="space-y-5">
                {/* Incident Briefing Card */}
                <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-950 border-2 border-rose-500/60 relative overflow-hidden shadow-lg">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                      Prioridad: {activeDilemma.urgency} · {units.find(u => u.id === activeDilemma.unitId)?.name}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Reporta: {characters[activeDilemma.characterId]?.name} ({characters[activeDilemma.characterId]?.title})
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white mb-2 font-sans">
                    {activeDilemma.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                    {activeDilemma.scenarioDescription}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-rose-500/20 flex items-center gap-2 text-[11px] font-mono text-amber-300/90">
                    <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Sin indicadores previos: consulta a cada jefatura (NPC) para conocer sus previsiones e impactos técnicos antes de elegir.</span>
                  </div>
                </div>

                {/* Managerial Choices / Decision Options */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Opciones de Decisión del Ingeniero Industrial</span>
                    </h4>
                    <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
                      Obliga a razonar y ponderar criterios
                    </span>
                  </div>

                  <div className="space-y-4">
                    {activeDilemma.choices.map((choice, index) => {
                      const isConsultingThisChoice = consultingChoiceId === choice.id;

                      return (
                        <div
                          key={choice.id}
                          className={`rounded-xl border transition-all shadow-sm overflow-hidden ${
                            isConsultingThisChoice 
                              ? 'border-amber-500/80 bg-slate-800/90 shadow-md ring-1 ring-amber-500/30' 
                              : 'border-slate-700 bg-slate-800/60 hover:border-slate-600'
                          }`}
                        >
                          <div className="p-4 flex flex-col sm:flex-row items-start justify-between gap-3">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-start gap-2.5">
                                <span className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                  0{index + 1}
                                </span>
                                <span className="text-xs sm:text-sm font-semibold text-white leading-snug">
                                  {choice.text}
                                </span>
                              </div>

                              <div className="text-[11px] text-amber-400/90 font-mono flex items-center gap-1.5 pl-8">
                                <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                                <span>Racionalidad Operacional: <strong>{choice.methodologyNote}</strong></span>
                              </div>
                            </div>

                            {/* Action Buttons: NPC consultation + Decision confirmation */}
                            <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0">
                              <button
                                onClick={() => {
                                  sound.playClick();
                                  if (isConsultingThisChoice) {
                                    setConsultingChoiceId(null);
                                  } else {
                                    setConsultingChoiceId(choice.id);
                                    if (!consultedNpcId) setConsultedNpcId(activeDilemma.characterId || 'camila');
                                  }
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer border ${
                                  isConsultingThisChoice
                                    ? 'bg-amber-500 text-zinc-950 border-amber-400 font-bold shadow'
                                    : 'bg-[#18212d] hover:bg-[#202b3b] text-amber-400 border-amber-500/40'
                                }`}
                                title="Preguntar a las jefaturas de área qué impacto prevén para esta alternativa"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>{isConsultingThisChoice ? 'Cerrar Consultas' : 'Preguntar Impacto a NPCs'}</span>
                              </button>

                              <button
                                onClick={() => {
                                  sound.playClick();
                                  setConfirmingChoice(choice);
                                }}
                                className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-md font-mono"
                              >
                                <span>Adoptar Decisión</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* NPC In-Depth Consultation Drawer */}
                          {isConsultingThisChoice && (
                            <div className="px-4 pb-4 pt-3 bg-[#0a0e14] border-t border-slate-700/80 space-y-3 animate-in fade-in duration-150">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-slate-400 pb-2 border-b border-slate-800">
                                <span className="text-amber-300 font-bold flex items-center gap-1.5">
                                  <Users className="w-3.5 h-3.5 text-amber-400" />
                                  <span>Consulta de Impacto por Jefatura // Opción {index + 1}:</span>
                                </span>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setShowAllNpcTranscript(!showAllNpcTranscript)}
                                    className="text-[11px] text-amber-400 hover:underline cursor-pointer flex items-center gap-1"
                                  >
                                    <span>{showAllNpcTranscript ? 'Ver Jefatura Individual' : 'Ver Debate Plenario (Todos)'}</span>
                                  </button>
                                </div>
                              </div>

                              {!showAllNpcTranscript ? (
                                <>
                                  {/* Individual NPC Tab Bar */}
                                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono scrollbar-thin">
                                    {Object.values(characters).map((npc) => {
                                      const isSelectedNpc = consultedNpcId === npc.id;
                                      return (
                                        <button
                                          key={npc.id}
                                          onClick={() => {
                                            sound.playClick();
                                            setConsultedNpcId(npc.id);
                                          }}
                                          className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                                            isSelectedNpc
                                              ? 'bg-amber-500/25 border-amber-400 text-white font-bold shadow'
                                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                                          }`}
                                        >
                                          <span className={`w-4 h-4 rounded-full ${npc.avatarColor} text-[9px] font-bold text-white flex items-center justify-center shrink-0`}>
                                            {npc.initials}
                                          </span>
                                          <span>{npc.name.split(' ')[0]}</span>
                                        </button>
                                      );
                                    })}
                                  </div>

                                  {/* Selected NPC's Detailed Industrial Assessment */}
                                  {(() => {
                                    const npc = characters[consultedNpcId] || characters['camila'];
                                    const unit = units.find((u) => u.id === npc.unitId);
                                    const opinionText = getNpcPerspective(npc, choice);

                                    return (
                                      <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 flex items-start gap-3.5 shadow-inner">
                                        <div className={`w-11 h-11 rounded-full ${npc.avatarColor} text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5 shadow-md`}>
                                          {npc.initials}
                                        </div>
                                        <div className="space-y-1.5 flex-1">
                                          <div className="flex flex-wrap items-center justify-between gap-1">
                                            <div>
                                              <strong className="text-xs font-bold text-white">{npc.name}</strong>
                                              <span className="text-[11px] text-amber-400 font-mono ml-2">
                                                {npc.title} · {unit?.shortName}
                                              </span>
                                            </div>
                                            <span className="text-[10px] font-mono text-zinc-400">
                                              Enfoque: {npc.methodology}
                                            </span>
                                          </div>
                                          <p className="text-xs text-slate-200 italic leading-relaxed pl-2 border-l-2 border-amber-500/60">
                                            "{opinionText}"
                                          </p>
                                        </div>
                                      </div>
                                    );
                                  })()}
                                </>
                              ) : (
                                /* Full Roundtable Transcript */
                                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                                  {Object.values(characters).map((npc) => {
                                    const unit = units.find((u) => u.id === npc.unitId);
                                    const opinionText = getNpcPerspective(npc, choice);

                                    return (
                                      <div key={npc.id} className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800/80 flex items-start gap-3">
                                        <div className={`w-7 h-7 rounded-full ${npc.avatarColor} text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5`}>
                                          {npc.initials}
                                        </div>
                                        <div className="space-y-0.5 flex-1 min-w-0">
                                          <div className="flex items-center gap-2">
                                            <strong className="text-xs text-white">{npc.name}</strong>
                                            <span className="text-[10px] text-slate-400 font-mono truncate">({unit?.shortName})</span>
                                          </div>
                                          <p className="text-[11px] text-slate-300 italic leading-relaxed">
                                            "{opinionText}"
                                          </p>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              /* No urgent dilemma: Dialogue & Strategic Consultation mode */
              <div className="space-y-6">
                <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-full ${activeChar.avatarColor} text-white font-bold text-lg flex items-center justify-center shadow-lg`}>
                      {activeChar.initials}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white">{activeChar.name}</h3>
                      <p className="text-xs text-amber-400 font-mono">{activeChar.title} · {charUnit?.name}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{activeChar.personality}</p>
                    </div>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
                    <span className="text-slate-400 block text-[10px] font-mono uppercase mb-1">Saludo y Estado de Turno:</span>
                    "{activeChar.dialogueGreeting}"
                  </div>

                  <div className="bg-amber-950/20 border border-amber-500/30 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
                      <Lightbulb className="w-4 h-4" />
                      <span>Recomendación Técnica de {activeChar.name.split(' ')[0]}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {activeChar.currentAdvice}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800 text-xs font-mono space-y-1.5">
                    <div className="text-[10px] text-slate-400">Moral del Equipo:</div>
                    <div className="text-base font-bold text-emerald-400">{activeChar.morale}%</div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${activeChar.morale}%` }}></div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800 text-xs font-mono space-y-1.5">
                    <div className="text-[10px] text-slate-400">Confianza en la Gerencia:</div>
                    <div className="text-base font-bold text-blue-400">{activeChar.trustInManager}%</div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${activeChar.trustInManager}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-400 p-3 bg-slate-950/30 rounded border border-slate-800 font-mono">
                  <span className="font-semibold text-slate-300">Nota del Ingeniero: </span>
                  No hay incidentes críticos sin resolver en este momento. La operación continúa su marcha según el programa maestro de producción.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Confirmation Modal Before Adopting Decision */}
        {confirmingChoice && activeDilemma && (
          <div className="absolute inset-0 z-20 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="max-w-md w-full bg-slate-900 border-2 border-amber-500/80 rounded-2xl shadow-2xl p-5 space-y-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">¿Confirmar Decisión Operativa?</h3>
                  <p className="text-xs text-slate-400 font-mono">Esta acción es irreversible y sus consecuencias se reflejarán en la planta.</p>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 space-y-1">
                <span className="text-[10px] font-mono uppercase text-amber-400 block font-bold">Alternativa seleccionada:</span>
                <p className="font-medium">{confirmingChoice.text}</p>
                <span className="text-[11px] text-slate-400 block pt-1 font-mono">
                  Fundamento: {confirmingChoice.methodologyNote}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => { sound.playClick(); setConfirmingChoice(null); }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg font-mono transition-colors cursor-pointer"
                >
                  Volver a Evaluar
                </button>
                <button
                  onClick={() => handleExecuteChoice(confirmingChoice)}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg font-mono flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirmar & Ejecutar</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success / Resolved Toast Notification Overlay */}
        {showResolvedToast && (
          <div className="absolute inset-0 z-30 bg-slate-950/95 flex items-center justify-center p-6 text-center animate-in fade-in duration-200">
            <div className="max-w-md p-6 bg-slate-900 border border-emerald-500 rounded-2xl shadow-2xl space-y-3">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Decisión Implementada en Gemba</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {showResolvedToast}
              </p>
              <div className="text-[11px] text-emerald-400 font-mono pt-1">
                La simulación de turno registrará los efectos y variaciones resultantes.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
