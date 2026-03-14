'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Wallet, Copy, Check, ExternalLink } from 'lucide-react';

export default function TreasuryPage() {
  const router = useRouter();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const treasuryAddress = process.env.NEXT_PUBLIC_TREASURY_WALLET_ADDRESS || 'TWt5GvrxwKDTHruR6iha3hqZqqcT9uhFNF';

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setBalance(0);
      setLoading(false);
    }, 1000);
  }, []);

  const copyAddress = () => {
    navigator.clipboard.writeText(treasuryAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F6A100]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()}>
          <ArrowLeft style={{ color: 'var(--text-primary)' }} size={24} />
        </button>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Treasury Wallet</h1>
      </div>

      {/* Treasury Address */}
      <div className="rounded-xl p-4 mb-4 border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Treasury Address</span>
          <button onClick={copyAddress} className="flex items-center gap-1 text-[#F6A100] text-xs">
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <p className="text-sm font-mono break-all" style={{ color: 'var(--text-primary)' }}>{treasuryAddress}</p>
        <a 
          href={`https://tronscan.org/#/address/${treasuryAddress}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs mt-2"
          style={{ color: 'var(--text-secondary)' }}
        >
          View on Tronscan <ExternalLink size={12} />
        </a>
      </div>

      {/* Balance Card */}
      <div className="rounded-xl p-6 mb-6 text-center border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <Wallet className="mx-auto mb-2" size={32} style={{ color: '#F6A100' }} />
        <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Treasury Balance</p>
        <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{balance?.toFixed(2) || '0.00'} USDT</p>
      </div>

      {/* Send USDT Form - Disabled for now */}
      <div className="rounded-xl p-5 mb-6 border opacity-50" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <h2 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Send USDT (Coming Soon)</h2>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          Sending transactions requires a secure backend implementation and will be available in a future update.
        </p>
        <div className="space-y-4 opacity-50 pointer-events-none">
          <div>
            <label className="text-sm mb-2 block" style={{ color: 'var(--text-secondary)' }}>Recipient Address</label>
            <input
              type="text"
              disabled
              placeholder="T..."
              className="w-full rounded-xl p-3 outline-none"
              style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
            />
          </div>
          <button
            disabled
            className="w-full py-3 rounded-xl font-semibold opacity-50 cursor-not-allowed"
            style={{ backgroundColor: '#F6A100', color: '#1F1F1F' }}
          >
            Send USDT
          </button>
        </div>
      </div>
    </div>
  );
}