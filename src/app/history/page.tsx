'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Clock, ArrowUp, ArrowDown, RefreshCw, X } from 'lucide-react';
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
  network?: string;
  to_address?: string;
  from_address?: string;
  tx_hash?: string;
  confirmations?: number;
  bank_name?: string;
  account_number?: string;
  account_name?: string;
  reference?: string;
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
  account_name?: string;
  fee?: number;
  reference?: string;
  currency?: string;
}

type Transaction = (RegularTransaction | WithdrawalTransaction) & {
  amount?: number;
  currency?: string;
};

// Main component that uses useSearchParams
function HistoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refreshTrigger = searchParams?.get('t');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedTransaction) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedTransaction]);

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

      // Get withdrawal requests (cash withdrawals)
      const { data: withdrawals } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Get crypto transactions
      const { data: cryptoTxs } = await supabase
        .from('crypto_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Create a Map to deduplicate
      const uniqueTxs = new Map();

      // Add regular transactions
      (regularTxs || []).forEach(tx => {
        const key = `reg-${tx.id}`;
        uniqueTxs.set(key, { ...tx, type: tx.type });
      });

      // Add withdrawals (cash)
      (withdrawals || []).forEach(w => {
        const key = `cash-${w.id}`;
        uniqueTxs.set(key, { 
          ...w, 
          type: 'withdrawal',
          amount: w.amount_usdt,
          currency: 'USDT',
        });
      });

      // Add crypto transactions
      (cryptoTxs || []).forEach(c => {
        const key = `crypto-${c.id}`;
        uniqueTxs.set(key, { 
          ...c, 
          type: 'withdrawal',
          amount: c.amount,
          currency: 'USDT',
          network: c.network,
          to_address: c.to_address,
          from_address: c.from_address,
          tx_hash: c.tx_hash,
          confirmations: c.confirmations,
          status: c.status || 'completed'
        });
      });

      // Convert Map to array and sort by date
      const allTxs = Array.from(uniqueTxs.values())
        .sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

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
      case 'deposit': return <ArrowDown className="text-green-500" size={20} />;
      case 'withdrawal': return <ArrowUp className="text-red-500" size={20} />;
      case 'conversion': return <RefreshCw className="text-blue-500" size={20} />;
      case 'buy': return <ArrowDown className="text-green-500" size={20} />;
      default: return <Clock className="text-gray-400" size={20} />;
    }
  };

  const formatAmount = (tx: Transaction) => {
    // Handle cash withdrawal
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
    
    // Handle crypto withdrawal
    if (tx.type === 'withdrawal' && 'network' in tx) {
      return (
        <div className="text-right">
          <div className="text-white font-bold">-{formatUSDT(tx.amount || 0)} USDT</div>
          <div className="text-xs text-gray-400">{tx.network || 'Transfer'}</div>
        </div>
      );
    }
    
    // Handle conversion type
    if (tx.type === 'conversion' && 'from_amount' in tx && 'to_amount' in tx) {
      const conv = tx as RegularTransaction;
      return (
        <div className="text-right">
          <div className="text-white text-sm">
            {conv.from_currency === 'NGN' ? formatNGN(conv.from_amount || 0) : formatUSDT(conv.from_amount || 0)} → 
          </div>
          <div className="text-[#F6A100] text-sm font-medium">
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
    
    // Handle deposit
    if (tx.type === 'deposit') {
      return (
        <div className="text-right">
          <div className="text-green-500 font-bold">+{formatUSDT(tx.amount || 0)} USDT</div>
        </div>
      );
    }
    
    // Default
    const amount = tx.amount || 0;
    const currency = tx.currency || 'USDT';
    const sign = tx.type === 'withdrawal' ? '-' : '+';
    
    return (
      <div className="text-white font-bold">
        {sign}{formatUSDT(amount)} {currency}
      </div>
    );
  };

  const getDetails = (tx: Transaction) => {
    // Cash withdrawal details
    if ('bank_name' in tx && tx.bank_name) {
      return (
        <>
          <p className="text-xs text-gray-400 mt-1">
            {tx.bank_name} • {tx.account_number?.slice(-4)}
          </p>
          {'reference' in tx && tx.reference && (
            <p className="text-xs text-gray-500 mt-1">
              Ref: {tx.reference.slice(-8)}
            </p>
          )}
        </>
      );
    }
    
    // Crypto withdrawal details
    if ('network' in tx && tx.network) {
      return (
        <>
          <p className="text-xs text-gray-400 mt-1">
            Network: {tx.network}
          </p>
          {'to_address' in tx && tx.to_address && (
            <p className="text-xs text-gray-500 mt-1">
              To: {tx.to_address.slice(0, 6)}...{tx.to_address.slice(-4)}
            </p>
          )}
          {'tx_hash' in tx && tx.tx_hash && (
            <p className="text-xs text-gray-500 mt-1">
              TX: {tx.tx_hash.slice(0, 8)}...
            </p>
          )}
        </>
      );
    }
    
    // Conversion details
    if (tx.type === 'conversion' && 'from_currency' in tx) {
      return (
        <p className="text-xs text-gray-400 mt-1">
          Rate: {formatNGN((tx.to_amount || 0) / (tx.from_amount || 1))}
        </p>
      );
    }
    
    return null;
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
      {/* Header */}
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
              className="bg-[#2C2C2C] rounded-xl p-4 border border-gray-800 cursor-pointer hover:opacity-80 transition-all"
              onClick={() => setSelectedTransaction(tx)}
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
                      {getDetails(tx)}
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

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedTransaction(null)}
        >
          <div 
            className="bg-[#2C2C2C] rounded-2xl w-full max-w-lg border border-gray-800 flex flex-col"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: '80vh' }}
          >
            {/* Modal Header - Fixed */}
            <div className="p-4 border-b border-gray-800 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-gray-700">
                  {getIcon(selectedTransaction.type)}
                </div>
                <h3 className="text-white font-semibold capitalize">{selectedTransaction.type} Details</h3>
              </div>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content - Scrollable Area */}
            <div className="overflow-y-auto flex-1 p-6">
              <div className="space-y-4 pb-4">
                {/* Amount */}
                <div className="bg-[#1F1F1F] rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">Amount</p>
                  <p className="text-2xl font-bold text-white">
                    {selectedTransaction.type === 'withdrawal' ? '-' : '+'}
                    {formatUSDT('amount_usdt' in selectedTransaction ? selectedTransaction.amount_usdt : (selectedTransaction.amount || 0))} USDT
                  </p>
                  {'amount_ngn' in selectedTransaction && (
                    <p className="text-[#F6A100] mt-1">
                      {formatNGN(selectedTransaction.amount_ngn - (selectedTransaction.fee || 0))}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400">Status</span>
                  <span className={`${getStatusColor(selectedTransaction.status)} font-medium capitalize`}>
                    {selectedTransaction.status}
                  </span>
                </div>

                {/* Date */}
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400">Date & Time</span>
                  <span className="text-white">
                    {new Date(selectedTransaction.created_at).toLocaleString()}
                  </span>
                </div>

                {/* Cash Withdrawal Details */}
                {'bank_name' in selectedTransaction && selectedTransaction.bank_name && (
                  <>
                    <div className="flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-gray-400">Bank</span>
                      <span className="text-white">{selectedTransaction.bank_name}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-gray-400">Account Number</span>
                      <span className="text-white">{selectedTransaction.account_number}</span>
                    </div>
                    {'account_name' in selectedTransaction && selectedTransaction.account_name && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-700">
                        <span className="text-gray-400">Account Name</span>
                        <span className="text-white">{selectedTransaction.account_name}</span>
                      </div>
                    )}
                    {'fee' in selectedTransaction && selectedTransaction.fee && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-700">
                        <span className="text-gray-400">Fee</span>
                        <span className="text-red-400">{formatNGN(selectedTransaction.fee)}</span>
                      </div>
                    )}
                    {'reference' in selectedTransaction && selectedTransaction.reference && (
                      <div className="py-2 border-b border-gray-700">
                        <span className="text-gray-400 block mb-2">Reference</span>
                        <p className="text-white text-sm font-mono break-all bg-[#1F1F1F] p-2 rounded">
                          {selectedTransaction.reference}
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* Crypto Withdrawal Details */}
                {'network' in selectedTransaction && selectedTransaction.network && (
                  <>
                    <div className="flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-gray-400">Network</span>
                      <span className="text-white">{selectedTransaction.network}</span>
                    </div>
                    {'to_address' in selectedTransaction && selectedTransaction.to_address && (
                      <div className="py-2 border-b border-gray-700">
                        <span className="text-gray-400 block mb-2">Destination Address</span>
                        <p className="text-white text-sm break-all bg-[#1F1F1F] p-3 rounded">
                          {selectedTransaction.to_address}
                        </p>
                      </div>
                    )}
                    {'from_address' in selectedTransaction && selectedTransaction.from_address && (
                      <div className="py-2 border-b border-gray-700">
                        <span className="text-gray-400 block mb-2">From Address</span>
                        <p className="text-white text-sm break-all bg-[#1F1F1F] p-3 rounded">
                          {selectedTransaction.from_address}
                        </p>
                      </div>
                    )}
                    {'tx_hash' in selectedTransaction && selectedTransaction.tx_hash && (
                      <div className="py-2 border-b border-gray-700">
                        <span className="text-gray-400 block mb-2">Transaction Hash</span>
                        <p className="text-white text-xs break-all bg-[#1F1F1F] p-3 rounded font-mono">
                          {selectedTransaction.tx_hash}
                        </p>
                      </div>
                    )}
                    {'confirmations' in selectedTransaction && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-700">
                        <span className="text-gray-400">Confirmations</span>
                        <span className="text-white">{selectedTransaction.confirmations}</span>
                      </div>
                    )}
                  </>
                )}

                {/* Conversion Details */}
                {selectedTransaction.type === 'conversion' && 'from_currency' in selectedTransaction && (
                  <>
                    <div className="flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-gray-400">From</span>
                      <span className="text-white">
                        {selectedTransaction.from_currency === 'NGN' 
                          ? formatNGN(selectedTransaction.from_amount || 0)
                          : formatUSDT(selectedTransaction.from_amount || 0) + ' USDT'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-gray-400">To</span>
                      <span className="text-[#F6A100]">
                        {selectedTransaction.to_currency === 'USDT'
                          ? formatUSDT(selectedTransaction.to_amount || 0) + ' USDT'
                          : formatNGN(selectedTransaction.to_amount || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-gray-400">Rate</span>
                      <span className="text-white">
                        1 {selectedTransaction.from_currency} = {
                          selectedTransaction.from_currency === 'NGN'
                            ? formatNGN((selectedTransaction.to_amount || 0) / (selectedTransaction.from_amount || 1))
                            : formatUSDT((selectedTransaction.to_amount || 0) / (selectedTransaction.from_amount || 1))
                        }
                      </span>
                    </div>
                    {'fee' in selectedTransaction && selectedTransaction.fee && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-700">
                        <span className="text-gray-400">Fee</span>
                        <span className="text-red-400">
                          {selectedTransaction.from_currency === 'NGN'
                            ? formatNGN(selectedTransaction.fee)
                            : formatUSDT(selectedTransaction.fee) + ' USDT'}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {/* Buy Details */}
                {selectedTransaction.type === 'buy' && 'fiat_amount' in selectedTransaction && (
                  <>
                    <div className="flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-gray-400">You Paid</span>
                      <span className="text-white">{formatNGN(selectedTransaction.fiat_amount || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-gray-400">You Received</span>
                      <span className="text-[#F6A100]">{formatUSDT(selectedTransaction.amount || 0)} USDT</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-700">
                      <span className="text-gray-400">Rate</span>
                      <span className="text-white">
                        1 USDT = {formatNGN((selectedTransaction.fiat_amount || 0) / (selectedTransaction.amount || 1))}
                      </span>
                    </div>
                    {'fee' in selectedTransaction && selectedTransaction.fee && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-700">
                        <span className="text-gray-400">Fee</span>
                        <span className="text-red-400">{formatNGN(selectedTransaction.fee)}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Close Button - FIXED AT BOTTOM */}
            <div className="p-4 border-t border-gray-800 flex-shrink-0 bg-[#2C2C2C]">
              <button
                onClick={() => setSelectedTransaction(null)}
                className="w-full bg-[#F6A100] text-[#1F1F1F] py-3 rounded-xl font-medium hover:bg-opacity-90 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Main export with Suspense boundary
export default function HistoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#1F1F1F] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F6A100]"></div>
      </div>
    }>
      <HistoryContent />
    </Suspense>
  );
}