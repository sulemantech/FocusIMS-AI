import React, { useState } from 'react';
import { RiskRecord, AustralianSite } from '../types';
import {
  ShieldAlert,
  Sparkles,
  Clock,
  Filter,
  Search,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

interface RisksViewProps {
  risks: RiskRecord[];
  currentSite: AustralianSite;
  onOpenRecord: (id: string) => void;
}

export const RisksView: React.FC<RisksViewProps> = ({
  risks,
  currentSite,
  onOpenRecord,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAiInsights, setShowAiInsights] = useState(true);

  const filtered = risks.filter((r) => {
    const matchesSite = currentSite === 'All Sites' || r.site === currentSite;
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.owner.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSite && matchesSearch;
  });

  const highResidualCount = risks.filter((r) => r.residualRisk === 'High').length;
  const overdueReviewsCount = risks.filter((r) => r.isReviewOverdue).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Risk Register & Control Hierarchy
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              {filtered.length} Risks
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Enterprise HSEQ risk profile and periodic review tracking.
          </p>
        </div>

        <button
          onClick={() => setShowAiInsights(!showAiInsights)}
          className="px-3.5 py-2 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold text-xs border border-teal-200 transition shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{showAiInsights ? 'Hide AI Risk Insights' : 'Analyse Risk Register'}</span>
        </button>
      </div>

      {/* AI Risk Insights Card */}
      {showAiInsights && (
        <div className="p-5 rounded-xl border border-teal-200 bg-teal-50/40 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-teal-600 text-white">
                <ShieldAlert className="w-3.5 h-3.5" />
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                AI Risk Profile Intelligence
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              Evaluated across 8 core operational risks
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-white rounded-lg border border-teal-200/80">
              <span className="text-xs text-slate-500 font-medium">High Residual Risks</span>
              <p className="text-xl font-extrabold text-rose-600 mt-0.5">{highResidualCount}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                RISK-031, RISK-008, RISK-012
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg border border-teal-200/80">
              <span className="text-xs text-slate-500 font-medium">Risk Reviews Overdue</span>
              <p className="text-xl font-extrabold text-amber-600 mt-0.5">
                {overdueReviewsCount}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Overdue &gt; 30 days ahead of ISO audit
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg border border-teal-200/80">
              <span className="text-xs text-slate-500 font-medium">Dominant Category</span>
              <p className="text-base font-bold text-slate-800 mt-1">Operational Safety</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Covers 62% of critical hazard exposure
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed font-medium pt-1">
            <strong>Key AI Observation:</strong> Two of the three high-residual risks (
            <button
              onClick={() => onOpenRecord('RISK-031')}
              className="text-teal-800 font-mono font-bold underline"
            >
              RISK-031
            </button>{' '}
            and{' '}
            <button
              onClick={() => onOpenRecord('RISK-008')}
              className="text-teal-800 font-mono font-bold underline"
            >
              RISK-008
            </button>
            ) are directly linked to active overdue corrective actions (
            <button
              onClick={() => onOpenRecord('CA-104')}
              className="text-teal-800 font-mono font-bold underline"
            >
              CA-104
            </button>{' '}
            and{' '}
            <button
              onClick={() => onOpenRecord('CA-098')}
              className="text-teal-800 font-mono font-bold underline"
            >
              CA-098
            </button>
            ). Expediting these two actions will reduce high-residual exposure prior to AUD-018.
          </p>
        </div>
      )}

      {/* Search Input */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-xs flex items-center gap-2 text-xs">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Filter risks by title, ID, or owner..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent focus:outline-none text-slate-800 placeholder:text-slate-400"
        />
      </div>

      {/* Risks Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Risk ID</th>
                <th className="py-3 px-4">Risk Title</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Site</th>
                <th className="py-3 px-3">Initial Risk</th>
                <th className="py-3 px-4">Core Controls</th>
                <th className="py-3 px-3">Residual Risk</th>
                <th className="py-3 px-3">Owner</th>
                <th className="py-3 px-3">Review Status</th>
                <th className="py-3 px-3 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => onOpenRecord(r.id)}
                  className="hover:bg-slate-50/80 transition cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 group-hover:text-teal-700">
                    {r.id}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{r.title}</td>
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{r.category}</td>
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{r.site}</td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                      {r.initialRisk} ({r.initialRiskScore})
                    </span>
                  </td>
                  <td className="py-3 px-4 max-w-xs truncate text-slate-600 text-[11px]">
                    {r.controls.join(', ')}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                        r.residualRisk === 'High'
                          ? 'bg-rose-100 text-rose-800'
                          : r.residualRisk === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {r.residualRisk} ({r.residualRiskScore})
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{r.owner}</td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    {r.isReviewOverdue ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700">
                        <Clock className="w-3 h-3" /> Overdue
                      </span>
                    ) : (
                      <span className="text-[11px] text-emerald-700 font-medium">Current</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenRecord(r.id);
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
