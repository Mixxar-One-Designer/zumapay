'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowLeftRight, 
  TrendingUp, 
  AlertCircle, 
  Bitcoin, 
  CircleDollarSign,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useExchangeRate } from '@/hooks/useExchangeRate';
import { supabase } from '@/lib/supabase';
import { formatUSDT, formatNGN } from '@/lib/format';

export default function Convert() {
  const router = useRouter();
  const { rate, percentChange, loading, lastUpdated, source } = useExchangeRate();
  const [direction, setDirection] = useState<'toCrypto' | 'toFiat'>('toCrypto');
  const [amount, setAmount] = useState('');
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/');
        return;
      }
      setUser(user);

      const { data: balance } = await supabase
        .from('balances')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      setBalance(balance);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoadingUser(false);
    }
  };

  const amountNum = parseFloat(amount) || 0;
  const fee = amountNum * 0.008;
  
  let cryptoAmount = 0;
  let nairaAmount = 0;
  let fromAmount = 0;
  let hasEnough = false;

  if (direction === 'toCrypto') {
    fromAmount = amountNum;
    cryptoAmount = amountNum / rate;
    hasEnough = (balance?.ngn_balance || 0) >= (fromAmount + fee);
  } else {
    fromAmount = amountNum;
    nairaAmount = amountNum * rate;
    hasEnough = (balance?.usdt_balance || 0) >= fromAmount;
  }

  const handleConvert = async () => {
    if (!hasEnough) return;
    
    setProcessing(true);

    try {
      if (direction === 'toCrypto') {
        const { error: balanceError } = await supabase
          .from('balances')
          .update({ 
            ngn_balance: (balance?.ngn_balance || 0) - (fromAmount + fee),
            usdt_balance: (balance?.usdt_balance || 0) + cryptoAmount
          })
          .eq('user_id', user.id);

        if (balanceError) throw balanceError;

        await supabase.from('transactions').insert({
          user_id: user.id,
          type: 'conversion',
          from_amount: fromAmount,
          from_currency: 'NGN',
          to_amount: cryptoAmount,
          to_currency: 'USDT',
          fee: fee,
          status: 'completed'
        });

        toast.success(`✅ Converted ${formatNGN(fromAmount)} → ${formatUSDT(cryptoAmount)} USDT`);

      } else {
        const nairaReceived = nairaAmount - fee;
        
        const { error: balanceError } = await supabase
          .from('balances')
          .update({ 
            usdt_balance: (balance?.usdt_balance || 0) - fromAmount,
            ngn_balance: (balance?.ngn_balance || 0) + nairaReceived
          })
          .eq('user_id', user.id);

        if (balanceError) throw balanceError;

        await supabase.from('transactions').insert({
          user_id: user.id,
          type: 'conversion',
          from_amount: fromAmount,
          from_currency: 'USDT',
          to_amount: nairaReceived,
          to_currency: 'NGN',
          fee: fee,
          status: 'completed'
        });

        toast.success(`✅ Converted ${formatUSDT(fromAmount)} USDT → ${formatNGN(nairaReceived)}`);
      }
      
      const { data: newBalance } = await supabase
        .from('balances')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      setBalance(newBalance);
      setAmount('');

    } catch (err: any) {
      toast.error(err.message || 'Conversion failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-[#1F1F1F] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F6A100]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1F1F1F] pb-24">
      <div className="p-6 flex items-center gap-4 border-b border-gray-800">
        <button onClick={() => router.back()}>
          <ArrowLeft className="text-white" size={24} />
        </button>
        <h1 className="text-xl font-bold">Convert</h1>
      </div>

      <div className="p-6">
        {/* Balance Card */}
        <div className="bg-[#2C2C2C] rounded-xl p-4 mb-6">
          <p className="text-gray-400 text-sm mb-2">Your Balances</p>
          <div className="flex gap-4">
            <div>
              <span className="text-white font-bold text-xl">{formatUSDT(balance?.usdt_balance || 0)}</span>
              <span className="text-[#F6A100] ml-1 text-sm">USDT</span>
            </div>
            <div>
              <span className="text-white font-bold text-xl">{formatNGN(balance?.ngn_balance || 0)}</span>
            </div>
          </div>
        </div>

        {/* Direction Toggle */}
        <div className="bg-[#2C2C2C] rounded-xl p-2 mb-6 flex">
          <button
            onClick={() => setDirection('toCrypto')}
            className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
              direction === 'toCrypto' 
                ? 'bg-[#F6A100] text-[#1F1F1F]' 
                : 'text-gray-400'
            }`}
          >
            <CircleDollarSign size={18} />
            <span>NGN → USDT</span>
          </button>
          <button
            onClick={() => setDirection('toFiat')}
            className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
              direction === 'toFiat' 
                ? 'bg-[#F6A100] text-[#1F1F1F]' 
                : 'text-gray-400'
            }`}
          >
            <Bitcoin size={18} />
            <span>USDT → NGN</span>
          </button>
        </div>

        {/* Live Rate Display */}
<div className="bg-[#2C2C2C] rounded-xl p-4 mb-6">
  <div className="flex items-center gap-3">
    <TrendingUp className="text-[#F6A100]" size={20} />
    <div className="flex-1">
      <div className="flex justify-between items-center">
        <p className="text-gray-400 text-sm">Live Rate</p>
        <div className="flex items-center gap-2">
          {loading && <RefreshCw size={12} className="text-gray-400 animate-spin" />}
          <span className="text-xs text-gray-500">
            {lastUpdated?.toLocaleTimeString() || '...'}
          </span>
          {/* SIMPLE TRANSPARENT BOX - NO BACKGROUND */}
          <span className="text-xs px-2 py-1" style={{ color: percentChange > 0 ? '#10B981' : percentChange < 0 ? '#EF4444' : '#9CA3AF' }}>
            {percentChange > 0 ? '+' : ''}{percentChange.toFixed(2)}%
          </span>
        </div>
      </div>
      <p className="text-white font-bold text-lg">1 USDT = ₦{rate.toLocaleString()}</p>
      <p className="text-xs text-gray-500 mt-1">Source: {source} • Updates every 30s</p>
    </div>
  </div>
</div>

        {/* Amount Input */}
        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-2 block">
            Amount ({direction === 'toCrypto' ? 'NGN' : 'USDT'})
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-[#2C2C2C] text-white text-2xl font-bold rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#F6A100]"
          />
        </div>

        {/* Live Preview */}
        {amountNum > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#2C2C2C] rounded-xl p-4 mb-6"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">You'll receive</span>
                <span className="text-[#F6A100] font-bold">
                  {direction === 'toCrypto' 
                    ? `${formatUSDT(cryptoAmount)} USDT`
                    : formatNGN(nairaAmount - fee)
                  }
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Rate</span>
                <span className="text-white">1 USDT = {formatNGN(rate)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Fee (0.8%)</span>
                <span className="text-red-400">
                  {direction === 'toCrypto' 
                    ? `-${formatNGN(fee)}`
                    : `-${formatNGN(nairaAmount * 0.008)}`
                  }
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Insufficient Balance Warning */}
        {amountNum > 0 && !hasEnough && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-xl p-4 mb-6 flex gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
            <div>
              <p className="text-red-500 font-medium">Insufficient Balance</p>
              <p className="text-red-400 text-sm mt-1">
                {direction === 'toCrypto' 
                  ? `You need ${formatNGN(fromAmount + fee - (balance?.ngn_balance || 0))} more Naira.`
                  : `You need ${formatUSDT(fromAmount - (balance?.usdt_balance || 0))} more USDT.`
                }
              </p>
            </div>
          </div>
        )}

        {/* Convert Button */}
        <button
          onClick={handleConvert}
          disabled={!amountNum || !hasEnough || processing}
          className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 ${
            amountNum && hasEnough && !processing
              ? 'bg-[#F6A100] text-[#1F1F1F] hover:bg-opacity-90' 
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          {processing ? (
            <>
              <RefreshCw size={20} className="animate-spin" />
              Converting...
            </>
          ) : (
            <>
              <ArrowLeftRight size={20} />
              Convert
            </>
          )}
        </button>
      </div>
    </div>
  );
}