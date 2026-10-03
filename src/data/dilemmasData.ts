import { Dilemma } from '../types/game';

export const DILEMMAS_LIBRARY: Dilemma[] = [
  {
    id: 'dilemma_rush_order',
    dayTrigger: 1,
    hourTrigger: 9,
    unitId: 'marketing',
    characterId: 'rodrigo',
    title: 'Pedido Flash con Penalización de Gran Cuenta',
    urgency: 'ALTA',
    scenarioDescription: 'Rodrigo (Marketing) llega a la sala con un contrato urgente: Walmart solicita 6.500 unidades adicionales para este viernes. Ofrecen una prima del 18% sobre el precio de lista, pero si nos atrasamos aplican una multa del 25% sobre el valor del pedido. Camila (Producción) advierte que la planta está al 91% de utilización y Roberto (Recepción) solo tiene MP para el plan original.',
    choices: [
      {
        id: 'rush_accept_overtime',
        text: 'Aceptar el pedido completo activando un 3er turno de noche y flete aéreo de materia prima.',
        methodologyNote: 'Maximización de ingresos a corto plazo asumiendo sobrecostos operativos y desgaste de maquinaria.',
        consequences: {
          cashChange: 35000,
          kpiEffects: {
            oee: -3.5,
            otif: 2.1,
            defects: 80,
            safety: -1
          },
          moraleChanges: {
            marketing: 15,
            proceso: -10,
            recepcion: -8,
            mantenimiento: -6
          },
          summaryMessage: 'Cumpliste el pedido flash y capturaste la prima, pero el sobretiempo fatigó al equipo y aumentaron las microparadas.'
        }
      },
      {
        id: 'rush_negotiate_split',
        text: 'Negociar entrega dividida (50% el viernes, 50% el martes siguiente) mediante protocolo S&OP.',
        methodologyNote: 'Alineación de Capacidad y Demanda (S&OP) nivelando el Heijunka de producción sin quiebre de stock.',
        consequences: {
          cashChange: 18000,
          kpiEffects: {
            oee: 1.8,
            otif: 1.2,
            defects: -15
          },
          moraleChanges: {
            marketing: 5,
            proceso: 8,
            logistica: 12
          },
          summaryMessage: 'El cliente aceptó la entrega escalonada. Evitaste multas, protegiste el margen y la cadena de suministro operó con estabilidad.'
        }
      },
      {
        id: 'rush_reject_protect_otif',
        text: 'Rechazar la orden adicional para blindar el cumplimiento OTIF de los clientes programados.',
        methodologyNote: 'Principio de Protección del Throughput Base y respeto a los compromisos de servicio (SLA).',
        consequences: {
          cashChange: -5000,
          kpiEffects: {
            otif: 3.5,
            oee: 0.5
          },
          moraleChanges: {
            marketing: -18,
            post_venta: 10,
            proceso: 6
          },
          summaryMessage: 'Rodrigo quedó molesto, pero tus clientes habituales recibieron sus pedidos al 100% a tiempo y con cero reclamos.'
        }
      }
    ]
  },
  {
    id: 'dilemma_vibration_bearing',
    dayTrigger: 2,
    hourTrigger: 11,
    unitId: 'mantenimiento',
    characterId: 'hernan',
    title: 'Alerta Temprana de Falla en Rodamiento del Reactor',
    urgency: 'CRITICA',
    scenarioDescription: 'Hernán (Mantenimiento) interrumpe la reunión con el reporte del acelerómetro: el rodamiento principal de la línea 1 presenta picos de vibración de 8.2 mm/s (norma ISO fija límite en 4.5 mm/s). Pronostica una probabilidad del 70% de engranamiento antes de las 18:00 hrs. Camila (Producción) insiste en que faltan 2.800 unidades para cumplir la meta del día.',
    choices: [
      {
        id: 'stop_now_preventive',
        text: 'Detener la línea inmediatamente para cambio programado de rodamiento (Parada de 2.5 horas).',
        methodologyNote: 'Mantenimiento Preventivo Basado en Condición (CBM) según normas RCM.',
        consequences: {
          cashChange: -4200,
          kpiEffects: {
            oee: -2.0,
            availability: 4.5,
            safety: 5
          },
          unitHealthChanges: {
            mantenimiento: 15,
            proceso: 8
          },
          moraleChanges: {
            mantenimiento: 16,
            proceso: -4
          },
          summaryMessage: 'La intervención fue limpia y profesional. Se descubrió una fisura interna que habría destruido el rotor principal.'
        }
      },
      {
        id: 'reduce_speed_finish_shift',
        text: 'Bajar la velocidad de la línea al 70%, inyectar lubricante sintético y cambiarlo en el turno nocturno.',
        methodologyNote: 'Degradación Grácil de Capacidad con monitoreo continuo de parámetros críticos.',
        consequences: {
          cashChange: -1500,
          kpiEffects: {
            oee: -1.2,
            performance: -4.0,
            availability: 1.0
          },
          moraleChanges: {
            mantenimiento: 4,
            proceso: 6
          },
          summaryMessage: 'La máquina resistió a velocidad moderada sin destruirse y el cambio se ejecutó en la noche sin perder el turno completo.'
        }
      },
      {
        id: 'push_full_throttle',
        text: 'Mantener la máquina al 100% de potencia para cumplir la cuota diaria; reparar después de las 18:00.',
        methodologyNote: 'Gestión de Riesgo Reactiva (apostar contra la curva de la bañera de confiabilidad).',
        consequences: {
          cashChange: -24000,
          kpiEffects: {
            oee: -9.5,
            availability: -12.0,
            defects: 350,
            safety: -10
          },
          unitHealthChanges: {
            proceso: -22,
            mantenimiento: -20
          },
          moraleChanges: {
            mantenimiento: -25,
            proceso: -15
          },
          summaryMessage: '¡El rodamiento se fundió a las 15:40! Bloqueó el eje de transmisión, generó humo en la nave y costó 14 horas de reparación de emergencia.'
        }
      }
    ]
  },
  {
    id: 'dilemma_qa_impurity',
    dayTrigger: 3,
    hourTrigger: 10,
    unitId: 'calidad',
    characterId: 'marcela',
    title: 'Discrepancia en Muestreo de Materia Prima Recibida',
    urgency: 'ALTA',
    scenarioDescription: 'Marcela (Calidad) te llama al laboratorio: el último cargamento de 40 toneladas de resina polimérica entregado por Don Roberto presenta un 1.8% de impurezas granulométricas (el límite contractual es 0.5%). Si se procesa tal cual, causará microporosidades en el envase terminado. Si se rechaza el lote completo, la línea se queda sin stock en 4 horas.',
    choices: [
      {
        id: 'reject_and_claim',
        text: 'Rechazar el lote por no conformidad, aplicar reclamo contractual y exigir reemplazo express al proveedor.',
        methodologyNote: 'Cero Defectos (Philip Crosby) y política estricta de Calidad en la Fuente.',
        consequences: {
          cashChange: -6000,
          kpiEffects: {
            qualityRate: 3.2,
            defects: -180,
            otif: -2.0
          },
          moraleChanges: {
            calidad: 18,
            recepcion: -8,
            proceso: -5
          },
          summaryMessage: 'Demostraste liderazgo en calidad. El proveedor asumió el flete de reposición urgente y evitaste miles de productos con fugas.'
        }
      },
      {
        id: 'blend_and_filter',
        text: 'Aceptar con concesión bajo condición de filtrado mecánico adicional y mezcla (blending) al 20% con stock virgen.',
        methodologyNote: 'Ingeniería de Procesos: Dilución de concentración y tamizado de contingencia.',
        consequences: {
          cashChange: -1800,
          kpiEffects: {
            oee: -1.0,
            defects: 40,
            qualityRate: 0.2
          },
          moraleChanges: {
            recepcion: 10,
            proceso: 5,
            calidad: -6
          },
          summaryMessage: 'El filtrado funcionó dentro de los márgenes mínimos de tolerancia sin parar la planta, aunque Marcela exigió auditoría al proveedor.'
        }
      },
      {
        id: 'accept_with_discount',
        text: 'Aceptar el lote negociando un 30% de descuento comercial y producir a toda marcha.',
        methodologyNote: 'Optimización de costo unitario a expensas de la capacidad de proceso (Cpk).',
        consequences: {
          cashChange: 8000,
          kpiEffects: {
            qualityRate: -5.0,
            defects: 520,
            otif: -4.5
          },
          moraleChanges: {
            calidad: -20,
            post_venta: -15
          },
          summaryMessage: 'Ganaste dinero en la compra, pero la tasa de scrap en planta se triplicó y Paulina de Post-Venta comenzó a recibir quejas por envases defectuosos.'
        }
      }
    ]
  },
  {
    id: 'dilemma_warehouse_saturation',
    dayTrigger: 4,
    hourTrigger: 14,
    unitId: 'producto_terminado',
    characterId: 'esteban',
    title: 'Saturación Crítica en Racks y Andenes de Almacén',
    urgency: 'ALTA',
    scenarioDescription: 'Esteban (Almacén PT) y Sofía (Despacho) sostienen una discusión en el pasillo de racks: la bodega llegó al 97% de su capacidad nominal. Los autoelevadores no pueden maniobrar con seguridad y las tarimas están invadiendo las zonas de tránsito peatonal de seguridad. Camila no puede seguir sacando producto terminado de la línea.',
    choices: [
      {
        id: 'rent_external_warehouse',
        text: 'Contratar bodega externa 3PL por 15 días y trasladar los lotes de baja rotación (Clase C).',
        methodologyNote: 'Descongestión Logística y liberación de valor mediante clasificación ABC de inventario.',
        consequences: {
          cashChange: -7500,
          kpiEffects: {
            oee: 2.5,
            leadTimeHours: -0.6,
            safety: 4
          },
          moraleChanges: {
            producto_terminado: 16,
            despacho: 12
          },
          summaryMessage: 'La bodega recuperó la fluidez operativa, se despejaron las vías de escape de emergencia y el despacho aceleró sus tiempos de ciclo.'
        }
      },
      {
        id: 'flash_sale_discount',
        text: 'Lanzar promoción comercial express del 12% para despachar inmediatamente los 500 pallets acumulados.',
        methodologyNote: 'Monetización acelerada de inventario inmovilizado para reducir el Costo de Posesión (Holding Cost).',
        consequences: {
          cashChange: 22000,
          kpiEffects: {
            inventory: -20,
            otif: 1.5
          },
          moraleChanges: {
            marketing: 14,
            producto_terminado: 10
          },
          summaryMessage: 'Tres grandes distribuidores aprovecharon la oportunidad y vaciaron los racks en 24 horas, inyectando liquidez a la empresa.'
        }
      },
      {
        id: 'stack_higher_corridors',
        text: 'Habilitar almacenamiento temporal en pasillos laterales apilando a 4 niveles de altura.',
        methodologyNote: 'Uso de espacio de contingencia sin costo financiero directo pero con riesgo operacional elevado.',
        consequences: {
          cashChange: 0,
          kpiEffects: {
            safety: -8,
            otif: -3.0
          },
          moraleChanges: {
            producto_terminado: -14,
            despacho: -10
          },
          summaryMessage: 'Una tarima inestable cayó rozando a un operador de grúa horquilla. Se activó el comité paritario y hubo atrasos por maniobras lentas.'
        }
      }
    ]
  },
  {
    id: 'dilemma_post_sales_leak',
    dayTrigger: 5,
    hourTrigger: 9,
    unitId: 'post_venta',
    characterId: 'paulina',
    title: 'Reclamos Masivos por Falla de Sellado en Supermercados',
    urgency: 'CRITICA',
    scenarioDescription: 'Paulina (Post-Venta) convoca a reunión urgente con el Comité Operativo: 4 cadenas de retail reportan que los envases de jugo prensado presentan microfiltraciones en la tapa al apilarse en góndola. Hay riesgo de retiro preventivo (recall) en medios de comunicación. Camila y Hernán creen que la temperatura de la selladora térmica fluctuó por falta de calibración en el sensor PID.',
    choices: [
      {
        id: 'proactive_recall_8d',
        text: 'Declarar retiro preventivo voluntario del lote #408, reemplazarlo sin costo y activar Metodología 8D.',
        methodologyNote: 'Gestión Proactiva de Crisis, Protección del Brand Equity y Análisis Causa Raíz (Ishikawa / 5-Porqués).',
        consequences: {
          cashChange: -16000,
          kpiEffects: {
            qualityRate: 4.0,
            defects: -250,
            otif: 2.0
          },
          moraleChanges: {
            post_venta: 20,
            calidad: 12,
            marketing: 8
          },
          summaryMessage: 'Los clientes destacaron la transparencia y madurez de la empresa. El análisis 8D identificó el termopar defectuoso y blindó el proceso.'
        }
      },
      {
        id: 'silent_inspection_in_store',
        text: 'Enviar cuadrillas de calidad a inspeccionar y re-etiquetar solo en los supermercados que reclamen.',
        methodologyNote: 'Contención localizada para minimizar desembolsos inmediatos.',
        consequences: {
          cashChange: -5000,
          kpiEffects: {
            qualityRate: -1.5,
            otif: -2.5
          },
          moraleChanges: {
            post_venta: -10,
            calidad: -8
          },
          summaryMessage: 'Ahorraste dinero en el retiro masivo, pero un video en redes sociales mostró un producto goteando y el NPS cayó 15 puntos.'
        }
      },
      {
        id: 'blame_transporter',
        text: 'Atribuir la falla a mal manejo del transporte de los distribuidores y desestimar las garantías comerciales.',
        methodologyNote: 'Evasión de responsabilidad operativa que rompe la relación de confianza cliente-proveedor.',
        consequences: {
          cashChange: 0,
          kpiEffects: {
            otif: -8.0,
            qualityRate: -3.0
          },
          moraleChanges: {
            post_venta: -25,
            marketing: -22
          },
          summaryMessage: 'Una de las grandes cadenas canceló su contrato anual. La pérdida futura de ventas superará con creces el costo del sellado.'
        }
      }
    ]
  },
  {
    id: 'dilemma_smed_kaizen',
    dayTrigger: 6,
    hourTrigger: 10,
    unitId: 'proceso',
    characterId: 'camila',
    title: 'Propuesta Kaizen: Implementar SMED en Cambio de Formato',
    urgency: 'MODERADA',
    scenarioDescription: 'Camila (Producción) y Hernán (Mantenimiento) prepararon un proyecto conjunto: actualmente cambiar de producto A a producto B demora 110 minutos de máquina detenida. Con una inversión en herramientas de anclaje rápido, carros estandarizados y capacitación SMED (Single-Minute Exchange of Die), proyectan reducir el cambio a 22 minutos.',
    choices: [
      {
        id: 'approve_full_smed',
        text: 'Aprobar la inversión completa ($12.000) y detener la línea 4 horas este sábado para el evento Kaizen.',
        methodologyNote: 'Lean Manufacturing: SMED para convertir tareas internas en externas y aumentar la flexibilidad (Lote Pequeño).',
        consequences: {
          cashChange: -12000,
          kpiEffects: {
            oee: 4.8,
            availability: 5.5,
            performance: 3.2
          },
          moraleChanges: {
            proceso: 22,
            mantenimiento: 18,
            logistica: 10
          },
          summaryMessage: '¡Éxito rotundo! El tiempo de cambio bajó a 18 minutos. La planta ahora puede fabricar lotes pequeños con alta flexibilidad y bajo WIP.'
        }
      },
      {
        id: 'pilot_only_no_budget',
        text: 'Aprobar solo el procedimiento estándar sin comprar herramientas nuevas (cero presupuesto de capital).',
        methodologyNote: 'Estandarización básica del trabajo (SOP) sin modificación técnica del herramental.',
        consequences: {
          cashChange: 0,
          kpiEffects: {
            oee: 1.2,
            availability: 1.5
          },
          moraleChanges: {
            proceso: 5,
            mantenimiento: 2
          },
          summaryMessage: 'El tiempo se redujo a 85 minutos mediante orden y 5S, pero el cuello de botella mecánico sigue limitando la capacidad.'
        }
      },
      {
        id: 'postpone_kaizen',
        text: 'Rechazar la propuesta y concentrarse únicamente en el tonelaje bruto diario sin interrupciones.',
        methodologyNote: 'Enfoque tradicional de producción en masa con lotes gigantescos para amortizar cambios lentos.',
        consequences: {
          cashChange: 0,
          kpiEffects: {
            leadTimeHours: 1.5,
            oee: -1.0
          },
          moraleChanges: {
            proceso: -12,
            mantenimiento: -8
          },
          summaryMessage: 'Desmotivaste a los líderes de ingeniería. El inventario de producto intermedio siguió creciendo y la agilidad comercial se estancó.'
        }
      }
    ]
  },
  {
    id: 'dilemma_bullwhip_forecast',
    dayTrigger: 7,
    hourTrigger: 11,
    unitId: 'logistica',
    characterId: 'felipe',
    title: 'Discrepancia S&OP: El Efecto Látigo en Compras',
    urgency: 'ALTA',
    scenarioDescription: 'Felipe (Supply Chain) convoca a Rodrigo (Marketing) y Don Roberto (Recepción). Rodrigo proyectó un alza del 40% en ventas basándose en una encuesta preliminar. Felipe calculó órdenes de compra multiplicadas por 1.6 con los proveedores marítimos, pero las ventas reales en caja solo crecieron un 5%. Si no corregimos las órdenes ahora, llegarán 14 contenedores de insumos que consumirán toda la liquidez.',
    choices: [
      {
        id: 'sop_sync_vmi',
        text: 'Alinear formalmente el Comité S&OP semanal, renegociar plazos con proveedores e implantar VMI (Vendor-Managed Inventory).',
        methodologyNote: 'Sincronización de la Cadena de Suministro (CPFR) eliminando distorsión de información (Efecto Látigo).',
        consequences: {
          cashChange: 15000,
          kpiEffects: {
            inventory: -15,
            otif: 2.0
          },
          moraleChanges: {
            logistica: 18,
            marketing: 8,
            recepcion: 12
          },
          summaryMessage: 'Frenaste las compras innecesarias a tiempo, liberaste $15.000 en flujo de caja y consolidaste una alianza VMI con los proveedores clave.'
        }
      },
      {
        id: 'cancel_with_penalty',
        text: 'Cancelar de golpe la mitad de las órdenes marítimas asumiendo una multa de cancelación con los armadores.',
        methodologyNote: 'Corte de pérdidas financiero inmediato para proteger el capital de trabajo.',
        consequences: {
          cashChange: -8500,
          kpiEffects: {
            inventory: -8
          },
          moraleChanges: {
            recepcion: -6,
            logistica: -4
          },
          summaryMessage: 'Evitaste la saturación de patios de almacenamiento pero perdiste condiciones preferenciales de flete por la cancelación unilateral.'
        }
      },
      {
        id: 'let_them_arrive',
        text: 'Recibir todos los contenedores y confiar en que Marketing venderá el excedente en los próximos meses.',
        methodologyNote: 'Apuesta especulativa de inventario que incrementa el costo de capital inmovilizado.',
        consequences: {
          cashChange: -35000,
          kpiEffects: {
            inventory: 35,
            leadTimeHours: 1.8
          },
          moraleChanges: {
            logistica: -15,
            producto_terminado: -12
          },
          summaryMessage: 'La caja de la compañía quedó al borde del colapso, los costos de demurrage en puerto aumentaron y hubo que pedir un crédito de emergencia.'
        }
      }
    ]
  }
];
