import React, { useState, useEffect, useRef } from 'react';
import { 
  INITIAL_UNITS, 
  INITIAL_CHARACTERS, 
  INITIAL_INDICATORS, 
  INITIAL_ENGINEER 
} from './data/plantData';
import { DILEMMAS_LIBRARY } from './data/dilemmasData';
import { 
  PlantUnit, 
  Character, 
  PlantIndicators, 
  EngineerProfile, 
  Dilemma, 
  DilemmaChoice, 
  DayLogEntry, 
  DayReport,
  CaseStudy,
  UnitId
} from './types/game';
import { Header } from './components/Header';
import { PlantCanvas } from './components/PlantCanvas';
import { KpiDashboard } from './components/KpiDashboard';
import { MeetingModal } from './components/MeetingModal';
import { UnitModal } from './components/UnitModal';
import { DecisionLog } from './components/DecisionLog';
import { DayEndModal } from './components/DayEndModal';
import { ScenarioSelector } from './components/ScenarioSelector';
import { EngineerProfileModal } from './components/EngineerProfileModal';
import { PlantBriefingModal } from './components/PlantBriefingModal';
import { TitleScreen } from './components/TitleScreen';
import { PROCESS_OPTIONS } from './data/processesData';
import { sound } from './utils/audio';
import { RotateCcw, User, Volume2, VolumeX, ShieldAlert, BookOpen } from 'lucide-react';
import { ProcessConfig } from './types/game';

const STORAGE_KEY = 'industrial_engineer_game_state_v1';

