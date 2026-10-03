import { Dilemma, DilemmaChoice, ProcessTypeId, MachineDefinition } from '../types/game';

// =========================================================================
// BIBLIOTECA DE CONTINGENCIAS Y DILEMAS OPERACIONALES POR PLANTA / PROCESO
// Específicos para cada tipo de manufactura con opiniones profundas de cada NPC.
// Sin spoilers de números de impacto en la toma de decisión.
// =========================================================================

export const DILEMMAS_LIBRARY: Dilemma[] = [
  // =======================================================================
  // 1. PROCESO: ALIMENTOS CONTINUOS (Panificación, Snacks, Cereales)
  // =======================================================================
  {
    id: 'alim_dilemma_humedad_harina',
    processTypeId: 'ALIMENTOS_CONTINUOS',
    unitId: 'recepcion',
    characterId: 'roberto',
    title: 'Lote de Harina con Humedad Crítica en Silos (Riesgo Microbiológico)',
    urgency: 'CRITICA',
    scenarioDescription: 'Don Roberto (Recepción) y la Dra. Marcela (Calidad) detienen la descarga de materia prima: el cargamento de 30 toneladas de harina de trigo presenta 15.8% de humedad (especificación máxima HACCP es 14.0%). Si entra a los silos y a la amasadora continua, la masa se apelmazará en los sinfines y hay riesgo inminente de micotoxinas y moho. Camila (Producción) advierte que no hay harina de reserva suficiente para sostener el Horno Túnel encendido más de 2 horas.',
    choices: [
      {
        id: 'alim_rechazar_parar',
        text: 'Rechazar el camión de inmediato, exigir lote de reemplazo prioritario a Molinos del Sur y detener preventivamente el amasado.',
        methodologyNote: 'Inocuidad alimentaria irrestricta bajo estándar HACCP / FSSC 22000.',
        npcOpinions: {
          roberto: 'El transportista va a patalear en la romana, pero el certificado de origen no cumple la humedad pactada en el contrato marco. Legalmente podemos retener el pago sin pagar sobrestadía.',
          marcela: 'Respaldó 100% esta postura. Si ingresamos harina con 15.8% de humedad, arriesgamos proliferación fúngica y un recall sanitario en supermercados que destruiría la marca.',
          camila: 'Significa apagar la amasadora continua y dejar el Horno Túnel en vacío durante 3 horas. Perderemos unas 4.200 cajas en el turno y la meta del día se nos escapa.',
          hernan: 'Detener y reencender el horno túnel genera choque térmico en los ladrillos refractarios y un gasto extra de gas licuado, pero peor sería que la masa gomosa trabe las cuchillas rotativas.',
          felipe: 'Puedo presionar a Molinos del Sur para despachar un camión cisterna express desde su bodega regional en 2.5 horas si autorizamos el flete urgente.',
          rodrigo: 'Walmart y Cencosud esperan el despacho de galletas a las 16:00 hrs. Un retraso nos dejará al filo de multas por fill-rate incumplido.',
          esteban: 'Tenemos un colchón de 480 cajas en racks de producto terminado que pueden amortiguar los primeros pedidos del turno de la tarde.',
          sofia: 'Los camiones de reparto tendrán que reprogramar sus rutas para salir en la ventana nocturna si el producto sale con retraso.',
          paulina: 'Mil veces preferible esperar que recibir reclamos de padres de familia por galletas con sabor rancio o moho superficial.'
        },
        consequences: {
          cashChange: -12000,
          kpiEffects: { oee: -3.8, qualityRate: 4.2, otif: -2.5, defects: -40 },
          moraleChanges: { recepcion: 8, calidad: 15, proceso: -6, marketing: -10 },
          summaryMessage: 'Rechazaste la materia prima no conforme. La línea se detuvo 2.5 horas, pero evitaste un colapso de inocuidad en góndola.'
        }
      },
      {
        id: 'alim_mezclar_lotes',
        text: 'Aceptar el lote con 25% de castigo en precio y dosificarlo en proporción 30/70 mezclándolo con harina seca de reserva.',
        methodologyNote: 'Técnica de homogeneización (blending) controlada en tolva de microingredientes.',
        npcOpinions: {
          roberto: 'Financieramente es un gol: el proveedor nos abonará una nota de crédito sustantiva por el bache fuera de estándar.',
          marcela: 'Solo lo tolero bajo condición de que el laboratorio mida la actividad de agua (Aw) cada 20 minutos. Si Aw sube de 0.65, detengo la línea de inmediato.',
          camila: 'Nos permite mantener el Horno Túnel alimentado sin paradas térmicas, aunque los operarios deberán ajustar a mano la dosificación de agua en la amasadora.',
          hernan: 'Habrá que limpiar los sinfines y filtros de mangas con más frecuencia al final del turno para que no se formen costras endurecidas.',
          felipe: 'Excelente para el flujo de caja y no rompemos la rotación de materias primas en el almacén de recepción.',
          rodrigo: 'Los supermercados recibirán su producto a tiempo; comercialmente nos salvamos de penalizaciones.',
          paulina: 'Si la textura de la masa cambia y las barras quedan más blandas o gomosas, el consumidor habitual lo notará.'
        },
        consequences: {
          cashChange: 8500,
          kpiEffects: { oee: 1.2, qualityRate: -1.5, performance: 0.8, defects: 25 },
          moraleChanges: { recepcion: 4, calidad: -4, proceso: 6, marketing: 8 },
          summaryMessage: 'El blending mantuvo el horno alimentado y capturaste un descuento comercial, con una ligera dispersión en la textura final.'
        }
      },
      {
        id: 'alim_procesar_ajustar_horno',
        text: 'Ingresar la harina tal cual y elevar 15°C las primeras dos zonas del Horno Túnel para evaporar el exceso de agua durante la cocción.',
        methodologyNote: 'Ajuste empírico de variables térmicas en proceso continuo sin validación bromatológica.',
        npcOpinions: {
          camila: 'Es una ruleta rusa. Subir la temperatura a 255°C tostará la superficie del producto antes de que el centro termine de cocerse.',
          marcela: 'Me niego a avalar esto. El almidón no gelatinizará adecuadamente y el producto quedará crudo por dentro y carbonizado por fuera.',
          hernan: 'Forzar los quemadores modulantes de gas al 100% recalentará las toberas y quemará las juntas de expansión de la cámara.',
          rodrigo: 'A mí me interesa que los pallets salgan hoy al centro de distribución. El empaque opaco disimula el tostado.',
          sofia: 'Cargar cajas con galletas aún calientes generará condensación y gotas de agua dentro del film flow-pack.'
        },
        consequences: {
          cashChange: -18500,
          kpiEffects: { oee: -2.1, qualityRate: -6.5, scrapPpm: 180, safety: -2 },
          moraleChanges: { calidad: -18, proceso: -8, marketing: 2 },
          summaryMessage: 'La masa se tostó despareja en el horno y el empaque se llenó de condensación interna. Se descartaron 2.400 paquetes.'
        }
      }
    ]
  },
  {
    id: 'alim_dilemma_detector_metales',
    processTypeId: 'ALIMENTOS_CONTINUOS',
    unitId: 'calidad',
    characterId: 'marcela',
    title: 'Desvío en Detector de Rayos X & Rechazos en Línea de Empaque',
    urgency: 'CRITICA',
    scenarioDescription: 'La Dra. Marcela (Calidad) activa la alarma en sala de envasado: el detector de rayos X y separador de metales de la salida de empaque ha expulsado 14 paquetes consecutivos con indicación de partícula ferrosa de 1.5 mm. Camila (Producción) argumenta que puede ser un falso positivo por descalibración tras el cambio de formato, pero Hernán (Mantenimiento) sospecha que una guía de la cinta de enfriamiento se soltó hace una hora.',
    choices: [
      {
        id: 'alim_bloquear_lote_parar',
        text: 'Detener la línea de empaque, poner en cuarentena los últimos 8 pallets y desarmar la cinta de enfriamiento para inspección física.',
        methodologyNote: 'Protocolo de Contención de Punto Crítico de Control (PCC HACCP) y Causa Raíz 5 Porqués.',
        npcOpinions: {
          marcela: 'Es la única conducta profesional admisible. Si una esquirla llega a un niño en un desayuno escolar, la empresa enfrenta juicio penal.',
          hernan: 'Desarmaré los rodillos de la cinta de enfriamiento de inmediato. Con imán de neodimio confirmamos si falta algún perno métrico M6.',
          camila: 'Detener la línea ahora nos cuesta 1.800 unidades de atraso, pero el riesgo sanitario no tiene discusión.',
          esteban: 'Pondré precinto rojo a los 8 pallets en el almacén de producto terminado para que nadie los cargue por error.',
          rodrigo: 'Avisaré a los clientes de un desfase de 90 minutos por "control preventivo de calidad". Es mejor que un escándalo de prensa.'
        },
        consequences: {
          cashChange: -6000,
          kpiEffects: { oee: -2.2, qualityRate: 5.0, defects: -90, otif: -1.0 },
          moraleChanges: { calidad: 16, mantenimiento: 10, proceso: -2 },
          summaryMessage: 'Hernán encontró el perno suelto atrapado en el túnel. Retuviste el lote contaminado y blindaste la inocuidad de la planta.'
        }
      },
      {
        id: 'alim_recalibrar_continuar',
        text: 'Asumir descalibración del sensor por el film metalizado, bajar la sensibilidad a 2.5 mm y reprocesar los paquetes rechazados.',
        methodologyNote: 'Hipótesis de falso positivo por sensibilidad electromagnética sin confirmación física.',
        npcOpinions: {
          marcela: '¡Advertencia crítica! Si relajamos la sensibilidad a 2.5 mm, cualquier viruta metálica de menor tamaño pasará directo al consumidor.',
          camila: 'A veces el film bilaminado con aluminio engaña al campo electromagnético. No quiero frenar el empaque si es una falsa alarma.',
          hernan: 'Si no revisamos la máquina física primero, estamos barriendo la basura bajo la alfombra mecánica.',
          paulina: 'Una sola queja con foto en redes sociales destruye la reputación que costó años construir.',
          rodrigo: 'Si despachamos a tiempo no hay multas comerciales, pero si salta algo en prensa nos destruye.'
        },
        consequences: {
          cashChange: -24000,
          kpiEffects: { oee: 0.8, qualityRate: -8.0, scrapPpm: 240, customerNps: -18 },
          moraleChanges: { calidad: -20, post_venta: -15, marketing: -12 },
          summaryMessage: 'Dos paquetes con esquirlas llegaron a la distribuidora. Se desató un reclamo de cliente de alta gravedad y auditoría externa.'
        }
      }
    ]
  },
  {
    id: 'alim_dilemma_rotura_malla_horno',
    processTypeId: 'ALIMENTOS_CONTINUOS',
    unitId: 'proceso',
    characterId: 'hernan',
    title: 'Fatiga Térmica & Fisura en Malla Transportadora del Horno Túnel a 230°C',
    urgency: 'CRITICA',
    scenarioDescription: 'Don Hernán (Mantenimiento) alerta desde la nave central: la malla de acero inoxidable que arrastra la masa por dentro del Horno Túnel continuo presenta un eslabón fisurado que se está enganchando en la rampa de salida. Si la malla se corta adentro a 230°C, el horno quedará atascado con cientos de kilos de producto quemándose.',
    choices: [
      {
        id: 'alim_empalme_urgente_malla',
        text: 'Enfriar el horno a 60°C con extractores auxiliares, realizar empalme rápido de la malla con pasador reforzado (Parada de 2.5 horas).',
        methodologyNote: 'Intervención rápida focalizada bajo protocolo de mantenimiento en caliente seguro.',
        npcOpinions: {
          hernan: 'Con dos técnicos con trajes aluminizados podemos colocar el eslabón de unión en 2.5 horas una vez que el extractor baje los humos.',
          camila: '2.5 horas de parada en el cuello de botella afectará la producción del turno, pero un corte total adentro significaría 2 días de parálisis.',
          marcela: 'Deberemos descartar los 15 metros de masa que quedaron atrapados adentro del túnel durante el enfriamiento por sobrecocción.',
          rodrigo: 'Podemos aplazar los envíos de exportación 3 horas y cumplir con el mercado local primero.'
        },
        consequences: {
          cashChange: -4500,
          kpiEffects: { oee: -2.5, availability: -3.0, qualityRate: 2.0 },
          moraleChanges: { mantenimiento: 12, proceso: 4 },
          summaryMessage: 'El equipo de mantenimiento empalmó la malla a tiempo. Evitaste un desastre de atascamiento en el corazón del horno.'
        }
      },
      {
        id: 'alim_apurar_fin_turno',
        text: 'Reducir la tensión de la malla un 10%, rociar lubricante térmico y arriesgarse a terminar el turno antes de reparar.',
        methodologyNote: 'Operación al límite de fatiga mecánica posponiendo la parada crítica.',
        npcOpinions: {
          hernan: 'Es suicidio mecánico. El eslabón tiene una microfisura que con la dilatación térmica se abrirá en cualquier instante.',
          camila: 'Terminar el turno nos garantizaría cumplir las 12.000 unidades, pero el riesgo de corte total es inmenso.',
          marcela: 'El lubricante térmico cerca del producto cocido puede emitir vapores con olor químico que impregnen la masa.'
        },
        consequences: {
          cashChange: -28000,
          kpiEffects: { oee: -7.5, availability: -10.0, scrapPpm: 310 },
          moraleChanges: { mantenimiento: -20, proceso: -12 },
          summaryMessage: 'La malla se cortó violentamente a mitad del horno a las 14:20 hrs. 400 kg de galletas se calcinaron y el túnel quedó bloqueado.'
        }
      }
    ]
  },
  {
    id: 'alim_dilemma_alergenos_traza',
    processTypeId: 'ALIMENTOS_CONTINUOS',
    unitId: 'calidad',
    characterId: 'marcela',
    title: 'Sospecha de Contaminación Cruzada por Alérgenos (Trazas de Maní/Soja)',
    urgency: 'ALTA',
    scenarioDescription: 'Dra. Marcela (Calidad) detecta que durante el cambio de producto de "Barra Energética Maní" a "Cereal Tradicional Libre de Alérgenos", el operador de la tolva no ejecutó el protocolo de hisopado ATP de alérgenos. Hay 6.000 paquetes ya sellados con rótulo "Libre de Frutos Secos". Si contienen trazas no declaradas, existe riesgo de shock anafiláctico en consumidores alérgicos.',
    choices: [
      {
        id: 'alim_bloquear_hisopado_pcr',
        text: 'Retener los 6.000 paquetes, enviar hisopados urgentes a análisis PCR cuantitativo y limpiar a fondo la tolva.',
        methodologyNote: 'Gestión estricta de alérgenos alimentarios bajo normativa de etiquetado y seguridad de la salud.',
        npcOpinions: {
          marcela: 'No hay alternativa ética. Un alérgeno no declarado es causal de clausura sanitaria y daño irreversible.',
          camila: 'La limpieza a fondo y el retraso del lote nos quitará 90 minutos, pero capacitaré al operador en el procedimiento estándar.',
          paulina: 'Si este producto llega a un niño alérgico, el resultado puede ser fatal y la demanda multimillonaria.',
          rodrigo: 'Acepto la demora con el cliente minorista; la seguridad del consumidor es la prioridad número uno de la compañía.'
        },
        consequences: {
          cashChange: -3800,
          kpiEffects: { oee: -1.2, qualityRate: 4.8, customerNps: 5 },
          moraleChanges: { calidad: 14, post_venta: 10, proceso: -2 },
          summaryMessage: 'El análisis PCR confirmó trazas leves de maní. El lote fue reetiquetado como producto con alérgenos y salvaste la vida de clientes.'
        }
      },
      {
        id: 'alim_liberar_confianza_limpieza',
        text: 'Confiar en el soplado de aire que hizo el operador, asumir que las trazas son despreciables y despachar el lote.',
        methodologyNote: 'Omisión de barrera analítica asumiendo dilución por flujo continuo.',
        npcOpinions: {
          marcela: '¡Es una negligencia gravísima! El soplado con aire no remueve las proteínas oleosas del maní pegadas al acero inoxidable.',
          camila: 'Es una decisión muy riesgosa; el operador admitió que lo hizo apurado porque terminaba su turno.',
          rodrigo: 'Nos evitamos la molestia de explicarle el retraso a Falabella y Walmart, pero cruzaremos los dedos.',
          paulina: 'Si recibimos un llamado de un hospital, la carrera de todos los que estamos en esta mesa se habrá terminado.'
        },
        consequences: {
          cashChange: -42000,
          kpiEffects: { oee: 0.5, qualityRate: -18.0, customerNps: -35 },
          moraleChanges: { calidad: -25, post_venta: -20, marketing: -15 },
          summaryMessage: 'Un consumidor infantil sufrió una reacción alérgica severa. Alerta sanitaria nacional, recall masivo y multa histórica.'
        }
      }
    ]
  },

  // =======================================================================
  // 2. PROCESO: ENVASES & COMPONENTES DE ALTA PRECISIÓN (Inyección, Termoformado)
  // =======================================================================
  {
    id: 'env_dilemma_rebaba_molde',
    processTypeId: 'ENVASES_PRECISION',
    unitId: 'proceso',
    characterId: 'camila',
    title: 'Aparición de Rebaba (Flash) en Molde de Inyección de 48 Cavidades',
    urgency: 'ALTA',
    scenarioDescription: 'Camila (Producción) muestra una pieza recién expulsada: las cavidades 12, 14 y 33 presentan rebaba plástica de 0.15 mm en la línea de partición del molde. Dra. Marcela indica que el cliente farmacéutico rechazará los envases porque la rebaba impide el cierre hermético del tapón. Hernán (Mantenimiento) calcula que bajar el molde para rectificar placas en taller tomará 5 horas completas.',
    choices: [
      {
        id: 'env_bajar_molde_rectificar',
        text: 'Detener la inyectora 650T, desmontar el molde y realizar rectificado de precisión de la línea de partición.',
        methodologyNote: 'Mantenimiento Correctivo Mayor de Matrices de Alta Precisión (SMED & Tooling).',
        npcOpinions: {
          hernan: 'Es lo correcto. Las columnas guía y los insertos tienen desgaste por fatiga. Rectificamos en banco y dejamos el molde como nuevo.',
          camila: 'Son 5 horas de parada en el cuello de botella. Perderemos 5.500 piezas técnicas que ya estaban comprometidas en el plan.',
          marcela: 'Aplaudo la decisión. Mandar piezas con rebaba a la industria médica nos costaría la certificación ISO 13485.',
          esteban: 'Tenemos un stock de seguridad de 3.200 piezas en el almacén vertical. Amortiguará parte de los despachos de hoy.',
          rodrigo: 'Tendré que dar explicaciones al laboratorio comprador, pero si les garantizo cero defectos lo aceptarán.'
        },
        consequences: {
          cashChange: -8500,
          kpiEffects: { oee: -4.5, qualityRate: 6.2, performance: -3.0, availability: -2.8 },
          moraleChanges: { mantenimiento: 14, calidad: 12, proceso: -8 },
          summaryMessage: 'El molde quedó perfectamente ajustado a cero rebaba. La parada dolió en producción pero salvaste la cuenta médica.'
        }
      },
      {
        id: 'env_bloquear_cavidades',
        text: 'Bloquear mecánicamente las 3 cavidades defectuosas con tapones ciegos y continuar produciendo a 45 cavidades.',
        methodologyNote: 'Estrategia de degradación grácil (Graceful Degradation) para preservar throughput en restricción.',
        npcOpinions: {
          camila: 'Excelente compromiso técnico. En 30 minutos Hernán coloca los obturadores y volvemos a inyectar al 93.7% de capacidad.',
          hernan: 'Puedo taponar las boquillas del canal caliente de esas cavidades. Es seguro temporalmente, pero aumentará la presión en las 45 restantes.',
          marcela: 'Aceptable siempre que reajustemos el peso de inyección y verifiquemos que las 45 cavidades activas no reciban sobrepresión.',
          rodrigo: 'Perfecto, mantendremos el flujo de entrega al 90% y no perderemos el turno de despacho de la tarde.'
        },
        consequences: {
          cashChange: -2000,
          kpiEffects: { oee: 1.5, performance: -0.6, qualityRate: 1.8, defects: -10 },
          moraleChanges: { proceso: 10, marketing: 6, calidad: 4 },
          summaryMessage: 'Bloqueaste las cavidades desgastadas. La inyectora operó con estabilidad y mantuviste el 94% del flujo diario.'
        }
      },
      {
        id: 'env_aumentar_presion_cierre',
        text: 'Aumentar la fuerza de cierre de la inyectora de 550 a 650 Toneladas para forzar el sellado del molde.',
        methodologyNote: 'Sobrecarga de tonelaje en máquina para compensar holgura dimensional de matriz.',
        npcOpinions: {
          hernan: '¡Ni se te ocurra! Si sobrecargas el sistema de rodilleras y tirantes a 650T continuas, vas a deformar los platos fijos.',
          camila: 'Es una solución rápida de 2 minutos en el panel PLC, pero si el molde no asienta parejo el daño será exponencial.',
          marcela: 'Aumentar fuerza de cierre puede generar colapso de venteos y atrapar aire, provocando quemaduras (diesel effect) en la resina.'
        },
        consequences: {
          cashChange: -32000,
          kpiEffects: { oee: -6.0, availability: -8.0, safety: -4 },
          unitHealthChanges: { proceso: -25, mantenimiento: -20 },
          moraleChanges: { mantenimiento: -22, proceso: -12 },
          summaryMessage: 'Un tirante de la inyectora se fisuró por exceso de tonelaje. Máquina detenida en emergencia con alto costo de reparación.'
        }
      }
    ]
  },
  {
    id: 'env_dilemma_warpage_chiller',
    processTypeId: 'ENVASES_PRECISION',
    unitId: 'mantenimiento',
    characterId: 'hernan',
    title: 'Alza de Temperatura en Chiller & Deformación Térmica (Warpage)',
    urgency: 'ALTA',
    scenarioDescription: 'Don Hernán (Mantenimiento) advierte que el Chiller de refrigeración de moldes está perdiendo gas refrigerante: la temperatura del agua de retorno subió de 8°C a 14.5°C. A esa temperatura, los envases tardan más en solidificar y salen con alabeo (warpage) fuera de la tolerancia de planeidad. Camila pide prolongar el tiempo de enfriamiento en el molde de 3 a 5 segundos para compensar.',
    choices: [
      {
        id: 'env_aumentar_tiempo_ciclo',
        text: 'Prolongar el tiempo de ciclo en 2 segundos mientras Hernán recarga gas en el chiller en paralelo.',
        methodologyNote: 'Compensación termodinámica de ciclo a costa de rendimiento temporal (OEE Performance).',
        npcOpinions: {
          camila: 'El ciclo subirá de 6.2 a 8.2 segundos. Nuestra tasa caerá un 24%, pero las piezas saldrán frías y planas.',
          hernan: 'Me da 2 horas para buscar la fuga con detector electrónico y recargar 4 kg de refrigerante R410A.',
          marcela: 'Revisaré la planeidad con el proyector de perfiles cada 30 minutos para validar que no haya alabeo.',
          rodrigo: 'La caída de producción dolerá en la meta diaria, pero al menos no paramos en seco.'
        },
        consequences: {
          cashChange: -3500,
          kpiEffects: { oee: -2.5, performance: -3.8, qualityRate: 2.1 },
          moraleChanges: { mantenimiento: 8, proceso: 2, calidad: 6 },
          summaryMessage: 'Hernán selló la microfuga del condensador. Salvaste la calidad geométrica asumiendo una menor cadencia temporal.'
        }
      },
      {
        id: 'env_parada_inmediata_chiller',
        text: 'Detener la producción completa durante 90 minutos para reparación definitiva del chiller.',
        methodologyNote: 'Parada preventiva bajo filosofía TPM de restitución de condiciones operativas originales.',
        npcOpinions: {
          hernan: 'Prefiero parar 90 minutos y hacer vacío con bomba antes de cargar. Garantizo que el chiller quede al 100%.',
          camila: 'Perdemos 1.650 piezas en el parón, pero volvemos al ciclo nominal de 6.2s inmediatamente después.',
          marcela: 'Cero riesgo de piezas defectuosas en bodega.'
        },
        consequences: {
          cashChange: -5000,
          kpiEffects: { oee: -3.0, availability: -2.5, qualityRate: 4.0 },
          moraleChanges: { mantenimiento: 12, calidad: 8, proceso: -4 },
          summaryMessage: 'Reparación limpia y presurización completada. El chiller retornó a 7.8°C y la línea retomó su velocidad máxima.'
        }
      }
    ]
  },
  {
    id: 'env_dilemma_desgaste_husillo',
    processTypeId: 'ENVASES_PRECISION',
    unitId: 'proceso',
    characterId: 'camila',
    title: 'Pérdida de Presión de Inyección por Resina Reciclada Abrasiva',
    urgency: 'ALTA',
    scenarioDescription: 'Camila (Producción) nota que la inyectora 650T no alcanza la presión de sostenimiento de 1.400 bar: el último lote de resina reciclada post-consumo (PCR) contenía cargas minerales abrasivas que desgastaron la válvula antirretorno y la punta del husillo bimetálico. Las piezas salen con rechupes (sink marks) e incompletas.',
    choices: [
      {
        id: 'env_cambiar_punta_husillo',
        text: 'Parar 3 horas para reemplazar la válvula antirretorno de tres piezas con el kit de aleación endurecida en pañol.',
        methodologyNote: 'Sustitución de componentes de plastificación sometidos a desgaste abrasivo.',
        npcOpinions: {
          hernan: 'Tenemos una punta de husillo de carburo de tungsteno en pañol. La cambiamos en 3 horas y recuperamos la estanqueidad hidráulica.',
          camila: 'Paramos ahora antes de seguir inyectando piezas con rechupes que solo terminarán como chatarra.',
          marcela: 'Medí el peso de pieza y está 1.8 gramos por debajo de la norma técnica. El cambio de punta es inaplazable.'
        },
        consequences: {
          cashChange: -4200,
          kpiEffects: { oee: -2.0, qualityRate: 5.5, scrapPpm: -80 },
          moraleChanges: { mantenimiento: 10, calidad: 8, proceso: 2 },
          summaryMessage: 'Se instaló la punta de carburo endurecido. La inyectora recuperó los 1.400 bar de presión y desaparecieron los rechupes.'
        }
      },
      {
        id: 'env_subir_dosificacion_temperatura',
        text: 'Compensar subiendo 20°C la temperatura del cilindro de inyección y aumentar el volumen de dosificación (shot size).',
        methodologyNote: 'Paliativo de sobrecalentamiento para reducir viscosidad aparente del polímero.',
        npcOpinions: {
          camila: 'Esto degradará térmicamente las cadenas moleculares del plástico; las piezas quedarán quebradizas.',
          hernan: 'La fuga de resina hacia atrás continuará carcomiendo el interior del cañón bimetálico.',
          marcela: 'El tiempo de enfriamiento se disparará y el color virará a amarillento por oxidación térmica.'
        },
        consequences: {
          cashChange: -16000,
          kpiEffects: { oee: -3.5, qualityRate: -9.0, defects: 65 },
          moraleChanges: { calidad: -14, proceso: -10 },
          summaryMessage: 'Las piezas salieron con degradación térmica y fragilidad en impacto. Un cliente devolvió un pallet completo de tapas fracturadas.'
        }
      }
    ]
  },
  {
    id: 'env_dilemma_sala_limpia_particulas',
    processTypeId: 'ENVASES_PRECISION',
    unitId: 'calidad',
    characterId: 'marcela',
    title: 'Conteo Anormal de Partículas en Sala Limpia ISO 8 de Empaque',
    urgency: 'ALTA',
    scenarioDescription: 'La Dra. Marcela (Calidad) detiene el envasado médico: el contador óptico de partículas en el aire de la sala limpia ISO 8 marcó 380.000 partículas/m³ (límite máximo permitido es 352.000). Sospecha que la esclusa de vestuario de operarios tiene una junta de goma rota o que el filtro HEPA terminal está saturado.',
    choices: [
      {
        id: 'env_auditar_hepa_presion',
        text: 'Detener el ingreso a sala limpia, revisar el manómetro diferencial de los filtros HEPA y cambiar prefiltros de aire.',
        methodologyNote: 'Control ambiental en manufactura farmacéutica bajo estándar ISO 14644.',
        npcOpinions: {
          marcela: 'No podemos tolerar contaminación particulada en frascos inyectables. Es un requerimiento normativo innegociable.',
          hernan: 'Verificaré la presión positiva de la sala frente al pasillo con tubo en U y cambiaremos los prefiltros sintéticos.',
          camila: 'Mientras tanto, los envases conformados se acumularán en cajas herméticas con film antiestático.',
          rodrigo: 'Los laboratorios farmacéuticos auditan periódicamente estos registros; tener la trazabilidad impecable nos da prestigio.'
        },
        consequences: {
          cashChange: -3200,
          kpiEffects: { oee: -1.0, qualityRate: 4.5, otif: -0.5 },
          moraleChanges: { calidad: 12, mantenimiento: 8 },
          summaryMessage: 'Hernán detectó que un prefiltro estaba saturado. Se reemplazó y el conteo cayó a 180.000 partículas/m³, dentro de norma.'
        }
      },
      {
        id: 'env_seguir_empaque_rapido',
        text: 'Seguir empacando a toda prisa para terminar el pedido antes de que la auditoría registre el valor promedio.',
        methodologyNote: 'Infracción grave de buenas prácticas de manufactura (GMP).',
        npcOpinions: {
          marcela: '¡Rotundamente no! Es una violación flagrante de la ética farmacéutica.',
          camila: 'Si el cliente hace prueba de partículas insolubles en microscopio, nos rechazarán el lote con costo millonario.',
          paulina: 'Si nos llega una no conformidad crítica de un cliente médico, la planta arriesga perder la licencia sanitaria.'
        },
        consequences: {
          cashChange: -35000,
          kpiEffects: { oee: -4.0, qualityRate: -15.0, customerNps: -30 },
          moraleChanges: { calidad: -25, post_venta: -18 },
          summaryMessage: 'El laboratorio farmacéutico encontró micropartículas negras en los envases. Lote rechazado al 100% y auditoría sancionatoria.'
        }
      }
    ]
  },

  // =======================================================================
  // 3. PROCESO: EMBOTELLADO & BEBIDAS (Alta Velocidad 28.000 bph)
  // =======================================================================
  {
    id: 'emb_dilemma_espuma_isobarica',
    processTypeId: 'EMBOTELLADO',
    unitId: 'proceso',
    characterId: 'camila',
    title: 'Microfugas de CO2 & Espuma Excesiva en Válvulas Isobáricas',
    urgency: 'CRITICA',
    scenarioDescription: 'Camila (Producción) detiene la mesa de llenado: las válvulas 14, 15 y 28 del carrusel isobárico presentan fuga en sellos de campana. Al despresurizarse bruscamente la botella, la bebida carbonatada genera espuma violenta que derrama producto y deja niveles de líquido irregulares. Sofía (Despacho) tiene 3 camiones esperando carga completa para salir a la ruta de mediodía.',
    choices: [
      {
        id: 'emb_cambio_sellos_rapido',
        text: 'Aplicar procedimiento de cambio rápido (SMED) de las 3 campanas de llenado con el kit de pañol (Parada de 35 min).',
        methodologyNote: 'Intervención rápida focalizada SMED utilizando repuestos estandarizados en bodega de pañol.',
        npcOpinions: {
          hernan: 'Tenemos el kit de empaquetaduras de silicona en pañol. Con mis 2 técnicos cambiamos los sellos en 35 minutos exactos.',
          camila: '35 minutos es asumible. Podemos recuperar volumen operando al 102% de velocidad nominal el resto del turno.',
          marcela: 'Imprescindible. La espuma descalibra los sensores ópticos de nivel y nos genera falsos rechazos masivos.',
          sofia: 'Los camiones pueden esperar 40 minutos en muelle sin penalización de estadía si les damos café a los choferes.',
          rodrigo: 'Es la opción más balanceada entre disponibilidad y calidad de entrega.'
        },
        consequences: {
          cashChange: -1800,
          kpiEffects: { oee: -1.0, qualityRate: 3.5, otif: 0.5, defects: -35 },
          moraleChanges: { mantenimiento: 12, proceso: 8, calidad: 10 },
          summaryMessage: 'Los técnicos ejecutaron el cambio rápido en 32 minutos. El llenado isobárico volvió a operar sin espuma.'
        }
      },
      {
        id: 'emb_bajar_temperatura_jarabe',
        text: 'Bajar la velocidad de llenado un 20% y enfriar el jarabe a 2°C para reducir la efervescencia sin parar.',
        methodologyNote: 'Aumento de solubilidad de Henry bajando temperatura de líquido para amortiguar despresurización.',
        npcOpinions: {
          camila: 'La efervescencia disminuirá porque el gas es más soluble a 2°C, pero la sopladora tendrá que acumular botellas.',
          hernan: 'El amoníaco del sistema de frío trabajará al tope para bajar a 2°C, y las campanas seguirán gastándose.',
          marcela: 'No resuelve la causa raíz de la válvula. Apenas suba medio grado la temperatura volverá la espuma.',
          sofia: 'La menor cadencia de botellas/hora retrasará la salida de los últimos dos camiones de la tarde.'
        },
        consequences: {
          cashChange: -4500,
          kpiEffects: { oee: -2.8, performance: -4.0, qualityRate: -1.0 },
          moraleChanges: { proceso: -4, mantenimiento: -6, marketing: -6 },
          summaryMessage: 'Operaron a menor ritmo y con costo eléctrico elevado. La fuga persistió hasta el final del turno.'
        }
      }
    ]
  },
  {
    id: 'emb_dilemma_sleeve_vapor',
    processTypeId: 'EMBOTELLADO',
    unitId: 'producto_terminado',
    characterId: 'esteban',
    title: 'Desalineación de Etiquetas Sleeve en Túnel de Retracción a 24.000 bph',
    urgency: 'ALTA',
    scenarioDescription: 'Esteban (Bodega PT) y Marcela (Calidad) muestran botellas con la manga retráctil arrugada y la fecha de vencimiento corrida: el túnel de vapor de la etiquetadora sleeve tiene dos toberas desalineadas y condensación interna. A 24.000 botellas por hora, se están generando 400 botellas defectuosas cada 10 minutos.',
    choices: [
      {
        id: 'emb_ajustar_toberas_vapor',
        text: 'Detener la sección de empaque durante 20 minutos, purgar trampas de vapor y reorientar boquillas deflectoras.',
        methodologyNote: 'Estandarización de parámetros de vapor saturado y alineación geométrica de boquillas.',
        npcOpinions: {
          esteban: 'Detenemos el túnel ahora y acumulamos botellas en la mesa pulmonar sin detener la llenadora.',
          hernan: 'Purgar las trampas de condensado sacará el agua líquida que mancha las etiquetas. Lo resuelvo en 15 minutos.',
          marcela: 'Las botellas ya arrugadas deberán pasar por la estación de retrabajo manual para corte de manga y reetiquetado.',
          sofia: 'Si la mesa pulmón aguanta 20 minutos de botellas, despacho ni siquiera sentirá la interrupción.'
        },
        consequences: {
          cashChange: -2200,
          kpiEffects: { oee: -0.8, qualityRate: 4.8, defects: -70 },
          moraleChanges: { producto_terminado: 8, calidad: 10, mantenimiento: 6 },
          summaryMessage: 'Se purgaron las trampas de vapor. El encogimiento térmico de la manga volvió a quedar liso y centrado.'
        }
      },
      {
        id: 'emb_ignorar_retrabajar_manual',
        text: 'Mantener la máquina a tope y contratar 6 operarios temporales para pelar botellas y reetiquetar a mano.',
        methodologyNote: 'Paliativo de sobreprocesamiento y mano de obra adicional para tapar desvío mecánico.',
        npcOpinions: {
          esteban: 'El área de empaque se transformará en un caos de botellas en el piso y plástico cortado.',
          camila: 'Esto va contra cualquier principio Lean. Sobreprocesamiento puro que oculta la causa técnica.',
          marcela: 'El riesgo de cortar el plástico de la botella con cartoneros y generar microfugas es altísimo.'
        },
        consequences: {
          cashChange: -9800,
          kpiEffects: { oee: -1.5, qualityRate: -5.0, scrapPpm: 210, safety: -3 },
          moraleChanges: { producto_terminado: -14, calidad: -12, proceso: -6 },
          summaryMessage: 'Costos elevados de horas extra y dos reclamos de clientes por etiquetas cortadas con cuchillo.'
        }
      }
    ]
  },
  {
    id: 'emb_dilemma_estallido_preformas',
    processTypeId: 'EMBOTELLADO',
    unitId: 'proceso',
    characterId: 'camila',
    title: 'Estallido Recurrente de Preformas PET en Sopladora Rotativa a 38 Bar',
    urgency: 'CRITICA',
    scenarioDescription: 'Camila (Producción) corre a detener la sopladora rotativa: tres botellas han estallado con estruendo adentro de los moldes debido a un pico de presión de soplado a 38 bar y espesor desparejo de la resina. Los fragmentos de PET plástico salieron proyectados contra las protecciones de policarbonato activando el paro de seguridad.',
    choices: [
      {
        id: 'emb_recalibrar_horno_infrarrojo',
        text: 'Purgar línea neumática de alta presión, recalibrar lámparas infrarrojas de precalentamiento de preformas y revisar espesor.',
        methodologyNote: 'Control de perfil térmico de preformas PET y amortiguación de rampa de presoplado.',
        npcOpinions: {
          hernan: 'Debemos revisar la válvula proporcional de soplado primario; si abre de golpe, el choque de 38 bar revienta el plástico frío.',
          camila: 'Las lámparas de la zona 3 del horno estaban bajas, la preforma entraba fría a la base y por eso no estiraba el vástago.',
          marcela: 'Inspeccionaré el espesor de pared con el medidor magnético de espesores Magna-Mike antes de reanudar.',
          esteban: 'Limpiemos bien todos los fragmentos rotos para que ninguno se meta al carrusel de llenado.'
        },
        consequences: {
          cashChange: -3600,
          kpiEffects: { oee: -1.8, availability: -2.0, qualityRate: 3.2, safety: 4 },
          moraleChanges: { proceso: 8, mantenimiento: 10, calidad: 6 },
          summaryMessage: 'Hernán y Camila ajustaron la rampa de soplado y el calentamiento infrarrojo. El soplado recuperó 100% de botellas perfectas.'
        }
      },
      {
        id: 'emb_bajar_presion_sin_calibrar',
        text: 'Bajar la presión general a 30 bar sin cambiar las lámparas para que las preformas no revienten.',
        methodologyNote: 'Sub-presurización de soplado provocando falta de definición en la base de la botella.',
        npcOpinions: {
          camila: 'A 30 bar las patas de la base petaloide no abrirán completo y las botellas se caerán solas en el transportador.',
          marcela: 'Botellas inestables causarán atascos masivos en la envolvedora de pallets y no aguantarán la carbonatación.',
          esteban: 'Si las botellas cojean, los pallets se desmoronarán en las curvas del camión.'
        },
        consequences: {
          cashChange: -14000,
          kpiEffects: { oee: -3.5, qualityRate: -7.0, scrapPpm: 260 },
          moraleChanges: { proceso: -10, producto_terminado: -12 },
          summaryMessage: 'Las botellas salieron con fondo deforme. Cientos cayeron como fichas de dominó en la cinta transportadora.'
        }
      }
    ]
  },
  {
    id: 'emb_dilemma_caida_pasteurizador',
    processTypeId: 'EMBOTELLADO',
    unitId: 'proceso',
    characterId: 'marcela',
    title: 'Caída de Temperatura en Pasteurizador Flash (Riesgo Microbiológico)',
    urgency: 'CRITICA',
    scenarioDescription: 'La Dra. Marcela (Calidad) exige la detención inmediata del tren de envasado: la válvula modulante de vapor del pasteurizador flash sufrió una oscilación y la temperatura del jugo cayó de 88°C a 79°C durante 8 minutos continuos. Hay 3.800 botellas llenadas con producto que no alcanzó las Unidades de Pasteurización (UP) requeridas.',
    choices: [
      {
        id: 'emb_desviar_tanque_repasteurizar',
        text: 'Segregar las 3.800 botellas para vaciado y repasteurización, cambiar la electroválvula de vapor y validar microbiología.',
        methodologyNote: 'Garantía de esterilidad comercial y prevención de fermentación en góndola.',
        npcOpinions: {
          marcela: 'Imprescindible. Si ese jugo queda a 79°C, las levaduras silvestres fermentarán en la botella y reventarán las tapas con gas en góndola.',
          hernan: 'La electroválvula de vapor tenía sarro en el vástago. La limpio y recalibro el posicionador electroneumático en 40 minutos.',
          camila: 'El vaciado de botellas es doloroso, pero recuperar el líquido hacia el tanque pulmón nos ahorra el costo del concentrado.',
          rodrigo: 'Prefiero atrasar la entrega que enfrentar botellas infladas o explosiones en los refrigeradores del retail.'
        },
        consequences: {
          cashChange: -5200,
          kpiEffects: { oee: -2.1, qualityRate: 6.0, otif: -1.2 },
          moraleChanges: { calidad: 16, mantenimiento: 8, proceso: 2 },
          summaryMessage: 'Hernán desincrustó la válvula de vapor y Marcela verificó 92°C estables. Se salvó la inocuidad del lote.'
        }
      },
      {
        id: 'emb_inyectar_sorbato_compensar',
        text: 'Inyectar conservante químico sorbato de potasio en línea y dejar pasar las botellas sin vaciarlas.',
        methodologyNote: 'Alteración de fórmula sin declarar en etiqueta nutricional.',
        npcOpinions: {
          marcela: '¡Ilegal! El producto se vende como "100% natural sin conservantes". Si le ponemos sorbato estamos cometiendo fraude al consumidor.',
          camila: 'Es una salida fácil pero rompe el estándar con el que certificamos la planta.',
          paulina: 'Cualquier laboratorio de la competencia que compre una botella en supermercado nos demandará de inmediato.'
        },
        consequences: {
          cashChange: -38000,
          kpiEffects: { oee: 0.2, qualityRate: -18.0, customerNps: -40 },
          moraleChanges: { calidad: -25, marketing: -18 },
          summaryMessage: 'Un laboratorio independiente detectó conservantes químicos no rotulados. Escándalo mediático y sanción de la autoridad sanitaria.'
        }
      }
    ]
  },

  // =======================================================================
  // 4. PROCESO: METALMECÁNICA & ENSAMBLES (Mecanizado CNC, Soldadura, Prensas)
  // =======================================================================
  {
    id: 'met_dilemma_chatter_cnc',
    processTypeId: 'METALMECANICA',
    unitId: 'proceso',
    characterId: 'camila',
    title: 'Vibración Armónica (Chatter) & Rotura de Plaquitas en CNC de 5 Ejes',
    urgency: 'CRITICA',
    scenarioDescription: 'Camila (Producción) y Hernán (Mantenimiento) convocan al comité: el Centro de Mecanizado CNC de 5 Ejes (cuello de botella de la planta) está emitiendo un chirrido agudo (chatter) durante el fresado de cilindros de acero 4140. Tres plaquitas de metal duro se han astillado en el último turno. Hernán sospecha holgura en los rodamientos del husillo a 12.000 RPM, pero Camila cree que el operador aumentó el avance (feed rate) un 30% para apurar el turno.',
    choices: [
      {
        id: 'met_auditar_herramienta_avance',
        text: 'Suspender el avance forzado, aplicar procedimiento estándar (SOP) de parámetros de corte y revisar fijación de pieza.',
        methodologyNote: 'Estandarización de parámetros de corte (velocidad, avance y profundidad) según ingeniería de métodos.',
        npcOpinions: {
          camila: 'Revisaré el código G y los overrides de avance en el control Fanuc del CNC. Estandarizamos el avance a 0.12 mm/diente.',
          hernan: 'Haré una medición de excentricidad (runout) en el portaherramientas con reloj comparador. Si es < 5 micras, el husillo está a salvo.',
          marcela: 'El rugosímetro medía Ra 3.2 micras en lugar del 0.8 especificado. Con el avance correcto volveremos a la tolerancia.',
          rodrigo: 'Los cilindros son para Minera Escondida; si fallan en terreno por microfisuras superficiales, nos sacan del registro de proveedores.',
          felipe: 'El proveedor de insertos Sandvik puede enviarnos fresas con paso diferencial antivibratorio mañana a primera hora.'
        },
        consequences: {
          cashChange: -1500,
          kpiEffects: { oee: 1.8, qualityRate: 4.5, defects: -45, performance: 0.5 },
          moraleChanges: { proceso: 10, calidad: 12, mantenimiento: 8 },
          summaryMessage: 'Se corrigió el avance excesivo y se cambió la boquilla portaherramientas. El fresado recuperó acabado espejo (Ra 0.6).'
        }
      },
      {
        id: 'met_overhaul_husillo',
        text: 'Detener el CNC completamente por 2 días y enviar el electrohusillo a rectificado y balanceo dinámico.',
        methodologyNote: 'Reemplazo preventivo mayor de componente crítico ante sospecha de falla interna.',
        npcOpinions: {
          hernan: 'Es la solución más segura si los rodamientos cerámicos están fatigados, pero costará $14.000 de servicio especializado.',
          camila: '¡Son 48 horas sin la máquina que genera el 60% de nuestra facturación diaria! Nos paralizará toda la nave de montaje.',
          rodrigo: 'Imposible entregar los pedidos de exportación esta semana si paramos dos días completos.'
        },
        consequences: {
          cashChange: -18000,
          kpiEffects: { oee: -12.0, availability: -15.0, otif: -18.0 },
          moraleChanges: { mantenimiento: 10, proceso: -18, marketing: -20 },
          summaryMessage: 'El husillo quedó balanceado en taller externo, pero el costo financiero y el retraso en clientes fue monumental.'
        }
      },
      {
        id: 'met_continuar_cambiar_plaquitas',
        text: 'Seguir operando y reemplazar las plaquitas astilladas tantas veces como sea necesario para terminar el lote.',
        methodologyNote: 'Estrategia de desgaste acelerado asumiendo sobrecosto de herramientas consumibles.',
        npcOpinions: {
          camila: 'Vamos a quemar una caja de insertos de $400 cada 2 horas.',
          hernan: 'La vibración armónica terminará destruyendo el cono del husillo. En 12 horas tendremos una avería de $25.000.',
          marcela: 'Las piezas saldrán con rugosidad espantosa y marcas de trepidación. Calidad no liberará ningún cilindro.'
        },
        consequences: {
          cashChange: -26000,
          kpiEffects: { oee: -5.0, scrapPpm: 320, defects: 80 },
          unitHealthChanges: { proceso: -30, mantenimiento: -25 },
          moraleChanges: { mantenimiento: -25, calidad: -18, proceso: -10 },
          summaryMessage: 'El husillo se engranó violentamente a las 15:30 hrs rompiendo la bancada. Planta en emergencia crítica.'
        }
      }
    ]
  },
  {
    id: 'met_dilemma_soldadura_poros',
    processTypeId: 'METALMECANICA',
    unitId: 'calidad',
    characterId: 'marcela',
    title: 'Porosidad en Cordón de Soldadura Robotizada & Falla en Gas de Protección',
    urgency: 'ALTA',
    scenarioDescription: 'La Dra. Marcela (Calidad) detiene el despacho de bastidores estructurales: el ensayo no destructivo por ultrasonido detectó porosidad interna y falta de penetración en el 35% de los cordones de la célula robotizada. Hernán descubrió que el caudalímetro del gas mezcla Argón/CO2 estaba atascado con condensación.',
    choices: [
      {
        id: 'met_reparar_flujometro_retrabajo',
        text: 'Reemplazar el flujómetro de gas, recalibrar parámetros de soldadura y amolar y resoldar los bastidores defectuosos.',
        methodologyNote: 'Reparación de causa raíz en suministro de gas inerte y retrabajo calificado según norma AWS D1.1.',
        npcOpinions: {
          marcela: 'Ultrasonido obligatorio después del resoldado. Si la penetración es completa según norma AWS, se aprueba.',
          hernan: 'Instalaré un secador desecante en la línea de gas de soldadura para que nunca más entre humedad a los flujómetros.',
          camila: 'Asignaré a dos soldadores calificados 6G para el ranurado y relleno manual de los cordones defectuosos.',
          rodrigo: 'Atrasaremos la entrega un día, pero los bastidores mineros soportarán las 40 toneladas de carga de trabajo.'
        },
        consequences: {
          cashChange: -4200,
          kpiEffects: { oee: -1.8, qualityRate: 5.2, defects: -60, otif: -1.5 },
          moraleChanges: { calidad: 12, mantenimiento: 10, proceso: 4 },
          summaryMessage: 'Se saneó la red de gas y se repararon los cordones. El ensayo de ultrasonido arrojó cero porosidades.'
        }
      },
      {
        id: 'met_disimular_masilla_pintar',
        text: 'Cubrir los poros superficiales con masilla epóxica y pasar a la cabina de pintura electrostática.',
        methodologyNote: 'Práctica inaceptable de ocultamiento de vicio estructural bajo capa de acabado.',
        npcOpinions: {
          marcela: '¡Rotundamente no! La masilla no aporta resistencia estructural. Con las vibraciones del camión la soldadura se partirá.',
          camila: 'Esto es una violación ética de la ingeniería industrial. Nos exponemos a demandas penales si la estructura colapsa.',
          hernan: 'Vergüenza técnica. Me niego a que mantenimiento avale semejante despropósito.'
        },
        consequences: {
          cashChange: -45000,
          kpiEffects: { oee: -8.0, qualityRate: -15.0, customerNps: -40, safety: -10 },
          moraleChanges: { calidad: -30, proceso: -25, mantenimiento: -25 },
          summaryMessage: 'El bastidor colapsó en la prueba de carga del cliente. Demanda legal inmediata y rescisión unilateral de contrato.'
        }
      }
    ]
  },
  {
    id: 'met_dilemma_temple_dureza',
    processTypeId: 'METALMECANICA',
    unitId: 'calidad',
    characterId: 'hernan',
    title: 'Desvío Térmico en Horno de Revenido & Dureza Heterogénea en Ejes',
    urgency: 'ALTA',
    scenarioDescription: 'Don Hernán (Mantenimiento) y la Dra. Marcela (Calidad) alertan: el Horno de Revenido a 950°C tuvo una fuga en la atmósfera inerte de nitrógeno y una termocupla descalibrada. El durómetro Rockwell marca 48 HRC en un extremo de los ejes y 58 HRC en el otro (especificación estricta es 54 ± 2 HRC). Si se montan así, los engranajes se desgastarán de forma asimétrica.',
    choices: [
      {
        id: 'met_recalibrar_horno_reprocesar',
        text: 'Cambiar la termocupla tipo K, presurizar el nitrógeno y someter el lote a un nuevo ciclo térmico de normalizado y revenido.',
        methodologyNote: 'Regeneración metalúrgica de microestructura mediante ciclo térmico controlado.',
        npcOpinions: {
          hernan: 'Con el nuevo ciclo térmico homogenizamos la austenita y la martensita revenida volverá a los 54 HRC parejos.',
          marcela: 'Es la única vía para certificar el ensayo de dureza superficial y tracción.',
          camila: 'Nos costará 6 horas de consumo eléctrico de horno, pero recuperamos el 100% de los ejes mecanizados.',
          rodrigo: 'El cliente prefiere esperar 24 horas y recibir ejes con dureza garantizada.'
        },
        consequences: {
          cashChange: -3900,
          kpiEffects: { oee: -1.5, qualityRate: 5.0, performance: -1.0 },
          moraleChanges: { mantenimiento: 10, calidad: 10, proceso: 2 },
          summaryMessage: 'El ciclo térmico correctivo devolvió la dureza a 54 HRC exactos. El lote fue liberado con certificado de calidad.'
        }
      },
      {
        id: 'met_despachar_lote_dureza_dispar',
        text: 'Despachar los ejes tal cual asumiendo que el cliente no notará la diferencia en faena.',
        methodologyNote: 'Liberación de producto con gradiente de dureza no conforme.',
        npcOpinions: {
          marcela: 'El eje fallará por cizalle en la primera sobrecarga del reductor mecánico.',
          hernan: 'Cualquier mecánico de faena se dará cuenta con una simple lima templada.',
          paulina: 'La garantía cubrirá el reemplazo pero la pérdida de confianza de la minera será irrecuperable.'
        },
        consequences: {
          cashChange: -29000,
          kpiEffects: { oee: -3.0, qualityRate: -12.0, customerNps: -25 },
          moraleChanges: { calidad: -20, post_venta: -18 },
          summaryMessage: 'Dos ejes se partieron a las 72 horas de operación en faena minera. Reclamo severo con costo de penalización por parada de faena.'
        }
      }
    ]
  },
  {
    id: 'met_dilemma_taladrina_virutas',
    processTypeId: 'METALMECANICA',
    unitId: 'mantenimiento',
    characterId: 'hernan',
    title: 'Saturación en Central de Taladrina & Recirculación de Virutas Abrasivas',
    urgency: 'ALTA',
    scenarioDescription: 'Don Hernán (Mantenimiento) muestra un frasco con refrigerante de corte (taladrina) turbio y oscuro: los separadores magnéticos y los filtros de papel de la central de filtrado colapsaron. El fluido de corte está inyectando microvirutas de acero a alta presión directo sobre las herramientas y husillos, rayando las piezas y sobrecalentando los filos.',
    choices: [
      {
        id: 'met_purgar_taladrina_cambio_filtros',
        text: 'Detener el mecanizado por 2 horas, vaciar los tanques de taladrina, limpiar lodos y renovar emulsión bactericida al 7%.',
        methodologyNote: 'Restitución de fluidos de corte y tribología de maquinado para protección de guías y herramientas.',
        npcOpinions: {
          hernan: 'Dejamos la central impecable con emulsión fresca al 7%. Los filos de corte durarán el triple y evitaremos olores desagradables.',
          camila: '2 horas de parada nos retrasan el turno, pero las piezas saldrán frías y sin rayas superficiales.',
          marcela: 'El refrigerante limpio evita la corrosión intergranular en las piezas recién torneadas.',
          sofia: 'Mejor detenerse ahora que tener que lavar y secar piezas manchadas con lodo aceitoso.'
        },
        consequences: {
          cashChange: -2400,
          kpiEffects: { oee: -1.0, qualityRate: 3.8, performance: 1.5, availability: -1.0 },
          moraleChanges: { mantenimiento: 12, proceso: 6, calidad: 6 },
          summaryMessage: 'Se renovó la taladrina y los filtros. El mecanizado opera suave, con menor consumo de plaquitas y excelente rugosidad.'
        }
      },
      {
        id: 'met_rellenar_agua_seguir',
        text: 'Rellenar los tanques con agua corriente para diluir las virutas y seguir torneando sin parar.',
        methodologyNote: 'Paliativo que desbalancea la concentración de aceite mineral y favorece la proliferación de bacterias anaeróbicas.',
        npcOpinions: {
          hernan: 'Diluir la taladrina oxidará las bancadas de fundición del torno y en 2 días el taller olerá a huevo podrido.',
          camila: 'Sin la lubricación del aceite, el filo de las herramientas se quemará por fricción.',
          marcela: 'Las piezas saldrán oxidadas antes de llegar a la bodega de producto terminado.'
        },
        consequences: {
          cashChange: -12500,
          kpiEffects: { oee: -2.5, qualityRate: -6.0, scrapPpm: 190 },
          moraleChanges: { mantenimiento: -15, proceso: -8 },
          summaryMessage: 'Las herramientas se sobrecalentaron y las bancadas sufrieron corrosión prematura. Se arruinaron 18 ejes por falta de refrigeración.'
        }
      }
    ]
  },

  // =======================================================================
  // 5. CONTINGENCIAS TRANSVERSALES (Afectan a cualquier planta o industria)
  // =======================================================================
  {
    id: 'global_dilemma_huelga_transporte',
    processTypeId: 'ALL',
    unitId: 'logistica',
    characterId: 'sofia',
    title: 'Paro Nacional de Camioneros & Bloqueo en Rutas de Acceso',
    urgency: 'CRITICA',
    scenarioDescription: 'Sofía (Despacho) y Felipe (Logística) alertan al comité: el gremio de transportistas de carga inició un bloqueo indefinido en la carretera principal. Tres camiones de materia prima no pueden llegar y los despachos hacia los centros de distribución están frenados. El almacén de producto terminado alcanzará su capacidad máxima en 8 horas.',
    choices: [
      {
        id: 'global_habilitar_bodega_alternativa',
        text: 'Arrendar patio techado en parque industrial vecino y negociar con transportistas locales con salvoconducto por vías rurales.',
        methodologyNote: 'Gestión de Continuidad de Negocio (BCP) y buffers logísticos de contingencia.',
        npcOpinions: {
          sofia: 'Tengo un contacto con una cooperativa local de fletes que opera por rutas secundarias. Cobran un 20% más pero se mueven.',
          esteban: 'El patio vecino nos da 800 m² para desahogar los racks y evitar que la línea de ensamble se atasque por falta de espacio.',
          felipe: 'Permite asegurar que los insumos básicos lleguen por tren o caminos rurales sin detener la planta.',
          rodrigo: 'Nuestros competidores estarán completamente paralizados. Si nosotros logramos entregar, ganaremos cuota de mercado.'
        },
        consequences: {
          cashChange: -7500,
          kpiEffects: { oee: 0.5, otif: 3.2, inventory: 4.0 },
          moraleChanges: { logistica: 14, despacho: 12, marketing: 10 },
          summaryMessage: 'Lograste sortear el bloqueo carretero. La planta mantuvo la producción y capturaste clientes de la competencia.'
        }
      },
      {
        id: 'global_reducir_velocidad_esperar',
        text: 'Reducir la velocidad de toda la planta al 50% y esperar a que el gobierno resuelva el conflicto vial.',
        methodologyNote: 'Estrategia conservadora de reducción de tasa horaria para no saturar almacenes.',
        npcOpinions: {
          camila: 'Operar al 50% desestabiliza la eficiencia horaria y duplica el costo fijo por unidad producida.',
          sofia: 'Evitamos pagar fletes caros, pero si el paro dura 3 días los clientes quedarán totalmente desabastecidos.',
          hernan: 'A media máquina los equipos sufren menos desgaste, pero la moral del personal cae cuando no hay ritmo.',
          rodrigo: 'Los supermercados nos cobrarán multas draconianas por faltantes en góndola.'
        },
        consequences: {
          cashChange: -14000,
          kpiEffects: { oee: -6.5, performance: -8.0, otif: -12.0 },
          moraleChanges: { proceso: -10, despacho: -8, marketing: -14 },
          summaryMessage: 'El paro duró 4 días. La producción a media marcha generó fuertes pérdidas y quiebre de stock en clientes.'
        }
      }
    ]
  },
  {
    id: 'global_dilemma_corte_electrico',
    processTypeId: 'ALL',
    unitId: 'mantenimiento',
    characterId: 'hernan',
    title: 'Microcorte de Media Tensión & Sobrecarga en Grupo Electrógeno Diésel',
    urgency: 'CRITICA',
    scenarioDescription: 'Un rayo y caída de rama en la subestación externa provoca un corte eléctrico. El generador diésel de emergencia arrancó automáticamente, pero solo tiene capacidad para sostener el 65% de la carga de la planta. Hernán (Mantenimiento) pide apagar las líneas secundarias de climatización y empaque para priorizar la máquina principal.',
    choices: [
      {
        id: 'global_priorizar_cuello_botella',
        text: 'Priorizar alimentación exclusiva del cuello de botella y servicios esenciales, desconectando almacenes y oficinas.',
        methodologyNote: 'Asignación jerárquica de potencia bajo filosofía TOC protegiendo la restricción del sistema.',
        npcOpinions: {
          hernan: 'El generador trabajará al 80% de su carga nominal con seguridad diésel garantizada.',
          camila: 'Mantenemos viva la máquina principal y evitamos que el producto se solidifique o queme adentro.',
          esteban: 'Trabajaremos en bodega con carretillas manuales y luces de emergencia.',
          rodrigo: 'Al menos no perdemos el volumen crítico de facturación del día.'
        },
        consequences: {
          cashChange: -3500,
          kpiEffects: { oee: -2.0, availability: -1.5, performance: -1.0 },
          moraleChanges: { mantenimiento: 10, proceso: 6 },
          summaryMessage: 'El generador protegió la máquina restricción. La red pública volvió a las 2 horas y la planta no sufrió daños.'
        }
      },
      {
        id: 'global_forzar_planta_completa',
        text: 'Mantener todas las máquinas conectadas confiando en que el generador diésel aguantará la sobrecarga temporal.',
        methodologyNote: 'Operación por encima de la capacidad de placa del equipo de respaldo energético.',
        npcOpinions: {
          hernan: '¡El disyuntor principal del generador saltará por sobrecorriente térmica y nos quedaremos a oscuras por completo!',
          camila: 'Si se corta de golpe sin secuencia de parada, las computadoras industriales y variadores se desprogramarán.',
          marcela: 'El shock térmico arruinará todo el material en proceso.'
        },
        consequences: {
          cashChange: -22000,
          kpiEffects: { oee: -8.0, availability: -12.0, safety: -5 },
          unitHealthChanges: { mantenimiento: -25, proceso: -20 },
          moraleChanges: { mantenimiento: -20, proceso: -15 },
          summaryMessage: 'El alternador del generador se quemó por sobrecarga a los 25 minutos. Planta completamente a oscuras con daño en placas electrónicas.'
        }
      }
    ]
  }
];

