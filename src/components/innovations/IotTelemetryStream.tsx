import React, { useState, useEffect } from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  Activity,
  Heart,
  Radio,
  Wifi,
  AlertTriangle,
  Play,
  Pause,
  RefreshCw,
  BellRing,
  CheckCircle2,
} from 'lucide-react';

interface SensorDataPoint {
  time: string;
  heartRate: number;
  spo2: number;
  temp: number;
  bpSys: number;
  bpDia: number;
  status: 'Normal' | 'Warning' | 'Critical';
}

export const IotTelemetryStream: React.FC = () => {
  const { patients } = useHospital();
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [isStreaming, setIsStreaming] = useState(true);
  const [streamData, setStreamData] = useState<SensorDataPoint[]>([]);
  const [currentVitals, setCurrentVitals] = useState({
    heartRate: 74,
    spo2: 98,
    temp: 98.6,
    bpSys: 122,
    bpDia: 78,
  });

  const patient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  // Continuous sensor loop
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      // Simulate physiological micro-fluctuations
      const deltaHr = Math.floor(Math.random() * 5) - 2;
      const deltaSpo2 = Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0;
      const deltaTemp = (Math.random() * 0.2 - 0.1);

      setCurrentVitals((prev) => {
        const newHr = Math.min(140, Math.max(50, prev.heartRate + deltaHr));
        const newSpo2 = Math.min(100, Math.max(88, prev.spo2 + deltaSpo2));
        const newTemp = Number((prev.temp + deltaTemp).toFixed(1));

        let status: 'Normal' | 'Warning' | 'Critical' = 'Normal';
        if (newHr > 115 || newHr < 55 || newSpo2 < 92 || newTemp > 101.5) {
          status = 'Critical';
        } else if (newHr > 100 || newSpo2 < 95 || newTemp > 99.5) {
          status = 'Warning';
        }

        const point: SensorDataPoint = {
          time: new Date().toLocaleTimeString(),
          heartRate: newHr,
          spo2: newSpo2,
          temp: newTemp,
          bpSys: prev.bpSys,
          bpDia: prev.bpDia,
          status,
        };

        setStreamData((old) => [point, ...old.slice(0, 14)]);
        return {
          heartRate: newHr,
          spo2: newSpo2,
          temp: newTemp,
          bpSys: prev.bpSys,
          bpDia: prev.bpDia,
        };
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isStreaming]);

  const handleInduceSpike = () => {
    setCurrentVitals((prev) => ({
      ...prev,
      heartRate: 128,
      spo2: 89,
      temp: 102.4,
    }));
  };

  const handleNormalize = () => {
    setCurrentVitals({
      heartRate: 72,
      spo2: 99,
      temp: 98.6,
      bpSys: 120,
      bpDia: 80,
    });
  };

  const isCritical = currentVitals.heartRate > 110 || currentVitals.spo2 < 92 || currentVitals.temp > 101;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-3d space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 shadow-inner-bevel">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">IoT Wearable & Bedside Telemetry Stream</h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border ${
                isStreaming ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                <Radio className={`w-3 h-3 ${isStreaming ? 'text-emerald-600 animate-ping' : 'text-slate-400'}`} />
                {isStreaming ? 'Live Stream Active (1.5s interval)' : 'Stream Paused'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Direct telemetry from connected pulse oximeters, smart patches, and ICU telemetry monitors into the EMR.
            </p>
          </div>
        </div>

        {/* Stream toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              isStreaming
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-3d-emerald'
            }`}
          >
            {isStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isStreaming ? 'Pause Sensor Feed' : 'Resume Sensor Feed'}</span>
          </button>
          <button
            onClick={handleInduceSpike}
            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 rounded-lg text-xs transition cursor-pointer"
          >
            Trigger Critical Deterioration
          </button>
          <button
            onClick={handleNormalize}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold border border-emerald-200 rounded-lg text-xs transition cursor-pointer"
          >
            Normalize
          </button>
        </div>
      </div>

      {/* Patient Selector */}
      <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
        <label className="font-bold text-slate-700 shrink-0">Monitored Inpatient Subject:</label>
        <select
          value={selectedPatientId}
          onChange={(e) => setSelectedPatientId(e.target.value)}
          className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold text-slate-900 focus:outline-none"
        >
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.firstName} {p.lastName} ({p.patientId}) - Ward CCU Bed 104
            </option>
          ))}
        </select>
      </div>

      {/* Critical Alert Banner */}
      {isCritical && (
        <div className="p-3.5 bg-rose-600 text-white rounded-xl shadow-3d-red flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2 text-xs font-bold">
            <BellRing className="w-4 h-4" />
            <span>CRITICAL CLINICAL ALERT: Tachycardia & Oxygen Desaturation Detected on Ward Telemetry!</span>
          </div>
          <span className="text-[11px] font-bold bg-white/20 px-2 py-0.5 rounded">
            Auto-Notifying On-Call Physician
          </span>
        </div>
      )}

      {/* Real-Time Live Vitals Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Heart Rate */}
        <div className={`p-4 rounded-xl border transition-all card-3d-lift ${
          currentVitals.heartRate > 105 || currentVitals.heartRate < 55
            ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-500/20'
            : 'bg-white border-slate-200 shadow-3d'
        }`}>
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4 text-rose-600 fill-rose-600 animate-pulse" />
              Heart Rate (ECG)
            </span>
            <span className="text-[10px] text-slate-400">BPM</span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {currentVitals.heartRate}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Normal: 60–100 bpm</div>
        </div>

        {/* SpO2 */}
        <div className={`p-4 rounded-xl border transition-all card-3d-lift ${
          currentVitals.spo2 < 93
            ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-500/20'
            : 'bg-white border-slate-200 shadow-3d'
        }`}>
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
            <span>Oxygen Saturation</span>
            <span className="text-[10px] text-slate-400">% SpO2</span>
          </div>
          <div className="text-2xl font-black text-blue-700 font-mono">
            {currentVitals.spo2}%
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Target: &gt; 95% Room Air</div>
        </div>

        {/* Temp */}
        <div className={`p-4 rounded-xl border transition-all card-3d-lift ${
          currentVitals.temp > 100.4
            ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-500/20'
            : 'bg-white border-slate-200 shadow-3d'
        }`}>
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
            <span>Body Temperature</span>
            <span className="text-[10px] text-slate-400">°F</span>
          </div>
          <div className="text-2xl font-black text-amber-700 font-mono">
            {currentVitals.temp}°
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Normal: 97.8° - 99.1°F</div>
        </div>

        {/* Blood Pressure */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-3d card-3d-lift">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
            <span>Continuous NIBP</span>
            <span className="text-[10px] text-slate-400">mmHg</span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {currentVitals.bpSys}/{currentVitals.bpDia}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Target: &lt; 130/85 mmHg</div>
        </div>
      </div>

      {/* Live Stream Table */}
      <div className="rounded-xl border border-slate-200 overflow-hidden shadow-3d">
        <div className="bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 flex items-center justify-between border-b border-slate-200">
          <span>Real-time Ingestion Stream History</span>
          <span className="text-[10px] text-slate-500 font-normal">Auto-commits every 15 mins or upon threshold anomaly</span>
        </div>
        <div className="max-h-48 overflow-y-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold sticky top-0">
              <tr>
                <th className="px-3 py-2">Timestamp</th>
                <th className="px-3 py-2">HR (BPM)</th>
                <th className="px-3 py-2">SpO2 (%)</th>
                <th className="px-3 py-2">Temp (°F)</th>
                <th className="px-3 py-2">Telemetry Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {streamData.map((d, i) => (
                <tr key={i} className="hover:bg-slate-50 font-mono text-[11px]">
                  <td className="px-3 py-1.5 text-slate-600">{d.time}</td>
                  <td className="px-3 py-1.5 font-bold text-slate-900">{d.heartRate}</td>
                  <td className="px-3 py-1.5 font-bold text-blue-700">{d.spo2}%</td>
                  <td className="px-3 py-1.5 font-bold text-amber-700">{d.temp}°F</td>
                  <td className="px-3 py-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      d.status === 'Critical'
                        ? 'bg-rose-100 text-rose-800'
                        : d.status === 'Warning'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {d.status}
                    </span>
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
