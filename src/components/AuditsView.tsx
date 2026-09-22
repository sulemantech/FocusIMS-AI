import React, { useState } from 'react';
import { AuditRecord, AuditReadinessSummary, AustralianSite } from '../types';
import {
  ClipboardList,
  Sparkles,
  Loader2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface AuditsViewProps {
  audits: AuditRecord[];
  currentSite: AustralianSite;
  onOpenRecord: (id: string) => void;
}

export const AuditsView: React.FC<AuditsViewProps> = ({
  audits,
  currentSite,
  onOpenRecord,
}) => {
  const [loadingPrep, setLoadingPrep] = useState(false);
  const [showPrep, setShowPrep] = useState(true);

  // Pre-configured readiness summary for instant presentation of AUD-018
  const [readiness, setReadiness] = useState<AuditReadinessSummary>({
    auditId: 'AUD-018',
    auditTitle: 'ISO 45001:2018 Occupational Health & Safety - Internal Surveillance Audit',
    standard: 'ISO 45001:2018',
    readinessStatus: 'Attention Warranted',
    executiveBrief:
      'Internal surveillance audit AUD-018 is scheduled in 9 days across Sydney Operations and Perth Field Operations. FocusIMS records highlight several items that warrant management review prior to auditor interviews, particularly regarding overdue high-risk corrective actions, expired risk register review cycles, and upcoming technician competency renewals.',
    previousFindings: [
      'Minor Non-Conformance (BSI Audit AUD-016): Working at Heights daily pre-inspection tags were inconsistently recorded on subcontractor scaffolding.',
      'Observation (AUD-016): Electrical switchboard thermographic inspection reports lacked formal sign-off in the Sydney asset register.',
    ],
    recommendedPreparationSteps: [
      'Verify physical Lockout/Tagout isolation logs and supplier ETA for CA-104 (415V switchboard isolation).',
      'Complete and sign off overdue periodic reviews for RISK-031 (Electrical Safety) and RISK-008 (Working at Heights).',
      'Confirm booking confirmations for technicians with Working at Heights certification expiring in October (TR-221, TR-222).',
      'Collate completed daily Safe Work Method Statements (SWMS) and harness inspection checklists for Perth scaffolding tasks (PROC-WAH-004).',
    ],
    referencedRecordIds: [
      'CA-104',
      'CA-098',
      'RISK-031',
      'RISK-008',
      'TR-221',
      'TR-222',
      'PROC-WAH-004',
      'PROC-ELS-003',
    ],
  });

  const handlePrepare = async () => {
    setLoadingPrep(true);
    try {
      const res = await fetch('/api/audit-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auditId: 'AUD-018' }),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      setReadiness(data);
      setShowPrep(true);
    } catch (err) {
      console.error('Failed to fetch audit prep:', err);
    } finally {
      setLoadingPrep(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Audit & Compliance Surveillance
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              {audits.length} Audits Logged
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Tracking ISO 9001, ISO 14001, and ISO 45001 internal and external certification audits.
          </p>
        </div>

        <button
          id="prepare-audit-btn"
          onClick={handlePrepare}
          disabled={loadingPrep}
          className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-semibold text-xs transition shadow-xs flex items-center gap-2 cursor-pointer"
        >
          {loadingPrep ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Scanning IMS Standards...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Prepare for ISO 45001 Audit</span>
            </>
          )}
        </button>
      </div>

      {/* AI Audit Readiness Summary Banner */}
      {showPrep && readiness && (
        <div className="bg-white rounded-xl border border-indigo-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 bg-indigo-50/60 border-b border-indigo-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-md bg-indigo-600 text-white">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  AI Audit Readiness Brief • {readiness.auditId}
                </h2>
                <p className="text-[11px] text-slate-500">
                  {readiness.auditTitle} • Commences in 9 days
                </p>
              </div>
            </div>

            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
              Readiness: {readiness.readinessStatus}
            </span>
          </div>

          <div className="p-6 space-y-5">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Executive Readiness Brief
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {readiness.executiveBrief}
              </p>
            </div>

            {/* Preparation Steps */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Recommended Pre-Audit Actions for Management
              </h3>
              <ul className="space-y-2">
                {readiness.recommendedPreparationSteps.map((step: string, idx: number) => (
                  <li
                    key={idx}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Referenced Source Records */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Referenced IMS Records Warranting Pre-Audit Review ({readiness.referencedRecordIds.length})
                </span>
                <span className="text-[11px] text-slate-400">Click to view details</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {readiness.referencedRecordIds.map((recId: string) => (
                  <button
                    key={recId}
                    onClick={() => onOpenRecord(recId)}
                    className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 hover:bg-teal-100 hover:text-teal-900 text-slate-800 border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{recId}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* ISO Compliance Disclaimer */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500 leading-relaxed flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>
                <strong>Audit Preparation Disclaimer:</strong> This brief identifies FocusIMS records that may warrant review prior to an audit walkthrough. It does not certify or guarantee ISO compliance, which remains subject to the independent findings of accredited auditors.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Audit Schedule Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Audit ID</th>
                <th className="py-3 px-4">Audit Title</th>
                <th className="py-3 px-3">Standard</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Lead Auditor</th>
                <th className="py-3 px-4">Scope</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {audits.map((a) => (
                <tr
                  key={a.id}
                  onClick={() => onOpenRecord(a.id)}
                  className="hover:bg-slate-50/80 transition cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 group-hover:text-teal-700 whitespace-nowrap">
                    {a.id}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">{a.title}</td>
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap font-medium">
                    {a.standard}
                  </td>
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{a.scheduledDate}</td>
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{a.leadAuditor}</td>
                  <td className="py-3 px-4 max-w-xs truncate text-slate-600 text-[11px]">
                    {a.scope}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                        a.status === 'Scheduled'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenRecord(a.id);
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
