import { 
  MethodologyDefinition, 
  MachineDefinition, 
  TrainingProgramDefinition, 
  MaintenancePlanState 
} from '../types/game';

// ==========================================
// CATÁLOGO DE METODOLOGÍAS Y HERRAMIENTAS INDUSTRIALES
// Nota técnica: Se presentan definiciones formales de ingeniería, origen histórico
// y campos de aplicación en planta, sin sesgar la decisión del gerente con ayudas numéricas.
// ==========================================

export const METHODOLOGIES_CATALOGUE: MethodologyDefinition[] = [
  {
    id: '5S',
    name: 'Metodología 5S',
    tagline: 'Organización, orden, limpieza estandarizada y disciplina en el Gemba',
    origin: 'Desarrollado en Japón por Hiroyuki Hirano dentro del Sistema de Producción Toyota (TPS). Representa: Seiri (Separar), Seiton (Ordenar), Seiso (Limpiar), Seiketsu (Estandarizar) y Shitsuke (Sostener / Disciplina).',
    category: 'Estandarización & Calidad',
    definition: 'Técnica de gestión visual y orden sistemático del puesto de trabajo cuyo propósito es eliminar elementos innecesarios, acondicionar el espacio para un acceso inmediato a herramientas y materiales, estandarizar rutinas de inspección y arraigar hábitos de disciplina operativa en el personal de planta.',
    industrialUses: [
      'Eliminación de tiempos muertos por búsqueda de útiles, herramientas y documentación en líneas de producción.',
      'Prevención de derrames, caídas y riesgos ergonómicos mediante delimitación visual de pasillos y zonas seguras.',
      'Detección visual temprana de fugas de aceite, desajustes mecánicos y desgaste prematuro durante rutinas Seiso.',
      'Estandarización de gabinetes de herramientas con siluetas (shadow boards) en puestos de montaje y mantenimiento.'
    ],
    prerequisites: 'Compromiso de las jefaturas de área, auditorías visuales periódicas y tiempo asignado a los operadores.',
    color: '#3b82f6'
  },
  {
    id: 'TPM',
    name: 'TPM (Mantenimiento Productivo Total)',
    tagline: 'Cero averías, cero defectos y cero accidentes con involucramiento de todos',
    origin: 'Creado por Seiichi Nakajima en el JIPM (Japan Institute of Plant Maintenance) en 1971 a partir de prácticas en Denso y Toyota.',
    category: 'Mantenimiento & Confiabilidad',
    definition: 'Filosofía integral de confiabilidad operacional estructurada en 8 pilares, cuyo objetivo central es maximizar la Efectividad Global del Equipo (OEE) involucrando a los propios operadores de línea en el cuidado básico del activo (Mantenimiento Autónomo) en estrecha sinergia con el Mantenimiento Planificado.',
    industrialUses: [
      'Transferencia de rutinas de limpieza, lubricación e inspección diaria (CIL) a los operadores de producción.',
      'Análisis sistemático de las 6 grandes pérdidas de los equipos para elevar disponibilidad y rendimiento.',
      'Eliminación de averías repetitivas mediante análisis causa raíz 5 Porqués y diagramas Ishikawa.',
      'Capacitación técnica de operarios para identificar anomalías antes de que deriven en paradas no programadas.'
    ],
    prerequisites: 'Capacitación técnica a operadores de línea, apoyo del taller de mantenimiento y estandarización de lubricantes.',
    color: '#f97316'
  },
  {
    id: 'JIT',
    name: 'JIT (Just in Time / Justo a Tiempo)',
    tagline: 'Producir el elemento exacto, en la cantidad requerida y en el momento preciso',
    origin: 'Concebido por Kiichiro Toyoda y formalizado por Taiichi Ohno en Toyota Motor Corporation a mediados del siglo XX.',
    category: 'Flujo & Cuellos de Botella',
    definition: 'Estrategia de manufactura basada en el principio de demanda Pull (tracción), que busca eliminar todo inventario intermedio superfluo (WIP), sincronizando la tasa de producción con la cadencia de la demanda del cliente (Takt Time).',
    industrialUses: [
      'Sincronización de entregas de insumos directamente a la cabecera de la línea de ensamble sin almacenamiento intermedio.',
      'Reducción drástica del capital de trabajo inmovilizado en bodegas de materia prima y stock en proceso.',
      'Exposición visual de problemas ocultos de calidad y desbalanceo de línea al retirar el colchón amortiguador de inventario.',
      'Disminución del Lead Time total de fabricación desde la orden de compra hasta el despacho.'
    ],
    prerequisites: 'Proveedores con alta confiabilidad de entrega, estabilidad en máquinas y tiempos de cambio controlados.',
    color: '#06b6d4'
  },
  {
    id: 'LEAN',
    name: 'Lean Manufacturing',
    tagline: 'Cultura de eliminación sistemática de los 7 desperdicios (Mudas)',
    origin: 'Formulado académicamente por Womack, Jones y Roos en "La máquina que cambió el mundo" (1990), basado en el TPS.',
    category: 'Productividad & Personas',
    definition: 'Modelo sociotécnico de gestión enfocado en generar el máximo valor para el cliente utilizando la menor cantidad posible de recursos, erradicando los 7 desperdicios capitales: sobreproducción, esperas, transporte innecesario, sobreprocesamiento, exceso de inventario, movimientos inútiles y defectos.',
    industrialUses: [
      'Diseño de células de manufactura en forma de U para optimizar el recorrido del operador y el flujo de una pieza.',
      'Balanceo de cargas de trabajo entre estaciones de la línea para mitigar cuellos de botella.',
      'Sistemas de gestión visual Andon para detección inmediata de anomalías en línea con facultad de detención.',
      'Empoderamiento de equipos operativos para resolver desviaciones en el lugar de los hechos (Gemba).'
    ],
    prerequisites: 'Liderazgo visible en terreno, cultura abierta al error como oportunidad de aprendizaje y metas claras.',
    color: '#8b5cf6'
  },
  {
    id: 'SOP',
    name: 'Procedimientos Operativos Estándar (SOP)',
    tagline: 'Repetibilidad, consistencia entre turnos y preservación del know-how industrial',
    origin: 'Pilar clásico de la ingeniería de métodos y la administración científica, formalizado en normativas ISO 9001 y GMP.',
    category: 'Estandarización & Calidad',
    definition: 'Conjunto de instrucciones de trabajo detalladas, visuales y documentadas paso a paso que describen la mejor y más segura manera conocida de ejecutar una tarea operativa, eliminando la variabilidad individual entre turnos y operarios.',
    industrialUses: [
      'Estandarización de secuencias de arranque, operación continua y parada segura de maquinarias críticas.',
      'Control de parámetros de proceso (temperaturas, presiones, velocidades de dosificación) dentro de ventanas operacionales fijas.',
      'Homogeneización de criterios de inspección visual en control de calidad para evitar discrepancias subjetivas.',
      'Aseguramiento de protocolos de bloqueo y etiquetado eléctrico/mecánico (LOTO) en tareas de mantenimiento.'
    ],
    prerequisites: 'Participación activa de los operadores experimentados en su redacción y revisión periódica en Gemba.',
    color: '#10b981'
  },
  {
    id: 'JI',
    name: 'Job Instruction (JI - Metodología TWI)',
    tagline: 'Método estructurado de 4 pasos para instruir al personal sin errores ni accidentes',
    origin: 'Desarrollado en EE.UU. durante la Segunda Guerra Mundial por el programa Training Within Industry (TWI) de 1941, adoptado posteriormente como cimiento pedagógico en Toyota.',
    category: 'Productividad & Personas',
    definition: 'Metodología pedagógica industrial que capacita a supervisores y operarios líderes para enseñar cualquier tarea en 4 pasos precisos: 1. Preparar al trabajador, 2. Presentar la operación destacando pasos clave y puntos importantes, 3. Hacer que el trabajador pruebe la tarea explicando los porqués, y 4. Ponerlo a trabajar bajo seguimiento progresivo.',
    industrialUses: [
      'Aceleración de la curva de aprendizaje de nuevos operarios reduciendo a una fracción los tiempos de inducción.',
      'Erradicación de defectos originados por malentendidos o vicios operativos adquiridos de boca en boca.',
      'Transmisión rigurosa de puntos clave de seguridad industrial y calidad intrínseca en tareas de alta complejidad.',
      'Formación de monitores internos en la línea con estándar homogéneo de instrucción.'
    ],
    prerequisites: 'Desglose previo de la tarea en Pasos Clave, Puntos Importantes y Motivos, junto a monitores certificados.',
    color: '#ec4899'
  },
  {
    id: 'SMED',
    name: 'SMED (Single-Minute Exchange of Die)',
    tagline: 'Reducción sistemática de tiempos de cambio de herramientas y formato a menos de 10 min',
    origin: 'Creado por el Dr. Shigeo Shingo en Toyota Motor y Toyo Kogyo (Mazda) durante las décadas de 1950 a 1970.',
    category: 'Flujo & Cuellos de Botella',
    definition: 'Metodología estructurada de ingeniería para reducir radicalmente el tiempo de preparación de máquinas separando estrictamente las operaciones internas (que exigen detener la máquina) de las externas (que pueden ejecutarse con la máquina en marcha), convirtiendo operaciones internas en externas y racionalizando los ajustes.',
    industrialUses: [
      'Reducción de tiempos muertos por cambio de moldes en inyectoras de polímeros y prensas de conformado.',
      'Cambio rápido de envases, etiquetas y dosificadores en líneas de embotellado y envasado continuo.',
      'Habilitación de corridas de producción más cortas y variadas sin penalizar la disponibilidad del equipo.',
      'Estandarización de fijaciones rápidas de un cuarto de vuelta, calibres prefijados y carros de cambio preparados.'
    ],
    prerequisites: 'Grabación en video de los cambios actuales, cronometraje riguroso e inversión menor en herramental rápido.',
    color: '#eab308'
  },
  {
    id: 'KAIZEN',
    name: 'Kaizen (Eventos de Mejora Continua)',
    tagline: 'Pequeñas mejoras incrementales diarias con la participación activa de todo el personal',
    origin: 'Popularizado por Masaaki Imai en 1986 con el libro "Kaizen: La clave de la ventaja competitiva japonesa".',
    category: 'Productividad & Personas',
    definition: 'Filosofía y método estructurado de mejora continua participativa que sostiene que los procesos siempre pueden ser optimizados mediante pequeños cambios frecuentes impulsados por los propios equipos de trabajo en el Gemba, sin requerir grandes desembolsos de capital.',
    industrialUses: [
      'Organización de talleres Kaizen Blitz (eventos focalizados de 3 a 5 días) para resolver cuellos de botella específicos.',
      'Implementación de sistemas de buzón y paneles de sugerencias operativas implementadas con reconocimiento público.',
      'Resolución participativa de microparadas mecánicas y desajustes de ergonomía en puestos de ensamble.',
      'Fomento del sentido de pertenencia y elevación de la moral colectiva de la planta.'
    ],
    prerequisites: 'Cultura directiva receptiva a iniciativas de los operarios y agilidad para implementar mejoras aprobadas.',
    color: '#14b8a6'
  },
  {
    id: 'KANBAN',
    name: 'Sistema Kanban',
    tagline: 'Control visual de flujo y reabastecimiento por tarjetas de señalización',
    origin: 'Diseñado por Taiichi Ohno en Toyota, inspirado en el funcionamiento de reposición de los supermercados.',
    category: 'Flujo & Cuellos de Botella',
    definition: 'Herramienta de control visual del flujo de materiales que utiliza tarjetas, carros o contenedores específicos como señal física de autorización para producir o transportar únicamente lo que el proceso siguiente ha consumido.',
    industrialUses: [
      'Reabastecimiento automático de cajas de fijaciones, tornillería y componentes menores en puestos de montaje.',
      'Limitación del inventario en proceso (WIP) mediante el establecimiento de una cantidad fija de tarjetas en circulación.',
      'Prevención total de la sobreproducción en estaciones anteriores a un cuello de botella.',
      'Sincronización visual entre el almacén de materia prima y las tolvas de las líneas de dosificación.'
    ],
    prerequisites: 'Procesos con tiempos de ciclo razonablemente estables y disciplina estricta para respetar las señales.',
    color: '#6366f1'
  },
  {
    id: 'POKA_YOKE',
    name: 'Poka-Yoke (A Prueba de Errores)',
    tagline: 'Mecanismos y sensores que impiden o detectan inmediatamente cualquier equivocación',
    origin: 'Ideado por Shigeo Shingo como parte del Control de Calidad Cero Defectos (ZQC) en Toyota.',
    category: 'Estandarización & Calidad',
    definition: 'Dispositivo físico, sensor mecánico, eléctrico o software diseñado para evitar que se cometa un error humano o para detectarlo inmediatamente antes de que se transforme en un producto defectuoso en las etapas posteriores.',
    industrialUses: [
      'Matrices y guías mecánicas asimétricas que impiden colocar una pieza en posición invertida.',
      'Barreras fotoeléctricas en estanterías de componentes que verifican si el operario extrajo la pieza correcta antes de liberar la máquina.',
      'Sensores de fin de carrera y transductores de torque que detienen el ciclo si un perno no alcanzó el apriete nominal.',
      'Sistemas de visión artificial que descartan automáticamente envases sin etiqueta o tapas desalineadas.'
    ],
    prerequisites: 'Mapeo detallado de los modos de fallo humano más frecuentes en cada estación de trabajo.',
    color: '#f43f5e'
  },
  {
    id: 'SIX_SIGMA',
    name: 'Six Sigma & DMAIC',
    tagline: 'Reducción rigurosa de variabilidad de procesos a menos de 3.4 defectos por millón',
    origin: 'Desarrollado en Motorola por el ingeniero Bill Smith en 1986 y masificado por General Electric bajo Jack Welch.',
    category: 'Estandarización & Calidad',
    definition: 'Metodología estructurada de ingeniería basada en datos y herramientas estadísticas avanzadas que sigue el ciclo DMAIC (Definir, Medir, Analizar, Mejorar, Controlar) para erradicar las causas de variabilidad en procesos críticos y garantizar tolerancias milimétricas.',
    industrialUses: [
      'Optimización de parámetros críticos de temperatura, presión y viscosidad en hornos y reactores continuos.',
      'Estudios de capacidad de proceso (Cp y Cpk) y análisis de repetibilidad y reproducibilidad (Gage R&R) en laboratorio.',
      'Disminución radical de la dispersión en pesos de dosificación, espesores de película y resistencias mecánicas.',
      'Control Estadístico de Procesos (SPC) con gráficos de control para detección proactiva de causas especiales de variación.'
    ],
    prerequisites: 'Personal capacitado en análisis estadístico (Green/Black Belts) y sistemas de captura fiable de datos en línea.',
    color: '#0284c7'
  },
  {
    id: 'VSM',
    name: 'VSM (Value Stream Mapping)',
    tagline: 'Mapeo del flujo de valor para identificar y eliminar fuentes de desperdicio',
    origin: 'Desarrollado en Toyota bajo la denominación "Material and Information Flow Mapping", sistematizado por Rother y Shook (1998).',
    category: 'Flujo & Cuellos de Botella',
    definition: 'Herramienta gráfica que plasma visualmente en un solo plano todos los pasos, flujos de material, flujos de información y tiempos de ciclo/espera necesarios para llevar un producto desde el proveedor de materias primas hasta el cliente final, identificando oportunidades estructurales de reducción de Lead Time.',
    industrialUses: [
      'Identificación del ratio entre el tiempo con valor agregado (VA) y el Lead Time total de la planta.',
      'Detección de puntos de acumulación de inventario intermedio y colas de espera entre departamentos.',
      'Diseño del mapa de estado futuro (Future State Map) como hoja de ruta estratégica de transformación operacional.',
      'Alineación entre las áreas de Logística, Producción, Calidad y Mantenimiento sobre el flujo troncal del negocio.'
    ],
    prerequisites: 'Caminatas Gemba conjuntas de todos los jefes de departamento y medición en terreno de tiempos reales.',
    color: '#d97706'
  }
];

