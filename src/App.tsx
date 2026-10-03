import React, { useState, useEffect, useRef } from 'react';
import { 
  INITIAL_UNITS, 
  INITIAL_CHARACTERS, 
  INITIAL_INDICATORS, 
  INITIAL_ENGINEER 
} from './data/plantData';
import { DILEMMAS_LIBRARY, getRandomDilemmaForProcess, getRandomizedConsequences } from './data/dilemmasData';
import { INITIAL_MACHINES, INITIAL_MAINTENANCE_PLAN } from './data/methodologiesData';
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
  UnitId,
  ProcessConfig,
  ActiveImplementation,
  MachineDefinition,
  ActiveTrainingPlan,
  MaintenancePlanState,
  MethodologyScope,
  MethodologyDefinition,
  MaintenanceStrategy,
  VisualTheme,
  PlantRoleId,
  BottleneckTOCState,
  LinePacingMode
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
import { MethodologiesManager } from './components/MethodologiesManager';
import { MaintenanceManager } from './components/MaintenanceManager';
import { TrainingManager } from './components/TrainingManager';
import { PlantReportModal } from './components/PlantReportModal';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { RoleCockpit } from './components/RoleCockpit';
import { RoleSelectorModal } from './components/RoleSelectorModal';
import { BottleneckManagerModal } from './components/BottleneckManagerModal';
import { PROCESS_OPTIONS, PROCESS_MACHINES } from './data/processesData';
import { getRoleById } from './data/rolesData';
import { sound } from './utils/audio';
import { RotateCcw, User, Volume2, VolumeX, ShieldAlert, BookOpen, FileText, Palette, Users, AlertCircle } from 'lucide-react';

const STORAGE_KEY = 'industrial_engineer_game_state_v1';

