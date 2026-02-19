import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface GameCardProps {
  children: ReactNode;
  className?: string;
  color?: 'blue' | 'orange' | 'white' | 'red' | 'green';
}

export function GameCard({ children, className = '', color = 'white' }: GameCardProps) {
  const colors = {
    blue: "bg-sky-100 border-sky-300",
    orange: "bg-orange-100 border-orange-300",
    white: "bg-white border-slate-200",
    red: "bg-red-100 border-red-300",
    green: "bg-green-100 border-green-300",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-3xl border-4 shadow-lg overflow-hidden ${colors[color]} ${className}`}
    >
      {children}
    </motion.div>
  );
}
