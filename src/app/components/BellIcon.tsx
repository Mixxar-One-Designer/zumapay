'use client';

import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';

export default function BellIcon() {
  const router = useRouter();
  const { unreadCount } = useNotifications();

  const displayCount = unreadCount > 9 ? '9+' : unreadCount;

  return (
    <button
      onClick={() => router.push('/notifications')}
      className="relative p-1 rounded-full hover:bg-gray-800 transition-colors"
      aria-label="Notifications"
    >
      <Bell size={20} className="text-gray-400" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[1.25rem] h-5 flex items-center justify-center px-1">
          {displayCount}
        </span>
      )}
    </button>
  );
}