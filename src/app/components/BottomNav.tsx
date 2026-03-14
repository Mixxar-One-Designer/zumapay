'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Home, History, HelpCircle, User } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();

  if (pathname === '/') return null;

  const navItems = [
    { icon: Home, label: t('home'), path: '/dashboard' },
    { icon: History, label: t('history'), path: '/history' },
    { icon: HelpCircle, label: t('support'), path: '/support' },
    { icon: User, label: t('profile'), path: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 p-2 pb-6 z-50" style={{ backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center p-2 rounded-xl transition-all ${
                isActive ? 'text-[#F6A100]' : 'text-gray-400 hover:text-[#F6A100]'
              }`}
            >
              <IconComponent size={22} />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}