'use client';

import { formatUSDT, formatNGN } from '@/lib/format';
import { useEffect, useState, useRef } from 'react';
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
import { useTranslation } from '@/hooks/useTranslation';

export default function Dashboard() {
  const router = useRouter();
  const { rate, percentChange, loading: rateLoading } = useExchangeRate();
  const { t } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [balance, setBalance] = useState<any>(null);
  const [wallets, setWallets] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [showWallet, setShowWallet] = useState(false);
  
  // Track last balance update time
  const lastBalanceUpdate = useRef<number>(Date.now());

  useEffect(() => {
    checkUser();
  }, []);

  // AUTO-REFRESH BALANCE EVERY 30 SECONDS (not every render)
  useEffect(() => {
    if (!user) return;
    
    let mounted = true;
    
    const refreshBalance = async () => {
      // Only refresh if at least 30 seconds have passed
      if (Date.now() - lastBalanceUpdate.current < 29000) return;
      
      const { data: freshBalance } = await supabase
        .from('balances')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (freshBalance && mounted) {
        setBalance(freshBalance);
        lastBalanceUpdate.current = Date.now();
      }
    };
    
    // Initial refresh
    refreshBalance();
    
    const interval = setInterval(refreshBalance, 30000);
    
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [user]);

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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#F6A100] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ color: 'var(--text-primary)' }}>Loading your wallet...</p>
        </div>
      </div>
    );
  }

  const usdtBalance = balance?.usdt_balance || 0;

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#F6A100] rounded-xl">
              <Wallet className="text-[#1F1F1F]" size={24} />
            </div>
            <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              <span style={{ color: 'var(--text-primary)' }}>Zuma</span>
              <span className="text-[#F6A100]">Pay</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/notifications')}>
              <Bell style={{ color: 'var(--text-secondary)' }} size={20} />
            </button>
            <button onClick={() => router.push('/profile')}>
              <User style={{ color: 'var(--text-secondary)' }} size={20} />
            </button>
            <button onClick={handleLogout}>
              <LogOut style={{ color: 'var(--text-secondary)' }} size={20} />
            </button>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mb-4 flex items-center gap-2 p-2 rounded-xl" style={{ backgroundColor: 'var(--bg-card)' }}>
          <Sparkles className="text-[#F6A100]" size={16} />
          <span style={{ color: 'var(--text-secondary)' }} className="text-sm">
            {t('welcomeBack')}, {profile?.full_name || 'User'}!
          </span>
          <Shield className="text-green-500 ml-auto" size={14} />
        </div>

        {/* Balance Display */}
        <div className="mb-6 rounded-2xl p-5 border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <div className="flex justify-between items-start mb-3">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Your Assets</span>
            <Award className="text-[#F6A100]" size={18} />
          </div>
          
          {/* USDT Balance */}
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>USDT</span>
            <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {formatUSDT(usdtBalance)} USDT
            </span>
          </div>
          
          {/* NGN Balance */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>NGN</span>
            <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {formatNGN(balance?.ngn_balance || 0)}
            </span>
          </div>
          
          {/* Divider */}
          <div className="border-t border-gray-700 my-3"></div>
          
          {/* Total Value in NGN */}
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total Value (₦)</span>
            <span className="text-xl font-bold text-[#F6A100]">
              {formatNGN((usdtBalance * rate) + (balance?.ngn_balance || 0))}
            </span>
          </div>
        </div>

        {/* Live Exchange Rate */}
        <div className="rounded-xl p-4 border mb-2" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#F6A100] rounded-lg">
                <TrendingUp size={18} className="text-[#1F1F1F]" />
              </div>
              <div>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Live Exchange Rate</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                    1 USDT = {formatNGN(rate)}
                  </span>
                  {rateLoading && <RefreshCw size={12} className="text-gray-400 animate-spin" />}
                </div>
              </div>
            </div>
            
            {/* Transparent percentage */}
            <span className="text-xs px-2 py-1" style={{ color: percentChange > 0 ? '#10B981' : percentChange < 0 ? '#EF4444' : '#9CA3AF' }}>
              {percentChange > 0 ? '+' : ''}{percentChange.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Quick Wallet Access */}
        {wallets && (
          <div className="mb-4">
            <button
              onClick={() => setShowWallet(!showWallet)}
              className="w-full rounded-xl p-3 flex items-center justify-between border hover:border-[#F6A100] transition-all"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-2">
                <Wallet className="text-[#F6A100]" size={18} />
                <span style={{ color: 'var(--text-primary)' }}>Your Permanent Deposit Addresses</span>
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
                  className="mt-2 rounded-xl p-4 border overflow-hidden"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
                >
                  <div className="space-y-4">
                    <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-primary)' }}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[#F6A100] text-xs font-semibold">TRC20 (Recommended - Low Fees)</span>
                        <button onClick={() => copyAddress(wallets.trc20_address, 'trc20')}>
                          {copied === 'trc20' ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-400" />}
                        </button>
                      </div>
                      <p className="text-sm font-mono break-all" style={{ color: 'var(--text-primary)' }}>{wallets.trc20_address}</p>
                    </div>
                    
                    <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-primary)' }}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[#F6A100] text-xs font-semibold">ERC20 (Higher Fees)</span>
                        <button onClick={() => copyAddress(wallets.erc20_address, 'erc20')}>
                          {copied === 'erc20' ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-400" />}
                        </button>
                      </div>
                      <p className="text-sm font-mono break-all" style={{ color: 'var(--text-primary)' }}>{wallets.erc20_address}</p>
                    </div>
                    
                    <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-primary)' }}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[#F6A100] text-xs font-semibold">BEP20 (Binance Chain)</span>
                        <button onClick={() => copyAddress(wallets.bep20_address, 'bep20')}>
                          {copied === 'bep20' ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-400" />}
                        </button>
                      </div>
                      <p className="text-sm font-mono break-all" style={{ color: 'var(--text-primary)' }}>{wallets.bep20_address}</p>
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
        <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Clock size={18} className="text-[#F6A100]" />
          {t('quickActions')}
        </h2>
        
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button onClick={() => router.push('/deposit/cash')} className="rounded-xl p-4 flex flex-col items-center gap-2 border hover:border-[#F6A100] transition-all" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <div className="w-12 h-12 bg-[#F6A100] bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-[#F6A100] text-2xl">💵</span>
            </div>
            <span className="text-xs text-center" style={{ color: 'var(--text-primary)' }}>{t('depositCash')}</span>
          </button>

          <button onClick={() => router.push('/deposit/crypto')} className="rounded-xl p-4 flex flex-col items-center gap-2 border hover:border-[#F6A100] transition-all" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <div className="w-12 h-12 bg-[#F6A100] bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-[#F6A100] text-2xl">💲</span>
            </div>
            <span className="text-xs text-center" style={{ color: 'var(--text-primary)' }}>{t('depositCrypto')}</span>
          </button>

          <button onClick={() => router.push('/buy')} className="rounded-xl p-4 flex flex-col items-center gap-2 border hover:border-[#F6A100] transition-all" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <div className="w-12 h-12 bg-[#F6A100] bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-[#F6A100] text-2xl">🛒</span>
            </div>
            <span className="text-xs text-center" style={{ color: 'var(--text-primary)' }}>{t('buyCrypto')}</span>
          </button>

          <button onClick={() => router.push('/withdraw/cash')} className="rounded-xl p-4 flex flex-col items-center gap-2 border hover:border-[#F6A100] transition-all" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <div className="w-12 h-12 bg-[#F6A100] bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-[#F6A100] text-2xl">🏦</span>
            </div>
            <span className="text-xs text-center" style={{ color: 'var(--text-primary)' }}>{t('withdrawCash')}</span>
          </button>

          <button onClick={() => router.push('/withdraw/crypto')} className="rounded-xl p-4 flex flex-col items-center gap-2 border hover:border-[#F6A100] transition-all" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <div className="w-12 h-12 bg-[#F6A100] bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-[#F6A100] text-2xl">📤</span>
            </div>
            <span className="text-xs text-center" style={{ color: 'var(--text-primary)' }}>{t('withdrawCrypto')}</span>
          </button>

          <button onClick={() => router.push('/history')} className="rounded-xl p-4 flex flex-col items-center gap-2 border hover:border-[#F6A100] transition-all" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <div className="w-12 h-12 bg-[#F6A100] bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-[#F6A100] text-2xl">📜</span>
            </div>
            <span className="text-xs text-center" style={{ color: 'var(--text-primary)' }}>{t('history')}</span>
          </button>
        </div>

        <div onClick={() => router.push('/convert')} className="rounded-xl p-5 mb-4 border hover:border-[#F6A100] transition-all cursor-pointer" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#F6A100] rounded-xl">
                <ArrowLeftRight className="text-[#1F1F1F]" size={24} />
              </div>
              <div>
                <p className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>{t('convert')}</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Swap between crypto and cash instantly</p>
              </div>
            </div>
            <span className="text-[#F6A100] text-sm">Convert Now →</span>
          </div>
        </div>

        <div onClick={() => router.push('/withdraw/cash')} className="rounded-xl p-5 mb-4 border hover:border-[#F6A100] transition-all cursor-pointer" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#F6A100] rounded-xl">
                <span className="text-[#1F1F1F] text-2xl">🏦</span>
              </div>
              <div>
                <p className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>{t('withdrawCash')}</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Send money to your bank account</p>
              </div>
            </div>
            <span className="text-[#F6A100] text-sm">Withdraw →</span>
          </div>
        </div>

        <div onClick={() => router.push('/history')} className="rounded-xl p-5 mb-4 border hover:border-[#F6A100] transition-all cursor-pointer" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#F6A100] rounded-xl">
                <span className="text-[#1F1F1F] text-2xl">📜</span>
              </div>
              <div>
                <p className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>{t('transactionHistory')}</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>View all your transactions</p>
              </div>
            </div>
            <span className="text-[#F6A100] text-sm">View →</span>
          </div>
        </div>
      </div>
    </div>
  );
}