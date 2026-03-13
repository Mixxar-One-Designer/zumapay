'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  RefreshCw,
  Filter,
  ChevronRight,
  Wallet,
  Search,
  Calendar,
  Download
} from 'lucide-react';

export default function History() {
  const router = useRouter();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);

  const transactions = [
    {
      id: 1,
      type: 'deposit',
      amount: '+50 USDT',
      fiat: '₦80,000',
      status: 'completed',
      date: 'Today • 10:42 AM',
      time: '10:42 AM',
      fullDate: 'March 13, 2026',
      from: 'External Wallet',
      to: 'ZumaPay Wallet',
      txHash: '0x7a8b3c9d2e1f4a5b6c7d8e9f0a1b2c3d4e5f6a7b',
      icon: ArrowDownCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500'
    },
    {
      id: 2,
      type: 'withdrawal',
      amount: '-30 USDT',
      fiat: '₦48,000',
      status: 'completed',
      date: 'Yesterday • 6:20 PM',
      time: '6:20 PM',
      fullDate: 'March 12, 2026',
      from: 'ZumaPay Wallet',
      to: 'GTBank • 0123456789',
      txHash: '0x9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c',
      icon: ArrowUpCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-500'
    },
    {
      id: 3,
      type: 'conversion',
      amount: '100 USDT → ₦160,000',
      fiat: '',
      status: 'processing',
      date: 'Today • 11:03 AM',
      time: '11:03 AM',
      fullDate: 'March 13, 2026',
      from: 'USDT',
      to: 'NGN',
      rate: '1 USDT = ₦1,600',
      icon: RefreshCw,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500'
    },
    {
      id: 4,
      type: 'deposit',
      amount: '+25 USDT',
      fiat: '₦40,000',
      status: 'completed',
      date: '2 days ago • 3:15 PM',
      time: '3:15 PM',
      fullDate: 'March 11, 2026',
      from: 'Binance',
      to: 'ZumaPay Wallet',
      txHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
      icon: ArrowDownCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500'
    },
    {
      id: 5,
      type: 'withdrawal',
      amount: '-15 USDT',
      fiat: '₦24,000',
      status: 'completed',
      date: '3 days ago • 9:30 AM',
      time: '9:30 AM',
      fullDate: 'March 10, 2026',
      from: 'ZumaPay Wallet',
      to: 'Access Bank • 9876543210',
      txHash: '0x5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b',
      icon: ArrowUpCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-500'
    },
    {
      id: 6,
      type: 'conversion',
      amount: '50 USDT → ₦80,000',
      fiat: '',
      status: 'completed',
      date: '4 days ago • 2:45 PM',
      time: '2:45 PM',
      fullDate: 'March 9, 2026',
      from: 'USDT',
      to: 'NGN',
      rate: '1 USDT = ₦1,600',
      icon: RefreshCw,
      color: 'text-green-500',
      bgColor: 'bg-green-500'
    }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed':
        return 'text-green-500 bg-green-500 bg-opacity-20';
      case 'processing':
        return 'text-yellow-500 bg-yellow-500 bg-opacity-20';
      default:
        return 'text-gray-500 bg-gray-500 bg-opacity-20';
    }
  };

  const filteredTransactions = transactions
    .filter(t => filter === 'all' || t.type === filter)
    .filter(t => 
      searchTerm === '' || 
      t.amount.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.fiat.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Transaction Detail Modal
  if (selectedTransaction) {
    return (
      <div className="min-h-screen bg-[#1F1F1F]">
        <div className="p-6 flex items-center gap-4 border-b border-gray-800">
          <button onClick={() => setSelectedTransaction(null)}>
            <ArrowLeft className="text-white" size={24} />
          </button>
          <h1 className="text-xl font-bold">Transaction Details</h1>
        </div>

        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className={`w-16 h-16 ${selectedTransaction.bgColor} bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4`}>
              <selectedTransaction.icon className={selectedTransaction.color} size={32} />
            </div>
            <p className="text-2xl font-bold mb-2">{selectedTransaction.amount}</p>
            {selectedTransaction.fiat && (
              <p className="text-gray-400">{selectedTransaction.fiat}</p>
            )}
          </motion.div>

          <div className="bg-[#2C2C2C] rounded-2xl p-6 mb-6">
            <div className="space-y-4">
              <div className="flex justify-between pb-4 border-b border-gray-700">
                <span className="text-gray-400">Status</span>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(selectedTransaction.status)}`}>
                  {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
                </span>
              </div>
              
              <div className="flex justify-between pb-4 border-b border-gray-700">
                <span className="text-gray-400">Type</span>
                <span className="text-white capitalize">{selectedTransaction.type}</span>
              </div>
              
              <div className="flex justify-between pb-4 border-b border-gray-700">
                <span className="text-gray-400">Date & Time</span>
                <span className="text-white">{selectedTransaction.fullDate} • {selectedTransaction.time}</span>
              </div>
              
              <div className="flex justify-between pb-4 border-b border-gray-700">
                <span className="text-gray-400">From</span>
                <span className="text-white text-right">{selectedTransaction.from}</span>
              </div>
              
              <div className="flex justify-between pb-4 border-b border-gray-700">
                <span className="text-gray-400">To</span>
                <span className="text-white text-right">{selectedTransaction.to}</span>
              </div>
              
              {selectedTransaction.rate && (
                <div className="flex justify-between pb-4 border-b border-gray-700">
                  <span className="text-gray-400">Exchange Rate</span>
                  <span className="text-white">{selectedTransaction.rate}</span>
                </div>
              )}
              
              {selectedTransaction.txHash && (
                <div>
                  <span className="text-gray-400 block mb-2">Transaction Hash</span>
                  <p className="text-white text-xs break-all bg-[#1F1F1F] p-3 rounded-xl">
                    {selectedTransaction.txHash}
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setSelectedTransaction(null)}
            className="w-full py-4 rounded-xl border border-[#F6A100] text-[#F6A100] font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Main History Screen
  return (
    <div className="min-h-screen bg-[#1F1F1F] pb-20">
      {/* Header */}
      <div className="p-6 flex items-center gap-4 border-b border-gray-800">
        <button onClick={() => router.back()}>
          <ArrowLeft className="text-white" size={24} />
        </button>
        <h1 className="text-xl font-bold flex-1">Transaction History</h1>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="text-gray-400"
        >
          <Filter size={20} />
        </button>
      </div>

      {/* Balance Summary */}
      <div className="p-6 border-b border-gray-800">
        <div className="bg-[#2C2C2C] rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Available Balance</p>
          <p className="text-[#F6A100] font-bold text-2xl">100.00 USDT</p>
          <p className="text-white">≈ ₦160,000</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-6 pt-4">
        <div className="relative">
          <Search className="absolute left-4 top-4 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search transactions..."
            className="w-full bg-[#2C2C2C] text-white rounded-xl p-4 pl-12 outline-none focus:ring-2 focus:ring-[#F6A100]"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-6 pb-4"
          >
            <div className="bg-[#2C2C2C] rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold">Filter by</span>
                <button 
                  onClick={() => {
                    setFilter('all');
                    setSearchTerm('');
                  }}
                  className="text-[#F6A100] text-sm"
                >
                  Reset
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {['all', 'deposit', 'withdrawal', 'conversion'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${
                      filter === f
                        ? 'bg-[#F6A100] text-[#1F1F1F]'
                        : 'bg-[#1F1F1F] text-gray-400'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <button className="flex items-center gap-2 text-gray-400">
                  <Calendar size={16} />
                  <span className="text-sm">Select Date Range</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transactions List */}
      <div className="px-6 space-y-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400 text-sm">
            {filteredTransactions.length} transactions
          </span>
          <button className="flex items-center gap-1 text-[#F6A100] text-sm">
            <Download size={16} />
            Export
          </button>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[#2C2C2C] rounded-full flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="text-gray-400" size={24} />
            </div>
            <p className="text-gray-400">No transactions found</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          filteredTransactions.map((tx, index) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedTransaction(tx)}
              className="bg-[#2C2C2C] rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:bg-opacity-80 transition-all"
            >
              <div className={`p-2 rounded-full ${tx.color.replace('text', 'bg')} bg-opacity-20`}>
                <tx.icon className={tx.color} size={20} />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-white font-medium capitalize">{tx.type}</span>
                  <span className={tx.color}>{tx.amount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-xs">{tx.date}</span>
                  <div className="flex items-center gap-2">
                    {tx.fiat && <span className="text-white text-sm">{tx.fiat}</span>}
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(tx.status)}`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <ChevronRight className="text-gray-400" size={18} />
            </motion.div>
          ))
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#2C2C2C] border-t border-gray-800 p-4">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button 
            onClick={() => router.push('/dashboard')}
            className="flex flex-col items-center text-gray-400 hover:text-[#F6A100]"
          >
            <Wallet size={20} />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button 
            onClick={() => router.push('/history')}
            className="flex flex-col items-center text-[#F6A100]"
          >
            <Filter size={20} />
            <span className="text-xs mt-1">History</span>
          </button>
          <button 
            onClick={() => router.push('/profile')}
            className="flex flex-col items-center text-gray-400 hover:text-[#F6A100]"
          >
            <Wallet size={20} />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}