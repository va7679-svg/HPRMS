import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHospital } from '../../context/HospitalContext';
import {
  Calendar,
  Clock,
  UserCheck,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Video,
  MapPin,
  Stethoscope,
  ChevronRight,
  User,
  Sparkles,
} from 'lucide-react';
import { Appointment, AppointmentStatus, AppointmentType } from '../../types';

export const AppointmentManager: React.FC = () => {
  const { currentUser, hasPermission, users } = useAuth();
  const {
    appointments,
    patients,
    bookAppointment,
    updateAppointmentStatus,
    setSelectedPatientId,
    setActiveView,
    logAuditEvent,
  } = useHospital();

  const [activeTab, setActiveTab] = useState<'schedule' | 'queue' | 'book'>('schedule');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Booking Form State
  const [bookPatientId, setBookPatientId] = useState(patients[0]?.id || '');
  const [bookDoctorId, setBookDoctorId] = useState(
    users.find((u) => u.role === 'doctor')?.id || ''
  );
  const [bookDate, setBookDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookTime, setBookTime] = useState('09:00');
  const [bookDuration, setBookDuration] = useState(30);
  const [bookType, setBookType] = useState<AppointmentType>('Routine Checkup');
  const [bookReason, setBookReason] = useState('');
  const [bookRoom, setBookRoom] = useState('Suite 201 - Cardiology');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Doctors list
  const doctors = users.filter((u) => u.role === 'doctor');

  // User-role filtered appointments
  const userVisibleAppointments = appointments.filter((appt) => {
    if (currentUser.role === 'doctor') {
      return appt.doctorId === currentUser.id;
    }
    if (currentUser.role === 'patient') {
      const patientRecord = patients.find(
        (p) => p.email.toLowerCase() === currentUser.email.toLowerCase()
      );
      if (patientRecord) {
        return appt.patientId === patientRecord.id;
      }
    }
    return true;
  });

  // Filtered by criteria
  const filteredAppointments = userVisibleAppointments.filter((appt) => {
    const apptDateStr = appt.dateTime.split('T')[0];
    const matchesDate = activeTab === 'queue' ? true : !selectedDate || apptDateStr === selectedDate;
    const matchesStatus = statusFilter === 'ALL' || appt.status === statusFilter;
    const matchesDoctor = selectedDoctorId === 'ALL' || appt.doctorId === selectedDoctorId;

    const patient = patients.find((p) => p.id === appt.patientId);
    const matchesSearch =
      appt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.reasonForVisit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (patient && patient.patientId.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesDate && matchesStatus && matchesDoctor && matchesSearch;
  });

  const handleStatusChange = (appointmentId: string, newStatus: AppointmentStatus) => {
    updateAppointmentStatus(appointmentId, newStatus);
    const appt = appointments.find((a) => a.id === appointmentId);
    logAuditEvent(
      currentUser.id,
      currentUser.name,
      currentUser.role,
      'UPDATE_APPOINTMENT',
      'Appointment',
      appointmentId,
      `Updated status to ${newStatus} for ${appt?.patientName || 'patient'}`
    );
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === bookPatientId);
    const doctor = doctors.find((d) => d.id === bookDoctorId) || doctors[0];

    if (!patient || !doctor) {
      alert('Please select a valid patient and doctor.');
      return;
    }

    const isoDateTime = `${bookDate}T${bookTime}:00Z`;

    const newAppt = bookAppointment({
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      patientPhone: patient.phone,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty || doctor.department || 'General Medicine',
      department: doctor.department || 'Outpatient Clinic',
      dateTime: isoDateTime,
      durationMinutes: Number(bookDuration),
      appointmentType: bookType,
      type: bookType,
      status: 'Scheduled',
      reasonForVisit: bookReason,
      roomId: bookRoom,
    });

    logAuditEvent(
      currentUser.id,
      currentUser.name,
      currentUser.role,
      'CREATE_APPOINTMENT',
      'Appointment',
      newAppt.id,
      `Scheduled ${bookType} appointment for ${patient.firstName} ${patient.lastName} with ${doctor.name}`
    );

    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setActiveTab('schedule');
    }, 1200);
  };

  const timeSlots = [
    '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-3d">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 border border-blue-500/20 shadow-inner-bevel">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Outpatient Scheduling & Reception Queue</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Live Lobby Active
                </span>
              </h1>
              <p className="text-xs text-slate-500">
                Manage appointment bookings, clinic suites, doctor agendas, check-ins, and consultation intake
              </p>
            </div>
          </div>
        </div>

        {hasPermission('bookAppointments') && (
          <button
            onClick={() => setActiveTab('book')}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-3d-primary btn-3d flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Book New Appointment</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-3 pt-2 rounded-t-xl shadow-3d-sm">
        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-4 py-2 rounded-t-lg text-xs font-bold transition border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'schedule'
              ? 'border-blue-600 text-blue-700 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Daily Clinic Calendar
        </button>

        <button
          onClick={() => setActiveTab('queue')}
          className={`px-4 py-2 rounded-t-lg text-xs font-bold transition border-b-2 whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'queue'
              ? 'border-blue-600 text-blue-700 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Live Reception Queue</span>
          <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded-full text-[10px]">
            {appointments.filter((a) => a.status === 'Checked-in' || a.status === 'In Consultation').length}
          </span>
        </button>

        {hasPermission('bookAppointments') && (
          <button
            onClick={() => setActiveTab('book')}
            className={`px-4 py-2 rounded-t-lg text-xs font-bold transition border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'book'
                ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            + New Appointment
          </button>
        )}
      </div>

      {/* TAB 1: SCHEDULE VIEW */}
      {activeTab === 'schedule' && (
        <div className="space-y-3">
          {/* Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-3d grid grid-cols-1 sm:grid-cols-4 gap-2.5">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Appointment Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 font-semibold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Attending Physician</label>
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none"
              >
                <option value="ALL">All Doctors & Specialties</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.specialty || d.department})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Status Filter</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Checked-in">Checked-In / Waiting</option>
                <option value="In Consultation">In Consultation</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1">Search Keyword</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Patient, MRN, complaint..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-7 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Appointments List */}
          <div className="space-y-2.5">
            {filteredAppointments.map((appt) => {
              const patient = patients.find((p) => p.id === appt.patientId);
              const timeDisplay = appt.dateTime.includes('T')
                ? appt.dateTime.split('T')[1].substring(0, 5)
                : '09:00';

              return (
                <div
                  key={appt.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 shadow-3d card-3d-lift flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex flex-col items-center justify-center font-mono font-bold text-xs shadow-inner-bevel shrink-0 min-w-[65px]">
                      <span>{timeDisplay}</span>
                      <span className="text-[9px] font-normal text-slate-500">{appt.durationMinutes}m</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-900">{appt.patientName}</h3>
                        <span className="font-mono text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                          {patient?.patientId || appt.appointmentNumber || 'MRN'}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {appt.appointmentType || appt.type || 'Routine Checkup'}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                            appt.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                              : appt.status === 'In Consultation'
                              ? 'bg-purple-100 text-purple-800 border-purple-200'
                              : appt.status === 'Checked-in'
                              ? 'bg-amber-100 text-amber-800 border-amber-200'
                              : appt.status === 'Cancelled'
                              ? 'bg-rose-100 text-rose-800 border-rose-200'
                              : 'bg-blue-50 text-blue-800 border-blue-200'
                          }`}
                        >
                          {appt.status}
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
                          <strong className="text-slate-800">{appt.doctorName}</strong> ({appt.department})
                        </span>
                        {appt.roomId && (
                          <span className="flex items-center gap-1 text-slate-500">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{appt.roomId}</span>
                          </span>
                        )}
                        <span className="text-slate-500 italic">"{appt.reasonForVisit}"</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    {patient && (
                      <button
                        onClick={() => {
                          setSelectedPatientId(patient.id);
                          setActiveView('emr');
                        }}
                        className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 shadow-3d-sm btn-3d cursor-pointer"
                      >
                        Patient EMR
                      </button>
                    )}

                    {hasPermission('bookAppointments') && (
                      <>
                        {appt.status === 'Scheduled' && (
                          <button
                            onClick={() => handleStatusChange(appt.id, 'Checked-in')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-3d-emerald btn-3d cursor-pointer"
                          >
                            Check-In
                          </button>
                        )}

                        {appt.status === 'Checked-in' && (
                          <button
                            onClick={() => handleStatusChange(appt.id, 'In Consultation')}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-3d-primary btn-3d cursor-pointer"
                          >
                            Start Consult
                          </button>
                        )}

                        {appt.status === 'In Consultation' && (
                          <button
                            onClick={() => handleStatusChange(appt.id, 'Completed')}
                            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg shadow-3d-purple btn-3d cursor-pointer"
                          >
                            Finish
                          </button>
                        )}

                        {appt.status !== 'Completed' && appt.status !== 'Cancelled' && (
                          <button
                            onClick={() => handleStatusChange(appt.id, 'Cancelled')}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                            title="Cancel Appointment"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredAppointments.length === 0 && (
              <div className="p-12 text-center bg-white border border-slate-200 rounded-xl shadow-3d">
                <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-900">No Appointments Scheduled</h3>
                <p className="text-xs text-slate-500">No outpatient appointments match the selected filters.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: LIVE QUEUE VIEW */}
      {activeTab === 'queue' && (
        <div className="space-y-3">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-3d">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Live Outpatient Queue & Waiting Lobby</h3>
            <p className="text-xs text-slate-500">Real-time patient intake status for all active clinic suites</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {appointments
              .filter((a) => a.status === 'Checked-in' || a.status === 'In Consultation')
              .map((appt) => {
                const patient = patients.find((p) => p.id === appt.patientId);
                const timeDisplay = appt.dateTime.includes('T')
                  ? appt.dateTime.split('T')[1].substring(0, 5)
                  : '09:00';

                return (
                  <div
                    key={appt.id}
                    className="bg-white border border-slate-200 rounded-xl p-4 shadow-3d card-3d-lift space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
                        <span className="font-bold text-sm text-slate-900">{appt.patientName}</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {timeDisplay}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1">
                      <div>Physician: <strong className="text-slate-800">{appt.doctorName}</strong></div>
                      <div>Location: <strong className="text-slate-800">{appt.roomId || 'Suite 101'}</strong></div>
                      <div>Reason: <span className="text-slate-500">{appt.reasonForVisit}</span></div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          appt.status === 'In Consultation'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {appt.status}
                      </span>

                      {hasPermission('bookAppointments') && (
                        <div className="flex gap-1.5">
                          {appt.status === 'Checked-in' && (
                            <button
                              onClick={() => handleStatusChange(appt.id, 'In Consultation')}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold shadow-3d-primary btn-3d cursor-pointer"
                            >
                              Admit to Suite
                            </button>
                          )}
                          {appt.status === 'In Consultation' && (
                            <button
                              onClick={() => handleStatusChange(appt.id, 'Completed')}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold shadow-3d-emerald btn-3d cursor-pointer"
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB 3: BOOK APPOINTMENT FORM */}
      {activeTab === 'book' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-3d max-w-2xl mx-auto space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-base font-bold text-slate-900">Schedule Patient Outpatient Consultation</h3>
            <p className="text-xs text-slate-500">Assign time slot, attending specialist, and clinic exam suite</p>
          </div>

          {bookingSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-bold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Appointment successfully booked into clinic calendar!</span>
            </div>
          )}

          <form onSubmit={handleBookSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Patient *</label>
                <select
                  required
                  value={bookPatientId}
                  onChange={(e) => setBookPatientId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName} ({p.patientId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Attending Physician *</label>
                <select
                  required
                  value={bookDoctorId}
                  onChange={(e) => setBookDoctorId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.specialty || d.department})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date *</label>
                <input
                  type="date"
                  required
                  value={bookDate}
                  onChange={(e) => setBookDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Time Slot *</label>
                <select
                  value={bookTime}
                  onChange={(e) => setBookTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none"
                >
                  {timeSlots.map((ts) => (
                    <option key={ts} value={ts}>
                      {ts}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Consultation Type *</label>
                <select
                  value={bookType}
                  onChange={(e) => setBookType(e.target.value as AppointmentType)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none"
                >
                  <option value="Routine Checkup">Routine Checkup</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="New Patient">New Patient Intake</option>
                  <option value="Telehealth">Telehealth Video Consult</option>
                  <option value="Emergency">Urgent Care Exam</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Chief Complaint / Reason for Visit *</label>
              <textarea
                rows={2}
                required
                value={bookReason}
                onChange={(e) => setBookReason(e.target.value)}
                placeholder="e.g. 2-week history of hypertension, check response to beta-blocker"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Clinic Room / Suite</label>
              <input
                type="text"
                value={bookRoom}
                onChange={(e) => setBookRoom(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab('schedule')}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-3d-primary btn-3d flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Booking</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
