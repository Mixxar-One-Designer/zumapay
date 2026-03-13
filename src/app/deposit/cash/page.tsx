'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Wallet, ChevronDown, Copy, Check, AlertCircle } from 'lucide-react';

export default function DepositCash() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('bank');
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState<'input' | 'instructions' | 'confirming'>('input');

  const fiatBalance = 160000;
  const accountDetails = {
    bank: 'ZumaPay Bank',
    accountNumber: '0123456789',
    accountName: 'ZumaPay Technologies Ltd',
    sortCode: '01 234 567'
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContinue = () => {
    if (parseFloat(amount) > 0) {
      setStep('instructions');
    }
  };

  const handleConfirm = () => {
    setStep('confirming');
    // Simulate confirmation
    setTimeout(() => {
      alert('Deposit successful! (Demo)');
      router.push('/dashboard');
    }, 2000);
  };

  if (step === 'confirming') {
    return (
      <div className="min-h-screen bg-[#1F1F1F] flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-16 h-16 border-4 border-[#F6A100] border-t-transparent rounded-full animate-spin mb-6"></div>
          <h1 className="text-2xl font-bold mb-2">Confirming Deposit</h1>
          <p className="text-gray-400 text-center">
            Waiting for payment confirmation...
          </p>
          <p className="text-gray-500 text-sm mt-4">
            This usually takes 1-2 minutes
          </p>
        </div>
      </div>
    );
  }

  if (step === 'instructions') {
    return (
      <div className="min-h-screen bg-[#1F1F1F]">
        <div className="p-6 flex items-center gap-4 border-b border-gray-800">
          <button onClick={() => setStep('input')}>
            <ArrowLeft className="text-white" size={24} />
          </button>
          <h1 className="text-xl font-bold">Complete Deposit</h1>
        </div>

        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#2C2C2C] rounded-2xl p-6 mb-6"
          >
            <h3 className="font-semibold mb-4">Transfer Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Amount to Deposit</p>
                <p className="text-[#F6A100] text-2xl font-bold">₦{parseFloat(amount).toLocaleString()}</p>
              </div>
              <div className="border-t border-gray-700 pt-4">
                <p className="text-gray-400 text-sm mb-3">Bank Transfer Instructions</p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Bank</span>
                    <span className="text-white">{accountDetails.bank}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Account Number</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-mono">{accountDetails.accountNumber}</span>
                      <button onClick={() => copyToClipboard(accountDetails.accountNumber)}>
                        {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-400" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Account Name</span>
                    <span className="text-white">{accountDetails.accountName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Sort Code</span>
                    <span className="text-white">{accountDetails.sortCode}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="bg-yellow-500 bg-opacity-10 rounded-xl p-4 mb-6 flex gap-3">
            <AlertCircle className="text-yellow-500 flex-shrink-0" size={20} />
            <p className="text-yellow-500 text-sm">
              Transfer the exact amount shown. Your wallet will be credited automatically once we receive the payment.
            </p>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleConfirm}
            className="w-full bg-[#F6A100] text-[#1F1F1F] font-bold text-lg py-4 rounded-xl shadow-lg"
          >
            I've Made the Transfer
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
        <h1 className="text-xl font-bold">Deposit Cash</h1>
      </div>

      <div className="p-6">
        {/* Balance Card */}
        <div className="bg-[#2C2C2C] rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <Wallet className="text-[#F6A100]" size={20} />
            <div>
              <p className="text-gray-400 text-sm">Current Balance</p>
              <p className="text-white font-bold text-xl">₦{fiatBalance.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="text-gray-400 text-sm mb-2 block">Amount to Deposit (₦)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-[#2C2C2C] text-white text-2xl font-bold rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#F6A100]"
          />
        </div>

        {/* Payment Method */}
        <div className="mb-6">
          <label className="text-gray-400 text-sm mb-2 block">Payment Method</label>
          <div className="space-y-2">
            <button
              onClick={() => setSelectedMethod('bank')}
              className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                selectedMethod === 'bank'
                  ? 'border-[#F6A100] bg-[#2C2C2C]'
                  : 'border-gray-800 bg-[#2C2C2C]'
              }`}
            >
              <span className="text-white">Bank Transfer</span>
              <span className="text-sm text-gray-400">Instant</span>
            </button>
            <button
              onClick={() => setSelectedMethod('card')}
              className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                selectedMethod === 'card'
                  ? 'border-[#F6A100] bg-[#2C2C2C]'
                  : 'border-gray-800 bg-[#2C2C2C]'
              }`}
            >
              <span className="text-white">Card Payment</span>
              <span className="text-sm text-gray-400">+1.5% fee</span>
            </button>
            <button
              onClick={() => setSelectedMethod('ussd')}
              className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                selectedMethod === 'ussd'
                  ? 'border-[#F6A100] bg-[#2C2C2C]'
                  : 'border-gray-800 bg-[#2C2C2C]'
              }`}
            >
              <span className="text-white">USSD</span>
              <span className="text-sm text-gray-400">*123#</span>
            </button>
          </div>
        </div>

        {/* Fee Display */}
        {selectedMethod === 'card' && amount && (
          <div className="bg-[#2C2C2C] rounded-xl p-4 mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Fee (1.5%)</span>
              <span className="text-red-400">-₦{(parseFloat(amount) * 0.015).toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span className="text-gray-400">You'll receive</span>
              <span className="text-[#F6A100]">₦{(parseFloat(amount) * 0.985).toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Continue Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleContinue}
          disabled={!amount || parseFloat(amount) <= 0}
          className={`w-full py-4 rounded-xl font-bold text-lg ${
            amount && parseFloat(amount) > 0
              ? 'bg-[#F6A100] text-[#1F1F1F]'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue
        </motion.button>
      </div>
    </div>
  );
}