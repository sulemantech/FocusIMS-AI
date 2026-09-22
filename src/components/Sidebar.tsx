import React from 'react';
import {
  LayoutDashboard,
  BrainCircuit,
  FileCheck,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  Files,
  Sparkles,
} from 'lucide-react';

export type NavTab =
  | 'overview'
  | 'chat'
  | 'management-review'
  | 'incidents'
  | 'risks'
  | 'corrective-actions'
  | 'audits'
  | 'training'
  | 'documents';

interface SidebarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ElementType;
  hasAi: boolean;
  count?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange }) => {
  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, hasAi: false },
    { id: 'chat', label: 'AI Intelligence', icon: BrainCircuit, hasAi: true },
    { id: 'management-review', label: 'Management Review', icon: FileCheck, hasAi: true },
    { id: 'incidents', label: 'Incidents & Hazards', icon: AlertTriangle, hasAi: true, count: 10 },
    { id: 'risks', label: 'Risks', icon: ShieldAlert, hasAi: true, count: 8 },
    { id: 'corrective-actions', label: 'Corrective Actions', icon: CheckCircle2, hasAi: true, count: 12 },
    { id: 'audits', label: 'Audits', icon: ClipboardList, hasAi: true, count: 5 },
    { id: 'training', label: 'Training & Compliance', icon: GraduationCap, hasAi: true, count: 12 },
    { id: 'documents', label: 'Documents', icon: Files, hasAi: true, count: 8 },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 h-[calc(100vh-65px)] border-r border-slate-800">
      {/* Navigation menu */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Management System
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-teal-400' : 'text-slate-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {item.hasAi && (
                  <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold tracking-tight bg-teal-500/15 text-teal-300 border border-teal-500/30">
                    <Sparkles className="w-2.5 h-2.5 mr-0.5" />
                    AI
                  </span>
                )}
                {item.count !== undefined && !item.hasAi && (
                  <span className="text-[11px] text-slate-500 font-medium">
                    {item.count}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer environment notice */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-2 h-2 rounded-full bg-teal-400"></div>
          <p className="text-xs font-semibold text-slate-200">AI Demo Environment</p>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Synthetic demonstration data
        </p>
        <p className="text-[10px] text-slate-500 mt-1">
          Grounding: 10 Incidents • 8 Risks • 12 Actions
        </p>
      </div>
    </aside>
  );
};
