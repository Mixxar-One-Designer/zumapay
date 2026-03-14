'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Smartphone, Globe, Monitor } from 'lucide-react';

export default function LoginActivity() {
  const router = useRouter();

  const activities = [
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
    },
    {
      id: 3,
      device: 'Firefox on MacOS',
      location: 'Abuja, Nigeria',
      ip: '192.168.1.102',
      time: '1 week ago',
      current: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#1F1F1F] pb-24">
      <div className="p-6 flex items-center gap-4 border-b border-gray-800">
        <button onClick={() => router.back()}>
          <ArrowLeft className="text-white" size={24} />
        </button>
        <h1 className="text-xl font-bold flex-1">Login Activity</h1>
      </div>

      <div className="p-6 space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="bg-[#2C2C2C] rounded-xl p-4 border border-gray-800">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full ${
                activity.current ? 'bg-green-500 bg-opacity-20' : 'bg-gray-700'
              }`}>
                {activity.device.includes('iPhone') || activity.device.includes('Mobile') ? (
                  <Smartphone size={18} className={activity.current ? 'text-green-500' : 'text-gray-400'} />
                ) : (
                  <Monitor size={18} className={activity.current ? 'text-green-500' : 'text-gray-400'} />
                )}
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
                      <span className="text-green-500 text-xs mt-1 block">Current session</span>
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