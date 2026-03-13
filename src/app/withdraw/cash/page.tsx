'use client';

import { useExchangeRate } from '../../../hooks/useExchangeRate';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Wallet, ChevronDown, AlertCircle, Check } from 'lucide-react';

export default function WithdrawCash() {
  const router = useRouter();
  const { rate, loading } = useExchangeRate();
  const [amount, setAmount] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [step, setStep] = useState<'input' | 'review' | 'confirm'>('input');

  const cryptoBalance = 100.00;
  const exchangeRate = 1600;
  const fee = 0.008; // 0.8%
  
  const amountNum = parseFloat(amount) || 0;
  const fiatValue = amountNum * exchangeRate;
  const feeAmount = fiatValue * fee;
  const receiveAmount = fiatValue - feeAmount;

  const banks = [
    'GTBank Plc',
    'Access Bank Plc',
    'First Bank of Nigeria',
    'UBA Plc',
    'Zenith Bank Plc',
    'Fidelity Bank Plc'
  ];

  const handleContinue = () => {
    if (amountNum > 0 && selectedBank && accountNumber.length === 10) {
      setStep('review');
    }
  };

  const handleConfirm = () => {
    setShowConfirm(true);
  };

  const completeWithdrawal = () => {
    setShowConfirm(false);
    alert('Withdrawal successful! (Demo)');
    router.push('/dashboard');
  };

  if (step === 'review') {
    return (
      <div className="min-h-screen bg-[#1F1F1F]">
        {/* Header */}
        <div className="p-6 flex items-center gap-4 border-b border-gray-800">
          <button onClick={() => setStep('input')}>
            <ArrowLeft className="text-white" size={24} />
          </button>
          <h1 className="text-xl font-bold">Review Withdrawal</h1>
        </div>

        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#2C2C2C] rounded-2xl p-6 mb-6"
          >
            <div className="text-center mb-6">
              <p className="text-gray-400 mb-2">You're withdrawing</p>
              <p className="text-4xl font-bold text-white">{amount} USDT</p>
              <p className="text-[#F6A100] text-xl mt-2">≈ ₦{fiatValue.toLocaleString()}</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-gray-700">
                <span className="text-gray-400">Exchange Rate</span>
                <span className="text-white">1 USDT = ₦{exchangeRate}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-700">
                <span className="text-gray-400">Fee (0.8%)</span>
                <span className="text-red-400">-₦{feeAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-gray-400">You'll receive</span>
                <span className="text-[#F6A100] font-bold text-xl">₦{receiveAmount.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>

          <div className="bg-[#2C2C2C] rounded-2xl p-6 mb-8">
            <h3 className="font-semibold mb-4">Bank Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Bank</span>
                <span className="text-white">{selectedBank}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Account Number</span>
                <span className="text-white">{accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Account Name</span>
                <span className="text-white">John Doe</span>
              </div>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleConfirm}
            className="w-full bg-[#F6A100] text-[#1F1F1F] font-bold text-lg py-4 rounded-xl shadow-lg"
          >
            Confirm Withdrawal
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
        <h1 className="text-xl font-bold">Withdraw Cash</h1>
      </div>

      <div className="p-6">
        {/* Balance Card */}
        <div className="bg-[#2C2C2C] rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <Wallet className="text-[#F6A100]" size={20} />
            <div>
              <p className="text-gray-400 text-sm">Available Balance</p>
              <p className="text-[#F6A100] font-bold text-xl">{cryptoBalance} USDT</p>
              <p className="text-white text-sm">≈ ₦{(cryptoBalance * exchangeRate).toLocaleString()}</p>
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
              className="w-full bg-[#2C2C2C] text-white text-2xl font-bold rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#F6A100]"
            />
            <button 
              onClick={() => setAmount(cryptoBalance.toString())}
              className="absolute right-4 top-4 text-[#F6A100] text-sm font-semibold"
            >
              MAX
            </button>
          </div>
        </div>

        {/* Live Conversion Preview */}
        {amountNum > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#2C2C2C] rounded-xl p-4 mb-6"
          >
            <div className="flex justify-between items-center">
              <span className="text-gray-400">You'll receive</span>
              <span className="text-[#F6A100] font-bold text-xl">₦{receiveAmount.toLocaleString()}</span>
            </div>
          </motion.div>
        )}

        {/* Bank Selection */}
        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-2 block">Select Bank</label>
          <div className="relative">
            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="w-full bg-[#2C2C2C] text-white rounded-xl p-4 appearance-none outline-none focus:ring-2 focus:ring-[#F6A100]"
            >
              <option value="">Choose a bank</option>
              {banks.map(bank => (
                <option key={bank} value={bank}>{bank}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-4 text-gray-400" size={20} />
          </div>
        </div>

        {/* Account Number Input */}
        <div className="mb-8">
          <label className="text-gray-400 text-sm mb-2 block">Account Number</label>
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="0123456789"
            maxLength={10}
            className="w-full bg-[#2C2C2C] text-white rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#F6A100]"
          />
        </div>

        {/* Continue Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleContinue}
          disabled={!amountNum || !selectedBank || accountNumber.length !== 10}
          className={`w-full py-4 rounded-xl font-bold text-lg ${
            amountNum && selectedBank && accountNumber.length === 10
              ? 'bg-[#F6A100] text-[#1F1F1F]'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue
        </motion.button>

        {/* Info Note */}
        <div className="flex items-start gap-2 mt-6 p-4 bg-blue-500 bg-opacity-10 rounded-xl">
          <AlertCircle className="text-blue-400 flex-shrink-0" size={18} />
          <p className="text-blue-400 text-xs">
            Withdrawals are processed instantly. You'll receive the funds in your bank account within minutes.
          </p>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-[#2C2C2C] rounded-2xl p-6 w-full max-w-sm"
          >
            <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="text-green-500" size={24} />
            </div>
            
            <h3 className="text-xl font-bold text-center mb-2">Withdrawal Initiated!</h3>
            <p className="text-gray-400 text-center mb-6">
              Your withdrawal of ₦{receiveAmount.toLocaleString()} is being processed
            </p>

            <div className="bg-[#1F1F1F] rounded-xl p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Amount</span>
                <span className="text-white">{amount} USDT</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">You Receive</span>
                <span className="text-[#F6A100]">₦{receiveAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Bank</span>
                <span className="text-white">{selectedBank}</span>
              </div>
            </div>

            <button
              onClick={completeWithdrawal}
              className="w-full py-3 rounded-xl bg-[#F6A100] text-[#1F1F1F] font-semibold"
            >
              Done
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}