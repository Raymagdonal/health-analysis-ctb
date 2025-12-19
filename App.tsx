
import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { UserData, MetricKey, MetricConfig } from './types';
import { INITIAL_DATA, MONTHS, YEARS, METRICS } from './constants';
import { DataTable } from './components/DataTable';
import { EmployeeDetailModal } from './components/EmployeeDetailModal';
import { ComparisonReportModal } from './components/ComparisonReportModal';
import { RankingModal } from './components/RankingModal';
import { 
  Plus, Save, ArrowUpDown, Search, ChevronLeft, ChevronRight, 
  Users, Trophy, Eye, EyeOff, Star, Table as TableIcon, Calendar, Lock, Unlock,
  UploadCloud, DownloadCloud, FileUp
} from 'lucide-react';

const ITEMS_PER_PAGE = 20;
const STORAGE_KEY = 'health_analysis_data_v2';
const LOCK_STORAGE_KEY = 'health_analysis_locked';

const OVERALL_METRIC: MetricConfig = {
  key: 'overall' as any,
  label: 'ผลรวมพัฒนาการ (Success Score)',
  unit: '%',
  isLowerBetter: false,
};

const getSuccessScore = (user: UserData): number => {
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

const App: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState('2568');
  const [isLocked, setIsLocked] = useState(() => {
    const saved = localStorage.getItem(LOCK_STORAGE_KEY);
    return saved === null ? true : saved === 'true';
  });
  
  const [allYearsData, setAllYearsData] = useState<Record<string, UserData[]>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return { '2568': [...INITIAL_DATA].sort((a, b) => getSuccessScore(b) - getSuccessScore(a)) };
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [month1, setMonth1] = useState('กันยายน');
  const [month2, setMonth2] = useState('ธันวาคม');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isComparisonReportOpen, setIsComparisonReportOpen] = useState(false);
  const [rankingMetric, setRankingMetric] = useState<MetricConfig | null>(null);
  const [isTableVisible, setIsTableVisible] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(allYearsData)); }, [allYearsData]);
  useEffect(() => { localStorage.setItem(LOCK_STORAGE_KEY, isLocked.toString()); }, [isLocked]);

  const data = useMemo(() => allYearsData[selectedYear] || [], [allYearsData, selectedYear]);

  const updateCurrentYearData = useCallback((newData: UserData[] | ((prev: UserData[]) => UserData[])) => {
    if (isLocked) return;
    setAllYearsData(prev => {
      const currentData = prev[selectedYear] || [];
      const updated = typeof newData === 'function' ? newData(currentData) : newData;
      return { ...prev, [selectedYear]: updated };
    });
  }, [selectedYear, isLocked]);

  const filteredData = useMemo(() => {
    return data.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const handleDataChange = useCallback((id: string, metric: string, field: 'month1' | 'month2', value: string) => {
    if (isLocked) return;
    updateCurrentYearData(prev => prev.map(user => {
      if (user.id !== id) return user;
      return { ...user, [metric]: { ...user[metric as MetricKey], [field]: parseFloat(value) || 0 } };
    }));
  }, [updateCurrentYearData, isLocked]);

  const handleUserUpdate = useCallback((id: string, field: 'name' | 'company', value: string) => {
    if (isLocked) return;
    updateCurrentYearData(prev => prev.map(user => (user.id === id ? { ...user, [field]: value } : user)));
  }, [updateCurrentYearData, isLocked]);

  const handleAddUsers = () => {
    if (isLocked) return;
    const newUser: UserData = {
      id: `${Date.now()}`,
      name: `พนักงานใหม่ ${data.length + 1}`,
      company: 'เจ้าพระยาทัวร์ริสท์โบ๊ท จำกัด',
      weight: { month1: 0, month2: 0 },
      bmi: { month1: 0, month2: 0 },
      fat: { month1: 0, month2: 0 },
      sFat: { month1: 0, month2: 0 },
      muscle: { month1: 0, month2: 0 },
      vFat: { month1: 0, month2: 0 },
    };
    updateCurrentYearData(prev => [newUser, ...prev]);
    setCurrentPage(1);
    setIsTableVisible(true);
  };

  const handleSortByProgress = () => {
    const sorted = [...data].sort((a, b) => getSuccessScore(b) - getSuccessScore(a));
    updateCurrentYearData(sorted);
    setCurrentPage(1);
  };

  const handleExport = () => {
    const exportObject = { 
      year: selectedYear, 
      monthFrom: month1, 
      monthTo: month2, 
      employees: data,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `backup_health_data_${selectedYear}_${new Date().toLocaleDateString('th-TH').replace(/\//g, '-')}.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    if (isLocked) {
      alert("กรุณาปลดล็อคระบบ (Unlock) ก่อนนำเข้าข้อมูล");
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (json.employees && Array.isArray(json.employees)) {
          const importYear = json.year || selectedYear;
          if (window.confirm(`พบข้อมูลของปี ${importYear} จำนวน ${json.employees.length} รายการ คุณต้องการเขียนทับข้อมูลปัจจุบันหรือไม่?`)) {
            setAllYearsData(prev => ({
              ...prev,
              [importYear]: json.employees
            }));
            setSelectedYear(importYear);
            if (json.monthFrom) setMonth1(json.monthFrom);
            if (json.monthTo) setMonth2(json.monthTo);
            setIsTableVisible(true);
            alert("นำเข้าข้อมูลสำเร็จ");
          }
        } else {
          alert("รูปแบบไฟล์ไม่ถูกต้อง กรุณาใช้ไฟล์ที่ Export จากระบบนี้เท่านั้น");
        }
      } catch (error) {
        alert("เกิดข้อผิดพลาดในการอ่านไฟล์");
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  const getRankColorClass = (key: MetricKey | 'overall') => {
    switch(key) {
      case 'overall': return 'bg-yellow-600 shadow-yellow-100';
      case 'weight': return 'bg-indigo-600 shadow-indigo-100';
      case 'bmi': return 'bg-blue-600 shadow-blue-100';
      case 'fat': return 'bg-orange-500 shadow-orange-100';
      case 'sFat': return 'bg-rose-500 shadow-rose-100';
      case 'muscle': return 'bg-emerald-600 shadow-emerald-100';
      case 'vFat': return 'bg-slate-700 shadow-slate-100';
      default: return 'bg-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaf8] p-4 md:p-8 text-slate-800 font-sans">
      <input type="file" ref={fileInputRef} onChange={handleFileImport} accept=".json" className="hidden" />
      
      <div className="max-w-[1920px] mx-auto space-y-6">
        <header className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className={`h-14 w-14 ${isLocked ? 'bg-amber-500' : 'bg-indigo-600'} rounded-2xl flex items-center justify-center text-white shadow-lg transition-colors duration-500`}>
               <Users size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-baseline gap-2">
                Health Analysis <span className="text-indigo-600 bg-indigo-50 px-3 py-0.5 rounded-full">{selectedYear}</span>
                {isLocked && <Lock size={16} className="text-amber-500 ml-1 mb-1" />}
              </h1>
              <p className="text-slate-400 text-sm font-medium">เจ้าพระยาทัวร์ริสท์โบ๊ท จำกัด</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <div className="relative flex-1 min-w-[200px] md:min-w-[320px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="ค้นหาชื่อหรือแผนก..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-100 outline-none text-sm" />
            </div>

            <div className="flex items-center bg-slate-50 border border-slate-100 p-1 rounded-xl">
              <Calendar size={14} className="text-slate-400 ml-2" />
              <select value={selectedYear} onChange={(e) => { setSelectedYear(e.target.value); setCurrentPage(1); }} className="bg-transparent px-2 py-2 text-sm font-bold text-indigo-600 outline-none">
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <select value={month1} onChange={(e) => setMonth1(e.target.value)} className="bg-transparent px-3 py-2 text-sm font-semibold text-slate-700 outline-none">
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <span className="text-slate-300 text-xs">→</span>
              <select value={month2} onChange={(e) => setMonth2(e.target.value)} className="bg-transparent px-3 py-2 text-sm font-semibold text-slate-700 outline-none">
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div className="flex gap-2">
              <div className="flex bg-slate-50 rounded-xl border border-slate-100 p-0.5">
                <button onClick={handleImportClick} title="Restore/Import Data" className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-all"><UploadCloud size={20} /></button>
                <div className="w-[1px] bg-slate-200 my-2"></div>
                <button onClick={handleExport} title="Backup/Export Data" className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-all"><DownloadCloud size={20} /></button>
              </div>

              <button onClick={() => setIsLocked(!isLocked)} className={`p-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 ${isLocked ? 'bg-amber-100 text-amber-600' : 'bg-white border border-slate-200 text-slate-400'}`}>
                {isLocked ? <Lock size={20} /> : <Unlock size={20} />}
                <span className="text-[10px] font-black uppercase hidden md:inline">{isLocked ? 'Locked' : 'Unlock'}</span>
              </button>
              
              <button onClick={handleSortByProgress} title="เรียงตามความสำเร็จ" className="p-2.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl hover:bg-indigo-100"><ArrowUpDown size={20} /></button>
            </div>
          </div>
        </header>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Users className="text-slate-400" size={20} />
                ภาพรวมพนักงานทั้งหมด
              </h2>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">{data.length} รายชื่อ • ประจำปี พ.ศ. {selectedYear}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <button onClick={() => setRankingMetric(OVERALL_METRIC)} className={`${getRankColorClass('overall')} text-white p-5 rounded-[2rem] shadow-lg flex items-center gap-5 hover:scale-[1.02] transition-all group relative overflow-hidden text-left`}>
              <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center shadow-sm"><Star size={24} fill="currentColor" /></div>
              <div><p className="text-[10px] font-black uppercase text-white/70">Success Score</p><p className="text-lg font-black leading-tight">อันดับรวม</p></div>
            </button>
            {METRICS.map((metric) => (
              <button key={metric.key} onClick={() => setRankingMetric(metric)} className={`${getRankColorClass(metric.key)} text-white p-5 rounded-[2rem] shadow-lg flex items-center gap-5 hover:scale-[1.02] transition-all group relative overflow-hidden text-left`}>
                <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center shadow-sm"><Trophy size={24} /></div>
                <div><p className="text-[10px] font-black uppercase text-white/70">Top 10 Rankings</p><p className="text-lg font-black leading-tight">{metric.label}</p></div>
              </button>
            ))}
            <div className="flex gap-2">
               <button onClick={handleAddUsers} disabled={isLocked} className={`flex-1 p-4 rounded-[2rem] border-2 border-dashed flex items-center justify-center gap-3 ${isLocked ? 'bg-slate-50 border-slate-100 opacity-50' : 'bg-white border-slate-200 hover:bg-indigo-50'}`}>
                  <Plus className={isLocked ? 'text-slate-200' : 'text-indigo-600'} size={24} />
                  <span className="font-bold text-sm text-slate-400">เพิ่มพนักงาน</span>
               </button>
               <div className="flex flex-col gap-2 flex-1 min-w-[140px]">
                 <button onClick={() => setIsComparisonReportOpen(true)} className="flex-1 bg-white border border-indigo-100 rounded-2xl text-indigo-600 font-bold hover:bg-indigo-50 flex items-center justify-center gap-2 shadow-sm"><Eye size={16} /><span className="text-[10px] uppercase">ดูรายงาน</span></button>
                 <button 
                    onClick={() => setIsTableVisible(!isTableVisible)} 
                    className={`flex-1 px-4 rounded-2xl font-bold transition-all shadow-sm flex items-center justify-center gap-2 group ${isTableVisible ? 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200' : 'bg-emerald-600 text-white border border-emerald-500 hover:bg-emerald-700'}`}
                  >
                    {isTableVisible ? <EyeOff size={16} /> : <TableIcon size={16} />}
                    <span className="text-[10px] uppercase tracking-wider">{isTableVisible ? 'ซ่อนตาราง' : 'แสดงตาราง'}</span>
                 </button>
               </div>
            </div>
          </div>
        </div>

        {isTableVisible ? (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <DataTable 
              data={paginatedData} 
              month1={month1} 
              month2={month2} 
              isLocked={isLocked} 
              startIndex={(currentPage - 1) * ITEMS_PER_PAGE} 
              onDataChange={handleDataChange} 
              onUserUpdate={handleUserUpdate} 
              onDeleteUser={(id) => updateCurrentYearData(prev => prev.filter(u => u.id !== id))} 
              onViewUser={setSelectedUser} 
            />

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-4 bg-white p-4 rounded-3xl border border-slate-100">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 disabled:opacity-30"><ChevronLeft size={20} /></button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button key={i} onClick={() => setCurrentPage(i + 1)} className={`h-10 w-10 rounded-xl font-bold ${currentPage === i + 1 ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>{i + 1}</button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 disabled:opacity-30"><ChevronRight size={20} /></button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] py-12 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
             <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
               <TableIcon size={32} />
             </div>
             <p className="text-slate-500 font-black uppercase tracking-widest text-xs">ตารางข้อมูลถูกซ่อนอยู่เป็นค่าเริ่มต้น</p>
             <div className="flex gap-3 mt-4">
                <button onClick={() => setIsTableVisible(true)} className="px-6 py-2 bg-indigo-600 text-white rounded-full font-bold text-sm shadow-lg hover:bg-indigo-700 transition-all">แสดงตารางข้อมูล</button>
                <button onClick={handleImportClick} className="px-6 py-2 bg-white border border-slate-200 text-slate-600 rounded-full font-bold text-sm shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
                  <FileUp size={16} /> นำเข้า Backup
                </button>
             </div>
          </div>
        )}

        {selectedUser && <EmployeeDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} month1={month1} month2={month2} />}
        {isComparisonReportOpen && <ComparisonReportModal isOpen={isComparisonReportOpen} onClose={() => setIsComparisonReportOpen(false)} data={data} month1={month1} month2={month2} />}
        {rankingMetric && <RankingModal metric={rankingMetric} onClose={() => setRankingMetric(null)} data={data} />}

        <footer className="text-center text-slate-300 text-[10px] py-10 font-black tracking-widest uppercase">
          Health Analytics Platform • {selectedYear} • Chophraya Tourist Boat Co., Ltd.
        </footer>
      </div>
    </div>
  );
};

export default App;
