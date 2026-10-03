import { ProcessConfig } from '../types/game';

export const PROCESS_OPTIONS: ProcessConfig[] = [
  {
    id: 'ALIMENTOS_CONTINUOS',
    title: 'Alimentos Continuos',
    subtitle: 'Panificación, Snacks & Nutrición Industrial',
    tagline: 'Flujo térmico continuo bajo normas HACCP',
    plantName: 'Alimentos del Valle Central S.A.',
    productDescription: 'Producción masiva continua de barras nutricionales, galletas de precisión y cereales extruidos.',
    rawMaterialName: 'Harinas especiales, jarabes orgánicos y empaque bilaminado con barrera de gas.',
    defaultTargetUnits: 12000,
    nominalCapacity: '15.000 paquetes / día',
    unitPrice: 28.5,
    initialCash: 420000,
    bottleneckStation: 'Horno Continuo Túnel',
    accentColor: 'from-amber-500 to-yellow-600',
    specialChallenge: 'Inocuidad alimentaria estricta, control de humedad de masa y prevención de mermas por sobrecocción.'
  },
  {
    id: 'ENVASES_PRECISION',
    title: 'Envases & Componentes de Alta Precisión',
    subtitle: 'Termoformado, Inyección & Estampado Robótico',
    tagline: 'Tolerancias en micras y salas limpias ISO 8',
    plantName: 'Manufacturas Andinas S.A.',
    productDescription: 'Fabricación de envases multicapa herméticos y piezas plásticas técnicas para industria farmacéutica y retail.',
    rawMaterialName: 'Resinas poliméricas grado ingeniería, láminas termoformables y acero especial.',
    defaultTargetUnits: 7000,
    nominalCapacity: '10.000 unidades / día',
    unitPrice: 42.5,
    initialCash: 485000,
    bottleneckStation: 'Estampadora B',
    accentColor: 'from-blue-500 to-indigo-600',
    specialChallenge: 'Cpk dimensional crítico (>1.33), calibración de matrices de inyección y desgaste de rodamientos de precisión.'
  },
  {
    id: 'EMBOTELLADO',
    title: 'Embotellado & Bebidas Automatizado',
    subtitle: 'Llenado Isobárico de Alta Velocidad (28.000 bph)',
    tagline: 'Sincronización milimétrica en tren de envasado',
    plantName: 'Embotelladora Austral S.A.',
    productDescription: 'Llenado, tapado, etiquetado y paletizado a alta cadencia de jugos prensados, isotónicos y aguas purificadas.',
    rawMaterialName: 'Preformas PET, concentrados cítricos, tapas con precinto de seguridad y etiquetas retráctiles.',
    defaultTargetUnits: 25000,
    nominalCapacity: '35.000 botellas / día',
    unitPrice: 16.8,
    initialCash: 530000,
    bottleneckStation: 'Llenadora Rotativa Isobárica',
    accentColor: 'from-teal-500 to-emerald-600',
    specialChallenge: 'Velocidad de línea extrema, control de microfiltraciones en tapa y cambios ultra-rápidos de formato (SMED).'
  },
  {
    id: 'METALMECANICA',
    title: 'Metalmecánica & Ensambles',
    subtitle: 'Mecanizado CNC, Corte Láser & Soldadura',
    tagline: 'Manufactura discreta de alta resistencia',
    plantName: 'Maquinarias & Estructuras del Sur S.A.',
    productDescription: 'Fabricación de cilindros hidráulicos, engranajes cónicos y bastidores soldados para minería y maquinaria pesada.',
    rawMaterialName: 'Tubos de acero al cromo-molibdeno, vigas estructurales, bronce fosforoso y electrodos.',
    defaultTargetUnits: 1200,
    nominalCapacity: '1.800 componentes / día',
    unitPrice: 240.0,
    initialCash: 610000,
    bottleneckStation: 'Centro de Mecanizado CNC de 5 Ejes',
    accentColor: 'from-orange-500 to-red-600',
    specialChallenge: 'Tiempos de ciclo largos, balanceo de carga en fresadoras y mantenimiento predictivo por vibraciones.'
  }
];
