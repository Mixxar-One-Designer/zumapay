'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Wallet, 
  AlertCircle, 
  Check,
  Copy,
  RefreshCw,
  QrCode,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { useExchangeRate } from '@/hooks/useExchangeRate';
import { formatUSDT } from '@/lib/format';

export default function WithdrawCrypto() {
  const router = useRouter();
  const { rate } = useExchangeRate();
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('TRC20');
  const [address, setAddress] = useState('');
  const [step, setStep] = useState<'input' | 'review' | 'confirming'>('input');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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
    }
  };

  const amountNum = parseFloat(amount) || 0;
  const hasEnough = amountNum > 0 && amountNum <= (balance?.usdt_balance || 0);

  const networks = [
    { 
      id: 'TRC20', 
      name: 'USDT (TRC20)', 
      fee: 1.0,
      feeDisplay: '1 USDT',
      minWithdraw: 2,
      time: '2-3 min',
      description: 'Most popular - low fees',
      popular: true,
      addressFormat: (addr: string) => addr.startsWith('T') && addr.length === 34
    },
    { 
      id: 'BEP20', 
      name: 'USDT (BEP20)', 
      fee: 0.5,
      feeDisplay: '0.5 USDT',
      minWithdraw: 1,
      time: '1-2 min',
      description: 'Binance Smart Chain - cheapest',
      popular: false,
      addressFormat: (addr: string) => addr.startsWith('0x') && addr.length === 42
    },
    { 
      id: 'ERC20', 
      name: 'USDT (ERC20)', 
      fee: 8.0,
      feeDisplay: '8 USDT',
      minWithdraw: 10,
      time: '5-15 min',
      description: 'Ethereum network - most secure',
      popular: false,
      addressFormat: (addr: string) => addr.startsWith('0x') && addr.length === 42
    }
  ];

  const getSelectedNetwork = () => networks.find(n => n.id === selectedNetwork)!;
  const selectedNet = getSelectedNetwork();
  
  const networkFee = selectedNet.fee;
  const zumapayFee = amountNum * 0.008;
  const totalFee = networkFee + zumapayFee;
  const receiveAmount = amountNum - totalFee;
  const feePercentage = amountNum > 0 ? ((networkFee / amountNum) * 100).toFixed(1) : '0';

  const isValidAddress = () => {
    if (!address) return false;
    return selectedNet.addressFormat(address);
  };

  const canContinue = hasEnough && 
                      address && 
                      isValidAddress() && 
                      amountNum >= selectedNet.minWithdraw;

  const handleContinue = () => {
    if (!canContinue) return;
    setStep('review');
  };

  const handleConfirm = async () => {
  setLoading(true);
  setStep('confirming');

  try {
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Deduct from balance
    const { error: balanceError } = await supabase
      .from('balances')
      .update({ 
        usdt_balance: balance.usdt_balance - amountNum 
      })
      .eq('user_id', user.id);

    if (balanceError) throw balanceError;

    // Record in crypto_transactions table
    const { error: txError } = await supabase
      .from('crypto_transactions')
      .insert({
        user_id: user.id,
        amount: amountNum,
        network: selectedNetwork,
        to_address: address,
        status: 'completed',
        tx_hash: 'tx_' + Date.now(),
        confirmations: 20,
        created_at: new Date()
      });

    if (txError) throw txError;

    // Record in transactions table for history page
const { error: historyError } = await supabase
  .from('transactions')
  .insert({
    user_id: user.id,
    type: 'withdrawal',
    amount: amountNum,
    currency: 'USDT',
    status: 'completed',
    network: selectedNetwork,
    created_at: new Date()
  });

    if (historyError) throw historyError;

    // Create notification
    await supabase
      .from('notifications')
      .insert({
        user_id: user.id,
        title: 'Crypto Withdrawal',
        message: `${formatUSDT(amountNum)} USDT sent to external wallet`,
        read: false
      });

    toast.success(`✅ ${formatUSDT(amountNum)} USDT sent to wallet`);
    
    setTimeout(() => {
      router.push('/history');
    }, 1500);

  } catch (error: any) {
    console.error('Withdrawal error:', error);
    toast.error(error.message || 'Withdrawal failed');
    setStep('review');
  } finally {
    setLoading(false);
  }
};

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Address copied');
    }
  };

  // CONFIRMING SCREEN
  if (step === 'confirming') {
    return (
      <div className="min-h-screen bg-[#1F1F1F] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#F6A100] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h1 className="text-2xl font-bold text-white mb-2">Processing Withdrawal</h1>
          <p className="text-gray-400">Sending {amount} USDT via {selectedNetwork}...</p>
        </div>
      </div>
    );
  }

  // REVIEW SCREEN
  if (step === 'review') {
    return (
      <div className="min-h-screen bg-[#1F1F1F]">
        <div className="p-6 flex items-center gap-4 border-b border-gray-800">
          <button onClick={() => setStep('input')}>
            <ArrowLeft className="text-white" size={24} />
          </button>
          <h1 className="text-xl font-bold">Review Withdrawal</h1>
        </div>

        <div className="p-6 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#2C2C2C] rounded-2xl p-6 mb-6"
          >
            <div className="text-center mb-6">
              <p className="text-gray-400 mb-2">You're withdrawing</p>
              <p className="text-4xl font-bold text-white">{amount} USDT</p>
              <p className="text-[#F6A100] mt-2">≈ ₦{(amountNum * rate).toLocaleString()}</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-gray-700">
                <span className="text-gray-400">Network</span>
                <span className="text-white">{selectedNet.name}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-700">
                <span className="text-gray-400">Network Fee (fixed)</span>
                <span className="text-red-400">{selectedNet.feeDisplay}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-700">
                <span className="text-gray-400">Platform Fee (0.8%)</span>
                <span className="text-red-400">{zumapayFee.toFixed(2)} USDT</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-700">
                <span className="text-gray-400">Total Fees</span>
                <span className="text-red-400">{totalFee.toFixed(2)} USDT</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-gray-400">You'll receive</span>
                <span className="text-[#F6A100] font-bold text-xl">{receiveAmount.toFixed(2)} USDT</span>
              </div>
            </div>
          </motion.div>

          <div className="bg-[#2C2C2C] rounded-2xl p-6 mb-8">
            <h3 className="text-white font-semibold mb-4">Destination Address</h3>
            <div className="flex items-center justify-between bg-[#1F1F1F] p-3 rounded-xl">
              <p className="text-white font-mono text-sm break-all flex-1 pr-2">
                {address}
              </p>
              <button 
                onClick={copyAddress}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} className="text-gray-400" />}
              </button>
            </div>
          </div>

          {/* CONFIRM BUTTON - RIGHT HERE */}
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="w-full bg-[#F6A100] text-[#1F1F1F] font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-opacity-90 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Confirm Withdrawal'}
          </button>
        </div>
      </div>
    );
  }

  // INPUT SCREEN
  return (
    <div className="min-h-screen bg-[#1F1F1F]">
      <div className="p-6 flex items-center gap-4 border-b border-gray-800">
        <button onClick={() => router.back()}>
          <ArrowLeft className="text-white" size={24} />
        </button>
        <h1 className="text-xl font-bold">Withdraw Crypto</h1>
      </div>

      <div className="p-6 pb-32">
        {/* Balance Card */}
        <div className="bg-[#2C2C2C] rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <Wallet className="text-[#F6A100]" size={20} />
            <div>
              <p className="text-gray-400 text-sm">Available Balance</p>
              <p className="text-[#F6A100] font-bold text-xl">{formatUSDT(balance?.usdt_balance || 0)} USDT</p>
              <p className="text-white text-sm">≈ ₦{((balance?.usdt_balance || 0) * rate).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="text-gray-400 text-sm mb-2 block">Amount to Withdraw (USDT)</label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-[#2C2C2C] text-white text-2xl font-bold rounded-xl p-4 pr-20 outline-none focus:ring-2 focus:ring-[#F6A100]"
            />
            <button 
              onClick={() => setAmount(balance?.usdt_balance?.toString() || '0')}
              className="absolute right-4 top-4 text-[#F6A100] text-sm font-semibold"
            >
              MAX
            </button>
          </div>
        </div>

        {/* Network Selection */}
        <div className="mb-6">
          <label className="text-gray-400 text-sm mb-2 block">Select Network</label>
          <div className="space-y-2">
            {networks.map((network) => (
              <button
                key={network.id}
                onClick={() => setSelectedNetwork(network.id)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  selectedNetwork === network.id
                    ? 'border-[#F6A100] bg-[#2C2C2C]'
                    : 'border-gray-800 bg-[#2C2C2C]'
                }`}
              >
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{network.name}</span>
                    {network.popular && (
                      <span className="text-xs bg-[#F6A100] text-[#1F1F1F] px-2 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  <span className="text-gray-400 text-xs">{network.description}</span>
                  <p className="text-gray-500 text-xs mt-1">Min: {network.minWithdraw} USDT</p>
                </div>
                <div className="text-right">
                  <span className="text-white font-bold">{network.feeDisplay}</span>
                  <p className="text-xs text-gray-500">{network.time}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Fee Preview */}
        {amountNum > 0 && (
          <div className="mb-6 space-y-3">
            <div className="flex items-start gap-2">
              <Info size={16} className="text-[#F6A100] mt-0.5" />
              <div>
                <p className="text-white text-sm">
                  Network Fee: <span className="text-[#F6A100] font-medium">{networkFee.toFixed(2)} USDT</span> 
                  <span className="text-gray-400 ml-2">({feePercentage}% of amount)</span>
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Platform Fee: {zumapayFee.toFixed(2)} USDT (0.8%)
                </p>
              </div>
            </div>
            
            {amountNum < networkFee * 2 && (
              <div className="flex items-start gap-2">
                <AlertCircle className="text-yellow-500 flex-shrink-0 mt-0.5" size={16} />
                <p className="text-yellow-500 text-xs">
                  Fee is {feePercentage}% of your withdrawal. Consider a larger amount for better value.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Address Input */}
        <div className="mb-6">
          <label className="text-gray-400 text-sm mb-2 block">Destination Address</label>
          <div className="relative">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={`Enter ${selectedNetwork} wallet address`}
              className="w-full bg-[#2C2C2C] text-white rounded-xl p-4 pr-12 outline-none focus:ring-2 focus:ring-[#F6A100]"
            />
            <button className="absolute right-4 top-4">
              <QrCode className="text-gray-400" size={20} />
            </button>
          </div>
          {address && !isValidAddress() && (
            <p className="text-red-500 text-xs mt-1">Invalid {selectedNetwork} address format</p>
          )}
        </div>

        {/* Warning */}
        <div className="mb-8 flex items-start gap-2">
          <AlertCircle className="text-yellow-500 flex-shrink-0 mt-0.5" size={16} />
          <p className="text-yellow-600 dark:text-yellow-500 text-sm">
            Double-check the address and network. Crypto transactions cannot be reversed.
          </p>
        </div>

        {/* Continue Button - RIGHT HERE */}
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className={`w-full py-4 rounded-xl font-bold text-lg ${
            canContinue
              ? 'bg-[#F6A100] text-[#1F1F1F] hover:bg-opacity-90' 
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          {!hasEnough 
            ? 'Insufficient Balance' 
            : !address 
            ? 'Enter Address' 
            : !isValidAddress()
            ? 'Invalid Address'
            : amountNum < selectedNet.minWithdraw
            ? `Minimum ${selectedNet.minWithdraw} USDT for ${selectedNetwork}`
            : 'Continue'}
        </button>
      </div>
    </div>
  );
}