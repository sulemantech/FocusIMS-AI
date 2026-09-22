import React, { useState } from 'react';
import {
  FileCheck,
  Sparkles,
  Loader2,
  Calendar,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  GraduationCap,
  ClipboardList,
  TrendingUp,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Printer,
  Download,
} from 'lucide-react';
import { ManagementReviewReport, AttentionItem, AustralianSite } from '../types';
import { getSourceRecordById } from '../data/imsData';

interface ManagementReviewViewProps {
  currentSite: AustralianSite;
  onOpenRecord: (id: string) => void;
}

export const ManagementReviewView: React.FC<ManagementReviewViewProps> = ({
  currentSite,
  onOpenRecord,
}) => {
  const [period, setPeriod] = useState<'Last 30 Days' | 'Last Quarter' | 'Last 6 Months'>(
    'Last 30 Days'
  );
  const [loading, setLoading] = useState(false);

  // Initial executive report state pre-rendered for instant client demonstration
  const [report, setReport] = useState<ManagementReviewReport>({
    reviewPeriod: 'Last 30 Days',
    generatedAt: '22 Sep 2026',
    executiveSummary:
      'During the Last 30 Days, operational HSEQ performance remained steady with zero lost-time injuries (LTI) recorded across all Australian facilities. However, leading indicators highlight three distinct management pressure points: four corrective actions have breached target completion dates (most critically CA-104 regarding 415V electrical switchboard isolation at Sydney Operations), four field technicians approach concurrent Working at Heights certification expiries in October, and two recurring manual handling strains occurred in Melbourne logistics during pallet de-stacking. Periodic risk review obligations for RISK-031 and RISK-008 also require immediate supervisor sign-off prior to the upcoming ISO 45001 internal surveillance audit.',
    healthAndSafety:
      'Total of 10 recorded events across the system, comprising 4 hazards, 3 near misses, and 3 minor medical treatment events. High-potential events include INC-1042 (exposed electrical conductors in Sydney) and INC-1031 (subcontractor working at 4.2m without harness attachment in Perth). In both instances, Stop Work Authority was enacted promptly under POL-WHS-001, preventing worker injury.',
    riskManagement:
      'Eight primary operational risks are registered. Three operate with High residual risk ratings (RISK-031, RISK-008, RISK-012). Periodic reviews for RISK-031 (Electrical Safety) and RISK-008 (Working at Heights) are 43 days and 7 days overdue respectively. Review meetings have been scheduled with respective site managers to re-evaluate control effectiveness.',
    correctiveActions:
      '12 corrective actions are active in the IMS, of which 4 are overdue (33% overdue rate). CA-104 (8 days overdue, Michael Chen) is awaiting replacement marine-grade gland fittings; temporary padlock isolations remain secure. CA-098 (5 days overdue, James Wilson) requires final contractor licence submission. CA-097 (3 days overdue, Sarah Williams) has a structural engineer scheduled tomorrow for warehouse racking.',
    trainingAndCompetency:
      'Overall workforce compliance is 86%. Six certifications expire within 30 days. Priority focus is required on Bradley Scott’s forklift licence (TR-225, expires in 7 days) and four Working at Heights credentials (TR-221, TR-222, TR-223, TR-224) expiring between 03 Oct and 14 Oct 2026. Refresher training courses have been block-booked with Pinnacle Safety Training.',
    auditAndCompliance:
      'Preparations are underway for AUD-018 (ISO 45001 Internal Surveillance Audit) scheduled in 9 days, scoped to Sydney Operations and Perth Field Operations. Outstanding findings from previous environmental audit AUD-017 are 78% resolved, with chemical SDS updates (CA-102) progressing.',
    operationalTrends:
      'Trend analysis identified two clear patterns: (1) manual handling back/shoulder strains in Melbourne Warehouse during high-volume de-palletising operations (INC-1038, INC-1029), prompting procurement of a vacuum lifter (CA-106); and (2) insulation wear on portable electrical gear in Sydney workshop bays (INC-1042, INC-1025).',
    attentionItems: [
      {
        id: 'ATT-01',
        priority: 'High',
        title: 'Expedite CA-104 Electrical Isolation Closeout',
        description:
          '415V switchboard at Sydney Chiller Plant remains isolated on padlocks pending marine gland seal installation (8 days overdue).',
        recommendedAction:
          'Authorise air-freight courier for replacement gland kit and schedule certified electrician for Saturday isolation window.',
        targetDate: '26 Sep 2026',
        supportingRecordIds: ['CA-104', 'INC-1042', 'RISK-031', 'PROC-ELS-003'],
      },
      {
        id: 'ATT-02',
        priority: 'High',
        title: 'Renew Critical Working at Heights Certifications',
        description:
          '4 field technicians (Liam O’Connor, Marcus Vance, Daniel Nguyen, Chloe Taylor) face certification expiry within 22 days.',
        recommendedAction:
          'Confirm attendance for Pinnacle Safety 1-day refresher course prior to 03 Oct to avoid Stop Work stand-downs on customer sites.',
        targetDate: '01 Oct 2026',
        supportingRecordIds: ['TR-221', 'TR-222', 'TR-223', 'TR-224', 'PROC-WAH-004'],
      },
      {
        id: 'ATT-03',
        priority: 'Medium',
        title: 'Sign Off Overdue Risk Reviews Before ISO 45001 Audit',
        description:
          'Scheduled reviews for RISK-031 (Electrical) and RISK-008 (Working at Heights) are overdue ahead of AUD-018.',
        recommendedAction:
          'HSEQ Lead Elena Rostova to convene 30-minute review panels with Michael Chen and James Wilson to update control verification logs.',
        targetDate: '28 Sep 2026',
        supportingRecordIds: ['RISK-031', 'RISK-008', 'AUD-018'],
      },
      {
        id: 'ATT-04',
        priority: 'Medium',
        title: 'Complete Forklift Racking Structural Engineering Sign-Off',
        description:
          'Melbourne Warehouse Aisle 4 racking upright sustained low-speed impact from counterbalance forklift (INC-1018, CA-097).',
        recommendedAction:
          'Review engineer deflection report tomorrow afternoon and install steel corner floor bollards.',
        targetDate: '24 Sep 2026',
        supportingRecordIds: ['CA-097', 'INC-1018', 'RISK-012'],
      },
      {
        id: 'ATT-05',
        priority: 'Low',
        title: 'Finalise Chemical SDS GHS Rev 7 Updates',
        description:
          'Brisbane Service Centre chemical register requires 4 remaining supplier SDS updates (CA-102).',
        recommendedAction:
          'Download revised safety sheets from supplier portal and upload to Chemwatch kiosk.',
        targetDate: '26 Sep 2026',
        supportingRecordIds: ['CA-102', 'AUD-017', 'RISK-019'],
      },
    ],
  });

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/management-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period, site: currentSite }),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error('Failed to generate management review:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Page Header & Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              AI Management Review
            </h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
              <Sparkles className="w-3 h-3" />
              Executive Synthesis
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Turn operational and compliance data into management-level insight.
          </p>
        </div>

        {/* Controls: Period and Generate */}
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-slate-200 bg-white p-1 text-xs">
            {(['Last 30 Days', 'Last Quarter', 'Last 6 Months'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                  period === p
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            id="generate-management-review-btn"
            onClick={handleGenerate}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-semibold text-xs transition shadow-xs flex items-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Analysing Records...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate AI Review</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Review Document Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Document Header Bar */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Management System Performance Report
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Acme Facilities Australia • {report.reviewPeriod}
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Generated: {report.generatedAt}
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              Grounded on 10 Records
            </span>
          </div>
        </div>

        {/* Document Content Sections */}
        <div className="p-6 space-y-6">
          {/* 1. Executive Summary */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <span className="w-1.5 h-4 rounded-full bg-teal-500"></span>
              <h3>1. Executive Summary</h3>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed pl-3.5 border-l-2 border-slate-100">
              {report.executiveSummary}
            </p>
          </div>

          {/* 2. Health & Safety */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3>2. Health & Safety (WHS / OHS)</h3>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed pl-3.5 border-l-2 border-slate-100">
              {report.healthAndSafety}
            </p>
          </div>

          {/* 3. Risk Management */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <h3>3. Risk Management & Control Hierarchy</h3>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed pl-3.5 border-l-2 border-slate-100">
              {report.riskManagement}
            </p>
          </div>

          {/* 4. Corrective Actions */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <h3>4. Corrective Actions & Resolution Velocity</h3>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed pl-3.5 border-l-2 border-slate-100">
              {report.correctiveActions}
            </p>
          </div>

          {/* 5. Training & Competency */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <GraduationCap className="w-4 h-4 text-sky-600" />
              <h3>5. Training & Competency Register</h3>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed pl-3.5 border-l-2 border-slate-100">
              {report.trainingAndCompetency}
            </p>
          </div>

          {/* 6. Audit & Compliance */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <ClipboardList className="w-4 h-4 text-indigo-600" />
              <h3>6. Audit & Compliance Surveillance</h3>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed pl-3.5 border-l-2 border-slate-100">
              {report.auditAndCompliance}
            </p>
          </div>

          {/* 7. Operational Trends */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <TrendingUp className="w-4 h-4 text-teal-600" />
              <h3>7. Operational Trends & Preventative Opportunities</h3>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed pl-3.5 border-l-2 border-slate-100">
              {report.operationalTrends}
            </p>
          </div>

          {/* 8. Management Attention Required Section */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    8. Management Attention Required
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200">
                    Action Plan
                  </span>
                </div>
                <span className="text-xs text-slate-500">
                  Prioritised by severity & compliance exposure
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Items requiring executive resourcing or supervisory sign-off.
              </p>
            </div>

            <div className="space-y-3">
              {report.attentionItems.map((item: AttentionItem) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition ${
                    item.priority === 'High'
                      ? 'border-rose-200 bg-rose-50/20'
                      : item.priority === 'Medium'
                      ? 'border-amber-200 bg-amber-50/20'
                      : 'border-slate-200 bg-slate-50/40'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded ${
                          item.priority === 'High'
                            ? 'bg-rose-100 text-rose-800'
                            : item.priority === 'Medium'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-200 text-slate-800'
                        }`}
                      >
                        {item.priority} Priority
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                    </div>

                    <div className="text-xs font-semibold text-slate-600">
                      Target Date: <span className="text-slate-900">{item.targetDate}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">{item.description}</p>

                  <div className="mt-2.5 p-2.5 rounded-lg bg-white border border-slate-200/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-semibold text-slate-700">Recommended Action: </span>
                      <span className="text-slate-800">{item.recommendedAction}</span>
                    </div>

                    {/* Supporting records clickers */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[11px] text-slate-400">Records:</span>
                      {item.supportingRecordIds.map((recId: string) => (
                        <button
                          key={recId}
                          onClick={() => onOpenRecord(recId)}
                          className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-100 hover:bg-teal-100 hover:text-teal-800 text-slate-700 border border-slate-200 transition cursor-pointer"
                        >
                          {recId}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Report Footer Notice */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500 leading-relaxed flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-700">
                Executive Governance Notice (ISO 9001 / ISO 14001 / ISO 45001)
              </p>
              <p className="text-[11px] mt-0.5">
                This document synthesises internal records recorded within FocusIMS. AI-suggested
                action items serve as decision-support intelligence for executive management review
                and do not replace formal sign-off by authorised management representatives.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
