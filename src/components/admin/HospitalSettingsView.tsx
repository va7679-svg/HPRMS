import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHospital } from '../../context/HospitalContext';
import {
  Settings,
  Users,
  Building2,
  Shield,
  Key,
  CheckCircle2,
  Lock,
  Plus,
  Trash2,
  Edit,
  Database,
} from 'lucide-react';
import { UserRole } from '../../types';

export const HospitalSettingsView: React.FC = () => {
  const { currentUser, users } = useAuth();
  const { logAuditEvent, rolePermissions, updateRolePermissions } = useHospital();

  const [activeTab, setActiveTab] = useState<'general' | 'users' | 'rbac' | 'backup'>('general');

  // General settings state
  const [hospitalName, setHospitalName] = useState(() => localStorage.getItem('hprms_setting_name') || 'SRM Medical College Hospital and Research Centre');
  const [tagline, setTagline] = useState(() => localStorage.getItem('hprms_setting_tagline') || 'SRM Institute of Science and Technology • Learn, Leap, Lead');
  const [address, setAddress] = useState(() => localStorage.getItem('hprms_setting_addr') || 'SRM Nagar, Kattankulathur, Chengalpattu District, Tamil Nadu 603203');
  const [phone, setPhone] = useState(() => localStorage.getItem('hprms_setting_phone') || '+1 (555) 019-2834');
  const [emergencyPhone, setEmergencyPhone] = useState(() => localStorage.getItem('hprms_setting_em_phone') || '+1 (555) 911-0000');
  const [autoLockMinutes, setAutoLockMinutes] = useState(() => Number(localStorage.getItem('hprms_setting_lock_mins')) || 15);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('hprms_setting_name', hospitalName);
    localStorage.setItem('hprms_setting_tagline', tagline);
    localStorage.setItem('hprms_setting_addr', address);
    localStorage.setItem('hprms_setting_phone', phone);
    localStorage.setItem('hprms_setting_em_phone', emergencyPhone);
    localStorage.setItem('hprms_setting_lock_mins', String(autoLockMinutes));

    logAuditEvent(
      currentUser.id,
      currentUser.name,
      currentUser.role,
      'UPDATE_SETTINGS',
      'System',
      'hospital-config',
      'Updated hospital organization details and security parameters'
    );

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const roleList: UserRole[] = [
    'super_admin',
    'doctor',
    'nurse',
    'receptionist',
    'lab_tech',
    'pharmacist',
    'patient',
  ];

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-3d">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 border border-blue-500/20 shadow-inner-bevel">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Hospital Administration & System Settings</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Super Admin
                </span>
              </h1>
              <p className="text-xs text-slate-500">
                Institution branding, role-based access matrix (RBAC), user directory, and security policy control
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-3 pt-2 rounded-t-xl shadow-3d-sm">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 rounded-t-lg text-xs font-bold transition border-b-2 whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'general'
              ? 'border-blue-600 text-blue-700 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Hospital Profile & Security</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-t-lg text-xs font-bold transition border-b-2 whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'users'
              ? 'border-blue-600 text-blue-700 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Staff & User Directory ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rbac')}
          className={`px-4 py-2 rounded-t-lg text-xs font-bold transition border-b-2 whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'rbac'
              ? 'border-blue-600 text-blue-700 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>RBAC Permissions Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`px-4 py-2 rounded-t-lg text-xs font-bold transition border-b-2 whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'backup'
              ? 'border-blue-600 text-blue-700 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Data Storage & Backups</span>
        </button>
      </div>

      {/* TAB 1: GENERAL SETTINGS */}
      {activeTab === 'general' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-3d max-w-3xl space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-base font-bold text-slate-900">Institution Demographics & Operational Policies</h3>
            <p className="text-xs text-slate-500">Configure global hospital letterhead, telephone trunks, and security timers</p>
          </div>

          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-bold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Hospital system configuration saved successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveGeneral} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hospital / Medical Center Name</label>
                <input
                  type="text"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Institutional Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Physical Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hospital Switchboard Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Emergency Trauma Hotline</label>
                <input
                  type="text"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 font-bold text-rose-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">HIPAA Auto-Lock Inactivity Timeout</label>
                <select
                  value={autoLockMinutes}
                  onChange={(e) => setAutoLockMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 font-bold focus:outline-none"
                >
                  <option value={5}>5 minutes (High Security / ICU)</option>
                  <option value={15}>15 minutes (Standard Hospital)</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>60 minutes</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-3d-primary btn-3d flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save System Settings</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: STAFF & USERS */}
      {activeTab === 'users' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-3d">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Staff Name</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Username</th>
                  <th className="p-3">Password</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Department / Specialty</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                        {u.name[0]}
                      </div>
                      <span>{u.name}</span>
                    </td>
                    <td className="p-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 uppercase">
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-800">
                      @{u.username || u.role}
                    </td>
                    <td className="p-3 font-mono text-blue-700 font-semibold">
                      {u.password || 'hospital123'}
                    </td>
                    <td className="p-3 font-mono text-slate-600">{u.email}</td>
                    <td className="p-3">{u.specialty || u.department || 'General Staff'}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        ACTIVE
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: RBAC MATRIX */}
      {activeTab === 'rbac' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-3d space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-base font-bold text-slate-900">Role-Based Access Control (RBAC) Security Matrix</h3>
            <p className="text-xs text-slate-500">Fine-grained permission policies enforced across clinical modules</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-center border border-slate-200">
              <thead className="bg-slate-50 text-slate-800 font-bold">
                <tr>
                  <th className="p-3 text-left border-r border-slate-200">Permission Feature</th>
                  {roleList.map((r) => (
                    <th key={r} className="p-3 uppercase text-[10px] border-r border-slate-200">
                      {r.replace('_', ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {[
                  { name: 'View All Patient Records', roles: ['super_admin', 'doctor', 'nurse', 'receptionist'] },
                  { name: 'Register New Patient', roles: ['super_admin', 'doctor', 'receptionist', 'nurse'] },
                  { name: 'Record Vital Signs', roles: ['super_admin', 'doctor', 'nurse'] },
                  { name: 'Author Clinical SOAP Notes', roles: ['super_admin', 'doctor'] },
                  { name: 'Prescribe Pharmacotherapy (e-Rx)', roles: ['super_admin', 'doctor'] },
                  { name: 'Dispense Medications', roles: ['super_admin', 'pharmacist'] },
                  { name: 'Order Diagnostic Labs', roles: ['super_admin', 'doctor'] },
                  { name: 'Enter Lab Results', roles: ['super_admin', 'lab_tech', 'doctor'] },
                  { name: 'Admit & Discharge Inpatients', roles: ['super_admin', 'doctor', 'nurse'] },
                  { name: 'Manage Bed Status', roles: ['super_admin', 'doctor', 'nurse', 'receptionist'] },
                  { name: 'Schedule Appointments', roles: ['super_admin', 'doctor', 'receptionist', 'nurse', 'patient'] },
                  { name: 'View HIPAA Audit Trail', roles: ['super_admin'] },
                  { name: 'Manage Hospital Settings', roles: ['super_admin'] },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-2.5 text-left font-semibold text-slate-900 border-r border-slate-200">
                      {row.name}
                    </td>
                    {roleList.map((r) => (
                      <td key={r} className="p-2.5 border-r border-slate-200">
                        {row.roles.includes(r) ? (
                          <span className="inline-block w-4 h-4 rounded-full bg-emerald-500 text-white font-bold leading-4 text-[10px]">
                            ✓
                          </span>
                        ) : (
                          <span className="text-slate-300 font-bold">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: BACKUP */}
      {activeTab === 'backup' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-3d max-w-2xl space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-base font-bold text-slate-900">Database Storage & Snapshot Backups</h3>
            <p className="text-xs text-slate-500">Secure automated local snapshot export and cloud backup sync</p>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-2">
            <div className="font-bold flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-600" />
              <span>Full Hospital State Snapshot Active</span>
            </div>
            <p className="text-blue-800/90 leading-relaxed">
              All clinical tables (Patients, Vitals, Consultations, e-Prescriptions, Lab Orders, Inpatient Admissions, Bed Matrix, and Audit Trail) are encrypted in browser local storage and state repository.
            </p>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => {
                const data = {
                  hospitalName,
                  timestamp: new Date().toISOString(),
                  patients: localStorage.getItem('hprms_patients'),
                  vitals: localStorage.getItem('hprms_vitals'),
                  admissions: localStorage.getItem('hprms_admissions'),
                };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `hprms_backup_${new Date().toISOString().split('T')[0]}.json`;
                a.click();
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-3d-primary btn-3d cursor-pointer"
            >
              Export JSON Backup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