// ==========================================
// MAQUINARIA Y ACTIVOS CRÍTICOS DE PLANTA
// ==========================================

export const INITIAL_MACHINES: MachineDefinition[] = [
  {
    id: 'romana_camiones',
    name: 'Báscula Romana de Camiones',
    unitId: 'recepcion',
    unitName: 'Recepción MP',
    type: 'Báscula electromecánica de alto tonelaje (60t)',
    criticality: 'ALTA',
    wearPercent: 28,
    operatingHours: 4200,
    status: 'OPERANDO',
    lastMaintenanceDay: -12,
    nextScheduledDay: 18,
    installedSensors: true,
    sparePartsAvailable: true,
    description: 'Báscula de plataforma de pesaje continuo para camiones articulados. Controla pesaje bruto, tara y tara neta de insumos.',
    nominalCapacity: '12 camiones/hora'
  },
  {
    id: 'tolva_dosificadora',
    name: 'Tolva & Alimentador Gravimétrico',
    unitId: 'recepcion',
    unitName: 'Recepción MP',
    type: 'Sistema dosificador rotativo de carga pesada',
    criticality: 'CRITICA',
    wearPercent: 44,
    operatingHours: 6800,
    status: 'OPERANDO',
    lastMaintenanceDay: -6,
    nextScheduledDay: 14,
    installedSensors: true,
    sparePartsAvailable: true,
    description: 'Dosificador volumétrico y gravimétrico que suministra materia prima pulverizada o granulada hacia la nave principal.',
    nominalCapacity: '15 t/hora'
  },
  {
    id: 'prensa_conformado',
    name: 'Prensa Hidráulica / Inyectora Principal',
    unitId: 'proceso',
    unitName: 'Manufactura & Proceso',
    type: 'Prensa de alta presión 800 Toneladas',
    criticality: 'CRITICA',
    wearPercent: 62,
    operatingHours: 9200,
    status: 'CUELLO_BOTELLA',
    lastMaintenanceDay: -20,
    nextScheduledDay: 5,
    installedSensors: false,
    sparePartsAvailable: true,
    description: 'Corazón del proceso de transformación física. Máquina restricción (TOC) que determina el ritmo global de la planta.',
    nominalCapacity: '950 piezas/hora'
  },
  {
    id: 'horno_continuo',
    name: 'Horno Túnel Térmico / Enfriador',
    unitId: 'proceso',
    unitName: 'Manufactura & Proceso',
    type: 'Horno continuo multizona de convección forzada',
    criticality: 'ALTA',
    wearPercent: 51,
    operatingHours: 7400,
    status: 'OPERANDO',
    lastMaintenanceDay: -14,
    nextScheduledDay: 10,
    installedSensors: true,
    sparePartsAvailable: false,
    description: 'Tratamiento térmico estabilizador con 4 zonas de calentamiento y rampa de enfriamiento programable.',
    nominalCapacity: '1.200 piezas/hora'
  },
  {
    id: 'cinta_transportadora_troncal',
    name: 'Cinta Transportadora Troncal',
    unitId: 'proceso',
    unitName: 'Manufactura & Proceso',
    type: 'Línea de rodillos motrices y bandas sincronizadas',
    criticality: 'MEDIA',
    wearPercent: 35,
    operatingHours: 5100,
    status: 'OPERANDO',
    lastMaintenanceDay: -8,
    nextScheduledDay: 22,
    installedSensors: false,
    sparePartsAvailable: true,
    description: 'Transportador continuo que interconecta la salida de manufactura con la estación de inspección y empaque.',
    nominalCapacity: '18 m/min'
  },
  {
    id: 'vision_artificial',
    name: 'Inspector Óptico Láser & Visión 3D',
    unitId: 'calidad',
    unitName: 'Aseguramiento de Calidad',
    type: 'Escáner estereoscópico multiespectral',
    criticality: 'CRITICA',
    wearPercent: 22,
    operatingHours: 3200,
    status: 'OPERANDO',
    lastMaintenanceDay: -5,
    nextScheduledDay: 25,
    installedSensors: true,
    sparePartsAvailable: true,
    description: 'Sistema de inspección al 100% de la producción para detección milimétrica de fisuras, manchas y tolerancias dimensionales.',
    nominalCapacity: '1.500 piezas/hora'
  },
  {
    id: 'transelevador_pt',
    name: 'Transelevador & Racks Automatizados',
    unitId: 'producto_terminado',
    unitName: 'Bodega de Producto Terminado',
    type: 'Transelevador de mástil doble guiado por PLC',
    criticality: 'ALTA',
    wearPercent: 41,
    operatingHours: 6300,
    status: 'OPERANDO',
    lastMaintenanceDay: -18,
    nextScheduledDay: 12,
    installedSensors: true,
    sparePartsAvailable: false,
    description: 'Almacenamiento automático vertical de alta densidad en estanterías de 14 metros de altura con gestión FIFO.',
    nominalCapacity: '45 ciclos pallet/hora'
  },
  {
    id: 'envolvedora_pallets',
    name: 'Envolvedora Orbital Automática de Pallets',
    unitId: 'producto_terminado',
    unitName: 'Bodega de Producto Terminado',
    type: 'Envolvedora con anillo giratorio y film preestirado',
    criticality: 'MEDIA',
    wearPercent: 48,
    operatingHours: 5800,
    status: 'OPERANDO',
    lastMaintenanceDay: -15,
    nextScheduledDay: 15,
    installedSensors: false,
    sparePartsAvailable: true,
    description: 'Envoltura termocontraíble para consolidación de cargas paletizadas antes del paso al muelle de despacho.',
    nominalCapacity: '60 pallets/hora'
  },
  {
    id: 'rampas_docks',
    name: 'Sistema Hidráulico de Rampas & Muelles',
    unitId: 'despacho',
    unitName: 'Despacho & Distribución',
    type: '4 Rampas niveladoras electrohidráulicas de labio batiente',
    criticality: 'MEDIA',
    wearPercent: 32,
    operatingHours: 4900,
    status: 'OPERANDO',
    lastMaintenanceDay: -10,
    nextScheduledDay: 20,
    installedSensors: false,
    sparePartsAvailable: true,
    description: 'Puentes de enlace entre muelles de bodega y remolques de transporte pesado para carga rápida con grúas.',
    nominalCapacity: '4 andenes simultáneos'
  },
  {
    id: 'compresor_industrial',
    name: 'Compresor de Tornillo & Red Neumática',
    unitId: 'mantenimiento',
    unitName: 'Mantenimiento & Confiabilidad',
    type: 'Compresor rotativo de tornillo lubricado 75 kW',
    criticality: 'CRITICA',
    wearPercent: 68,
    operatingHours: 11200,
    status: 'EN_ALERTA',
    lastMaintenanceDay: -35,
    nextScheduledDay: 2,
    installedSensors: false,
    sparePartsAvailable: true,
    description: 'Suministra aire comprimido a 7 bar a actuadores neumáticos de toda la planta, empacadoras y válvulas de proceso.',
    nominalCapacity: '12.5 m³/min'
  },
  {
    id: 'caldera_industrial',
    name: 'Caldera de Vapor Pirotubular',
    unitId: 'mantenimiento',
    unitName: 'Mantenimiento & Confiabilidad',
    type: 'Generador de vapor 10 BHP a gas natural',
    criticality: 'ALTA',
    wearPercent: 45,
    operatingHours: 7800,
    status: 'OPERANDO',
    lastMaintenanceDay: -22,
    nextScheduledDay: 8,
    installedSensors: true,
    sparePartsAvailable: true,
    description: 'Suministro de vapor para intercambiadores de calor, esterilización y reactores térmicos.',
    nominalCapacity: '1.500 kg vapor/hora'
  },
  {
    id: 'flota_montacargas',
    name: 'Flota de Grúas Horquilla Eléctricas (4 unid.)',
    unitId: 'logistica',
    unitName: 'Cadena de Suministro',
    type: 'Montacargas de batería de litio 2.5t',
    criticality: 'MEDIA',
    wearPercent: 39,
    operatingHours: 5400,
    status: 'OPERANDO',
    lastMaintenanceDay: -11,
    nextScheduledDay: 19,
    installedSensors: true,
    sparePartsAvailable: true,
    description: 'Movimiento interno continuo de materias primas, pallets intermedios y carga a camiones en patio.',
    nominalCapacity: '4 unidades activas'
  }
];

