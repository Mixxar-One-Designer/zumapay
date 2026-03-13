'use client';

import { ChevronRight } from 'lucide-react';

interface TransactionItemProps {
  type: 'deposit' | 'withdrawal' | 'conversion';
  amount: string;
  fiat?: string;
  status: 'completed' | 'processing' | 'failed';
  date: string;
  icon: any;
  color: string;
  onClick?: () => void;
}

export default function TransactionItem({
  type,
  amount,
  fiat,
  status,
  date,
  icon: Icon,
  color,
  onClick
}: TransactionItemProps) {
  const getStatusColor = () => {
    switch(status) {
      case 'completed':
        return 'text-green-500 bg-green-500 bg-opacity-20';
      case 'processing':
        return 'text-yellow-500 bg-yellow-500 bg-opacity-20';
      default:
        return 'text-red-500 bg-red-500 bg-opacity-20';
    }
  };

  return (
    <div 
      onClick={onClick}
      className="bg-[#2C2C2C] rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:bg-opacity-80 transition-all"
    >
      <div className={`p-2 rounded-full ${color.replace('text', 'bg')} bg-opacity-20`}>
        <Icon className={color} size={20} />
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-start mb-1">
          <span className="text-white font-medium capitalize">{type}</span>
          <span className={color}>{amount}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs">{date}</span>
          <div className="flex items-center gap-2">
            {fiat && <span className="text-white text-sm">{fiat}</span>}
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor()}`}>
              {status}
            </span>
          </div>
        </div>
      </div>
      
      <ChevronRight className="text-gray-400" size={18} />
    </div>
  );
}