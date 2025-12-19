
import React from 'react';
import { UserData, MetricConfig, MetricKey } from '../types';
import { METRICS } from '../constants';
import { X, Scale, Activity, Flame, Zap, Heart, Building, TrendingUp, TrendingDown, Minus, Trophy, Star, LayoutGrid } from 'lucide-react';

interface EmployeeDetailModalProps {
  user: UserData | null;
  onClose: () => void;
  month1: string;
  month2: string;
}

const getMetricIcon = (key: string) => {
  switch (key) {
    case 'weight': return <Scale size={18} />;
    case 'bmi': return <Activity size={18} />;
    case 'fat': return <Flame size={18} />;
    case 'sFat': return <Flame size={18} className="opacity-70" />;
    case 'muscle': return <Zap size={18} />;
    case 'vFat': return <Heart size={18} />;
    default: return <Activity size={18} />;
  }
};

const MetricComparisonRow: React.FC<{ metric: MetricConfig; user: UserData }> = ({ metric, user }) => {
  const v1 = user[metric.key].month1;
  const v2 = user[metric.key].month2;
  const diff = v1 - v2;
  const isImproved = Math.abs(diff) > 0.01 && (metric.isLowerBetter ? diff > 0 : diff < 0);
  const diffText = Math.abs(diff) > 0.01 ? (diff > 0 ? `-${Math.abs(diff).toFixed(1)}` : `+${Math.abs(diff).toFixed(1)}`) : '0.0';
  const Icon = metric.isLowerBetter ? (diff > 0 ? TrendingDown : TrendingUp) : (diff < 0 ? TrendingUp : TrendingDown);

  return (
    <tr className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-none">
      <td className="py-4 px-4 text-left">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
            {getMetricIcon(metric.key)}
          </div>
          <div>
            <p className="font-bold text-slate-700 text-sm">{metric.label}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{metric.unit || 'unit'}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4 text-center font-bold text-slate-400">{v1 || '-'}</td>
      <td className="py-4 px-4 text-center font-black text-slate-900">{v2 || '-'}</td>
      <td className={`py-4 px-4 text-center bg-slate-50/50`}>
        <div className={`flex items-center justify-center gap-1 font-black ${Math.abs(diff) > 0.01 ? (isImproved ? 'text-emerald-600' : 'text-rose-600') : 'text-slate-300'}`}>
          {Math.abs(diff) > 0.01 && <Icon size={12} />}
          <span>{diffText}</span>
        </div>
      </td>
    </tr>
  );
};

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({ user, onClose, month1, month2 }) => {
  if (!user) return null;

  const calculateOverallProgress = (user: UserData) => {
    let totalPctChange = 0;
    let validCount = 0;

    METRICS.forEach(m => {
      const v1 = user[m.key].month1;
      const v2 = user[m.key].month2;
      if (v1 > 0 && v2 > 0) {
        let pct = m.isLowerBetter ? ((v1 - v2) / v1) * 100 : ((v2 - v1) / v1) * 100;
        totalPctChange += pct;
        validCount++;
      }
    });

    return validCount > 0 ? totalPctChange / validCount : 0;
  };

  const overallProgress = calculateOverallProgress(user);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#fcfaf8] w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-white">
        
        {/* Header */}
        <div className="bg-white px-8 py-5 border-b border-slate-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-indigo-100">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 leading-tight tracking-tight">{user.name}</h2>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 font-bold uppercase tracking-widest">
                <Building size={14} />
                <span>{user.company}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content Area - Bento Comparison */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50/30 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             
             {/* Overall Success Score Card */}
             <div className="md:col-span-2 p-8 rounded-[2rem] bg-indigo-600 text-white shadow-xl shadow-indigo-100 flex flex-col md:flex-row items-center justify-between relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                 <Trophy size={140} />
               </div>
               <div className="relative z-10 space-y-2 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <div className="p-2 bg-white/20 rounded-xl">
                      <Star size={20} fill="currentColor" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-white/80">Overall Success Progress</span>
                  </div>
                  <div className="flex items-end justify-center md:justify-start gap-2">
                    <span className="text-7xl font-black tracking-tighter">
                      {overallProgress >= 0 ? '+' : '-'}{Math.abs(overallProgress).toFixed(2)}
                    </span>
                    <span className="text-2xl font-bold mb-3 opacity-60">%</span>
                  </div>
                  <p className="text-[10px] text-white/60 font-black uppercase tracking-widest flex items-center gap-2 justify-center md:justify-start">
                    <Activity size={14} />
                    เฉลี่ยส่วนต่างจาก 6 ตัวชี้วัดหลัก
                  </p>
               </div>
               
               <div className="mt-6 md:mt-0 flex gap-4">
                  <div className="bg-white/10 px-6 py-4 rounded-2xl border border-white/5 backdrop-blur-sm text-center">
                    <p className="text-[9px] font-black text-white/50 uppercase tracking-widest mb-1">Baseline</p>
                    <p className="text-xl font-black">{month1}</p>
                  </div>
                  <div className="bg-white/20 px-6 py-4 rounded-2xl border border-white/10 backdrop-blur-sm text-center">
                    <p className="text-[9px] font-black text-white/50 uppercase tracking-widest mb-1">Current</p>
                    <p className="text-xl font-black">{month2}</p>
                  </div>
               </div>
             </div>

             {/* Side-by-Side Table Comparison */}
             <div className="md:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="bg-slate-50/50 px-8 py-4 border-b border-slate-100 flex items-center gap-3">
                   <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <LayoutGrid size={18} />
                   </div>
                   <h3 className="font-black text-slate-800 tracking-tight">ตารางวิเคราะห์เปรียบเทียบซ้าย-ขวา</h3>
                </div>
                <table className="w-full border-collapse">
                   <thead>
                      <tr className="bg-white text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                         <th className="py-5 px-6 text-left">ตัวชี้วัดสุขภาพ</th>
                         <th className="py-5 px-4 text-center">{month1}</th>
                         <th className="py-5 px-4 text-center text-slate-900">{month2}</th>
                         <th className="py-5 px-4 text-center bg-slate-50/50">ความต่าง (Diff)</th>
                      </tr>
                   </thead>
                   <tbody>
                      {METRICS.map(m => (
                        <MetricComparisonRow key={m.key} metric={m} user={user} />
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-white px-8 py-4 border-t border-slate-100 text-center text-[10px] text-slate-300 shrink-0 font-black uppercase tracking-[0.4em]">
          Linking Detail Analytics • {user.name} • Chophraya Tourist Boat
        </div>
      </div>
    </div>
  );
};
