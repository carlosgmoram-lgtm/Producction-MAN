import React, { useEffect, useRef, useState } from 'react';
import { ProcessConfig, VisualTheme, PlantRoleId } from '../types/game';
import { PROCESS_OPTIONS } from '../data/processesData';
import { PLANT_ROLES, getRoleById } from '../data/rolesData';
import { sound } from '../utils/audio';
import { 
  Flame, Wrench, Factory, Play, ArrowRight, 
  Sparkles, ShieldCheck, Gauge, Cog, Cpu, Package,
  Moon, Sun, Compass, Terminal, Palette, User, Users, ShieldAlert, Target, Check
} from 'lucide-react';

interface TitleScreenProps {
  onSelectProcess: (process: ProcessConfig, roleId?: PlantRoleId) => void;
  currentTheme?: VisualTheme;
  onSelectTheme?: (theme: VisualTheme) => void;
  onOpenThemeModal?: () => void;
  initialRole?: PlantRoleId;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  color: string;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ 
  onSelectProcess,
  currentTheme = 'dark',
  onSelectTheme,
  onOpenThemeModal,
  initialRole = 'GERENTE_PLANTA'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedId, setSelectedId] = useState<string>('ENVASES_PRECISION');
  const [selectedRoleId, setSelectedRoleId] = useState<PlantRoleId>(initialRole);
  const [activeSetupTab, setActiveSetupTab] = useState<'process' | 'role'>('process');
  const themeRef = useRef<VisualTheme>(currentTheme);

  useEffect(() => {
    themeRef.current = currentTheme;
  }, [currentTheme]);

  // Animated sparks, gears, and piping canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const sparks: Spark[] = [];
    const sparkColors = ['#f59e0b', '#fbbf24', '#f97316', '#ef4444', '#fde047', '#ffedd5'];

    // Emitters located around the machine joints / welding points
    const createSpark = (originX: number, originY: number) => {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.8;
      const speed = Math.random() * 5 + 2;
      const t = themeRef.current;
      let chosenColor = sparkColors[Math.floor(Math.random() * sparkColors.length)];
      if (t === 'light') {
        const c = ['#0284c7', '#0ea5e9', '#38bdf8', '#2563eb', '#d97706'];
        chosenColor = c[Math.floor(Math.random() * c.length)];
      } else if (t === 'blueprint') {
        const c = ['#38bdf8', '#67e8f9', '#ffffff', '#0284c7', '#bae6fd'];
        chosenColor = c[Math.floor(Math.random() * c.length)];
      } else if (t === 'amber') {
        const c = ['#fbbf24', '#f59e0b', '#d97706', '#fef3c7', '#b45309'];
        chosenColor = c[Math.floor(Math.random() * c.length)];
      }

      sparks.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 2.8 + 1,
        life: 0,
        maxLife: Math.random() * 45 + 25,
        color: chosenColor
      });
    };

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);
      const activeT = themeRef.current;

      // 1. Draw Theme-specific Industrial Canvas Background
      if (activeT === 'light') {
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = '#cbd5e1';
      } else if (activeT === 'blueprint') {
        ctx.fillStyle = '#061325';
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
      } else if (activeT === 'amber') {
        ctx.fillStyle = '#0d0803';
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.12)';
      } else {
        ctx.fillStyle = '#090c10';
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = '#151b23';
      }

      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Draw Heavy Industrial Piping System in Background
      // Pipe 1 (Top Horizontal)
      if (activeT === 'light') {
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(0, 70, width, 24);
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(0, 74, width, 4);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(0, 90, width, 4);
      } else if (activeT === 'blueprint') {
        ctx.fillStyle = '#0f284f';
        ctx.fillRect(0, 70, width, 24);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(0, 74, width, 4);
        ctx.fillStyle = '#08172e';
        ctx.fillRect(0, 90, width, 4);
      } else if (activeT === 'amber') {
        ctx.fillStyle = '#241709';
        ctx.fillRect(0, 70, width, 24);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(0, 74, width, 4);
        ctx.fillStyle = '#120b04';
        ctx.fillRect(0, 90, width, 4);
      } else {
        ctx.fillStyle = '#1e2632';
        ctx.fillRect(0, 70, width, 24);
        ctx.fillStyle = '#2d3848';
        ctx.fillRect(0, 74, width, 4);
        ctx.fillStyle = '#131922';
        ctx.fillRect(0, 90, width, 4);
      }

      // Pipe Flanges on Top Pipe
      for (let fx = 120; fx < width; fx += 260) {
        ctx.fillStyle = '#344154';
        ctx.fillRect(fx - 6, 64, 12, 36);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(fx - 2, 78, 4, 8); // Valve / indicator
      }

      // Pipe 2 (Bottom Horizontal)
      if (activeT === 'light') {
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(0, height - 90, width, 32);
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(0, height - 86, width, 5);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(0, height - 66, width, 6);
      } else if (activeT === 'blueprint') {
        ctx.fillStyle = '#0f284f';
        ctx.fillRect(0, height - 90, width, 32);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(0, height - 86, width, 5);
        ctx.fillStyle = '#08172e';
        ctx.fillRect(0, height - 66, width, 6);
      } else if (activeT === 'amber') {
        ctx.fillStyle = '#241709';
        ctx.fillRect(0, height - 90, width, 32);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(0, height - 86, width, 5);
        ctx.fillStyle = '#120b04';
        ctx.fillRect(0, height - 66, width, 6);
      } else {
        ctx.fillStyle = '#1a222c';
        ctx.fillRect(0, height - 90, width, 32);
        ctx.fillStyle = '#293545';
        ctx.fillRect(0, height - 86, width, 5);
        ctx.fillStyle = '#10151c';
        ctx.fillRect(0, height - 66, width, 6);
      }

      // Vertical Pipe Connectors (Piping Elbows)
      const elbowX1 = width * 0.12;
      const elbowX2 = width * 0.88;

      const vertPipeColor = activeT === 'light' ? '#94a3b8' : activeT === 'blueprint' ? '#0f284f' : activeT === 'amber' ? '#241709' : '#222b37';
      const flangeOuter = activeT === 'light' ? '#cbd5e1' : activeT === 'blueprint' ? '#1d4ed8' : activeT === 'amber' ? '#78350f' : '#3a4759';
      const flangeInner = activeT === 'light' ? '#f1f5f9' : activeT === 'blueprint' ? '#08172e' : activeT === 'amber' ? '#120b04' : '#1a222d';

      [elbowX1, elbowX2].forEach((px) => {
        ctx.fillStyle = vertPipeColor;
        ctx.fillRect(px - 14, 70, 28, height - 160);
        // Flanges
        for (let fy = 150; fy < height - 120; fy += 140) {
          ctx.fillStyle = flangeOuter;
          ctx.fillRect(px - 18, fy, 36, 12);
          ctx.fillStyle = flangeInner;
          ctx.fillRect(px - 16, fy + 4, 32, 4);
        }
      });

      // 3. Draw Rotating Machinery Gears / Cogs on both sides
      const drawGear = (cx: number, cy: number, radius: number, teeth: number, rotation: number, color: string, innerColor: string, hubColor: string) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotation);
        ctx.fillStyle = color;
        ctx.beginPath();
        for (let i = 0; i < teeth; i++) {
          const angle = (i * 2 * Math.PI) / teeth;
          const nextAngle = ((i + 0.5) * 2 * Math.PI) / teeth;
          ctx.arc(0, 0, radius, angle, nextAngle);
          ctx.lineTo(Math.cos(nextAngle) * (radius + 12), Math.sin(nextAngle) * (radius + 12));
          const stepAngle = ((i + 0.8) * 2 * Math.PI) / teeth;
          ctx.lineTo(Math.cos(stepAngle) * (radius + 12), Math.sin(stepAngle) * (radius + 12));
        }
        ctx.closePath();
        ctx.fill();

        // Inner circle
        ctx.fillStyle = innerColor;
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.55, 0, Math.PI * 2);
        ctx.fill();

        // Center hub
        ctx.fillStyle = hubColor;
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.22, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };

      let gearC1 = '#252f3d';
      let gearC2 = '#2f3b4c';
      let gearInner = '#11161d';
      let gearHub = '#3f4e63';

      if (activeT === 'light') {
        gearC1 = '#64748b';
        gearC2 = '#475569';
        gearInner = '#e2e8f0';
        gearHub = '#0284c7';
      } else if (activeT === 'blueprint') {
        gearC1 = '#173566';
        gearC2 = '#1e40af';
        gearInner = '#061325';
        gearHub = '#38bdf8';
      } else if (activeT === 'amber') {
        gearC1 = '#361e07';
        gearC2 = '#4a2808';
        gearInner = '#0d0803';
        gearHub = '#fbbf24';
      }

      const gearRot1 = tick * 0.008;
      const gearRot2 = -tick * 0.012;
      drawGear(elbowX1 + 5, 240, 65, 12, gearRot1, gearC1, gearInner, gearHub);
      drawGear(elbowX1 + 95, 320, 45, 10, gearRot2, gearC2, gearInner, gearHub);

      drawGear(elbowX2 - 10, 260, 70, 14, -gearRot1, gearC1, gearInner, gearHub);
      drawGear(elbowX2 - 100, 340, 50, 10, -gearRot2, gearC2, gearInner, gearHub);

      // 4. Welding Sparks Generation & Physics
      // Emit sparks from 2 welding points
      if (tick % 2 === 0) {
        createSpark(elbowX1 + 95, 320);
        createSpark(elbowX2 - 10, 260);
      }
      if (Math.random() < 0.25) {
        // burst
        for (let b = 0; b < 6; b++) {
          createSpark(width * 0.5 + (Math.random() - 0.5) * 200, 94);
        }
      }

      // Update & draw sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.14; // Gravity
        s.life++;

        const alpha = 1 - s.life / s.maxLife;
        if (alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = s.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLaunch = () => {
    sound.playArcadeStart();
    const config = PROCESS_OPTIONS.find((p) => p.id === selectedId) || PROCESS_OPTIONS[0];
    onSelectProcess(config, selectedRoleId);
  };

  const selectedRole = getRoleById(selectedRoleId);
  const selectedProcess = PROCESS_OPTIONS.find((p) => p.id === selectedId) || PROCESS_OPTIONS[0];

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden selection:bg-amber-500 selection:text-zinc-950">
      {/* Background Interactive Machinery Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none w-full h-full" />

      {/* Top Arcade Header Bar */}
      <header className="relative z-10 p-4 sm:p-6 flex items-center justify-between border-b border-[#242e3b]/80 bg-[#0c1015]/80 backdrop-blur-sm">
        <div className="flex items-center gap-2 font-mono text-xs text-amber-400">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
          <span className="font-bold tracking-widest uppercase">INDUSTRIAL SIMULATOR SYSTEM // 2026</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 font-mono text-xs">
          {onSelectTheme && (
            <div className="flex items-center bg-[#171e27] border border-[#283544] rounded p-0.5 text-zinc-300">
              <button
                onClick={() => { sound.playClick(); onSelectTheme('dark'); }}
                className={`px-2 py-0.5 rounded text-[11px] flex items-center gap-1 transition-all cursor-pointer ${
                  currentTheme === 'dark' ? 'bg-amber-500 text-zinc-950 font-bold' : 'hover:text-white'
                }`}
                title="Estilo Oscuro SCADA"
              >
                <Moon className="w-3 h-3" />
                <span className="hidden md:inline">Oscuro</span>
              </button>
              <button
                onClick={() => { sound.playClick(); onSelectTheme('light'); }}
                className={`px-2 py-0.5 rounded text-[11px] flex items-center gap-1 transition-all cursor-pointer ${
                  currentTheme === 'light' ? 'bg-blue-600 text-white font-bold' : 'hover:text-white'
                }`}
                title="Estilo Claro Sala Limpia"
              >
                <Sun className="w-3 h-3" />
                <span className="hidden md:inline">Claro</span>
              </button>
              <button
                onClick={() => { sound.playClick(); onSelectTheme('blueprint'); }}
                className={`px-2 py-0.5 rounded text-[11px] flex items-center gap-1 transition-all cursor-pointer ${
                  currentTheme === 'blueprint' ? 'bg-cyan-500 text-zinc-950 font-bold' : 'hover:text-white'
                }`}
                title="Estilo Plano Blueprint CAD"
              >
                <Compass className="w-3 h-3" />
                <span className="hidden md:inline">Blueprint</span>
              </button>
              <button
                onClick={() => { sound.playClick(); onSelectTheme('amber'); }}
                className={`px-2 py-0.5 rounded text-[11px] flex items-center gap-1 transition-all cursor-pointer ${
                  currentTheme === 'amber' ? 'bg-amber-500 text-zinc-950 font-bold' : 'hover:text-white'
                }`}
                title="Estilo Terminal CRT Ámbar"
              >
                <Terminal className="w-3 h-3" />
                <span className="hidden md:inline">Ámbar</span>
              </button>
            </div>
          )}

          <div className="hidden sm:flex items-center gap-2 text-zinc-400">
            <span>INGENIERO INDUSTRIAL</span>
            <span className="text-zinc-600">·</span>
            <span className="text-emerald-400 font-bold">1P READY</span>
          </div>
        </div>
      </header>

      {/* Main Title Hero Area */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 py-6 sm:py-8 text-center flex flex-col items-center justify-center flex-1">
        
        {/* Mario-Style Retro Arcade Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1a222c] border border-amber-500/50 rounded text-amber-400 font-mono text-xs uppercase tracking-widest mb-3 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>OPERATIONS MANAGEMENT RPG · MULTI-ROLE SYSTEM</span>
        </div>

        {/* Big Industrial Arcade Title: "PRODUCTION MAN" */}
        <div className="relative mb-2">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-sans text-transparent bg-clip-text bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)] select-none">
            PRODUCTION MAN
          </h1>
          <div className="absolute -top-3 left-0 w-3 h-3 rounded-full bg-zinc-600 border border-zinc-400 shadow-inner"></div>
          <div className="absolute -top-3 right-0 w-3 h-3 rounded-full bg-zinc-600 border border-zinc-400 shadow-inner"></div>
        </div>

        {/* Hazard Title Divider */}
        <div className="w-48 sm:w-80 h-2 bg-[repeating-linear-gradient(45deg,#f59e0b,#f59e0b_8px,#141a22_8px,#141a22_16px)] mx-auto rounded mb-3 shadow-md"></div>

        <p className="text-xs sm:text-sm text-zinc-300 font-mono max-w-xl mx-auto mb-6 leading-relaxed">
          Simulación sistémica de operaciones. Selecciona la <strong className="text-white">Planta</strong> y asume el <strong className="text-amber-400">Cargo Operativo</strong> desde el cual tomarás decisiones:
        </p>

        {/* Setup Navigation Tabs: 1. Planta vs 2. Cargo / Rol */}
        <div className="flex items-center justify-center p-1 bg-[#121720] border border-[#263242] rounded-xl mb-6 font-mono text-xs w-full max-w-lg shadow-lg">
          <button
            onClick={() => { sound.playClick(); setActiveSetupTab('process'); }}
            className={`flex-1 py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeSetupTab === 'process'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Factory className="w-4 h-4" />
            <span>1. Planta: {selectedProcess.title.split(' ')[0]}</span>
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveSetupTab('role'); }}
            className={`flex-1 py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeSetupTab === 'role'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>2. Cargo: {selectedRole.avatarInitials} ({selectedRole.name.split(' ')[0]})</span>
          </button>
        </div>

        {/* TAB 1: PROCESS SELECTION */}
        {activeSetupTab === 'process' && (
          <div className="w-full space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-left">
              {PROCESS_OPTIONS.map((process, index) => {
                const isSelected = process.id === selectedId;
                return (
                  <div
                    key={process.id}
                    onClick={() => {
                      sound.playProcessSelect();
                      setSelectedId(process.id);
                    }}
                    className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-[#18212c] border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.3)] scale-[1.02]'
                        : 'bg-[#12161e]/90 border-[#252f3d] hover:border-zinc-400 hover:bg-[#161c26]'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute -top-2.5 right-3 px-2 py-0.5 bg-amber-500 text-zinc-950 font-mono font-bold text-[10px] rounded shadow-md flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>PLANTA ELEGIDA</span>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-bold text-amber-400">
                          MODO 0{index + 1}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400 px-1.5 py-0.5 bg-[#1b232e] rounded border border-[#2a3646]">
                          {process.defaultTargetUnits.toLocaleString()} u/día
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors font-sans">
                        {process.title}
                      </h3>
                      <div className="text-[11px] text-zinc-400 font-mono mb-2">
                        {process.subtitle}
                      </div>

                      <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                        {process.productDescription}
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-[#232c39] text-[10px] font-mono text-zinc-400">
                      <div className="flex justify-between">
                        <span>Restricción:</span>
                        <strong className="text-amber-400 truncate ml-1">{process.bottleneckStation}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Precio Medio:</span>
                        <strong className="text-zinc-200">${process.unitPrice} USD/u</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center pt-2">
              <button
                onClick={() => { sound.playClick(); setActiveSetupTab('role'); }}
                className="px-6 py-2.5 bg-[#18212c] hover:bg-[#222b38] border border-amber-500/50 hover:border-amber-400 text-amber-400 hover:text-amber-300 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Paso 2: Elegir Cargo Operativo (Rol)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: ROLE SELECTION */}
        {activeSetupTab === 'role' && (
          <div className="w-full space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-left">
              {PLANT_ROLES.map((role) => {
                const isSelected = role.id === selectedRoleId;
                return (
                  <div
                    key={role.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedRoleId(role.id);
                    }}
                    className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-[#18212c] border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.3)] scale-[1.02]'
                        : 'bg-[#12161e]/90 border-[#252f3d] hover:border-zinc-400 hover:bg-[#161c26]'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute -top-2.5 right-3 px-2 py-0.5 bg-amber-500 text-zinc-950 font-mono font-bold text-[10px] rounded shadow-md flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>CARGO ELEGIDO</span>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-3 mb-2.5">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${role.avatarColor} text-white font-mono font-bold flex items-center justify-center text-sm shadow-md border border-white/20 shrink-0`}>
                          {role.avatarInitials}
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            {role.department}
                          </span>
                          <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors font-sans mt-0.5">
                            {role.name}
                          </h3>
                        </div>
                      </div>

                      <p className="text-xs text-zinc-300 leading-relaxed mb-3 line-clamp-2">
                        {role.mission}
                      </p>

                      <div className="p-2.5 bg-[#0d1219] rounded-lg border border-[#1f2937] text-[11px] font-mono text-zinc-300 mb-2.5">
                        <div className="flex items-center justify-between mb-1.5">
                          <strong className="text-amber-400">Atributos Exclusivos de Tu Área:</strong>
                          <span className="text-[10px] text-zinc-400">4 KPIs Departamentales</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 text-zinc-300 text-[10px]">
                          {role.primaryKpis.map((k, idx) => (
                            <div key={idx} className="truncate bg-[#141b24] p-1 rounded border border-[#212c3b]">
                              <span className="text-amber-300 font-bold truncate block">• {k.label}</span>
                              <span className="text-zinc-400 block text-[9px] truncate">{k.targetDesc}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 pt-1.5 border-t border-[#1f2937] flex items-center justify-between text-[10px] text-zinc-400">
                          <span className="text-amber-400 font-bold shrink-0 mr-1">Decisiones Tácticas:</span>
                          <span className="truncate text-zinc-300">{role.tacticalActions.map(a => a.label).join(' · ')}</span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-rose-950/20 rounded-lg border border-rose-500/30 text-[11px] text-rose-200">
                        <strong className="text-rose-300 font-bold block mb-0.5">⚠️ Impacto Sistémico en los Demás: </strong>
                        <span>{role.crossImpactWarning}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Role Selector Strip inside Tab 1 so player can switch role right on main page */}
        {activeSetupTab === 'process' && (
          <div className="w-full mt-4 p-3 bg-[#111722]/90 border border-[#253347] rounded-xl flex flex-col md:flex-row items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-2 font-mono text-xs text-zinc-300">
              <span className="text-amber-400 font-bold">Cargo Seleccionado:</span>
              <span className="font-bold text-white bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">
                {selectedRole.name} ({selectedRole.characterName})
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {PLANT_ROLES.map((r) => {
                const isRSelected = r.id === selectedRoleId;
                return (
                  <button
                    key={r.id}
                    onClick={() => { sound.playClick(); setSelectedRoleId(r.id); }}
                    className={`px-2 py-1 rounded text-[11px] font-mono flex items-center gap-1 transition-all cursor-pointer ${
                      isRSelected
                        ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                        : 'bg-[#18212c] text-zinc-400 hover:text-white border border-[#2a3648]'
                    }`}
                    title={`${r.name} - ${r.department}`}
                  >
                    <span>{r.avatarInitials}</span>
                    <span className="hidden xl:inline">{r.name.split(' ')[0]}</span>
                  </button>
                );
              })}
              <button
                onClick={() => { sound.playClick(); setActiveSetupTab('role'); }}
                className="text-[11px] font-mono text-amber-400 hover:text-amber-300 underline ml-1 cursor-pointer"
              >
                Ver Atributos & Impacto →
              </button>
            </div>
          </div>
        )}

        {/* Pre-Flight Mission Summary Box */}
        <div className="w-full mt-6 p-4 bg-[#111722]/90 border border-[#253347] rounded-xl text-left shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 mb-2 border-b border-[#1f2b3c] gap-2">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-zinc-400">Planta Seleccionada:</span>
              <strong className="text-white bg-[#1a2332] px-2 py-0.5 rounded border border-[#2a384d]">{selectedProcess.plantName}</strong>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-400">Cargo Activo:</span>
              <strong className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">{selectedRole.name} ({selectedRole.characterName})</strong>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 hidden md:inline">
              Puedes cambiar de cargo en cualquier momento en el juego
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            <div>
              <span className="text-zinc-400 block text-[11px]">Tu Misión Departamental:</span>
              <p className="text-zinc-200 mt-0.5 leading-relaxed">{selectedRole.mission}</p>
            </div>
            <div className="p-2.5 bg-rose-950/20 rounded-lg border border-rose-500/30">
              <span className="text-rose-300 font-bold block text-[11px]">⚠️ Impacto Sistémico de Tus Decisiones:</span>
              <p className="text-rose-200/90 mt-0.5 leading-relaxed text-[11px]">{selectedRole.crossImpactWarning}</p>
            </div>
          </div>
        </div>

        {/* Big Mario Style "PRESS START" Button */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleLaunch}
            className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-extrabold text-base rounded-xl flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-[0_10px_35px_rgba(245,158,11,0.5)] cursor-pointer tracking-wider font-mono"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>PRESS START // ASUMIR {selectedRole.name.toUpperCase()}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="text-[11px] text-zinc-400 font-mono mt-3 flex items-center justify-center gap-2">
          <span>* Accederás a la planta operando con los atributos y tableros de tu cargo</span>
        </div>
      </main>

      {/* Arcade Style Footer */}
      <footer className="relative z-10 border-t border-[#222b37]/80 bg-[#0a0d12]/90 backdrop-blur-sm p-4 text-xs font-mono text-zinc-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            PRODUCTION MAN · 100% Simulación de Ingeniería Industrial
          </div>
          <div className="flex items-center gap-3 text-zinc-400">
            <span>© 2026 MANUFACTURE OPERATIONS</span>
            <span>·</span>
            <span>S&OP · LEAN · TOC · TPM</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
