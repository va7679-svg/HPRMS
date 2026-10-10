import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  PatientDemographics,
  VitalSignRecord,
  ConsultationNote,
  Prescription,
  LabOrder,
  InpatientAdmission,
  Appointment,
  MedicineInventoryItem,
  WardBed,
  AuditLogEntry,
  RolePermissions,
  UserRole,
  TimelineEvent,
  AppointmentStatus,
  LabTestParameter,
} from '../types';
import {
  INITIAL_PATIENTS,
  INITIAL_VITALS,
  INITIAL_CONSULTATIONS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_LAB_ORDERS,
  INITIAL_ADMISSIONS,
  INITIAL_APPOINTMENTS,
  INITIAL_INVENTORY,
  INITIAL_BEDS,
  INITIAL_AUDIT_LOGS,
  DEFAULT_ROLE_PERMISSIONS,
} from '../data/initialData';

interface HospitalContextType {
  patients: PatientDemographics[];
  vitals: VitalSignRecord[];
  consultations: ConsultationNote[];
  prescriptions: Prescription[];
  labOrders: LabOrder[];
  admissions: InpatientAdmission[];
  appointments: Appointment[];
  inventory: MedicineInventoryItem[];
  beds: WardBed[];
  auditLogs: AuditLogEntry[];
  rolePermissions: Record<UserRole, RolePermissions>;
  selectedPatientId: string | null;
  activeView: string;
  searchQuery: string;
  setActiveView: (view: string) => void;
  setSelectedPatientId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;

