
// Add missing useCallback import to fix "Cannot find name 'useCallback'" error
import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { UserData, MetricConfig } from '../types';
import { METRICS } from '../constants';
import { X, Trophy, Medal, Star, Scale, Activity, Flame, Zap, Heart, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RankingModalProps {
  metric: MetricConfig | null;
  onClose: () => void;
  data: UserData[];
}

export const RankingModal: React.FC<RankingModalProps> = ({ metric, onClose, data }) => {
  const [isShuffling, setIsShuffling] = useState(true);
  const [revealedCount, setRevealedCount] = useState(0); // 0: none, 1: 3rd, 2: 2nd, 3: 1st
  const [displayData, setDisplayData] = useState<any[]>([]);

  const isOverall = metric?.key === 'overall' as any;

  // Final sorted top 10 data
  const topTen = useMemo(() => {
    if (!metric) return [];
    return [...data]
      .map(u => {
        let progress = 0;
        if (isOverall) {
          let totalPctChange = 0;
          let validCount = 0;
          METRICS.forEach(m => {
            const v1 = u[m.key].month1;
            const v2 = u[m.key].month2;
            if (v1 > 0 && v2 > 0) {
              let pct = m.isLowerBetter ? ((v1 - v2) / v1) * 100 : ((v2 - v1) / v1) * 100;
              totalPctChange += pct;
              validCount++;
            }
          });
          progress = validCount > 0 ? totalPctChange / validCount : 0;
        } else {
          const v1 = u[metric.key].month1;
          const v2 = u[metric.key].month2;
          if (v1 > 0 && v2 > 0) {
            progress = metric.isLowerBetter ? (v1 - v2) : (v2 - v1);
          } else {
            return null;
          }
        }
        return { ...u, progressValue: progress };
      })
      .filter((u): u is any => u !== null && u.progressValue !== 0)
      .sort((a, b) => b.progressValue - a.progressValue)
      .slice(0, 10);
  }, [data, metric, isOverall]);

  const triggerConfetti = useCallback((isGrand: boolean) => {
    const duration = isGrand ? 6 * 1000 : 2 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 35, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = isGrand ? 70 * (timeLeft / duration) : 25;
      
      confetti({ 
        ...defaults, 
        particleCount, 
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: isGrand ? ['#ca8a04', '#eab308', '#fefce8', '#ffffff'] : undefined
      });
      confetti({ 
        ...defaults, 
        particleCount, 
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: isGrand ? ['#ca8a04', '#eab308', '#fefce8', '#ffffff'] : undefined
      });
    }, 250);
  }, []);

  useEffect(() => {
    if (!metric || topTen.length === 0) return;

    setIsShuffling(true);
    setRevealedCount(0);
    let shuffleCount = 0;
    const maxShuffles = 35; // Increased shuffling for longer suspense (3.5s)
    
    const shuffleInterval = setInterval(() => {
      shuffleCount++;
      
      const randomList = Array.from({ length: Math.min(topTen.length, 6) }).map(() => {
        const randomUser = data[Math.floor(Math.random() * data.length)];
        return {
          ...randomUser,
          progressValue: (Math.random() * 20) - 5
        };
      });
      
      setDisplayData(randomList);

      if (shuffleCount >= maxShuffles) {
        clearInterval(shuffleInterval);
        setIsShuffling(false);
        startRevealSequence();
      }
    }, 100);

    const startRevealSequence = async () => {
      // Extended sequence for dramatic effect
      
      // Initial pause after shuffle
      await new Promise(r => setTimeout(r, 1500));

      // Step 1: Reveal 3rd Place (Index 2)
      if (topTen.length >= 3) {
        setRevealedCount(1);
        triggerConfetti(false);
        await new Promise(r => setTimeout(r, 2000)); // 2s pause
      } else {
        // If less than 3, skip to end
        setRevealedCount(3);
        triggerConfetti(true);
        return;
      }

      // Step 2: Reveal 2nd Place (Index 1)
      if (topTen.length >= 2) {
        setRevealedCount(2);
        triggerConfetti(false);
        await new Promise(r => setTimeout(r, 2500)); // 2.5s pause for final build-up
      }

      // Step 3: Reveal Champion (Index 0)
      setRevealedCount(3);
      triggerConfetti(true);
    };

    return () => clearInterval(shuffleInterval);
  }, [topTen, data, triggerConfetti, metric]);

  if (!metric) return null;

  const getMetricIcon = (key: string) => {
    if (isOverall) return <Trophy size={28} />;
    switch(key) {
      case 'weight': return <Scale size={24} />;
      case 'bmi': return <Activity size={24} />;
      case 'fat': return <Flame size={24} />;
      case 'sFat': return <Flame size={24} />;
      case 'muscle': return <Zap size={24} />;
      case 'vFat': return <Heart size={24} />;
      default: return <Trophy size={24} />;
    }
  };

  const getRankStyle = (index: number) => {
    const isRevealed = !isShuffling && (
      (index === 0 && revealedCount >= 3) ||
      (index === 1 && revealedCount >= 2) ||
      (index === 2 && revealedCount >= 1) ||
      (index >= 3)
    );

    if (!isRevealed) {
       return { 
         container: 'bg-white/50 border-slate-100 opacity-20 blur-[6px] grayscale scale-90 translate-y-4', 
         text: 'text-slate-300', 
         nameSize: 'text-base', 
         statSize: 'text-sm', 
         medal: <Loader2 className="animate-spin text-slate-100" size={24} /> 
       };
    }
    
    switch(index) {
      case 0: return { 
        container: 'bg-yellow-50 border-yellow-300 shadow-2xl shadow-yellow-200/60 z-10 ring-4 ring-yellow-400/20 animate-champion-zoom my-12 py-10',
        text: 'text-yellow-700', 
        nameSize: 'text-3xl',
        statSize: 'text-2xl',
        medal: <Trophy className="text-yellow-500 animate-bounce" size={64} /> 
      };
      case 1: return { 
        container: 'bg-slate-50 border-slate-200 shadow-sm animate-in zoom-in-95 slide-in-from-bottom-8 duration-1000',
        text: 'text-slate-600', 
        nameSize: 'text-base',
        statSize: 'text-sm',
        medal: <Medal className="text-slate-400" size={32} /> 
      };
      case 2: return { 
        container: 'bg-orange-50 border-orange-200 shadow-sm animate-in zoom-in-95 slide-in-from-bottom-8 duration-1000',
        text: 'text-orange-700', 
        nameSize: 'text-base',
        statSize: 'text-sm',
        medal: <Medal className="text-orange-500" size={32} /> 
      };
      default: return { 
        container: 'bg-white border-slate-100 shadow-sm animate-in fade-in duration-500',
        text: 'text-slate-400', 
        nameSize: 'text-base',
        statSize: 'text-sm',
        medal: <Star className="text-slate-100" size={20} /> 
      };
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-2xl animate-in fade-in duration-700">
      <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 border border-white/20">
        
        {/* Header */}
        <div className={`${isOverall ? 'bg-yellow-600' : 'bg-indigo-600'} px-8 py-8 text-white flex justify-between items-center relative overflow-hidden transition-colors`}>
          <div className="absolute top-0 right-0 p-8 opacity-10">
            {getMetricIcon(metric.key as any)}
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
              {isOverall ? <Star fill="currentColor" size={28} /> : <Trophy size={28} />}
              {metric.label}
            </h2>
            <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.25em] mt-2">
              {isShuffling ? 'กำลังวิเคราะห์ผลคะแนน...' : (revealedCount < 3 ? 'เตรียมประกาศผลผู้ชนะ...' : (isOverall ? 'ตารางอันดับเกียรติยศ' : 'ตารางอันดับพัฒนาการยอดเยี่ยม'))}
            </p>
          </div>
          <button onClick={onClose} className="relative z-10 p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={28} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-12 bg-slate-50/50 custom-scrollbar max-h-[75vh]">
          {(isShuffling || revealedCount < 3) && (
            <div className="flex flex-col items-center justify-center py-6 space-y-6">
               <div className={`h-24 w-24 ${isShuffling ? 'bg-indigo-100 text-indigo-500' : 'bg-yellow-100 text-yellow-600'} rounded-full flex items-center justify-center shadow-inner transition-colors duration-1000`}>
                  <Loader2 className="animate-spin-slow" size={48} />
               </div>
               <div className="text-center space-y-2">
                 <p className="font-black text-slate-800 uppercase tracking-widest text-lg">
                   {isShuffling ? 'ANALYZING DATA' : (revealedCount === 0 ? 'READY TO START' : (revealedCount === 1 ? 'REVEALING SILVER...' : 'FINAL COUNTDOWN...'))}
                 </p>
                 <p className="font-bold text-slate-400 text-xs tracking-[0.2em] uppercase">กรุณารอสักครู่เพื่อความตื่นเต้น</p>
               </div>
            </div>
          )}

          {(isShuffling ? displayData : topTen).length > 0 ? (
            <div className="space-y-6 pb-12">
              {(isShuffling ? displayData : topTen).map((user, idx) => {
                const style = getRankStyle(idx);
                const isChampion = idx === 0 && !isShuffling && revealedCount >= 3;
                
                return (
                  <div key={user.id + idx} className={`${style.container} p-6 rounded-[3rem] border flex items-center gap-8 transition-all duration-1000 ease-out relative ${isChampion ? '' : 'overflow-hidden'}`}>
                    <div className={`${isChampion ? 'h-24 w-24' : 'h-14 w-14'} flex items-center justify-center shrink-0`}>
                      {style.medal}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-4">
                        <span className={`${isChampion ? 'text-4xl' : 'text-xl'} font-black ${style.text}`}>{idx + 1}</span>
                        <h3 className={`${style.nameSize} font-black text-slate-800 truncate tracking-tight`}>{user.name}</h3>
                      </div>
                      <p className={`${isChampion ? 'text-base' : 'text-[11px]'} text-slate-400 font-bold uppercase tracking-[0.15em] truncate mt-1`}>{user.company}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`${style.statSize} font-black ${style.text} tracking-tighter`}>
                        {user.progressValue > 0 ? '+' : ''}{user.progressValue.toFixed(isOverall ? 2 : 1)} {metric.unit}
                      </p>
                      <p className={`${isChampion ? 'text-xs' : 'text-[10px]'} text-slate-400 font-black uppercase tracking-widest`}>
                        {isOverall ? 'Success Progress' : 'พัฒนาการ'}
                      </p>
                    </div>
                    {isChampion && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs md:text-sm font-black px-10 py-2.5 rounded-full shadow-2xl uppercase tracking-[0.25em] ring-8 ring-white z-20 animate-bounce">
                        THE CHAMPION
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : !isShuffling && topTen.length === 0 ? (
            <div className="py-24 text-center space-y-6">
              <div className="h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <Trophy size={48} />
              </div>
              <div className="space-y-2">
                <p className="text-slate-600 font-black text-xl">ยังไม่มีข้อมูลอันดับ</p>
                <p className="text-slate-400 text-sm font-medium">กรุณาระบุข้อมูลทั้ง 2 เดือนเพื่อประมวลผลอันดับยอดเยี่ยม</p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="bg-white px-10 py-6 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-300 font-black uppercase tracking-[0.3em]">
          <span>Chophraya Health Analytics</span>
          <div className="flex items-center gap-2">
            <Star size={12} fill="currentColor" />
            <span>{isOverall ? 'Global Leaderboard' : 'Top 10 Rankings'}</span>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes champion-zoom {
          0% { transform: scale(0.9) translateY(20px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-champion-zoom {
          animation: champion-zoom 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
