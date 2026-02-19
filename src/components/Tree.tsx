import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface TreeProps {
  ticks: number; // Total accumulated ticks (0 to 60)
  maxTicks: number;
  isConsistent: boolean; // If the user is keeping up with the current day
}

export function DynamicTree({ ticks, maxTicks, isConsistent }: TreeProps) {
  // Granular growth logic
  // 0-5: Seed & Sprout
  // 5-15: Small Tree
  // 15-30: Medium Tree
  // 30-60: Big Tree with Fruits
  
  // Calculate scale based on ticks (0.2 to 1.5)
  const scale = 0.2 + (ticks / maxTicks) * 1.3;
  
  // Calculate number of leaves (1 leaf every 3 ticks, max 20)
  const leafCount = Math.min(Math.floor(ticks / 2), 25);
  
  // Calculate fruits (1 fruit every 5 ticks, starting from tick 10)
  const fruitCount = ticks > 10 ? Math.floor((ticks - 10) / 5) : 0;

  // Generate deterministic random positions for leaves/fruits based on index
  const getPosition = (index: number, type: 'leaf' | 'fruit') => {
    const angle = (index * 137.5) * (Math.PI / 180); // Golden angle
    const radius = 20 + (index * 3); // Spiral out
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius - (index * 4); // Grow upwards
    return { x, y };
  };

  return (
    <div className="relative w-full h-64 flex items-end justify-center overflow-visible">
      {/* Soil/Pot Area */}
      <div className="absolute bottom-0 w-32 h-8 bg-amber-800/50 rounded-[50%] blur-sm z-0" />
      
      <motion.div
        key={ticks} // Trigger animation on tick change
        className="relative z-10 flex flex-col items-center origin-bottom"
        initial={{ scale: scale * 0.9 }} // Start slightly smaller for "pop" effect
        animate={{ 
          scale: scale,
          rotate: isConsistent ? 0 : -5, // Lean if inconsistent
          filter: isConsistent ? 'saturate(1)' : 'saturate(0.5) sepia(0.3)', // Yellowish if inconsistent
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }} // Bouncy spring
      >
        {/* Stem/Trunk */}
        <svg width="20" height="200" viewBox="0 0 20 200" className="overflow-visible">
          {/* Main Trunk */}
          <motion.path 
            d="M10,200 C10,150 5,100 10,50 C15,0 10,-20 10,-40" 
            stroke="#5D4037" 
            strokeWidth={4 + (ticks / 10)} 
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: Math.min(1, ticks / 5) }}
          />
        </svg>

        {/* Leaves Container - Absolute positioned relative to the top of the trunk roughly */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-0 h-0">
           {Array.from({ length: leafCount }).map((_, i) => {
             const pos = getPosition(i, 'leaf');
             return (
               <motion.div
                 key={`leaf-${i}`}
                 className="absolute"
                 initial={{ scale: 0, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 transition={{ delay: i * 0.05 }}
                 style={{ 
                   left: pos.x, 
                   bottom: -pos.y, // Invert Y for bottom-up growth
                 }}
               >
                 <div className={`w-6 h-6 rounded-tr-3xl rounded-bl-3xl ${isConsistent ? 'bg-green-500' : 'bg-yellow-500'} shadow-sm transform -rotate-45`} />
               </motion.div>
             );
           })}

           {/* Fruits */}
           {Array.from({ length: fruitCount }).map((_, i) => {
             const pos = getPosition(i + 5, 'fruit'); // Offset index to mix with leaves
             return (
               <motion.div
                 key={`fruit-${i}`}
                 className="absolute"
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 transition={{ delay: 0.5 + (i * 0.1) }}
                 style={{ 
                   left: pos.x + 5, 
                   bottom: -pos.y + 5,
                 }}
               >
                 <div className="w-4 h-4 bg-red-500 rounded-full shadow-md animate-bounce" />
               </motion.div>
             );
           })}
        </div>

        {/* Sparkles for consistent users */}
        {isConsistent && ticks > 5 && (
          <motion.div 
            className="absolute -top-20"
            animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            ✨
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
