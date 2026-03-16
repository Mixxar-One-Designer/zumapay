'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
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
    setLoading(false);
  };

  const markAsRead = async (id: number) => {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);
    
    loadNotifications();
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
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Notifications</h1>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell style={{ color: 'var(--text-secondary)' }} className="mx-auto mb-4" size={48} />
          <p style={{ color: 'var(--text-primary)' }} className="mb-2">No notifications</p>
          <p style={{ color: 'var(--text-secondary)' }} className="text-sm">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div 
              key={notif.id} 
              className="p-4 rounded-xl border cursor-pointer hover:opacity-80 transition-all"
              style={{ 
                backgroundColor: notif.read ? 'var(--bg-card)' : 'rgba(246, 161, 0, 0.1)',
                borderColor: notif.read ? 'var(--border)' : '#F6A100'
              }}
              onClick={() => !notif.read && markAsRead(notif.id)}
            >
              <div className="flex items-start gap-3">
                {notif.read ? (
                  <Clock size={18} style={{ color: 'var(--text-secondary)' }} className="mt-1" />
                ) : (
                  <CheckCircle size={18} className="text-[#F6A100] mt-1" />
                )}
                <div className="flex-1">
                  <p style={{ color: 'var(--text-primary)' }} className="font-medium">{notif.title}</p>
                  <p style={{ color: 'var(--text-secondary)' }} className="text-sm">{notif.message}</p>
                  <p style={{ color: 'var(--text-secondary)' }} className="text-xs mt-2">
                    {new Date(notif.created_at).toLocaleString()}
                  </p>
                </div>
                {!notif.read && (
                  <span className="w-2 h-2 bg-[#F6A100] rounded-full"></span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}