  // Actions
  addPatient: (patient: Omit<PatientDemographics, 'id' | 'patientId' | 'registeredDate'>) => PatientDemographics;
  updatePatient: (id: string, data: Partial<PatientDemographics>) => void;
  recordVitals: (vitalRecord: Omit<VitalSignRecord, 'id' | 'recordedAt'>) => VitalSignRecord;
  addConsultation: (note: Omit<ConsultationNote, 'id' | 'date'>) => ConsultationNote;
  createPrescription: (prescription: Omit<Prescription, 'id' | 'prescriptionNumber' | 'prescribedDate'>) => Prescription;
  dispensePrescriptionItem: (prescriptionId: string, itemId: string, pharmacistName: string) => void;
  orderLabTest: (order: Omit<LabOrder, 'id' | 'orderNumber' | 'orderedDate' | 'status'>) => LabOrder;
  updateLabResults: (
    orderId: string,
    results: LabTestParameter[],
    technicianNotes: string,
    verifiedBy: string,
    reportSummary: string
  ) => void;
  admitPatient: (
    patientId: string,
    ward: string,
    bedNumber: string,
    admittingDoctorId: string,
    admittingDoctorName: string,
    reason: string,
    diagnosis: string
  ) => InpatientAdmission;
  dischargePatient: (
    admissionId: string,
    dischargeSummary: NonNullable<InpatientAdmission['dischargeSummary']>,
    dischargeCondition: InpatientAdmission['dischargeCondition']
  ) => void;
  addNursingNote: (
    admissionId: string,
    content: string,
    nurseId: string,
    nurseName: string,
    shift: 'Morning' | 'Afternoon' | 'Night',
    careProvided: string[],
    vitalSignSummary?: string
  ) => void;
  bookAppointment: (appointment: Omit<Appointment, 'id' | 'appointmentNumber'>) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus, cancellationReason?: string) => void;
  updateBedStatus: (bedId: string, maintenanceStatus: WardBed['maintenanceStatus']) => void;
  updateInventoryStock: (itemId: string, quantityChange: number) => void;
  addInventoryItem: (item: Omit<MedicineInventoryItem, 'id'>) => void;
  updateRolePermissions: (role: UserRole, permissions: Partial<RolePermissions>) => void;
  logAuditEvent: (
    userId: string,
    userName: string,
    userRole: UserRole,
    action: string,
    resourceType: AuditLogEntry['resourceType'],
    resourceId: string,
    details: string,
    patientIdMasked?: string
  ) => void;
  getPatientTimeline: (patientId: string) => TimelineEvent[];
  resetToSampleData: () => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export const HospitalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<PatientDemographics[]>(() => {
    const local = localStorage.getItem('hprms_patients');
    return local ? JSON.parse(local) : INITIAL_PATIENTS;
  });

  const [vitals, setVitals] = useState<VitalSignRecord[]>(() => {
    const local = localStorage.getItem('hprms_vitals');
    return local ? JSON.parse(local) : INITIAL_VITALS;
  });

  const [consultations, setConsultations] = useState<ConsultationNote[]>(() => {
    const local = localStorage.getItem('hprms_consultations');
    return local ? JSON.parse(local) : INITIAL_CONSULTATIONS;
  });

  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => {
    const local = localStorage.getItem('hprms_prescriptions');
    return local ? JSON.parse(local) : INITIAL_PRESCRIPTIONS;
  });

  const [labOrders, setLabOrders] = useState<LabOrder[]>(() => {
    const local = localStorage.getItem('hprms_lab_orders');
    return local ? JSON.parse(local) : INITIAL_LAB_ORDERS;
  });

  const [admissions, setAdmissions] = useState<InpatientAdmission[]>(() => {
    const local = localStorage.getItem('hprms_admissions');
    return local ? JSON.parse(local) : INITIAL_ADMISSIONS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const local = localStorage.getItem('hprms_appointments');
    return local ? JSON.parse(local) : INITIAL_APPOINTMENTS;
  });

  const [inventory, setInventory] = useState<MedicineInventoryItem[]>(() => {
    const local = localStorage.getItem('hprms_inventory');
    return local ? JSON.parse(local) : INITIAL_INVENTORY;
  });

  const [beds, setBeds] = useState<WardBed[]>(() => {
    const local = localStorage.getItem('hprms_beds');
    return local ? JSON.parse(local) : INITIAL_BEDS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const local = localStorage.getItem('hprms_audit_logs');
    return local ? JSON.parse(local) : INITIAL_AUDIT_LOGS;
  });

  const [rolePermissions, setRolePermissions] = useState<Record<UserRole, RolePermissions>>(() => {
    const local = localStorage.getItem('hprms_role_permissions');
    return local ? JSON.parse(local) : DEFAULT_ROLE_PERMISSIONS;
  });

  const [selectedPatientId, setSelectedPatientId] = useState<string | null>('pat-001');
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Persist to LocalStorage
  useEffect(() => {
    localStorage.setItem('hprms_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('hprms_vitals', JSON.stringify(vitals));
  }, [vitals]);

  useEffect(() => {
    localStorage.setItem('hprms_consultations', JSON.stringify(consultations));
  }, [consultations]);

  useEffect(() => {
    localStorage.setItem('hprms_prescriptions', JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    localStorage.setItem('hprms_lab_orders', JSON.stringify(labOrders));
  }, [labOrders]);

  useEffect(() => {
    localStorage.setItem('hprms_admissions', JSON.stringify(admissions));
  }, [admissions]);

  useEffect(() => {
    localStorage.setItem('hprms_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('hprms_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('hprms_beds', JSON.stringify(beds));
  }, [beds]);

  useEffect(() => {
    localStorage.setItem('hprms_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('hprms_role_permissions', JSON.stringify(rolePermissions));
  }, [rolePermissions]);

  const logAuditEvent = (
    userId: string,
    userName: string,
    userRole: UserRole,
    action: string,
    resourceType: AuditLogEntry['resourceType'],
    resourceId: string,
    details: string,
    patientIdMasked?: string
  ) => {
    const newLog: AuditLogEntry = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      userId,
      userName,
      userRole,
      action,
      resourceType,
      resourceId,
      patientIdMasked,
      ipAddress: '192.168.1.104 (Authenticated Session)',
      status: 'SUCCESS',
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 499)]);
  };

  const addPatient = (patientData: Omit<PatientDemographics, 'id' | 'patientId' | 'registeredDate'>) => {
    const uniqueNumber = Math.floor(1000 + Math.random() * 9000);
    const newPatientId = `HPR-2026-${uniqueNumber}`;
    const newPatient: PatientDemographics = {
      ...patientData,
      id: `pat-${Date.now()}`,
      patientId: newPatientId,
      registeredDate: new Date().toISOString(),
    };
    setPatients((prev) => [newPatient, ...prev]);
    return newPatient;
  };

  const updatePatient = (id: string, data: Partial<PatientDemographics>) => {
    setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
  };

  const recordVitals = (vitalData: Omit<VitalSignRecord, 'id' | 'recordedAt'>) => {
    const newVital: VitalSignRecord = {
      ...vitalData,
      id: `vit-${Date.now()}`,
      recordedAt: new Date().toISOString(),
    };
    setVitals((prev) => [...prev, newVital]);
    return newVital;
  };

  const addConsultation = (noteData: Omit<ConsultationNote, 'id' | 'date'>) => {
    const newNote: ConsultationNote = {
      ...noteData,
      id: `con-${Date.now()}`,
      date: new Date().toISOString(),
    };
    setConsultations((prev) => [newNote, ...prev]);
    return newNote;
  };

  const createPrescription = (
    rxData: Omit<Prescription, 'id' | 'prescriptionNumber' | 'prescribedDate'>
  ) => {
    const rxNumber = `RX-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRx: Prescription = {
      ...rxData,
      id: `rx-${Date.now()}`,
      prescriptionNumber: rxNumber,
      prescribedDate: new Date().toISOString(),
    };
    setPrescriptions((prev) => [newRx, ...prev]);
    return newRx;
  };

  const dispensePrescriptionItem = (prescriptionId: string, itemId: string, pharmacistName: string) => {
    setPrescriptions((prev) =>
      prev.map((rx) => {
        if (rx.id !== prescriptionId) return rx;
        const updatedItems = rx.items.map((item) => {
          if (item.id !== itemId) return item;
          return {
            ...item,
            dispensedStatus: 'Dispensed' as const,
            dispensedDate: new Date().toISOString(),
            dispensedByPharmacist: pharmacistName,
          };
        });
        const allDispensed = updatedItems.every((i) => i.dispensedStatus === 'Dispensed');
        return {
          ...rx,
          items: updatedItems,
          overallStatus: allDispensed ? 'Fulfilled' : rx.overallStatus,
        };
      })
    );
  };

  const orderLabTest = (orderData: Omit<LabOrder, 'id' | 'orderNumber' | 'orderedDate' | 'status'>) => {
    const orderNumber = `LAB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: LabOrder = {
      ...orderData,
      id: `lab-${Date.now()}`,
      orderNumber,
      orderedDate: new Date().toISOString(),
      status: 'Ordered',
    };
    setLabOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateLabResults = (
    orderId: string,
    results: LabTestParameter[],
    technicianNotes: string,
    verifiedBy: string,
    reportSummary: string
  ) => {
    setLabOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          results,
          technicianNotes,
          verifiedBy,
          verifiedAt: new Date().toISOString(),
          status: 'Verified',
          reportSummary,
        };
      })
    );
  };

  const admitPatient = (
    patientId: string,
    ward: string,
    bedNumber: string,
    admittingDoctorId: string,
    admittingDoctorName: string,
    reason: string,
    diagnosis: string
  ) => {
    const admissionNumber = `ADM-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newAdmission: InpatientAdmission = {
      id: `adm-${Date.now()}`,
      admissionNumber,
      patientId,
      admissionDate: new Date().toISOString(),
      admittedDate: new Date().toISOString(),
      admittingDoctorId,
      admittingDoctorName,
      ward,
      bedNumber,
      reasonForAdmission: reason,
      initialDiagnosis: diagnosis,
      status: 'Admitted',
      nursingNotes: [],
    };
    setAdmissions((prev) => [newAdmission, ...prev]);

    // Mark bed as occupied
    setBeds((prev) =>
      prev.map((b) => {
        if (b.bedNumber === bedNumber) {
          const patient = patients.find((p) => p.id === patientId);
          return {
            ...b,
            isOccupied: true,
            currentPatientId: patientId,
            currentPatientName: patient ? `${patient.firstName} ${patient.lastName} (MRN: ${patient.patientId})` : patientId,
            admissionId: newAdmission.id,
            maintenanceStatus: 'Occupied',
          };
        }
        return b;
      })
    );

    // Update patient status
    updatePatient(patientId, {
      status: 'Inpatient',
      currentWard: ward,
      currentBed: bedNumber,
    });

    return newAdmission;
  };

  const dischargePatient = (
    admissionId: string,
    dischargeSummary: NonNullable<InpatientAdmission['dischargeSummary']>,
    dischargeCondition: InpatientAdmission['dischargeCondition']
  ) => {
    const targetAdm = admissions.find((a) => a.id === admissionId);
    if (!targetAdm) return;

    setAdmissions((prev) =>
      prev.map((a) => {
        if (a.id !== admissionId) return a;
        return {
          ...a,
          status: 'Discharged',
          dischargeDate: new Date().toISOString(),
          dischargeCondition,
          dischargeSummary,
        };
      })
    );

    // Free the bed
    setBeds((prev) =>
      prev.map((b) => {
        if (b.bedNumber === targetAdm.bedNumber) {
          return {
            ...b,
            isOccupied: false,
            currentPatientId: undefined,
            currentPatientName: undefined,
            admissionId: undefined,
            maintenanceStatus: 'Cleaning Required',
          };
        }
        return b;
      })
    );

    // Update patient status
    updatePatient(targetAdm.patientId, {
      status: 'Discharged',
      currentWard: undefined,
      currentBed: undefined,
    });
  };

  const addNursingNote = (
    admissionId: string,
    content: string,
    nurseId: string,
    nurseName: string,
    shift: 'Morning' | 'Afternoon' | 'Night',
    careProvided: string[],
    vitalSignSummary?: string
  ) => {
    const newNote = {
      id: `nn-${Date.now()}`,
      timestamp: new Date().toISOString(),
      nurseId,
      nurseName,
      shift,
      content,
      careProvided,
      vitalSignSummary,
    };

    setAdmissions((prev) =>
      prev.map((a) => {
        if (a.id !== admissionId) return a;
        return {
          ...a,
          nursingNotes: [...(a.nursingNotes || []), newNote],
        };
      })
    );
  };

  const bookAppointment = (appData: Omit<Appointment, 'id' | 'appointmentNumber'>) => {
    const aptNumber = `APT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApt: Appointment = {
      ...appData,
      id: `apt-${Date.now()}`,
      appointmentNumber: aptNumber,
    };
    setAppointments((prev) => [newApt, ...prev]);
    return newApt;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus, cancellationReason?: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status, cancellationReason } : apt))
    );
  };

  const updateBedStatus = (bedId: string, maintenanceStatus: WardBed['maintenanceStatus']) => {
    setBeds((prev) =>
      prev.map((b) => {
        if (b.id !== bedId) return b;
        const isOccupied = maintenanceStatus === 'Occupied';
        return {
          ...b,
          maintenanceStatus,
          isOccupied,
        };
      })
    );
  };

  const updateInventoryStock = (itemId: string, quantityChange: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const newQty = Math.max(0, item.stockQuantity + quantityChange);
        let newStatus: MedicineInventoryItem['status'] = 'In Stock';
        if (newQty === 0) newStatus = 'Out of Stock';
        else if (newQty <= item.reorderLevel) newStatus = 'Low Stock';
        return {
          ...item,
          stockQuantity: newQty,
          status: newStatus,
        };
      })
    );
  };

  const addInventoryItem = (itemData: Omit<MedicineInventoryItem, 'id'>) => {
    const newItem: MedicineInventoryItem = {
      ...itemData,
      id: `med-${Date.now()}`,
    };
    setInventory((prev) => [newItem, ...prev]);
  };

  const updateRolePermissions = (role: UserRole, permissions: Partial<RolePermissions>) => {
    setRolePermissions((prev) => ({
      ...prev,
      [role]: { ...prev[role], ...permissions },
    }));
  };

  const getPatientTimeline = (patientId: string): TimelineEvent[] => {
    const events: TimelineEvent[] = [];
    const patient = patients.find((p) => p.id === patientId);

    if (patient) {
      events.push({
        id: `tl-reg-${patient.id}`,
        patientId,
        timestamp: patient.registeredDate,
        type: 'REGISTRATION',
        title: 'Patient Intake & Registration',
        subtitle: `Patient registered with ID ${patient.patientId}`,
        actorName: 'Admissions Desk',
        actorRole: 'Receptionist',
        badgeColor: 'blue',
        details: {
          bloodGroup: patient.bloodGroup,
          allergiesCount: patient.allergies.length,
          insurance: patient.insurance.provider,
        },
      });
    }

    // Vitals
    vitals
      .filter((v) => v.patientId === patientId)
      .forEach((v) => {
        events.push({
          id: `tl-vit-${v.id}`,
          patientId,
          timestamp: v.recordedAt,
          type: 'VITALS_RECORDED',
          title: `Vital Signs Intake: BP ${v.bloodPressureSystolic}/${v.bloodPressureDiastolic} mmHg`,
          subtitle: `HR: ${v.heartRateBpm} bpm | SpO2: ${v.oxygenSaturationPercent}% | Temp: ${v.temperatureF}°F`,
          actorName: v.recordedBy,
          actorRole: v.recordedByRole,
          badgeColor: 'emerald',
          details: { ...v },
        });
      });

    // Consultations & Diagnoses
    consultations
      .filter((c) => c.patientId === patientId)
      .forEach((c) => {
        events.push({
          id: `tl-con-${c.id}`,
          patientId,
          timestamp: c.date,
          type: 'CONSULTATION',
          title: `Physician Consultation: ${c.chiefComplaint}`,
          subtitle: `Assessment: ${c.assessment.split('\n')[0]}`,
          actorName: c.doctorName,
          actorRole: c.doctorSpecialty,
          badgeColor: 'indigo',
          details: { ...c },
        });

        c.diagnoses.forEach((d) => {
          events.push({
            id: `tl-dx-${d.id}`,
            patientId,
            timestamp: c.date,
            type: 'DIAGNOSIS',
            title: `Diagnosis Established: ${d.description} [${d.icd10Code}]`,
            subtitle: `Type: ${d.type} Diagnosis | Status: ${d.status}`,
            actorName: c.doctorName,
            actorRole: 'Physician',
            badgeColor: 'purple',
            details: { ...d },
          });
        });
      });

    // Lab Orders & Results
    labOrders
      .filter((l) => l.patientId === patientId)
      .forEach((l) => {
        events.push({
          id: `tl-lab-ord-${l.id}`,
          patientId,
          timestamp: l.orderedDate,
          type: 'LAB_ORDERED',
          title: `Diagnostic Lab Ordered: ${l.testName}`,
          subtitle: `Priority: ${l.priority} | Department: ${l.department}`,
          actorName: l.doctorName,
          actorRole: 'Ordering Physician',
          badgeColor: 'amber',
          details: { ...l },
        });

        if (l.status === 'Verified' && l.verifiedAt) {
          events.push({
            id: `tl-lab-ver-${l.id}`,
            patientId,
            timestamp: l.verifiedAt,
            type: 'LAB_VERIFIED',
            title: `Laboratory Results Verified: ${l.testName}`,
            subtitle: l.reportSummary || `${l.results?.length || 0} biomarkers reported`,
            actorName: l.verifiedBy || 'Laboratory Scientist',
            actorRole: 'MLS (ASCP)',
            badgeColor: 'cyan',
            details: { results: l.results, summary: l.reportSummary },
          });
        }
      });

    // Prescriptions
    prescriptions
      .filter((p) => p.patientId === patientId)
      .forEach((p) => {
        events.push({
          id: `tl-rx-ord-${p.id}`,
          patientId,
          timestamp: p.prescribedDate,
          type: 'PRESCRIPTION_CREATED',
          title: `e-Prescription Issued: ${p.prescriptionNumber}`,
          subtitle: `${p.items.map((i) => `${i.medicationName} (${i.dosage})`).join(', ')}`,
          actorName: p.doctorName,
          actorRole: 'Prescribing Physician',
          badgeColor: 'rose',
          details: { ...p },
        });

        p.items.forEach((item) => {
          if (item.dispensedStatus === 'Dispensed' && item.dispensedDate) {
            events.push({
              id: `tl-rx-disp-${item.id}`,
              patientId,
              timestamp: item.dispensedDate,
              type: 'MEDICATION_DISPENSED',
              title: `Medication Dispensed: ${item.medicationName} ${item.dosage}`,
              subtitle: `Qty: ${item.quantity} | Refills: ${item.refillsAllowed} | ${item.instructions}`,
              actorName: item.dispensedByPharmacist || 'Central Pharmacy',
              actorRole: 'Clinical Pharmacist',
              badgeColor: 'teal',
              details: { ...item },
            });
          }
        });
      });

    // Inpatient Admissions & Discharges
    admissions
      .filter((a) => a.patientId === patientId)
      .forEach((a) => {
        events.push({
          id: `tl-adm-${a.id}`,
          patientId,
          timestamp: a.admittedDate,
          type: 'ADMISSION',
          title: `Inpatient Admission: ${a.ward} (${a.bedNumber})`,
          subtitle: `Reason: ${a.reasonForAdmission} | Initial Dx: ${a.initialDiagnosis}`,
          actorName: a.admittingDoctorName,
          actorRole: 'Admitting Physician',
          badgeColor: 'orange',
          details: { ...a },
        });

        a.nursingNotes?.forEach((nn) => {
          events.push({
            id: `tl-nn-${nn.id}`,
            patientId,
            timestamp: nn.timestamp,
            type: 'NURSING_NOTE',
            title: `Nursing Care Round (${nn.shift} Shift)`,
            subtitle: nn.content.substring(0, 100) + '...',
            actorName: nn.nurseName,
            actorRole: 'Inpatient Nurse',
            badgeColor: 'sky',
            details: { ...nn },
          });
        });

        if (a.status === 'Discharged' && a.dischargeDate) {
          events.push({
            id: `tl-dis-${a.id}`,
            patientId,
            timestamp: a.dischargeDate,
            type: 'DISCHARGE',
            title: `Formal Hospital Discharge [${a.dischargeCondition || 'Stable'}]`,
            subtitle: a.dischargeSummary?.courseInHospital || 'Patient discharged with home care regimen',
            actorName: a.admittingDoctorName,
            actorRole: 'Attending Physician',
            badgeColor: 'emerald',
            details: { ...a.dischargeSummary },
          });
        }
      });

    // Appointments
    appointments
      .filter((apt) => apt.patientId === patientId)
      .forEach((apt) => {
        events.push({
          id: `tl-apt-${apt.id}`,
          patientId,
          timestamp: apt.dateTime,
          type: 'APPOINTMENT',
          title: `Clinic Appointment: ${apt.appointmentType} [${apt.status}]`,
          subtitle: `Specialty: ${apt.department} with ${apt.doctorName}`,
          actorName: apt.doctorName,
          actorRole: apt.doctorSpecialty,
          badgeColor: 'violet',
          details: { ...apt },
        });
      });

    // Sort in reverse chronological order (newest first)
    return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const resetToSampleData = () => {
    localStorage.removeItem('hprms_patients');
    localStorage.removeItem('hprms_vitals');
    localStorage.removeItem('hprms_consultations');
    localStorage.removeItem('hprms_prescriptions');
    localStorage.removeItem('hprms_lab_orders');
    localStorage.removeItem('hprms_admissions');
    localStorage.removeItem('hprms_appointments');
    localStorage.removeItem('hprms_inventory');
    localStorage.removeItem('hprms_beds');
    localStorage.removeItem('hprms_audit_logs');
    localStorage.removeItem('hprms_role_permissions');

    setPatients(INITIAL_PATIENTS);
    setVitals(INITIAL_VITALS);
    setConsultations(INITIAL_CONSULTATIONS);
    setPrescriptions(INITIAL_PRESCRIPTIONS);
    setLabOrders(INITIAL_LAB_ORDERS);
    setAdmissions(INITIAL_ADMISSIONS);
    setAppointments(INITIAL_APPOINTMENTS);
    setInventory(INITIAL_INVENTORY);
    setBeds(INITIAL_BEDS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setRolePermissions(DEFAULT_ROLE_PERMISSIONS);
    setSelectedPatientId('pat-001');
    setActiveView('dashboard');
  };

  return (
    <HospitalContext.Provider
      value={{
        patients,
        vitals,
        consultations,
        prescriptions,
        labOrders,
        admissions,
        appointments,
        inventory,
        beds,
        auditLogs,
        rolePermissions,
        selectedPatientId,
        activeView,
        searchQuery,
        setActiveView,
        setSelectedPatientId,
        setSearchQuery,
        addPatient,
        updatePatient,
        recordVitals,
        addConsultation,
        createPrescription,
        dispensePrescriptionItem,
        orderLabTest,
        updateLabResults,
        admitPatient,
        dischargePatient,
        addNursingNote,
        bookAppointment,
        updateAppointmentStatus,
        updateBedStatus,
        updateInventoryStock,
        addInventoryItem,
        updateRolePermissions,
        logAuditEvent,
        getPatientTimeline,
        resetToSampleData,
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
