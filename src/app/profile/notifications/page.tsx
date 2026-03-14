'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell, Mail, Smartphone, AlertCircle } from 'lucide-react';

export default function Notifications() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false,
    withdrawals: true,
    deposits: true
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="min-h-screen bg-[#1F1F1F] pb-24">
      <div className="p-6 flex items-center gap-4 border-b border-gray-800">
        <button onClick={() => router.back()}>
          <ArrowLeft className="text-white" size={24} />
        </button>
        <h1 className="text-xl font-bold flex-1">Notifications</h1>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-[#2C2C2C] rounded-xl p-5 border border-gray-800">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Bell size={18} className="text-[#F6A100]" />
            Push Notifications
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Withdrawal Alerts</span>
              <button
                onClick={() => toggle('withdrawals')}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.withdrawals ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.withdrawals ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Deposit Alerts</span>
              <button
                onClick={() => toggle('deposits')}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.deposits ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.deposits ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#2C2C2C] rounded-xl p-5 border border-gray-800">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Mail size={18} className="text-[#F6A100]" />
            Email Notifications
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Email Alerts</span>
              <button
                onClick={() => toggle('email')}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.email ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.email ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#2C2C2C] rounded-xl p-5 border border-gray-800">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Smartphone size={18} className="text-[#F6A100]" />
            SMS Notifications
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">SMS Alerts</span>
              <button
                onClick={() => toggle('sms')}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.sms ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.sms ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}