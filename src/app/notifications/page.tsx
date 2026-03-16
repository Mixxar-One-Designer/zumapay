'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell, ArrowUp, ArrowDown, RefreshCw, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Notification {
  id: number;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadNotifications();
  }, [refreshKey]);

  const loadNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/');
        return;
      }

      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      setNotifications(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);
      
      // Refresh the list
      setRefreshKey(prev => prev + 1);
      
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);
      
      // Refresh the list
      setRefreshKey(prev => prev + 1);
      
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const getIcon = (title: string) => {
    if (title.includes('Deposit')) return <ArrowDown className="text-green-500" size={24} />;
    if (title.includes('Withdrawal')) return <ArrowUp className="text-red-500" size={24} />;
    if (title.includes('Conversion')) return <RefreshCw className="text-blue-500" size={24} />;
    return <Bell className="text-[#F6A100]" size={24} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F6A100]"></div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

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
            className="ml-auto text-xs bg-[#F6A100] text-black px-3 py-1 rounded-full"
          >
            Mark all as read ({unreadCount})
          </button>
        )}
      </div>

      {/* List */}
      <div className="p-6 space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="text-gray-400 mx-auto mb-4" size={48} />
            <p className="text-white mb-2">No notifications</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`p-4 rounded-xl border cursor-pointer ${
                notif.read ? 'bg-[#2C2C2C] border-gray-800' : 'bg-[#2C2C2C] border-[#F6A100]'
              }`}
              onClick={() => handleNotificationClick(notif)}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-gray-700">
                  {getIcon(notif.title)}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{notif.title}</p>
                  <p className="text-gray-400 text-sm mt-1">{notif.message}</p>
                  <p className="text-gray-500 text-xs mt-2">
                    {new Date(notif.created_at).toLocaleString()}
                  </p>
                </div>
                {!notif.read && (
                  <span className="w-2 h-2 bg-[#F6A100] rounded-full"></span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#2C2C2C] rounded-2xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-bold">Notification</h3>
              <button onClick={() => setSelectedNotification(null)} className="text-gray-400">
                <X size={20} />
              </button>
            </div>
            <h4 className="text-white text-lg font-semibold mb-2">{selectedNotification.title}</h4>
            <p className="text-gray-300 mb-4">{selectedNotification.message}</p>
            <p className="text-gray-400 text-sm mb-4">
              {new Date(selectedNotification.created_at).toLocaleString()}
            </p>
            <button
              onClick={() => setSelectedNotification(null)}
              className="w-full bg-[#F6A100] text-black py-3 rounded-xl font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}