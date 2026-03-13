'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Copy, QrCode, ChevronDown, AlertCircle, Check, ExternalLink } from 'lucide-react';

export default function DepositCrypto() {
  const router = useRouter();
  const [selectedNetwork, setSelectedNetwork] = useState('TRC20');
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [depositStep, setDepositStep] = useState<'address' | 'waiting' | 'confirming' | 'success'>('address');

  const cryptoBalance = 100.00;
  const exchangeRate = 1600;
  const walletAddress = 'TQ8k8j9a7e2B3F5Y1Kx7P9m4N2R6v8W3z';

  const networks = [
    { id: 'TRC20', name: 'USDT (TRC20)', fee: 'Low', popular: true },
    { id: 'ERC20', name: 'USDT (ERC20)', fee: 'High', popular: false },
    { id: 'BEP20', name: 'USDT (BEP20)', fee: 'Low', popular: false }
  ];

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleISent = () => {
    setDepositStep('waiting');
    setShowDepositForm(true);
  };

  const handleSubmitTx = () => {
    if (txHash) {
      setDepositStep('confirming');
      // Simulate confirmation after 3 seconds
      setTimeout(() => {
        setDepositStep('success');
      }, 3000);
    }
  };

  const handleDone = () => {
    router.push('/dashboard');
  };

  // Success State
  if (depositStep === 'success') {
    return (
      <div className="min-h-screen bg-[#1F1F1F] flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6"
          >
            <Check size={40} className="text-white" />
          </motion.div>
          
          <h1 className="text-2xl font-bold mb-2">Deposit Successful!</h1>
          <p className="text-gray-400 text-center mb-8">
            Your crypto has been credited to your wallet
          </p>

          <div className="bg-[#2C2C2C] rounded-xl p-6 w-full mb-8">
            <div className="text-center mb-4">
              <p className="text-gray-400 mb-1">Amount Deposited</p>
              <p className="text-[#F6A100] text-3xl font-bold">50 USDT</p>
              <p className="text-white">≈ ₦80,000</p>
            </div>
            <div className="border-t border-gray-700 pt-4">
              <p className="text-gray-400 text-sm mb-2">Transaction Hash</p>
              <p className="text-white text-xs break-all">{txHash}</p>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleDone}
            className="w-full bg-[#F6A100] text-[#1F1F1F] font-bold text-lg py-4 rounded-xl"
          >
            Back to Dashboard
          </motion.button>
        </div>
      </div>
    );
  }

  // Waiting/Confirming State
  if (showDepositForm) {
    return (
      <div className="min-h-screen bg-[#1F1F1F]">
        <div className="p-6 flex items-center gap-4 border-b border-gray-800">
          <button onClick={() => {
            setShowDepositForm(false);
            setDepositStep('address');
          }}>
            <ArrowLeft className="text-white" size={24} />
          </button>
          <h1 className="text-xl font-bold">
            {depositStep === 'waiting' ? 'Confirm Deposit' : 'Confirming Transaction'}
          </h1>
        </div>

        <div className="p-6">
          {depositStep === 'waiting' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="bg-[#2C2C2C] rounded-xl p-6 mb-6">
                <h3 className="font-semibold mb-4">Enter Transaction Details</h3>
                <label className="text-gray-400 text-sm mb-2 block">Transaction Hash</label>
                <input
                  type="text"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  placeholder="Paste transaction hash here"
                  className="w-full bg-[#1F1F1F] text-white rounded-xl p-4 mb-4 outline-none focus:ring-2 focus:ring-[#F6A100]"
                />
                <p className="text-gray-400 text-xs mb-6">
                  You can find this in your wallet app after sending the transaction
                </p>
                <button
                  onClick={handleSubmitTx}
                  disabled={!txHash}
                  className={`w-full py-4 rounded-xl font-bold text-lg ${
                    txHash 
                      ? 'bg-[#F6A100] text-[#1F1F1F]' 
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Submit for Confirmation
                </button>
              </div>

              <div className="bg-yellow-500 bg-opacity-10 rounded-xl p-4 flex gap-3">
                <AlertCircle className="text-yellow-500 flex-shrink-0" size={20} />
                <p className="text-yellow-500 text-sm">
                  Make sure you've sent the exact amount to the correct address. 
                  Blockchain transactions cannot be reversed.
                </p>
              </div>
            </motion.div>
          )}

          {depositStep === 'confirming' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 border-4 border-[#F6A100] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <h3 className="text-xl font-bold mb-2">Confirming Transaction</h3>
              <p className="text-gray-400">
                Waiting for blockchain confirmations...
              </p>
              <p className="text-gray-500 text-sm mt-4">
                This usually takes 1-2 minutes
              </p>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // Main Deposit Address Screen
  return (
    <div className="min-h-screen bg-[#1F1F1F]">
      {/* Header */}
      <div className="p-6 flex items-center gap-4 border-b border-gray-800">
        <button onClick={() => router.back()}>
          <ArrowLeft className="text-white" size={24} />
        </button>
        <h1 className="text-xl font-bold">Deposit Crypto</h1>
      </div>

      <div className="p-6">
        {/* Balance Card */}
        <div className="bg-[#2C2C2C] rounded-xl p-4 mb-6">
          <p className="text-gray-400 text-sm mb-1">Current Balance</p>
          <p className="text-[#F6A100] font-bold text-2xl">{cryptoBalance} USDT</p>
          <p className="text-white">≈ ₦{(cryptoBalance * exchangeRate).toLocaleString()}</p>
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
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${network.popular ? 'bg-[#F6A100]' : 'bg-gray-500'}`}></div>
                  <span className="text-white">{network.name}</span>
                </div>
                <span className={`text-sm ${network.fee === 'Low' ? 'text-green-500' : 'text-yellow-500'}`}>
                  {network.fee} Fee
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Deposit Address */}
        <div className="mb-6">
          <label className="text-gray-400 text-sm mb-2 block">Deposit Address</label>
          <div className="bg-[#2C2C2C] rounded-xl p-4">
            <p className="text-white font-mono text-sm break-all mb-3">{walletAddress}</p>
            <div className="flex gap-3">
              <button
                onClick={copyAddress}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#F6A100] bg-opacity-20 rounded-xl text-[#F6A100] font-semibold hover:bg-opacity-30 transition-all"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={() => setShowQR(!showQR)}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#F6A100] bg-opacity-20 rounded-xl text-[#F6A100] font-semibold hover:bg-opacity-30 transition-all"
              >
                <QrCode size={18} />
                QR Code
              </button>
            </div>
          </div>
        </div>

        {/* QR Code */}
        {showQR && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 flex justify-center"
          >
            <div className="bg-white p-4 rounded-2xl">
              <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                <QrCode size={100} className="text-gray-600" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Warning Notice */}
        <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-xl p-4 mb-6 flex gap-3">
          <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
          <div>
            <p className="text-red-500 font-semibold mb-1">Important</p>
            <p className="text-red-500 text-sm">
              Only send USDT ({selectedNetwork}) to this address. 
              Sending other coins may result in permanent loss.
            </p>
          </div>
        </div>

        {/* I've Sent Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleISent}
          className="w-full bg-[#F6A100] text-[#1F1F1F] font-bold text-lg py-4 rounded-xl shadow-lg mb-4"
        >
          I Have Sent the Crypto
        </motion.button>

        {/* Instructions */}
        <div className="bg-[#2C2C2C] rounded-xl p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <ExternalLink size={16} className="text-[#F6A100]" />
            Instructions
          </h3>
          <ol className="space-y-2 text-sm text-gray-400">
            <li>1. Copy the deposit address above</li>
            <li>2. Go to your external wallet (Binance, Trust Wallet, etc.)</li>
            <li>3. Send USDT to this address on {selectedNetwork} network</li>
            <li>4. Come back and click "I Have Sent the Crypto"</li>
            <li>5. Enter the transaction hash to confirm</li>
          </ol>
        </div>
      </div>
    </div>
  );
}