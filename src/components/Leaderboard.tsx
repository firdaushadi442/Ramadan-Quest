import { motion } from 'motion/react';
import { ProfileData } from '../types';
import { calculateStats } from '../utils/gameLogic';
import { CONFIG } from '../constants';
import { Crown } from 'lucide-react';

interface LeaderboardProps {
  profiles: Record<string, ProfileData>;
}

export function Leaderboard({ profiles }: LeaderboardProps) {
  const stats1 = calculateStats(profiles.naufal);
  const stats2 = calculateStats(profiles.fateh);

  const leaderId = stats1.totalMoney > stats2.totalMoney ? 'naufal' : stats2.totalMoney > stats1.totalMoney ? 'fateh' : null;
  const diff = Math.abs(stats1.totalMoney - stats2.totalMoney);

  return (
    <div className="bg-slate-900 rounded-3xl p-6 text-white mb-8 border-b-8 border-slate-950 shadow-2xl relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
      
      <h2 className="text-center font-mono text-2xl text-yellow-400 mb-6 uppercase tracking-widest relative z-10">
        Carta Juara
      </h2>

      <div className="flex items-end justify-center gap-4 relative z-10">
        {/* Naufal */}
        <LeaderBar 
          name="Naufal" 
          score={stats1.totalMoney} 
          isLeader={leaderId === 'naufal'} 
          color="bg-red-500"
          heightPercent={(stats1.totalMoney / (CONFIG.MAX_TICKS * 2)) * 100} // Rough max
        />

        {/* VS Divider */}
        <div className="pb-8 font-black text-slate-600 italic text-xl">VS</div>

        {/* Fateh */}
        <LeaderBar 
          name="Fateh" 
          score={stats2.totalMoney} 
          isLeader={leaderId === 'fateh'} 
          color="bg-green-500"
          heightPercent={(stats2.totalMoney / (CONFIG.MAX_TICKS * 2)) * 100}
        />
      </div>

      {/* Difference Badge */}
      {diff > 0 && (
        <div className="mt-6 flex justify-center">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-xs font-mono text-slate-300 border border-white/20">
            Beza: <span className="text-white font-bold">RM {diff.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function LeaderBar({ name, score, isLeader, color, heightPercent }: any) {
  return (
    <div className="flex flex-col items-center w-24">
      {isLeader && (
        <motion.div 
          initial={{ y: 10, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          className="text-yellow-400 mb-2 drop-shadow-lg"
        >
          <Crown size={32} fill="currentColor" />
        </motion.div>
      )}
      <div className="font-mono text-2xl font-bold mb-1">
        {score.toFixed(2)}
      </div>
      <motion.div 
        className={`w-full rounded-t-xl ${color} relative`}
        initial={{ height: 0 }}
        animate={{ height: Math.max(60, heightPercent * 2) }} // Min height 60px
      >
        <div className="absolute bottom-0 w-full p-2 text-center font-bold text-sm text-white/90 uppercase tracking-tighter">
          {name}
        </div>
      </motion.div>
    </div>
  );
}
