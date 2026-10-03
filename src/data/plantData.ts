import { PlantUnit, Character, PlantIndicators, EngineerProfile, CaseStudy } from '../types/game';

export const INITIAL_CHARACTERS: Record<string, Character> = {
  roberto: {
    id: 'roberto',
    unitId: 'recepcion',
    name: 'Don Roberto Fuentes',
    title: 'Jefe de Abastecimiento y Recepción',
    role: 'Control de Descarga y Materia Prima',
    avatarColor: 'bg-amber-600',
    initials: 'RF',
    personality: 'Pragmático, veterano de patio, prefiere stock de seguridad a quedarse sin material.',
    methodology: 'Gestión de Proveedores & Cross-Docking',
    morale: 82,
    stress: 35,
    trustInManager: 78,
    dialogueGreeting: '¡Hola, colega! Los camiones están llegando a la romana. Si no cuidamos los tiempos de descarga nos cobran sobrestadía.',
    currentAdvice: 'Debemos homologar a un segundo proveedor de resina y acero; el proveedor monopólico nos está demorando 4 días.'
  },
  camila: {
    id: 'camila',
    unitId: 'proceso',
    name: 'Ing. Camila Sepúlveda',
    title: 'Superintendente de Planta y Producción',
    role: 'Líneas de Transformación y Ensamble',
    avatarColor: 'bg-blue-600',
    initials: 'CS',
    personality: 'Dinámica, orientada a datos de piso, apasionada por el balance de línea y el flujo continuo.',
    methodology: 'Lean Manufacturing & Teoría de Restricciones (TOC)',
    morale: 88,
    stress: 48,
    trustInManager: 85,
    dialogueGreeting: '¡Buenos días, Gerente! La línea 2 está marcando un tiempo de ciclo de 42 segundos frente a un Takt Time de 38. Tenemos un cuello de botella en la estampadora.',
    currentAdvice: 'Si aplicamos SMED en el cambio de matriz, recuperamos 45 minutos por turno sin gastar en horas extras.'
  },
  marcela: {
    id: 'marcela',
    unitId: 'calidad',
    name: 'Dra. Marcela Morales',
    title: 'Jefa de Aseguramiento de Calidad',
    role: 'Metrología, Ensayos y Certificación ISO',
    avatarColor: 'bg-emerald-600',
    initials: 'MM',
    personality: 'Inflexible con las tolerancias, científica, no permite que salga un lote fuera de especificación.',
    methodology: 'Six Sigma (DMAIC) & Control Estadístico (SPC)',
    morale: 90,
    stress: 30,
    trustInManager: 80,
    dialogueGreeting: 'Estimado Gerente, la variación dimensional del último lote subió a 2.4 sigmas. No podemos liberar producto a ciegas.',
    currentAdvice: 'El costo de la no conformidad externa es 10 veces mayor que segregar a tiempo en el laboratorio.'
  },
  hernan: {
    id: 'hernan',
    unitId: 'mantenimiento',
    name: 'Hernán Valenzuela',
    title: 'Jefe de Mantenimiento y Confiabilidad',
    role: 'Equipos Críticos, TPM y Taller',
    avatarColor: 'bg-orange-600',
    initials: 'HV',
    personality: 'Analítico, prefiere el mantenimiento predictivo antes de apagar incendios con paradas no programadas.',
    methodology: 'TPM (Mantenimiento Productivo Total) & RCM',
    morale: 79,
    stress: 42,
    trustInManager: 76,
    dialogueGreeting: 'Colega, los rodamientos del motor principal del reactor presentan espectros de vibración en alta frecuencia.',
    currentAdvice: 'Hagamos la parada programada de 3 horas durante el cambio de turno en vez de arriesgar una falla catastrófica en plena producción.'
  },
  esteban: {
    id: 'esteban',
    unitId: 'producto_terminado',
    name: 'Esteban Ríos',
    title: 'Jefe de Almacén de Producto Terminado',
    role: 'Inventarios, Racks y Control FIFO',
    avatarColor: 'bg-indigo-600',
    initials: 'ER',
    personality: 'Ordenado, celoso de las ubicaciones, cuida la rotación para evitar mermas por vencimiento o daño.',
    methodology: 'Sistemas WMS, FIFO y Zonificación ABC',
    morale: 84,
    stress: 32,
    trustInManager: 82,
    dialogueGreeting: 'Buenos días. Los racks de producto terminado están al 88% de ocupación. Si no salen los despachos hoy, nos bloqueamos.',
    currentAdvice: 'Urgente coordinar con Comercial para sacar los lotes de baja rotación (C) que ocupan los andenes frontales.'
  },
  sofia: {
    id: 'sofia',
    unitId: 'despacho',
    name: 'Sofía Navarrete',
    title: 'Supervisora de Despacho y Transporte',
    role: 'Carga de Andenes y Flota de Reparto',
    avatarColor: 'bg-teal-600',
    initials: 'SN',
    personality: 'Rápida, resolutiva, vive contra el reloj de las citas de entrega en centros de distribución de clientes.',
    methodology: 'Ruteo Dinámico y SLA de Entrega (OTIF)',
    morale: 80,
    stress: 55,
    trustInManager: 84,
    dialogueGreeting: '¡Gerente! Tenemos 4 camiones esperando en andenes de despacho. Si la documentación de calidad tarda, perderemos la ventana de entrega de Falabella y Cencosud.',
    currentAdvice: 'Implementar despacho con preconteo digital en el andén nos ahorrará 25 minutos por rampla.'
  },
  felipe: {
    id: 'felipe',
    unitId: 'logistica',
    name: 'Felipe Carvallo',
    title: 'Gerente de Cadena de Suministro (Supply Chain)',
    role: 'Logística Integral y Comercio Exterior',
    avatarColor: 'bg-cyan-600',
    initials: 'FC',
    personality: 'Estratégico, mira el panorama global, obsesionado con mitigar el Efecto Látigo (Bullwhip Effect).',
    methodology: 'S&OP (Sales & Operations Planning) & SCOR Model',
    morale: 85,
    stress: 40,
    trustInManager: 88,
    dialogueGreeting: 'Hola. El flete marítimo de los insumos importados subió un 8%, pero si consolidamos compras semestrales mantenemos el costo unitario.',
    currentAdvice: 'Sincronicemos los pronósticos de Ventas con el plan maestro de producción (MPS) para bajar el inventario inmovilizado.'
  },
  rodrigo: {
    id: 'rodrigo',
    unitId: 'marketing',
    name: 'Rodrigo Larraín',
    title: 'Gerente Comercial y Marketing',
    role: 'Ventas, Promociones y Grandes Cuentas',
    avatarColor: 'bg-rose-600',
    initials: 'RL',
    personality: 'Persuasivo, ambicioso, siempre buscando cerrar ventas récord aunque ponga en jaque la capacidad fabril.',
    methodology: 'Marketing Mix & Estrategia de Pricing Dinámico',
    morale: 92,
    stress: 45,
    trustInManager: 75,
    dialogueGreeting: '¡Hola! Acabo de negociar un pedido adicional de 12.000 unidades con un gran cliente minorista. Necesito que Planta lo fabrique para este viernes sin falta.',
    currentAdvice: 'Si cumplimos esta entrega especial, capturamos el 40% del share del competidor principal.'
  },
  paulina: {
    id: 'paulina',
    unitId: 'post_venta',
    name: 'Paulina Araya',
    title: 'Jefa de Post-Venta y Servicio al Cliente',
    role: 'Garantías, Reclamos y Experiencia del Cliente (CX)',
    avatarColor: 'bg-purple-600',
    initials: 'PA',
    personality: 'Empática, orientada a la fidelización del cliente, la voz del usuario final dentro de la fábrica.',
    methodology: 'Gestión de Reclamos (8D) y Voice of Customer (VoC)',
    morale: 81,
    stress: 38,
    trustInManager: 86,
    dialogueGreeting: 'Hola, Gerente. Ayer recibimos 3 llamados de distribuidores por empaques con sellado débil que se rompieron en el transporte.',
    currentAdvice: 'Compartí con Producción y Calidad las fotografías del reclamo para activar una acción correctiva de causa raíz inmediata.'
  }
};

