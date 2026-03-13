'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function History() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/');
      return;
    }

    const { data: withdrawals } = await supabase
      .from('withdrawal_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setTransactions(withdrawals || []);
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1F1F1F] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F6A100]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1F1F1F] pb-20">
      <div className="p-6 flex items-center gap-4 border-b border-gray-800">
        <button onClick={() => router.back()}>
          <ArrowLeft className="text-white" size={24} />
        </button>
        <h1 className="text-xl font-bold">Transaction History</h1>
      </div>

      <div className="p-6">
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="text-gray-400 mx-auto mb-4" size={48} />
            <p className="text-white mb-2">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="bg-[#2C2C2C] rounded-xl p-4 border border-gray-800">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-white font-bold">Withdrawal</span>
                  {tx.status === 'pending' && (
                    <span className="text-yellow-500 font-bold">● PENDING</span>
                  )}
                  {tx.status === 'completed' && (
                    <span className="text-green-500 font-bold">● COMPLETED</span>
                  )}
                  {tx.status === 'rejected' && (
                    <span className="text-red-500 font-bold">● REJECTED</span>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount:</span>
                    <span className="text-white">{tx.amount_usdt} USDT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">You Receive:</span>
                    <span className="text-[#F6A100]">₦{Number(tx.amount_ngn).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Bank:</span>
                    <span className="text-white">{tx.bank_name}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-700">
                    <span className="text-gray-400 text-sm">{formatDate(tx.created_at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}