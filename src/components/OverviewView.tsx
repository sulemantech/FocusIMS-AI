import React from 'react';
import {
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  ShieldAlert,
  GraduationCap,
  ClipboardList,
  Sparkles,
  ArrowRight,
  Clock,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { NavTab } from './Sidebar';

interface OverviewViewProps {
  onNavigateTab: (tab: NavTab) => void;
  onOpenRecord: (id: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  onNavigateTab,
  onOpenRecord,
}) => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Good morning</h1>
        <p className="text-sm text-slate-500 mt-1">
          Here’s what requires attention across your management system.
        </p>
      </div>

      {/* Six KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* Open Corrective Actions */}
        <div
          onClick={() => onNavigateTab('corrective-actions')}
          className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-teal-400 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Open Corrective Actions</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">12</span>
            <span className="text-[11px] text-slate-500 font-medium">active</span>
          </div>
          <p className="text-[11px] text-teal-600 font-medium mt-2 flex items-center gap-1 group-hover:translate-x-0.5 transition">
            View actions <ChevronRight className="w-3 h-3" />
          </p>
        </div>

        {/* Overdue Actions */}
        <div
          onClick={() => onNavigateTab('corrective-actions')}
          className="p-4 rounded-xl bg-white border border-rose-200 shadow-xs hover:border-rose-400 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-rose-600 mb-2">
            <span className="text-xs font-semibold">Overdue Actions</span>
            <AlertOctagon className="w-4 h-4 text-rose-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-600">4</span>
            <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded">
              High attention
            </span>
          </div>
          <p className="text-[11px] text-rose-700 font-medium mt-2 flex items-center gap-1 group-hover:translate-x-0.5 transition">
            1 high-priority <ChevronRight className="w-3 h-3" />
          </p>
        </div>

        {/* Open Incidents */}
        <div
          onClick={() => onNavigateTab('incidents')}
          className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-teal-400 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Open Incidents</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">7</span>
            <span className="text-[11px] text-slate-500 font-medium">3 closed</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-2 flex items-center gap-1 group-hover:translate-x-0.5 transition">
            View register <ChevronRight className="w-3 h-3" />
          </p>
        </div>

        {/* High Risks */}
        <div
          onClick={() => onNavigateTab('risks')}
          className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-teal-400 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">High Risks</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">3</span>
            <span className="text-[11px] text-amber-700 font-medium bg-amber-50 px-1.5 py-0.2 rounded">
              2 overdue
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-2 flex items-center gap-1 group-hover:translate-x-0.5 transition">
            Residual score &gt; 10 <ChevronRight className="w-3 h-3" />
          </p>
        </div>

        {/* Training Expiring */}
        <div
          onClick={() => onNavigateTab('training')}
          className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-teal-400 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Training Expiring</span>
            <GraduationCap className="w-4 h-4 text-sky-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">6</span>
            <span className="text-[11px] text-slate-500 font-medium">&lt;30 days</span>
          </div>
          <p className="text-[11px] text-sky-700 font-medium mt-2 flex items-center gap-1 group-hover:translate-x-0.5 transition">
            4 at heights <ChevronRight className="w-3 h-3" />
          </p>
        </div>

        {/* Upcoming Audits */}
        <div
          onClick={() => onNavigateTab('audits')}
          className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-teal-400 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Upcoming Audits</span>
            <ClipboardList className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">2</span>
            <span className="text-[11px] text-indigo-700 font-medium bg-indigo-50 px-1.5 py-0.2 rounded">
              Next: 9 days
            </span>
          </div>
          <p className="text-[11px] text-indigo-700 font-medium mt-2 flex items-center gap-1 group-hover:translate-x-0.5 transition">
            ISO 45001 prep <ChevronRight className="w-3 h-3" />
          </p>
        </div>
      </div>

      {/* AI Management Brief Card */}
      <div className="rounded-xl border border-teal-200/80 bg-linear-to-r from-teal-50/70 via-white to-sky-50/50 p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-teal-600 text-white shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                AI Management Brief
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Grounded across 10 active records
              </span>
            </div>

            <p className="text-slate-800 text-base leading-relaxed font-medium">
              Three areas require management attention this week. Four corrective actions are overdue,
              including one high-priority electrical safety action (
              <button
                onClick={() => onOpenRecord('CA-104')}
                className="font-mono font-bold text-teal-800 underline hover:text-teal-900"
              >
                CA-104
              </button>
              ). Six employee certifications expire within the next 30 days, with Working at Heights
              representing the largest exposure. Two recurring manual-handling incidents have also
              been identified in recent records.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                Zero Lost Time Injuries (LTI)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-700">
                <Clock className="w-4 h-4 text-amber-500" />
                ISO 45001 Audit in 9 days
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-700">
                <TrendingUp className="w-4 h-4 text-sky-600" />
                Melbourne handling pattern flagged
              </span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col gap-2">
            <button
              id="generate-full-review-btn"
              onClick={() => onNavigateTab('management-review')}
              className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition shadow-sm flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Generate Full Management Review</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
            </button>
            <button
              onClick={() => onNavigateTab('chat')}
              className="px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs border border-slate-200 transition text-center"
            >
              Ask FocusIMS a Question
            </button>
          </div>
        </div>
      </div>

      {/* Priority Actions Section */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Priority Actions</h2>
            <p className="text-xs text-slate-500">
              Records requiring immediate supervisor or executive intervention.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('corrective-actions')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
          >
            View all 12 actions <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* CA-104 */}
          <div
            onClick={() => onOpenRecord('CA-104')}
            className="p-4 rounded-xl border border-rose-200 bg-rose-50/20 hover:border-rose-400 hover:bg-rose-50/50 transition cursor-pointer flex flex-col justify-between space-y-3 group"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                  CA-104
                </span>
                <span className="text-[11px] font-bold text-rose-700 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 8 days overdue
                </span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-rose-900 transition">
                Electrical isolation corrective action
              </h3>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                Replace degraded 415V feed cabling and test IP66 water seal at Sydney Chiller Plant.
              </p>
            </div>
            <div className="pt-2 border-t border-rose-200/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Lead: Michael Chen</span>
              <span className="font-bold text-rose-700">High Priority</span>
            </div>
          </div>

          {/* TR-221 */}
          <div
            onClick={() => onOpenRecord('TR-221')}
            className="p-4 rounded-xl border border-amber-200 bg-amber-50/20 hover:border-amber-400 hover:bg-amber-50/50 transition cursor-pointer flex flex-col justify-between space-y-3 group"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  TR-221
                </span>
                <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Expires in 11 days
                </span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-amber-900 transition">
                Working at Heights certification
              </h3>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                4 technicians affected across Sydney and Perth. Stop work risk under PROC-WAH-004.
              </p>
            </div>
            <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Liam O’Connor +3</span>
              <span className="font-bold text-amber-800">Expiring Soon</span>
            </div>
          </div>

          {/* RISK-031 */}
          <div
            onClick={() => onOpenRecord('RISK-031')}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-teal-400 hover:bg-teal-50/20 transition cursor-pointer flex flex-col justify-between space-y-3 group"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                  RISK-031
                </span>
                <span className="text-[11px] font-bold text-rose-700">Review Overdue</span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-teal-900 transition">
                Working near live electrical equipment
              </h3>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                Residual risk score 12 (High). Linked to chiller room exposed wiring incident INC-1042.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Sydney Operations</span>
              <span className="font-bold text-rose-700">High Residual</span>
            </div>
          </div>

          {/* AUD-018 */}
          <div
            onClick={() => onOpenRecord('AUD-018')}
            className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/20 hover:border-indigo-400 hover:bg-indigo-50/50 transition cursor-pointer flex flex-col justify-between space-y-3 group"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                  AUD-018
                </span>
                <span className="text-[11px] font-bold text-indigo-700">Scheduled: 01 Oct</span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-indigo-900 transition">
                ISO 45001 Internal Audit
              </h3>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                Scheduled in 9 days. Scope: Sydney & Perth high-risk activities and electrical isolation.
              </p>
            </div>
            <div className="pt-2 border-t border-indigo-200/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Lead: Elena Rostova</span>
              <span className="font-bold text-indigo-700">Surveillance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
