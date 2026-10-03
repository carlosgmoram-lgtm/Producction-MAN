import React from 'react';
import { CASE_STUDIES } from '../data/plantData';
import { CaseStudy } from '../types/game';
import { BookOpen, Play, CheckCircle, ArrowRight, Zap, Target } from 'lucide-react';
import { sound } from '../utils/audio';

interface ScenarioSelectorProps {
  onSelectCaseStudy: (caseStudy: CaseStudy) => void;
  onSelectCareerMode: () => void;
  currentMode: 'CAREER' | 'SANDBOX' | 'CASE_STUDY';
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  onSelectCaseStudy,
  onSelectCareerMode,
  currentMode
}) => {
  return (
    <div className="space-y-6">
      {/* Introduction Banner */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
            <Target className="w-3.5 h-3.5" />
            <span>Casos de Estudio & Metodologías Industriales</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Desafíos Prácticos de Ingeniería Industrial
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Enfrenta escenarios críticos reales extraídos de la industria manufacturera: cuellos de botella de Goldratt, crisis de calidad y contención de lotes, distorsión en la cadena de suministro (Efecto Látigo), y paradas mayores por falta de confiabilidad.
          </p>
        </div>

        <button
          onClick={() => { sound.playClick(); onSelectCareerMode(); }}
          className={`px-5 py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all whitespace-nowrap shadow-md ${
            currentMode === 'CAREER'
              ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
              : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700'
          }`}
        >
          <Play className="w-4 h-4" />
          <span>{currentMode === 'CAREER' ? 'Modo Carrera Activo' : 'Volver a Modo Carrera'}</span>
        </button>
      </div>

      {/* Grid of Case Studies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CASE_STUDIES.map((study) => (
          <div
            key={study.id}
            className="p-5 bg-slate-900 border border-slate-800 rounded-xl hover:border-amber-500/60 transition-all flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Dificultad: {study.difficulty}
                </span>
                <span className="text-xs text-amber-400 font-mono">Caso Aplicado</span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                {study.title}
              </h3>
              <div className="text-xs font-mono text-slate-400 mb-3">
                {study.subtitle}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {study.description}
              </p>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800/80 text-xs text-amber-300 font-mono space-y-1 mb-4">
                <strong>Objetivo del Gerente: </strong>
                {study.targetObjective}
              </div>
            </div>

            <button
              onClick={() => { sound.playClick(); onSelectCaseStudy(study); }}
              className="w-full py-2.5 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 border border-slate-700 hover:border-amber-500"
            >
              <span>Cargar Escenario</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
