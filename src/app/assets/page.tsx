'use client';

import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  ExternalLink,
  CircleDollarSign,
  Bitcoin,
  Coins,
  Zap
} from 'lucide-react';
import BottomNav from '../components/BottomNav';

export default function Assets() {
  const router = useRouter();

  const assets = [
    { 
      name: 'Tether USD', 
      symbol: 'USDT', 
      balance: 100.00, 
      value: 160000, 
      change: '+0.1%', 
      icon: CircleDollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-500'
    },
    { 
      name: 'Bitcoin', 
      symbol: 'BTC', 
      balance: 0.0025, 
      value: 40000, 
      change: '+2.4%', 
      icon: Bitcoin,
      color: 'text-[#F7931A]',
      bgColor: 'bg-[#F7931A]'
    },
    { 
      name: 'Ethereum', 
      symbol: 'ETH', 
      balance: 0.015, 
      value: 24000, 
      change: '-1.2%', 
      icon: Zap, // Using Zap for Ethereum
      color: 'text-[#627EEA]',
      bgColor: 'bg-[#627EEA]'
    },
    { 
      name: 'Solana', 
      symbol: 'SOL', 
      balance: 5.5, 
      value: 55000, 
      change: '+5.7%', 
      icon: Coins,
      color: 'text-[#14F195]',
      bgColor: 'bg-[#14F195]'
    },
  ];

  return (
    <div className="min-h-screen bg-[#1F1F1F] pb-20">
      {/* Header */}
      <div className="p-6 flex items-center gap-4 border-b border-gray-800">
        <button onClick={() => router.back()}>
          <ArrowLeft className="text-white" size={24} />
        </button>
        <h1 className="text-xl font-bold flex-1">My Assets</h1>
        <ExternalLink className="text-gray-400" size={20} />
      </div>

      {/* Total Value */}
      <div className="p-6">
        <div className="bg-gradient-to-r from-[#F6A100] to-[#F6A100]/80 rounded-2xl p-6 mb-6">
          <p className="text-[#1F1F1F] text-sm mb-2 flex items-center gap-2">
            <Wallet size={16} />
            Total Portfolio Value
          </p>
          <p className="text-[#1F1F1F] text-3xl font-bold">₦279,000</p>
          <div className="flex items-center gap-2 mt-2">
            <TrendingUp size={14} className="text-[#1F1F1F]" />
            <p className="text-[#1F1F1F] text-sm">+2.3% today</p>
          </div>
        </div>

        {/* Assets List */}
        <div className="space-y-3">
          <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Wallet size={18} className="text-[#F6A100]" />
            Your Cryptocurrencies
          </h2>
          
          {assets.map((asset) => {
            const IconComponent = asset.icon;
            const isPositive = asset.change.startsWith('+');
            
            return (
              <div key={asset.symbol} className="bg-[#2C2C2C] rounded-xl p-4 flex items-center gap-3 hover:bg-opacity-80 transition-all cursor-pointer">
                <div className={`p-3 rounded-full ${asset.bgColor} bg-opacity-20`}>
                  <IconComponent className={asset.color} size={24} />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <div>
                      <span className="text-white font-semibold">{asset.name}</span>
                      <span className="text-gray-400 text-xs ml-2">{asset.symbol}</span>
                    </div>
                    <span className="text-white font-bold">{asset.balance} {asset.symbol}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">₦{asset.value.toLocaleString()}</span>
                    <span className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {asset.change}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button className="bg-[#2C2C2C] rounded-xl p-4 flex items-center justify-center gap-2 hover:bg-opacity-80 transition-all border border-[#F6A100] border-opacity-20">
            <TrendingUp className="text-[#F6A100]" size={20} />
            <span className="text-white font-medium">Buy</span>
          </button>
          <button className="bg-[#2C2C2C] rounded-xl p-4 flex items-center justify-center gap-2 hover:bg-opacity-80 transition-all border border-[#F6A100] border-opacity-20">
            <TrendingDown className="text-[#F6A100]" size={20} />
            <span className="text-white font-medium">Sell</span>
          </button>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h3 className="text-gray-400 text-sm mb-3">Recent Activity</h3>
          <div className="bg-[#2C2C2C] rounded-xl p-4">
            <p className="text-gray-400 text-center py-4">
              No recent transactions
            </p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}