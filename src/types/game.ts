// Types for Industrial Engineer Plant Operations RPG

export type VisualTheme = 'dark' | 'light' | 'blueprint' | 'amber';

export interface ThemeOption {
  id: VisualTheme;
  name: string;
  tagline: string;
  accent: string;
  badge: string;
}

// ==========================================
// ROLES OPERATIVOS SELECCIONABLES DE PLANTA
// ==========================================
export type PlantRoleId =
  | 'GERENTE_PLANTA'
  | 'JEFE_PRODUCCION'
  | 'JEFE_CALIDAD'
  | 'JEFE_MANTENIMIENTO'
  | 'JEFE_ABASTECIMIENTO'
  | 'JEFE_DESPACHO';

export interface RolePrimaryKpi {
  label: string;
  key: string;
  unit: string;
  targetDesc: string;
}

export interface RoleTacticalAction {
  id: string;
  label: string;
  description: string;
  cost: number;
  cooldownHours?: number;
}

export interface RoleDefinition {
  id: PlantRoleId;
  name: string;
  department: string;
  characterName: string;
  avatarInitials: string;
  avatarColor: string;
  tagline: string;
  mission: string;
  primaryKpis: RolePrimaryKpi[];
  dilemmaPressure: string;
  crossImpactWarning: string;
  tacticalActions: RoleTacticalAction[];
}

export type UnitId =
  | 'recepcion'
  | 'proceso'
  | 'calidad'
  | 'mantenimiento'
  | 'producto_terminado'
  | 'despacho'
  | 'logistica'
  | 'marketing'
  | 'post_venta';

export type MachineStatus = 'OPERANDO' | 'CUELLO_BOTELLA' | 'MANTENIMIENTO' | 'DETENIDA' | 'EN_ALERTA';

export type ProcessTypeId = 'ALIMENTOS_CONTINUOS' | 'ENVASES_PRECISION' | 'EMBOTELLADO' | 'METALMECANICA';

export interface ProcessConfig {
  id: ProcessTypeId;
  title: string;
  subtitle: string;
  tagline: string;
  plantName: string;
  productDescription: string;
  rawMaterialName: string;
  defaultTargetUnits: number;
  nominalCapacity: string;
  unitPrice: number;
  initialCash: number;
  bottleneckStation: string;
  accentColor: string;
  specialChallenge: string;
}

export interface PlantUnit {
  id: UnitId;
  name: string;
  shortName: string;
  chiefName: string;
  chiefTitle: string;
  characterId: string;
  description: string;
  status: MachineStatus;
  health: number; // 0 - 100%
  efficiency: number; // 0 - 100%
  stressLevel: number; // 0 - 100%
  activeWorkers: number;
  tacticalToggles: {
    overtime: boolean; // Turno extra / horas extra
    preventiveCheck: boolean; // Chequeo preventivo
    highPriority: boolean; // Enfoque de máxima prioridad
    strictStandard: boolean; // Criterio riguroso
  };
  metrics: Record<string, { label: string; value: number | string; unit?: string; ideal?: string }>;
}

export interface Character {
  id: string;
  unitId: UnitId;
  name: string;
  title: string;
  role: string;
  avatarColor: string;
  initials: string;
  personality: string;
  methodology: string; // e.g. "Lean / 5S", "TPM & Confiabilidad", "Six Sigma Black Belt", "TOC & Cuellos de Botella"
  morale: number; // 0 - 100
  stress: number; // 0 - 100
  trustInManager: number; // 0 - 100
  dialogueGreeting: string;
  currentAdvice: string;
}

export interface DilemmaChoice {
  id: string;
  text: string;
  methodologyNote: string; // Engineering rationale e.g. "Aplicar Teoría de Restricciones (TOC)"
  npcOpinions?: Partial<Record<string, string>>; // Opinions from characters when consulted: characterId -> opinion
  consequences: {
    cashChange: number; // +/- dinero en caja ($)
    moraleChanges?: Partial<Record<UnitId, number>>;
    kpiEffects?: {
      oee?: number;
      availability?: number;
      performance?: number;
      qualityRate?: number;
      otif?: number;
      defects?: number;
      scrapPpm?: number;
      customerNps?: number;
      inventory?: number;
      safety?: number;
      leadTimeHours?: number;
    };
    unitHealthChanges?: Partial<Record<UnitId, number>>;
    summaryMessage: string;
  };
}

