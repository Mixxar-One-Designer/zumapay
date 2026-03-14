'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Moon, Sun, Monitor } from 'lucide-react';

export default function DarkMode() {
  const router = useRouter();
  const [theme, setTheme] = useState('dark');

  return (
    <div className="min-h-screen bg-[#1F1F1F] pb-24">
      <div className="p-6 flex items-center gap-4 border-b border-gray-800">
        <button onClick={() => router.back()}>
          <ArrowLeft className="text-white" size={24} />
        </button>
        <h1 className="text-xl font-bold flex-1">Appearance</h1>
      </div>

      <div className="p-6">
        <div className="bg-[#2C2C2C] rounded-xl border border-gray-800 overflow-hidden">
          <button
            onClick={() => setTheme('light')}
            className="w-full flex items-center justify-between p-4 border-b border-gray-800 hover:bg-[#3C3C3C] transition-all"
          >
            <div className="flex items-center gap-3">
              <Sun size={18} className="text-gray-400" />
              <span className="text-white text-sm">Light Mode</span>
            </div>
            {theme === 'light' && (
              <div className="w-2 h-2 bg-[#F6A100] rounded-full"></div>
            )}
          </button>

          <button
            onClick={() => setTheme('dark')}
            className="w-full flex items-center justify-between p-4 border-b border-gray-800 hover:bg-[#3C3C3C] transition-all"
          >
            <div className="flex items-center gap-3">
              <Moon size={18} className="text-gray-400" />
              <span className="text-white text-sm">Dark Mode</span>
            </div>
            {theme === 'dark' && (
              <div className="w-2 h-2 bg-[#F6A100] rounded-full"></div>
            )}
          </button>

          <button
            onClick={() => setTheme('system')}
            className="w-full flex items-center justify-between p-4 hover:bg-[#3C3C3C] transition-all"
          >
            <div className="flex items-center gap-3">
              <Monitor size={18} className="text-gray-400" />
              <span className="text-white text-sm">System Default</span>
            </div>
            {theme === 'system' && (
              <div className="w-2 h-2 bg-[#F6A100] rounded-full"></div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}