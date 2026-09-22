import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const getGeminiClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Summary context of synthetic Australian IMS records for grounding
const SYSTEM_GROUNDING_CONTEXT = `
You are the FocusIMS AI intelligence engine embedded in an established Australian Integrated Management System (IMS) for "Acme Facilities Australia".
Your purpose is: "From compliance data to actionable intelligence."
You provide high-level HSEQ and operational management insights based strictly on the organization's existing records.

CRITICAL RULES:
1. Ground answers in available FocusIMS records.
2. Reference record IDs (e.g. CA-104, INC-1042, RISK-031, TR-221, AUD-018, PROC-WAH-004, PROC-ELS-003).
3. Do NOT invent records or facts not present in the system.
4. Clearly distinguish facts from recommendations.
5. Emphasize that AI suggestions require review and approval by an authorized person.
6. NEVER claim legal or regulatory compliance or guarantee ISO certification.
7. NEVER automatically approve corrective actions or close safety incidents.
8. Use Australian English spelling (e.g., prioritise, summarise, licence, categorisation).
9. Sound like an executive HSEQ management advisor, not a generic chatbot.

CURRENT ACTIVE SYSTEM DATASET SUMMARY:
- Sites: Sydney Operations, Melbourne Warehouse, Brisbane Service Centre, Perth Field Operations.
- Incidents:
  * INC-1042 (14 Sep 2026, Sydney Operations): Exposed 415V wiring near wet chiller plant during HVAC servicing. Risk: High. Status: Under Investigation. Owner: Michael Chen. Connected to RISK-031, CA-104, PROC-ELS-003.
  * INC-1038 (08 Sep 2026, Melbourne Warehouse): Manual handling lower back strain de-palletising 28kg export crates. Risk: Medium. Status: Action Assigned. Owner: Sarah Williams. Connected to RISK-014, CA-106, PROC-WHS-002.
  * INC-1035 (02 Sep 2026, Brisbane Service Centre): Contractor slipped on spilled coolant in maintenance bay. Risk: Low. Status: Closed. Owner: David Brown. Connected to RISK-022, CA-105.
  * INC-1031 (28 Aug 2026, Perth Field Operations): Subcontractor working on scaffolding at 4.2m without harness lanyard anchored. Risk: High. Status: Action Assigned. Owner: James Wilson. Connected to RISK-008, CA-098, PROC-WAH-004.
  * INC-1029 (21 Aug 2026, Melbourne Warehouse): Technician strained shoulder lifting 32kg hydraulic cylinder solo. Risk: Medium. Status: Closed. Owner: Sarah Williams. Connected to RISK-014, CA-095.
  * INC-1025 (15 Aug 2026, Sydney Operations): RCD safety trip from abraded portable 15A lead exposing copper. Risk: High. Status: Closed. Owner: Michael Chen. Connected to RISK-031, CA-092, PROC-ELS-003.
  * INC-1022 (05 Aug 2026, Brisbane Service Centre): Solvent degreaser splash during parts washing; eye wash station used. Risk: Medium. Status: Closed. Owner: David Brown. Connected to RISK-019, CA-102.
  * INC-1018 (27 Jul 2026, Melbourne Warehouse): Forklift impact with rack upright in Aisle 4; upright deflection noted. Risk: Medium. Status: Action Assigned. Owner: Sarah Williams. Connected to RISK-012, CA-097.
  * INC-1014 (18 Jul 2026, Perth Field Operations): Early heat fatigue during 38.5°C remote pipeline survey. Risk: Low. Status: Closed. Owner: James Wilson. Connected to RISK-027.
  * INC-1010 (10 Jul 2026, Sydney Operations): Contractor accessed roof ducting without signed Daily Permit to Work. Risk: High. Status: Closed. Owner: Michael Chen. Connected to RISK-005, CA-084, PROC-CTR-007.

- Corrective Actions (12 total, 4 overdue):
  * CA-104 (Source: INC-1042): Isolate 415V board, replace degraded feed cabling, test IP66 seal. High Priority. Owner: Michael Chen. Due: 14 Sep 2026 (8 days overdue). Status: Overdue. Related to RISK-031, PROC-ELS-003.
  * CA-097 (Source: INC-1018): Structural rack engineering inspection and install heavy-duty corner bollard. Medium Priority. Owner: Sarah Williams. Due: 19 Sep 2026 (3 days overdue). Status: Overdue. Related to RISK-012.
  * CA-098 (Source: INC-1031): Audit subcontractor high-risk work licences, conduct safety stand-down on harness anchor protocols. High Priority. Owner: James Wilson. Due: 17 Sep 2026 (5 days overdue). Status: Overdue. Related to RISK-008, PROC-WAH-004.
  * CA-102 (Source: AUD-017): Update chemical safety data sheets (SDS) register in Brisbane store to GHS rev 7. Low Priority. Owner: David Brown. Due: 20 Sep 2026 (2 days overdue). Status: Overdue. Related to RISK-019.
  * CA-101 (Source: Monthly WHS Inspection): Replace battery backup and clear pathway for exit sign near Bay 2. Medium Priority. Owner: David Brown. Due: 23 Sep 2026 (Due tomorrow). Status: Due Soon.
  * CA-105: Install anti-slip floor coating and drip trays under fluid transfer station (Brisbane). Low Priority. Open.
  * CA-106: Procure vacuum lifter attachment for Melbourne warehouse palletising. Medium Priority. Open.
  * CA-107: Conduct refresher toolbox briefing on working near live electrical assets across all depots. High Priority. Open.
  * CA-108: Review and re-verify contractor induction records prior to ISO 45001 audit. High Priority. Open.
  * CA-092 (Source: INC-1025): Test and tag all portable 240V power tools (Sydney). Completed.
  * CA-095 (Source: INC-1029): Mandatory 2-person lift rule for items exceeding 20kg (Melbourne). Completed.
  * CA-084 (Source: INC-1010): Reinforce gate pass protocol so contractors cannot access site without permit. Completed.

- Risks (8 total, 3 high residual, 2 reviews overdue):
  * RISK-031: Working near live electrical equipment. Sydney. Initial: Critical (20). Residual: High (12). Review Due: 10 Aug 2026 (Overdue). Owner: Michael Chen.
  * RISK-008: Working at Heights on perimeter scaffolding (>2m). Perth. Initial: Critical (20). Residual: High (12). Review Due: 15 Sep 2026 (Overdue). Owner: James Wilson.
  * RISK-012: Mobile plant and pedestrian interaction (Forklifts). Melbourne. Initial: High (16). Residual: High (10). Review Due: 30 Sep 2026. Owner: Sarah Williams.
  * RISK-014: Repetitive manual handling of heavy goods. Melbourne. Initial: High (15). Residual: Medium (8). Owner: Sarah Williams.
  * RISK-019: Storage and decanting of hazardous workshop chemicals. Brisbane. Initial: High (15). Residual: Medium (6). Owner: David Brown.
  * RISK-005: Uncontrolled contractor safety risks. All Sites. Initial: High (16). Residual: Medium (8). Owner: Elena Rostova.
  * RISK-022: Slip, trip, and fall hazards from wet maintenance floor areas. Brisbane. Initial: Medium (9). Residual: Low (4). Owner: David Brown.
  * RISK-027: Thermal environmental exposure (extreme summer heat). Perth. Initial: High (12). Residual: Low (4). Owner: James Wilson.

- Training & Competency (6 expiring within 30 days):
  * TR-221: Liam O'Connor (Sydney) - Working at Heights Certification (RIIWHS204E) - Expires in 11 days (03 Oct 2026)
  * TR-222: Marcus Vance (Perth) - Working at Heights Certification (RIIWHS204E) - Expires in 14 days (06 Oct 2026)
  * TR-223: Daniel Nguyen (Brisbane) - Working at Heights Certification (RIIWHS204E) - Expires in 19 days (11 Oct 2026)
  * TR-224: Chloe Taylor (Sydney) - Working at Heights Certification (RIIWHS204E) - Expires in 22 days (14 Oct 2026)
  * TR-225: Bradley Scott (Melbourne) - Forklift High Risk Work Licence (TLILIC0003) - Expires in 7 days (29 Sep 2026)
  * TR-226: Michael Chen (Sydney) - Electrical Contractor / Disconnect-Reconnect (UEENEEP012A) - Expires in 26 days (18 Oct 2026)

- Audits:
  * AUD-018: ISO 45001:2018 Internal Surveillance Audit. Scope: Sydney & Perth. Scheduled in 9 days (01 Oct 2026). Lead: Elena Rostova.
  * AUD-019: ISO 9001:2015 Quality Internal Audit. Scheduled in 24 days (16 Oct 2026).
  * AUD-017: ISO 14001 Environmental Audit. Completed 15 Aug 2026 (CA-102 assigned).
  * AUD-016: AS/NZS 4801 / ISO 45001 External Certification Audit (BSI). Completed 12 May 2026.
  * AUD-015: NHVR Fleet Safety Audit. Completed 18 Feb 2026.

- Controlled Documents:
  * PROC-WAH-004: Working at Heights Procedure v4.2. Mandatory SWMS, 100% tie-off, 15kN rated anchors, quarterly tag inspection, rescue plan before work begins (>2m).
  * PROC-ELS-003: Electrical Safety and Isolation Procedure v3.1. Prohibits live work without permit; 4-step LOTO; calibrated test-before-touch; 3-month tagging per AS/NZS 3760; 3m barricade for exposed conductors in wet areas.
  * PROC-INC-001: Incident and Hazard Reporting Procedure v5.0. 2-hr reporting window; 60-min regulator escalation; human authorization required for closeout.
  * PROC-RSK-002: Enterprise Risk Assessment and Control Procedure v4.0. 5x5 matrix; 6-month review for High/Critical risks; hierarchy of controls.
  * PROC-WHS-002: Manual Handling and Ergonomics Procedure v2.4. Max 20kg solo lift; mechanical lift aids; 2-hour task rotation.
  * POL-WHS-001: Occupational Health, Safety and Wellbeing Policy v6.0. Stop Work Authority.
  * PROC-CTR-007: Contractor Management and Verification Procedure v3.3. RapidInduct pre-qualification; daily PTW sign-off.
  * PROC-AUD-005: Internal IMS Audit Procedure v3.0. Annual audit schedule; independent auditors; 48-hr CAR logging.
`;

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// 1. ASK FOCUSIMS (Interactive Q&A grounded in records)
app.post('/api/chat', async (req, res) => {
  const { question, site } = req.body;
  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Question is required' });
  }

  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `
Question from HSEQ / Operations Manager (Site filter: ${site || 'All Sites'}):
"${question}"

Provide a concise, professional, grounded executive answer.
Reference specific record IDs in brackets or bullet points (e.g., [CA-104], [RISK-031], [INC-1042], [TR-221], [AUD-018], [PROC-WAH-004]).
Format key findings clearly. State concrete facts first, followed by management recommendations.
Conclude with a bulleted list of referenced record IDs so they can be parsed for source cards.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_GROUNDING_CONTEXT,
          temperature: 0.2,
        },
      });

      const text = response.text || '';
      // Extract record IDs mentioned in text
      const recordMatches = text.match(/\b(INC-\d+|CA-\d+|RISK-\d+|TR-\d+|AUD-\d+|PROC-[A-Z]+-\d+|POL-[A-Z]+-\d+)\b/g) || [];
      const uniqueRecords = Array.from(new Set(recordMatches));

      return res.json({
        answer: text,
        sourceRecordIds: uniqueRecords,
      });
    } catch (err: any) {
      console.error('Gemini chat error, falling back to local reasoning:', err?.message || err);
      // Fall through to deterministic fallback
    }
  }

  // Deterministic grounded fallback logic tailored to key demo questions
  const q = question.toLowerCase();
  let answer = '';
  let sourceRecordIds: string[] = [];

  if (q.includes('attention') || q.includes('this week') || q.includes('priority')) {
    answer = `Based on current FocusIMS records, three primary areas require executive management attention this week:

1. **Overdue Electrical Corrective Action (High Exposure)**
   - **CA-104** (Electrical Isolation & Switchboard Repair) is currently **8 days overdue**. This action addresses the exposed 415V wiring discovered near the wet chiller plant (**INC-1042**).
   - Owner: Michael Chen | Related Risk: **RISK-031** (Working near live electrical equipment).

2. **Upcoming Working at Heights Competency Expirations**
   - 4 technician certifications expire within the next 22 days (**TR-221**, **TR-222**, **TR-223**, **TR-224**). Liam O’Connor's certification (**TR-221**) expires in 11 days.
   - Cross-site field operations will face stop-work constraints under **PROC-WAH-004** if renewals are not scheduled.

3. **Upcoming ISO 45001 Surveillance Audit**
   - Internal audit **AUD-018** commences in 9 days. High residual risks (**RISK-031**, **RISK-008**) have overdue periodic review dates that warrant closure prior to auditor walkthroughs.`;
    sourceRecordIds = ['CA-104', 'INC-1042', 'RISK-031', 'TR-221', 'AUD-018', 'PROC-WAH-004'];
  } else if (q.includes('corrective action') || q.includes('overdue')) {
    answer = `There are currently **4 overdue corrective actions** requiring operational attention:

1. **CA-104 – Electrical Isolation & Switchboard Repair**
   - Status: Overdue by 8 days (Due 14 Sep 2026)
   - Priority: High | Owner: Michael Chen | Site: Sydney Operations
   - Source: **INC-1042** (Exposed 415V wiring near chiller)
   - Critical path: Marine-grade gland kit delivery and IP66 re-certification.

2. **CA-098 – Subcontractor Height Licence Audit & Stand-Down**
   - Status: Overdue by 5 days (Due 17 Sep 2026)
   - Priority: High | Owner: James Wilson | Site: Perth Field Operations
   - Source: **INC-1031** (Working on scaffolding at 4.2m without harness tie-off)

3. **CA-097 – Pallet Racking Structural Engineering Inspection**
   - Status: Overdue by 3 days (Due 19 Sep 2026)
   - Priority: Medium | Owner: Sarah Williams | Site: Melbourne Warehouse
   - Source: **INC-1018** (Forklift impact in Aisle 4)

4. **CA-102 – Chemical Safety Data Sheets (SDS) GHS Rev 7 Update**
   - Status: Overdue by 2 days (Due 20 Sep 2026)
   - Priority: Low | Owner: David Brown | Site: Brisbane Service Centre
   - Source: **AUD-017** (Environmental hazardous chemical audit)`;
    sourceRecordIds = ['CA-104', 'CA-098', 'CA-097', 'CA-102', 'INC-1042', 'INC-1031', 'RISK-031'];
  } else if (q.includes('risk') || q.includes('highest')) {
    answer = `FocusIMS tracks **3 High Residual Risks** across Australian operations:

1. **RISK-031 – Working near live electrical equipment**
   - Residual Risk: High (Score 12) | Initial: Critical (Score 20)
   - Site: Sydney Operations | Owner: Michael Chen
   - Status: Scheduled review date (10 Aug 2026) is **overdue**.
   - Linked to recent live wiring incident **INC-1042** and overdue action **CA-104**.

2. **RISK-008 – Working at Heights on perimeter scaffolding (>2m)**
   - Residual Risk: High (Score 12) | Initial: Critical (Score 20)
   - Site: Perth Field Operations | Owner: James Wilson
   - Status: Scheduled review date (15 Sep 2026) is **overdue**.
   - Linked to lanyard unhooked near-miss **INC-1031** and overdue action **CA-098**.

3. **RISK-012 – Mobile plant and pedestrian interaction (Forklifts)**
   - Residual Risk: High (Score 10) | Initial: High (Score 16)
   - Site: Melbourne Warehouse | Owner: Sarah Williams
   - Status: Current review due 30 Sep 2026.
   - Linked to rack deflection incident **INC-1018** and action **CA-097**.`;
    sourceRecordIds = ['RISK-031', 'RISK-008', 'RISK-012', 'CA-104', 'CA-098', 'INC-1042', 'INC-1031'];
  } else if (q.includes('certif') || q.includes('training') || q.includes('expir')) {
    answer = `**6 employee certifications expire within the next 30 days**, posing operational and compliance risk:

1. **TR-225 – Bradley Scott (Melbourne Warehouse)**: Forklift High Risk Work Licence (LF) expires in **7 days** (29 Sep 2026). High urgency to prevent storeperson machine grounding.
2. **TR-221 – Liam O’Connor (Sydney Operations)**: Working at Heights (RIIWHS204E) expires in **11 days** (03 Oct 2026).
3. **TR-222 – Marcus Vance (Perth Field)**: Working at Heights expires in **14 days** (06 Oct 2026).
4. **TR-223 – Daniel Nguyen (Brisbane Service)**: Working at Heights expires in **19 days** (11 Oct 2026).
5. **TR-224 – Chloe Taylor (Sydney Operations)**: Working at Heights expires in **22 days** (14 Oct 2026).
6. **TR-226 – Michael Chen (Sydney Operations)**: Electrical Contractor Disconnect-Reconnect expires in **26 days** (18 Oct 2026).

*Recommendation:* Group Working at Heights recertifications across Sydney and Perth to manage training costs and avoid site downtime.`;
    sourceRecordIds = ['TR-225', 'TR-221', 'TR-222', 'TR-223', 'TR-224', 'TR-226', 'PROC-WAH-004'];
  } else if (q.includes('recurring') || q.includes('pattern') || q.includes('trend')) {
    answer = `Analysis of recent incident records reveals **2 distinct recurring operational patterns**:

1. **Manual Handling & Musculoskeletal Strains (Melbourne Warehouse)**
   - **INC-1038** (08 Sep): Storeperson lower back strain during manual carton de-palletising (28kg load).
   - **INC-1029** (21 Aug): Technician shoulder rotator cuff strain lifting hydraulic cylinder solo (32kg load).
   - Pattern: Workers bypassing mechanical aids during peak freight volume, in breach of the 20kg limit in **PROC-WHS-002**.

2. **Electrical Safety & Cable Degradation (Sydney Operations)**
   - **INC-1042** (14 Sep): Exposed 415V conductors near wet chiller plant during scheduled servicing.
   - **INC-1025** (15 Aug): RCD trip caused by severely abraded 15A extension lead exposing copper wire.
   - Pattern: Wear-and-tear degradation on electrical distribution and leads. Mitigated by re-tagging (**CA-092**) and ongoing isolation (**CA-104**) under **PROC-ELS-003**.`;
    sourceRecordIds = ['INC-1038', 'INC-1029', 'INC-1042', 'INC-1025', 'RISK-014', 'RISK-031', 'CA-104'];
  } else if (q.includes('iso 45001') || q.includes('audit')) {
    answer = `For the upcoming **ISO 45001 Internal Surveillance Audit (AUD-018)** scheduled in 9 days (01 Oct 2026), management should review these specific records:

1. **Overdue High-Priority Corrective Actions:**
   - **CA-104** (Electrical Isolation) – 8 days overdue. Auditor Elena Rostova will scrutinise electrical controls under Clause 8.1.
   - **CA-098** (Scaffolding Fall Protection Stand-Down) – 5 days overdue. Relevant to Clause 8.2 and Clause 7.3.

2. **Overdue Risk Register Reviews:**
   - **RISK-031** (Live Electrical Work) review overdue since 10 Aug 2026.
   - **RISK-008** (Working at Heights) review overdue since 15 Sep 2026.

3. **Expiring Critical Competencies:**
   - 4 technicians facing Working at Heights expiry within 22 days (**TR-221**, **TR-222**, **TR-223**, **TR-224**). Auditor sample checks often target high-risk work authorisations.

*Note:* These represent internal FocusIMS records that warrant review prior to the audit walkthrough; no representation of external compliance is implied.`;
    sourceRecordIds = ['AUD-018', 'CA-104', 'CA-098', 'RISK-031', 'RISK-008', 'TR-221', 'PROC-WAH-004'];
  } else {
    answer = `FocusIMS Intelligence summary for your enquiry:

• **Active Corrective Actions**: 12 total, with 4 overdue (**CA-104**, **CA-098**, **CA-097**, **CA-102**). **CA-104** represents the highest immediate exposure due to electrical hazard **INC-1042**.
• **High Residual Risks**: 3 tracked items (**RISK-031**, **RISK-008**, **RISK-012**). Two have overdue periodic review dates (**RISK-031**, **RISK-008**).
• **Personnel Competency**: 6 certifications expire within 30 days, including forklift operator Bradley Scott (**TR-225**) and 4 Working at Heights technicians (**TR-221** to **TR-224**).
• **Upcoming Compliance Audits**: **AUD-018** (ISO 45001 Internal Audit) scheduled in 9 days.

Refer to the linked source records for full investigation notes and engineering controls.`;
    sourceRecordIds = ['CA-104', 'RISK-031', 'TR-221', 'AUD-018'];
  }

  return res.json({
    answer,
    sourceRecordIds,
  });
});

// 2. AI MANAGEMENT REVIEW
app.post('/api/management-review', async (req, res) => {
  const { period = 'Last 30 Days', site = 'All Sites' } = req.body;
  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `
Generate an executive HSEQ Management Review for Acme Facilities Australia.
Review Period: ${period}
Site Scope: ${site}

Follow standard executive IMS reporting conventions (ISO 9001 / ISO 14001 / ISO 45001 structure).
Use Australian English spelling.
Ground your conclusions strictly in the FocusIMS demo records provided in your system instructions.
Explicitly cite record IDs (e.g. CA-104, INC-1042, RISK-031, TR-221, AUD-018, PROC-WAH-004).

Structure your response as JSON with the following exact keys:
{
  "executiveSummary": "string",
  "healthAndSafety": "string",
  "riskManagement": "string",
  "correctiveActions": "string",
  "trainingAndCompetency": "string",
  "auditAndCompliance": "string",
  "operationalTrends": "string",
  "attentionItems": [
    {
      "id": "ATT-01",
      "priority": "High" | "Medium" | "Low",
      "title": "string",
      "description": "string",
      "recommendedAction": "string",
      "targetDate": "string",
      "supportingRecordIds": ["string"]
    }
  ]
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_GROUNDING_CONTEXT,
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      if (parsed.executiveSummary && parsed.attentionItems) {
        return res.json({
          reviewPeriod: period,
          generatedAt: new Date().toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' }),
          ...parsed,
        });
      }
    } catch (err: any) {
      console.error('Gemini management review error, using grounded executive template:', err?.message || err);
    }
  }

  // Realistic grounded template for executive review
  const defaultReview = {
    reviewPeriod: period,
    generatedAt: new Date().toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' }),
    executiveSummary: `During the ${period}, operational HSEQ performance remained steady with zero lost-time injuries (LTI). However, leading indicators highlight three distinct management pressure points: four corrective actions have breached target completion dates (most critically CA-104 regarding 415V electrical switchboard isolation), four field technicians approach concurrent Working at Heights certification expiries, and two recurring manual handling strains occurred in Melbourne logistics. Periodic risk review obligations for RISK-031 and RISK-008 also require immediate supervisor sign-off prior to the upcoming ISO 45001 internal audit.`,
    healthAndSafety: `Total of 10 recorded events across the system, comprising 4 hazards, 3 near misses, and 3 minor medical treatment events. High-potential events include INC-1042 (exposed electrical conductors in Sydney) and INC-1031 (subcontractor working at 4.2m without harness attachment in Perth). In both instances, Stop Work Authority was enacted promptly, preventing worker injury.`,
    riskManagement: `Eight primary operational risks are registered. Three operate with High residual risk ratings (RISK-031, RISK-008, RISK-012). Periodic reviews for RISK-031 (Electrical Safety) and RISK-008 (Working at Heights) are 43 days and 7 days overdue respectively. Review meetings have been scheduled with respective site managers to re-evaluate control effectiveness.`,
    correctiveActions: `12 corrective actions are active in the IMS, of which 4 are overdue (33% overdue rate). CA-104 (8 days overdue, Michael Chen) is awaiting replacement marine-grade gland fittings; temporary padlock isolations remain secure. CA-098 (5 days overdue, James Wilson) requires final contractor licence submission. CA-097 (3 days overdue, Sarah Williams) has a structural engineer scheduled tomorrow for warehouse racking.`,
    trainingAndCompetency: `Overall workforce compliance is 86%. Six certifications expire within 30 days. Priority focus is required on Bradley Scott's forklift licence (TR-225, expires in 7 days) and four Working at Heights credentials (TR-221, TR-222, TR-223, TR-224) expiring between 03 Oct and 14 Oct 2026. Refresher training courses have been block-booked with Pinnacle Safety Training.`,
    auditAndCompliance: `Preparations are underway for AUD-018 (ISO 45001 Internal Surveillance Audit) scheduled in 9 days, scoped to Sydney Operations and Perth Field Operations. Outstanding findings from previous environmental audit AUD-017 are 78% resolved, with chemical SDS updates (CA-102) progressing.`,
    operationalTrends: `Trend analysis identified two clear patterns: (1) manual handling back/shoulder strains in Melbourne Warehouse during high-volume de-palletising operations (INC-1038, INC-1029), prompting procurement of a vacuum lifter (CA-106); and (2) insulation wear on portable electrical gear in Sydney workshop bays (INC-1042, INC-1025).`,
    attentionItems: [
      {
        id: 'ATT-01',
        priority: 'High',
        title: 'Expedite CA-104 Electrical Isolation Closeout',
        description: '415V switchboard at Sydney Chiller Plant remains isolated on padlocks pending marine gland seal installation (8 days overdue).',
        recommendedAction: 'Authorise air-freight courier for replacement gland kit and schedule certified electrician for Saturday isolation window.',
        targetDate: '26 Sep 2026',
        supportingRecordIds: ['CA-104', 'INC-1042', 'RISK-031', 'PROC-ELS-003'],
      },
      {
        id: 'ATT-02',
        priority: 'High',
        title: 'Renew Critical Working at Heights Certifications',
        description: '4 field technicians (Liam O’Connor, Marcus Vance, Daniel Nguyen, Chloe Taylor) face certification expiry within 22 days.',
        recommendedAction: 'Confirm attendance for Pinnacle Safety 1-day refresher course prior to 03 Oct to avoid Stop Work stand-downs on customer sites.',
        targetDate: '01 Oct 2026',
        supportingRecordIds: ['TR-221', 'TR-222', 'TR-223', 'TR-224', 'PROC-WAH-004'],
      },
      {
        id: 'ATT-03',
        priority: 'Medium',
        title: 'Sign Off Overdue Risk Reviews Before ISO 45001 Audit',
        description: 'Scheduled reviews for RISK-031 (Electrical) and RISK-008 (Working at Heights) are overdue ahead of AUD-018.',
        recommendedAction: 'HSEQ Lead Elena Rostova to convene 30-minute review panels with Michael Chen and James Wilson to update control verification logs.',
        targetDate: '28 Sep 2026',
        supportingRecordIds: ['RISK-031', 'RISK-008', 'AUD-018'],
      },
      {
        id: 'ATT-04',
        priority: 'Medium',
        title: 'Complete Forklift Racking Structural Engineering Sign-Off',
        description: 'Melbourne Warehouse Aisle 4 racking upright sustained low-speed impact from counterbalance forklift (INC-1018, CA-097).',
        recommendedAction: 'Review engineer deflection report tomorrow afternoon and install steel corner floor bollards.',
        targetDate: '24 Sep 2026',
        supportingRecordIds: ['CA-097', 'INC-1018', 'RISK-012'],
      },
      {
        id: 'ATT-05',
        priority: 'Low',
        title: 'Finalise Chemical SDS GHS Rev 7 Updates',
        description: 'Brisbane Service Centre chemical register requires 4 remaining supplier SDS updates (CA-102).',
        recommendedAction: 'Download revised safety sheets from supplier portal and upload to Chemwatch kiosk.',
        targetDate: '26 Sep 2026',
        supportingRecordIds: ['CA-102', 'AUD-017', 'RISK-019'],
      },
    ],
  };

  return res.json(defaultReview);
});

