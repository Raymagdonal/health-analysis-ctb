
import React from 'react';
import { MetricConfig, UserData } from '../types';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface MetricGroupProps {
  user: UserData;
  metric: MetricConfig;
  isLocked?: boolean;
  onChange: (id: string, metric: string, field: 'month1' | 'month2', value: string) => void;
}

const MetricGroup: React.FC<MetricGroupProps> = ({ user, metric, isLocked, onChange }) => {
  const val1 = user[metric.key].month1;
  const val2 = user[metric.key].month2;
  
  // Common input style
  const inputClass = `w-full text-center bg-transparent transition-all py-3 text-sm text-slate-700 font-medium placeholder-slate-200 rounded-sm ${isLocked ? 'cursor-default' : 'hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:outline-none focus:z-10'}`;

  // Handle Average Calculation
  if (metric.calculation === 'average') {
    let average = 0;
    // Calculate average if both exist, otherwise use the one that exists
    if (val1 && val2) {
      average = (val1 + val2) / 2;
    } else {
      average = val1 || val2 || 0;
    }

    return (
      <>
        <td className="border-r border-slate-100 p-0 relative">
          <input
            type="number"
            value={val1 || ''}
            readOnly={isLocked}
            placeholder="-"
            onChange={(e) => onChange(user.id, metric.key, 'month1', e.target.value)}
            className={inputClass}
          />
        </td>
        <td className="border-r border-slate-100 p-0 relative">
          <input
            type="number"
            value={val2 || ''}
            readOnly={isLocked}
            placeholder="-"
            onChange={(e) => onChange(user.id, metric.key, 'month2', e.target.value)}
            className={inputClass}
          />
        </td>
        <td className="border-r border-slate-200 p-0">
           <div className="flex items-center justify-center h-full w-full py-3 px-1 text-xs bg-slate-50 text-slate-600 font-semibold">
             {average > 0 ? average.toFixed(0) : '-'}
          </div>
        </td>
      </>
    );
  }

  // Handle Difference Calculation (Default)
  const diff = val1 - val2;
  
  let diffColor = 'text-slate-300';
  let Icon = Minus;

  if (Math.abs(diff) > 0.01) {
    if (metric.isLowerBetter) {
      if (diff > 0) {
        diffColor = 'text-emerald-600 font-bold bg-emerald-50'; // Good (Lost weight)
        Icon = TrendingDown;
      } else {
        diffColor = 'text-rose-600 font-bold bg-rose-50'; // Bad (Gained weight)
        Icon = TrendingUp;
      }
    } else {
      if (diff < 0) {
        diffColor = 'text-emerald-600 font-bold bg-emerald-50'; // Good (Gained muscle)
        Icon = TrendingUp;
      } else {
        diffColor = 'text-rose-600 font-bold bg-rose-50'; // Bad (Lost muscle)
        Icon = TrendingDown;
      }
    }
  }

  return (
    <>
      <td className="border-r border-slate-100 p-0 relative">
        <input
          type="number"
          step="0.1"
          value={val1 || ''}
          readOnly={isLocked}
          placeholder="-"
          onChange={(e) => onChange(user.id, metric.key, 'month1', e.target.value)}
          className={inputClass}
        />
      </td>
      <td className="border-r border-slate-100 p-0 relative">
        <input
          type="number"
          step="0.1"
          value={val2 || ''}
          readOnly={isLocked}
          placeholder="-"
          onChange={(e) => onChange(user.id, metric.key, 'month2', e.target.value)}
          className={inputClass}
        />
      </td>
      <td className="border-r border-slate-200 p-0">
         <div className={`flex items-center justify-center gap-1 h-full w-full py-3 px-1 text-xs ${Math.abs(diff) > 0.01 ? diffColor : 'bg-slate-50'}`}>
           {Math.abs(diff) > 0.01 && <Icon size={14} />}
           <span>{Math.abs(diff) > 0.01 ? Math.abs(diff).toFixed(1) : '-'}</span>
        </div>
      </td>
    </>
  );
};

export default React.memo(MetricGroup);
