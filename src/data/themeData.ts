import { VisualTheme, ThemeOption } from '../types/game';

export interface DetailedTheme extends ThemeOption {
  description: string;
  previewBg: string;
  previewCard: string;
  previewBorder: string;
  previewText: string;
  previewAccent: string;
  dotColor: string;
}

export const VISUAL_THEMES: DetailedTheme[] = [
  {
    id: 'dark',
    name: 'Oscuro SCADA',
    tagline: 'Sala de Control Nocturna · Alto Contraste',
    badge: 'SCADA',
    accent: '#f59e0b',
    description: 'Ambiente clásico de sala de control SCADA industrial. Fondos carbón/obsidiana, alto contraste y telemetría ámbar y esmeralda.',
    previewBg: '#0a0d12',
    previewCard: '#12161e',
    previewBorder: '#222b37',
    previewText: '#f4f4f5',
    previewAccent: '#f59e0b',
    dotColor: '#f59e0b'
  },
  {
    id: 'light',
    name: 'Claro Sala Limpia',
    tagline: 'Laboratorio Farmacéutico & Sala Limpia ISO',
    badge: 'CLEANROOM',
    accent: '#0284c7',
    description: 'Estética diurna de laboratorio industrial y planta de grado farmacéutico. Superficies blancas inmaculadas, tipografía oscura nítida y máxima claridad.',
    previewBg: '#f1f5f9',
    previewCard: '#ffffff',
    previewBorder: '#cbd5e1',
    previewText: '#0f172a',
    previewAccent: '#0284c7',
    dotColor: '#0284c7'
  },
  {
    id: 'blueprint',
    name: 'Plano Blueprint CAD',
    tagline: 'Plano Técnico de Ingeniería & Arquitectura',
    badge: 'CAD BLUEPRINT',
    accent: '#38bdf8',
    description: 'Estilo plano técnico arquitectónico e ingeniería de procesos. Fondo azul cobalto profundo con rejilla milimétrica y diagramas en cian luminiscente.',
    previewBg: '#071322',
    previewCard: '#0b1c33',
    previewBorder: '#1d4ed8',
    previewText: '#f0f9ff',
    previewAccent: '#38bdf8',
    dotColor: '#38bdf8'
  },
  {
    id: 'amber',
    name: 'Terminal CRT Ámbar',
    tagline: 'Consola PLC & HMI Industrial Retro',
    badge: 'PLC TERMINAL',
    accent: '#fbbf24',
    description: 'Inspirado en los monitores de fósforo ámbar de autómatas programables (PLC) y consolas industriales Siemens / Allen-Bradley de los años 80 y 90.',
    previewBg: '#0d0a06',
    previewCard: '#1a1209',
    previewBorder: '#63360b',
    previewText: '#fef3c7',
    previewAccent: '#fbbf24',
    dotColor: '#fbbf24'
  }
];
