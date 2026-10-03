// Types for Industrial Civil Engineer Plant Operations RPG

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
  dayTrigger: number; // Day on which this occurs or trigger condition
  hourTrigger?: number; // 8 - 18
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
  type: 'DILEMMA' | 'TACTICAL' | 'INCIDENT' | 'ACHIEVEMENT';
  title: string;
  description: string;
  impact: string;
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
