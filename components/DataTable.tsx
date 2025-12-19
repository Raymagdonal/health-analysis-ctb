
import { UserData } from '../types';
import { METRICS } from '../constants';
import MetricGroup from './MetricGroup';
import { Trash2, Eye, Lock } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

interface DataTableProps {
  data: UserData[];
  month1: string;
  month2: string;
  isLocked: boolean;
  startIndex: number;
  onDataChange: (id: string, metric: string, field: 'month1' | 'month2', value: string) => void;
  onUserUpdate: (id: string, field: 'name' | 'company', value: string) => void;
  onDeleteUser: (id: string) => void;
  onViewUser: (user: UserData) => void;
}

const LongPressDeleteButton: React.FC<{ onDelete: () => void; disabled?: boolean }> = ({ onDelete, disabled }) => {
  const [isPressing, setIsPressing] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startPress = () => {
    if (disabled) return;
    setIsPressing(true);
    timeoutRef.current = setTimeout(() => {
      onDelete();
      setIsPressing(false);
    }, 2000);
  };

  const endPress = () => {
    setIsPressing(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <button
      onMouseDown={startPress}
      onMouseUp={endPress}
      onMouseLeave={endPress}
      onTouchStart={startPress}
      onTouchEnd={endPress}
      disabled={disabled}
      className={`relative overflow-hidden p-2 rounded-full transition-all duration-200 group ${disabled ? 'opacity-20 cursor-not-allowed' : isPressing ? 'text-rose-600 bg-rose-50' : 'text-slate-200 hover:text-rose-500 hover:bg-slate-50'}`}
      title={disabled ? "ข้อมูลถูกล็อค" : "กดค้าง 2 วินาทีเพื่อลบ"}
    >
      <div className="relative z-10">
        <Trash2 size={16} />
      </div>
      {!disabled && (
        <div 
          className={`absolute inset-0 bg-rose-200 transition-transform ease-linear origin-bottom rounded-full`}
          style={{ 
            transform: isPressing ? 'scaleY(1)' : 'scaleY(0)',
            transitionDuration: isPressing ? '2000ms' : '0ms'
          }}
        />
      )}
    </button>
  );
};

export const DataTable: React.FC<DataTableProps> = ({ 
  data, 
  month1, 
  month2, 
  isLocked,
  startIndex,
  onDataChange,
  onUserUpdate,
  onDeleteUser,
  onViewUser
}) => {
  return (
    <div className={`w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm relative ${isLocked ? 'table-locked' : ''}`}>
      {isLocked && (
        <div className="absolute top-2 right-2 z-30 bg-amber-500 text-white p-1 rounded-lg flex items-center gap-1 shadow-md animate-in fade-in zoom-in duration-300">
           <Lock size={12} />
           <span className="text-[9px] font-black uppercase tracking-widest px-1">ReadOnly</span>
        </div>
      )}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-max border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="sticky left-0 z-20 bg-slate-50 p-3 text-center w-12 font-bold text-slate-400 text-xs uppercase tracking-wider border-r border-slate-200">
                #
              </th>
              <th className="sticky left-12 z-20 bg-slate-50 p-4 text-left font-bold text-slate-700 text-sm min-w-[220px] border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                ข้อมูลผู้เข้าแข่งขัน
              </th>
              {METRICS.map((metric) => (
                <th key={metric.key} colSpan={3} className="p-2 font-bold text-slate-700 text-sm border-r border-slate-200 text-center min-w-[160px]">
                  {metric.label} <span className="text-slate-400 text-xs font-normal">({metric.unit || ''})</span>
                </th>
              ))}
              <th className="p-2 min-w-[100px] text-center font-bold text-slate-700 text-sm bg-slate-50">จัดการ</th>
            </tr>
            
            <tr className="bg-white border-b border-slate-200 text-xs">
              <th className="sticky left-0 z-20 bg-white border-r border-slate-200"></th>
              <th className="sticky left-12 z-20 bg-white p-2 text-left text-slate-400 font-medium border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                ชื่อและแผนก
              </th>
              {METRICS.map((metric) => (
                <React.Fragment key={`${metric.key}-sub`}>
                  <th className="p-2 w-[55px] text-center border-r border-slate-100 font-medium text-slate-500 bg-slate-50/50">{month1}</th>
                  <th className="p-2 w-[55px] text-center border-r border-slate-100 font-medium text-slate-500 bg-slate-50/50">{month2}</th>
                  <th className="p-2 w-[50px] text-center border-r border-slate-200 font-semibold text-slate-600 bg-slate-100/50">
                    {metric.calculation === 'average' ? 'ค่าเฉลี่ย' : 'ผลต่าง'}
                  </th>
                </React.Fragment>
              ))}
              <th className="p-2 bg-slate-50/50"></th>
            </tr>
          </thead>
          
          <tbody className="text-slate-700 text-sm">
            {data.map((user, index) => (
              <tr 
                key={user.id} 
                className="group hover:bg-slate-50/80 transition-colors border-b border-slate-100 last:border-none"
              >
                <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50 border-r border-slate-200 text-center font-bold text-slate-300">
                  {startIndex + index + 1}
                </td>

                <td className="sticky left-12 z-10 bg-white group-hover:bg-slate-50 border-r border-slate-200 p-2 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                  <div className="flex flex-col gap-1">
                    <input 
                      type="text" 
                      value={user.name}
                      readOnly={isLocked}
                      onChange={(e) => onUserUpdate(user.id, 'name', e.target.value)}
                      className={`w-full font-semibold text-slate-900 bg-transparent rounded px-1 -ml-1 outline-none transition-all placeholder-slate-300 ${isLocked ? 'cursor-default' : 'hover:bg-white focus:bg-white focus:ring-2 focus:ring-indigo-100'}`}
                      placeholder="ระบุชื่อ"
                    />
                    <input 
                      type="text" 
                      value={user.company}
                      readOnly={isLocked}
                      onChange={(e) => onUserUpdate(user.id, 'company', e.target.value)}
                      className={`w-full text-xs text-slate-500 bg-transparent rounded px-1 -ml-1 outline-none transition-all placeholder-slate-300 ${isLocked ? 'cursor-default' : 'hover:bg-white focus:bg-white focus:ring-2 focus:ring-indigo-100'}`}
                      placeholder="ระบุแผนก"
                    />
                  </div>
                </td>
                
                {METRICS.map((metric) => (
                  <MetricGroup 
                    key={metric.key} 
                    user={user} 
                    metric={metric} 
                    isLocked={isLocked}
                    onChange={onDataChange} 
                  />
                ))}

                <td className="p-2 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onViewUser(user)}
                      className="p-2.5 rounded-full text-indigo-500 bg-indigo-50 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                      title="วิเคราะห์ข้อมูลเปรียบเทียบซ้าย-ขวา"
                    >
                      <Eye size={18} />
                    </button>
                    <LongPressDeleteButton 
                      onDelete={() => onDeleteUser(user.id)} 
                      disabled={isLocked}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
