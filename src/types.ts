export type UserRole =
  | 'super_admin'
  | 'doctor'
  | 'nurse'
  | 'receptionist'
  | 'lab_tech'
  | 'pharmacist'
  | 'patient';

export interface User {
  id: string;
  name: string;
  username?: string;
  password?: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  department?: string;
  specialty?: string;
  phone?: string;
  isActive: boolean;
  twoFactorEnabled?: boolean;
  associatedPatientId?: string; // If role is patient
  licenseNumber?: string;
  isGoogleAuth?: boolean;
  googleEmail?: string;
}

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type AllergySeverity = 'Mild' | 'Moderate' | 'Severe' | 'Life-threatening';

export interface Allergy {
  id: string;
  substance: string; // e.g. Penicillin, Peanuts, Latex, Aspirin
  reaction: string; // e.g. Anaphylaxis, Rash, Bronchospasm
  severity: AllergySeverity;
  diagnosedDate?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  expiryDate?: string;
  coverageType?: string;
}

export interface PatientDemographics {
  id: string; // Internal UUID
  patientId: string; // Format: HPR-2026-XXXX
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address: string;
  bloodGroup: BloodGroup;
  nationalIdMasked?: string;
  emergencyContact: EmergencyContact;
  allergies: Allergy[];
  chronicConditions: string[];
  pastSurgeries: string[];
  familyHistory: string[];
  insurance: InsuranceInfo;
  registeredDate: string;
  status: 'Active' | 'Inpatient' | 'Outpatient' | 'Emergency' | 'Discharged' | 'Deceased';
  primaryDoctorId?: string;
  primaryDoctorName?: string;
  assignedDoctorName?: string;
  currentWard?: string;
  currentBed?: string;
}

export type Patient = PatientDemographics;
export type PatientStatus = 'Active' | 'Inpatient' | 'Outpatient' | 'Emergency' | 'Discharged' | 'Deceased';
export type Gender = 'Male' | 'Female' | 'Other';

export interface VitalSignRecord {
  id: string;
  patientId: string;
  recordedAt: string;
  recordedBy: string;
  recordedByRole: string;
  heartRateBpm: number; // Normal 60-100
  bloodPressureSystolic: number; // Normal 90-120
  bloodPressureDiastolic: number; // Normal 60-80
  temperatureF: number; // Normal 97.8 - 99.1
  respiratoryRate: number; // Normal 12-20
  oxygenSaturationPercent: number; // Normal 95-100
  bloodGlucoseMgDl?: number; // Normal 70-99 fasting, <140 post-prandial
  painScore: number; // 0 - 10
  notes?: string;
}

export interface ConsultationNote {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  date?: string;
  consultationDate?: string;
  chiefComplaint: string;
  subjective: string; // SOAP: S
  objective: string; // SOAP: O
  assessment: string; // SOAP: A
  plan: string; // SOAP: P
  diagnoses: Diagnosis[];
  followUpDate?: string;
}

export interface Diagnosis {
  id: string;
  patientId: string;
  icd10Code: string; // e.g. I10 (Essential Hypertension)
  description: string;
  type: 'Primary' | 'Secondary' | 'Chronic' | 'Differential';
  diagnosedDate: string;
  diagnosedByDoctor: string;
  status: 'Active' | 'Resolved' | 'Under Investigation';
  notes?: string;
}

export interface PrescriptionItem {
  id: string;
  medicationName: string;
  genericName?: string;
  dosage: string; // e.g. 500mg
  frequency: string; // e.g. BID (Twice daily), TID, QID, PRN (As needed)
  route: 'Oral' | 'IV' | 'IM' | 'Topical' | 'Inhalation' | 'Sublingual';
  durationDays: number;
  quantity: number;
  instructions: string; // e.g. Take after meals
  refillsAllowed: number;
  dispensedStatus: 'Pending' | 'Dispensed' | 'Partially Dispensed' | 'Cancelled';
  dispensedDate?: string;
  dispensedByPharmacist?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  prescriptionNumber: string; // e.g. RX-2026-0912
  doctorId: string;
  doctorName: string;
  doctorLicense?: string;
  prescribedDate: string;
  diagnosisId?: string;
  diagnosisText?: string;
  items: PrescriptionItem[];
  overallStatus: 'Active' | 'Fulfilled' | 'Cancelled' | 'Expired';
  pharmacyNotes?: string;
}

export type LabTestStatus = 'Ordered' | 'Sample Collected' | 'Processing' | 'In-Progress' | 'Completed' | 'Verified' | 'Cancelled';
export type LabPriority = 'Routine' | 'Urgent' | 'STAT (Emergency)';

export interface LabTestParameter {
  parameterName?: string;
  name?: string;
  measuredValue?: string | number;
  value?: string | number;
  unit: string;
  referenceRange: string;
  isAbnormal?: boolean;
  flag?: 'Normal' | 'High' | 'Low' | 'Critical High' | 'Critical Low';
  criticalFlag?: 'High' | 'Low' | 'Critical High' | 'Critical Low';
}

export type LabTestResult = LabTestParameter;

export interface LabOrder {
  id: string;
  orderNumber: string; // e.g. LAB-2026-4401
  patientId: string;
  doctorId: string;
  doctorName: string;
  department: string;
  testCategory: 'Hematology' | 'Biochemistry' | 'Microbiology' | 'Cardiology' | 'Radiology / Imaging' | 'Urinalysis' | 'Immunology' | string;
  testName: string;
  orderDate?: string;
  orderedDate?: string;
  priority: LabPriority;
  clinicalIndication: string;
  status: LabTestStatus;
  sampleCollectedAt?: string;
  sampleType?: string; // e.g. Whole Blood, Serum, Plasma, Urine, Sputum
  results?: LabTestParameter[];
  technicianNotes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  reportSummary?: string;
}

