import React from 'react';
import { motion } from 'framer-motion';

export interface LoaderOneProps {
  color?: string;
  className?: string;
}

const LoaderOne = ({ color = 'bg-[#D92735]', className = '' }: LoaderOneProps = {}) => {
  return (
    <div className={`flex items-center justify-center gap-1.5 ${className}`}>
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className={`h-3 w-3 rounded-full ${color}`}
          initial={{ x: 0 }}
          animate={{
            x: [0, 8, 0],
            opacity: [0.4, 1, 0.4],
            scale: [0.9, 1.25, 0.9],
          }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            delay: i * 0.18,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export default LoaderOne;

