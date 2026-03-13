'use client';

import { motion } from 'framer-motion';
import { Check, AlertCircle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message?: string;
  type?: 'success' | 'warning' | 'info';
  children?: React.ReactNode;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'info',
  children
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch(type) {
      case 'success':
        return <Check className="text-green-500" size={24} />;
      case 'warning':
        return <AlertCircle className="text-yellow-500" size={24} />;
      default:
        return <AlertCircle className="text-[#F6A100]" size={24} />;
    }
  };

  const getIconBg = () => {
    switch(type) {
      case 'success':
        return 'bg-green-500 bg-opacity-20';
      case 'warning':
        return 'bg-yellow-500 bg-opacity-20';
      default:
        return 'bg-[#F6A100] bg-opacity-20';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
      <motion.div 
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-[#2C2C2C] rounded-2xl p-6 w-full max-w-sm"
      >
        <div className={`w-12 h-12 ${getIconBg()} rounded-full flex items-center justify-center mx-auto mb-4`}>
          {getIcon()}
        </div>
        
        <h3 className="text-xl font-bold text-center mb-2">{title}</h3>
        {message && <p className="text-gray-400 text-center mb-6">{message}</p>}
        
        {children}

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-600 text-white font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-xl font-semibold ${
              type === 'success' 
                ? 'bg-green-500 text-white'
                : type === 'warning'
                ? 'bg-yellow-500 text-white'
                : 'bg-[#F6A100] text-[#1F1F1F]'
            }`}
          >
            Confirm
          </button>
        </div>
      </motion.div>
    </div>
  );
}