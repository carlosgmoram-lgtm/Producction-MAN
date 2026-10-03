import React, { useState } from 'react';
import { Dilemma, Character, PlantUnit, DilemmaChoice } from '../types/game';
import { X, Users, AlertTriangle, CheckCircle, ChevronRight, MessageSquare, Lightbulb, ShieldAlert } from 'lucide-react';
import { sound } from '../utils/audio';

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeDilemma: Dilemma | null;
  characters: Record<string, Character>;
  units: PlantUnit[];
  onResolveDilemma: (dilemma: Dilemma, choice: DilemmaChoice) => void;
  focusedCharacter?: Character | null;
}

export const MeetingModal: React.FC<MeetingModalProps> = ({
  isOpen,
  onClose,
  activeDilemma,
  characters,
  units,
  onResolveDilemma,
  focusedCharacter
}) => {
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>(
    focusedCharacter?.id || activeDilemma?.characterId || 'camila'
  );
  const [showResolvedToast, setShowResolvedToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const activeChar = characters[selectedCharacterId] || Object.values(characters)[0];
  const charUnit = units.find((u) => u.id === activeChar.unitId);

  const handleSelectChoice = (choice: DilemmaChoice) => {
    if (!activeDilemma) return;
    sound.playSuccess();
    setShowResolvedToast(choice.consequences.summaryMessage);
    setTimeout(() => {
      onResolveDilemma(activeDilemma, choice);
      setShowResolvedToast(null);
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Comité Operativo Diario de Planta</span>
                {activeDilemma && (
                  <span className="text-[11px] px-2 py-0.5 rounded font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Contingencia Activa</span>
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                Reunión con los 9 Jefes de Área. Toma de decisiones estratégicas del Ingeniero de Operaciones.
              </p>
            </div>
          </div>

          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Meeting Room Layout */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          {/* Left Column: Chiefs roster around the table (4 cols) */}
          <div className="lg:col-span-4 p-4 bg-slate-950/40 space-y-2 overflow-y-auto max-h-[75vh]">
            <div className="text-[11px] font-mono uppercase text-slate-400 tracking-wider mb-2 px-1">
              Jefaturas Presentes en la Sala
            </div>

            {Object.values(characters).map((char) => {
              const unit = units.find((u) => u.id === char.unitId);
              const isSelected = char.id === selectedCharacterId;
              const isLeadDilemma = activeDilemma?.characterId === char.id;

              return (
                <button
                  key={char.id}
                  onClick={() => { sound.playClick(); setSelectedCharacterId(char.id); }}
                  className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center gap-3 ${
                    isSelected
                      ? 'bg-slate-800 border-amber-500 text-white shadow-md'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-full ${char.avatarColor} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-inner relative`}>
                    {char.initials}
                    {isLeadDilemma && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-500 border-2 border-slate-900"></span>
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
          <div className="lg:col-span-8 p-6 space-y-6 flex flex-col justify-between">
            {/* If there is an active emergency/dilemma */}
            {activeDilemma ? (
              <div className="space-y-5">
                <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/50 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" />
                      Urgencia: {activeDilemma.urgency} · {units.find(u => u.id === activeDilemma.unitId)?.name}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Presentado por {characters[activeDilemma.characterId]?.name}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                    {activeDilemma.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {activeDilemma.scenarioDescription}
                  </p>
                </div>

                {/* Selected Chief's Perspective */}
                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 rounded-full ${activeChar.avatarColor} text-white font-bold text-xs flex items-center justify-center`}>
                      {activeChar.initials}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        Perspectiva de {activeChar.name} ({activeChar.title})
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Enfoque: {activeChar.methodology}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 italic pl-1 border-l-2 border-amber-500/60">
                    "{activeChar.currentAdvice}"
                  </p>
                </div>

                {/* Managerial Choices / Decision Options */}
                <div>
                  <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-3">
                    Opciones de Decisión del Gerente de Operaciones
                  </h4>

                  <div className="space-y-3">
                    {activeDilemma.choices.map((choice, index) => (
                      <button
                        key={choice.id}
                        onClick={() => handleSelectChoice(choice)}
                        className="w-full text-left p-4 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700/80 hover:border-amber-500/80 transition-all group shadow-sm flex items-start justify-between gap-4"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-700 text-amber-300 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                              {index + 1}
                            </span>
                            <span className="text-xs sm:text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                              {choice.text}
                            </span>
                          </div>

                          <div className="text-[11px] text-amber-400/90 font-mono flex items-center gap-1 pl-7">
                            <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                            <span>Fundamento: {choice.methodologyNote}</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-400 pl-7 pt-1">
                            {choice.consequences.cashChange !== 0 && (
                              <span>
                                Impacto Caja:{' '}
                                <strong className={choice.consequences.cashChange > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                                  {choice.consequences.cashChange > 0 ? '+' : ''}${choice.consequences.cashChange.toLocaleString()}
                                </strong>
                              </span>
                            )}
                            {choice.consequences.kpiEffects?.oee && (
                              <span>
                                OEE:{' '}
                                <strong className={choice.consequences.kpiEffects.oee > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                                  {choice.consequences.kpiEffects.oee > 0 ? '+' : ''}{choice.consequences.kpiEffects.oee}%
                                </strong>
                              </span>
                            )}
                            {choice.consequences.kpiEffects?.otif && (
                              <span>
                                OTIF:{' '}
                                <strong className={choice.consequences.kpiEffects.otif > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                                  {choice.consequences.kpiEffects.otif > 0 ? '+' : ''}{choice.consequences.kpiEffects.otif}%
                                </strong>
                              </span>
                            )}
                          </div>
                        </div>

                        <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition-transform group-hover:translate-x-1 shrink-0 mt-1" />
                      </button>
                    ))}
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

                <div className="text-xs text-slate-400 p-3 bg-slate-950/30 rounded border border-slate-800">
                  <span className="font-semibold text-slate-300">Nota del Ingeniero: </span>
                  No hay incidentes críticos sin resolver en este momento. La operación continúa su marcha según el programa maestro de producción.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Success / Resolved Toast Notification Overlay */}
        {showResolvedToast && (
          <div className="absolute inset-0 bg-slate-950/90 flex items-center justify-center p-6 text-center animate-in fade-in duration-200">
            <div className="max-w-md p-6 bg-slate-900 border border-emerald-500 rounded-2xl shadow-2xl space-y-3">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Decisión Ejecutada</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {showResolvedToast}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
