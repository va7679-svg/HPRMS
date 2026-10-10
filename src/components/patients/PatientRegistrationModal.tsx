import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHospital } from '../../context/HospitalContext';
import { X, UserPlus, Plus, Trash2, CheckCircle2, Shield } from 'lucide-react';
import { Allergy, BloodGroup, Gender } from '../../types';

interface PatientRegistrationModalProps {
  onClose: () => void;
}

export const PatientRegistrationModal: React.FC<PatientRegistrationModalProps> = ({ onClose }) => {
  const { currentUser, users } = useAuth();
  const { addPatient, logAuditEvent } = useHospital();

  const doctors = users.filter((u) => u.role === 'doctor');

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('1988-04-12');
  const [gender, setGender] = useState<Gender>('Male');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [phone, setPhone] = useState('(555) 342-9102');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('742 Evergreen Terrace, Springfield');
  const [assignedDoctorId, setAssignedDoctorId] = useState(doctors[0]?.id || 'doc-1');

  // Insurance & Emergency
  const [insuranceProvider, setInsuranceProvider] = useState('Blue Cross Blue Shield');
  const [insurancePolicyNumber, setInsurancePolicyNumber] = useState('BCBS-9948271');
  const [emergencyName, setEmergencyName] = useState('Jane Doe');
  const [emergencyPhone, setEmergencyPhone] = useState('(555) 987-6543');
  const [emergencyRelation, setEmergencyRelation] = useState('Spouse');

  // Chronic & Allergies
  const [chronicConditions, setChronicConditions] = useState<string[]>(['Hypertension']);
  const [newCondition, setNewCondition] = useState('');
  const [allergies, setAllergies] = useState<Allergy[]>([
    {
      id: 'alg-1',
      substance: 'Penicillin',
      severity: 'Severe',
      reaction: 'Anaphylaxis & urticaria',
      diagnosedDate: '2020-03-15',
    },
  ]);
  const [newAllergySubstance, setNewAllergySubstance] = useState('');
  const [newAllergySeverity, setNewAllergySeverity] = useState<Allergy['severity']>('Moderate');
  const [newAllergyReaction, setNewAllergyReaction] = useState('');

  const handleAddCondition = () => {
    if (!newCondition.trim()) return;
    if (!chronicConditions.includes(newCondition.trim())) {
      setChronicConditions([...chronicConditions, newCondition.trim()]);
    }
    setNewCondition('');
  };

  const handleRemoveCondition = (condition: string) => {
    setChronicConditions(chronicConditions.filter((c) => c !== condition));
  };

  const handleAddAllergy = () => {
    if (!newAllergySubstance.trim()) return;
    setAllergies([
      ...allergies,
      {
        id: `alg-${Date.now()}-${Math.random()}`,
        substance: newAllergySubstance.trim(),
        severity: newAllergySeverity,
        reaction: newAllergyReaction.trim() || 'Hives / skin rash',
        diagnosedDate: new Date().toISOString().split('T')[0],
      },
    ]);
    setNewAllergySubstance('');
    setNewAllergyReaction('');
  };

  const handleRemoveAllergy = (id: string) => {
    setAllergies(allergies.filter((a) => a.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
      return;
    }

    const assignedDoc = doctors.find((d) => d.id === assignedDoctorId) || doctors[0];

    const newPatient = addPatient({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      dateOfBirth,
      gender,
      bloodGroup,
      phone: phone.trim(),
      email: email.trim() || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      address: address.trim(),
      emergencyContact: {
        name: emergencyName.trim(),
        relationship: emergencyRelation.trim(),
        phone: emergencyPhone.trim(),
      },
      insurance: {
        provider: insuranceProvider.trim(),
        policyNumber: insurancePolicyNumber.trim(),
      },
      status: 'Outpatient',
      primaryDoctorId: assignedDoc?.id || 'doc-1',
      primaryDoctorName: assignedDoc?.name || 'Dr. Eleanor Vance, MD',
      assignedDoctorName: assignedDoc?.name || 'Dr. Eleanor Vance, MD',
      allergies,
      chronicConditions,
      pastSurgeries: [],
      familyHistory: [],
    });

    logAuditEvent(
      currentUser.id,
      currentUser.name,
      currentUser.role,
      'REGISTER_PATIENT',
      'Patient',
      newPatient.id,
      `Registered new patient ${newPatient.firstName} ${newPatient.lastName} with MRN ${newPatient.patientId}`,
      `${newPatient.patientId} (${newPatient.firstName[0]}.${newPatient.lastName[0]}.)`
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-xl max-w-3xl w-full p-6 shadow-3d-lg space-y-4 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 shadow-inner-bevel">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">New Patient Digital Intake & EMR Creation</h3>
              <p className="text-xs text-slate-500">Demographics, insurance verification, allergy profiling & attending doctor assignment</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1 pr-1">
          {/* Section 1: Demographics */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span> 1. Personal Demographics
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. John"
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Doe"
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Date of Birth *</label>
                <input
                  type="date"
                  required
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Biological Gender *</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Blood Group *</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none"
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Assigned Physician *</label>
                <select
                  value={assignedDoctorId}
                  onChange={(e) => setAssignedDoctorId(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.specialty || d.department})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patient@example.com"
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Residential Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Insurance & Emergency */}
          <div className="pt-2 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span> 2. Emergency Contact & Insurance
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Emergency Contact Name</label>
                <input
                  type="text"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Relationship</label>
                <input
                  type="text"
                  value={emergencyRelation}
                  onChange={(e) => setEmergencyRelation(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Emergency Phone</label>
                <input
                  type="text"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Insurance Carrier</label>
                <input
                  type="text"
                  value={insuranceProvider}
                  onChange={(e) => setInsuranceProvider(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Policy / Member ID</label>
                <input
                  type="text"
                  value={insurancePolicyNumber}
                  onChange={(e) => setInsurancePolicyNumber(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Allergies & Conditions */}
          <div className="pt-2 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-600"></span> 3. Allergies & Chronic Conditions
            </h4>

            {/* Existing Allergies */}
            <div className="space-y-2 mb-3">
              <div className="flex flex-wrap gap-2">
                {allergies.map((a) => (
                  <span
                    key={a.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold shadow-3d-sm"
                  >
                    <span>{a.substance} ({a.severity})</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAllergy(a.id)}
                      className="text-rose-500 hover:text-rose-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Allergy (e.g. Latex, Penicillin)"
                  value={newAllergySubstance}
                  onChange={(e) => setNewAllergySubstance(e.target.value)}
                  className="flex-1 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
                <select
                  value={newAllergySeverity}
                  onChange={(e) => setNewAllergySeverity(e.target.value as any)}
                  className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                  <option value="Life-threatening">Life-threatening</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddAllergy}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold shadow-3d-sm flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Chronic Conditions */}
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {chronicConditions.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold shadow-3d-sm"
                  >
                    <span>{c}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCondition(c)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Chronic Condition (e.g. Type 2 Diabetes)"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  className="flex-1 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddCondition}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold shadow-3d-sm flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-3d-primary btn-3d flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Create Patient EMR</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
