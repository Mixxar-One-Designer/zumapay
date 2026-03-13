'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Copy, QrCode, AlertCircle, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Simple wallet generator function
const generateWalletAddress = (userId: string, network: string) => {
  const userSuffix = userId.replace(/-/g, '').slice(-6);
  
  if (network === 'TRC20') return `TQ8k8j9a7e2B3F5Y1Kx7${userSuffix}`;
  if (network === 'ERC20') return `0x7a8b3c9d2e1f4a5b6c7d${userSuffix}`;
  if (network === 'BEP20') return `bnb1a2b3c4d5e6f7a8b9c0${userSuffix}`;
  return '';
};

export default function DepositCrypto() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [selectedNetwork, setSelectedNetwork] = useState('TRC20');
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (user) {
      const address = generateWalletAddress(user.id, selectedNetwork);
      setWalletAddress(address);
    }
  }, [selectedNetwork, user]);

  const loadUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/');
        return;
      }
      setUser(user);
      const address = generateWalletAddress(user.id, 'TRC20');
      setWalletAddress(address);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const networks = [
    { id: 'TRC20', name: 'USDT (TRC20)', desc: 'Recommended - Low fees' },
    { id: 'ERC20', name: 'USDT (ERC20)', desc: 'Higher gas fees' },
    { id: 'BEP20', name: 'USDT (BEP20)', desc: 'Binance Smart Chain' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1F1F1F] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#F6A100] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1F1F1F] pb-20">
      {/* Header */}
      <div className="p-6 flex items-center gap-4 border-b border-gray-800">
        <button onClick={() => router.back()}>
          <ArrowLeft className="text-white" size={24} />
        </button>
        <h1 className="text-xl font-bold">Deposit Crypto</h1>
      </div>

      <div className="p-6">
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
                  <div className={`w-2 h-2 rounded-full ${network.id === 'TRC20' ? 'bg-[#F6A100]' : 'bg-gray-500'}`}></div>
                  <div className="text-left">
                    <span className="text-white block">{network.name}</span>
                    <span className="text-gray-400 text-xs">{network.desc}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Wallet Address - THIS WILL NOW SHOW */}
        {walletAddress && (
          <div className="mb-6">
            <label className="text-gray-400 text-sm mb-2 block">
              Your {selectedNetwork} Address
            </label>
            <div className="bg-[#2C2C2C] rounded-xl p-4 border border-gray-800">
              <p className="text-white font-mono text-sm break-all bg-[#1F1F1F] p-3 rounded-xl mb-3">
                {walletAddress}
              </p>
              
              <div className="flex gap-3">
  <button
    onClick={copyAddress}
    className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#F6A100] rounded-xl text-[#1F1F1F] font-semibold hover:bg-opacity-90 transition-all"
  >
    <Copy size={18} />
    {copied ? 'Copied!' : 'Copy'}
  </button>
  
  <button
    onClick={() => setShowQR(!showQR)}
    className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#F6A100] rounded-xl text-[#1F1F1F] font-semibold hover:bg-opacity-90 transition-all"
  >
    <QrCode size={18} />
    QR
  </button>
</div>
            </div>
          </div>
        )}

        {/* QR Code */}
        {showQR && walletAddress && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 flex justify-center"
          >
            <div className="bg-white p-4 rounded-2xl">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${walletAddress}`}
                alt="QR Code"
                className="w-48 h-48"
              />
            </div>
          </motion.div>
        )}

        {/* Warning */}
        <div className="border border-yellow-500 rounded-xl p-4 mb-6">
          <div className="flex gap-3">
            <AlertCircle className="text-yellow-500 flex-shrink-0" size={20} />
            <p className="text-yellow-500 text-sm">
              Send ONLY USDT ({selectedNetwork}) to this address. Wrong network = permanent loss.
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-[#2C2C2C] rounded-xl p-5">
          <h3 className="text-white font-semibold mb-3">How to deposit:</h3>
          <div className="space-y-2 text-sm text-gray-400">
            <p>1. Copy your {selectedNetwork} address</p>
            <p>2. Open your external wallet</p>
            <p>3. Send USDT to this address</p>
          </div>
        </div>
      </div>
    </div>
  );
}