export interface Dilemma {
  id: string;
  dayTrigger?: number; // Optional day trigger
  hourTrigger?: number; // 8 - 18
  processTypeId?: ProcessTypeId | 'ALL'; // Specific process or ALL
  unitId: UnitId;
  characterId: string;
  title: string;
  scenarioDescription: string;
  urgency: 'ALTA' | 'CRITICA' | 'MODERADA';
  choices: DilemmaChoice[];
}

export interface PlantIndicators {
  // OEE Components
  oee: number; // Overall Equipment Effectiveness (Availability * Performance * Quality)
  availability: number; // Disponibilidad (%)
  performance: number; // Rendimiento (%)
  qualityRate: number; // Calidad (%)
  
  // Operational
  wip: number; // Work in Progress (unidades en tránsito)
  leadTimeHours: number; // Little's Law WIP / Throughput
  bottleneckUnit: UnitId;
  dailyProductionTarget: number;
  unitsProducedToday: number;
  scrapPpm: number; // Partes por millón defectuosas
  otif: number; // On-Time In-Full (%)
  
  // Financial & Inventory
  cashBalance: number; // Caja disponible ($ CLP o USD)
  dailyRevenue: number;
  dailyCost: number;
  inventoryValue: number;
  finishedGoodsStock: number;
  rawMaterialTons: number;
  
  // Safety & Morale
  daysWithoutIncidents: number;
  plantMorale: number; // 0 - 100
  boardApproval: number; // 0 - 100 (Directorio / Accionistas)
  customerNps: number; // Net Promoter Score (-100 a +100)
}

export interface EngineerProfile {
  name: string;
  title: string;
  level: 'Ingeniero de Operaciones' | 'Jefe de Planta' | 'Gerente de Operaciones' | 'Director de Operaciones Global';
  careerPoints: number;
  decisionsMadeCount: number;
  specialty: 'Lean Manufacturing' | 'Six Sigma & Calidad' | 'Cadena de Suministro 4.0' | 'Mantenimiento & Confiabilidad';
  certifications: string[];
}

export interface DayLogEntry {
  day: number;
  hour: number;
  type: 'DILEMMA' | 'TACTICAL' | 'INCIDENT' | 'ACHIEVEMENT' | 'METHODOLOGY' | 'MAINTENANCE' | 'TRAINING' | 'TOC_BOTTLENECK';
  title: string;
  description: string;
  impact: string;
}

// ==========================================
// TEORÍA DE RESTRICCIONES (TOC) & CUELLOS DE BOTELLA
// ==========================================

export type LinePacingMode = 
  | 'MAXIMA_VELOCIDAD' 
  | 'SUBORDINADA_CUELLO_BOTELLA' 
  | 'REORDENAMIENTO_LINEAS';

export interface BottleneckTOCState {
  pacingMode: LinePacingMode;
  targetMachineId: string;
  targetMachineName: string;
  nominalBottleneckCapacity: number; // u/h del equipo restrictivo
  effectiveLineCadence: number; // u/h reales sincronizadas
  improvementsAppliedCount: number;
  replacementProjectExecuted: boolean;
  dailyOperationalCostIncurred: number;
  wipBufferUnits: number;
  lineRebalanced: boolean;
}

export interface DayReport {
  day: number;
  unitsProduced: number;
  targetUnits: number;
  oee: number;
  otif: number;
  revenue: number;
  cost: number;
  ebitda: number;
  defectsCount: number;
  accidentsCount: number;
  boardComments: string;
  chiefFeedback: { characterId: string; comment: string }[];
}

export type GameMode = 'CAREER' | 'SANDBOX' | 'CASE_STUDY';

export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  difficulty: 'Intermedio' | 'Avanzado' | 'Experto';
  description: string;
  targetObjective: string;
  initialIndicators: Partial<PlantIndicators>;
}

// ==========================================
// METODOLOGÍAS Y HERRAMIENTAS INDUSTRIALES
// ==========================================

