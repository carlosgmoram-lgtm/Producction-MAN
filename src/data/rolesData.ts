import { PlantRoleId, RoleDefinition } from '../types/game';

export const PLANT_ROLES: RoleDefinition[] = [
  {
    id: 'GERENTE_PLANTA',
    name: 'Gerente de Planta & Operaciones',
    department: 'Dirección General & S&OP',
    characterName: 'Ing. Carlos Valenzuela (o Tu Perfil)',
    avatarInitials: 'GP',
    avatarColor: 'from-amber-600 to-amber-800',
    tagline: 'Visión Sistémica Global · S&OP · EBITDA y OEE Balanceado',
    mission: 'Armonizar las fuerzas opuestas de todos los departamentos: maximizar rentabilidad y OEE sin quemar a la gente, sin descuidar el mantenimiento ni quebrar stock con clientes.',
    primaryKpis: [
      { label: 'OEE Global de Planta', key: 'oee', unit: '%', targetDesc: 'Meta: > 85.0%' },
      { label: 'EBITDA Operacional', key: 'ebitda', unit: '$', targetDesc: 'Margen diario positivo' },
      { label: 'Aprobación del Directorio', key: 'boardApproval', unit: '%', targetDesc: 'Meta: > 80%' },
      { label: 'Clima Laboral Global', key: 'plantMorale', unit: '%', targetDesc: 'Meta: > 75%' }
    ],
    dilemmaPressure: 'El Directorio exige resultados financieros inmediatos mientras cada jefe departamental compite por recursos y presupuesto.',
    crossImpactWarning: 'Tus decisiones definen presupuestos y prioridades estratégicas, alterando el equilibrio de poder y estrés de todos los departamentos.',
    tacticalActions: [
      {
        id: 'CONVOCAR_SOP',
        label: 'Reunión Extraordinaria S&OP',
        description: 'Reúne a Producción, Ventas y Finanzas para alinear la demanda con la capacidad real de planta.',
        cost: 450
      },
      {
        id: 'FONDO_EMERGENCIA',
        label: 'Liberar Fondo de Contingencia',
        description: 'Inyecta capital de emergencia para destrabar repuestos o fletes críticos.',
        cost: 1500
      }
    ]
  },
  {
    id: 'JEFE_PRODUCCION',
    name: 'Superintendente de Producción',
    department: 'Proceso y Manufactura',
    characterName: 'Camila Sepúlveda',
    avatarInitials: 'CS',
    avatarColor: 'from-blue-600 to-blue-800',
    tagline: 'Cadencia · Rendimiento OEE · Cumplimiento de Meta Diaria',
    mission: 'Transformar materia prima en producto terminado al ritmo programado. Cada minuto de línea parada es pérdida irrecuperable de volumen.',
    primaryKpis: [
      { label: 'Cumplimiento Programa Diario', key: 'productionProgress', unit: '%', targetDesc: 'Meta: 100% de la cuota diaria' },
      { label: 'Factor Rendimiento (P)', key: 'performance', unit: '%', targetDesc: 'Meta: > 90.0%' },
      { label: 'Cadencia Efectiva', key: 'cadence', unit: 'u/hr', targetDesc: 'Velocidad de transformación' },
      { label: 'Estrés de Operarios', key: 'prodStress', unit: '%', targetDesc: 'Control de fatiga y sobretiempo' }
    ],
    dilemmaPressure: 'Presión constante por sacar volumen para cumplir la cuota del turno antes de las 18:00 hrs.',
    crossImpactWarning: 'Forzar la cadencia o extender turnos aumenta el desgaste de maquinaria en Mantenimiento y eleva microdefectos en Calidad.',
    tacticalActions: [
      {
        id: 'SOBRETIEMPO_LINEA',
        label: 'Autorizar Horas Extra en Línea',
        description: 'Añade 1.5 horas de operación forzada al turno pagando sobretiempo a los operarios.',
        cost: 650
      },
      {
        id: 'ACELERAR_CADENCIA',
        label: 'Forzar Cadencia (+12% Velocidad)',
        description: 'Aumenta las revoluciones de los motores para recuperar retrasos de producción.',
        cost: 300
      }
    ]
  },
  {
    id: 'JEFE_CALIDAD',
    name: 'Jefa de Aseguramiento de Calidad',
    department: 'Calidad & Inocuidad',
    characterName: 'Dra. Marcela Morales',
    avatarInitials: 'MM',
    avatarColor: 'from-emerald-600 to-emerald-800',
    tagline: 'Cero Defectos · Control Estadístico (SPC) · Inocuidad',
    mission: 'Blindar a la empresa contra fallas de producto, contaminaciones y reclamos de clientes. La calidad no se negocia.',
    primaryKpis: [
      { label: 'Factor Calidad OEE (Q)', key: 'qualityRate', unit: '%', targetDesc: 'Meta: > 98.5%' },
      { label: 'Scrap / Merma (PPM)', key: 'scrapPpm', unit: 'PPM', targetDesc: 'Meta: < 150 PPM' },
      { label: 'Índice de Conformidad', key: 'conformityRate', unit: '%', targetDesc: 'Lotes dentro de tolerancia' },
      { label: 'Riesgo de Auditoría ISO', key: 'auditRisk', unit: '%', targetDesc: 'Trazabilidad y muestreo' }
    ],
    dilemmaPressure: 'Lotes dudosos en la frontera de tolerancia y presión de Producción por liberar producto sin esperar el cultivo de laboratorio.',
    crossImpactWarning: 'Parar la línea para re-muestrear o rechazar un lote sospechoso enfurece a Producción y pone en riesgo los despachos acordados (OTIF).',
    tacticalActions: [
      {
        id: 'MUESTREO_INTENSIVO',
        label: 'Auditoría & Muestreo Reforzado 100%',
        description: 'Inspección microbiológica y dimensional exhaustiva de los últimos 3 lotes producidos.',
        cost: 400
      },
      {
        id: 'CALIBRAR_SENSORES',
        label: 'Calibración Metrológica de Línea',
        description: 'Detiene microparadas de pesaje y visión artificial ajustando las tolerancias de sensores.',
        cost: 500
      }
    ]
  },
  {
    id: 'JEFE_MANTENIMIENTO',
    name: 'Jefe de Mantenimiento y Confiabilidad',
    department: 'Mantenimiento & Confiabilidad',
    characterName: 'Ing. Hernán Silva',
    avatarInitials: 'HS',
    avatarColor: 'from-rose-600 to-rose-800',
    tagline: 'MTBF & MTTR · Confiabilidad RCM · Cero Paradas No Planificadas',
    mission: 'Cuidar la salud electromecánica de las 12 máquinas críticas. Prevenir fallas catastróficas que puedan paralizar la fábrica por días.',
    primaryKpis: [
      { label: 'Disponibilidad Mecánica (A)', key: 'availability', unit: '%', targetDesc: 'Meta: > 92.0%' },
      { label: 'MTBF (Tiempo Medio Entre Fallas)', key: 'mtbf', unit: 'hrs', targetDesc: 'Meta: > 140 horas' },
      { label: 'MTTR (Tiempo Medio Reparación)', key: 'mttr', unit: 'hrs', targetDesc: 'Meta: < 2.5 horas' },
      { label: 'Desgaste Promedio Parque Maquinaria', key: 'avgWear', unit: '%', targetDesc: 'Meta: < 40%' }
    ],
    dilemmaPressure: 'Equipos que muestran fatiga térmica o de rodamientos mientras Producción se niega a entregar la máquina para mantención.',
    crossImpactWarning: 'Exigir una parada de overhaul frena el volumen de Producción hoy; postergarla arriesga una rotura catastrófica mañana.',
    tacticalActions: [
      {
        id: 'LUBRICACION_EXPRESS',
        label: 'Ruta de Lubricación y Termografía',
        description: 'Inspección térmica con cámara infrarroja y engrase de rodamientos de alta fricción.',
        cost: 350
      },
      {
        id: 'REPOSICION_REPUESTOS',
        label: 'Compra de Repuestos Críticos a Pañol',
        description: 'Asegura sellos, rodamientos SKF y válvulas neumáticas para reducir el MTTR ante una falla.',
        cost: 800
      }
    ]
  },
  {
    id: 'JEFE_ABASTECIMIENTO',
    name: 'Jefe de Abastecimiento & Recepción',
    department: 'Recepción & Compras de MP',
    characterName: 'Roberto Méndez',
    avatarInitials: 'RM',
    avatarColor: 'from-indigo-600 to-indigo-800',
    tagline: 'Silos de Materia Prima · Negociación con Proveedores · Costo Insumo',
    mission: 'Asegurar que los silos y bodegas de materia prima nunca se queden sin insumos, manteniendo el costo unitario de adquisición bajo control.',
    primaryKpis: [
      { label: 'Cobertura de Materia Prima', key: 'mpDays', unit: 'días', targetDesc: 'Meta: 4 a 7 días de buffer' },
      { label: 'Stock en Silos / Almacén', key: 'mpTons', unit: 't', targetDesc: 'Toneladas disponibles' },
      { label: 'Costo Unitario de Insumos', key: 'mpCostUnit', unit: '$/kg', targetDesc: 'Eficiencia de compra' },
      { label: 'Conformidad Proveedores MP', key: 'supplierRating', unit: '%', targetDesc: 'Tasa de lotes aprobados' }
    ],
    dilemmaPressure: 'Fluctuaciones de precio de materias primas y retrasos de proveedores que amenazan con vaciar los silos de alimentación de la planta.',
    crossImpactWarning: 'Comprar materia prima barata de menor grado genera atascos en las máquinas de Producción y dispara defectos en Calidad.',
    tacticalActions: [
      {
        id: 'FLETE_EXPRESS_MP',
        label: 'Flete Aéreo Express de Materia Prima',
        description: 'Acelera la entrega de 15 toneladas de materia prima crítica pagando recargo express.',
        cost: 950
      },
      {
        id: 'NEGOCIAR_VOLUMEN',
        label: 'Cierre de Contrato de Insumos por Volumen',
        description: 'Pacta compra de materia prima con descuento por volumen reduciendo el costo unitario.',
        cost: 600
      }
    ]
  },
  {
    id: 'JEFE_DESPACHO',
    name: 'Jefa de Despacho & Logística de Salida',
    department: 'Despacho & Distribución OTIF',
    characterName: 'Sofía Valenzuela',
    avatarInitials: 'SV',
    avatarColor: 'from-teal-600 to-teal-800',
    tagline: 'OTIF (On-Time In-Full) · Coordinación de Flota · Servicio al Cliente',
    mission: 'Asegurar que cada pallet terminado sea entregado al cliente exactamente en su ventana horaria y sin faltantes ni mermas en transporte.',
    primaryKpis: [
      { label: 'OTIF (On-Time In-Full)', key: 'otif', unit: '%', targetDesc: 'Meta: > 95.0%' },
      { label: 'Satisfacción Cliente (NPS)', key: 'customerNps', unit: 'pts', targetDesc: 'Meta: > +60 puntos' },
      { label: 'Lead Time de Despacho', key: 'leadTime', unit: 'hrs', targetDesc: 'Tiempo desde pedido a entrega' },
      { label: 'Ocupación de Andenes de Carga', key: 'dockUsage', unit: '%', targetDesc: 'Fluidez de camiones' }
    ],
    dilemmaPressure: 'Camiones de grandes cadenas esperando en andén mientras la línea de Producción sufre demoras o Calidad retiene el lote para pruebas.',
    crossImpactWarning: 'Retener camiones esperando producto terminado eleva los costos de estadía y arriesga multas millonarias por retraso en retail.',
    tacticalActions: [
      {
        id: 'CONTRATAR_FLOTA_AUXILIAR',
        label: 'Contratar Flota de Transporte Auxiliar',
        description: 'Habilita 2 camiones frigoríficos / ramplas adicionales para descongestionar el patio de carga.',
        cost: 700
      },
      {
        id: 'REPROGRAMAR_VENTANA',
        label: 'Negociar Ventana Horaria de Entrega',
        description: 'Acuerda con el cliente una extensión de 3 horas de entrega sin penalización económica.',
        cost: 250
      }
    ]
  }
];

export const getRoleById = (roleId: PlantRoleId): RoleDefinition => {
  return PLANT_ROLES.find((r) => r.id === roleId) || PLANT_ROLES[0];
};
