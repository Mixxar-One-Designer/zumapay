'use client';

import { useRouter } from 'next/navigation';
import { useTheme } from '@/app/ThemeProvider';
import { Moon, Sun } from 'lucide-react';

export default function TestPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Theme Test Page</h1>
      
      <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-card)' }}>
        <p>Current theme: {theme}</p>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTheme('light')}
          className="px-4 py-2 rounded-lg flex items-center gap-2"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <Sun size={16} /> Light Mode
        </button>
        <button
          onClick={() => setTheme('dark')}
          className="px-4 py-2 rounded-lg flex items-center gap-2"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <Moon size={16} /> Dark Mode
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-card)' }}>
          Card 1
        </div>
        <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-card)' }}>
          Card 2
        </div>
      </div>

      <button
        onClick={() => router.push('/dashboard')}
        className="mt-4 px-4 py-2 rounded-lg w-full"
        style={{ backgroundColor: 'var(--bg-card)' }}
      >
        Go to Dashboard
      </button>
    </div>
  );
}