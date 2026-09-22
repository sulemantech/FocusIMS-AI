import React, { useState } from 'react';
import { AustralianSite } from './types';
import {
  SYNTHETIC_INCIDENTS,
  SYNTHETIC_RISKS,
  SYNTHETIC_CORRECTIVE_ACTIONS,
  SYNTHETIC_TRAINING,
  SYNTHETIC_AUDITS,
  SYNTHETIC_DOCUMENTS,
} from './data/imsData';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { RecordDrawer } from './components/RecordDrawer';
import { OverviewView } from './components/OverviewView';
import { AskFocusIMSView } from './components/AskFocusIMSView';
import { ManagementReviewView } from './components/ManagementReviewView';
import { IncidentAssistantView } from './components/IncidentAssistantView';
import { IncidentsView } from './components/IncidentsView';
import { RisksView } from './components/RisksView';
import { CorrectiveActionsView } from './components/CorrectiveActionsView';
import { TrainingView } from './components/TrainingView';
import { AuditsView } from './components/AuditsView';
import { DocumentsView } from './components/DocumentsView';
import { ShieldCheck, Sparkles, Building2 } from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [currentSite, setCurrentSite] = useState<AustralianSite>('All Sites');
  const [currentOrg, setCurrentOrg] = useState('Acme Facilities Australia');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  // Sub-view toggle for incidents view (register vs AI assistant)
  const [incidentViewMode, setIncidentViewMode] = useState<'register' | 'assistant'>('register');

  const handleOpenRecord = (id: string) => {
    setSelectedRecordId(id);
  };

  const handleCloseRecord = () => {
    setSelectedRecordId(null);
  };

  const handleNavigateTab = (tab: NavTab) => {
    setCurrentTab(tab);
    if (tab === 'incidents') {
      setIncidentViewMode('register');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-teal-100 selection:text-teal-900">
      {/* Top Application Header */}
      <Header
        currentSite={currentSite}
        onSiteChange={setCurrentSite}
        currentOrg={currentOrg}
        onOrgChange={setCurrentOrg}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar currentTab={currentTab} onTabChange={handleNavigateTab} />

        {/* Content View Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-100/70">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* OVERVIEW VIEW */}
            {currentTab === 'overview' && (
              <OverviewView
                onNavigateTab={handleNavigateTab}
                onOpenRecord={handleOpenRecord}
              />
            )}

            {/* ASK FOCUSIMS / AI INTELLIGENCE */}
            {currentTab === 'chat' && (
              <AskFocusIMSView
                currentSite={currentSite}
                onOpenRecord={handleOpenRecord}
              />
            )}

            {/* AI MANAGEMENT REVIEW */}
            {currentTab === 'management-review' && (
              <ManagementReviewView
                currentSite={currentSite}
                onOpenRecord={handleOpenRecord}
              />
            )}

            {/* INCIDENTS & HAZARDS (WITH TOGGLE TO AI ASSISTANT) */}
            {currentTab === 'incidents' && (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <button
                    onClick={() => setIncidentViewMode('register')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      incidentViewMode === 'register'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Incidents Register (10)
                  </button>
                  <button
                    onClick={() => setIncidentViewMode('assistant')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                      incidentViewMode === 'assistant'
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-white text-teal-800 border border-teal-200 hover:bg-teal-50'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Incident Assistant</span>
                  </button>
                </div>

                {incidentViewMode === 'register' ? (
                  <IncidentsView
                    incidents={SYNTHETIC_INCIDENTS}
                    currentSite={currentSite}
                    onOpenRecord={handleOpenRecord}
                    onNavigateToAssistant={() => setIncidentViewMode('assistant')}
                  />
                ) : (
                  <IncidentAssistantView
                    onOpenRecord={handleOpenRecord}
                  />
                )}
              </>
            )}

            {/* RISKS */}
            {currentTab === 'risks' && (
              <RisksView
                risks={SYNTHETIC_RISKS}
                currentSite={currentSite}
                onOpenRecord={handleOpenRecord}
              />
            )}

            {/* CORRECTIVE ACTIONS */}
            {currentTab === 'corrective-actions' && (
              <CorrectiveActionsView
                actions={SYNTHETIC_CORRECTIVE_ACTIONS}
                currentSite={currentSite}
                onOpenRecord={handleOpenRecord}
              />
            )}

            {/* AUDITS */}
            {currentTab === 'audits' && (
              <AuditsView
                audits={SYNTHETIC_AUDITS}
                currentSite={currentSite}
                onOpenRecord={handleOpenRecord}
              />
            )}

            {/* TRAINING */}
            {currentTab === 'training' && (
              <TrainingView
                training={SYNTHETIC_TRAINING}
                currentSite={currentSite}
                onOpenRecord={handleOpenRecord}
              />
            )}

            {/* DOCUMENTS */}
            {currentTab === 'documents' && (
              <DocumentsView
                documents={SYNTHETIC_DOCUMENTS}
                onOpenRecord={handleOpenRecord}
              />
            )}
          </div>
        </main>
      </div>

      {/* Global Slide-Out Record Details Drawer */}
      <RecordDrawer
        recordId={selectedRecordId}
        onClose={handleCloseRecord}
        onSelectRecord={handleOpenRecord}
        incidents={SYNTHETIC_INCIDENTS}
        risks={SYNTHETIC_RISKS}
        actions={SYNTHETIC_CORRECTIVE_ACTIONS}
        training={SYNTHETIC_TRAINING}
        audits={SYNTHETIC_AUDITS}
        documents={SYNTHETIC_DOCUMENTS}
      />

      {/* Global Footer Banner */}
      <footer className="bg-white border-t border-slate-200 px-6 py-2.5 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 z-20">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="font-semibold text-slate-700">FocusIMS AI v2.4</span>
          <span>•</span>
          <span>Integrated Management System Intelligence Layer</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            ISO 9001 / ISO 14001 / ISO 45001 Governed
          </span>
          <span>•</span>
          <span className="text-slate-500">Acme Facilities Australia Demo</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