export default function App() {
  // Navigation tab
  const [currentTab, setCurrentTab] = useState<'plant' | 'kpis' | 'methodologies' | 'maintenance' | 'training' | 'meeting' | 'log' | 'cases'>('plant');
  
  // Game lifecycle & time
  const [showTitleScreen, setShowTitleScreen] = useState<boolean>(true);
  const [currentProcess, setCurrentProcess] = useState<ProcessConfig>(PROCESS_OPTIONS[1]);
  const [gameMode, setGameMode] = useState<'CAREER' | 'SANDBOX' | 'CASE_STUDY'>('CAREER');
  const [day, setDay] = useState<number>(1);
  const [hour, setHour] = useState<number>(8); // 08:00 to 18:00
  const [isSimulating, setIsSimulating] = useState<boolean>(false); // starts paused until briefing is acknowledged
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Executive briefing & report modal
  const [isBriefingOpen, setIsBriefingOpen] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);
  const [hasStartedBefore, setHasStartedBefore] = useState<boolean>(false);

  // Visual Theme (dark SCADA, light cleanroom, blueprint CAD, amber CRT terminal)
  const [theme, setTheme] = useState<VisualTheme>(() => {
    try {
      return (localStorage.getItem('production_man_theme') as VisualTheme) || 'dark';
    } catch {
      return 'dark';
    }
  });

  const handleSelectTheme = (newTheme: VisualTheme) => {
    setTheme(newTheme);
    try {
      localStorage.setItem('production_man_theme', newTheme);
    } catch {
      // ignore
    }
  };

  // Multi-Role Operativo (Gerente de Planta, Producción, Calidad, Mantenimiento, Abastecimiento, Despacho)
  const [currentRole, setCurrentRole] = useState<PlantRoleId>(() => {
    try {
      return (localStorage.getItem('production_man_role') as PlantRoleId) || 'GERENTE_PLANTA';
    } catch {
      return 'GERENTE_PLANTA';
    }
  });
  const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(false);

  const handleSelectRole = (newRole: PlantRoleId) => {
    setCurrentRole(newRole);
    try {
      localStorage.setItem('production_man_role', newRole);
    } catch {
      // ignore
    }
  };

  // Core entities
  const [units, setUnits] = useState<PlantUnit[]>(INITIAL_UNITS);
  const [characters, setCharacters] = useState<Record<string, Character>>(INITIAL_CHARACTERS);
  const [indicators, setIndicators] = useState<PlantIndicators>(INITIAL_INDICATORS);
  const [engineer, setEngineer] = useState<EngineerProfile>(INITIAL_ENGINEER);
  
  // Industrial Engineering Implementations, Assets & Plans
  const [machines, setMachines] = useState<MachineDefinition[]>(INITIAL_MACHINES);
  const [activeImplementations, setActiveImplementations] = useState<ActiveImplementation[]>([]);
  const [activeTrainingPlans, setActiveTrainingPlans] = useState<ActiveTrainingPlan[]>([]);
  const [maintenancePlan, setMaintenancePlan] = useState<MaintenancePlanState>(INITIAL_MAINTENANCE_PLAN);

  // Theory of Constraints (TOC) & Bottleneck Management
  const [bottleneckState, setBottleneckState] = useState<BottleneckTOCState>(() => ({
    pacingMode: 'MAXIMA_VELOCIDAD',
    targetMachineId: 'env_inyectora_principal',
    targetMachineName: 'Inyectora Hidráulica-Eléctrica 650T',
    nominalBottleneckCapacity: 720,
    effectiveLineCadence: 880,
    improvementsAppliedCount: 0,
    replacementProjectExecuted: false,
    dailyOperationalCostIncurred: 0,
    wipBufferUnits: 1850,
    lineRebalanced: false
  }));
  const [isBottleneckModalOpen, setIsBottleneckModalOpen] = useState<boolean>(false);

  // Preselection helpers when navigating from units or machines
  const [preselectedMethodologyUnitId, setPreselectedMethodologyUnitId] = useState<UnitId | null>(null);
  const [preselectedMethodologyMachineId, setPreselectedMethodologyMachineId] = useState<string | null>(null);
  const [preselectedTrainingUnitId, setPreselectedTrainingUnitId] = useState<UnitId | null>(null);

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

  // Ref to track day units produced and dilemma intervals
  const dayStartUnits = useRef<number>(indicators.unitsProducedToday);
  const lastDilemmaHourRef = useRef<number>(-99);
  const dilemmasTodayCountRef = useRef<number>(0);

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
          if (parsed.machines) setMachines(parsed.machines);
          if (parsed.activeImplementations) setActiveImplementations(parsed.activeImplementations);
          if (parsed.activeTrainingPlans) setActiveTrainingPlans(parsed.activeTrainingPlans);
          if (parsed.maintenancePlan) setMaintenancePlan(parsed.maintenancePlan);
          setHasStartedBefore(true);
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
        logs,
        machines,
        activeImplementations,
        activeTrainingPlans,
        maintenancePlan
      }));
    } catch {
      // ignore
    }
  }, [day, hour, units, characters, indicators, engineer, resolvedDilemmas, logs, machines, activeImplementations, activeTrainingPlans, maintenancePlan]);

  // Handler to start simulation when player finishes briefing
  const handleStartGameFromBriefing = () => {
    setIsBriefingOpen(false);
    setHasStartedBefore(true);
    setIsSimulating(true);
  };

  // Handler when player selects a plant process on TitleScreen
  const handleSelectProcessFromTitle = (process: ProcessConfig, roleId?: PlantRoleId) => {
    setCurrentProcess(process);
    if (roleId) {
      handleSelectRole(roleId);
    }
    setShowTitleScreen(false);
    setIsBriefingOpen(true);
    setIndicators((prev) => ({
      ...prev,
      dailyProductionTarget: process.defaultTargetUnits,
      cashBalance: process.initialCash
    }));
    // Assign specific machines for this plant process
    const plantMachines = PROCESS_MACHINES[process.id] || INITIAL_MACHINES;
    setMachines(plantMachines);
    dilemmasTodayCountRef.current = 0;
    lastDilemmaHourRef.current = -99;

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

  // Simulation tick loop with methodologies, training & machine wear effects
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

        // 1. Advance active implementations cycles & maturation status
        setActiveImplementations((prevImpls) =>
          prevImpls.map((impl) => {
            const nextCycles = impl.cyclesActive + 1;
            let nextStatus: ActiveImplementation['status'] = impl.status;
            let nextNote = impl.statusNote;

            if (nextCycles < 5) {
              nextStatus = 'INICIANDO';
              nextNote = 'Fase de lanzamiento en Gemba. Recolección de línea base y preparación de materiales.';
            } else if (nextCycles < 15) {
              nextStatus = 'CURVA_APRENDIZAJE';
              nextNote = 'Curva de aprendizaje activa. Adaptación del personal, superación de vicios iniciales y ajuste de rutinas.';
            } else if (nextCycles < 30) {
              nextStatus = 'EN_MADURACION';
              nextNote = 'En maduración progresiva. Estandarización asimilada y estabilización visible de variabilidad.';
            } else {
              nextStatus = 'ESTABILIZADA';
              nextNote = 'Cultura operacional consolidada. Impacto pleno y sostenido en los indicadores de la planta.';
            }

            return {
              ...impl,
              cyclesActive: nextCycles,
              status: nextStatus,
              statusNote: nextNote
            };
          })
        );

        // 2. Advance active training plans
        setActiveTrainingPlans((prevPlans) =>
          prevPlans.map((plan) => {
            if (plan.status !== 'EN_CURSO') return plan;
            const nextHours = plan.progressHours + 1;
            const isCompleted = nextHours >= plan.totalHours;

            if (isCompleted && plan.status === 'EN_CURSO') {
              sound.playSuccess();
              setLogs((prev) => [
                {
                  day,
                  hour: prevHour,
                  type: 'TRAINING',
                  title: `Programa de Capacitación Concluido: ${plan.title}`,
                  description: `Se certificó con éxito a ${plan.workersCount} personas en ${plan.targetAudience}.`,
                  impact: `Competencias adquiridas. Reducción de variabilidad y elevación de la moral (+3%).`
                },
                ...prev
              ]);

              setIndicators((ind) => ({
                ...ind,
                plantMorale: Math.min(100, ind.plantMorale + 3),
                scrapPpm: Math.max(120, ind.scrapPpm - 20)
              }));
            }

            return {
              ...plan,
              progressHours: nextHours,
              status: isCompleted ? 'COMPLETADO' : 'EN_CURSO'
            };
          })
        );

        // 3. Compute base hourly production rate with tactical toggles and mature methodology bonuses
        const procUnit = units.find(u => u.id === 'proceso');
        const overtimeBonus = procUnit?.tacticalToggles.overtime ? 1.15 : 1.0;
        
        // Mature methodology bonuses
        const smedActive = activeImplementations.some(i => i.methodologyId === 'SMED' && i.cyclesActive >= 10);
        const fiveSActive = activeImplementations.some(i => i.methodologyId === '5S' && i.cyclesActive >= 10);
        const jitActive = activeImplementations.some(i => i.methodologyId === 'JIT' && i.cyclesActive >= 15);

        let hourlyBonus = 0;
        if (smedActive) hourlyBonus += 25; // SMED cuts downtime
        if (fiveSActive) hourlyBonus += 15; // 5S cuts searching
        if (jitActive) hourlyBonus += 20; // JIT aligns pull flow

        const currentHourlyRate = Math.round(
          (((procUnit?.metrics.unidadesHora?.value as number) || 880) + hourlyBonus) * overtimeBonus
        );

        // 4. Update machines wear & health
        setMachines((prevMachines) =>
          prevMachines.map((m) => {
            if (m.status === 'MANTENIMIENTO' || m.status === 'DETENIDA') return m;

            // Wear rate calculation based on maintenance strategy & active tools
            let hourlyWear = 0.16;
            if (procUnit?.tacticalToggles.overtime) hourlyWear += 0.08;
            if (maintenancePlan.autonomousMaintenanceActive) hourlyWear -= 0.04;
            if (maintenancePlan.predictiveSensorsActive) hourlyWear -= 0.04;
            if (activeImplementations.some(i => i.methodologyId === 'TPM' && i.cyclesActive >= 10)) hourlyWear -= 0.05;

            const nextWear = Math.min(100, Math.round((m.wearPercent + Math.max(0.04, hourlyWear)) * 10) / 10);
            let nextStatus = m.status;
            if (nextWear >= 80 && m.status === 'OPERANDO') {
              nextStatus = 'EN_ALERTA';
            }

            return {
              ...m,
              wearPercent: nextWear,
              operatingHours: m.operatingHours + 1,
              status: nextStatus
            };
          })
        );

        // 5. Update indicators
        setIndicators((prev) => {
          const newUnitsToday = prev.unitsProducedToday + currentHourlyRate;
          const revenueDelta = Math.round(currentHourlyRate * 42.5);
          const costDelta = Math.round(currentHourlyRate * 29.0);

          // Six sigma / Poka-yoke PPM benefits
          const sixSigmaActive = activeImplementations.some(i => i.methodologyId === 'SIX_SIGMA' && i.cyclesActive >= 15);
          const pokaYokeActive = activeImplementations.some(i => i.methodologyId === 'POKA_YOKE' && i.cyclesActive >= 10);
          let newScrap = prev.scrapPpm;
          if (sixSigmaActive && newScrap > 150) newScrap -= 2;
          if (pokaYokeActive && newScrap > 180) newScrap -= 1;

          return {
            ...prev,
            unitsProducedToday: newUnitsToday,
            dailyRevenue: prev.dailyRevenue + revenueDelta,
            dailyCost: prev.dailyCost + costDelta,
            cashBalance: prev.cashBalance + (revenueDelta - costDelta),
            rawMaterialTons: Math.max(20, prev.rawMaterialTons - 4),
            scrapPpm: newScrap
          };
        });

        // 6. Dynamic process-specific dilemma trigger
        const nextHour = prevHour + 1;
        if (!activeDilemma && nextHour >= 10 && nextHour <= 17) {
          const totalHoursSimulated = day * 24 + nextHour;
          const hoursSinceLast = totalHoursSimulated - lastDilemmaHourRef.current;
          const shouldTrigger = hoursSinceLast >= 3 && (
            (dilemmasTodayCountRef.current === 0 && nextHour >= 11) ||
            (dilemmasTodayCountRef.current === 1 && nextHour >= 15 && Math.random() < 0.65) ||
            Math.random() < 0.32
          );

          if (shouldTrigger) {
            const rawDilemma = getRandomDilemmaForProcess(currentProcess.id, resolvedDilemmas, machines);
            if (rawDilemma) {
              const randomizedDilemma: Dilemma = {
                ...rawDilemma,
                choices: rawDilemma.choices.map((c) => ({
                  ...c,
                  consequences: getRandomizedConsequences(c)
                }))
              };
              setActiveDilemma(randomizedDilemma);
              lastDilemmaHourRef.current = totalHoursSimulated;
              dilemmasTodayCountRef.current += 1;
              setIsSimulating(false);
              sound.playWarning();
            }
          }
        }

        return nextHour;
      });
    }, tickMs);

    return () => clearInterval(interval);
  }, [isSimulating, simSpeed, activeDilemma, isEndDayOpen, units, activeImplementations, activeTrainingPlans, maintenancePlan, currentProcess, resolvedDilemmas, machines]);

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
    dilemmasTodayCountRef.current = 0;

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
        description: `Se abre el turno matutino a las 08:00 hrs. Programación maestro de ${indicators.dailyProductionTarget.toLocaleString()} unidades.`,
        impact: `Cero accidentes mantenido (${indicators.daysWithoutIncidents + 1} días).`
      },
      ...prev
    ]);

    setIsSimulating(true);
  };

  // Resolve active dilemma
  const handleResolveDilemma = (dilemma: Dilemma, choice: DilemmaChoice) => {
    const { consequences } = choice;

    // Update cash balance & KPIs with randomized results
    setIndicators((prev) => {
      let newOee = prev.oee;
      let newOtif = prev.otif;
      let newAvailability = prev.availability;
      let newPerformance = prev.performance;
      let newQuality = prev.qualityRate;
      let newScrap = prev.scrapPpm;
      let newLead = prev.leadTimeHours;
      let newNps = prev.customerNps;

      if (consequences.kpiEffects?.oee) newOee = Math.min(99, Math.max(40, Number((newOee + consequences.kpiEffects.oee).toFixed(1))));
      if (consequences.kpiEffects?.otif) newOtif = Math.min(100, Math.max(40, Number((newOtif + consequences.kpiEffects.otif).toFixed(1))));
      if (consequences.kpiEffects?.availability) newAvailability = Math.min(100, Math.max(40, Number((newAvailability + consequences.kpiEffects.availability).toFixed(1))));
      if (consequences.kpiEffects?.performance) newPerformance = Math.min(100, Math.max(40, Number((newPerformance + consequences.kpiEffects.performance).toFixed(1))));
      if (consequences.kpiEffects?.qualityRate) newQuality = Math.min(100, Math.max(40, Number((newQuality + consequences.kpiEffects.qualityRate).toFixed(1))));
      if (consequences.kpiEffects?.defects) newScrap = Math.max(40, newScrap + consequences.kpiEffects.defects);
      if (consequences.kpiEffects?.scrapPpm) newScrap = Math.max(40, newScrap + consequences.kpiEffects.scrapPpm);
      if (consequences.kpiEffects?.leadTimeHours) newLead = Math.max(0.8, Number((newLead + consequences.kpiEffects.leadTimeHours).toFixed(1)));
      if (consequences.kpiEffects?.safety) newNps = Math.min(100, Math.max(-50, newNps + consequences.kpiEffects.safety));

      return {
        ...prev,
        cashBalance: prev.cashBalance + consequences.cashChange,
        oee: newOee,
        otif: newOtif,
        availability: newAvailability,
        performance: newPerformance,
        qualityRate: newQuality,
        scrapPpm: newScrap,
        leadTimeHours: newLead,
        customerNps: newNps
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

    // Update unit health if affected by choice
    if (consequences.unitHealthChanges) {
      setUnits((prev) =>
        prev.map((u) => {
          const delta = consequences.unitHealthChanges![u.id];
          if (delta) {
            return {
              ...u,
              health: Math.min(100, Math.max(15, u.health + delta))
            };
          }
          return u;
        })
      );
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
        title: `Decisión Operativa: ${dilemma.title}`,
        description: `Opción adoptada: "${choice.text}" (${choice.methodologyNote}).`,
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
      setMachines(PROCESS_MACHINES[currentProcess.id] || INITIAL_MACHINES);
      dilemmasTodayCountRef.current = 0;
      lastDilemmaHourRef.current = -99;
      setActiveImplementations([]);
      setActiveTrainingPlans([]);
      setMaintenancePlan(INITIAL_MAINTENANCE_PLAN);
      setResolvedDilemmas([]);
      setLogs([]);
      setActiveDilemma(null);
      setGameMode('CAREER');
      setCurrentTab('plant');
      setIsSimulating(true);
      sound.playShiftStart();
    }
  };

  // Methodology Implementation Handler
  const handleImplementMethodology = (
    methodology: MethodologyDefinition,
    scope: MethodologyScope,
    targetId: string,
    targetName: string
  ) => {
    const newImpl: ActiveImplementation = {
      id: `impl_${Date.now()}_${methodology.id}`,
      methodologyId: methodology.id,
      scopeType: scope,
      targetId,
      targetName,
      implementedDay: day,
      implementedHour: hour,
      cyclesActive: 0,
      status: 'INICIANDO',
      statusNote: 'Fase de lanzamiento y mapeo inicial en Gemba. Sensibilización de operarios y jefatura.'
    };

    setActiveImplementations((prev) => [newImpl, ...prev]);

    setLogs((prev) => [
      {
        day,
        hour,
        type: 'METHODOLOGY',
        title: `Implementación: ${methodology.name}`,
        description: `Se dio la orden de desplegar ${methodology.id} en ${targetName}.`,
        impact: `Inicia curva de aprendizaje. Impacto medible tras ciclos operativos posteriores.`
      },
      ...prev
    ]);
  };

  // Training Plan Creation Handler
  const handleCreateTrainingPlan = (
    planData: Omit<ActiveTrainingPlan, 'id' | 'progressHours' | 'status' | 'dayStarted' | 'hourStarted'>
  ) => {
    if (indicators.cashBalance < planData.totalCost) {
      sound.playWarning();
      return;
    }

    const newPlan: ActiveTrainingPlan = {
      id: `train_${Date.now()}_${planData.programId}`,
      ...planData,
      progressHours: 0,
      status: 'EN_CURSO',
      dayStarted: day,
      hourStarted: hour
    };

    setActiveTrainingPlans((prev) => [newPlan, ...prev]);

    setIndicators((prev) => ({
      ...prev,
      cashBalance: prev.cashBalance - planData.totalCost
    }));

    setLogs((prev) => [
      {
        day,
        hour,
        type: 'TRAINING',
        title: `Plan de Capacitación Aprobado: ${planData.title}`,
        description: `Inversión de $${planData.totalCost.toLocaleString()} para formar a ${planData.workersCount} personas (${planData.targetAudience}).`,
        impact: `Duración: ${planData.totalHours} hrs formativas. Desarrollo de competencias en Gemba.`
      },
      ...prev
    ]);
  };

  // Maintenance Strategy Change Handler
  const handleUpdateMaintenanceStrategy = (strategy: MaintenanceStrategy) => {
    sound.playClick();
    let name = '';
    let desc = '';
    let mtbfDelta = 0;
    let mttrDelta = 0;

    switch (strategy) {
      case 'PREDICTIVO_CONDICION':
        name = 'Mantenimiento Predictivo por Condición';
        desc = 'Monitoreo en tiempo real de temperatura, vibraciones y análisis termográfico de componentes rotativos.';
        mtbfDelta = 25;
        mttrDelta = -0.5;
        break;
      case 'TPM_AUTONOMO':
        name = 'TPM Integrado (Mantenimiento Autónomo por Operadores)';
        desc = 'Operadores capacitados ejecutan rutinas de inspección, ajuste y lubricación diaria en Gemba.';
        mtbfDelta = 20;
        mttrDelta = -0.3;
        break;
      case 'RCM_CONFIABILIDAD':
        name = 'Mantenimiento Centrado en Confiabilidad (RCM)';
        desc = 'Focalización estricta en modos de falla y efectos (FMEA) sobre activos de criticidad ALTA y CRITICA.';
        mtbfDelta = 30;
        mttrDelta = -0.2;
        break;
      case 'REACTIVO':
        name = 'Mantenimiento Reactivo (Correctivo Puro)';
        desc = 'Reparaciones solo tras producirse rotura o detención no programada. Menor costo inicial, alto riesgo.';
        mtbfDelta = -35;
        mttrDelta = +1.5;
        break;
      case 'PREVENTIVO_SISTEMATICO':
      default:
        name = 'Mantenimiento Preventivo Sistemático por Horas';
        desc = 'Intervenciones programadas fijas cada cierto número de horas de operación.';
        mtbfDelta = 0;
        mttrDelta = 0;
        break;
    }

    setMaintenancePlan((prev) => ({
      ...prev,
      strategy,
      strategyName: name,
      strategyDescription: desc,
      mtbfHours: Math.max(80, prev.mtbfHours + mtbfDelta),
      mttrHours: Math.max(1.5, Math.min(6.0, prev.mttrHours + mttrDelta))
    }));

    setLogs((prev) => [
      {
        day,
        hour,
        type: 'MAINTENANCE',
        title: `Cambio de Estrategia de Mantenimiento: ${name}`,
        description: desc,
        impact: `MTBF proyectado: ${Math.max(80, maintenancePlan.mtbfHours + mtbfDelta)}h. Política operacional actualizada.`
      },
      ...prev
    ]);
  };

  // Machine Overhaul Handler
  const handleTriggerOverhaul = (machineId: string) => {
    const cost = 1800;
    if (indicators.cashBalance < cost) {
      sound.playWarning();
      return;
    }

    const machine = machines.find((m) => m.id === machineId);
    if (!machine) return;

    sound.playPneumatic();
    setMachines((prev) =>
      prev.map((m) => {
        if (m.id === machineId) {
          return {
            ...m,
            wearPercent: 0,
            status: 'OPERANDO',
            lastMaintenanceDay: day,
            nextScheduledDay: day + maintenancePlan.inspectionFrequencyDays
          };
        }
        return m;
      })
    );

    setIndicators((prev) => ({
      ...prev,
      cashBalance: prev.cashBalance - cost
    }));

    setLogs((prev) => [
      {
        day,
        hour,
        type: 'MAINTENANCE',
        title: `Overhaul / Mantenimiento Mayor Ejecutado: ${machine.name}`,
        description: `Se renovaron rodamientos, sellos y lubricantes con costo de $${cost.toLocaleString()}.`,
        impact: `Desgaste reseteado al 0%. Confiabilidad mecánica restaurada al 100%.`
      },
      ...prev
    ]);
  };

  // Maintenance Frequency Handler
  const handleUpdateFrequency = (days: number) => {
    sound.playClick();
    setMaintenancePlan((prev) => ({
      ...prev,
      inspectionFrequencyDays: days,
      compliancePercent: days === 7 ? 88 : days === 14 ? 78 : 65
    }));
  };

  // Spare Parts Policy Handler
  const handleToggleSparePolicy = (policy: 'STOCK_PAÑOL' | 'JUST_IN_TIME') => {
    sound.playClick();
    setMaintenancePlan((prev) => ({
      ...prev,
      sparePartsPolicy: policy,
      sparePartsStockCount: policy === 'STOCK_PAÑOL' ? 48 : 8
    }));
  };

  // Toggle Autonomous Routine Handler
  const handleToggleAutonomousRoutine = () => {
    sound.playClick();
    setMaintenancePlan((prev) => ({
      ...prev,
      autonomousMaintenanceActive: !prev.autonomousMaintenanceActive
    }));
  };

  // Install Predictive Sensors Handler
  const handleInstallSensors = () => {
    const cost = 3500;
    if (indicators.cashBalance < cost) {
      sound.playWarning();
      return;
    }
    sound.playSuccess();
    setMaintenancePlan((prev) => ({
      ...prev,
      predictiveSensorsActive: true
    }));
    setMachines((prev) =>
      prev.map((m) => ({
        ...m,
        installedSensors: true
      }))
    );
    setIndicators((prev) => ({
      ...prev,
      cashBalance: prev.cashBalance - cost
    }));
    setLogs((prev) => [
      {
        day,
        hour,
        type: 'MAINTENANCE',
        title: `Instalación de Sensores IoT & Análisis Térmico`,
        description: `Red de sensores de vibración y termografía instalada en las 12 máquinas críticas.`,
        impact: `Monitoreo en tiempo real. Reducción de tasa de desgaste y alertas tempranas de falla.`
      },
      ...prev
    ]);
  };

  // Role Tactical Action Handler (Impacts actor's KPIs and triggers cross-impacts on other departments)
  const handleExecuteRoleAction = (actionId: string, cost: number, label: string) => {
    if (indicators.cashBalance < cost) {
      sound.playWarning();
      return;
    }

    sound.playSuccess();
    setIndicators((prev) => ({
      ...prev,
      cashBalance: prev.cashBalance - cost
    }));

    let actionTitle = label;
    let actionDesc = '';
    let actionImpact = '';

    switch (actionId) {
      // GERENTE DE PLANTA
      case 'CONVOCAR_SOP':
        setIndicators((prev) => ({
          ...prev,
          boardApproval: Math.min(100, prev.boardApproval + 6),
          plantMorale: Math.min(100, prev.plantMorale + 5),
          otif: Math.min(100, Number((prev.otif + 1.5).toFixed(1)))
        }));
        actionDesc = 'Alineación de ventas, finanzas y operaciones para reprogramar demanda con capacidad real.';
        actionImpact = 'Aprobación del Directorio +6%, Moral +5%, OTIF +1.5%. Todos los departamentos alineados.';
        break;

      case 'FONDO_EMERGENCIA':
        setIndicators((prev) => ({
          ...prev,
          availability: Math.min(100, Number((prev.availability + 4.5).toFixed(1))),
          boardApproval: Math.max(50, prev.boardApproval - 4)
        }));
        setMachines((prev) =>
          prev.map((m) => ({
            ...m,
            wearPercent: Math.max(0, m.wearPercent - 15)
          }))
        );
        actionDesc = 'Inyección de capital de contingencia para repuestos y recursos críticos de planta.';
        actionImpact = 'Disponibilidad +4.5%, Desgaste mecánico reducido en -15%. Costo directo asumido.';
        break;

      // JEFE DE PRODUCCIÓN
      case 'SOBRETIEMPO_LINEA':
        setIndicators((prev) => ({
          ...prev,
          unitsProducedToday: prev.unitsProducedToday + 220,
          performance: Math.min(100, Number((prev.performance + 3.5).toFixed(1)))
        }));
        setUnits((prev) =>
          prev.map((u) => u.id === 'proceso' ? { ...u, stressLevel: Math.min(100, u.stressLevel + 16) } : u)
        );
        setMachines((prev) =>
          prev.map((m) => ({ ...m, wearPercent: Math.min(100, m.wearPercent + 8) }))
        );
        actionDesc = 'Se añadieron horas extra al turno de línea pagando sobretiempo a los operarios.';
        actionImpact = '+220 unidades producidas hoy. ⚠️ IMPACTO CRUZADO: Estrés de operarios +16% y desgaste de maquinaria +8% en Mantenimiento.';
        break;

      case 'ACELERAR_CADENCIA':
        setIndicators((prev) => ({
          ...prev,
          performance: Math.min(100, Number((prev.performance + 6.0).toFixed(1))),
          scrapPpm: prev.scrapPpm + 40,
          qualityRate: Math.max(85, Number((prev.qualityRate - 1.2).toFixed(1)))
        }));
        actionDesc = 'Aumento de RPM en motores y transportadores para recuperar retrasos de producción.';
        actionImpact = 'Rendimiento P +6%. ⚠️ IMPACTO CRUZADO: Desajuste por vibración eleva Scrap a +40 PPM y reduce Calidad -1.2%.';
        break;

      // JEFE DE CALIDAD
      case 'MUESTREO_INTENSIVO':
        setIndicators((prev) => ({
          ...prev,
          qualityRate: Math.min(100, Number((prev.qualityRate + 2.0).toFixed(1))),
          scrapPpm: Math.max(40, prev.scrapPpm - 65),
          leadTimeHours: Number((prev.leadTimeHours + 1.2).toFixed(1)),
          otif: Math.max(60, Number((prev.otif - 2.5).toFixed(1)))
        }));
        actionDesc = 'Inspección microbiológica y dimensional exhaustiva de los últimos lotes producidos.';
        actionImpact = 'Calidad +2.0%, Scrap reducido en -65 PPM. ⚠️ IMPACTO CRUZADO: Retención de pallets retrasa camiones (Lead Time +1.2h, OTIF -2.5%).';
        break;

      case 'CALIBRAR_SENSORES':
        setIndicators((prev) => ({
          ...prev,
          qualityRate: Math.min(100, Number((prev.qualityRate + 1.4).toFixed(1))),
          scrapPpm: Math.max(40, prev.scrapPpm - 35)
        }));
        setUnits((prev) =>
          prev.map((u) => u.id === 'calidad' ? { ...u, health: Math.min(100, u.health + 10) } : u)
        );
        actionDesc = 'Ajuste metrológico y calibración de celdas de carga y visión artificial.';
        actionImpact = 'Calidad +1.4%, defectos prevenidos. Fiabilidad de calibración en laboratorio al 100%.';
        break;

      // JEFE DE MANTENIMIENTO
      case 'LUBRICACION_EXPRESS':
        setMachines((prev) =>
          prev.map((m) => ({
            ...m,
            wearPercent: Math.max(0, m.wearPercent - 18)
          }))
        );
        setMaintenancePlan((prev) => ({
          ...prev,
          mtbfHours: prev.mtbfHours + 12
        }));
        setIndicators((prev) => ({
          ...prev,
          availability: Math.min(100, Number((prev.availability + 3.0).toFixed(1)))
        }));
        actionDesc = 'Ruta urgente con cámara infrarroja y engrase de rodamientos de alta fricción.';
        actionImpact = 'Desgaste reducido en -18% en todas las máquinas. MTBF +12h, Disponibilidad +3.0%.';
        break;

      case 'REPOSICION_REPUESTOS':
        setMaintenancePlan((prev) => ({
          ...prev,
          sparePartsStockCount: prev.sparePartsStockCount + 20,
          mttrHours: Math.max(1.2, Number((prev.mttrHours - 0.4).toFixed(1)))
        }));
        actionDesc = 'Adquisición de rodamientos SKF, sellos mecánicos y válvulas neumáticas para pañol.';
        actionImpact = 'Stock pañol +20 repuestos. MTTR reducido en -0.4h ante cualquier parada.';
        break;

      // JEFE DE ABASTECIMIENTO
      case 'FLETE_EXPRESS_MP':
        setIndicators((prev) => ({
          ...prev,
          rawMaterialTons: prev.rawMaterialTons + 18,
          plantMorale: Math.min(100, prev.plantMorale + 3)
        }));
        actionDesc = 'Flete aéreo express de materia prima crítica para asegurar alimentación continua.';
        actionImpact = '+18 toneladas de insumo en silos. Se anula el riesgo inminente de parada por falta de MP.';
        break;

      case 'NEGOCIAR_VOLUMEN':
        setIndicators((prev) => ({
          ...prev,
          rawMaterialTons: prev.rawMaterialTons + 10,
          boardApproval: Math.min(100, prev.boardApproval + 4)
        }));
        setUnits((prev) =>
          prev.map((u) => u.id === 'recepcion' ? { ...u, efficiency: Math.min(100, u.efficiency + 6) } : u)
        );
        actionDesc = 'Cierre de contrato con proveedor calificado con tarifa preferencial por volumen.';
        actionImpact = '+10 toneladas aseguradas, eficiencia de recepción +6%, visto bueno del Directorio.';
        break;

      // JEFE DE DESPACHO
      case 'CONTRATAR_FLOTA_AUXILIAR':
        setIndicators((prev) => ({
          ...prev,
          otif: Math.min(100, Number((prev.otif + 4.5).toFixed(1))),
          leadTimeHours: Math.max(1.0, Number((prev.leadTimeHours - 2.5).toFixed(1))),
          customerNps: Math.min(100, prev.customerNps + 10)
        }));
        actionDesc = 'Arriendo de camiones frigoríficos / ramplas adicionales para descongestionar andenes.';
        actionImpact = 'OTIF +4.5%, Lead Time -2.5h, NPS Clientes +10 pts. Descongestión inmediata.';
        break;

      case 'REPROGRAMAR_VENTANA':
        setIndicators((prev) => ({
          ...prev,
          otif: Math.min(100, Number((prev.otif + 2.0).toFixed(1))),
          customerNps: Math.min(100, prev.customerNps + 5)
        }));
        actionDesc = 'Acuerdo con centro de distribución para extender ventana de entrega sin penalización.';
        actionImpact = 'OTIF +2.0%, multas comerciales evitadas, relación con cliente protegida.';
        break;

      default:
        actionDesc = 'Acción departamental ejecutada.';
        actionImpact = 'Parámetros del área actualizados.';
        break;
    }

    setLogs((prev) => [
      {
        day,
        hour,
        type: 'TACTICAL',
        title: `Decisión de ${getRoleById(currentRole).name}: ${actionTitle}`,
        description: actionDesc,
        impact: actionImpact
      },
      ...prev
    ]);
  };

  const activeDilemmasCount = activeDilemma ? 1 : 0;

  // 1. Arcade Title Screen with Piping, Machinery & Fire Sparks
  if (showTitleScreen) {
    return (
      <div className={`theme-${theme}`}>
        <TitleScreen 
          onSelectProcess={handleSelectProcessFromTitle}
          currentTheme={theme}
          onSelectTheme={handleSelectTheme}
          onOpenThemeModal={() => setIsThemeModalOpen(true)}
          initialRole={currentRole}
        />
        <ThemeSelectorModal
          isOpen={isThemeModalOpen}
          onClose={() => setIsThemeModalOpen(false)}
          currentTheme={theme}
          onSelectTheme={handleSelectTheme}
        />
      </div>
    );
  }

  return (
    <div className={`theme-${theme} min-h-screen bg-[#0a0d12] text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-zinc-950 transition-colors duration-200`}>
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
        activeImplementationsCount={activeImplementations.length}
        activeTrainingPlansCount={activeTrainingPlans.filter((p) => p.status === 'EN_CURSO').length}
        onOpenMeeting={() => setIsMeetingOpen(true)}
        onOpenEndDay={() => generateDayEndReport()}
        onOpenBriefing={() => setIsBriefingOpen(true)}
        onOpenReport={() => {
          sound.playClick();
          setIsReportOpen(true);
        }}
        currentTheme={theme}
        onOpenThemeSelector={() => setIsThemeModalOpen(true)}
        onBackToTitle={() => {
          setIsSimulating(false);
          setShowTitleScreen(true);
        }}
        currentRole={currentRole}
        onOpenRoleSelector={() => setIsRoleModalOpen(true)}
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
            {/* Operational Role Cockpit (Exclusive area attributes, KPIs & Systemic Decisions) */}
            <RoleCockpit
              currentRole={currentRole}
              onOpenRoleSelector={() => setIsRoleModalOpen(true)}
              indicators={indicators}
              units={units}
              machines={machines}
              maintenancePlan={maintenancePlan}
              hour={hour}
              onExecuteTacticalAction={handleExecuteRoleAction}
            />

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
              processConfig={currentProcess}
              machines={machines}
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
                  onClick={() => { sound.playClick(); setIsRoleModalOpen(true); }}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-amber-400/90 hover:text-amber-300 font-mono transition-colors rounded-lg hover:bg-[#1a222d] border border-transparent hover:border-[#283544] cursor-pointer"
                  title="Cambiar Cargo / Rol de Planta"
                >
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Rol:</span>
                  <span className="text-zinc-200 font-medium">{getRoleById(currentRole).name.split(' ')[0]}</span>
                </button>
                <button
                  onClick={() => { sound.playClick(); setIsBriefingOpen(true); }}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-amber-400/90 hover:text-amber-300 font-mono transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Manual de Planta</span>
                </button>
                <button
                  onClick={() => { sound.playClick(); setIsReportOpen(true); }}
                  className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-blue-900/60 to-indigo-900/60 hover:from-blue-800/80 hover:to-indigo-800/80 border border-blue-500/50 text-blue-300 hover:text-white rounded-lg text-xs font-mono font-bold transition-all cursor-pointer shadow-sm"
                  title="Solicitar informe técnico detallado y resumen ejecutivo de la planta"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span>Solicitar Informe</span>
                </button>
                <button
                  onClick={() => { sound.playClick(); setIsThemeModalOpen(true); }}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-zinc-400 hover:text-amber-300 font-mono transition-colors cursor-pointer rounded-lg hover:bg-[#1a222d] border border-transparent hover:border-[#283544]"
                  title="Cambiar Estilo Visual de la Planta"
                >
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Estilo:</span>
                  <span className="text-zinc-200 capitalize font-medium">
                    {theme === 'light' ? 'Claro' : theme === 'blueprint' ? 'Blueprint' : theme === 'amber' ? 'Ámbar' : 'Oscuro'}
                  </span>
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

        {/* Tab: Metodologías y Herramientas Industriales */}
        {currentTab === 'methodologies' && (
          <MethodologiesManager
            units={units}
            machines={machines}
            activeImplementations={activeImplementations}
            onImplementMethodology={handleImplementMethodology}
            preselectedUnitId={preselectedMethodologyUnitId}
            preselectedMachineId={preselectedMethodologyMachineId}
          />
        )}

        {/* Tab: Mantenimiento y Confiabilidad de Activos */}
        {currentTab === 'maintenance' && (
          <MaintenanceManager
            maintenancePlan={maintenancePlan}
            machines={machines}
            units={units}
            cashBalance={indicators.cashBalance}
            onUpdateStrategy={handleUpdateMaintenanceStrategy}
            onTriggerOverhaul={handleTriggerOverhaul}
            onUpdateFrequency={handleUpdateFrequency}
            onToggleSparePolicy={handleToggleSparePolicy}
            onToggleAutonomousRoutine={handleToggleAutonomousRoutine}
            onInstallSensors={handleInstallSensors}
            onOpenMethodologyTarget={(machineId) => {
              setPreselectedMethodologyMachineId(machineId);
              setPreselectedMethodologyUnitId(null);
              setCurrentTab('methodologies');
            }}
          />
        )}

        {/* Tab: Planes de Capacitación */}
        {currentTab === 'training' && (
          <TrainingManager
            activePlans={activeTrainingPlans}
            units={units}
            cashBalance={indicators.cashBalance}
            onCreatePlan={handleCreateTrainingPlan}
            preselectedUnitId={preselectedTrainingUnitId}
          />
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
          onApplyMethodology={(unitId) => {
            setSelectedUnit(null);
            setPreselectedMethodologyUnitId(unitId);
            setPreselectedMethodologyMachineId(null);
            setCurrentTab('methodologies');
          }}
          onCreateTraining={(unitId) => {
            setSelectedUnit(null);
            setPreselectedTrainingUnitId(unitId);
            setCurrentTab('training');
          }}
          onViewMaintenance={() => {
            setSelectedUnit(null);
            setCurrentTab('maintenance');
          }}
          machines={machines}
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

      {isReportOpen && (
        <PlantReportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          day={day}
          hour={hour}
          processConfig={currentProcess}
          indicators={indicators}
          units={units}
          characters={characters}
          engineer={engineer}
          machines={machines}
          activeImplementations={activeImplementations}
          activeTrainingPlans={activeTrainingPlans}
          maintenancePlan={maintenancePlan}
          logs={logs}
        />
      )}

      {isThemeModalOpen && (
        <ThemeSelectorModal
          isOpen={isThemeModalOpen}
          onClose={() => setIsThemeModalOpen(false)}
          currentTheme={theme}
          onSelectTheme={handleSelectTheme}
        />
      )}

      {isRoleModalOpen && (
        <RoleSelectorModal
          isOpen={isRoleModalOpen}
          onClose={() => setIsRoleModalOpen(false)}
          currentRole={currentRole}
          onSelectRole={(newRole) => {
            handleSelectRole(newRole);
            setIsRoleModalOpen(false);
            sound.playSuccess();
          }}
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
