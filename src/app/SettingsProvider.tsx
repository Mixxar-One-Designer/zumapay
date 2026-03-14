'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface SettingsContextType {
  language: string;
  setLanguage: (lang: string) => void;
  notifications: boolean;
  setNotifications: (enabled: boolean) => void;
  twoFactorEnabled: boolean;
  setTwoFactorEnabled: (enabled: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('English');
  const [notifications, setNotifications] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    const savedNotif = localStorage.getItem('notifications');
    const saved2FA = localStorage.getItem('twoFactorEnabled');
    
    if (savedLang) setLanguage(savedLang);
    if (savedNotif) setNotifications(savedNotif === 'true');
    if (saved2FA) setTwoFactorEnabled(saved2FA === 'true');
  }, []);

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const handleSetNotifications = (enabled: boolean) => {
    setNotifications(enabled);
    localStorage.setItem('notifications', String(enabled));
  };

  const handleSetTwoFactorEnabled = (enabled: boolean) => {
    setTwoFactorEnabled(enabled);
    localStorage.setItem('twoFactorEnabled', String(enabled));
  };

  return (
    <SettingsContext.Provider value={{ 
      language, 
      setLanguage: handleSetLanguage,
      notifications, 
      setNotifications: handleSetNotifications,
      twoFactorEnabled,
      setTwoFactorEnabled: handleSetTwoFactorEnabled
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}