export const INITIAL_UNITS: PlantUnit[] = [
  {
    id: 'recepcion',
    name: 'Recepción de Materia Prima',
    shortName: 'Recepción MP',
    chiefName: 'Don Roberto Fuentes',
    chiefTitle: 'Jefe de Abastecimiento',
    characterId: 'roberto',
    description: 'Control de pesaje en romana, descarga de camiones graneleros, control de bultos y muestreo primario de insumos.',
    status: 'OPERANDO',
    health: 92,
    efficiency: 90,
    stressLevel: 35,
    activeWorkers: 6,
    tacticalToggles: {
      overtime: false,
      preventiveCheck: false,
      highPriority: false,
      strictStandard: true
    },
    metrics: {
      stockMP: { label: 'Stock MP en Silos', value: 145, unit: 'toneladas', ideal: '> 100 t' },
      camionesHoy: { label: 'Camiones Recibidos', value: 8, unit: 'camiones/día' },
      tiempoDescarga: { label: 'Tiempo Descarga', value: 38, unit: 'min', ideal: '< 45 min' },
      leadTimeProv: { label: 'Lead Time Proveedor', value: 3.2, unit: 'días' }
    }
  },
  {
    id: 'proceso',
    name: 'Proceso y Manufactura',
    shortName: 'Línea de Proceso',
    chiefName: 'Ing. Camila Sepúlveda',
    chiefTitle: 'Superintendente de Planta',
    characterId: 'camila',
    description: 'Transformación física, mezclado químico, termoformado, ensamblado robótico y empaque primario continuo.',
    status: 'OPERANDO',
    health: 86,
    efficiency: 88,
    stressLevel: 48,
    activeWorkers: 24,
    tacticalToggles: {
      overtime: false,
      preventiveCheck: true,
      highPriority: true,
      strictStandard: false
    },
    metrics: {
      taktTime: { label: 'Takt Time', value: 38, unit: 'seg/unid', ideal: '38 seg' },
      cycleTime: { label: 'Tiempo de Ciclo', value: 41, unit: 'seg/unid', ideal: '< 38 seg' },
      unidadesHora: { label: 'Tasa Producción', value: 880, unit: 'unid/hr', ideal: '950' },
      cuelloBotella: { label: 'Restricción Actual', value: 'Estampadora B' }
    }
  },
  {
    id: 'calidad',
    name: 'Aseguramiento de Calidad',
    shortName: 'Laboratorio QA',
    chiefName: 'Dra. Marcela Morales',
    chiefTitle: 'Jefa de Calidad & Six Sigma',
    characterId: 'marcela',
    description: 'Inspección en línea con visión artificial, pruebas destructivas, calibración de tolerancias y auditoría ISO 9001.',
    status: 'OPERANDO',
    health: 96,
    efficiency: 94,
    stressLevel: 30,
    activeWorkers: 5,
    tacticalToggles: {
      overtime: false,
      preventiveCheck: true,
      highPriority: false,
      strictStandard: true
    },
    metrics: {
      scrapRate: { label: 'Tasa de Defectos', value: 420, unit: 'PPM', ideal: '< 350 PPM' },
      yield: { label: 'Rendimiento (Yield)', value: 99.1, unit: '%', ideal: '> 99.5%' },
      cpk: { label: 'Índice de Capacidad Cpk', value: 1.42, unit: '', ideal: '> 1.33' },
      lotesRetenidos: { label: 'Lotes en Cuarentena', value: 1, unit: 'lotes' }
    }
  },
  {
    id: 'mantenimiento',
    name: 'Mantenimiento y Confiabilidad',
    shortName: 'Mantenimiento TPM',
    chiefName: 'Hernán Valenzuela',
    chiefTitle: 'Jefe de Mantenimiento',
    characterId: 'hernan',
    description: 'Gestión de lubricación, análisis de vibraciones en motores, calibración neumática y mantenimiento preventivo sistemático.',
    status: 'OPERANDO',
    health: 84,
    efficiency: 86,
    stressLevel: 42,
    activeWorkers: 8,
    tacticalToggles: {
      overtime: false,
      preventiveCheck: true,
      highPriority: false,
      strictStandard: false
    },
    metrics: {
      mtbf: { label: 'MTBF (Tiempo entre Fallas)', value: 168, unit: 'horas', ideal: '> 150 hrs' },
      mttr: { label: 'MTTR (Tiempo de Reparación)', value: 1.8, unit: 'horas', ideal: '< 2.0 hrs' },
      disponibilidad: { label: 'Disponibilidad Mecánica', value: 92.5, unit: '%', ideal: '> 90%' },
      repuestosCriticos: { label: 'Repuestos Clave en Pañol', value: 98, unit: '%' }
    }
  },
  {
    id: 'producto_terminado',
    name: 'Almacén de Producto Terminado',
    shortName: 'Bodega PT',
    chiefName: 'Esteban Ríos',
    chiefTitle: 'Jefe de Almacén PT',
    characterId: 'esteban',
    description: 'Paletizado automático, almacenamiento en racks verticales antisísmicos, rotación FIFO y consolidación de pedidos.',
    status: 'OPERANDO',
    health: 90,
    efficiency: 89,
    stressLevel: 32,
    activeWorkers: 7,
    tacticalToggles: {
      overtime: false,
      preventiveCheck: false,
      highPriority: false,
      strictStandard: false
    },
    metrics: {
      stockPT: { label: 'Pallets Almacenados', value: 640, unit: 'pallets', ideal: '500-750' },
      ocupacionRacks: { label: 'Ocupación de Racks', value: 85.3, unit: '%', ideal: '< 85%' },
      diasInventario: { label: 'Días de Stock (DSI)', value: 6.8, unit: 'días', ideal: '5-8 días' },
      exactitudRegistro: { label: 'Exactitud de Inventario (IRA)', value: 99.4, unit: '%' }
    }
  },
  {
    id: 'despacho',
    name: 'Despacho y Distribución',
    shortName: 'Despacho y Flota',
    chiefName: 'Sofía Navarrete',
    chiefTitle: 'Supervisora de Despacho',
    characterId: 'sofia',
    description: 'Andenes de carga con niveladores hidráulicos, verificación de guías de despacho, sellado de seguridad y salida de camiones.',
    status: 'OPERANDO',
    health: 88,
    efficiency: 91,
    stressLevel: 55,
    activeWorkers: 9,
    tacticalToggles: {
      overtime: false,
      preventiveCheck: false,
      highPriority: true,
      strictStandard: false
    },
    metrics: {
      otifHoy: { label: 'Cumplimiento OTIF', value: 94.2, unit: '%', ideal: '> 95%' },
      camionesDespachados: { label: 'Camiones Despachados', value: 7, unit: 'camiones/día' },
      tiempoEnAnden: { label: 'Tiempo en Andén', value: 44, unit: 'min', ideal: '< 45 min' },
      pedidosPendientes: { label: 'Pedidos Pendientes', value: 14, unit: 'órdenes' }
    }
  },
  {
    id: 'logistica',
    name: 'Cadena de Suministro & Logística Integral',
    shortName: 'Supply Chain',
    chiefName: 'Felipe Carvallo',
    chiefTitle: 'Gerente de Supply Chain',
    characterId: 'felipe',
    description: 'Planificación S&OP, compras estratégicas nacionales e internacionales, gestión de inventario total y mitigación de riesgos.',
    status: 'OPERANDO',
    health: 93,
    efficiency: 89,
    stressLevel: 40,
    activeWorkers: 5,
    tacticalToggles: {
      overtime: false,
      preventiveCheck: true,
      highPriority: false,
      strictStandard: false
    },
    metrics: {
      rotacionInventario: { label: 'Rotación Anual', value: 14.2, unit: 'veces/año', ideal: '> 12' },
      leadTimeTotal: { label: 'Order Lead Time', value: 4.8, unit: 'días', ideal: '< 5 días' },
      efectoLatigo: { label: 'Índice de Bullwhip', value: 1.15, unit: '', ideal: '< 1.20' },
      costoLogistico: { label: 'Costo Logístico / Venta', value: 7.4, unit: '%', ideal: '< 8%' }
    }
  },
  {
    id: 'marketing',
    name: 'Marketing y Ventas Comerciales',
    shortName: 'Comercial & Marketing',
    chiefName: 'Rodrigo Larraín',
    chiefTitle: 'Gerente Comercial',
    characterId: 'rodrigo',
    description: 'Gestión de demanda, negociación con cadenas de retail e industriales, campañas comerciales y fijación de márgenes.',
    status: 'OPERANDO',
    health: 95,
    efficiency: 92,
    stressLevel: 45,
    activeWorkers: 6,
    tacticalToggles: {
      overtime: false,
      preventiveCheck: false,
      highPriority: true,
      strictStandard: false
    },
    metrics: {
      demandaDiaria: { label: 'Demanda del Día', value: 6800, unit: 'unidades' },
      backlogPedidos: { label: 'Backlog Acumulado', value: 18400, unit: 'unidades' },
      precioPromedio: { label: 'Precio Promedio Unitario', value: 42.5, unit: 'USD' },
      cumplimientoForecast: { label: 'Exactitud del Pronóstico', value: 89.1, unit: '%' }
    }
  },
  {
    id: 'post_venta',
    name: 'Post-Venta y Servicio al Cliente',
    shortName: 'Post-Venta & CX',
    chiefName: 'Paulina Araya',
    chiefTitle: 'Jefa de Post-Venta y CX',
    characterId: 'paulina',
    description: 'Recepción de reclamos de distribuidores, gestión de devoluciones, análisis 8D de causas y encuestas de satisfacción.',
    status: 'OPERANDO',
    health: 91,
    efficiency: 90,
    stressLevel: 38,
    activeWorkers: 4,
    tacticalToggles: {
      overtime: false,
      preventiveCheck: false,
      highPriority: false,
      strictStandard: true
    },
    metrics: {
      nps: { label: 'Net Promoter Score (NPS)', value: '+62', unit: 'pts', ideal: '> +50' },
      tasaReclamos: { label: 'Reclamos por Millón', value: 18, unit: 'reclamos/M', ideal: '< 25' },
      tiempoResolucion: { label: 'Tiempo Cierre Reclamo', value: 2.1, unit: 'días', ideal: '< 3 días' },
      devolucionesMes: { label: 'Devoluciones Técnicas', value: 0.28, unit: '%', ideal: '< 0.5%' }
    }
  }
];