export interface InpatientAdmission {
  id: string;
  admissionNumber?: string; // e.g. ADM-2026-118
  patientId: string;
  patientName?: string;
  admissionDate?: string;
  admittedDate?: string;
  admittingDoctorId?: string;
  admittingDoctorName: string;
  ward: string; // e.g. "Cardiology Care Unit (CCU)", "Ward 4B", "ICU"
  bedNumber: string; // e.g. "Bed 104"
  reasonForAdmission: string;
  initialDiagnosis: string;
  status: 'Admitted' | 'Discharged' | 'Transferred';
  dischargeDate?: string;
  dischargeCondition?: 'Improved' | 'Stable' | 'Recovered' | 'Transferred' | 'Against Medical Advice';
  dischargeSummary?: {
    finalDiagnosis: string;
    courseInHospital: string;
    proceduresPerformed: string[];
    dischargeMedications: string[];
    dietaryInstructions: string;
    activityRestrictions: string;
    followUpDate: string;
    followUpDoctor: string;
    warningSignsToSeekImmediateCare: string[];
  };
  nursingNotes?: NursingNote[];
}

export interface NursingNote {
  id: string;
  timestamp: string;
  nurseId: string;
  nurseName: string;
  shift: 'Morning' | 'Afternoon' | 'Night';
  content: string;
  careProvided: string[];
  vitalSignSummary?: string;
}

export type AppointmentStatus = 'Scheduled' | 'Confirmed' | 'Checked-in' | 'In Consultation' | 'In-Consultation' | 'Completed' | 'Cancelled' | 'No-show' | 'No-Show';
export type AppointmentType = 'New Patient' | 'Follow-up' | 'Routine Checkup' | 'Emergency' | 'Lab Review' | 'Outpatient Visit' | 'Specialist Consultation' | 'Pre-Operative Clearance' | 'Telehealth' | 'Emergency Intake';

export interface Appointment {
  id: string;
  appointmentNumber?: string; // e.g. APT-2026-0043
  patientId: string;
  patientName: string;
  patientPhone?: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty?: string;
  department: string;
  dateTime: string;
  durationMinutes: number;
  reasonForVisit: string;
  appointmentType?: AppointmentType;
  type?: AppointmentType;
  status: AppointmentStatus;
  cancellationReason?: string;
  notes?: string;
  roomId?: string;
}

export interface MedicineInventoryItem {
  id: string;
  name: string;
  genericName: string;
  category: 'Antibiotic' | 'Cardiovascular' | 'Analgesic' | 'Antidiabetic' | 'Respiratory' | 'Psychiatric' | 'Gastrointestinal' | 'Emergency' | string;
  form?: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Inhaler' | 'Ointment' | string;
  unit?: string;
  strength: string; // e.g. 500mg
  stockQuantity: number;
  reorderLevel: number;
  unitPriceUsd: number;
  batchNumber: string;
  expiryDate: string;
  manufacturer?: string;
  locationRack?: string;
  status?: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Expiring Soon';
}

export type MedicationInventory = MedicineInventoryItem;

export interface WardBed {
  id: string;
  wardName: string;
  wardType?: 'ICU' | 'CCU' | 'General Ward' | 'Pediatric Ward' | 'Surgical Post-Op' | 'Maternity Ward' | string;
  bedNumber: string;
  isOccupied: boolean;
  currentPatientId?: string;
  currentPatientName?: string;
  admissionId?: string;
  assignedNurse?: string;
  dailyRateUsd: number;
  maintenanceStatus: 'Available' | 'Occupied' | 'Cleaning Required' | 'Maintenance' | string;
}

export type TimelineEventType =
  | 'REGISTRATION'
  | 'VITALS_RECORDED'
  | 'CONSULTATION'
  | 'DIAGNOSIS'
  | 'LAB_ORDERED'
  | 'LAB_VERIFIED'
  | 'PRESCRIPTION_CREATED'
  | 'MEDICATION_DISPENSED'
  | 'ADMISSION'
  | 'NURSING_NOTE'
  | 'DISCHARGE'
  | 'APPOINTMENT';

export interface TimelineEvent {
  id: string;
  patientId: string;
  timestamp: string;
  type: TimelineEventType;
  title: string;
  subtitle: string;
  actorName: string;
  actorRole: string;
  badgeColor?: string;
  details?: Record<string, any>;
  iconType?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string; // e.g. 'VIEW_PATIENT_RECORD', 'CREATE_PRESCRIPTION', 'VERIFY_LAB_RESULT'
  resourceType: 'Patient' | 'EMR' | 'Prescription' | 'Lab' | 'Admission' | 'Appointment' | 'User' | 'Auth' | 'System' | 'Pharmacy' | string;
  resourceId: string;
  patientIdMasked?: string;
  patientIdentifier?: string;
  ipAddress: string;
  status?: 'SUCCESS' | 'DENIED' | 'FLAGGED';
  details: string;
}

export type AuditLog = AuditLogEntry;

export interface RolePermissions {
  manageUsers: boolean;
  manageDepartments: boolean;
  registerPatients: boolean;
  editPatients: boolean;
  viewMedicalHistory: boolean;
  createDiagnosis: boolean;
  createPrescriptions: boolean;
  dispenseMedications: boolean;
  orderLabTests: boolean;
  enterLabResults: boolean;
  verifyLabReports: boolean;
  manageAdmissions: boolean;
  dischargePatients: boolean;
  recordVitals: boolean;
  viewAuditLogs: boolean;
  bookAppointments: boolean;
  manageHospitalSettings: boolean;
}
