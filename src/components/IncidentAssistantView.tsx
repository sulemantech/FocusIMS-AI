import React, { useState } from 'react';
import {
  Sparkles,
  AlertTriangle,
  Loader2,
  Check,
  Edit3,
  Trash2,
  ShieldAlert,
  Info,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { IncidentAnalysisResult, IncidentRecord } from '../types';

interface IncidentAssistantViewProps {
  onIncidentCreated?: (newIncident: IncidentRecord) => void;
  onOpenRecord: (id: string) => void;
}

export const IncidentAssistantView: React.FC<IncidentAssistantViewProps> = ({
  onIncidentCreated,
  onOpenRecord,
}) => {
  const defaultObservation =
    'During maintenance of an air-conditioning unit, a technician found exposed electrical wiring close to a wet area. Work was immediately stopped and the area was isolated. No injury occurred.';

  const [description, setDescription] = useState(defaultObservation);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Pre-analyzed initial result for instant presentation
  const [analysis, setAnalysis] = useState<IncidentAnalysisResult>({
    incidentType: 'Hazard',
    suggestedCategory: 'Electrical Safety',
    potentialConsequence:
      'Electric shock, electrocution, or arc flash causing serious bodily injury or fatality.',
    suggestedInitialRisk: 'High',
    immediateAction:
      'Work was immediately stopped, area isolated, and 415V sub-board padlocked under LOTO.',
    recommendedFollowUp:
      'Formal inspection and insulation resistance testing by a licensed A-grade electrician before returning equipment to service.',
    suggestedCorrectiveAction:
      'Inspect electrical installation, replace damaged cabling with high-spec conduit, and verify IP66 weather-proofing controls.',
    contributingFactors: [
      'Damaged or deteriorated cable insulation from age and environmental moisture',
      'Location of distribution junction box in close proximity to cooling water condensate run-off',
      'Periodic test and tag inspection interval insufficient for harsh wet plant environment',
    ],
    disclaimer:
      'AI suggestions require review and approval by an authorised person. AI must never automatically approve or close safety records.',
  });

  const handleAnalyse = async () => {
    if (!description.trim() || loading) return;
    setLoading(true);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/incident-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      console.error('Failed to analyse incident:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    // Demonstrates realistic workflow acceptance: creates draft record awaiting human authorization
    setSuccessMessage(
      'Draft record staged as INC-1043 (Pending Supervisor Verification). AI suggestions applied.'
    );
  };

  const handleDiscard = () => {
    setDescription('');
    setSuccessMessage(null);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Title & Subtitle */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            AI Incident Assistant
          </h1>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
            <Sparkles className="w-3 h-3" />
            Field Observation Ingestion
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Turn unstructured field observations and mobile voice reports into structured, auditable HSEQ records.
        </p>
      </div>

      {/* Observation Input Form */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div>
          <label
            htmlFor="incident-observation-input"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Describe What Happened (Field Observation Narrative)
          </label>
          <textarea
            id="incident-observation-input"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the hazard, near miss, or event in plain language..."
            className="w-full rounded-lg border border-slate-300 p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Preset Scenarios:</span>
            <button
              onClick={() =>
                setDescription(
                  'During maintenance of an air-conditioning unit, a technician found exposed electrical wiring close to a wet area. Work was immediately stopped and the area was isolated. No injury occurred.'
                )
              }
              className="text-xs text-teal-700 hover:text-teal-900 underline font-medium cursor-pointer"
            >
              Exposed Wiring (Chiller)
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() =>
                setDescription(
                  'Scaffolder observed unhooking twin lanyard on Level 4 perimeter scaffold at 6.5m while reaching for a ledger tube. Supervisor immediately ordered him down to ground level for safety stand-down.'
                )
              }
              className="text-xs text-teal-700 hover:text-teal-900 underline font-medium cursor-pointer"
            >
              Unhooked Lanyard (Perth)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="analyse-incident-btn"
              onClick={handleAnalyse}
              disabled={loading || !description.trim()}
              className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-semibold text-xs transition shadow-xs flex items-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Structuring HSEQ Analysis...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Analyse Incident</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => onOpenRecord('INC-1042')}
            className="text-xs font-bold text-teal-800 underline hover:text-teal-950"
          >
            Review in Register →
          </button>
        </div>
      )}

      {/* Structured Output Card */}
      {analysis && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Card Header */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-md bg-teal-100 text-teal-800">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  AI-Suggested Draft Classification
                </h2>
                <p className="text-[11px] text-slate-500">
                  Synthesised against FocusIMS taxonomy & AS/NZS standards
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                  analysis.suggestedInitialRisk === 'High' ||
                  analysis.suggestedInitialRisk === 'Critical'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                Suggested Initial Risk: {analysis.suggestedInitialRisk}
              </span>
            </div>
          </div>

          {/* Structured Fields Grid */}
          <div className="p-6 space-y-5">
            {/* Field Row 1: Type & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                  Incident Type
                </span>
                <p className="text-sm font-bold text-slate-900 mt-1">
                  {analysis.incidentType}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Proactive notification prior to harm
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                  Suggested Category
                </span>
                <p className="text-sm font-bold text-slate-900 mt-1">
                  {analysis.suggestedCategory}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Assigned to WHS Risk Profile RISK-031
                </p>
              </div>
            </div>

            {/* Field: Potential Consequence */}
            <div>
              <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                Potential Consequence
              </span>
              <div className="mt-1 p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium">
                {analysis.potentialConsequence}
              </div>
            </div>

            {/* Field: Immediate Action & Recommended Follow-up */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                  Immediate Action Taken
                </span>
                <div className="mt-1 p-3.5 rounded-lg bg-teal-50/50 border border-teal-200 text-xs text-teal-900">
                  {analysis.immediateAction}
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                  Recommended Investigation Follow-up
                </span>
                <div className="mt-1 p-3.5 rounded-lg bg-sky-50/50 border border-sky-200 text-xs text-sky-900">
                  {analysis.recommendedFollowUp}
                </div>
              </div>
            </div>

            {/* Field: Suggested Corrective Action */}
            <div>
              <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                Suggested Corrective Action (Proposed Draft)
              </span>
              <div className="mt-1 p-3.5 rounded-lg bg-amber-50/40 border border-amber-200 text-xs text-amber-900 font-medium leading-relaxed">
                {analysis.suggestedCorrectiveAction}
              </div>
            </div>

            {/* Contributing Factors */}
            <div>
              <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                Possible Contributing Factors (Root Cause Hypothesis)
              </span>
              <ul className="mt-1.5 space-y-1.5">
                {analysis.contributingFactors.map((factor, idx) => (
                  <li
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2"
                  >
                    <span className="font-mono text-teal-600 font-bold">•</span>
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Human Verification Notice (Strict Rule) */}
            <div className="p-3.5 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800">
                  Mandatory Human Review & Approval Required
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  {analysis.disclaimer} FocusIMS enforces that AI draft classifications remain advisory until validated and approved by the designated Site Supervisor or HSEQ Manager.
                </p>
              </div>
            </div>

            {/* Action Buttons: Accept / Edit / Discard */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  id="accept-suggestions-btn"
                  onClick={handleAccept}
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Accept Suggestions & Stage Draft</span>
                </button>
                <button
                  onClick={() => alert('Opening draft record editor for supervisor adjustments.')}
                  className="px-3.5 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit in Form</span>
                </button>
              </div>

              <button
                onClick={handleDiscard}
                className="px-3 py-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 font-medium text-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Discard Draft</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
