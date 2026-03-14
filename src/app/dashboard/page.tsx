'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bell, 
  User, 
  TrendingUp,
  RefreshCw,
  Clock,
  Award,
  Sparkles,
  Shield,
  ArrowLeftRight,
  LogOut,
  Wallet,
  Copy,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useExchangeRate } from '../../hooks/useExchangeRate';
import { generateUserAddresses } from '@/lib/walletGenerator';

export default function Dashboard() {
  const router = useRouter();
  const { rate, loading: rateLoading } = useExchangeRate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [balance, setBalance] = useState<any>(null);
  const [wallets, setWallets] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [showWallet, setShowWallet] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const theme = typeof window !== 'undefined' ? document.documentElement.classList.contains('light') ? 'light' : 'dark' : 'dark';
console.log('Dashboard theme:', theme);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/');
        return;
      }
      
      setUser(user);
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      setProfile(profile);
      
      const { data: balance } = await supabase
        .from('balances')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      setBalance(balance);
      
      const { data: existingWallets } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (existingWallets) {
        setWallets(existingWallets);
      } else {
        const addresses = generateUserAddresses(user.id);
        
        const { data: newWallets } = await supabase
          .from('user_wallets')
          .insert({
            user_id: user.id,
            trc20_address: addresses.trc20,
            erc20_address: addresses.erc20,
            bep20_address: addresses.bep20
          })
          .select()
          .single();
        
        setWallets(newWallets);
      }
      
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const copyAddress = (address: string, type: string) => {
    navigator.clipboard.writeText(address);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#1F1F1F] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#F6A100] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading your wallet...</p>
        </div>
      </div>
    );
  }

  const usdtBalance = balance?.usdt_balance || 0;
  const ngnValue = usdtBalance * rate;

  return (
    <div className="min-h-screen bg-[#1F1F1F] pb-24">
      {/* Header */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#F6A100] rounded-xl">
              <Wallet className="text-[#1F1F1F]" size={24} />
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
            <button onClick={handleLogout}>
              <LogOut className="text-gray-400 hover:text-red-500 transition-colors" size={20} />
            </button>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mb-4 flex items-center gap-2 bg-[#2C2C2C] p-2 rounded-xl">
          <Sparkles className="text-[#F6A100]" size={16} />
          <span className="text-gray-300 text-sm">
            Welcome back, {profile?.full_name || 'User'}!
          </span>
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
              <span className="text-4xl font-bold text-white">{usdtBalance.toFixed(2)}</span>
              <span className="text-[#F6A100] ml-2 font-semibold">USDT</span>
            </div>
            <span className="text-xl text-gray-300">₦{ngnValue.toFixed(2)}</span>
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
                  {rateLoading && <RefreshCw size={12} className="text-gray-400 animate-spin" />}
                </div>
              </div>
            </div>
            <span className="text-xs text-green-500 bg-green-500 bg-opacity-20 px-2 py-1 rounded-full">
              +0.2%
            </span>
          </div>
        </div>

        {/* Quick Wallet Access */}
        {wallets && (
          <div className="mb-4">
            <button
              onClick={() => setShowWallet(!showWallet)}
              className="w-full bg-[#2C2C2C] rounded-xl p-3 flex items-center justify-between border border-gray-800 hover:border-[#F6A100] transition-all"
            >
              <div className="flex items-center gap-2">
                <Wallet className="text-[#F6A100]" size={18} />
                <span className="text-white text-sm">Your Permanent Deposit Addresses</span>
              </div>
              <span className="text-[#F6A100] text-sm">{showWallet ? 'Hide' : 'Show'}</span>
            </button>
            
            <AnimatePresence>
              {showWallet && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-2 bg-[#2C2C2C] rounded-xl p-4 border border-gray-800 overflow-hidden"
                >
                  <div className="space-y-4">
                    <div className="bg-[#1F1F1F] p-3 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[#F6A100] text-xs font-semibold">TRC20 (Recommended - Low Fees)</span>
                        <button onClick={() => copyAddress(wallets.trc20_address, 'trc20')}>
                          {copied === 'trc20' ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-400" />}
                        </button>
                      </div>
                      <p className="text-white text-sm font-mono break-all">{wallets.trc20_address}</p>
                    </div>
                    
                    <div className="bg-[#1F1F1F] p-3 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[#F6A100] text-xs font-semibold">ERC20 (Higher Fees)</span>
                        <button onClick={() => copyAddress(wallets.erc20_address, 'erc20')}>
                          {copied === 'erc20' ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-400" />}
                        </button>
                      </div>
                      <p className="text-white text-sm font-mono break-all">{wallets.erc20_address}</p>
                    </div>
                    
                    <div className="bg-[#1F1F1F] p-3 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[#F6A100] text-xs font-semibold">BEP20 (Binance Chain)</span>
                        <button onClick={() => copyAddress(wallets.bep20_address, 'bep20')}>
                          {copied === 'bep20' ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-400" />}
                        </button>
                      </div>
                      <p className="text-white text-sm font-mono break-all">{wallets.bep20_address}</p>
                    </div>
                    
                    <div className="border border-yellow-500 rounded-lg p-3 mt-2">
                      <p className="text-yellow-500 text-xs">⚠️ Send ONLY USDT to these addresses. Using wrong network may result in loss.</p>
                    </div>
                    
                    <p className="text-gray-500 text-xs text-center">✨ These are your permanent addresses. Save them for future deposits.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Quick Actions Section */}
      <div className="p-6 pt-2">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Clock size={18} className="text-[#F6A100]" />
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button onClick={() => router.push('/deposit/cash')} className="bg-[#2C2C2C] rounded-xl p-4 flex flex-col items-center gap-2 border border-gray-800 hover:border-[#F6A100] transition-all">
            <div className="w-12 h-12 bg-[#F6A100] bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-[#F6A100] text-2xl">💵</span>
            </div>
            <span className="text-xs text-white text-center">Deposit Cash</span>
          </button>

          <button onClick={() => router.push('/deposit/crypto')} className="bg-[#2C2C2C] rounded-xl p-4 flex flex-col items-center gap-2 border border-gray-800 hover:border-[#F6A100] transition-all">
            <div className="w-12 h-12 bg-[#F6A100] bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-[#F6A100] text-2xl">💲</span>
            </div>
            <span className="text-xs text-white text-center">Deposit Crypto</span>
          </button>

          <button onClick={() => router.push('/buy')} className="bg-[#2C2C2C] rounded-xl p-4 flex flex-col items-center gap-2 border border-gray-800 hover:border-[#F6A100] transition-all">
            <div className="w-12 h-12 bg-[#F6A100] bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-[#F6A100] text-2xl">🛒</span>
            </div>
            <span className="text-xs text-white text-center">Buy Crypto</span>
          </button>

          <button onClick={() => router.push('/withdraw/cash')} className="bg-[#2C2C2C] rounded-xl p-4 flex flex-col items-center gap-2 border border-gray-800 hover:border-[#F6A100] transition-all">
            <div className="w-12 h-12 bg-[#F6A100] bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-[#F6A100] text-2xl">🏦</span>
            </div>
            <span className="text-xs text-white text-center">Withdraw Cash</span>
          </button>

          <button onClick={() => router.push('/withdraw/crypto')} className="bg-[#2C2C2C] rounded-xl p-4 flex flex-col items-center gap-2 border border-gray-800 hover:border-[#F6A100] transition-all">
            <div className="w-12 h-12 bg-[#F6A100] bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-[#F6A100] text-2xl">📤</span>
            </div>
            <span className="text-xs text-white text-center">Withdraw Crypto</span>
          </button>

          <button onClick={() => router.push('/history')} className="bg-[#2C2C2C] rounded-xl p-4 flex flex-col items-center gap-2 border border-gray-800 hover:border-[#F6A100] transition-all">
            <div className="w-12 h-12 bg-[#F6A100] bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-[#F6A100] text-2xl">📜</span>
            </div>
            <span className="text-xs text-white text-center">History</span>
          </button>
        </div>

        <div onClick={() => router.push('/convert')} className="bg-[#2C2C2C] rounded-xl p-5 mb-4 border border-gray-800 hover:border-[#F6A100] transition-all cursor-pointer">
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

        <div onClick={() => router.push('/withdraw/cash')} className="bg-[#2C2C2C] rounded-xl p-5 mb-4 border border-gray-800 hover:border-[#F6A100] transition-all cursor-pointer">
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

        <div onClick={() => router.push('/history')} className="bg-[#2C2C2C] rounded-xl p-5 mb-4 border border-gray-800 hover:border-[#F6A100] transition-all cursor-pointer">
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
      </div>
    </div>
  );
}