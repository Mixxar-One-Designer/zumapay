'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Wallet, Landmark, AlertCircle, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useExchangeRate } from '@/hooks/useExchangeRate';

export default function WithdrawCash() {
  const router = useRouter();
  const { rate } = useExchangeRate();
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
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
  };

  const amountNum = parseFloat(amount) || 0;
  const fee = amountNum * 0.008;
  const receiveAmount = amountNum * rate - (amountNum * rate * 0.008);
  const canWithdraw = amountNum > 0 && amountNum <= (balance?.usdt_balance || 0) && bankName && accountNumber && accountName;

const handleSubmit = async () => {
  if (!canWithdraw) return;
  
  setLoading(true);
  try {
    console.log('Submitting withdrawal:', {
      user_id: user.id,
      amount_usdt: amountNum,
      amount_ngn: amountNum * rate,
      bank_name: bankName,
      account_number: accountNumber,
      account_name: accountName
    });

    // Insert withdrawal request
    const { data: withdrawData, error: withdrawError } = await supabase
      .from('withdrawal_requests')
      .insert({
        user_id: user.id,
        amount_usdt: amountNum,
        amount_ngn: amountNum * rate,
        bank_name: bankName,
        account_number: accountNumber,
        account_name: accountName,
        fee: amountNum * rate * 0.008,
        status: 'pending'
      })
      .select();

    if (withdrawError) {
      console.error('Withdraw error:', withdrawError);
      throw withdrawError;
    }

    console.log('Withdrawal inserted:', withdrawData);

    // Deduct from balance
    const newBalance = balance.usdt_balance - amountNum;
    const { error: balanceError } = await supabase
      .from('balances')
      .update({ 
        usdt_balance: newBalance 
      })
      .eq('user_id', user.id);

    if (balanceError) {
      console.error('Balance error:', balanceError);
      throw balanceError;
    }

    console.log('Balance updated to:', newBalance);
    
    setSuccess(true);
    setTimeout(() => {
      router.push('/history');
    }, 2000);
  } catch (error) {
    console.error('Withdrawal error:', error);
    alert('Error processing withdrawal. Check console for details.');
  } finally {
    setLoading(false);
  }
};

  if (success) {
    return (
      <div className="min-h-screen bg-[#1F1F1F] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={40} className="text-white" />
          </div>
          <h2 className="text-white text-2xl font-bold mb-2">Withdrawal Requested!</h2>
          <p className="text-gray-400">Your request is being processed</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1F1F1F] pb-20">
      <div className="p-6 flex items-center gap-4 border-b border-gray-800">
        <button onClick={() => router.back()}>
          <ArrowLeft className="text-white" size={24} />
        </button>
        <h1 className="text-xl font-bold">Withdraw to Bank</h1>
      </div>

      <div className="p-6">
        <div className="bg-[#2C2C2C] rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <Wallet className="text-[#F6A100]" size={20} />
            <div>
              <p className="text-gray-400 text-sm">Available Balance</p>
              <p className="text-[#F6A100] font-bold text-xl">{balance?.usdt_balance || 0} USDT</p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-2 block">Amount (USDT)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-[#2C2C2C] text-white text-2xl font-bold rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#F6A100]"
          />
        </div>

        {amountNum > 0 && (
          <div className="bg-[#2C2C2C] rounded-xl p-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">You'll receive</span>
              <span className="text-[#F6A100] font-bold">₦{receiveAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Fee (0.8%)</span>
              <span className="text-red-400">-₦{(amountNum * rate * 0.008).toFixed(2)}</span>
            </div>
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Bank Name</label>
            <select
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full bg-[#2C2C2C] text-white rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#F6A100]"
            >
              <option value="">Select Bank</option>
              <option value="GTBank">GTBank</option>
              <option value="Access Bank">Access Bank</option>
              <option value="First Bank">First Bank</option>
              <option value="UBA">UBA</option>
              <option value="Zenith">Zenith</option>
            </select>
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">Account Number</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="0123456789"
              maxLength={10}
              className="w-full bg-[#2C2C2C] text-white rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#F6A100]"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">Account Name</label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="John Doe"
              className="w-full bg-[#2C2C2C] text-white rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#F6A100]"
            />
          </div>
        </div>

        <div className="border border-yellow-500 rounded-xl p-4 mb-6">
          <div className="flex gap-3">
            <AlertCircle className="text-yellow-500" size={20} />
            <p className="text-yellow-500 text-sm">
              Withdrawals processed within 24 hours
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!canWithdraw || loading}
          className={`w-full py-4 rounded-xl font-bold text-lg ${
            canWithdraw && !loading
              ? 'bg-[#F6A100] text-[#1F1F1F]'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          {loading ? 'Processing...' : 'Request Withdrawal'}
        </button>
      </div>
    </div>
  );
}