// 3. AI INCIDENT ASSISTANT (Structured ingestion from field observations)
app.post('/api/incident-assistant', async (req, res) => {
  const { description } = req.body;
  if (!description || typeof description !== 'string') {
    return res.status(400).json({ error: 'Description is required' });
  }

  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `
Analyze this unstructured field observation submitted by an Australian enterprise worker:
"${description}"

Transform it into a structured HSEQ draft record.
Return JSON with the following structure:
{
  "incidentType": "Hazard" | "Near Miss" | "Minor Incident" | "Reportable Incident",
  "suggestedCategory": "string (e.g. Electrical Safety, Working at Heights, Manual Handling, Chemical Safety)",
  "potentialConsequence": "string (clear concise consequence)",
  "suggestedInitialRisk": "Low" | "Medium" | "High" | "Critical",
  "immediateAction": "string (what was done or should be verified)",
  "recommendedFollowUp": "string",
  "suggestedCorrectiveAction": "string",
  "contributingFactors": ["string", "string", "string"],
  "disclaimer": "AI suggestions require review and approval by an authorised person. AI must never automatically approve or close safety records."
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_GROUNDING_CONTEXT,
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      if (parsed.incidentType && parsed.suggestedInitialRisk) {
        return res.json(parsed);
      }
    } catch (err: any) {
      console.error('Gemini incident assistant error, using grounded default:', err?.message || err);
    }
  }

  // Realistic fallback matching the prompt's explicit example
  const d = description.toLowerCase();
  if (d.includes('wire') || d.includes('electric') || d.includes('air-conditioning') || d.includes('chiller')) {
    return res.json({
      incidentType: 'Hazard',
      suggestedCategory: 'Electrical Safety',
      potentialConsequence: 'Electric shock, electrocution, or arc flash causing serious bodily injury or fatality.',
      suggestedInitialRisk: 'High',
      immediateAction: 'Work was immediately stopped, area isolated, and 415V sub-board padlocked under LOTO.',
      recommendedFollowUp: 'Formal inspection and insulation resistance testing by a licensed A-grade electrician before returning equipment to service.',
      suggestedCorrectiveAction: 'Inspect electrical installation, replace damaged cabling with high-spec conduit, and verify IP66 weather-proofing controls.',
      contributingFactors: [
        'Damaged or deteriorated cable insulation',
        'Environmental moisture exposure in plant room',
        'Insufficient previous periodic electrical test and tag inspection',
      ],
      disclaimer: 'AI suggestions require review and approval by an authorised person. AI must never automatically approve or close safety records.',
    });
  }

  // General fallback
  return res.json({
    incidentType: d.includes('injury') || d.includes('hurt') ? 'Minor Incident' : 'Near Miss',
    suggestedCategory: d.includes('fall') || d.includes('height') ? 'Working at Heights' : d.includes('lift') ? 'Manual Handling' : 'Operational Safety',
    potentialConsequence: 'Potential worker injury and operational disruption if hazard remains uncontrolled.',
    suggestedInitialRisk: 'Medium',
    immediateAction: 'Work paused, worker attended to, and immediate area made safe.',
    recommendedFollowUp: 'Supervisor to conduct preliminary investigation with involved personnel within 24 hours.',
    suggestedCorrectiveAction: 'Review standard operating procedure, inspect equipment, and brief team at next safety toolbox meeting.',
    contributingFactors: [
      'Inadequate pre-start risk assessment',
      'Equipment condition or environmental factors',
      'Worker fatigue or task urgency',
    ],
    disclaimer: 'AI suggestions require review and approval by an authorised person. AI must never automatically approve or close safety records.',
  });
});

// 4. AUDIT INTELLIGENCE (ISO 45001 readiness analysis)
app.post('/api/audit-prep', async (req, res) => {
  const { auditId = 'AUD-018' } = req.body;
  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `
Prepare an Audit Readiness Summary for upcoming internal audit: ${auditId} (ISO 45001:2018 Occupational Health & Safety Surveillance Audit).
Identify records that may warrant review before the upcoming audit.
Do NOT claim that the organisation is compliant or non-compliant.
Ground your response in the provided records.

Return JSON:
{
  "auditId": "AUD-018",
  "auditTitle": "ISO 45001:2018 Internal Surveillance Audit",
  "standard": "ISO 45001:2018",
  "readinessStatus": "Attention Warranted",
  "executiveBrief": "string",
  "previousFindings": ["string", "string"],
  "recommendedPreparationSteps": ["string", "string", "string", "string"],
  "referencedRecordIds": ["CA-104", "CA-098", "RISK-031", "RISK-008", "TR-221", "TR-222", "PROC-WAH-004", "PROC-ELS-003"]
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_GROUNDING_CONTEXT,
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      if (parsed.auditTitle && parsed.executiveBrief) {
        return res.json(parsed);
      }
    } catch (err: any) {
      console.error('Gemini audit prep error, using grounded template:', err?.message || err);
    }
  }

  // Realistic template for AUD-018
  return res.json({
    auditId: 'AUD-018',
    auditTitle: 'ISO 45001:2018 Occupational Health & Safety - Internal Surveillance Audit',
    standard: 'ISO 45001:2018',
    readinessStatus: 'Attention Warranted',
    executiveBrief: 'Internal surveillance audit AUD-018 is scheduled in 9 days across Sydney Operations and Perth Field Operations. FocusIMS records highlight several items that warrant management review prior to auditor interviews, particularly regarding overdue high-risk corrective actions, expired risk register review cycles, and upcoming technician competency renewals.',
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
    referencedRecordIds: ['CA-104', 'CA-098', 'RISK-031', 'RISK-008', 'TR-221', 'TR-222', 'PROC-WAH-004', 'PROC-ELS-003'],
  });
});

