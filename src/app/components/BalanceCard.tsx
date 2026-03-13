import { Wallet, Eye, EyeOff, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface BalanceCardProps {
  cryptoBalance: number;
  fiatBalance: number;
  exchangeRate?: number;
}

export default function BalanceCard({ 
  cryptoBalance, 
  fiatBalance, 
  exchangeRate = 1600 
}: BalanceCardProps) {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <div className="bg-gradient-to-r from-[#2C2C2C] to-[#2C2C2C]/80 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Wallet className="text-[#F6A100]" size={20} />
          <span className="text-gray-400">Total Balance</span>
        </div>
        <button onClick={() => setShowBalance(!showBalance)}>
          {showBalance ? <Eye size={18} className="text-gray-400" /> : <EyeOff size={18} className="text-gray-400" />}
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-400 text-sm">Crypto</span>
            <span className="text-[#F6A100] font-bold text-2xl">
              {showBalance ? `${cryptoBalance} USDT` : '••••••'}
            </span>
          </div>
          {showBalance && (
            <p className="text-gray-500 text-xs">≈ ₦{(cryptoBalance * exchangeRate).toLocaleString()}</p>
          )}
        </div>
        
        <div className="border-t border-gray-700 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Fiat</span>
            <span className="text-white font-bold text-2xl">
              {showBalance ? `₦${fiatBalance.toLocaleString()}` : '••••••'}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1 text-xs text-green-500">
        <TrendingUp size={12} />
        <span>+2.4% from last month</span>
      </div>
    </div>
  );
}