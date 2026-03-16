'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ShoppingCart, 
  TrendingUp, 
  AlertCircle, 
  Wallet,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useExchangeRate } from '@/hooks/useExchangeRate';
import { supabase } from '@/lib/supabase';

export default function BuyPage() {
  const router = useRouter();
  const { rate, loading, lastUpdated, source } = useExchangeRate();
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
  const cryptoAmount = amountNum / rate;
  const fee = amountNum * 0.008;
  const totalNairaNeeded = amountNum + fee;
  const hasEnoughNaira = (balance?.ngn_balance || 0) >= totalNairaNeeded;

  const handleBuy = async () => {
    if (!hasEnoughNaira) return;
    
    setProcessing(true);

    try {
      // Deduct Naira, add USDT
      const { error: balanceError } = await supabase
        .from('balances')
        .update({ 
          ngn_balance: (balance?.ngn_balance || 0) - totalNairaNeeded,
          usdt_balance: (balance?.usdt_balance || 0) + cryptoAmount
        })
        .eq('user_id', user.id);

      if (balanceError) throw balanceError;

      // Record transaction
      const { error: txError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'buy',
          amount: cryptoAmount,
          currency: 'USDT',
          fiat_amount: amountNum,
          fiat_currency: 'NGN',
          fee: fee,
          status: 'completed'
        });

      if (txError) throw txError;

      // Create notification
      await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title: 'Purchase Successful',
          message: `You bought ${cryptoAmount.toFixed(4)} USDT for ₦${amountNum.toLocaleString()}`,
          read: false
        });

      toast.success(`✅ Purchased ${cryptoAmount.toFixed(4)} USDT`);
      
      // Refresh balance
      const { data: newBalance } = await supabase
        .from('balances')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      setBalance(newBalance);
      setAmount('');

    } catch (err: any) {
      toast.error(err.message || 'Purchase failed');
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
      {/* Header */}
      <div className="p-6 flex items-center gap-4 border-b border-gray-800">
        <button onClick={() => router.back()}>
          <ArrowLeft className="text-white" size={24} />
        </button>
        <h1 className="text-xl font-bold">Buy Crypto</h1>
      </div>

      <div className="p-6">
        {/* Balance Card */}
        <div className="bg-[#2C2C2C] rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <Wallet className="text-[#F6A100]" size={20} />
            <div>
              <p className="text-gray-400 text-sm">Your Balances</p>
              <div className="flex gap-4 mt-1">
                <div>
                  <span className="text-white font-bold text-xl">{balance?.usdt_balance?.toFixed(2) || 0}</span>
                  <span className="text-[#F6A100] ml-1 text-sm">USDT</span>
                </div>
                <div>
                  <span className="text-white font-bold text-xl">₦{balance?.ngn_balance?.toLocaleString() || 0}</span>
                </div>
              </div>
            </div>
          </div>
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
                </div>
              </div>
              <p className="text-white font-bold text-lg">1 USDT = ₦{rate.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Source: {source} • Updates every 30s</p>
            </div>
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-2 block">Amount to spend (₦)</label>
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
                <span className="text-[#F6A100] font-bold">{cryptoAmount.toFixed(4)} USDT</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Rate</span>
                <span className="text-white">1 USDT = ₦{rate.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Fee (0.8%)</span>
                <span className="text-red-400">-₦{fee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-gray-700">
                <span className="text-gray-400">Total deducted</span>
                <span className="text-white font-bold">₦{(amountNum + fee).toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Insufficient Balance Warning */}
        {amountNum > 0 && !hasEnoughNaira && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-xl p-4 mb-6 flex gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
            <div>
              <p className="text-red-500 font-medium">Insufficient Balance</p>
              <p className="text-red-400 text-sm mt-1">
                You need ₦{(totalNairaNeeded - (balance?.ngn_balance || 0)).toLocaleString()} more.
              </p>
            </div>
          </div>
        )}

        {/* Buy Button */}
        <button
          onClick={handleBuy}
          disabled={!amountNum || !hasEnoughNaira || processing}
          className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 ${
            amountNum && hasEnoughNaira && !processing
              ? 'bg-[#F6A100] text-[#1F1F1F] hover:bg-opacity-90' 
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          {processing ? (
            <>
              <RefreshCw size={20} className="animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <ShoppingCart size={20} />
              Buy Crypto
            </>
          )}
        </button>

        {/* Info Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Rate updates every 30 seconds. Final rate at time of purchase.
          </p>
        </div>
      </div>
    </div>
  );
}