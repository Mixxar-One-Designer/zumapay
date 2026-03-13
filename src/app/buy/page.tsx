'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Wallet, ChevronDown, AlertCircle, TrendingUp } from 'lucide-react';

export default function BuyCrypto() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState('USDT');
  const [step, setStep] = useState<'input' | 'review' | 'processing'>('input');

  const fiatBalance = 160000;
  const exchangeRate = 1600;
  const fee = 0.008; // 0.8%

  const amountNum = parseFloat(amount) || 0;
  const cryptoAmount = amountNum / exchangeRate;
  const feeAmount = amountNum * fee;
  const totalAmount = amountNum + feeAmount;

  const cryptos = [
    { id: 'USDT', name: 'Tether USD', symbol: 'USDT' },
    { id: 'BTC', name: 'Bitcoin', symbol: 'BTC' },
    { id: 'ETH', name: 'Ethereum', symbol: 'ETH' },
    { id: 'SOL', name: 'Solana', symbol: 'SOL' }
  ];

  const handleContinue = () => {
    if (amountNum > 0 && totalAmount <= fiatBalance) {
      setStep('review');
    }
  };

  const handleConfirm = () => {
    setStep('processing');
    // Simulate processing
    setTimeout(() => {
      alert('Purchase successful! (Demo)');
      router.push('/dashboard');
    }, 2000);
  };

  if (step === 'processing') {
    return (
      <div className="min-h-screen bg-[#1F1F1F] flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-16 h-16 border-4 border-[#F6A100] border-t-transparent rounded-full animate-spin mb-6"></div>
          <h1 className="text-2xl font-bold mb-2">Processing Purchase</h1>
          <p className="text-gray-400 text-center">
            Buying {cryptoAmount.toFixed(2)} {selectedCrypto}...
          </p>
        </div>
      </div>
    );
  }

  if (step === 'review') {
    return (
      <div className="min-h-screen bg-[#1F1F1F]">
        <div className="p-6 flex items-center gap-4 border-b border-gray-800">
          <button onClick={() => setStep('input')}>
            <ArrowLeft className="text-white" size={24} />
          </button>
          <h1 className="text-xl font-bold">Review Purchase</h1>
        </div>

        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#2C2C2C] rounded-2xl p-6 mb-6"
          >
            <div className="text-center mb-6">
              <p className="text-gray-400 mb-2">You're buying</p>
              <p className="text-4xl font-bold text-[#F6A100]">{cryptoAmount.toFixed(4)} {selectedCrypto}</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-gray-700">
                <span className="text-gray-400">Amount (NGN)</span>
                <span className="text-white">₦{amountNum.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-700">
                <span className="text-gray-400">Exchange Rate</span>
                <span className="text-white">1 {selectedCrypto} = ₦{exchangeRate}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-700">
                <span className="text-gray-400">Fee (0.8%)</span>
                <span className="text-red-400">-₦{feeAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-gray-400">Total Deducted</span>
                <span className="text-white font-bold text-xl">₦{totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleConfirm}
            className="w-full bg-[#F6A100] text-[#1F1F1F] font-bold text-lg py-4 rounded-xl shadow-lg"
          >
            Confirm Purchase
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1F1F1F]">
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
              <p className="text-gray-400 text-sm">Fiat Balance</p>
              <p className="text-white font-bold text-xl">₦{fiatBalance.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Crypto Selection */}
        <div className="mb-6">
          <label className="text-gray-400 text-sm mb-2 block">Select Crypto</label>
          <div className="relative">
            <select
              value={selectedCrypto}
              onChange={(e) => setSelectedCrypto(e.target.value)}
              className="w-full bg-[#2C2C2C] text-white rounded-xl p-4 appearance-none outline-none focus:ring-2 focus:ring-[#F6A100]"
            >
              {cryptos.map(crypto => (
                <option key={crypto.id} value={crypto.id}>{crypto.name} ({crypto.symbol})</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-4 text-gray-400" size={20} />
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="text-gray-400 text-sm mb-2 block">Amount (₦)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-[#2C2C2C] text-white text-2xl font-bold rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#F6A100]"
          />
        </div>

        {/* Live Conversion */}
        {amountNum > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#2C2C2C] rounded-xl p-4 mb-6"
          >
            <div className="flex justify-between items-center">
              <span className="text-gray-400">You'll receive</span>
              <span className="text-[#F6A100] font-bold text-xl">
                {(amountNum / exchangeRate).toFixed(4)} {selectedCrypto}
              </span>
            </div>
          </motion.div>
        )}

        {/* Fee Preview */}
        {amountNum > 0 && (
          <div className="bg-[#2C2C2C] rounded-xl p-4 mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Fee (0.8%)</span>
              <span className="text-red-400">₦{(amountNum * fee).toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span className="text-gray-400">Total</span>
              <span className="text-white">₦{(amountNum * (1 + fee)).toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Warning Notice */}
        {amountNum > 0 && totalAmount > fiatBalance && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-xl p-4 mb-8 flex gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
            <p className="text-red-500 text-sm">
              Insufficient balance. You need ₦{(totalAmount - fiatBalance).toLocaleString()} more.
            </p>
          </div>
        )}

        {/* Continue Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleContinue}
          disabled={!amountNum || totalAmount > fiatBalance}
          className={`w-full py-4 rounded-xl font-bold text-lg ${
            amountNum && totalAmount <= fiatBalance
              ? 'bg-[#F6A100] text-[#1F1F1F]'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue
        </motion.button>

        {/* Rate Info */}
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
          <TrendingUp size={16} />
          <span>1 {selectedCrypto} = ₦{exchangeRate}</span>
        </div>
      </div>
    </div>
  );
}