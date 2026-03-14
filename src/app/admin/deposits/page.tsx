'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Transaction {
  id: number;
  amount: number;
  status: string;
  confirmations: number;
  tx_hash: string;
  created_at: string;
  user_id: string;
}

export default function DepositMonitor() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
    const interval = setInterval(loadTransactions, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadTransactions = async () => {
    const { data } = await supabase
      .from('crypto_transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    
    setTransactions(data || []);
    setLoading(false);
  };

  const triggerManualCheck = async () => {
    await fetch('/api/check-deposits');
    loadTransactions();
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Deposit Monitor</h1>
      
      <button
        onClick={triggerManualCheck}
        className="mb-4 px-4 py-2 rounded-lg font-medium"
        style={{ backgroundColor: '#F6A100', color: '#1F1F1F' }}
      >
        Manual Check
      </button>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F6A100] mx-auto"></div>
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No transactions found</p>
          ) : (
            transactions.map((tx: Transaction) => (
              <div key={tx.id} className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                <div className="flex justify-between">
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{tx.amount} USDT</span>
                  <span style={{ color: tx.status === 'completed' ? '#22c55e' : '#eab308' }}>
                    {tx.status} ({tx.confirmations}/20)
                  </span>
                </div>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>TX: {tx.tx_hash?.slice(0, 30)}...</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}