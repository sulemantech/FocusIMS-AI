import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Loader2,
  FileText,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';
import { getSourceRecordById } from '../data/imsData';
import { SourceRecordRef, AustralianSite } from '../types';

interface AskFocusIMSViewProps {
  currentSite: AustralianSite;
  onOpenRecord: (id: string) => void;
}

interface QueryResult {
  question: string;
  answer: string;
  sourceRecordIds: string[];
  timestamp: string;
}

export const AskFocusIMSView: React.FC<AskFocusIMSViewProps> = ({
  currentSite,
  onOpenRecord,
}) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-seeded with a polished grounded query for instant executive demo presentation
  const [history, setHistory] = useState<QueryResult[]>([
    {
      question: 'What requires management attention this week?',
      answer: `Based on current FocusIMS records across Australian operations, three priority items require management attention this week:

1. **Overdue High-Exposure Corrective Action (Electrical Safety)**
   • **CA-104** (Isolate 415V board, replace degraded feed cabling, test IP66 seal) is currently **8 days overdue** (Due 14 Sep 2026).
   • Owner: Michael Chen | Site: Sydney Operations
   • Root Source: **INC-1042** (Exposed 415V wiring discovered near wet chiller plant during scheduled HVAC servicing).
   • Related System Risk: **RISK-031** (Working near live electrical equipment).

2. **Upcoming Working at Heights Competency Expirations (Operational Risk)**
   • 4 technician certifications expire within the next 22 days (**TR-221**, **TR-222**, **TR-223**, **TR-224**). Liam O’Connor’s certification (**TR-221**) expires in 11 days (03 Oct 2026).
   • Under **PROC-WAH-004**, technicians without current credentials cannot be permitted to perform platform or scaffold work on client sites.

3. **Upcoming ISO 45001 Surveillance Audit Preparation**
   • Audit **AUD-018** (ISO 45001 Internal Surveillance Audit) commences in 9 days (01 Oct 2026).
   • Periodic review sign-offs for High Residual Risks **RISK-031** and **RISK-008** are currently overdue and warrant formal supervisor completion before auditor arrival.`,
      sourceRecordIds: ['CA-104', 'INC-1042', 'RISK-031', 'TR-221', 'AUD-018', 'PROC-WAH-004'],
      timestamp: 'Today at 08:30 AM',
    },
  ]);

  const suggestedQuestions = [
    'What requires management attention this week?',
    'Which corrective actions are overdue?',
    'What are our highest current risks?',
    'Which employee certifications expire soon?',
    'Summarise incidents from the last 30 days.',
    'Are there recurring safety issues?',
    'What should we review before the next ISO 45001 audit?',
  ];

  const handleAsk = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmed, site: currentSite }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const newResult: QueryResult = {
        question: trimmed,
        answer: data.answer || 'No response generated.',
        sourceRecordIds: data.sourceRecordIds || [],
        timestamp: 'Just now',
      };

      setHistory((prev) => [newResult, ...prev]);
      setQuestion('');
    } catch (err: any) {
      console.error('Chat error:', err);
      setError('Unable to reach the AI intelligence service. Displaying system guidance.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Title & Subtitle */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Ask FocusIMS</h1>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
            <Sparkles className="w-3 h-3" />
            Intelligence Engine
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Ask questions across your management system. Answers are grounded strictly in your organization’s active records.
        </p>
      </div>

      {/* Suggested Questions Section */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
          <span className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
            Suggested Executive & HSEQ Enquiries:
          </span>
          <span className="text-[11px] text-slate-500 font-normal">Click to query</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuestion(q);
                handleAsk(q);
              }}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-teal-50/60 hover:border-teal-300 text-slate-700 font-medium transition text-left cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Enterprise Query Input */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk(question);
          }}
          className="space-y-3"
        >
          <div className="relative">
            <textarea
              id="ask-focusims-input"
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Which corrective actions are overdue and what are the root causes? What should we review before the next ISO 45001 audit?"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Site Scope: <span className="font-semibold text-slate-700">{currentSite}</span>
            </span>

            <button
              id="ask-focusims-submit-btn"
              type="submit"
              disabled={loading || !question.trim()}
              className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-semibold text-xs transition shadow-xs flex items-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesising IMS Records...</span>
                </>
              ) : (
                <>
                  <span>Ask FocusIMS</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-3 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Intelligence Answers List */}
      <div className="space-y-6">
        {history.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden"
          >
            {/* Question Bar */}
            <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                <h3 className="text-sm font-bold text-slate-900">{item.question}</h3>
              </div>
              <span className="text-xs text-slate-500">{item.timestamp}</span>
            </div>

            {/* Answer Content */}
            <div className="p-6 space-y-6">
              <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-line font-normal space-y-2">
                {item.answer}
              </div>

              {/* Source Records Grounding Block */}
              {item.sourceRecordIds.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-teal-600" />
                      Source Records Grounding Answer ({item.sourceRecordIds.length})
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Click any card to open source audit record
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {item.sourceRecordIds.map((recId) => {
                      const rec = getSourceRecordById(recId);
                      return (
                        <button
                          key={recId}
                          onClick={() => onOpenRecord(recId)}
                          className="p-3 rounded-lg border border-slate-200 hover:border-teal-400 bg-slate-50 hover:bg-teal-50/30 text-left transition flex items-start justify-between group cursor-pointer"
                        >
                          <div className="truncate pr-2">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="font-mono text-xs font-bold px-1.5 py-0.2 rounded bg-slate-900 text-white">
                                {recId}
                              </span>
                              {rec?.status && (
                                <span className="text-[10px] text-slate-500 font-medium truncate">
                                  {rec.status}
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-teal-900">
                              {rec?.title || recId}
                            </p>
                            {rec?.owner && (
                              <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                                Lead: {rec.owner}
                              </p>
                            )}
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 shrink-0 mt-0.5" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Legal & Compliance Notice */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500 leading-relaxed flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>
                  <strong>AI Assurance Note:</strong> AI-generated insight based on available FocusIMS records.
                  Verify critical decisions against source records. FocusIMS AI never automatically approves corrective actions, closes incidents, or assumes final safety delegation.
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
