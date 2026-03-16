'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Home, History, HelpCircle, User } from 'lucide-react';

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  // Don't show bottom nav on login page
  if (pathname === '/') return null;

  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: History, label: 'History', path: '/history' },
    { icon: HelpCircle, label: 'Help', path: '/support' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#2C2C2C] border-t border-gray-800 p-2 pb-6 z-50">
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
              {isActive && (
                <div className="w-1 h-1 bg-[#F6A100] rounded-full mt-1"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}