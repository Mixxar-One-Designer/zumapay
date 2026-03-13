'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell } from 'lucide-react';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showNotification?: boolean;
  rightAction?: React.ReactNode;
}

export default function Header({ 
  title, 
  showBack = true, 
  showNotification = false,
  rightAction 
}: HeaderProps) {
  const router = useRouter();

  return (
    <div className="p-6 flex items-center gap-4 border-b border-gray-800">
      {showBack && (
        <button onClick={() => router.back()}>
          <ArrowLeft className="text-white" size={24} />
        </button>
      )}
      <h1 className="text-xl font-bold flex-1">{title}</h1>
      {showNotification && <Bell className="text-gray-400" size={20} />}
      {rightAction}
    </div>
  );
}