// =========================================================================
// PROCEDURAL DILEMMA GENERATOR FOR ENDLESS SPECIFIC INDUSTRIAL INCIDENTS
// Generates realistic machinery-specific dilemmas when static ones are exhausted
// =========================================================================

export function createProceduralMachineDilemma(
  processTypeId: ProcessTypeId,
  machines: MachineDefinition[],
  counter: number
): Dilemma {
  const targetMachine = machines[Math.floor(Math.random() * machines.length)] || machines[0];
  const uniqueId = `proc_dilemma_${processTypeId}_${targetMachine.id}_${counter}_${Date.now()}`;

  return {
    id: uniqueId,
    processTypeId,
    unitId: targetMachine.unitId,
    characterId: targetMachine.unitId === 'proceso' ? 'camila' : targetMachine.unitId === 'calidad' ? 'marcela' : targetMachine.unitId === 'recepcion' ? 'roberto' : 'hernan',
    title: `Desvío Operativo Imprevisto en ${targetMachine.name} (Desgaste: ${Math.round(targetMachine.wearPercent)}%)`,
    urgency: targetMachine.criticality === 'CRITICA' ? 'CRITICA' : 'ALTA',
    scenarioDescription: `La estación ${targetMachine.unitName} reporta anomalías dinámicas en ${targetMachine.name}: los sensores registran incremento térmico y variabilidad de ciclo. Hernán (Mantenimiento) indica que el equipo acumula ${targetMachine.operatingHours} horas de trabajo y su nivel de degradación actual requiere decisión táctica inmediata. Camila (Producción) subraya la necesidad de cumplir los compromisos del turno.`,
    choices: [
      {
        id: `${uniqueId}_parada_correctiva`,
        text: `Detener ${targetMachine.name} durante 75 minutos para inspección metrológica, lubricación forzada y ajuste de sellos.`,
        methodologyNote: 'Intervención preventiva autónoma bajo pilares de Confiabilidad y TPM.',
        npcOpinions: {
          hernan: `Revisaré las tolerancias del eje y rodamientos de ${targetMachine.name}. Es la forma segura de evitar una avería mayor.`,
          camila: `75 minutos de parada impactarán el throughput horario, pero prefiero una parada controlada que un colapso en plena hora punta.`,
          marcela: `Cero riesgo de generar unidades fuera de especificación dimensional o con rebaba durante la intervención.`,
          rodrigo: `Tendremos un pequeño desfase en el cumplimiento del programa, pero si la máquina queda al 100% lo recuperamos mañana.`
        },
        consequences: {
          cashChange: -2500,
          kpiEffects: { oee: -1.2, qualityRate: 3.5, availability: -1.5, defects: -25 },
          moraleChanges: { mantenimiento: 10, calidad: 8, proceso: 2 },
          summaryMessage: `Se ajustó y lubricó ${targetMachine.name}. La máquina reanudó operación con estabilidad térmica y vibración nominal.`
        }
      },
      {
        id: `${uniqueId}_reducir_velocidad`,
        text: `Reducir la cadencia operativa de ${targetMachine.name} un 15% para disminuir la carga dinámica y monitorear hasta el cambio de turno.`,
        methodologyNote: 'Estrategia de preservación de activo por des-aceleración de régimen térmico.',
        npcOpinions: {
          camila: `La tasa horaria descenderá levemente, pero mantendremos el flujo continuo sin apagar los hornos o calentadores.`,
          hernan: `Bajando un 15% las RPM la fricción disminuye. Aguantará el turno siempre que no suba más la temperatura del reductor.`,
          marcela: `Las piezas saldrán con buen acabado porque la herramienta sufrirá menor esfuerzo cortante.`,
          sofia: `Despacho sentirá una pequeña baja en los pallets terminados, pero manejable con el stock de seguridad.`
        },
        consequences: {
          cashChange: -800,
          kpiEffects: { oee: 0.5, performance: -2.0, qualityRate: 1.5 },
          moraleChanges: { proceso: 6, mantenimiento: 4 },
          summaryMessage: `Se redujo la velocidad de ${targetMachine.name}. El equipo completó el turno sin incidentes mayores.`
        }
      },
      {
        id: `${uniqueId}_forzar_maxima_velocidad`,
        text: `Mantener ${targetMachine.name} a velocidad máxima para asegurar la meta diaria cueste lo que cueste.`,
        methodologyNote: 'Priorización ciega de throughput sobre la salud mecánica del equipo.',
        npcOpinions: {
          hernan: `¡Es una imprudencia! Si forzamos ${targetMachine.name} a tope con el desgaste actual, el rodamiento puede fundirse.`,
          camila: `Cumpliremos el volumen de cajas de hoy, pero si la máquina rompe mañana estaremos en serios problemas.`,
          marcela: `A alta velocidad y con holguras mecánicas la dispersión dimensional aumentará notablemente.`
        },
        consequences: {
          cashChange: -18500,
          kpiEffects: { oee: -4.0, availability: -6.0, scrapPpm: 150 },
          unitHealthChanges: { [targetMachine.unitId]: -20 },
          moraleChanges: { mantenimiento: -18, proceso: -10 },
          summaryMessage: `${targetMachine.name} sufrió una falla catastrófica en el eje motriz. Parada de emergencia con costoso reemplazo de repuestos.`
        }
      }
    ]
  };
}

