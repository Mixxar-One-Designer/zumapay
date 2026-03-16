'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface BellIconProps {
  userId: string;
}

export default function BellIcon({ userId }: BellIconProps) {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);

      setUnreadCount(count || 0);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    
    // Check every 2 seconds - GUARANTEED to update
    const interval = setInterval(fetchUnreadCount, 2000);

    return () => clearInterval(interval);
  }, [userId]);

  const handleClick = () => {
    router.push('/notifications');
  };

  return (
    <button
      onClick={handleClick}
      className="relative p-1 rounded-full hover:bg-gray-800 transition-colors"
    >
      <Bell size={20} className="text-gray-400" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}