export default function App() {
  // Navigation tab
  const [currentTab, setCurrentTab] = useState<'plant' | 'kpis' | 'meeting' | 'log' | 'cases'>('plant');
  
  // Game lifecycle & time
  const [showTitleScreen, setShowTitleScreen] = useState<boolean>(true);
  const [currentProcess, setCurrentProcess] = useState<ProcessConfig>(PROCESS_OPTIONS[1]);
  const [gameMode, setGameMode] = useState<'CAREER' | 'SANDBOX' | 'CASE_STUDY'>('CAREER');
  const [day, setDay] = useState<number>(1);
  const [hour, setHour] = useState<number>(8); // 08:00 to 18:00
  const [isSimulating, setIsSimulating] = useState<boolean>(false); // starts paused until briefing is acknowledged
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Executive briefing modal (opens after title screen process selection)
  const [isBriefingOpen, setIsBriefingOpen] = useState<boolean>(false);
  const [hasStartedBefore, setHasStartedBefore] = useState<boolean>(false);

  // Core entities
  const [units, setUnits] = useState<PlantUnit[]>(INITIAL_UNITS);
  const [characters, setCharacters] = useState<Record<string, Character>>(INITIAL_CHARACTERS);
  const [indicators, setIndicators] = useState<PlantIndicators>(INITIAL_INDICATORS);
  const [engineer, setEngineer] = useState<EngineerProfile>(INITIAL_ENGINEER);
  
  // Dilemmas & Logs
  const [activeDilemma, setActiveDilemma] = useState<Dilemma | null>(null);
  const [resolvedDilemmas, setResolvedDilemmas] = useState<string[]>([]);
  const [logs, setLogs] = useState<DayLogEntry[]>([]);

  // Modals
  const [selectedUnit, setSelectedUnit] = useState<PlantUnit | null>(null);
  const [focusedCharacter, setFocusedCharacter] = useState<Character | null>(null);
  const [isMeetingOpen, setIsMeetingOpen] = useState<boolean>(false);
  const [isEndDayOpen, setIsEndDayOpen] = useState<boolean>(false);
  const [currentReport, setCurrentReport] = useState<DayReport | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  // Ref to track day units produced
  const dayStartUnits = useRef<number>(indicators.unitsProducedToday);

  // Load saved state from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.day && parsed.indicators) {
          setDay(parsed.day);
          setHour(parsed.hour || 8);
          setUnits(parsed.units || INITIAL_UNITS);
          setCharacters(parsed.characters || INITIAL_CHARACTERS);
          setIndicators(parsed.indicators);
          setEngineer(parsed.engineer || INITIAL_ENGINEER);
          setResolvedDilemmas(parsed.resolvedDilemmas || []);
          setLogs(parsed.logs || []);
          setHasStartedBefore(true);
          // If already started previously, player can start directly or see briefing
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Save state on key changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        day,
        hour,
        units,
        characters,
        indicators,
        engineer,
        resolvedDilemmas,
        logs
      }));
    } catch {
      // ignore
    }
  }, [day, hour, units, characters, indicators, engineer, resolvedDilemmas, logs]);

  // Handler to start simulation when player finishes briefing
  const handleStartGameFromBriefing = () => {
    setIsBriefingOpen(false);
    setHasStartedBefore(true);
    setIsSimulating(true);
  };

  // Handler when player selects a plant process on TitleScreen
  const handleSelectProcessFromTitle = (process: ProcessConfig) => {
    setCurrentProcess(process);
    setShowTitleScreen(false);
    setIsBriefingOpen(true);
    setIndicators((prev) => ({
      ...prev,
      dailyProductionTarget: process.defaultTargetUnits,
      cashBalance: process.initialCash
    }));
    // Update process station restriction
    setUnits((prev) =>
      prev.map((u) => {
        if (u.id === 'proceso') {
          return {
            ...u,
            metrics: {
              ...u.metrics,
              cuelloBotella: { label: 'Restricción Actual', value: process.bottleneckStation }
            }
          };
        }
        return u;
      })
    );
  };

  // Check for triggered dilemmas on day/hour change
  useEffect(() => {
    if (activeDilemma) return;
    const matching = DILEMMAS_LIBRARY.find(
      (d) => d.dayTrigger === day && (!d.hourTrigger || d.hourTrigger <= hour) && !resolvedDilemmas.includes(d.id)
    );
    if (matching) {
      setActiveDilemma(matching);
      setIsSimulating(false);
      sound.playWarning();
    }
  }, [day, hour, resolvedDilemmas, activeDilemma]);

  // Simulation tick loop
  useEffect(() => {
    if (!isSimulating || activeDilemma || isEndDayOpen) return;

    const tickMs = 2400 / simSpeed;
    const interval = setInterval(() => {
      setHour((prevHour) => {
        if (prevHour >= 18) {
          // End of shift reached
          setIsSimulating(false);
          generateDayEndReport();
          return 18;
        }

        // Produce units in this hour
        const procUnit = units.find(u => u.id === 'proceso');
        const overtimeBonus = procUnit?.tacticalToggles.overtime ? 1.15 : 1.0;
        const currentHourlyRate = Math.round(((procUnit?.metrics.unidadesHora?.value as number) || 880) * overtimeBonus);

        setIndicators((prev) => {
          const newUnitsToday = prev.unitsProducedToday + currentHourlyRate;
          const revenueDelta = Math.round(currentHourlyRate * 42.5);
          const costDelta = Math.round(currentHourlyRate * 29.0);
          
          return {
            ...prev,
            unitsProducedToday: newUnitsToday,
            dailyRevenue: prev.dailyRevenue + revenueDelta,
            dailyCost: prev.dailyCost + costDelta,
            cashBalance: prev.cashBalance + (revenueDelta - costDelta),
            rawMaterialTons: Math.max(20, prev.rawMaterialTons - 4)
          };
        });

        return prevHour + 1;
      });
    }, tickMs);

    return () => clearInterval(interval);
  }, [isSimulating, simSpeed, activeDilemma, isEndDayOpen, units]);

  // Generate End of Day report
  const generateDayEndReport = () => {
    const produced = indicators.unitsProducedToday - dayStartUnits.current;
    const target = indicators.dailyProductionTarget;
    const ebitda = indicators.dailyRevenue - indicators.dailyCost;

    let boardComments = 'El Directorio evaluó la gestión con conformidad. Se cumplieron los estándares operativos clave.';
    if (indicators.oee >= 84 && indicators.otif >= 93) {
      boardComments = '¡Excelente gestión! El Directorio destaca la alta sincronización entre producción y comercial. Se aprueba bonificación por productividad.';
    } else if (indicators.oee < 75 || indicators.otif < 88) {
      boardComments = 'Advertencia del Comité: La planta presentó retrasos en despachos e ineficiencia en línea. Se solicita plan de contingencia inmediato.';
    }

    const report: DayReport = {
      day,
      unitsProduced: produced,
      targetUnits: target,
      oee: indicators.oee,
      otif: indicators.otif,
      revenue: indicators.dailyRevenue,
      cost: indicators.dailyCost,
      ebitda,
      defectsCount: Math.round(produced * (indicators.scrapPpm / 1000000)),
      accidentsCount: 0,
      boardComments,
      chiefFeedback: [
        {
          characterId: 'camila',
          comment: `Ing. Camila: "Logramos producir ${produced.toLocaleString()} unidades en el turno. El equipo operó coordinado."`
        },
        {
          characterId: 'marcela',
          comment: `Dra. Marcela: "Aseguramos una tasa de defectos controlada de ${indicators.scrapPpm} PPM. Calidad validó todos los lotes."`
        },
        {
          characterId: 'sofia',
          comment: `Sofía Navarrete: "Despachamos los pedidos con un OTIF final de ${indicators.otif.toFixed(1)}%."`
        }
      ]
    };

    setCurrentReport(report);
    setIsEndDayOpen(true);
    sound.playShiftStart();
  };

  // Next Day handler
  const handleStartNextDay = () => {
    setDay((prev) => prev + 1);
    setHour(8);
    setIsEndDayOpen(false);
    dayStartUnits.current = indicators.unitsProducedToday;

    // Reset daily counters
    setIndicators((prev) => ({
      ...prev,
      unitsProducedToday: 0,
      dailyRevenue: 0,
      dailyCost: 0,
      daysWithoutIncidents: prev.daysWithoutIncidents + 1
    }));

    // Add bitácora log
    setLogs((prev) => [
      {
        day: day + 1,
        hour: 8,
        type: 'TACTICAL',
        title: `Inicio de Jornada Día ${day + 1}`,
        description: `Se abre el turno matutino a las 08:00 hrs. Programación maestro de 7.000 unidades.`,
        impact: `Cero accidentes mantenido (${indicators.daysWithoutIncidents + 1} días).`
      },
      ...prev
    ]);

    setIsSimulating(true);
  };

  // Resolve active dilemma
  const handleResolveDilemma = (dilemma: Dilemma, choice: DilemmaChoice) => {
    const { consequences } = choice;

    // Update cash balance & KPIs
    setIndicators((prev) => {
      let newOee = prev.oee;
      let newOtif = prev.otif;
      let newScrap = prev.scrapPpm;
      let newLead = prev.leadTimeHours;

      if (consequences.kpiEffects?.oee) newOee = Math.min(99, Math.max(50, newOee + consequences.kpiEffects.oee));
      if (consequences.kpiEffects?.otif) newOtif = Math.min(100, Math.max(50, newOtif + consequences.kpiEffects.otif));
      if (consequences.kpiEffects?.defects) newScrap = Math.max(50, newScrap + consequences.kpiEffects.defects);
      if (consequences.kpiEffects?.leadTimeHours) newLead = Math.max(0.8, newLead + consequences.kpiEffects.leadTimeHours);

      return {
        ...prev,
        cashBalance: prev.cashBalance + consequences.cashChange,
        oee: newOee,
        otif: newOtif,
        scrapPpm: newScrap,
        leadTimeHours: newLead
      };
    });

    // Update morale in characters
    if (consequences.moraleChanges) {
      setCharacters((prev) => {
        const next = { ...prev };
        Object.entries(consequences.moraleChanges!).forEach(([unitKey, delta]) => {
          const charKey = Object.keys(next).find(k => next[k].unitId === unitKey);
          if (charKey && next[charKey]) {
            next[charKey] = {
              ...next[charKey],
              morale: Math.min(100, Math.max(20, next[charKey].morale + (delta || 0)))
            };
          }
        });
        return next;
      });
    }

    // Update engineer stats
    setEngineer((prev) => ({
      ...prev,
      careerPoints: prev.careerPoints + 150,
      decisionsMadeCount: prev.decisionsMadeCount + 1
    }));

    // Add to logs
    setLogs((prev) => [
      {
        day,
        hour,
        type: 'DILEMMA',
        title: dilemma.title,
        description: choice.text,
        impact: consequences.summaryMessage
      },
      ...prev
    ]);

    setResolvedDilemmas((prev) => [...prev, dilemma.id]);
    setActiveDilemma(null);
    setIsMeetingOpen(false);
    setIsSimulating(true);
  };

  // Tactical Toggle on Unit
  const handleToggleTactical = (unitId: UnitId, toggleKey: keyof PlantUnit['tacticalToggles']) => {
    sound.playClick();
    setUnits((prev) =>
      prev.map((u) => {
        if (u.id === unitId) {
          const nextVal = !u.tacticalToggles[toggleKey];
          return {
            ...u,
            tacticalToggles: {
              ...u.tacticalToggles,
              [toggleKey]: nextVal
            },
            // Immediate effect on stress / health
            stressLevel: toggleKey === 'overtime' ? (nextVal ? u.stressLevel + 12 : u.stressLevel - 12) : u.stressLevel,
            health: toggleKey === 'preventiveCheck' ? (nextVal ? Math.min(100, u.health + 6) : u.health) : u.health
          };
        }
        return u;
      })
    );
  };

  // Load a Case Study
  const handleSelectCaseStudy = (caseStudy: CaseStudy) => {
    setGameMode('CASE_STUDY');
    setCurrentTab('plant');
    setDay(1);
    setHour(8);
    setIndicators((prev) => ({
      ...prev,
      ...caseStudy.initialIndicators
    }));
    sound.playSuccess();
    setLogs((prev) => [
      {
        day: 1,
        hour: 8,
        type: 'ACHIEVEMENT',
        title: `Caso de Estudio Cargado: ${caseStudy.title}`,
        description: caseStudy.description,
        impact: `Objetivo: ${caseStudy.targetObjective}`
      },
      ...prev
    ]);
  };

  // Reset to initial game state
  const handleResetGame = () => {
    if (confirm('¿Deseas reiniciar la simulación y comenzar desde el Día 1?')) {
      localStorage.removeItem(STORAGE_KEY);
      setDay(1);
      setHour(8);
      setUnits(INITIAL_UNITS);
      setCharacters(INITIAL_CHARACTERS);
      setIndicators(INITIAL_INDICATORS);
      setEngineer(INITIAL_ENGINEER);
      setResolvedDilemmas([]);
      setLogs([]);
      setActiveDilemma(null);
      setGameMode('CAREER');
      setCurrentTab('plant');
      setIsSimulating(true);
      sound.playShiftStart();
    }
  };

  const activeDilemmasCount = activeDilemma ? 1 : 0;

  // 1. Arcade Title Screen with Piping, Machinery & Fire Sparks
  if (showTitleScreen) {
    return <TitleScreen onSelectProcess={handleSelectProcessFromTitle} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0d12] text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-zinc-950">
      {/* Primary Top Bar */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        day={day}
        hour={hour}
        isSimulating={isSimulating}
        simSpeed={simSpeed}
        onToggleSimulate={() => setIsSimulating(!isSimulating)}
        onSetSpeed={(speed) => setSimSpeed(speed)}
        indicators={indicators}
        activeDilemmasCount={activeDilemmasCount}
        onOpenMeeting={() => setIsMeetingOpen(true)}
        onOpenEndDay={() => generateDayEndReport()}
        onOpenBriefing={() => setIsBriefingOpen(true)}
        onBackToTitle={() => {
          setIsSimulating(false);
          setShowTitleScreen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Urgent Dilemma Callout if active */}
        {activeDilemma && (
          <div className="p-4 bg-gradient-to-r from-rose-950/80 to-[#141a23] border border-rose-500/80 rounded-xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wide">
                  Contingencia Operativa en Espera de Decisión
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {activeDilemma.title}
                </h3>
              </div>
            </div>

            <button
              onClick={() => { sound.playWarning(); setIsMeetingOpen(true); }}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg transition-colors whitespace-nowrap shadow-md cursor-pointer"
            >
              Abrir Sala de Comité
            </button>
          </div>
        )}

        {/* Tab 1: Live Animated Plant */}
        {currentTab === 'plant' && (
          <div className="space-y-6">
            <PlantCanvas
              units={units}
              characters={characters}
              bottleneckUnit={indicators.bottleneckUnit}
              isSimulating={isSimulating}
              onSelectUnit={(unit) => setSelectedUnit(unit)}
              onOpenCharacterDialogue={(char) => {
                setFocusedCharacter(char);
                setIsMeetingOpen(true);
              }}
            />

            {/* Engineer Tactical Strip */}
            <div className="p-4 bg-[#12161e] border border-[#222b37] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { sound.playClick(); setIsProfileOpen(true); }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#181f29] hover:bg-[#222b38] rounded-lg border border-[#293544] text-xs font-mono transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>{engineer.name} · {engineer.level}</span>
                </button>
                <span className="text-zinc-600 hidden sm:inline">|</span>
                <span className="text-xs text-zinc-400 hidden sm:inline font-mono">
                  {engineer.specialty}
                </span>
                <button
                  onClick={() => { sound.playClick(); setIsBriefingOpen(true); }}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-amber-400/90 hover:text-amber-300 font-mono transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Manual de Planta</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const next = !isMuted;
                    setIsMuted(next);
                    sound.setMuted(next);
                  }}
                  className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-[#1a222d] transition-colors cursor-pointer"
                  title={isMuted ? 'Activar Sonido' : 'Silenciar'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleResetGame}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-400 hover:text-rose-400 rounded-lg hover:bg-[#1a222d] transition-colors cursor-pointer font-mono"
                  title="Reiniciar Simulación"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reiniciar</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: KPIs & Industrial Engineering Cockpit */}
        {currentTab === 'kpis' && (
          <KpiDashboard indicators={indicators} units={units} />
        )}

        {/* Tab 3: Daily Standup / Operational Meeting */}
        {currentTab === 'meeting' && (
          <div className="bg-[#12161e] border border-[#222b37] rounded-2xl p-6">
            <MeetingModal
              isOpen={true}
              onClose={() => setCurrentTab('plant')}
              activeDilemma={activeDilemma}
              characters={characters}
              units={units}
              onResolveDilemma={handleResolveDilemma}
              focusedCharacter={focusedCharacter}
            />
          </div>
        )}

        {/* Tab 4: Decision Log / Bitácora */}
        {currentTab === 'log' && (
          <DecisionLog logs={logs} />
        )}

        {/* Tab 5: Case Studies & Scenarios */}
        {currentTab === 'cases' && (
          <ScenarioSelector
            onSelectCaseStudy={handleSelectCaseStudy}
            onSelectCareerMode={() => {
              setGameMode('CAREER');
              setCurrentTab('plant');
            }}
            currentMode={gameMode}
          />
        )}
      </main>

      {/* Initial / On-Demand Executive Briefing Modal */}
      <PlantBriefingModal
        isOpen={isBriefingOpen}
        onStartGame={handleStartGameFromBriefing}
        onClose={() => setIsBriefingOpen(false)}
        onBackToTitle={() => {
          setIsSimulating(false);
          setIsBriefingOpen(false);
          setShowTitleScreen(true);
        }}
        isInitialLaunch={!hasStartedBefore}
        processConfig={currentProcess}
      />

      {/* Floating Dialog / Popup Modals */}
      {selectedUnit && (
        <UnitModal
          unit={selectedUnit}
          character={characters[selectedUnit.characterId]}
          onClose={() => setSelectedUnit(null)}
          onToggleTactical={handleToggleTactical}
          onStartDialogue={(char) => {
            setSelectedUnit(null);
            setFocusedCharacter(char);
            setIsMeetingOpen(true);
          }}
        />
      )}

      {isMeetingOpen && currentTab !== 'meeting' && (
        <MeetingModal
          isOpen={isMeetingOpen}
          onClose={() => {
            setIsMeetingOpen(false);
            setFocusedCharacter(null);
          }}
          activeDilemma={activeDilemma}
          characters={characters}
          units={units}
          onResolveDilemma={handleResolveDilemma}
          focusedCharacter={focusedCharacter}
        />
      )}

      {isEndDayOpen && currentReport && (
        <DayEndModal
          isOpen={isEndDayOpen}
          report={currentReport}
          onNextDay={handleStartNextDay}
        />
      )}

      {isProfileOpen && (
        <EngineerProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          profile={engineer}
          indicators={indicators}
        />
      )}

      {/* Footer with industrial tone */}
      <footer className="border-t border-[#1a212a] bg-[#090c0f] py-4 px-6 text-xs text-zinc-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Planta Industrial: El Rol del Ingeniero · Simulación de Gestión Operativa
          </div>
          <div className="text-zinc-400">
            Lean Manufacturing · Teoría de Restricciones · Six Sigma · S&OP
          </div>
        </div>
      </footer>
    </div>
  );
}
