'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell } from 'lucide-react';
import { useSettings } from '@/app/SettingsProvider';

export default function Notifications() {
  const router = useRouter();
  const { notifications, setNotifications } = useSettings();

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()}>
          <ArrowLeft style={{ color: 'var(--text-primary)' }} size={24} />
        </button>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Notifications</h1>
      </div>

      <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell size={18} style={{ color: 'var(--text-secondary)' }} />
            <span style={{ color: 'var(--text-primary)' }}>Push Notifications</span>
          </div>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`w-12 h-6 rounded-full transition-colors ${notifications ? 'bg-green-500' : 'bg-gray-600'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${notifications ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-card)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Status: <span style={{ color: notifications ? '#10B981' : '#EF4444' }}>{notifications ? 'ON' : 'OFF'}</span></p>
      </div>
    </div>
  );
}