'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Wallet, ChevronDown, AlertCircle, QrCode } from 'lucide-react';

export default function WithdrawCrypto() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('TRC20');
  const [address, setAddress] = useState('');
  const [step, setStep] = useState<'input' | 'review' | 'confirming'>('input');

  const cryptoBalance = 100.00;
  const exchangeRate = 1600;
  const fee = 0.008; // 0.8%

  const amountNum = parseFloat(amount) || 0;
  const feeAmount = amountNum * fee;
  const receiveAmount = amountNum - feeAmount;

  const networks = [
    { id: 'TRC20', name: 'USDT (TRC20)', fee: '1 USDT' },
    { id: 'ERC20', name: 'USDT (ERC20)', fee: '10 USDT' },
    { id: 'BEP20', name: 'USDT (BEP20)', fee: '0.5 USDT' }
  ];

  const handleContinue = () => {
    if (amountNum > 0 && amountNum <= cryptoBalance && address) {
      setStep('review');
    }
  };

  const handleConfirm = () => {
    setStep('confirming');
    // Simulate processing
    setTimeout(() => {
      alert('Withdrawal successful! (Demo)');
      router.push('/dashboard');
    }, 2000);
  };

  if (step === 'confirming') {
    return (
      <div className="min-h-screen bg-[#1F1F1F] flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-16 h-16 border-4 border-[#F6A100] border-t-transparent rounded-full animate-spin mb-6"></div>
          <h1 className="text-2xl font-bold mb-2">Processing Withdrawal</h1>
          <p className="text-gray-400 text-center">
            Sending {amount} USDT to external wallet...
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
            </div>

            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-gray-700">
                <span className="text-gray-400">Network</span>
                <span className="text-white">{selectedNetwork}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-700">
                <span className="text-gray-400">Network Fee</span>
                <span className="text-red-400">{networks.find(n => n.id === selectedNetwork)?.fee}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-700">
                <span className="text-gray-400">ZumaPay Fee (0.8%)</span>
                <span className="text-red-400">{feeAmount.toFixed(2)} USDT</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-gray-400">You'll receive</span>
                <span className="text-[#F6A100] font-bold text-xl">{receiveAmount.toFixed(2)} USDT</span>
              </div>
            </div>
          </motion.div>

          <div className="bg-[#2C2C2C] rounded-2xl p-6 mb-8">
            <h3 className="font-semibold mb-4">Destination Address</h3>
            <p className="text-white font-mono text-sm break-all bg-[#1F1F1F] p-3 rounded-xl">
              {address}
            </p>
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
        <h1 className="text-xl font-bold">Withdraw Crypto</h1>
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
                <span className="text-white">{network.name}</span>
                <span className="text-sm text-gray-400">Fee: {network.fee}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Wallet Address Input */}
        <div className="mb-6">
          <label className="text-gray-400 text-sm mb-2 block">Destination Address</label>
          <div className="relative">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter wallet address"
              className="w-full bg-[#2C2C2C] text-white rounded-xl p-4 pr-12 outline-none focus:ring-2 focus:ring-[#F6A100]"
            />
            <button className="absolute right-4 top-4">
              <QrCode className="text-gray-400" size={20} />
            </button>
          </div>
        </div>

        {/* Warning Notice */}
        <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-xl p-4 mb-8 flex gap-3">
          <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
          <p className="text-red-500 text-sm">
            Double-check the address and network. Crypto transactions cannot be reversed.
          </p>
        </div>

        {/* Continue Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleContinue}
          disabled={!amountNum || amountNum > cryptoBalance || !address}
          className={`w-full py-4 rounded-xl font-bold text-lg ${
            amountNum && amountNum <= cryptoBalance && address
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