export const INITIAL_INDICATORS: PlantIndicators = {
  oee: 81.6, // 92.5% * 89.2% * 98.9%
  availability: 92.5,
  performance: 89.2,
  qualityRate: 98.9,
  wip: 1850,
  leadTimeHours: 2.1,
  bottleneckUnit: 'proceso',
  dailyProductionTarget: 7000,
  unitsProducedToday: 2150,
  scrapPpm: 420,
  otif: 94.2,
  cashBalance: 485000,
  dailyRevenue: 91375,
  dailyCost: 62400,
  inventoryValue: 320000,
  finishedGoodsStock: 32000,
  rawMaterialTons: 145,
  daysWithoutIncidents: 142,
  plantMorale: 84,
  boardApproval: 86,
  customerNps: 62
};

export const INITIAL_ENGINEER: EngineerProfile = {
  name: 'Ing. Alejandro Silva',
  title: 'Ingeniero Industrial',
  level: 'Gerente de Operaciones',
  careerPoints: 1250,
  decisionsMadeCount: 0,
  specialty: 'Lean Manufacturing',
  certifications: ['Six Sigma Green Belt', 'Lean Enterprise Practitioner', 'S&OP Executive Certified']
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'goldratt_toc',
    title: 'El Cuello de Botella de Goldratt',
    subtitle: 'Teoría de Restricciones aplicada a la línea crítica',
    difficulty: 'Intermedio',
    description: 'La estación de termoformado en Proceso se ha convertido en la restricción del sistema. El WIP antes de la máquina se acumula desmedidamente y el Lead Time se disparó a 4.5 horas. Tu misión es identificar, explotar y subordinar el sistema a la restricción para elevar el OEE sobre 85%.',
    targetObjective: 'Lograr OEE > 85% y reducir el Lead Time a menos de 2.5 horas.',
    initialIndicators: {
      oee: 68.4,
      performance: 74.0,
      wip: 4800,
      leadTimeHours: 4.5
    }
  },
  {
    id: 'crisis_recall',
    title: 'Crisis de Calidad y Riesgo de Recall',
    subtitle: 'Aseguramiento de Calidad y Post-Venta en jaque',
    difficulty: 'Avanzado',
    description: 'Post-Venta ha recibido 12 reclamos severos en 48 horas por fisuras en el sellado de envases. Un lote con materias primas fuera de norma pasó el control de recepción y ya hay 8.000 unidades en tránsito hacia supermercados. Debes contener la falla, aplicar 5-Porqués y evitar una catástrofe de marca.',
    targetObjective: 'Contener los reclamos, recuperar el NPS sobre +55 y auditar la recepción.',
    initialIndicators: {
      customerNps: 28,
      scrapPpm: 1250,
      otif: 82.0
    }
  },
  {
    id: 'bullwhip_holiday',
    title: 'El Efecto Látigo en Alta Temporada',
    subtitle: 'S&OP entre Ventas y Cadena de Suministro',
    difficulty: 'Avanzado',
    description: 'Comercial proyectó un incremento del 60% en la demanda para Navidad y lanzó una agresiva promoción sin coordinar con Planta. Supply Chain sobre-ordenó materia prima generando saturación de bodegas y riesgo de desabastecimiento financiero.',
    targetObjective: 'Estabilizar el inventario de PT, equilibrar la rotación y mantener el margen operativo.',
    initialIndicators: {
      finishedGoodsStock: 68000,
      cashBalance: 195000,
      otif: 88.5
    }
  },
  {
    id: 'zero_incidents_tpm',
    title: 'Mantenimiento Preventivo y Cero Incidentes',
    subtitle: 'Confiabilidad de planta y seguridad humana',
    difficulty: 'Experto',
    description: 'Una seguidilla de microparadas por falta de lubricación en rodamientos provocó un amago de incendio y parálisis del turno nocturno. Los trabajadores están desmotivados y Mantenimiento opera solo de modo reactivo (apagar incendios). Debes implementar TPM autónomo.',
    targetObjective: 'Elevar la disponibilidad a > 94%, alcanzar 200 días sin accidentes y subir la moral.',
    initialIndicators: {
      availability: 78.0,
      daysWithoutIncidents: 0,
      plantMorale: 58
    }
  }
];
