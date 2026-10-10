import React, { useState } from 'react';
import { VitalSignRecord } from '../../types';
import { Heart, Activity, Thermometer, Wind, Droplets, AlertCircle } from 'lucide-react';

interface VitalsChartProps {
  vitals: VitalSignRecord[];
  onAddVital?: () => void;
}

export const VitalsChart: React.FC<VitalsChartProps> = ({ vitals, onAddVital }) => {
  const [selectedMetric, setSelectedMetric] = useState<'bp' | 'hr' | 'spo2' | 'temp' | 'glucose'>('bp');

  const sortedVitals = [...vitals].sort(
    (a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()
  );

  const latestVital = sortedVitals[sortedVitals.length - 1];

  // Helper for SVG line chart coordinates
  const renderChart = () => {
    if (sortedVitals.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
          No vital sign records available for this patient.
        </div>
      );
    }

    const width = 650;
    const height = 220;
    const padding = { top: 20, right: 30, bottom: 40, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    let values: { x: number; y: number; y2?: number; label: string; date: string; full: VitalSignRecord }[] = [];
    let minY = 0;
    let maxY = 200;
    let normalMin = 60;
    let normalMax = 100;
    let unit = '';

    if (selectedMetric === 'bp') {
      minY = 50;
      maxY = 200;
      normalMin = 90;
      normalMax = 120;
      unit = 'mmHg';
      values = sortedVitals.map((v, i) => {
        const x = padding.left + (i / Math.max(1, sortedVitals.length - 1)) * chartWidth;
        const ySys = padding.top + (1 - (v.bloodPressureSystolic - minY) / (maxY - minY)) * chartHeight;
        const yDia = padding.top + (1 - (v.bloodPressureDiastolic - minY) / (maxY - minY)) * chartHeight;
        return {
          x,
          y: ySys,
          y2: yDia,
          label: `${v.bloodPressureSystolic}/${v.bloodPressureDiastolic} mmHg`,
          date: new Date(v.recordedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          full: v,
        };
      });
    } else if (selectedMetric === 'hr') {
      minY = 40;
      maxY = 140;
      normalMin = 60;
      normalMax = 100;
      unit = 'bpm';
      values = sortedVitals.map((v, i) => {
        const x = padding.left + (i / Math.max(1, sortedVitals.length - 1)) * chartWidth;
        const y = padding.top + (1 - (v.heartRateBpm - minY) / (maxY - minY)) * chartHeight;
        return {
          x,
          y,
          label: `${v.heartRateBpm} bpm`,
          date: new Date(v.recordedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          full: v,
        };
      });
    } else if (selectedMetric === 'spo2') {
      minY = 85;
      maxY = 100;
      normalMin = 95;
      normalMax = 100;
      unit = '%';
      values = sortedVitals.map((v, i) => {
        const x = padding.left + (i / Math.max(1, sortedVitals.length - 1)) * chartWidth;
        const y = padding.top + (1 - (v.oxygenSaturationPercent - minY) / (maxY - minY)) * chartHeight;
        return {
          x,
          y,
          label: `${v.oxygenSaturationPercent}%`,
          date: new Date(v.recordedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          full: v,
        };
      });
    } else if (selectedMetric === 'temp') {
      minY = 96.0;
      maxY = 104.0;
      normalMin = 97.8;
      normalMax = 99.1;
      unit = '°F';
      values = sortedVitals.map((v, i) => {
        const x = padding.left + (i / Math.max(1, sortedVitals.length - 1)) * chartWidth;
        const y = padding.top + (1 - (v.temperatureF - minY) / (maxY - minY)) * chartHeight;
        return {
          x,
          y,
          label: `${v.temperatureF}°F`,
          date: new Date(v.recordedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          full: v,
        };
      });
    } else if (selectedMetric === 'glucose') {
      minY = 50;
      maxY = 250;
      normalMin = 70;
      normalMax = 140;
      unit = 'mg/dL';
      values = sortedVitals
        .filter((v) => v.bloodGlucoseMgDl !== undefined)
        .map((v, i, arr) => {
          const val = v.bloodGlucoseMgDl || 100;
          const x = padding.left + (i / Math.max(1, arr.length - 1)) * chartWidth;
          const y = padding.top + (1 - (val - minY) / (maxY - minY)) * chartHeight;
          return {
            x,
            y,
            label: `${val} mg/dL`,
            date: new Date(v.recordedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            full: v,
          };
        });
    }

    const pathData = values.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const pathData2 =
      selectedMetric === 'bp'
        ? values.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y2}`).join(' ')
        : '';

    const normalBandTop = padding.top + (1 - (normalMax - minY) / (maxY - minY)) * chartHeight;
    const normalBandBottom = padding.top + (1 - (normalMin - minY) / (maxY - minY)) * chartHeight;

    return (
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[500px]">
          {/* Normal range shaded band */}
          <rect
            x={padding.left}
            y={normalBandTop}
            width={chartWidth}
            height={Math.max(0, normalBandBottom - normalBandTop)}
            fill="#10b981"
            fillOpacity="0.08"
          />
          <text
            x={width - padding.right}
            y={normalBandTop - 4}
            textAnchor="end"
            fontSize="10"
            fill="#10b981"
            className="font-mono font-medium"
          >
            Target Normal: {normalMin}-{normalMax} {unit}
          </text>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padding.top + ratio * chartHeight;
            const val = Math.round(maxY - ratio * (maxY - minY));
            return (
              <g key={ratio}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#334155"
                  strokeDasharray="4 4"
                />
                <text x={padding.left - 8} y={y + 3} textAnchor="end" fontSize="10" fill="#94a3b8">
                  {val}
                </text>
              </g>
            );
          })}

          {/* Data Lines */}
          {selectedMetric === 'bp' ? (
            <>
              {/* Systolic Line */}
              <path d={pathData} fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
              {/* Diastolic Line */}
              <path d={pathData2} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
              
              {/* Points */}
              {values.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="4" fill="#f43f5e" stroke="#0f172a" strokeWidth="2" />
                  <circle cx={p.x} cy={p.y2} r="4" fill="#3b82f6" stroke="#0f172a" strokeWidth="2" />
                  <text x={p.x} y={height - 15} textAnchor="middle" fontSize="10" fill="#94a3b8">
                    {p.date}
                  </text>
                </g>
              ))}
            </>
          ) : (
            <>
              <path d={pathData} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
              {values.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="4.5" fill="#3b82f6" stroke="#0f172a" strokeWidth="2" />
                  <text x={p.x} y={height - 15} textAnchor="middle" fontSize="10" fill="#94a3b8">
                    {p.date}
                  </text>
                </g>
              ))}
            </>
          )}
        </svg>
      </div>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm text-slate-100">
      {/* Metric summary top cards */}
      {latestVital && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
          {/* BP */}
          <button
            onClick={() => setSelectedMetric('bp')}
            className={`p-3 rounded-lg border text-left transition ${
              selectedMetric === 'bp'
                ? 'bg-rose-950/40 border-rose-600/60 ring-1 ring-rose-500'
                : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-semibold">Blood Pressure</span>
              <Activity className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-base font-bold text-slate-100">
              {latestVital.bloodPressureSystolic}/{latestVital.bloodPressureDiastolic}
              <span className="text-[11px] font-normal text-slate-400 ml-1">mmHg</span>
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Norm: &lt; 120/80</div>
          </button>

          {/* Heart Rate */}
          <button
            onClick={() => setSelectedMetric('hr')}
            className={`p-3 rounded-lg border text-left transition ${
              selectedMetric === 'hr'
                ? 'bg-blue-950/40 border-blue-600/60 ring-1 ring-blue-500'
                : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-semibold">Heart Rate</span>
              <Heart className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-base font-bold text-slate-100">
              {latestVital.heartRateBpm}
              <span className="text-[11px] font-normal text-slate-400 ml-1">bpm</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Norm: 60 - 100</div>
          </button>

          {/* SpO2 */}
          <button
            onClick={() => setSelectedMetric('spo2')}
            className={`p-3 rounded-lg border text-left transition ${
              selectedMetric === 'spo2'
                ? 'bg-cyan-950/40 border-cyan-600/60 ring-1 ring-cyan-500'
                : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-semibold">Oxygen (SpO2)</span>
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-base font-bold text-slate-100">
              {latestVital.oxygenSaturationPercent}
              <span className="text-[11px] font-normal text-slate-400 ml-1">%</span>
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Norm: 95 - 100%</div>
          </button>

          {/* Temp */}
          <button
            onClick={() => setSelectedMetric('temp')}
            className={`p-3 rounded-lg border text-left transition ${
              selectedMetric === 'temp'
                ? 'bg-amber-950/40 border-amber-600/60 ring-1 ring-amber-500'
                : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-semibold">Body Temp</span>
              <Thermometer className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-base font-bold text-slate-100">
              {latestVital.temperatureF}
              <span className="text-[11px] font-normal text-slate-400 ml-1">°F</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Norm: 97.8 - 99.1°F</div>
          </button>

          {/* Blood Glucose */}
          <button
            onClick={() => setSelectedMetric('glucose')}
            className={`p-3 rounded-lg border text-left transition ${
              selectedMetric === 'glucose'
                ? 'bg-purple-950/40 border-purple-600/60 ring-1 ring-purple-500'
                : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-semibold">Blood Glucose</span>
              <Droplets className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-base font-bold text-slate-100">
              {latestVital.bloodGlucoseMgDl || '--'}
              <span className="text-[11px] font-normal text-slate-400 ml-1">mg/dL</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Fasting: 70 - 99</div>
          </button>
        </div>
      )}

      {/* Chart Canvas */}
      <div className="bg-slate-850 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-slate-200">
              {selectedMetric === 'bp' && 'Blood Pressure Trend (Systolic Red / Diastolic Blue)'}
              {selectedMetric === 'hr' && 'Heart Rate (Pulse BPM) Trend'}
              {selectedMetric === 'spo2' && 'Pulse Oximetry (SpO2 %) Trend'}
              {selectedMetric === 'temp' && 'Body Temperature (°F) Trend'}
              {selectedMetric === 'glucose' && 'Plasma Glucose Trend (mg/dL)'}
            </h4>
          </div>
          {onAddVital && (
            <button
              onClick={onAddVital}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1.5 shadow-sm"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Record Vitals</span>
            </button>
          )}
        </div>

        {renderChart()}
      </div>
    </div>
  );
};
