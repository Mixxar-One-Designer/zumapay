'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell, Check, X, AlertCircle, TrendingUp, Wallet, ArrowDownToLine, ArrowUpFromLine, RefreshCw } from 'lucide-react';

export default function Notifications() {
  const router = useRouter();
  const [filter, setFilter] = useState('all');

  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Deposit Successful',
      message: 'You have successfully deposited 50 USDT',
      time: '2 minutes ago',
      icon: ArrowDownToLine,
      color: 'text-green-500',
      bgColor: 'bg-green-500',
      read: false
    },
    {
      id: 2,
      type: 'success',
      title: 'Withdrawal Completed',
      message: '₦158,720 has been sent to your GTBank account',
      time: '1 hour ago',
      icon: ArrowUpFromLine,
      color: 'text-green-500',
      bgColor: 'bg-green-500',
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'Rate Alert',
      message: 'USDT is now ₦1,600 - 2% higher than yesterday',
      time: '3 hours ago',
      icon: TrendingUp,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500',
      read: true
    },
    {
      id: 4,
      type: 'warning',
      title: 'KYC Verification Required',
      message: 'Please complete your KYC to increase withdrawal limits',
      time: '1 day ago',
      icon: AlertCircle,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500',
      read: true
    },
    {
      id: 5,
      type: 'success',
      title: 'Welcome to ZumaPay!',
      message: 'Thank you for joining. Start your first transaction today.',
      time: '2 days ago',
      icon: Wallet,
      color: 'text-green-500',
      bgColor: 'bg-green-500',
      read: true
    },
    {
      id: 6,
      type: 'info',
      title: 'Maintenance Update',
      message: 'Scheduled maintenance on March 15, 2AM - 4AM WAT',
      time: '3 days ago',
      icon: RefreshCw,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500',
      read: true
    }
  ];

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    // In a real app, this would update the database
    console.log('Mark all as read');
  };

  return (
    <div className="min-h-screen bg-[#1F1F1F]">
      {/* Header */}
      <div className="p-6 flex items-center gap-4 border-b border-gray-800">
        <button onClick={() => router.back()}>
          <ArrowLeft className="text-white" size={24} />
        </button>
        <h1 className="text-xl font-bold flex-1">Notifications</h1>
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="text-[#F6A100] text-sm flex items-center gap-1"
          >
            <Check size={16} />
            Mark all read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="p-6 flex gap-2 border-b border-gray-800">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            filter === 'all'
              ? 'bg-[#F6A100] text-[#1F1F1F]'
              : 'bg-[#2C2C2C] text-gray-400'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
            filter === 'unread'
              ? 'bg-[#F6A100] text-[#1F1F1F]'
              : 'bg-[#2C2C2C] text-gray-400'
          }`}
        >
          Unread
          {unreadCount > 0 && (
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${
              filter === 'unread' ? 'bg-[#1F1F1F] text-[#F6A100]' : 'bg-gray-700 text-gray-300'
            }`}>
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Notifications List */}
      <div className="p-6 space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[#2C2C2C] rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="text-gray-400" size={24} />
            </div>
            <p className="text-white font-medium mb-2">No notifications</p>
            <p className="text-gray-400 text-sm">You're all caught up!</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const IconComponent = notification.icon;
            return (
              <div
                key={notification.id}
                className={`bg-[#2C2C2C] rounded-xl p-4 border ${
                  !notification.read ? 'border-[#F6A100]' : 'border-gray-800'
                } relative`}
              >
                {!notification.read && (
                  <span className="absolute top-4 right-4 w-2 h-2 bg-[#F6A100] rounded-full"></span>
                )}
                
                <div className="flex gap-3">
                  <div className={`w-10 h-10 ${notification.bgColor} bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className={notification.color} size={20} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-white font-medium">{notification.title}</h3>
                      <span className="text-gray-400 text-xs">{notification.time}</span>
                    </div>
                    <p className="text-gray-400 text-sm">{notification.message}</p>
                    
                    {!notification.read && (
                      <button className="mt-2 text-[#F6A100] text-xs flex items-center gap-1">
                        <Check size={12} />
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Settings Link */}
      <div className="p-6 pt-0">
        <button className="w-full bg-[#2C2C2C] rounded-xl p-4 flex items-center justify-between border border-gray-800">
          <div className="flex items-center gap-3">
            <Bell className="text-gray-400" size={20} />
            <span className="text-white">Notification Settings</span>
          </div>
          <span className="text-gray-400">→</span>
        </button>
      </div>
    </div>
  );
}