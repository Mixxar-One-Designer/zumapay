'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Globe, Check } from 'lucide-react';
import { useSettings } from '@/app/SettingsProvider';

export default function Language() {
  const router = useRouter();
  const { language, setLanguage } = useSettings();

  const languages = ['English', 'French', 'Spanish', 'Arabic', 'Portuguese', 'Yoruba', 'Hausa', 'Igbo'];

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()}>
          <ArrowLeft style={{ color: 'var(--text-primary)' }} size={24} />
        </button>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Language</h1>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className="w-full flex items-center justify-between p-4 border-b last:border-0 hover:opacity-80 transition-all"
            style={{ borderColor: 'var(--border)' }}
          >
            <div className="flex items-center gap-3">
              <Globe size={18} style={{ color: language === lang ? '#F6A100' : 'var(--text-secondary)' }} />
              <span style={{ color: 'var(--text-primary)' }}>{lang}</span>
            </div>
            {language === lang && <Check size={16} className="text-green-500" />}
          </button>
        ))}
      </div>

      <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-card)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Current language: <span style={{ color: '#F6A100' }}>{language}</span></p>
      </div>
    </div>
  );
}