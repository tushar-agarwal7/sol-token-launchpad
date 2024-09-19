import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AlertProps {
  type: 'success' | 'error';
  message: string;
  onClose?: () => void;
}

const Alert = ({ type, message, onClose }: AlertProps) => {
  return (
    <motion.div
      className={cn(
        'p-4 rounded-lg shadow-lg flex items-center justify-between',
        type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      )}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <span>{message}</span>
      {onClose && (
        <button
          className="ml-4 p-1 bg-white text-black rounded-full"
          onClick={onClose}
        >
          &times;
        </button>
      )}
    </motion.div>
  );
};

export default Alert;