// =========================================================================
// HELPER FUNCTIONS FOR RANDOM SELECTION & CONSEQUENCES MODULATION
// =========================================================================

// Pick a random dilemma matching the active process with priority to unplayed ones
export function getRandomDilemmaForProcess(
  processTypeId: ProcessTypeId,
  resolvedIds: string[],
  availableMachines?: MachineDefinition[]
): Dilemma {
  // First, find unplayed static dilemmas matching this process or ALL
  const eligible = DILEMMAS_LIBRARY.filter(
    (d) =>
      (!d.processTypeId || d.processTypeId === 'ALL' || d.processTypeId === processTypeId) &&
      !resolvedIds.includes(d.id)
  );

  if (eligible.length > 0) {
    const randomIndex = Math.floor(Math.random() * eligible.length);
    return eligible[randomIndex];
  }

  // If all specific dilemmas have been completed, generate a dynamic procedural dilemma
  // tailored to the actual machines of this plant process!
  if (availableMachines && availableMachines.length > 0) {
    return createProceduralMachineDilemma(processTypeId, availableMachines, resolvedIds.length + 1);
  }

  // Fallback: recycle an eligible dilemma with fresh ID
  const allEligible = DILEMMAS_LIBRARY.filter(
    (d) => !d.processTypeId || d.processTypeId === 'ALL' || d.processTypeId === processTypeId
  );
  const base = allEligible[Math.floor(Math.random() * allEligible.length)] || DILEMMAS_LIBRARY[0];
  return {
    ...base,
    id: `${base.id}_reoccur_${Date.now()}`
  };
}