export type MethodologyId =
  | '5S'
  | 'TPM'
  | 'JIT'
  | 'LEAN'
  | 'SOP'
  | 'JI'
  | 'SMED'
  | 'KAIZEN'
  | 'KANBAN'
  | 'POKA_YOKE'
  | 'SIX_SIGMA'
  | 'VSM';

export type MethodologyScope = 'PLANT' | 'UNIT' | 'MACHINE';

export interface MethodologyDefinition {
  id: MethodologyId;
  name: string;
  tagline: string;
  origin: string; // Fundamento histórico / creadores
  category: 'Estandarización & Calidad' | 'Mantenimiento & Confiabilidad' | 'Flujo & Cuellos de Botella' | 'Productividad & Personas';
  definition: string;
  industrialUses: string[];
  prerequisites: string;
  color: string;
}

export type ImplementationStatus = 'INICIANDO' | 'CURVA_APRENDIZAJE' | 'EN_MADURACION' | 'ESTABILIZADA';

export interface ActiveImplementation {
  id: string;
  methodologyId: MethodologyId;
  scopeType: MethodologyScope;
  targetId: string; // 'all' | UnitId | MachineId
  targetName: string;
  implementedDay: number;
  implementedHour: number;
  cyclesActive: number; // Horas / ciclos de simulación acumulados
  status: ImplementationStatus;
  statusNote: string;
}

// ==========================================
// MAQUINARIA Y ACTIVOS CRÍTICOS DE PLANTA
// ==========================================

export interface MachineDefinition {
  id: string;
  name: string;
  unitId: UnitId;
  unitName: string;
  type: string;
  criticality: 'CRITICA' | 'ALTA' | 'MEDIA';
  wearPercent: number; // 0 - 100% de desgaste acumulado
  operatingHours: number;
  status: MachineStatus;
  lastMaintenanceDay: number;
  nextScheduledDay: number;
  installedSensors: boolean;
  sparePartsAvailable: boolean;
  description: string;
  nominalCapacity: string;
}

// ==========================================
// PLANES DE CAPACITACIÓN LABORAL
// ==========================================

export type TrainingProgramId =
  | 'JI_WORK_INSTRUCTION'
  | 'SAFETY_LOTO'
  | 'AUTONOMOUS_MAINTENANCE_L1'
  | 'SPC_METROLOGY'
  | 'LEAN_5S_VISUAL'
  | 'MUDA_KAIZEN'
  | 'FORKLIFT_LOGISTICS'
  | 'SMED_SETUP';

export interface TrainingProgramDefinition {
  id: TrainingProgramId;
  title: string;
  shortDesc: string;
  recommendedAudience: string;
  competencyTarget: string;
  durationHours: number;
  costPerWorker: number;
  syllabus: string[];
}

export interface ActiveTrainingPlan {
  id: string;
  programId: TrainingProgramId;
  title: string;
  targetAudience: string;
  unitId?: UnitId;
  workersCount: number;
  totalCost: number;
  progressHours: number;
  totalHours: number;
  status: 'EN_CURSO' | 'COMPLETADO';
  dayStarted: number;
  hourStarted: number;
}

// ==========================================
// GESTIÓN Y PLAN DE MANTENIMIENTO
// ==========================================

export type MaintenanceStrategy =
  | 'REACTIVO'
  | 'PREVENTIVO_SISTEMATICO'
  | 'PREDICTIVO_CONDICION'
  | 'RCM_CONFIABILIDAD'
  | 'TPM_AUTONOMO';

export interface MaintenancePlanState {
  strategy: MaintenanceStrategy;
  strategyName: string;
  strategyDescription: string;
  inspectionFrequencyDays: number; // 7, 14, 30
  sparePartsPolicy: 'STOCK_PAÑOL' | 'JUST_IN_TIME';
  autonomousMaintenanceActive: boolean;
  predictiveSensorsActive: boolean;
  compliancePercent: number; // % cumplimiento preventivo
  mtbfHours: number; // Mean Time Between Failures
  mttrHours: number; // Mean Time To Repair
  sparePartsStockCount: number; // Unidades de repuestos en bodega
  criticalAssetsHealthAverage: number;
  activeWorkOrdersCount: number;
}

