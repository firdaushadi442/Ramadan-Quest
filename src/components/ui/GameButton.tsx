import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function GameButton({ children, variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  const baseStyles = "relative font-bold uppercase tracking-wide rounded-2xl transition-all active:translate-y-1 active:border-b-0 outline-none select-none";
  
  const variants = {
    primary: "bg-yellow-400 text-yellow-900 border-b-4 border-yellow-600 hover:bg-yellow-300",
    secondary: "bg-white text-slate-700 border-b-4 border-slate-300 hover:bg-slate-50",
    danger: "bg-red-500 text-white border-b-4 border-red-700 hover:bg-red-400",
    success: "bg-green-500 text-white border-b-4 border-green-700 hover:bg-green-400",
  };

  const sizes = {
    sm: "px-3 py-1 text-xs border-b-2 rounded-lg",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-lg w-full",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
