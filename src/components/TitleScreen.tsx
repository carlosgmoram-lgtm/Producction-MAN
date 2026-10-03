import React, { useEffect, useRef, useState } from 'react';
import { ProcessConfig } from '../types/game';
import { PROCESS_OPTIONS } from '../data/processesData';
import { sound } from '../utils/audio';
import { 
  Flame, Wrench, Factory, Play, ArrowRight, 
  Sparkles, ShieldCheck, Gauge, Cog, Cpu, Package
} from 'lucide-react';

interface TitleScreenProps {
  onSelectProcess: (process: ProcessConfig) => void;
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

export const TitleScreen: React.FC<TitleScreenProps> = ({ onSelectProcess }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedId, setSelectedId] = useState<string>('ENVASES_PRECISION');

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
      sparks.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 2.8 + 1,
        life: 0,
        maxLife: Math.random() * 45 + 25,
        color: sparkColors[Math.floor(Math.random() * sparkColors.length)]
      });
    };

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Industrial Dark Steel Grid Pattern
      ctx.fillStyle = '#090c10';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = '#151b23';
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
      ctx.fillStyle = '#1e2632';
      ctx.fillRect(0, 70, width, 24);
      ctx.fillStyle = '#2d3848';
      ctx.fillRect(0, 74, width, 4); // Pipe highlight
      ctx.fillStyle = '#131922';
      ctx.fillRect(0, 90, width, 4); // Pipe shadow

      // Pipe Flanges on Top Pipe
      for (let fx = 120; fx < width; fx += 260) {
        ctx.fillStyle = '#344154';
        ctx.fillRect(fx - 6, 64, 12, 36);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(fx - 2, 78, 4, 8); // Valve / indicator
      }

      // Pipe 2 (Bottom Horizontal)
      ctx.fillStyle = '#1a222c';
      ctx.fillRect(0, height - 90, width, 32);
      ctx.fillStyle = '#293545';
      ctx.fillRect(0, height - 86, width, 5);
      ctx.fillStyle = '#10151c';
      ctx.fillRect(0, height - 66, width, 6);

      // Vertical Pipe Connectors (Piping Elbows)
      const elbowX1 = width * 0.12;
      const elbowX2 = width * 0.88;

      [elbowX1, elbowX2].forEach((px) => {
        ctx.fillStyle = '#222b37';
        ctx.fillRect(px - 14, 70, 28, height - 160);
        // Flanges
        for (let fy = 150; fy < height - 120; fy += 140) {
          ctx.fillStyle = '#3a4759';
          ctx.fillRect(px - 18, fy, 36, 12);
          ctx.fillStyle = '#1a222d';
          ctx.fillRect(px - 16, fy + 4, 32, 4);
        }
      });

      // 3. Draw Rotating Machinery Gears / Cogs on both sides
      const drawGear = (cx: number, cy: number, radius: number, teeth: number, rotation: number, color: string) => {
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
        ctx.fillStyle = '#11161d';
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.55, 0, Math.PI * 2);
        ctx.fill();

        // Center hub
        ctx.fillStyle = '#3f4e63';
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.22, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };

      const gearRot1 = tick * 0.008;
      const gearRot2 = -tick * 0.012;
      drawGear(elbowX1 + 5, 240, 65, 12, gearRot1, '#252f3d');
      drawGear(elbowX1 + 95, 320, 45, 10, gearRot2, '#2f3b4c');

      drawGear(elbowX2 - 10, 260, 70, 14, -gearRot1, '#252f3d');
      drawGear(elbowX2 - 100, 340, 50, 10, -gearRot2, '#2f3b4c');

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
    onSelectProcess(config);
  };

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

        <div className="flex items-center gap-3 font-mono text-xs text-zinc-400">
          <span className="hidden sm:inline">INGENIERO INDUSTRIAL</span>
          <span className="text-zinc-600">·</span>
          <span className="text-emerald-400 font-bold">1P READY</span>
        </div>
      </header>

      {/* Main Title Hero Area (Mario / Arcade Title Style) */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 py-6 sm:py-10 text-center flex flex-col items-center justify-center flex-1">
        
        {/* Mario-Style Retro Arcade Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1a222c] border border-amber-500/50 rounded text-amber-400 font-mono text-xs uppercase tracking-widest mb-4 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>OPERATIONS MANAGEMENT RPG</span>
        </div>

        {/* Big Industrial Arcade Title: "PRODUCTION MAN" */}
        <div className="relative mb-2">
          {/* Shadow 3D Extrusion */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-sans text-transparent bg-clip-text bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)] select-none">
            PRODUCTION MAN
          </h1>
          {/* Decorative Industrial Rivets */}
          <div className="absolute -top-3 left-0 w-3 h-3 rounded-full bg-zinc-600 border border-zinc-400 shadow-inner"></div>
          <div className="absolute -top-3 right-0 w-3 h-3 rounded-full bg-zinc-600 border border-zinc-400 shadow-inner"></div>
        </div>

        {/* Hazard Title Divider */}
        <div className="w-48 sm:w-80 h-2 bg-[repeating-linear-gradient(45deg,#f59e0b,#f59e0b_8px,#141a22_8px,#141a22_16px)] mx-auto rounded mb-3 shadow-md"></div>

        <p className="text-xs sm:text-sm text-zinc-300 font-mono max-w-xl mx-auto mb-8 leading-relaxed">
          Interpreta al <strong className="text-white">Ingeniero Industrial</strong> a cargo de la operación de planta. Selecciona el tipo de proceso productivo para iniciar tu gestión:
        </p>

        {/* Selection Area: The 4 Process Options */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-8 text-left">
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
                {/* Selection Marker */}
                {isSelected && (
                  <div className="absolute -top-2.5 right-3 px-2 py-0.5 bg-amber-500 text-zinc-950 font-mono font-bold text-[10px] rounded shadow-md flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>SELECCIONADO</span>
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

        {/* Big Mario Style "PRESS START / ASUMIR GERENCIA" Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleLaunch}
            className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-extrabold text-base rounded-xl flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-[0_10px_35px_rgba(245,158,11,0.5)] cursor-pointer tracking-wider font-mono"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>PRESS START // ASUMIR GERENCIA</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="text-[11px] text-zinc-400 font-mono mt-3 flex items-center justify-center gap-2">
          <span>* Al presionar Start accederás a la descripción ejecutiva de la planta seleccionada</span>
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
