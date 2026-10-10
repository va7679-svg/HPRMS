import React, { useState } from 'react';
import {
  AlertTriangle,
  Sparkles,
  Scale,
  TrendingUp,
  ShieldCheck,
  Cpu,
  Layers,
  FileSpreadsheet,
  Zap,
  Lock,
  Server,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { ProblemsDiagnosticMatrix } from './ProblemsDiagnosticMatrix';
import { InnovationsShowcase } from './InnovationsShowcase';
import { AdvantagesDisadvantagesView } from './AdvantagesDisadvantagesView';
import { ImprovementsActionCenter } from './ImprovementsActionCenter';
import { SecurityComplianceCenter } from './SecurityComplianceCenter';

export const SystemInnovationsHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'problems' | 'innovations' | 'advantages' | 'improvements' | 'security'>('problems');

  const mainTabs = [
    {
      id: 'problems',
      number: '1',
      label: 'Problems in Existing Systems',
      subtitle: 'Data, Access, Security & Tech Flaws',
      icon: AlertTriangle,
      color: 'rose',
    },
    {
      id: 'innovations',
      number: '2',
      label: 'New Innovations (12)',
      subtitle: 'EHR, AI, Blockchain, IoT & FHIR',
      icon: Sparkles,
      color: 'blue',
    },
    {
      id: 'advantages',
      number: '3',
      label: 'Advantages & Trade-offs',
      subtitle: 'Clinical ROI & Risk Mitigations',
      icon: Scale,
      color: 'indigo',
    },
    {
      id: 'improvements',
      number: '4',
      label: 'System Improvements',
      subtitle: 'ABHA ID, Offline Sync & Recovery',
      icon: TrendingUp,
      color: 'teal',
    },
    {
      id: 'security',
      number: '5',
      label: 'Security & Compliance',
      subtitle: 'RBAC, MFA, Encryption & Privacy',
      icon: ShieldCheck,
      color: 'emerald',
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Main Navigation Bar for the 5 User Modules */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between card-3d-lift ${
                isActive
                  ? 'bg-white border-blue-500 shadow-3d-primary ring-2 ring-blue-500/20'
                  : 'bg-white/80 hover:bg-white border-slate-200 text-slate-700 shadow-3d'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span
                  className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center ${
                    isActive ? 'bg-blue-600 text-white shadow-3d-primary' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.number}
                </span>
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              </div>
              <div>
                <div className={`text-xs font-black truncate ${isActive ? 'text-blue-900' : 'text-slate-900'}`}>
                  {tab.label}
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">
                  {tab.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Tab Render */}
      <div>
        {activeTab === 'problems' && <ProblemsDiagnosticMatrix />}
        {activeTab === 'innovations' && <InnovationsShowcase />}
        {activeTab === 'advantages' && <AdvantagesDisadvantagesView />}
        {activeTab === 'improvements' && <ImprovementsActionCenter />}
        {activeTab === 'security' && <SecurityComplianceCenter />}
      </div>

    </div>
  );
};
