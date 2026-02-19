import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CONFIG } from '../constants';
import { ProfileData } from '../types';
import { calculateStats, getDayStatus } from '../utils/gameLogic';
import { GameCard } from './ui/GameCard';
import { GameButton } from './ui/GameButton';
import { DynamicTree } from './Tree';
import { Check, Star, Moon, Sun } from 'lucide-react';

interface ProfileSectionProps {
  profile: ProfileData;
  profileConfig: typeof CONFIG.PROFILES[number];
  onUpdate: (date: string, dayIndex: number, field: 'fast' | 'tarawih', value: any) => void;
  currentDate: string;
}

export function ProfileSection({ profile, profileConfig, onUpdate, currentDate }: ProfileSectionProps) {
  const stats = calculateStats(profile);
  const [expandedDay, setExpandedDay] = useState<string | null>(currentDate);

  // Generate days array
  const days = Array.from({ length: CONFIG.TOTAL_DAYS }, (_, i) => {
    const date = new Date(CONFIG.START_DATE);
    date.setDate(date.getDate() + i);
    return {
      date: date.toISOString().split('T')[0],
      dayIndex: i + 1,
    };
  });

  // Determine consistency (simple logic: is total ticks >= dayIndex * 1?)
  // Actually, let's make it: has at least 1 tick for the current day?
  const todayRecord = profile.records[currentDate];
  const isConsistent = todayRecord ? (!!todayRecord.fast || todayRecord.tarawih) : false;

  return (
    <div className="mb-12">
      {/* Header Card */}
      <GameCard color={profileConfig.color as any} className="mb-6 relative overflow-visible">
        <div className="p-6 flex flex-col items-center">
          
          {/* Avatar & Name */}
          <div className="flex items-center gap-4 mb-4 w-full">
            <div className="w-16 h-16 rounded-full bg-white border-4 border-slate-200 shadow-inner flex items-center justify-center text-3xl overflow-hidden">
               <img 
                 src={profileConfig.id === 'naufal'
                   ? `https://api.dicebear.com/9.x/avataaars/svg?seed=Naufal123&backgroundColor=b6e3f4`
                   : `https://api.dicebear.com/9.x/avataaars/svg?seed=${profileConfig.name}&backgroundColor=ffdfbf`
                 }
                 alt={profileConfig.name} 
                 className="w-full h-full object-cover"
               />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-800 font-mono">
                {profileConfig.name}
              </h2>
              <div className="flex gap-2 text-xs font-bold text-slate-500 uppercase">
                <span>Lvl {Math.floor(stats.totalTicks / 5) + 1}</span>
                <span>•</span>
                <span>{stats.completedDays} Perfect Days</span>
              </div>
            </div>
            
            {/* Coin Counter HUD */}
            <div className="bg-slate-900 text-yellow-400 px-4 py-2 rounded-xl font-mono text-2xl border-b-4 border-slate-700 shadow-lg flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-yellow-300" />
              RM {stats.totalMoney.toFixed(2)}
            </div>
          </div>

          {/* Tree Visualization */}
          <div className="w-full bg-gradient-to-b from-transparent to-white/50 rounded-xl border-b-4 border-black/5 p-4 mb-4">
            <DynamicTree 
              ticks={stats.totalTicks} 
              maxTicks={CONFIG.MAX_TICKS} 
              isConsistent={isConsistent} 
            />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 w-full">
            <StatBox label="Puasa" value={stats.fullFasts} icon={<Sun size={14} />} />
            <StatBox label="Separuh" value={stats.halfFasts} icon={<Moon size={14} />} />
            <StatBox label="Tarawih" value={stats.tarawihs} icon={<Star size={14} />} />
          </div>

        </div>
      </GameCard>

      {/* Days List */}
      <div className="space-y-3">
        <h3 className="font-mono text-xl text-slate-700 uppercase ml-2 mb-2">Jurnal Ramadan</h3>
        {days.map((day) => {
          const status = getDayStatus(day.date, currentDate);
          const record = profile.records[day.date] || { fast: null, tarawih: false };
          const isExpanded = expandedDay === day.date;
          const isLocked = status === 'future';
          
          // Auto-scroll to today (simple ref logic could be added here, but native focus is okay for now)

          return (
            <GameCard 
              key={day.date} 
              color={day.date === currentDate ? 'orange' : 'white'}
              className={`transition-all ${isLocked ? 'opacity-60 grayscale' : ''}`}
            >
              <div 
                className="p-4 flex items-center justify-between cursor-pointer active:bg-black/5"
                onClick={() => !isLocked && setExpandedDay(isExpanded ? null : day.date)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono text-xl font-bold ${day.date === currentDate ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {day.dayIndex}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-sm">
                      {new Date(day.date).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short' })} • {day.dayIndex} Ramadan
                    </div>
                    <div className="text-xs text-slate-500 font-mono uppercase">
                      {status === 'today' ? 'Hari Ini' : status === 'future' ? 'Akan Datang' : 'Lepas'}
                    </div>
                  </div>
                </div>

                {/* Mini Status Indicators */}
                <div className="flex gap-1">
                  {record.fast === 'full' && <div className="w-3 h-3 rounded-full bg-green-500" />}
                  {record.fast === 'half' && <div className="w-3 h-3 rounded-full bg-yellow-500" />}
                  {record.tarawih && <div className="w-3 h-3 rounded-full bg-purple-500" />}
                </div>
              </div>

              {/* Expanded Controls */}
              <AnimatePresence>
                {isExpanded && !isLocked && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-slate-50 border-t-2 border-slate-100 p-4 space-y-4"
                  >
                    {/* Fasting Selection */}
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Puasa (Pilih Satu)</label>
                      <div className="grid grid-cols-2 gap-3">
                        <SelectionButton 
                          selected={record.fast === 'full'} 
                          onClick={() => onUpdate(day.date, day.dayIndex, 'fast', record.fast === 'full' ? null : 'full')}
                          color="green"
                          label="Penuh"
                          subLabel="+RM1.00"
                          icon={<Sun />}
                        />
                        <SelectionButton 
                          selected={record.fast === 'half'} 
                          onClick={() => onUpdate(day.date, day.dayIndex, 'fast', record.fast === 'half' ? null : 'half')}
                          color="yellow"
                          label="Separuh"
                          subLabel="+RM0.50"
                          icon={<Moon />}
                        />
                      </div>
                    </div>

                    {/* Tarawih Selection */}
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Ibadah Malam</label>
                      <SelectionButton 
                        selected={record.tarawih} 
                        onClick={() => onUpdate(day.date, day.dayIndex, 'tarawih', !record.tarawih)}
                        color="purple"
                        label="Solat Tarawih"
                        subLabel="+RM1.00"
                        icon={<Star />}
                        fullWidth
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GameCard>
          );
        })}
      </div>
    </div>
  );
}

function StatBox({ label, value, icon }: { label: string, value: number, icon: ReactNode }) {
  return (
    <div className="bg-white rounded-lg p-2 border-2 border-slate-100 flex flex-col items-center justify-center shadow-sm">
      <div className="text-slate-400 mb-1">{icon}</div>
      <div className="font-mono text-xl font-bold text-slate-800 leading-none">{value}</div>
      <div className="text-[10px] font-bold uppercase text-slate-400 mt-1">{label}</div>
    </div>
  );
}

function SelectionButton({ selected, onClick, color, label, subLabel, icon, fullWidth }: any) {
  const colors = {
    green: selected ? 'bg-green-500 text-white border-green-700' : 'bg-white text-slate-600 border-slate-200 hover:border-green-300',
    yellow: selected ? 'bg-yellow-400 text-yellow-900 border-yellow-600' : 'bg-white text-slate-600 border-slate-200 hover:border-yellow-300',
    purple: selected ? 'bg-purple-500 text-white border-purple-700' : 'bg-white text-slate-600 border-slate-200 hover:border-purple-300',
  };

  return (
    <button 
      onClick={onClick}
      className={`
        ${fullWidth ? 'w-full' : ''}
        relative p-3 rounded-xl border-b-4 transition-all active:scale-95 active:border-b-0
        flex flex-col items-center justify-center gap-1
        ${colors[color as keyof typeof colors]}
      `}
    >
      {selected && (
        <div className="absolute top-2 right-2">
          <Check size={16} strokeWidth={4} />
        </div>
      )}
      <div className="mb-1">{icon}</div>
      <div className="font-bold text-sm leading-tight">{label}</div>
      <div className={`text-xs font-mono ${selected ? 'opacity-90' : 'text-slate-400'}`}>{subLabel}</div>
    </button>
  );
}
