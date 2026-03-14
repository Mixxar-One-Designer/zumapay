'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Globe, Check } from 'lucide-react';

export default function Language() {
  const router = useRouter();
  const [selected, setSelected] = useState('English');

  const languages = [
    'English',
    'French',
    'Spanish',
    'Arabic',
    'Portuguese',
    'Yoruba',
    'Hausa',
    'Igbo'
  ];

  return (
    <div className="min-h-screen bg-[#1F1F1F] pb-24">
      <div className="p-6 flex items-center gap-4 border-b border-gray-800">
        <button onClick={() => router.back()}>
          <ArrowLeft className="text-white" size={24} />
        </button>
        <h1 className="text-xl font-bold flex-1">Language</h1>
      </div>

      <div className="p-6">
        <div className="bg-[#2C2C2C] rounded-xl border border-gray-800 overflow-hidden">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setSelected(lang)}
              className="w-full flex items-center justify-between p-4 border-b border-gray-800 last:border-0 hover:bg-[#3C3C3C] transition-all"
            >
              <div className="flex items-center gap-3">
                <Globe size={18} className="text-gray-400" />
                <span className="text-white text-sm">{lang}</span>
              </div>
              {selected === lang && (
                <Check size={16} className="text-green-500" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}