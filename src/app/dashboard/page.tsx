'use client';

import { useRouter } from 'next/navigation';
import { 
  Bell, 
  User, 
  Home, 
  HelpCircle,
  TrendingUp,
  RefreshCw,
  Clock,
  Award,
  Sparkles,
  Shield,
  ArrowLeftRight
} from 'lucide-react';
import { useExchangeRate } from '../../hooks/useExchangeRate';

export default function Dashboard() {
  const router = useRouter();
  const { rate, loading } = useExchangeRate();

  return (
    <div className="min-h-screen bg-[#1F1F1F] pb-20">
      {/* Header */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#F6A100] rounded-xl">
              <span className="text-[#1F1F1F] text-xl">💰</span>
            </div>
            <span className="text-2xl font-bold">
              <span className="text-white">Zuma</span>
              <span className="text-[#F6A100]">Pay</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/notifications')}>
              <Bell className="text-gray-400 hover:text-[#F6A100] transition-colors" size={20} />
            </button>
            <button onClick={() => router.push('/profile')}>
              <User className="text-gray-400 hover:text-[#F6A100] transition-colors" size={20} />
            </button>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mb-4 flex items-center gap-2 bg-[#2C2C2C] p-2 rounded-xl">
          <Sparkles className="text-[#F6A100]" size={16} />
          <span className="text-gray-300 text-sm">Welcome back, Ibraheem!</span>
          <Shield className="text-green-500 ml-auto" size={14} />
        </div>

        {/* Balance Display */}
        <div className="mb-6 bg-[#2C2C2C] rounded-2xl p-5 border border-gray-800">
          <div className="flex justify-between items-start mb-3">
            <span className="text-gray-400 text-sm">Total Balance</span>
            <Award className="text-[#F6A100]" size={18} />
          </div>
          <div className="flex justify-between items-end">
            <div>
              <span className="text-4xl font-bold text-white">100.00</span>
              <span className="text-[#F6A100] ml-2 font-semibold">USDT</span>
            </div>
            <span className="text-xl text-gray-300">₦160,000</span>
          </div>
        </div>

        {/* Live Exchange Rate */}
        <div className="bg-[#2C2C2C] rounded-xl p-4 border border-[#F6A100] border-opacity-30 mb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#F6A100] bg-opacity-20 rounded-lg">
                <TrendingUp size={18} className="text-[#F6A100]" />
              </div>
              <div>
                <span className="text-gray-400 text-sm">Live Exchange Rate</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold">1 USDT = ₦{rate.toLocaleString()}</span>
                  {loading && <RefreshCw size={12} className="text-gray-400 animate-spin" />}
                </div>
              </div>
            </div>
            <span className="text-xs text-green-500 bg-green-500 bg-opacity-20 px-2 py-1 rounded-full">
              +0.2%
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="p-6 pt-2">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Clock size={18} className="text-[#F6A100]" />
          Quick Actions
        </h2>
        
        {/* Action Grid - 3x2 with Emojis */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {/* Deposit Cash */}
          <button
            onClick={() => router.push('/deposit/cash')}
            className="bg-[#2C2C2C] rounded-xl p-4 flex flex-col items-center gap-2 border border-gray-800 hover:border-[#F6A100] transition-all"
          >
            <div className="w-12 h-12 bg-[#F6A100] bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-[#F6A100] text-2xl">💵</span>
            </div>
            <span className="text-xs text-white text-center">Deposit Cash</span>
          </button>

          {/* Deposit Crypto */}
          <button
            onClick={() => router.push('/deposit/crypto')}
            className="bg-[#2C2C2C] rounded-xl p-4 flex flex-col items-center gap-2 border border-gray-800 hover:border-[#F6A100] transition-all"
          >
            <div className="w-12 h-12 bg-[#F6A100] bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-[#F6A100] text-2xl">💲</span>
            </div>
            <span className="text-xs text-white text-center">Deposit Crypto</span>
          </button>

          {/* Buy Crypto */}
          <button
            onClick={() => router.push('/buy')}
            className="bg-[#2C2C2C] rounded-xl p-4 flex flex-col items-center gap-2 border border-gray-800 hover:border-[#F6A100] transition-all"
          >
            <div className="w-12 h-12 bg-[#F6A100] bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-[#F6A100] text-2xl">🛒</span>
            </div>
            <span className="text-xs text-white text-center">Buy Crypto</span>
          </button>

          {/* Withdraw Cash */}
          <button
            onClick={() => router.push('/withdraw/cash')}
            className="bg-[#2C2C2C] rounded-xl p-4 flex flex-col items-center gap-2 border border-gray-800 hover:border-[#F6A100] transition-all"
          >
            <div className="w-12 h-12 bg-[#F6A100] bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-[#F6A100] text-2xl">🏦</span>
            </div>
            <span className="text-xs text-white text-center">Withdraw Cash</span>
          </button>

          {/* Withdraw Crypto */}
          <button
            onClick={() => router.push('/withdraw/crypto')}
            className="bg-[#2C2C2C] rounded-xl p-4 flex flex-col items-center gap-2 border border-gray-800 hover:border-[#F6A100] transition-all"
          >
            <div className="w-12 h-12 bg-[#F6A100] bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-[#F6A100] text-2xl">📥</span>
            </div>
            <span className="text-xs text-white text-center">Withdraw Crypto</span>
          </button>

          {/* History */}
          <button
            onClick={() => router.push('/history')}
            className="bg-[#2C2C2C] rounded-xl p-4 flex flex-col items-center gap-2 border border-gray-800 hover:border-[#F6A100] transition-all"
          >
            <div className="w-12 h-12 bg-[#F6A100] bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-[#F6A100] text-2xl">📜</span>
            </div>
            <span className="text-xs text-white text-center">History</span>
          </button>
        </div>

        {/* Convert Card */}
        <div 
          onClick={() => router.push('/convert')}
          className="bg-[#2C2C2C] rounded-xl p-5 mb-4 border border-gray-800 hover:border-[#F6A100] transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#F6A100] rounded-xl">
                <ArrowLeftRight className="text-[#1F1F1F]" size={24} />
              </div>
              <div>
                <p className="text-white font-semibold text-lg">Convert</p>
                <p className="text-gray-400 text-sm">Swap between crypto and cash instantly</p>
              </div>
            </div>
            <span className="text-[#F6A100] text-sm">Convert Now →</span>
          </div>
        </div>

        {/* Withdraw Cash Card - ONLY ONE BOTTOM CARD */}
        <div 
          onClick={() => router.push('/withdraw/cash')}
          className="bg-[#2C2C2C] rounded-xl p-5 mb-4 border border-gray-800 hover:border-[#F6A100] transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#F6A100] rounded-xl">
                <span className="text-[#1F1F1F] text-2xl">🏦</span>
              </div>
              <div>
                <p className="text-white font-semibold text-lg">Withdraw Cash</p>
                <p className="text-gray-400 text-sm">Send money to your bank account</p>
              </div>
            </div>
            <span className="text-[#F6A100] text-sm">Withdraw →</span>
          </div>
        </div>

        {/* Transaction History Card */}
        <div 
          onClick={() => router.push('/history')}
          className="bg-[#2C2C2C] rounded-xl p-5 mb-4 border border-gray-800 hover:border-[#F6A100] transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#F6A100] rounded-xl">
                <span className="text-[#1F1F1F] text-2xl">📜</span>
              </div>
              <div>
                <p className="text-white font-semibold text-lg">Transaction History</p>
                <p className="text-gray-400 text-sm">View all your transactions</p>
              </div>
            </div>
            <span className="text-[#F6A100] text-sm">View →</span>
          </div>
        </div>

        {/* Recent Activity Preview */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Clock size={16} className="text-[#F6A100]" />
              Recent Activity
            </h3>
            <button 
              onClick={() => router.push('/history')}
              className="text-[#F6A100] text-sm hover:underline"
            >
              View All
            </button>
          </div>
          
          <div className="bg-[#2C2C2C] rounded-xl p-4 border border-gray-800">
            <div className="flex items-center justify-between py-2 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 bg-opacity-20 rounded-full">
                  <span className="text-green-500 text-lg">💵</span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Deposit</p>
                  <p className="text-gray-400 text-xs">Today, 10:42 AM</p>
                </div>
              </div>
              <p className="text-green-500 font-semibold">+50 USDT</p>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500 bg-opacity-20 rounded-full">
                  <span className="text-red-500 text-lg">🏦</span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Withdrawal</p>
                  <p className="text-gray-400 text-xs">Yesterday, 6:20 PM</p>
                </div>
              </div>
              <p className="text-red-500 font-semibold">-30 USDT</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#2C2C2C] border-t border-gray-800 p-3 pb-6">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button 
            onClick={() => router.push('/dashboard')}
            className="flex flex-col items-center group"
          >
            <div className="p-2 bg-[#F6A100] bg-opacity-20 rounded-xl group-hover:bg-opacity-30 transition-all">
              <Home className="text-[#F6A100]" size={20} />
            </div>
            <span className="text-xs mt-1 text-[#F6A100] font-medium">Home</span>
          </button>
          
          <button 
            onClick={() => router.push('/support')}
            className="flex flex-col items-center group"
          >
            <div className="p-2 bg-gray-800 rounded-xl group-hover:bg-[#F6A100] group-hover:bg-opacity-20 transition-all">
              <HelpCircle className="text-gray-400 group-hover:text-[#F6A100]" size={20} />
            </div>
            <span className="text-xs mt-1 text-gray-400 group-hover:text-[#F6A100]">Support</span>
          </button>
          
          <button 
            onClick={() => router.push('/profile')}
            className="flex flex-col items-center group"
          >
            <div className="p-2 bg-gray-800 rounded-xl group-hover:bg-[#F6A100] group-hover:bg-opacity-20 transition-all">
              <User className="text-gray-400 group-hover:text-[#F6A100]" size={20} />
            </div>
            <span className="text-xs mt-1 text-gray-400 group-hover:text-[#F6A100]">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}