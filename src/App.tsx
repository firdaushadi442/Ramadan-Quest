import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { CONFIG } from './constants';
import { ProfileSection } from './components/ProfileSection';
import { Leaderboard } from './components/Leaderboard';
import { GameButton } from './components/ui/GameButton';
import { RotateCcw } from 'lucide-react';

function App() {
  const { state, updateRecord, resetData } = useLocalStorage();
  const [currentDate, setCurrentDate] = useState('');
  const [activeTab, setActiveTab] = useState<string>(CONFIG.PROFILES[0].id);

  // Set current date on mount (and simulate the fixed start date logic if needed)
  useEffect(() => {
    // Hardcoded to 20 Feb 2026 as per user request
    setCurrentDate('2026-02-20');
  }, []);

  const handleUpdate = (profileId: string, date: string, dayIndex: number, field: 'fast' | 'tarawih', value: any) => {
    updateRecord(profileId, date, dayIndex, { [field]: value });
    
    // Play sound (optional, using simple browser API if possible, or just visual)
    // const audio = new Audio(SOUNDS.POP);
    // audio.play().catch(() => {}); 
  };

  return (
    <div className="min-h-screen bg-sky-300 font-sans selection:bg-yellow-300 overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-sky-400 to-sky-200" />
        {/* Clouds */}
        <div className="absolute top-10 left-10 opacity-80 animate-pulse">☁️</div>
        <div className="absolute top-20 right-20 opacity-60 scale-150 animate-bounce">☁️</div>
        <div className="absolute top-40 left-1/2 opacity-40 scale-75">☁️</div>
        
        {/* Ground */}
        <div className="absolute bottom-0 w-full h-12 bg-amber-700 border-t-8 border-green-500" />
      </div>

      <div className="relative z-10 max-w-md md:max-w-5xl mx-auto px-4 py-8 pb-24">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="font-mono text-4xl text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.2)] uppercase tracking-widest mb-2">
            Ramadan Quest
          </h1>
          <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-white font-bold text-sm border border-white/30">
            1447H Edition
          </div>
        </header>

        {/* Leaderboard */}
        <div className="max-w-md mx-auto mb-8">
          <Leaderboard profiles={state.profiles} />
        </div>

        {/* Profile Tabs (Mobile Only) */}
        <div className="flex gap-4 mb-6 md:hidden">
          {CONFIG.PROFILES.map((profile) => {
            const isActive = activeTab === profile.id;
            return (
              <button
                key={profile.id}
                onClick={() => setActiveTab(profile.id)}
                className={`
                  flex-1 py-3 px-4 rounded-2xl font-mono text-xl font-bold uppercase tracking-wider border-b-4 transition-all
                  ${isActive 
                    ? profile.id === 'naufal' 
                      ? 'bg-blue-500 text-white border-blue-700 shadow-lg scale-105' 
                      : 'bg-orange-500 text-white border-orange-700 shadow-lg scale-105'
                    : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'
                  }
                `}
              >
                {profile.name}
              </button>
            );
          })}
        </div>

        {/* Profiles Container */}
        <div className="md:grid md:grid-cols-2 md:gap-8 min-h-[500px]">
          {/* 
             On Mobile: Filter by activeTab.
             On Desktop: Show all profiles.
          */}
          {CONFIG.PROFILES.filter(p => {
            // Check if we are on desktop (simple check via CSS display logic isn't enough for JS filter)
            // Instead, we render ALL on desktop via CSS hiding? No, that's heavy.
            // Better: Render based on a simple "isDesktop" hook or just render all and hide via CSS classes?
            // CSS classes are best for SSR/hydration consistency.
            return true; 
          }).map((profileConfig) => (
            <div 
              key={profileConfig.id}
              className={`
                ${activeTab === profileConfig.id ? 'block' : 'hidden'} 
                md:block
              `}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ProfileSection
                  profile={state.profiles[profileConfig.id]}
                  profileConfig={profileConfig}
                  onUpdate={(date, dayIndex, field, value) => handleUpdate(profileConfig.id, date, dayIndex, field, value)}
                  currentDate={currentDate}
                />
              </motion.div>
            </div>
          ))}
        </div>

        {/* Footer / Reset */}
        <div className="mt-12 text-center">
          <GameButton variant="danger" size="sm" onClick={resetData} className="opacity-50 hover:opacity-100">
            <div className="flex items-center gap-2">
              <RotateCcw size={14} /> Reset Semua Data
            </div>
          </GameButton>
          <p className="mt-4 text-xs text-sky-800/50 font-mono">
            Dibuat untuk Naufal & Fateh
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
