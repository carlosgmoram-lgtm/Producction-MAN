import React from 'react';
import { 
  PlantRoleId, 
  PlantIndicators, 
  PlantUnit, 
  MachineDefinition, 
  MaintenancePlanState 
} from '../types/game';
import { getRoleById, PLANT_ROLES } from '../data/rolesData';
import { sound } from '../utils/audio';
import { 
  UserCheck, AlertTriangle, ArrowRight, Zap, Target, 
  ShieldAlert, Activity, RefreshCw, ChevronRight, Sparkles 
} from 'lucide-react';

interface RoleCockpitProps {
  currentRole: PlantRoleId;
  onOpenRoleSelector: () => void;
  indicators: PlantIndicators;
  units: PlantUnit[];
  machines: MachineDefinition[];
  maintenancePlan: MaintenancePlanState;
  hour: number;
  onExecuteTacticalAction: (actionId: string, cost: number, label: string) => void;
}

export const RoleCockpit: React.FC<RoleCockpitProps> = ({
  currentRole,
  onOpenRoleSelector,
  indicators,
  units,
  machines,
  maintenancePlan,
  hour,
  onExecuteTacticalAction
}) => {
  const role = getRoleById(currentRole);

  // Dynamic KPI value resolver for the current role
  const getKpiValue = (key: string): { display: string; status: 'good' | 'warning' | 'danger' } => {
    switch (key) {
      // Gerente Planta
      case 'oee': {
        const val = indicators.oee;
        return {
          display: `${val.toFixed(1)}%`,
          status: val >= 85 ? 'good' : val >= 75 ? 'warning' : 'danger'
        };
      }
      case 'ebitda': {
        const val = indicators.dailyRevenue - indicators.dailyCost;
        return {
          display: `$${val.toLocaleString()}`,
          status: val > 0 ? 'good' : val === 0 ? 'warning' : 'danger'
        };
      }
      case 'boardApproval': {
        const val = indicators.boardApproval;
        return {
          display: `${val}%`,
          status: val >= 80 ? 'good' : val >= 65 ? 'warning' : 'danger'
        };
      }
      case 'plantMorale': {
        const val = indicators.plantMorale;
        return {
          display: `${val}%`,
          status: val >= 75 ? 'good' : val >= 60 ? 'warning' : 'danger'
        };
      }

      // Jefe Producción
      case 'productionProgress': {
        const pct = Math.min(100, Math.round((indicators.unitsProducedToday / Math.max(1, indicators.dailyProductionTarget)) * 100));
        return {
          display: `${pct}% (${indicators.unitsProducedToday.toLocaleString()} / ${indicators.dailyProductionTarget.toLocaleString()})`,
          status: pct >= 80 ? 'good' : pct >= 50 ? 'warning' : 'danger'
        };
      }
      case 'performance': {
        const val = indicators.performance;
        return {
          display: `${val.toFixed(1)}%`,
          status: val >= 90 ? 'good' : val >= 80 ? 'warning' : 'danger'
        };
      }
      case 'cadence': {
        const elapsedHours = Math.max(1, hour - 7);
        const cadence = Math.round(indicators.unitsProducedToday / elapsedHours);
        return {
          display: `${cadence.toLocaleString()} u/h`,
          status: cadence >= 180 ? 'good' : 'warning'
        };
      }
      case 'prodStress': {
        const procUnit = units.find((u) => u.id === 'proceso');
        const val = procUnit ? procUnit.stressLevel : 45;
        return {
          display: `${val}%`,
          status: val < 60 ? 'good' : val < 80 ? 'warning' : 'danger'
        };
      }

      // Jefe Calidad
      case 'qualityRate': {
        const val = indicators.qualityRate;
        return {
          display: `${val.toFixed(1)}%`,
          status: val >= 98.5 ? 'good' : val >= 96 ? 'warning' : 'danger'
        };
      }
      case 'scrapPpm': {
        const val = indicators.scrapPpm;
        return {
          display: `${val} PPM`,
          status: val <= 150 ? 'good' : val <= 350 ? 'warning' : 'danger'
        };
      }
      case 'conformityRate': {
        const qualUnit = units.find((u) => u.id === 'calidad');
        const val = qualUnit ? qualUnit.health : 92;
        return {
          display: `${val}%`,
          status: val >= 90 ? 'good' : val >= 75 ? 'warning' : 'danger'
        };
      }
      case 'auditRisk': {
        const risk = indicators.scrapPpm > 300 ? 68 : indicators.scrapPpm > 180 ? 35 : 12;
        return {
          display: `${risk}% Riesgo`,
          status: risk < 30 ? 'good' : risk < 60 ? 'warning' : 'danger'
        };
      }

      // Jefe Mantenimiento
      case 'availability': {
        const val = indicators.availability;
        return {
          display: `${val.toFixed(1)}%`,
          status: val >= 92 ? 'good' : val >= 82 ? 'warning' : 'danger'
        };
      }
      case 'mtbf': {
        const val = maintenancePlan.mtbfHours;
        return {
          display: `${val}h`,
          status: val >= 140 ? 'good' : val >= 100 ? 'warning' : 'danger'
        };
      }
      case 'mttr': {
        const val = maintenancePlan.mttrHours;
        return {
          display: `${val.toFixed(1)}h`,
          status: val <= 2.5 ? 'good' : val <= 4.0 ? 'warning' : 'danger'
        };
      }
      case 'avgWear': {
        const avg = machines.length > 0
          ? Math.round(machines.reduce((acc, m) => acc + m.wearPercent, 0) / machines.length)
          : 0;
        return {
          display: `${avg}%`,
          status: avg < 40 ? 'good' : avg < 65 ? 'warning' : 'danger'
        };
      }

      // Jefe Abastecimiento
      case 'mpDays': {
        const days = Number((indicators.rawMaterialTons / 12).toFixed(1));
        return {
          display: `${days} días`,
          status: days >= 4 ? 'good' : days >= 2 ? 'warning' : 'danger'
        };
      }
      case 'mpTons': {
        return {
          display: `${indicators.rawMaterialTons.toFixed(1)} t`,
          status: indicators.rawMaterialTons >= 40 ? 'good' : 'warning'
        };
      }
      case 'mpCostUnit': {
        return {
          display: '$1.42 /kg',
          status: 'good'
        };
      }
      case 'supplierRating': {
        const recepUnit = units.find((u) => u.id === 'recepcion');
        const val = recepUnit ? recepUnit.efficiency : 94;
        return {
          display: `${val}%`,
          status: val >= 90 ? 'good' : 'warning'
        };
      }

      // Jefe Despacho
      case 'otif': {
        const val = indicators.otif;
        return {
          display: `${val.toFixed(1)}%`,
          status: val >= 95 ? 'good' : val >= 85 ? 'warning' : 'danger'
        };
      }
      case 'customerNps': {
        const val = indicators.customerNps;
        return {
          display: `${val > 0 ? '+' : ''}${val} pts`,
          status: val >= 60 ? 'good' : val >= 30 ? 'warning' : 'danger'
        };
      }
      case 'leadTime': {
        const val = indicators.leadTimeHours;
        return {
          display: `${val.toFixed(1)}h`,
          status: val <= 24 ? 'good' : 'warning'
        };
      }
      case 'dockUsage': {
        return {
          display: '74% Uso',
          status: 'good'
        };
      }

      default:
        return { display: '100%', status: 'good' };
    }
  };

  const getStatusBadgeClass = (status: 'good' | 'warning' | 'danger') => {
    switch (status) {
      case 'good':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'warning':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'danger':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30 animate-pulse';
    }
  };

  return (
    <div className="w-full bg-[#12161e] border border-[#232c39] rounded-xl p-4 shadow-lg text-zinc-100 transition-all">
      {/* Top Banner: Current Role & Switch Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3.5 mb-3.5 border-b border-[#222b37] gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${role.avatarColor} text-white font-mono font-bold flex items-center justify-center text-sm shadow-md border border-white/20 shrink-0`}>
            {role.avatarInitials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                Rol Activo · {role.department}
              </span>
              <span className="text-xs text-zinc-400 font-mono hidden sm:inline">
                {role.characterName}
              </span>
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              {role.name}
            </h3>
            <p className="text-xs text-zinc-400 font-mono mt-0.5 line-clamp-1">
              {role.mission}
            </p>
          </div>
        </div>

        {/* Change Role Button */}
        <button
          onClick={() => { sound.playClick(); onOpenRoleSelector(); }}
          className="self-start md:self-auto px-3 py-1.5 bg-[#171e27] hover:bg-[#222b38] border border-[#2d3a4d] hover:border-amber-500/60 text-zinc-200 hover:text-white rounded-lg text-xs font-mono font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm whitespace-nowrap"
          title="Cambiar a otro rol departamental para ver la planta desde su perspectiva"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          <span>Cambiar de Rol</span>
          <ChevronRight className="w-3 h-3 text-zinc-500" />
        </button>
      </div>

      {/* Grid: 4 Role Specific KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-4">
        {role.primaryKpis.map((kpi, idx) => {
          const metric = getKpiValue(kpi.key);
          return (
            <div
              key={idx}
              className="p-2.5 rounded-lg bg-[#0e1218] border border-[#1f2835] flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-1">
                <span className="line-clamp-1">{kpi.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold border ${getStatusBadgeClass(metric.status)}`}>
                  {metric.status === 'good' ? 'OPTIMO' : metric.status === 'warning' ? 'ALERTA' : 'CRITICO'}
                </span>
              </div>
              <div className="text-lg font-bold font-mono tracking-tight text-white">
                {metric.display}
              </div>
              <div className="text-[10px] text-zinc-500 font-mono mt-0.5 line-clamp-1">
                {kpi.targetDesc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Role Tactical Powers & Cross-Impact Notice */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 pt-1">
        {/* Cross-Impact Warning (Thoughts of your department vs other areas) */}
        <div className="lg:col-span-7 p-3 rounded-lg bg-[#0e131b] border border-[#232f3e] flex items-start gap-2.5">
          <div className="p-1 rounded bg-amber-500/20 text-amber-400 mt-0.5 shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="text-xs space-y-1">
            <div className="font-mono font-bold text-amber-300 uppercase text-[11px]">
              Impacto Cruzado Sistémico de Tu Área:
            </div>
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              {role.crossImpactWarning}
            </p>
          </div>
        </div>

        {/* Tactical Department Actions */}
        <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-2">
          {role.tacticalActions.map((action) => (
            <button
              key={action.id}
              onClick={() => onExecuteTacticalAction(action.id, action.cost, action.label)}
              className="w-full px-3 py-2 bg-gradient-to-r from-[#17202c] to-[#1c2736] hover:from-[#1d2a3a] hover:to-[#223043] border border-[#2d3d52] hover:border-amber-500/60 rounded-lg text-left transition-all cursor-pointer shadow-sm group flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors flex items-center gap-1.5 font-mono">
                  <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{action.label}</span>
                </div>
                <div className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">
                  {action.description}
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 whitespace-nowrap ml-2">
                -${action.cost}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
