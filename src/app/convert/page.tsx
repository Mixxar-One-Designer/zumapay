'use client';

import { useState } from 'react';
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
import { useExchangeRate } from '../../hooks/useExchangeRate';

export default function Convert() {
  const router = useRouter();
  const { rate, loading } = useExchangeRate();
  const [direction, setDirection] = useState<'toCrypto' | 'toFiat'>('toCrypto');
  const [amount, setAmount] = useState('');

  const amountNum = parseFloat(amount) || 0;
  const convertedAmount = direction === 'toCrypto' 
    ? amountNum / rate 
    : amountNum * rate;

  const handleConvert = () => {
    alert(`Conversion successful! (Demo)\n${amountNum} ${direction === 'toCrypto' ? '₦' : 'USDT'} → ${convertedAmount.toFixed(4)} ${direction === 'toCrypto' ? 'USDT' : '₦'}`);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#1F1F1F]">
      {/* Header */}
      <div className="p-6 flex items-center gap-4 border-b border-gray-800">
        <button onClick={() => router.back()}>
          <ArrowLeft className="text-white" size={24} />
        </button>
        <h1 className="text-xl font-bold">Convert</h1>
      </div>

      <div className="p-6">
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
        <div className="bg-[#2C2C2C] rounded-xl p-4 mb-6 flex items-center gap-3">
          <TrendingUp className="text-[#F6A100]" size={20} />
          <div>
            <p className="text-gray-400 text-sm">Current Rate</p>
            <p className="text-white font-bold">1 USDT = ₦{rate.toLocaleString()}</p>
          </div>
          {loading && <RefreshCw size={16} className="text-gray-400 animate-spin ml-auto" />}
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

        {/* Conversion Result */}
        {amountNum > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#2C2C2C] rounded-xl p-6 mb-6 text-center"
          >
            <p className="text-gray-400 mb-2">You'll receive</p>
            <p className="text-3xl font-bold text-[#F6A100]">
              {convertedAmount.toFixed(4)} {direction === 'toCrypto' ? 'USDT' : 'NGN'}
            </p>
          </motion.div>
        )}

        {/* Fee Info */}
        <div className="bg-[#2C2C2C] rounded-xl p-4 mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Fee (0.8%)</span>
            <span className="text-red-400">
              -{direction === 'toCrypto' ? '₦' : ''}{(amountNum * 0.008).toFixed(2)} {direction === 'toCrypto' ? '' : 'USDT'}
            </span>
          </div>
          <div className="flex justify-between font-bold">
            <span className="text-gray-400">You send</span>
            <span className="text-white">{amountNum} {direction === 'toCrypto' ? 'NGN' : 'USDT'}</span>
          </div>
        </div>

        {/* Convert Button */}
        <button
          onClick={handleConvert}
          disabled={!amountNum}
          className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 ${
            amountNum
              ? 'bg-[#F6A100] text-[#1F1F1F]' 
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          <ArrowLeftRight size={20} />
          Convert Now
        </button>

        {/* Info Note */}
        <div className="mt-6 flex items-start gap-2 p-4 bg-blue-500 bg-opacity-10 rounded-xl">
          <AlertCircle className="text-blue-400 flex-shrink-0" size={18} />
          <p className="text-blue-400 text-xs">
            Conversion is instant. The rate updates every 60 seconds.
          </p>
        </div>
      </div>
    </div>
  );
}