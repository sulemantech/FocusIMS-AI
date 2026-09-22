import React, { useState } from 'react';
import { IncidentRecord, AustralianSite } from '../types';
import {
  Sparkles,
  Plus,
  Filter,
  Search,
  AlertTriangle,
  TrendingUp,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface IncidentsViewProps {
  incidents: IncidentRecord[];
  currentSite: AustralianSite;
  onOpenRecord: (id: string) => void;
  onNavigateToAssistant: () => void;
}

export const IncidentsView: React.FC<IncidentsViewProps> = ({
  incidents,
  currentSite,
  onOpenRecord,
  onNavigateToAssistant,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showTrends, setShowTrends] = useState(false);

  // Filter incidents by site and search/category
  const filtered = incidents.filter((inc) => {
    const matchesSite = currentSite === 'All Sites' || inc.site === currentSite;
    const matchesCategory = categoryFilter === 'All' || inc.category === categoryFilter;
    const matchesSearch =
      inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.owner.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSite && matchesCategory && matchesSearch;
  });

  const categories = ['All', 'Electrical Safety', 'Manual Handling', 'Working at Heights', 'Forklift Safety', 'Chemical Safety'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Incidents & Hazards Register
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              {filtered.length} Records
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Active health, safety, and operational hazard log.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="toggle-incident-trends-btn"
            onClick={() => setShowTrends(!showTrends)}
            className={`px-3.5 py-2 rounded-lg font-semibold text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer ${
              showTrends
                ? 'bg-teal-700 text-white'
                : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{showTrends ? 'Hide Trend Analysis' : 'Analyse Incident Trends'}</span>
          </button>

          <button
            onClick={onNavigateToAssistant}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>AI Field Ingestion</span>
          </button>
        </div>
      </div>

      {/* AI Incident Trend Analysis Panel (Toggleable or Visible) */}
      {showTrends && (
        <div className="p-5 rounded-xl border border-teal-200 bg-teal-50/40 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-teal-600 text-white">
                <TrendingUp className="w-3.5 h-3.5" />
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                AI Incident Trend Synthesis (Pattern Recognition)
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              Based on recent FocusIMS event logs
            </span>
          </div>

          <p className="text-xs text-slate-800 leading-relaxed font-medium">
            AI identified <strong>2 recurring operational patterns</strong> across facility maintenance records:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {/* Trend 1: Manual Handling */}
            <div className="p-3.5 rounded-lg bg-white border border-teal-200/80 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">1. Manual Handling & Ergonomic Strain</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                  Melbourne Warehouse
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Repetitive lower back and shoulder strains during peak container de-palletising operations (loads between 28kg–32kg).
              </p>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400">Supporting Records:</span>
                <button
                  onClick={() => onOpenRecord('INC-1038')}
                  className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 hover:bg-teal-100 text-slate-700"
                >
                  INC-1038
                </button>
                <button
                  onClick={() => onOpenRecord('INC-1029')}
                  className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 hover:bg-teal-100 text-slate-700"
                >
                  INC-1029
                </button>
                <button
                  onClick={() => onOpenRecord('CA-106')}
                  className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-teal-100 text-teal-800"
                >
                  CA-106 (Lifter)
                </button>
              </div>
            </div>

            {/* Trend 2: Electrical Degradation */}
            <div className="p-3.5 rounded-lg bg-white border border-teal-200/80 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">2. Electrical Safety & Insulation Wear</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
                  Sydney Operations
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Insulation degradation on portable leads and plant room feeds in high-humidity/wet environments.
              </p>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400">Supporting Records:</span>
                <button
                  onClick={() => onOpenRecord('INC-1042')}
                  className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 hover:bg-teal-100 text-slate-700"
                >
                  INC-1042
                </button>
                <button
                  onClick={() => onOpenRecord('INC-1025')}
                  className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 hover:bg-teal-100 text-slate-700"
                >
                  INC-1025
                </button>
                <button
                  onClick={() => onOpenRecord('CA-104')}
                  className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-800"
                >
                  CA-104 (Overdue)
                </button>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 pt-1">
            *Observed patterns in available demo records; does not imply formal statistical significance.
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, keyword, or owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent focus:outline-none text-slate-800 placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 font-medium">Category:</span>
          <select
            aria-label="Filter by category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded px-2 py-1 font-semibold text-slate-700 focus:outline-none cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Incident ID</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Site</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-3">Risk Rating</th>
                <th className="py-3 px-3">Workflow Status</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((inc) => (
                <tr
                  key={inc.id}
                  onClick={() => onOpenRecord(inc.id)}
                  className="hover:bg-slate-50/80 transition cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 group-hover:text-teal-700">
                    {inc.id}
                  </td>
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{inc.date}</td>
                  <td className="py-3 px-3 text-slate-700 font-medium whitespace-nowrap">
                    {inc.site}
                  </td>
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{inc.category}</td>
                  <td className="py-3 px-4 max-w-xs truncate text-slate-900 font-medium">
                    {inc.title}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                        inc.risk === 'High'
                          ? 'bg-rose-100 text-rose-800'
                          : inc.risk === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {inc.risk}
                    </span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                        inc.status === 'Under Investigation'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200 font-semibold'
                          : inc.status === 'Action Assigned'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {inc.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{inc.owner}</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenRecord(inc.id);
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
