import React from 'react';
import { UserData } from '../types';
import { METRICS } from '../constants';
import { X, Printer, LayoutGrid, TrendingUp, TrendingDown, Minus, FileText } from 'lucide-react';

interface ComparisonReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: UserData[];
  month1: string;
  month2: string;
}

const ComparisonIcon = ({ val1, val2, isLowerBetter }: { val1: number, val2: number, isLowerBetter: boolean }) => {
  const diff = val1 - val2;
  if (Math.abs(diff) <= 0.01 || !val1 || !val2) return <Minus size={10} className="text-slate-300" />;
  
  const improved = isLowerBetter ? diff > 0 : diff < 0;
  
  if (improved) {
    return isLowerBetter ? <TrendingDown size={12} className="text-emerald-500" /> : <TrendingUp size={12} className="text-emerald-500" />;
  } else {
    return isLowerBetter ? <TrendingUp size={12} className="text-rose-500" /> : <TrendingDown size={12} className="text-rose-500" />;
  }
};

export const ComparisonReportModal: React.FC<ComparisonReportModalProps> = ({ 
  isOpen, 
  onClose, 
  data, 
  month1, 
  month2 
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-[#fcfaf8] w-full max-w-[98vw] h-[95vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 border border-white">
        
        {/* Header */}
        <div className="bg-white px-8 py-4 border-b border-slate-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100">
              <LayoutGrid size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 leading-tight tracking-tight">รายงานเปรียบเทียบข้อมูลสุขภาพภาพรวม</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Comparison Report: {month1} vs {month2}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-black text-xs shadow-lg shadow-indigo-100"
            >
              <Printer size={16} />
              <span>พิมพ์รายงาน</span>
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-rose-50 rounded-full text-slate-400 hover:text-rose-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Area - Side-by-Side Tables */}
        <div className="flex-1 overflow-auto p-6 custom-scrollbar print:p-0 bg-slate-50/30">
          <div className="min-w-[1600px] flex flex-row gap-6 pb-10 print:flex-col print:min-w-0 print:gap-10">
            
            {/* Left Table: Baseline */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-4 border-l-4 border-indigo-600 pl-4 py-1">
                <h3 className="text-lg font-black text-slate-800 tracking-tight">ข้อมูลพื้นฐาน ({month1})</h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Baseline Data Set</span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 text-[9px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-200">
                      <th className="px-4 py-3 text-center w-10">#</th>
                      <th className="px-4 py-3 min-w-[150px]">ชื่อ-นามสกุล</th>
                      {METRICS.map(m => (
                        <th key={m.key} className="px-1 py-3 text-center">{m.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-[11px] font-medium text-slate-600">
                    {data.map((user, idx) => (
                      <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-2 text-center text-slate-300 font-bold">{idx + 1}</td>
                        <td className="px-4 py-2 font-bold text-slate-800 truncate">{user.name}</td>
                        {METRICS.map(m => (
                          <td key={m.key} className="px-1 py-2 text-center">
                            {user[m.key].month1 || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Table: Final Comparison */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-4 border-l-4 border-emerald-500 pl-4 py-1">
                <h3 className="text-lg font-black text-slate-800 tracking-tight">ข้อมูลเปรียบเทียบ ({month2})</h3>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Final & Progress</span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 text-[9px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-200">
                      <th className="px-4 py-3 text-center w-10">#</th>
                      <th className="px-4 py-3 min-w-[150px]">ชื่อ-นามสกุล</th>
                      {METRICS.map(m => (
                        <th key={m.key} className="px-1 py-3 text-center">{m.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-[11px] font-medium text-slate-600">
                    {data.map((user, idx) => (
                      <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-2 text-center text-slate-300 font-bold">{idx + 1}</td>
                        <td className="px-4 py-2 font-bold text-slate-800 truncate">{user.name}</td>
                        {METRICS.map(m => (
                          <td key={m.key} className="px-1 py-2 text-center font-black text-slate-900">
                            <div className="flex items-center justify-center gap-0.5">
                              {user[m.key].month2 || '-'}
                              <ComparisonIcon 
                                val1={user[m.key].month1} 
                                val2={user[m.key].month2} 
                                isLowerBetter={m.isLowerBetter} 
                              />
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="bg-white px-10 py-3 border-t border-slate-100 flex justify-between items-center shrink-0">
          <p className="text-[9px] text-slate-300 font-black uppercase tracking-[0.4em]">
            Chophraya Tourist Boat Co., Ltd.
          </p>
          <div className="flex items-center gap-4 text-[9px] text-slate-400 font-bold">
            <FileText size={12} />
            <span>พิมพ์เมื่อ: {new Date().toLocaleString('th-TH')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
