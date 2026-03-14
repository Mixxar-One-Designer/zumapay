'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Smartphone, Globe, Monitor, Trash2 } from 'lucide-react';
import { useTheme } from '@/app/ThemeProvider';
import { useSettings } from '@/app/SettingsProvider';
import { useTranslation } from '@/hooks/useTranslation';

export default function LoginActivity() {
  const router = useRouter();
  const { theme } = useTheme();
  const { language } = useSettings();
  const { t } = useTranslation();

  const [activities] = useState([
    {
      id: 1,
      device: 'Chrome on Windows',
      location: 'Lagos, Nigeria',
      ip: '192.168.1.100',
      time: '2 hours ago',
      current: true
    },
    {
      id: 2,
      device: 'Safari on iPhone',
      location: 'Lagos, Nigeria',
      ip: '192.168.1.101',
      time: '3 days ago',
      current: false
    }
  ]);

  const getDeviceIcon = (device: string) => {
    if (device.includes('iPhone') || device.includes('Mobile')) {
      return <Smartphone size={18} className="text-green-500" />;
    }
    return <Monitor size={18} className="text-blue-500" />;
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()}>
            <ArrowLeft style={{ color: 'var(--text-primary)' }} size={24} />
          </button>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{t('loginActivity')}</h1>
        </div>
        <button 
          onClick={() => {
            localStorage.removeItem('loginActivity');
            window.location.reload();
          }}
          className="text-red-400 hover:text-red-300 transition-all"
          title="Clear history"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full ${
                activity.current ? 'bg-green-500 bg-opacity-20' : 'bg-gray-700'
              }`}>
                {getDeviceIcon(activity.device)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{activity.device}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Globe size={12} style={{ color: 'var(--text-secondary)' }} />
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{activity.location}</span>
                    </div>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{activity.ip}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Clock size={12} style={{ color: 'var(--text-secondary)' }} />
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{activity.time}</span>
                    </div>
                    {activity.current && (
                      <span className="text-green-500 text-xs mt-1 block font-medium">
                        Current session
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}