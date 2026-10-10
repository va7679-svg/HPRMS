import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHospital } from '../../context/HospitalContext';
import {
  ShieldCheck,
  Search,
  Filter,
  FileText,
  Lock,
  User,
  Clock,
  Download,
  AlertCircle,
  Eye,
  Activity,
} from 'lucide-react';
import { AuditLog } from '../../types';

export const AuditLogsView: React.FC = () => {
  const { currentUser } = useAuth();
  const { auditLogs } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [actionFilter, setActionFilter] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesRole = roleFilter === 'ALL' || log.userRole === roleFilter;
    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
    const matchesSearch =
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.patientIdentifier && log.patientIdentifier.toLowerCase().includes(searchQuery.toLowerCase())) ||
      log.ipAddress.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesRole && matchesAction && matchesSearch;
  });

  const exportAuditTrail = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Timestamp,User,Role,Action,Resource,Details,IP Address']
        .concat(
          filteredLogs.map(
            (l) =>
              `"${l.timestamp}","${l.userName}","${l.userRole}","${l.action}","${l.resourceType}","${l.details}","${l.ipAddress}"`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hprms_hipaa_audit_trail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-3d">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 border border-blue-500/20 shadow-inner-bevel">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>HIPAA & Security Audit Trail Log</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Tamper-Evident ePHI Ledger
                </span>
              </h1>
              <p className="text-xs text-slate-500">
                Immutable chronological log of all patient chart accesses, e-Rx issuances, admissions, and role activity
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={exportAuditTrail}
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold shadow-3d-sm btn-3d flex items-center gap-1.5 shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Compliance CSV</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-3d grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search user, action, patient MRN, IP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none"
          >
            <option value="ALL">All User Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="doctor">Doctor / Physician</option>
            <option value="nurse">Nurse / Clinical Care</option>
            <option value="receptionist">Receptionist / Admissions</option>
            <option value="pharmacist">Pharmacist</option>
            <option value="lab_technician">Laboratory Technician</option>
            <option value="patient">Patient Portal</option>
          </select>
        </div>

        <div>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none"
          >
            <option value="ALL">All Event Types</option>
            <option value="VIEW_PATIENT_RECORD">View Patient Record</option>
            <option value="REGISTER_PATIENT">Register Patient</option>
            <option value="RECORD_VITALS">Record Vitals</option>
            <option value="CREATE_CONSULTATION">Create SOAP Consultation</option>
            <option value="PRESCRIBE_MEDICATION">Prescribe Medication</option>
            <option value="DISPENSE_MEDICATION">Dispense Medication</option>
            <option value="ORDER_LAB_TEST">Order Diagnostic Lab</option>
            <option value="COMPLETE_LAB_TEST">Complete Lab Test</option>
            <option value="ADMIT_PATIENT">Admit Patient</option>
            <option value="DISCHARGE_PATIENT">Discharge Patient</option>
            <option value="USER_LOGIN">User Sign In</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table with 3D Depth */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-3d">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">User & Identity</th>
                <th className="p-3">Role</th>
                <th className="p-3">Action Type</th>
                <th className="p-3">Target Resource</th>
                <th className="p-3">Event Audit Details</th>
                <th className="p-3">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition font-sans">
                  <td className="p-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-3 font-bold text-slate-900">{log.userName}</td>
                  <td className="p-3">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {log.userRole.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-[11px] font-bold text-blue-700">{log.action}</td>
                  <td className="p-3">
                    <span className="text-[11px] text-slate-600">
                      {log.resourceType} {log.patientIdentifier ? `(${log.patientIdentifier})` : ''}
                    </span>
                  </td>
                  <td className="p-3 text-slate-800 font-medium">{log.details}</td>
                  <td className="p-3 font-mono text-[11px] text-slate-400">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
