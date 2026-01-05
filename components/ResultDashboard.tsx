
import React from 'react';
import { AnalysisResult, AnalysisStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Ruler, Droplet, Zap, ShieldCheck, Microscope, TreePine, Activity, Target, Circle, Waves, Sigma } from 'lucide-react';

interface Props {
  result: AnalysisResult | null;
  status: AnalysisStatus;
}

const ResultDashboard: React.FC<Props> = ({ result, status }) => {
  if (status === AnalysisStatus.IDLE || status === AnalysisStatus.ANALYZING || !result) {
    return (
      <div className="h-full flex flex-col gap-6 opacity-40 grayscale pointer-events-none">
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100">
          <div className="h-4 w-24 bg-slate-200 rounded-full mb-4 animate-pulse" />
          <div className="h-10 w-48 bg-slate-100 rounded-xl mb-2 animate-pulse" />
          <div className="h-4 w-full bg-slate-50 rounded-full animate-pulse" />
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 flex-1">
          <div className="h-full w-full bg-slate-50 rounded-2xl flex items-center justify-center p-8 text-center">
             <Microscope className="w-12 h-12 text-slate-200 mb-4" />
             <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">Waiting for data...</p>
          </div>
        </div>
      </div>
    );
  }

  const chartData = [
    { name: 'Red', value: 100 - result.greennessIndex, color: '#ef4444' },
    { name: 'Green', value: result.greennessIndex, color: '#10b981' },
    { name: 'Other', value: 15, color: '#f59e0b' },
  ];

  const confidenceItems = [
    { label: 'Segmentation', value: result.confidenceBreakdown.segmentation },
    { label: 'Calibration', value: result.confidenceBreakdown.calibration },
    { label: 'Color Fidelity', value: result.confidenceBreakdown.colorFidelity },
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      {/* Primary KPI: Leaf Area & Type */}
      <div className="bg-white p-6 rounded-3xl shadow-xl shadow-emerald-100 border border-emerald-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Ruler className="w-32 h-32" />
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-emerald-600">
            <Zap size={16} className="fill-emerald-600" />
            <span className="text-xs font-bold uppercase tracking-widest">Core Morphology</span>
          </div>
          {result.metadata.detectedLeafType && (
            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-emerald-100">
              <TreePine size={12} />
              {result.metadata.detectedLeafType}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-500 mb-1">Total Leaf Area</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-slate-800 tracking-tighter">
                {result.leafAreaCm2.toFixed(2)}
              </span>
              <span className="text-2xl font-bold text-emerald-600">cm²</span>
            </div>
          </div>
          <div className="md:border-l border-slate-100 md:pl-6">
            <h3 className="text-sm font-semibold text-slate-500 mb-1 flex items-center gap-1">
              <Waves size={14} className="text-blue-400" /> Perimeter
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-800 tracking-tighter">
                {result.perimeterCm.toFixed(2)}
              </span>
              <span className="text-xl font-bold text-blue-500">cm</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-50 pt-4">
          <div className="flex items-center gap-3">
             <div className="bg-amber-50 p-2 rounded-lg text-amber-600">
                <Circle size={18} />
             </div>
             <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Circularity</p>
                <p className="text-sm font-bold text-slate-700">{result.circularity.toFixed(3)}</p>
             </div>
          </div>
          <div className="flex items-center gap-3 border-l border-slate-100 pl-4">
             <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                <Sigma size={18} />
             </div>
             <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mean Intensity</p>
                <p className="text-sm font-bold text-slate-700">{result.meanGreenness.toFixed(1)} <span className="text-[10px] text-slate-400 font-normal">G-ch</span></p>
             </div>
          </div>
        </div>
      </div>

      {/* Advanced Diagnostics: Confidence Breakdown */}
      <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100">
        <div className="flex items-center gap-2 mb-4">
          <Target size={18} className="text-blue-500" />
          <h4 className="font-bold text-slate-800 text-sm tracking-tight uppercase">Scientific Confidence</h4>
        </div>
        <div className="space-y-4">
          {confidenceItems.map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400 mb-1">
                <span>{item.label}</span>
                <span className="text-slate-600">{(item.value * 100).toFixed(0)}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${item.value * 100}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Secondary KPI: Greenness */}
      <div className="bg-slate-900 p-6 rounded-3xl shadow-xl shadow-slate-200 border border-slate-800 text-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Droplet size={18} className="text-emerald-400" />
            <h4 className="font-bold tracking-tight">Health Index (Greenness)</h4>
          </div>
          <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-400/20">
            {result.metadata.leafState}
          </span>
        </div>

        <div className="flex items-center gap-6 mb-8">
           <div className="relative w-24 h-24 flex items-center justify-center">
             <svg className="w-full h-full transform -rotate-90">
               <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
               <circle 
                 cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                 strokeDasharray={251.2}
                 strokeDashoffset={251.2 - (251.2 * result.greennessIndex / 100)}
                 className="text-emerald-500 transition-all duration-1000 ease-out"
               />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black">{result.greennessIndex}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">SPAD Eq.</span>
             </div>
           </div>
           
           <div className="flex-1 space-y-3">
             <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
               <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${result.greennessIndex}%` }} />
             </div>
             <p className="text-xs text-slate-400 leading-relaxed">
               Index based on chlorophyll absorption patterns. Higher values indicate vigorous vegetative growth.
             </p>
           </div>
        </div>

        <div className="h-[180px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-5 rounded-3xl border border-slate-100 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50 border border-slate-100" style={{ color: result.metadata.dominantColorHex }}>
               <div className="w-6 h-6 rounded-full shadow-inner" style={{ backgroundColor: result.metadata.dominantColorHex }} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sample Tint</p>
              <p className="text-xs font-bold text-slate-700">{result.metadata.dominantColorHex.toUpperCase()}</p>
            </div>
         </div>
         <div className="flex gap-2">
           <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
             <Activity size={14} />
           </div>
         </div>
      </div>
    </div>
  );
};

export default ResultDashboard;
