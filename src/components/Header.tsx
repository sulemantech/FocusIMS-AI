import React from 'react';
import { AustralianSite } from '../types';
import { Building2, MapPin, Sparkles, Bell, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  currentSite: AustralianSite;
  onSiteChange: (site: AustralianSite) => void;
  currentOrg: string;
  onOrgChange: (org: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentSite,
  onSiteChange,
  currentOrg,
  onOrgChange,
}) => {
  const sites: AustralianSite[] = [
    'All Sites',
    'Sydney Operations',
    'Melbourne Warehouse',
    'Brisbane Service Centre',
    'Perth Field Operations',
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-slate-900 text-teal-400 flex items-center justify-center font-bold text-lg tracking-tight shadow-sm border border-slate-800">
            F<span className="text-teal-300 font-extrabold">I</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-slate-900 tracking-tight">FocusIMS</span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                <Sparkles className="w-2.5 h-2.5" />
                AI
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              From compliance data to actionable intelligence.
            </p>
          </div>
        </div>

        {/* Enterprise Context Selectors */}
        <div className="flex items-center gap-3">
          {/* Organisation selector */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-xs">
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-500 font-medium">Organisation:</span>
            <select
              id="org-selector"
              aria-label="Select Organisation"
              value={currentOrg}
              onChange={(e) => onOrgChange(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="Acme Facilities Australia">Acme Facilities Australia</option>
              <option value="Acme Infrastructure Group">Acme Infrastructure Group</option>
            </select>
          </div>

          {/* Site Selector */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-xs">
            <MapPin className="w-3.5 h-3.5 text-teal-600" />
            <span className="text-slate-500 font-medium">Site:</span>
            <select
              id="site-selector"
              aria-label="Select Site"
              value={currentSite}
              onChange={(e) => onSiteChange(e.target.value as AustralianSite)}
              className="bg-transparent font-semibold text-slate-900 focus:outline-none cursor-pointer"
            >
              {sites.map((site) => (
                <option key={site} value={site}>
                  {site}
                </option>
              ))}
            </select>
          </div>

          {/* Subtle AI Demo Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
            AI DEMO
          </div>

          {/* User profile / System status */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <button
              id="notifications-button"
              aria-label="System Notifications"
              className="p-1.5 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500"></span>
            </button>
            <div className="hidden sm:flex items-center gap-2 pl-2">
              <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold">
                ER
              </div>
              <div className="text-left text-xs leading-tight hidden xl:block">
                <p className="font-semibold text-slate-800">Elena Rostova</p>
                <p className="text-[10px] text-slate-500">HSEQ Director</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
