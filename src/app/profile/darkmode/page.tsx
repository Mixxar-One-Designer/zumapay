'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Moon, Sun, Check } from 'lucide-react';
import { useTheme } from '@/app/ThemeProvider';

export default function DarkMode() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="p-6 flex items-center gap-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <button onClick={() => router.back()}>
          <ArrowLeft style={{ color: 'var(--foreground)' }} size={24} />
        </button>
        <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Appearance</h1>
      </div>

      <div className="p-6">
        <div className="rounded-xl border overflow-hidden" style={{ 
          backgroundColor: 'var(--card-bg)', 
          borderColor: 'var(--border-color)',
        }}>
          <button
            onClick={() => setTheme('light')}
            className="w-full flex items-center justify-between p-4 border-b hover:opacity-80 transition-all"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <div className="flex items-center gap-3">
              <Sun size={18} style={{ color: theme === 'light' ? '#F6A100' : 'var(--text-secondary)' }} />
              <span style={{ color: 'var(--foreground)' }}>Light Mode</span>
            </div>
            {theme === 'light' && <Check size={16} className="text-green-500" />}
          </button>

          <button
            onClick={() => setTheme('dark')}
            className="w-full flex items-center justify-between p-4 hover:opacity-80 transition-all"
          >
            <div className="flex items-center gap-3">
              <Moon size={18} style={{ color: theme === 'dark' ? '#F6A100' : 'var(--text-secondary)' }} />
              <span style={{ color: 'var(--foreground)' }}>Dark Mode</span>
            </div>
            {theme === 'dark' && <Check size={16} className="text-green-500" />}
          </button>
        </div>
      </div>
    </div>
  );
}