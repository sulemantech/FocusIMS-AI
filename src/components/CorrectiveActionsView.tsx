import React, { useState } from 'react';
import { CorrectiveActionRecord, AustralianSite } from '../types';
import {
  CheckCircle2,
  Sparkles,
  AlertOctagon,
  Clock,
  Filter,
  Search,
  ChevronRight,
  ShieldCheck,
  ArrowUpDown,
  ArrowRight,
} from 'lucide-react';

interface CorrectiveActionsViewProps {
  actions: CorrectiveActionRecord[];
  currentSite: AustralianSite;
  onOpenRecord: (id: string) => void;
}

export const CorrectiveActionsView: React.FC<CorrectiveActionsViewProps> = ({
  actions,
  currentSite,
  onOpenRecord,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showPrioritisation, setShowPrioritisation] = useState(false);

  const filtered = actions.filter((act) => {
    const matchesSite = currentSite === 'All Sites' || act.site === currentSite;
    const matchesStatus =
      statusFilter === 'All'
        ? true
        : statusFilter === 'Overdue'
        ? act.status === 'Overdue'
        : statusFilter === 'Open'
        ? act.status === 'Open' || act.status === 'Due Soon' || act.status === 'Overdue'
        : act.status === statusFilter;

    const matchesSearch =
      act.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.source.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSite && matchesStatus && matchesSearch;
  });

  const overdueActions = actions.filter((a) => a.status === 'Overdue');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Corrective Actions Register (CAPA)
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              {filtered.length} Actions
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Tracking preventative interventions, hazard isolations, and audit findings.
          </p>
        </div>

        <button
          id="prioritise-actions-btn"
          onClick={() => setShowPrioritisation(!showPrioritisation)}
          className={`px-3.5 py-2 rounded-lg font-semibold text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer ${
            showPrioritisation
              ? 'bg-teal-700 text-white'
              : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{showPrioritisation ? 'Hide AI Prioritisation' : 'Prioritise Actions with AI'}</span>
        </button>
      </div>

      {/* AI Corrective Action Intelligence Panel */}
      <div className="p-5 rounded-xl border border-teal-200 bg-teal-50/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-teal-600 text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              Corrective Action Intelligence
            </h3>
          </div>
          <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
            {overdueActions.length} Actions Overdue
          </span>
        </div>

        <p className="text-xs text-slate-800 leading-relaxed font-medium">
          Four actions are currently overdue.{' '}
          <button
            onClick={() => onOpenRecord('CA-104')}
            className="text-teal-900 font-bold underline font-mono"
          >
            CA-104
          </button>{' '}
          represents the highest current exposure because it relates to an unresolved electrical safety
          hazard (
          <button
            onClick={() => onOpenRecord('INC-1042')}
            className="text-teal-900 font-bold underline font-mono"
          >
            INC-1042
          </button>
          ).{' '}
          <button
            onClick={() => onOpenRecord('CA-098')}
            className="text-teal-900 font-bold underline font-mono"
          >
            CA-098
          </button>{' '}
          also requires urgent contractor license verification before high-level scaffolding work restarts.
        </p>

        {showPrioritisation && (
          <div className="pt-3 border-t border-teal-200/80 space-y-2.5 animate-fade-in">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span>AI Recommended Action Priority Ranking:</span>
              <span className="text-[11px] font-normal text-slate-500">
                Ranked by Risk Rating + Overdue Days + Audit Exposure
              </span>
            </div>

            <div className="space-y-2">
              {/* Rank 1: CA-104 */}
              <div
                onClick={() => onOpenRecord('CA-104')}
                className="p-3 bg-white rounded-lg border border-rose-300 hover:border-rose-500 transition cursor-pointer flex items-center justify-between gap-3 text-xs group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-[10px]">
                    1
                  </span>
                  <span className="font-mono font-bold text-slate-900">CA-104</span>
                  <span className="font-semibold text-slate-800 group-hover:text-rose-900">
                    Replace degraded 415V switchboard cabling & IP66 seal (Sydney)
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-rose-700 font-bold text-[11px]">8d Overdue</span>
                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px]">
                    Critical Risk Exposure
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600" />
                </div>
              </div>

              {/* Rank 2: CA-098 */}
              <div
                onClick={() => onOpenRecord('CA-098')}
                className="p-3 bg-white rounded-lg border border-amber-300 hover:border-amber-500 transition cursor-pointer flex items-center justify-between gap-3 text-xs group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-[10px]">
                    2
                  </span>
                  <span className="font-mono font-bold text-slate-900">CA-098</span>
                  <span className="font-semibold text-slate-800 group-hover:text-amber-900">
                    Audit subcontractor height licences & conduct safety stand-down (Perth)
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-amber-700 font-bold text-[11px]">5d Overdue</span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                    High Fall Risk
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
                </div>
              </div>

              {/* Rank 3: CA-097 */}
              <div
                onClick={() => onOpenRecord('CA-097')}
                className="p-3 bg-white rounded-lg border border-slate-200 hover:border-teal-400 transition cursor-pointer flex items-center justify-between gap-3 text-xs group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-700 text-white font-bold flex items-center justify-center text-[10px]">
                    3
                  </span>
                  <span className="font-mono font-bold text-slate-900">CA-097</span>
                  <span className="font-semibold text-slate-800 group-hover:text-teal-900">
                    Pallet racking structural engineering inspection (Melbourne)
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-amber-700 font-medium text-[11px]">3d Overdue</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">
                    Medium Exposure
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
                </div>
              </div>

              {/* Rank 4: CA-102 */}
              <div
                onClick={() => onOpenRecord('CA-102')}
                className="p-3 bg-white rounded-lg border border-slate-200 hover:border-teal-400 transition cursor-pointer flex items-center justify-between gap-3 text-xs group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-700 text-white font-bold flex items-center justify-center text-[10px]">
                    4
                  </span>
                  <span className="font-mono font-bold text-slate-900">CA-102</span>
                  <span className="font-semibold text-slate-800 group-hover:text-teal-900">
                    Update chemical SDS register to GHS Rev 7 (Brisbane)
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-slate-600 font-medium text-[11px]">2d Overdue</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">
                    Low Operational Risk
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded bg-white/70 border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
              <span>
                <strong>Advisory Note:</strong> AI prioritisation ranks items to assist human resource allocation; it does not replace formal escalation procedures or management delegation.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search action text, ID, owner, or source..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent focus:outline-none text-slate-800 placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 font-medium">Status:</span>
          <select
            aria-label="Filter actions by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded px-2 py-1 font-semibold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Actions</option>
            <option value="Overdue">Overdue Only (4)</option>
            <option value="Open">Open & Pending (9)</option>
            <option value="Completed">Completed (3)</option>
          </select>
        </div>
      </div>

      {/* Corrective Actions Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Action ID</th>
                <th className="py-3 px-3">Source Event</th>
                <th className="py-3 px-4">Corrective Action Required</th>
                <th className="py-3 px-3">Site</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Owner</th>
                <th className="py-3 px-3">Due Date</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((act) => (
                <tr
                  key={act.id}
                  onClick={() => onOpenRecord(act.id)}
                  className="hover:bg-slate-50/80 transition cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 group-hover:text-teal-700 whitespace-nowrap">
                    {act.id}
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                    {act.source}
                  </td>
                  <td className="py-3 px-4 max-w-sm font-semibold text-slate-900">
                    {act.action}
                  </td>
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{act.site}</td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                        act.priority === 'High'
                          ? 'bg-rose-100 text-rose-800'
                          : act.priority === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {act.priority}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{act.owner}</td>
                  <td className="py-3 px-3 text-slate-700 whitespace-nowrap font-medium">
                    {act.dueDate}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                        act.status === 'Overdue'
                          ? 'bg-rose-100 text-rose-800'
                          : act.status === 'Due Soon'
                          ? 'bg-amber-100 text-amber-800'
                          : act.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {act.status === 'Overdue' && <AlertOctagon className="w-3 h-3" />}
                      {act.status}
                      {act.daysOverdue ? ` (${act.daysOverdue}d)` : ''}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenRecord(act.id);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-teal-600 hover:bg-slate-100 transition"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