// ==========================================
// PROGRAMAS FORMATIVOS DE CAPACITACIÓN
// ==========================================

export const TRAINING_PROGRAMS: TrainingProgramDefinition[] = [
  {
    id: 'JI_WORK_INSTRUCTION',
    title: 'Instrucción de Trabajo Estandarizada (TWI - JI)',
    shortDesc: 'Capacita a supervisores y monitores para entrenar a operarios en 4 pasos con cero errores.',
    recommendedAudience: 'Supervisores de Turno y Operadores Líderes',
    competencyTarget: 'Transmisión pedagógica de estándares, reducción de errores de montaje y tiempos de curva de aprendizaje.',
    durationHours: 8,
    costPerWorker: 450,
    syllabus: [
      'Módulo 1: Cómo preparar la instrucción (Desglose de tareas y hoja de instrucción).',
      'Módulo 2: Identificación de Pasos Clave, Puntos Importantes y Motivos de Seguridad.',
      'Módulo 3: Práctica de los 4 pasos de TWI en Gemba con operarios reales.',
      'Módulo 4: Auditoría de acompañamiento y preservación del estándar.'
    ]
  },
  {
    id: 'SAFETY_LOTO',
    title: 'Seguridad Industrial & Bloqueo Energético (LOTO)',
    shortDesc: 'Protocolo cero accidentes: Aislamiento seguro de energías peligrosas eléctrica, neumática e hidráulica.',
    recommendedAudience: 'Técnicos de Mantenimiento y Operadores de Máquinas',
    competencyTarget: 'Prevención absoluta de atrapamientos, electrocución y accidentes con tiempo perdido (CTP).',
    durationHours: 6,
    costPerWorker: 380,
    syllabus: [
      'Módulo 1: Tipos de energías peligrosas y normativa OSHA 1910.147.',
      'Módulo 2: Dispositivos de bloqueo físico, candados individuales y tarjetas de advertencia.',
      'Módulo 3: Pasos para liberación de energía residual en circuitos hidráulicos y neumáticos.',
      'Módulo 4: Simulación práctica de desconexión y verificación de energía cero en el equipo.'
    ]
  },
  {
    id: 'AUTONOMOUS_MAINTENANCE_L1',
    title: 'Mantenimiento Autónomo Nivel 1 (TPM)',
    shortDesc: 'Habilita a los operadores de línea para realizar limpieza profunda, inspección y lubricación básica.',
    recommendedAudience: 'Operadores de Producción de Planta',
    competencyTarget: 'Detección temprana de anomalías, prevención de microparadas y aumento de la vida útil del activo.',
    durationHours: 12,
    costPerWorker: 520,
    syllabus: [
      'Módulo 1: Filosofía TPM y el rol proactivo del operador frente al equipo.',
      'Módulo 2: Técnicas de limpieza con inspección: cómo detectar holguras, fugas y calor anómalo.',
      'Módulo 3: Elaboración de estándares CIL (Limpieza, Inspección, Lubricación).',
      'Módulo 4: Identificación y colocación de tarjetas Fuguay (etiquetado de anomalías).'
    ]
  },
  {
    id: 'SPC_METROLOGY',
    title: 'Control Estadístico de Procesos (SPC) & Metrología',
    shortDesc: 'Manejo de instrumentos de medición, gráficos de control X-barra/R y cálculo de Cp y Cpk.',
    recommendedAudience: 'Inspectores de Calidad y Jefaturas Técnicas',
    competencyTarget: 'Detección de causas especiales de variación antes de generar unidades fuera de especificación.',
    durationHours: 16,
    costPerWorker: 650,
    syllabus: [
      'Módulo 1: Fundamentos de metrología industrial y calibración de instrumentos.',
      'Módulo 2: Distribución normal, variabilidad común y variabilidad especial.',
      'Módulo 3: Construcción e interpretación de gráficos de control en tiempo real.',
      'Módulo 4: Cálculo de capacidad del proceso e índices Cp, Cpk y PPMs estimados.'
    ]
  },
  {
    id: 'LEAN_5S_VISUAL',
    title: 'Implantación 5S & Gestión Visual Gemba',
    shortDesc: 'Taller práctico en terreno para clasificar, rotular, limpiar y disciplinar el área de trabajo.',
    recommendedAudience: 'Personal de Bodegas, Talleres y Línea de Ensamble',
    competencyTarget: 'Erradicación de pérdidas por búsqueda, orden visual y orgullo del puesto de trabajo.',
    durationHours: 8,
    costPerWorker: 320,
    syllabus: [
      'Módulo 1: Tarjetas rojas (Seiri) y retiro de materiales obsoletos.',
      'Módulo 2: Delimitación de áreas de trabajo y shadow boards de herramientas (Seiton).',
      'Módulo 3: Inspección visual Seiso y cronogramas de orden.',
      'Módulo 4: Creación de listas de chequeo y auditorías de sostenimiento (Shitsuke).'
    ]
  },
  {
    id: 'MUDA_KAIZEN',
    title: 'Detección de Mudas & Metodología Kaizen en Equipo',
    shortDesc: 'Aprender a ver los 7 desperdicios de la manufactura y diseñar soluciones prácticas sin presupuesto.',
    recommendedAudience: 'Operadores, Líderes y Jefes de Sección',
    competencyTarget: 'Cultura de mejora continua participativa y optimización de micromovimientos.',
    durationHours: 10,
    costPerWorker: 400,
    syllabus: [
      'Módulo 1: Los 7 desperdicios clásicos más el octavo (talento humano no aprovechado).',
      'Módulo 2: Caminatas Gemba: cómo observar los procesos sin juzgar a las personas.',
      'Módulo 3: El ciclo PDCA (Planificar, Hacer, Verificar, Actuar) para problemas cotidianos.',
      'Módulo 4: Presentación de casos Kaizen resueltos por el equipo.'
    ]
  },
  {
    id: 'FORKLIFT_LOGISTICS',
    title: 'Operación Segura de Grúas Horquilla & Logística',
    shortDesc: 'Manejo seguro de cargas, estiba correcta en racks y optimización de flujos de tránsito interior.',
    recommendedAudience: 'Operadores de Montacargas y Logística',
    competencyTarget: 'Cero daños a estanterías, prevención de caídas de pallets y agilización de carga en muelles.',
    durationHours: 8,
    costPerWorker: 420,
    syllabus: [
      'Módulo 1: Triángulo de estabilidad y límites de carga según centro de gravedad.',
      'Módulo 2: Inspección pre-operacional obligatoria (frenos, mástil, niveles hidráulicos).',
      'Módulo 3: Maniobras en pasillos estrechos y estiba en altura en racks transelevadores.',
      'Módulo 4: Protocolos de velocidad y prioridad de paso peatonal en planta.'
    ]
  },
  {
    id: 'SMED_SETUP',
    title: 'Técnicas de Cambio Rápido de Herramientas (SMED)',
    shortDesc: 'Metodología para desarmar, limpiar y reconfigurar matrices y troqueles en menos de 10 minutos.',
    recommendedAudience: 'Operadores y Ajustadores de Prensas / Envasado',
    competencyTarget: 'Reducción de tiempos muertos por cambio de producto y aumento de la flexibilidad de la línea.',
    durationHours: 12,
    costPerWorker: 560,
    syllabus: [
      'Módulo 1: Análisis de preparaciones: separación estricta de tareas internas y externas.',
      'Módulo 2: Técnicas de precalentamiento y preparación previa de moldes fuera de línea.',
      'Módulo 3: Estandarización de herramientas de apriete rápido y eliminación de pernos roscados.',
      'Módulo 4: Cronometraje y ensayo en paralelo del cambio de formato.'
    ]
  }
];

// ==========================================
// ESTADO INICIAL DEL PLAN DE MANTENIMIENTO
// ==========================================

export const INITIAL_MAINTENANCE_PLAN: MaintenancePlanState = {
  strategy: 'PREVENTIVO_SISTEMATICO',
  strategyName: 'Mantenimiento Preventivo Programado por Horas de Marcha',
  strategyDescription: 'Intervenciones periódicas planificadas cada cierto número de horas de operación para cambio de rodamientos, aceites y sellos mecánicos.',
  inspectionFrequencyDays: 14,
  sparePartsPolicy: 'STOCK_PAÑOL',
  autonomousMaintenanceActive: false,
  predictiveSensorsActive: false,
  compliancePercent: 78,
  mtbfHours: 142,
  mttrHours: 3.2,
  sparePartsStockCount: 48,
  criticalAssetsHealthAverage: 74,
  activeWorkOrdersCount: 4
};
