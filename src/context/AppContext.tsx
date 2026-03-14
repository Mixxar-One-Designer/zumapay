'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeType = 'light' | 'dark' | 'system';
type LanguageType = 'English' | 'French' | 'Spanish' | 'Arabic' | 'Portuguese' | 'Yoruba' | 'Hausa' | 'Igbo';

interface AppContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    withdrawals: boolean;
    deposits: boolean;
  };
  updateNotifications: (key: string, value: boolean) => void;
  twoFactorEnabled: boolean;
  setTwoFactorEnabled: (enabled: boolean) => void;
  loginActivity: any[];
  addLoginActivity: (activity: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Load from localStorage with defaults
  const [theme, setTheme] = useState<ThemeType>('dark');
  const [language, setLanguage] = useState<LanguageType>('English');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    withdrawals: true,
    deposits: true
  });
  const [loginActivity, setLoginActivity] = useState<any[]>([]);

  // Load saved preferences on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeType;
    const savedLanguage = localStorage.getItem('language') as LanguageType;
    const saved2FA = localStorage.getItem('twoFactorEnabled');
    const savedNotifications = localStorage.getItem('notifications');
    const savedActivity = localStorage.getItem('loginActivity');

    if (savedTheme) setTheme(savedTheme);
    if (savedLanguage) setLanguage(savedLanguage);
    if (saved2FA) setTwoFactorEnabled(saved2FA === 'true');
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
    if (savedActivity) setLoginActivity(JSON.parse(savedActivity));
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('twoFactorEnabled', String(twoFactorEnabled));
  }, [twoFactorEnabled]);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('loginActivity', JSON.stringify(loginActivity));
  }, [loginActivity]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.style.backgroundColor = '#FFFFFF';
      root.style.color = '#000000';
    } else if (theme === 'dark') {
      root.classList.add('dark');
      root.style.backgroundColor = '#1F1F1F';
      root.style.color = '#FFFFFF';
    } else {
      // system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemPrefersDark) {
        root.classList.add('dark');
        root.style.backgroundColor = '#1F1F1F';
        root.style.color = '#FFFFFF';
      } else {
        root.classList.remove('dark');
        root.style.backgroundColor = '#FFFFFF';
        root.style.color = '#000000';
      }
    }
  }, [theme]);

  const updateNotifications = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const addLoginActivity = (activity: any) => {
    setLoginActivity(prev => [activity, ...prev].slice(0, 10)); // Keep last 10
  };

  // Add current session on mount
  useEffect(() => {
    const newActivity = {
      id: Date.now(),
      device: navigator.userAgent.includes('iPhone') ? 'Safari on iPhone' : 'Chrome on Windows',
      location: 'Lagos, Nigeria',
      ip: '192.168.1.' + Math.floor(Math.random() * 255),
      time: 'Just now',
      current: true
    };
    addLoginActivity(newActivity);
  }, []);

  return (
    <AppContext.Provider value={{
      theme,
      setTheme,
      language,
      setLanguage,
      notifications,
      updateNotifications,
      twoFactorEnabled,
      setTwoFactorEnabled,
      loginActivity,
      addLoginActivity
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}