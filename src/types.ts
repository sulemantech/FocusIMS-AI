export type AustralianSite =
  | 'All Sites'
  | 'Sydney Operations'
  | 'Melbourne Warehouse'
  | 'Brisbane Service Centre'
  | 'Perth Field Operations';

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type ActionStatus = 'Open' | 'Completed' | 'Due Soon' | 'Overdue';
export type IncidentStatus = 'Under Investigation' | 'Action Assigned' | 'Closed';
export type CertificationStatus = 'Current' | 'Expiring Soon' | 'Expired';
export type AuditStatus = 'Scheduled' | 'In Progress' | 'Completed';
export type DocumentStatus = 'Approved' | 'Under Review' | 'Draft';

export interface IncidentRecord {
  id: string; // e.g. INC-1042
  date: string;
  site: AustralianSite;
  category: string;
  title: string;
  description: string;
  risk: RiskLevel;
  status: IncidentStatus;
  owner: string;
  immediateActionTaken?: string;
  relatedRiskId?: string; // e.g. RISK-031
  relatedActionId?: string; // e.g. CA-104
  relatedProcedureId?: string; // e.g. PROC-ELS-003
}

export interface RiskRecord {
  id: string; // e.g. RISK-031
  title: string;
  category: string;
  site: AustralianSite;
  initialRiskScore: number;
  initialRisk: RiskLevel;
  controls: string[];
  residualRiskScore: number;
  residualRisk: RiskLevel;
  owner: string;
  reviewDate: string;
  isReviewOverdue: boolean;
  relatedIncidentIds?: string[];
  relatedActionIds?: string[];
  relatedProcedureId?: string;
}

export interface CorrectiveActionRecord {
  id: string; // e.g. CA-104
  source: string; // e.g. INC-1042, AUD-017, WHS Committee
  action: string;
  priority: 'High' | 'Medium' | 'Low';
  owner: string;
  dueDate: string;
  daysOverdue?: number;
  status: ActionStatus;
  site: AustralianSite;
  relatedRiskId?: string;
  relatedProcedureId?: string;
  notes?: string;
}

export interface EmployeeTrainingRecord {
  id: string; // e.g. TR-221
  employeeName: string;
  role: string;
  site: AustralianSite;
  certification: string;
  code?: string;
  issueDate: string;
  expiryDate: string;
  daysRemaining: number;
  status: CertificationStatus;
  verificationBody?: string;
}

export interface AuditRecord {
  id: string; // e.g. AUD-018
  standard: 'ISO 9001' | 'ISO 14001' | 'ISO 45001' | 'AS/NZS 4801' | 'NHVR';
  title: string;
  auditType: 'Internal' | 'External Certification' | 'Regulatory Surveillance';
  scope: string;
  leadAuditor: string;
  scheduledDate: string;
  daysUntil: number;
  status: AuditStatus;
  findingsCount?: { major: number; minor: number; observations: number };
  relatedRecords?: string[];
}

export interface ControlledDocumentRecord {
  id: string; // e.g. PROC-WAH-004
  title: string;
  type: 'Policy' | 'Procedure' | 'Plan' | 'Standard';
  version: string;
  owner: string;
  lastReview: string;
  nextReview: string;
  status: DocumentStatus;
  summary: string;
  keyRequirements: string[];
  scope: string;
  relatedRisks?: string[];
}

export interface SourceRecordRef {
  id: string;
  type: 'incident' | 'risk' | 'action' | 'training' | 'audit' | 'document';
  title: string;
  status?: string;
  risk?: RiskLevel;
  owner?: string;
  site?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  sourceRecords?: SourceRecordRef[];
  confidenceNote?: string;
}

export interface ManagementAttentionItem {
  id: string;
  priority: 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
  recommendedAction: string;
  targetDate: string;
  supportingRecordIds: string[];
}

export interface ManagementReviewData {
  reviewPeriod: 'Last 30 Days' | 'Last Quarter' | 'Last 6 Months';
  generatedAt: string;
  executiveSummary: string;
  healthAndSafety: string;
  riskManagement: string;
  correctiveActions: string;
  trainingAndCompetency: string;
  auditAndCompliance: string;
  operationalTrends: string;
  attentionItems: ManagementAttentionItem[];
  supportingRecords?: SourceRecordRef[];
}

export interface IncidentAnalysisResult {
  incidentType: 'Hazard' | 'Near Miss' | 'Minor Incident' | 'Reportable Incident';
  suggestedCategory: string;
  potentialConsequence: string;
  suggestedInitialRisk: RiskLevel;
  immediateAction: string;
  recommendedFollowUp: string;
  suggestedCorrectiveAction: string;
  contributingFactors: string[];
  disclaimer: string;
}

export interface AuditReadinessResult {
  auditId: string;
  auditTitle: string;
  standard: string;
  readinessStatus: 'Attention Warranted' | 'Satisfactory' | 'High Exposure';
  executiveBrief: string;
  previousFindings: string[];
  recommendedPreparationSteps: string[];
  referencedRecordIds: string[];
  overdueActions?: SourceRecordRef[];
  criticalRisks?: SourceRecordRef[];
  expiringCompetencies?: SourceRecordRef[];
}

export type AuditReadinessSummary = AuditReadinessResult;
export type ManagementReviewReport = ManagementReviewData;
export type AttentionItem = ManagementAttentionItem;
