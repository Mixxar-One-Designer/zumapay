'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell, ArrowUp, ArrowDown, RefreshCw, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNotifications, Notification } from '@/context/NotificationContext';

export default function NotificationsPage() {
  const router = useRouter();
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications();
  const [selected, setSelected] = useState<Notification | null>(null);

  const getIcon = (title: string) => {
    if (title.includes('Deposit')) return <ArrowDown className="text-green-500" size={24} />;
    if (title.includes('Withdrawal')) return <ArrowUp className="text-red-500" size={24} />;
    if (title.includes('Conversion')) return <RefreshCw className="text-blue-500" size={24} />;
    if (title.includes('Buy')) return <ArrowDown className="text-green-500" size={24} />;
    return <Bell className="text-[#F6A100]" size={24} />;
  };

  const handleNotificationClick = (notif: Notification) => {
    setSelected(notif);
    if (!notif.read) {
      markAsRead(notif.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1F1F1F]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F6A100]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1F1F1F] pb-24">
      {/* Header */}
      <div className="p-6 flex items-center gap-4 border-b border-gray-800">
        <button onClick={() => router.back()}>
          <ArrowLeft className="text-white" size={24} />
        </button>
        <h1 className="text-xl font-bold text-white">Notifications</h1>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="ml-auto text-xs bg-[#F6A100] text-[#1F1F1F] px-3 py-1 rounded-full font-medium hover:bg-opacity-90 transition-all"
          >
            Mark all as read ({unreadCount})
          </button>
        )}
      </div>

      {/* Unread Summary */}
      {unreadCount > 0 && (
        <div className="px-6 py-3">
          <p className="text-sm text-[#F6A100]">
            You have {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* List */}
      <div className="px-6 space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="text-gray-400 mx-auto mb-4" size={48} />
            <p className="text-white mb-2">No notifications</p>
            <p className="text-gray-400 text-sm">You're all caught up!</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-xl border cursor-pointer hover:opacity-80 transition-all ${
                notif.read ? 'bg-[#2C2C2C] border-gray-800' : 'bg-[#2C2C2C] border-[#F6A100]'
              }`}
              onClick={() => handleNotificationClick(notif)}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${notif.read ? 'bg-gray-700' : 'bg-[#F6A100] bg-opacity-20'}`}>
                  {getIcon(notif.title)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-medium">{notif.title}</p>
                      <p className="text-gray-400 text-sm mt-1 line-clamp-2">{notif.message}</p>
                    </div>
                    {!notif.read && <span className="w-2 h-2 bg-[#F6A100] rounded-full" />}
                  </div>
                  <p className="text-gray-500 text-xs mt-2">
                    {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#2C2C2C] rounded-2xl w-full max-w-lg border border-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-[#F6A100] bg-opacity-20">
                  {getIcon(selected.title)}
                </div>
                <h3 className="text-white font-semibold">Notification Details</h3>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <h4 className="text-white text-lg font-semibold mb-2">{selected.title}</h4>
              <p className="text-gray-300 mb-4 whitespace-pre-wrap">{selected.message}</p>
              <div className="bg-[#1F1F1F] rounded-xl p-4 mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Status</span>
                  <span className={selected.read ? 'text-gray-400' : 'text-[#F6A100]'}>
                    {selected.read ? 'Read' : 'Unread'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Received</span>
                  <span className="text-white">
                    {new Date(selected.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-full bg-[#F6A100] text-[#1F1F1F] py-3 rounded-xl font-medium hover:bg-opacity-90"
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