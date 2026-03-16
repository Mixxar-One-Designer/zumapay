'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Clock, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatUSDT, formatNGN } from '@/lib/format';

interface RegularTransaction {
  id: number;
  type: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  from_amount?: number;
  from_currency?: string;
  to_amount?: number;
  to_currency?: string;
  fiat_amount?: number;
  fee?: number;
}

interface WithdrawalTransaction {
  id: number;
  type: string;
  amount_usdt: number;
  amount_ngn: number;
  status: string;
  created_at: string;
  bank_name?: string;
  account_number?: string;
  fee?: number;
  reference?: string;
  currency?: string;
}

type Transaction = (RegularTransaction | WithdrawalTransaction) & {
  amount?: number;
  currency?: string;
};

export default function HistoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refreshTrigger = searchParams?.get('t');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadTransactions();
  }, [refreshTrigger]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/');
        return;
      }

      // Get regular transactions
      const { data: regularTxs } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Get withdrawal requests
      const { data: withdrawals } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      console.log('Regular transactions:', regularTxs);
      console.log('Withdrawals:', withdrawals);

      // Combine and sort by date
      const allTxs: Transaction[] = [
        ...(regularTxs || []).map(tx => ({ ...tx, type: tx.type })),
        ...(withdrawals || []).map(w => ({ 
          ...w, 
          type: 'withdrawal',
          amount: w.amount_usdt,
          currency: 'USDT',
        }))
      ].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      console.log('Combined transactions:', allTxs);
      setTransactions(allTxs);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTxs = filter === 'all' 
    ? transactions 
    : transactions.filter(tx => tx.type === filter);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'text-green-500';
      case 'pending': return 'text-yellow-500';
      case 'failed': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'deposit': return <ArrowDown className="text-green-500" size={18} />;
      case 'withdrawal': return <ArrowUp className="text-red-500" size={18} />;
      case 'conversion': return <RefreshCw className="text-blue-500" size={18} />;
      case 'buy': return <ArrowDown className="text-green-500" size={18} />;
      default: return <Clock className="text-gray-400" size={18} />;
    }
  };

  const formatAmount = (tx: Transaction) => {
    // Handle withdrawal type
    if (tx.type === 'withdrawal' && 'amount_usdt' in tx && 'amount_ngn' in tx) {
      const withdrawal = tx as WithdrawalTransaction;
      const fee = withdrawal.fee || 0;
      return (
        <div className="text-right">
          <div className="text-white font-bold">-{formatUSDT(withdrawal.amount_usdt)} USDT</div>
          <div className="text-xs text-gray-400">+{formatNGN(withdrawal.amount_ngn - fee)}</div>
        </div>
      );
    }
    
    // Handle conversion type
    if (tx.type === 'conversion' && 'from_amount' in tx && 'to_amount' in tx) {
      const conv = tx as RegularTransaction;
      return (
        <div className="text-right">
          <div className="text-white text-sm">
            {conv.from_currency === 'NGN' ? formatNGN(conv.from_amount || 0) : formatUSDT(conv.from_amount || 0)} → {' '}
            {conv.to_currency === 'USDT' ? formatUSDT(conv.to_amount || 0) : formatNGN(conv.to_amount || 0)}
          </div>
        </div>
      );
    }
    
    // Handle buy type
    if (tx.type === 'buy' && 'fiat_amount' in tx) {
      const buy = tx as RegularTransaction;
      return (
        <div className="text-right">
          <div className="text-white font-bold">{formatUSDT(tx.amount || 0)} USDT</div>
          <div className="text-xs text-gray-400">-{formatNGN(buy.fiat_amount || 0)}</div>
        </div>
      );
    }
    
    // Handle deposit and other types
    const amount = tx.amount || 0;
    const currency = tx.currency || 'USDT';
    const sign = tx.type === 'withdrawal' ? '-' : '+';
    
    return (
      <div className="text-white font-bold">
        {sign}{formatUSDT(amount)} {currency}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F6A100]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="p-6 flex items-center gap-4 border-b border-gray-800">
        <button onClick={() => router.back()}>
          <ArrowLeft style={{ color: 'var(--text-primary)' }} size={24} />
        </button>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Transaction History</h1>
      </div>

      {/* Filter Tabs */}
      <div className="px-6 py-4 flex gap-2 overflow-x-auto">
        {['all', 'deposit', 'withdrawal', 'conversion', 'buy'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap ${
              filter === f
                ? 'bg-[#F6A100] text-[#1F1F1F]'
                : 'bg-[#2C2C2C] text-gray-400'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      <div className="px-6 space-y-3">
        {filteredTxs.length === 0 ? (
          <div className="text-center py-12">
            <Clock size={48} className="mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} />
            <p style={{ color: 'var(--text-primary)' }} className="mb-2">No transactions yet</p>
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm">Your activity will appear here</p>
          </div>
        ) : (
          filteredTxs.map((tx, index) => (
            <div
              key={`${tx.type}-${tx.id}-${index}`}
              className="bg-[#2C2C2C] rounded-xl p-4 border border-gray-800"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-opacity-20 bg-gray-700">
                  {getIcon(tx.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-medium capitalize">{tx.type}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(tx.created_at).toLocaleString()}
                      </p>
                      {'bank_name' in tx && tx.bank_name && (
                        <p className="text-xs text-gray-400 mt-1">
                          {tx.bank_name} • {tx.account_number?.slice(-4)}
                        </p>
                      )}
                      {'reference' in tx && tx.reference && (
                        <p className="text-xs text-gray-500 mt-1">
                          Ref: {tx.reference.slice(-8)}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      {formatAmount(tx)}
                      <div className={`text-xs mt-1 ${getStatusColor(tx.status)}`}>
                        {tx.status}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}