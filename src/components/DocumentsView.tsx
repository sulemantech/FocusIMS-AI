import React, { useState } from 'react';
import { ControlledDocumentRecord, AustralianSite } from '../types';
import {
  Files,
  Sparkles,
  Loader2,
  Search,
  Filter,
  ChevronRight,
  HelpCircle,
  ShieldCheck,
  Send,
  FileText,
} from 'lucide-react';

interface DocumentsViewProps {
  documents: ControlledDocumentRecord[];
  onOpenRecord: (id: string) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  documents,
  onOpenRecord,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocId, setSelectedDocId] = useState('PROC-WAH-004');
  const [docQuestion, setDocQuestion] = useState(
    'What does our Working at Heights procedure require before work begins?'
  );
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [docAnswer, setDocAnswer] = useState<{
    docId: string;
    docTitle: string;
    version: string;
    answer: string;
    keyRequirements: string[];
    sourceNote: string;
  }>({
    docId: 'PROC-WAH-004',
    docTitle: 'Working at Heights Procedure',
    version: '4.2',
    answer: `According to Section 4.1 of PROC-WAH-004 (Working at Heights Procedure, Version 4.2), before commencing any work where a person could fall 2 metres or more, the following controls must be verified:

1. A Safe Work Method Statement (SWMS) must be completed, signed by all workers on the task, and countersigned by the Site Controller.
2. Physical fall prevention devices (e.g. guardrails, edge protection, scaffolding) must be evaluated and prioritised over personal fall arrest.
3. If personal harness systems are used, 100% tie-off is mandatory with twin shock-absorbing lanyards attached to rated anchor points (minimum 15kN capacity).
4. Pre-use physical inspection tags on all harness equipment and inertia reels must be verified (quarterly color code).
5. A documented, tested emergency Rescue Plan must be established on site before any harness work begins.`,
    keyRequirements: [
      'Pre-work SWMS countersigned by Site Controller',
      'Physical edge protection prioritised over personal fall arrest',
      '100% tie-off with rated 15kN anchor points',
      'Current quarterly inspection tag on all harness gear',
      'Documented on-site emergency rescue plan',
    ],
    sourceNote: 'Source: FocusIMS Controlled Document PROC-WAH-004 v4.2',
  });

  const filtered = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAskDoc = async (q: string) => {
    if (!q.trim() || loadingAnswer) return;
    setLoadingAnswer(true);

    try {
      const res = await fetch('/api/document-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId: selectedDocId, question: q }),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      setDocAnswer(data);
    } catch (err) {
      console.error('Failed to ask document:', err);
    } finally {
      setLoadingAnswer(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Controlled Document Register
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              {documents.length} Controlled Procedures
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Governing policies, standard operating procedures, and compliance specifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
            <Sparkles className="w-3.5 h-3.5" />
            AI Document Intelligence
          </span>
        </div>
      </div>

      {/* AI Document Q&A Assistant Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-teal-600 text-white">
              <HelpCircle className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-bold text-slate-900">
              Query Controlled Procedures
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Natural language retrieval from approved procedures
          </span>
        </div>

        {/* Query Input */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="w-full sm:w-56 shrink-0">
            <select
              aria-label="Select target procedure"
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.id} - {d.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={docQuestion}
              onChange={(e) => setDocQuestion(e.target.value)}
              placeholder="e.g. What does our Working at Heights procedure require before work begins?"
              className="flex-1 rounded-lg border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />

            <button
              id="ask-doc-btn"
              onClick={() => handleAskDoc(docQuestion)}
              disabled={loadingAnswer || !docQuestion.trim()}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-semibold text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              {loadingAnswer ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>Ask Document</span>
            </button>
          </div>
        </div>

        {/* Answer Box */}
        {docAnswer && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-white text-[11px]">
                  {docAnswer.docId}
                </span>
                <span className="font-bold text-slate-900">{docAnswer.docTitle}</span>
                <span className="text-slate-500">v{docAnswer.version}</span>
              </div>
              <button
                onClick={() => onOpenRecord(docAnswer.docId)}
                className="text-teal-700 font-semibold text-[11px] underline hover:text-teal-900"
              >
                View Full Document Metadata →
              </button>
            </div>

            <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line">
              {docAnswer.answer}
            </div>

            {docAnswer.keyRequirements?.length > 0 && (
              <div className="pt-2 border-t border-slate-200/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Mandatory Compliance Checklist Items:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1.5">
                  {docAnswer.keyRequirements.map((req, i) => (
                    <div
                      key={i}
                      className="p-2 rounded bg-white border border-slate-200 text-[11px] text-slate-700 flex items-start gap-1.5"
                    >
                      <span className="font-mono text-teal-600 font-bold">✓</span>
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-[10px] text-slate-400 italic">{docAnswer.sourceNote}</div>
          </div>
        )}
      </div>

      {/* Controlled Documents Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search document title, ID, or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-slate-800 placeholder:text-slate-400"
            />
          </div>
          <span className="text-slate-500 text-xs">
            Showing {filtered.length} controlled documents
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Document ID</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Version</th>
                <th className="py-3 px-3">Custodian</th>
                <th className="py-3 px-3">Last Review</th>
                <th className="py-3 px-3">Next Review</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((d) => (
                <tr
                  key={d.id}
                  onClick={() => onOpenRecord(d.id)}
                  className="hover:bg-slate-50/80 transition cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 group-hover:text-teal-700 whitespace-nowrap">
                    {d.id}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">{d.title}</td>
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{d.type}</td>
                  <td className="py-3 px-3 font-mono text-slate-700 whitespace-nowrap">
                    v{d.version}
                  </td>
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{d.owner}</td>
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{d.lastReview}</td>
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{d.nextReview}</td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                      {d.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenRecord(d.id);
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
