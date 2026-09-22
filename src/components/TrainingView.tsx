import React, { useState } from 'react';
import { EmployeeTrainingRecord, AustralianSite } from '../types';
import {
  GraduationCap,
  Sparkles,
  Clock,
  Filter,
  Search,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';

interface TrainingViewProps {
  training: EmployeeTrainingRecord[];
  currentSite: AustralianSite;
  onOpenRecord: (id: string) => void;
}

export const TrainingView: React.FC<TrainingViewProps> = ({
  training,
  currentSite,
  onOpenRecord,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAiGapAnalysis, setShowAiGapAnalysis] = useState(true);

  const filtered = training.filter((t) => {
    const matchesSite = currentSite === 'All Sites' || t.site === currentSite;
    const matchesSearch =
      t.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.certification.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSite && matchesSearch;
  });

  const expiringCount = training.filter((t) => t.status === 'Expiring Soon').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Training & Competency Matrix
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              {filtered.length} Qualifications
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Tracking high-risk work licences, RTO accreditations, and regulatory refresher cycles.
          </p>
        </div>

        <button
          onClick={() => setShowAiGapAnalysis(!showAiGapAnalysis)}
          className="px-3.5 py-2 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold text-xs border border-teal-200 transition shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{showAiGapAnalysis ? 'Hide AI Gap Analysis' : 'Analyse Training Gaps'}</span>
        </button>
      </div>

      {/* AI Training Gap Analysis Panel */}
      {showAiGapAnalysis && (
        <div className="p-5 rounded-xl border border-teal-200 bg-teal-50/40 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-teal-600 text-white">
                <GraduationCap className="w-3.5 h-3.5" />
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                AI Competency & Licence Gap Analysis
              </h3>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
              {expiringCount} Certifications Expiring &lt;30 Days
            </span>
          </div>

          <p className="text-xs text-slate-800 leading-relaxed font-medium">
            <strong>6 employee certifications require attention within the next 30 days.</strong> Four technicians across Sydney Operations, Perth Field Operations, and Brisbane hold{' '}
            <span className="text-slate-900 font-bold">Working at Heights (RIIWHS204E)</span> credentials expiring within 22 days (
            <button
              onClick={() => onOpenRecord('TR-221')}
              className="font-mono text-teal-900 font-bold underline"
            >
              TR-221
            </button>
            ,{' '}
            <button
              onClick={() => onOpenRecord('TR-222')}
              className="font-mono text-teal-900 font-bold underline"
            >
              TR-222
            </button>
            ,{' '}
            <button
              onClick={() => onOpenRecord('TR-223')}
              className="font-mono text-teal-900 font-bold underline"
            >
              TR-223
            </button>
            ,{' '}
            <button
              onClick={() => onOpenRecord('TR-224')}
              className="font-mono text-teal-900 font-bold underline"
            >
              TR-224
            </button>
            ).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-white rounded-lg border border-teal-200/80 text-xs space-y-1">
              <span className="font-bold text-slate-900">Operational Continuity Risk:</span>
              <p className="text-slate-600 leading-relaxed">
                If Liam O’Connor (TR-221, expires 03 Oct) is not recertified within 11 days, field scaffolding tasks in Sydney will trigger automatic Stop Work conditions under <strong>PROC-WAH-004</strong>.
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg border border-teal-200/80 text-xs space-y-1">
              <span className="font-bold text-slate-900">Immediate Warehouse Action:</span>
              <p className="text-slate-600 leading-relaxed">
                Bradley Scott (TR-225) Forklift licence (TLILIC0003) expires in <strong>7 days</strong> (29 Sep 2026). Renewal application must be lodged with WorkSafe Victoria before Friday.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-xs flex items-center gap-2 text-xs">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by employee name, unit code, or certification..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent focus:outline-none text-slate-800 placeholder:text-slate-400"
        />
      </div>

      {/* Training Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Record ID</th>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Site</th>
                <th className="py-3 px-4">Accreditation / Certification</th>
                <th className="py-3 px-3">Expiry Date</th>
                <th className="py-3 px-3">Days Left</th>
                <th className="py-3 px-3">Compliance Status</th>
                <th className="py-3 px-3 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => onOpenRecord(t.id)}
                  className="hover:bg-slate-50/80 transition cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 group-hover:text-teal-700 whitespace-nowrap">
                    {t.id}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                    {t.employeeName}
                  </td>
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{t.role}</td>
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{t.site}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    <div>{t.certification}</div>
                    {t.code && <div className="text-[10px] font-mono text-slate-400">{t.code}</div>}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap text-slate-700 font-medium">
                    {t.expiryDate}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap font-bold">
                    <span
                      className={
                        t.daysRemaining <= 14
                          ? 'text-rose-700'
                          : t.daysRemaining <= 30
                          ? 'text-amber-700'
                          : 'text-slate-600'
                      }
                    >
                      {t.daysRemaining} days
                    </span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                        t.status === 'Expiring Soon'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenRecord(t.id);
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
