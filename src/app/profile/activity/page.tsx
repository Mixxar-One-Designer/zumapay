'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Smartphone, Globe, Monitor, Trash2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function LoginActivity() {
  const router = useRouter();
  const { loginActivity, addLoginActivity } = useApp();

  const getDeviceIcon = (device: string) => {
    if (device.includes('iPhone') || device.includes('Mobile')) {
      return <Smartphone size={18} className="text-green-500" />;
    }
    return <Monitor size={18} className="text-blue-500" />;
  };

  return (
    <div className="min-h-screen bg-[#1F1F1F] pb-24">
      <div className="p-6 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()}>
            <ArrowLeft className="text-white" size={24} />
          </button>
          <h1 className="text-xl font-bold">Login Activity</h1>
        </div>
        <button 
          onClick={() => {
            // Clear activity and add new current session
            localStorage.removeItem('loginActivity');
            window.location.reload();
          }}
          className="text-red-400 hover:text-red-300 transition-all"
          title="Clear history"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="p-6">
        {loginActivity.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="text-gray-400 mx-auto mb-4" size={48} />
            <p className="text-white mb-2">No login activity</p>
            <p className="text-gray-400 text-sm">Your sessions will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {loginActivity.map((activity) => (
              <div key={activity.id} className="bg-[#2C2C2C] rounded-xl p-4 border border-gray-800">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${
                    activity.current ? 'bg-green-500 bg-opacity-20' : 'bg-gray-700'
                  }`}>
                    {getDeviceIcon(activity.device)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white text-sm font-medium">{activity.device}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Globe size={12} className="text-gray-500" />
                          <span className="text-gray-400 text-xs">{activity.location}</span>
                        </div>
                        <p className="text-gray-500 text-xs mt-1">{activity.ip}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Clock size={12} className="text-gray-500" />
                          <span className="text-gray-400 text-xs">{activity.time}</span>
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
        )}
      </div>
    </div>
  );
}