// Helper to apply randomized variance to consequences (+/- 20% realistic spread)
export function getRandomizedConsequences(
  choice: DilemmaChoice
): DilemmaChoice['consequences'] {
  const variance = 0.80 + Math.random() * 0.40; // 0.80 to 1.20
  const orig = choice.consequences;

  const randomizedCash = Math.round(orig.cashChange * variance);

  const randomizedKpis: NonNullable<typeof orig.kpiEffects> = {};
  if (orig.kpiEffects) {
    if (orig.kpiEffects.oee !== undefined) randomizedKpis.oee = Number((orig.kpiEffects.oee * variance).toFixed(1));
    if (orig.kpiEffects.otif !== undefined) randomizedKpis.otif = Number((orig.kpiEffects.otif * variance).toFixed(1));
    if (orig.kpiEffects.qualityRate !== undefined) randomizedKpis.qualityRate = Number((orig.kpiEffects.qualityRate * variance).toFixed(1));
    if (orig.kpiEffects.performance !== undefined) randomizedKpis.performance = Number((orig.kpiEffects.performance * variance).toFixed(1));
    if (orig.kpiEffects.availability !== undefined) randomizedKpis.availability = Number((orig.kpiEffects.availability * variance).toFixed(1));
    if (orig.kpiEffects.defects !== undefined) randomizedKpis.defects = Math.round(orig.kpiEffects.defects * variance);
    if (orig.kpiEffects.scrapPpm !== undefined) randomizedKpis.scrapPpm = Math.round(orig.kpiEffects.scrapPpm * variance);
    if (orig.kpiEffects.safety !== undefined) randomizedKpis.safety = orig.kpiEffects.safety;
    if (orig.kpiEffects.leadTimeHours !== undefined) randomizedKpis.leadTimeHours = Number((orig.kpiEffects.leadTimeHours * variance).toFixed(1));
    if (orig.kpiEffects.inventory !== undefined) randomizedKpis.inventory = Number((orig.kpiEffects.inventory * variance).toFixed(1));
  }

  const randomizedMorale: NonNullable<typeof orig.moraleChanges> = {};
  if (orig.moraleChanges) {
    for (const [k, v] of Object.entries(orig.moraleChanges)) {
      if (typeof v === 'number') {
        randomizedMorale[k as keyof typeof randomizedMorale] = Math.round(v * variance);
      }
    }
  }

  const randomizedUnitHealth: NonNullable<typeof orig.unitHealthChanges> = {};
  if (orig.unitHealthChanges) {
    for (const [k, v] of Object.entries(orig.unitHealthChanges)) {
      if (typeof v === 'number') {
        randomizedUnitHealth[k as keyof typeof randomizedUnitHealth] = Math.round(v * variance);
      }
    }
  }

  return {
    ...orig,
    cashChange: randomizedCash,
    kpiEffects: randomizedKpis,
    moraleChanges: randomizedMorale,
    unitHealthChanges: randomizedUnitHealth
  };
}
