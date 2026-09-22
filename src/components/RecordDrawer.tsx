import React from 'react';
import {
  IncidentRecord,
  RiskRecord,
  CorrectiveActionRecord,
  EmployeeTrainingRecord,
  AuditRecord,
  ControlledDocumentRecord,
} from '../types';
import {
  X,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  GraduationCap,
  ClipboardList,
  Files,
  ExternalLink,
  User,
  Calendar,
  MapPin,
  Link as LinkIcon,
  Clock,
  ShieldCheck,
} from 'lucide-react';

interface RecordDrawerProps {
  recordId: string | null;
  onClose: () => void;
  onSelectRecord: (id: string) => void;
  incidents: IncidentRecord[];
  risks: RiskRecord[];
  actions: CorrectiveActionRecord[];
  training: EmployeeTrainingRecord[];
  audits: AuditRecord[];
  documents: ControlledDocumentRecord[];
}

export const RecordDrawer: React.FC<RecordDrawerProps> = ({
  recordId,
  onClose,
  onSelectRecord,
  incidents,
  risks,
  actions,
  training,
  audits,
  documents,
}) => {
  if (!recordId) return null;

  const cleanId = recordId.trim().toUpperCase();

  const incident = incidents.find((i) => i.id === cleanId);
  const risk = risks.find((r) => r.id === cleanId);
  const action = actions.find((a) => a.id === cleanId);
  const empTraining = training.find((t) => t.id === cleanId);
  const audit = audits.find((au) => au.id === cleanId);
  const document = documents.find((d) => d.id === cleanId);

  const getRecordTypeInfo = () => {
    if (incident) {
      return {
        label: 'Incident & Hazard Record',
        icon: AlertTriangle,
        color: 'text-amber-600 bg-amber-50 border-amber-200',
      };
    }
    if (risk) {
      return {
        label: 'Risk Register Entry',
        icon: ShieldAlert,
        color: 'text-rose-600 bg-rose-50 border-rose-200',
      };
    }
    if (action) {
      return {
        label: 'Corrective Action',
        icon: CheckCircle2,
        color: 'text-teal-600 bg-teal-50 border-teal-200',
      };
    }
    if (empTraining) {
      return {
        label: 'Training & Competency',
        icon: GraduationCap,
        color: 'text-sky-600 bg-sky-50 border-sky-200',
      };
    }
    if (audit) {
      return {
        label: 'Audit & Compliance',
        icon: ClipboardList,
        color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      };
    }
    if (document) {
      return {
        label: 'Controlled Document',
        icon: Files,
        color: 'text-slate-700 bg-slate-100 border-slate-300',
      };
    }
    return {
      label: 'System Record',
      icon: ExternalLink,
      color: 'text-slate-600 bg-slate-50 border-slate-200',
    };
  };

  const typeInfo = getRecordTypeInfo();
  const Icon = typeInfo.icon;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-fade-in">
      <div
        className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-slide-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <span
              className={`p-2 rounded-lg border flex items-center justify-center ${typeInfo.color}`}
            >
              <Icon className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                  {cleanId}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {typeInfo.label}
                </span>
              </div>
              <h2 className="text-sm font-bold text-slate-900 mt-0.5">
                {incident?.title ||
                  risk?.title ||
                  action?.action ||
                  empTraining?.certification ||
                  audit?.title ||
                  document?.title ||
                  cleanId}
              </h2>
            </div>
          </div>
          <button
            id="close-record-drawer"
            aria-label="Close Record Details"
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* INCIDENT DETAILS */}
          {incident && (
            <>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-medium">Risk Rating</span>
                  <div className="mt-1">
                    <span
                      className={`inline-block px-2 py-0.5 rounded font-semibold text-xs ${
                        incident.risk === 'High'
                          ? 'bg-rose-100 text-rose-800'
                          : incident.risk === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {incident.risk} Risk
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-medium">Workflow Status</span>
                  <p className="mt-1 font-semibold text-slate-900">{incident.status}</p>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> Site
                  </span>
                  <p className="mt-1 font-semibold text-slate-900">{incident.site}</p>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> Date Logged
                  </span>
                  <p className="mt-1 font-semibold text-slate-900">{incident.date}</p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Incident Narrative & Description
                </h3>
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-700 leading-relaxed">
                  {incident.description}
                </div>
              </div>

              {incident.immediateActionTaken && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Immediate Action Taken
                  </h3>
                  <div className="p-3.5 rounded-lg bg-teal-50/50 border border-teal-200 text-sm text-teal-900 leading-relaxed">
                    {incident.immediateActionTaken}
                  </div>
                </div>
              )}

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" /> Investigation Lead
                </span>
                <span className="font-semibold text-slate-900">{incident.owner}</span>
              </div>
            </>
          )}

          {/* RISK DETAILS */}
          {risk && (
            <>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-medium">Initial vs Residual Risk</span>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-medium text-[11px]">
                      Init: {risk.initialRisk} ({risk.initialRiskScore})
                    </span>
                    <span>→</span>
                    <span
                      className={`px-2 py-0.5 rounded font-semibold text-xs ${
                        risk.residualRisk === 'High'
                          ? 'bg-rose-100 text-rose-800'
                          : risk.residualRisk === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      Res: {risk.residualRisk} ({risk.residualRiskScore})
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-medium">Review Status</span>
                  <p className="mt-1">
                    {risk.isReviewOverdue ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-rose-700 text-xs">
                        <Clock className="w-3.5 h-3.5" /> Review Overdue ({risk.reviewDate})
                      </span>
                    ) : (
                      <span className="font-semibold text-emerald-700 text-xs">
                        Up to date ({risk.reviewDate})
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Existing Hierarchy of Controls
                </h3>
                <ul className="space-y-2">
                  {risk.controls.map((ctrl, idx) => (
                    <li
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0" />
                      <span>{ctrl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-medium">Category</span>
                  <p className="mt-1 font-semibold text-slate-900">{risk.category}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-medium">Risk Owner</span>
                  <p className="mt-1 font-semibold text-slate-900">{risk.owner}</p>
                </div>
              </div>
            </>
          )}

          {/* CORRECTIVE ACTION DETAILS */}
          {action && (
            <>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-medium">Priority</span>
                  <div className="mt-1">
                    <span
                      className={`inline-block px-2 py-0.5 rounded font-semibold text-xs ${
                        action.priority === 'High'
                          ? 'bg-rose-100 text-rose-800'
                          : action.priority === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {action.priority} Priority
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-medium">Action Status</span>
                  <p className="mt-1">
                    <span
                      className={`font-semibold text-xs ${
                        action.status === 'Overdue'
                          ? 'text-rose-700'
                          : action.status === 'Due Soon'
                          ? 'text-amber-700'
                          : action.status === 'Completed'
                          ? 'text-emerald-700'
                          : 'text-slate-700'
                      }`}
                    >
                      {action.status}
                      {action.daysOverdue ? ` (${action.daysOverdue}d)` : ''}
                    </span>
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-medium">Due Date</span>
                  <p className="mt-1 font-semibold text-slate-900">{action.dueDate}</p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Action Required
                </h3>
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-800 leading-relaxed font-medium">
                  {action.action}
                </div>
              </div>

              {action.notes && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Engineering / Implementation Notes
                  </h3>
                  <div className="p-3 rounded-lg bg-amber-50/40 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                    {action.notes}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-medium">Source Event</span>
                  <p className="mt-1 font-semibold text-slate-900">{action.source}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-medium">Action Owner</span>
                  <p className="mt-1 font-semibold text-slate-900">{action.owner}</p>
                </div>
              </div>
            </>
          )}

          {/* TRAINING RECORD DETAILS */}
          {empTraining && (
            <>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-medium">Employee Name</span>
                  <p className="mt-1 font-bold text-slate-900 text-sm">
                    {empTraining.employeeName}
                  </p>
                  <p className="text-slate-500 text-[11px]">{empTraining.role}</p>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-medium">Status & Expiry</span>
                  <p className="mt-1">
                    <span
                      className={`inline-block px-2 py-0.5 rounded font-semibold text-xs ${
                        empTraining.status === 'Expiring Soon'
                          ? 'bg-amber-100 text-amber-800'
                          : empTraining.status === 'Expired'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {empTraining.status} ({empTraining.daysRemaining} days left)
                    </span>
                  </p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Expiry: {empTraining.expiryDate}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-medium text-xs">Accredited Unit</span>
                <p className="font-semibold text-slate-900 text-sm mt-0.5">
                  {empTraining.certification}
                </p>
                {empTraining.code && (
                  <p className="text-xs font-mono text-slate-500 mt-1">
                    Unit Code: {empTraining.code}
                  </p>
                )}
                {empTraining.verificationBody && (
                  <p className="text-xs text-slate-600 mt-1">
                    Registered Training Organisation: {empTraining.verificationBody}
                  </p>
                )}
              </div>
            </>
          )}

          {/* AUDIT DETAILS */}
          {audit && (
            <>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-medium">Audit Standard</span>
                  <p className="mt-1 font-bold text-slate-900">{audit.standard}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-medium">Status</span>
                  <p className="mt-1 font-semibold text-slate-900">{audit.status}</p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Audit Scope
                </h3>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  {audit.scope}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs flex justify-between">
                <span className="text-slate-500">Lead Auditor:</span>
                <span className="font-semibold text-slate-900">{audit.leadAuditor}</span>
              </div>
            </>
          )}

          {/* DOCUMENT DETAILS */}
          {document && (
            <>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-medium">Version</span>
                  <p className="mt-1 font-bold text-slate-900">v{document.version}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-medium">Document Type</span>
                  <p className="mt-1 font-semibold text-slate-900">{document.type}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-medium">Status</span>
                  <p className="mt-1 font-semibold text-emerald-700">{document.status}</p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Procedure Summary & Scope
                </h3>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  {document.summary}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Key Mandatory Requirements
                </h3>
                <ul className="space-y-1.5">
                  {document.keyRequirements.map((req, i) => (
                    <li
                      key={i}
                      className="p-2 rounded bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2"
                    >
                      <span className="font-mono text-teal-600 font-bold shrink-0">
                        {i + 1}.
                      </span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {/* CROSS-REFERENCED CONNECTED RECORDS */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-teal-600" />
              Connected System Records
            </h3>
            <div className="space-y-2">
              {incident?.relatedRiskId && (
                <button
                  onClick={() => onSelectRecord(incident.relatedRiskId!)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 hover:border-teal-400 bg-slate-50 hover:bg-teal-50/40 text-left transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
                      {incident.relatedRiskId}
                    </span>
                    <span className="text-xs text-slate-700 font-medium truncate">
                      Related Risk Profile
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 shrink-0" />
                </button>
              )}

              {incident?.relatedActionId && (
                <button
                  onClick={() => onSelectRecord(incident.relatedActionId!)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 hover:border-teal-400 bg-slate-50 hover:bg-teal-50/40 text-left transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-teal-100 text-teal-800">
                      {incident.relatedActionId}
                    </span>
                    <span className="text-xs text-slate-700 font-medium truncate">
                      Assigned Corrective Action
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 shrink-0" />
                </button>
              )}

              {incident?.relatedProcedureId && (
                <button
                  onClick={() => onSelectRecord(incident.relatedProcedureId!)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 hover:border-teal-400 bg-slate-50 hover:bg-teal-50/40 text-left transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-800">
                      {incident.relatedProcedureId}
                    </span>
                    <span className="text-xs text-slate-700 font-medium truncate">
                      Governing Standard Operating Procedure
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 shrink-0" />
                </button>
              )}

              {risk?.relatedActionIds?.map((actId) => (
                <button
                  key={actId}
                  onClick={() => onSelectRecord(actId)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 hover:border-teal-400 bg-slate-50 hover:bg-teal-50/40 text-left transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-teal-100 text-teal-800">
                      {actId}
                    </span>
                    <span className="text-xs text-slate-700 font-medium truncate">
                      Active Mitigation Action
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 shrink-0" />
                </button>
              ))}

              {risk?.relatedProcedureId && (
                <button
                  onClick={() => onSelectRecord(risk.relatedProcedureId!)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 hover:border-teal-400 bg-slate-50 hover:bg-teal-50/40 text-left transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-800">
                      {risk.relatedProcedureId}
                    </span>
                    <span className="text-xs text-slate-700 font-medium truncate">
                      Governing Standard Procedure
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 shrink-0" />
                </button>
              )}

              {action?.relatedRiskId && (
                <button
                  onClick={() => onSelectRecord(action.relatedRiskId!)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 hover:border-teal-400 bg-slate-50 hover:bg-teal-50/40 text-left transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
                      {action.relatedRiskId}
                    </span>
                    <span className="text-xs text-slate-700 font-medium truncate">
                      Underlying Operational Risk
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 shrink-0" />
                </button>
              )}
            </div>
          </div>

          {/* Compliance Disclaimer */}
          <div className="p-3.5 rounded-lg bg-slate-100 border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
            <span className="font-semibold text-slate-700">Governance Notice:</span> FocusIMS AI cross-references active IMS records for client demonstration. Critical safety and corrective closeouts require human authorization.
          </div>
        </div>
      </div>
    </div>
  );
};