// 5. DOCUMENT INTELLIGENCE (Controlled document Q&A and summary)
app.post('/api/document-qa', async (req, res) => {
  const { docId, question } = req.body;
  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `
Question regarding controlled procedure ${docId}:
"${question}"

Answer specifically based on the controlled document excerpts in your system instructions.
State the exact section and requirements.
Return JSON:
{
  "docId": "${docId}",
  "docTitle": "string",
  "version": "string",
  "answer": "string",
  "keyRequirements": ["string", "string"],
  "sourceNote": "Source: FocusIMS Controlled Document Register"
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_GROUNDING_CONTEXT,
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      if (parsed.answer) {
        return res.json(parsed);
      }
    } catch (err: any) {
      console.error('Gemini document QA error, using grounded answer:', err?.message || err);
    }
  }

  // Grounded response for Working at Heights
  if (docId === 'PROC-WAH-004' || question?.toLowerCase().includes('height')) {
    return res.json({
      docId: 'PROC-WAH-004',
      docTitle: 'Working at Heights Procedure',
      version: '4.2',
      answer: `According to Section 4.1 of PROC-WAH-004 (Working at Heights Procedure, Version 4.2), before commencing any work where a person could fall 2 metres or more, the following requirements must be met:

1. A Safe Work Method Statement (SWMS) must be completed, signed by all workers on the task, and countersigned by the Site Controller.
2. Physical fall prevention devices (e.g. guardrails, edge protection, scaffolding) must be evaluated and prioritised over personal fall arrest.
3. If personal harness systems are used, 100% tie-off is mandatory with twin shock-absorbing lanyards attached to rated anchor points (minimum 15kN capacity).
4. Pre-use physical inspection tags on all harness equipment and inertia reels must be verified.
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
  }

  // Electrical safety procedure fallback
  return res.json({
    docId: 'PROC-ELS-003',
    docTitle: 'Electrical Safety and Isolation Procedure',
    version: '3.1',
    answer: `Under Section 3.2 of PROC-ELS-003 (Electrical Safety and Isolation Procedure, Version 3.1):

1. Live electrical work is strictly prohibited unless an authorised Live Work Permit is approved in writing by the Electrical Safety Manager.
2. Mandatory 4-step isolation: Identify, De-energise, Lockout/Tagout (LOTO) with unique personal padlocks, and Test-Before-Touch with a calibrated instrument.
3. Portable electrical leads and power tools must be inspected and tagged every 3 months under AS/NZS 3760.
4. Exposed conductors found in wet/damp areas require immediate stop-work and 3-metre physical barricading.`,
    keyRequirements: [
      'Strict prohibition of live work without written permit',
      '4-step LOTO and calibrated test-before-touch',
      '3-monthly portable equipment testing (AS/NZS 3760)',
      'Immediate barricading for wet-area conductor hazards',
    ],
    sourceNote: 'Source: FocusIMS Controlled Document PROC-ELS-003 v3.1',
  });
});

// Vite middleware for development or static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FocusIMS AI enterprise server running on http://localhost:${PORT}`);
  });
}

startServer();
