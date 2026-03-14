'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Shield, 
  HelpCircle,
  LogOut,
  ChevronRight,
  CheckCircle,
  Bell,
  Moon,
  Globe,
  Wallet,
  Copy,
  Check,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/app/ThemeProvider';
import { useSettings } from '@/app/SettingsProvider';
import { useTranslation } from '@/hooks/useTranslation';

export default function Profile() {
  const router = useRouter();
  const { theme } = useTheme();
  const { language, notifications } = useSettings();
  const { t } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [balance, setBalance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/');
      return;
    }
    
    setUser(user);
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    setProfile(profile);
    
    const { data: balance } = await supabase
      .from('balances')
      .select('*')
      .eq('user_id', user.id)
      .single();
      
    setBalance(balance);
    setLoading(false);
  };

  const copyUserId = () => {
    navigator.clipboard.writeText(user?.id || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F6A100]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="p-6 flex items-center gap-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <button onClick={() => router.back()}>
          <ArrowLeft style={{ color: 'var(--text-primary)' }} size={24} />
        </button>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{t('profile')}</h1>
      </div>

      {/* Profile Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#F6A100] to-[#F6A100]/70 flex items-center justify-center text-white text-3xl font-bold border-2 border-[#F6A100]">
            {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{profile?.full_name || 'User'}</h2>
              <CheckCircle size={16} className="text-green-500" />
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="bg-green-500 bg-opacity-20 rounded-full px-2 py-0.5">
                <span className="text-green-500 text-xs">{t('verified')}</span>
              </div>
              <div className="rounded-full px-2 py-0.5" style={{ backgroundColor: 'var(--bg-card)' }}>
                <span style={{ color: 'var(--text-secondary)' }} className="text-xs">{t('memberSince')} {formatDate(user?.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <Wallet className="text-[#F6A100] mb-2" size={20} />
          <p className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>{balance?.usdt_balance || 0} USDT</p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Wallet {t('balance')}</p>
        </div>
        <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <TrendingUp className="text-[#F6A100] mb-2" size={20} />
          <p className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>₦{((balance?.usdt_balance || 0) * 1600).toLocaleString()}</p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Naira {t('balance')}</p>
        </div>
      </div>

      {/* User ID Card */}
      <div className="px-6 mb-6">
        <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>User ID</span>
            <button onClick={copyUserId} className="text-[#F6A100] text-xs flex items-center gap-1">
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? t('copied') : t('copy')}
            </button>
          </div>
          <p className="text-xs font-mono break-all" style={{ color: 'var(--text-primary)' }}>{user?.id}</p>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="px-6 space-y-6">
        {/* Account Section */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Account</h3>
          <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            {/* Personal Information */}
            <button 
              onClick={() => router.push('/profile/personal')}
              className="w-full flex items-center justify-between p-4 border-b hover:opacity-80 transition-all"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-3">
                <User size={18} style={{ color: 'var(--text-secondary)' }} />
                <span style={{ color: 'var(--text-primary)' }}>{t('personalInfo')}</span>
              </div>
              <ChevronRight size={16} style={{ color: 'var(--text-secondary)' }} />
            </button>
            
            {/* Email */}
            <div className="w-full flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3">
                <Mail size={18} style={{ color: 'var(--text-secondary)' }} />
                <span style={{ color: 'var(--text-primary)' }}>{t('emailAddress')}</span>
              </div>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{user?.email}</span>
            </div>
            
            {/* Phone Number */}
            <button 
              onClick={() => router.push('/profile/phone')}
              className="w-full flex items-center justify-between p-4 hover:opacity-80 transition-all"
            >
              <div className="flex items-center gap-3">
                <Phone size={18} style={{ color: 'var(--text-secondary)' }} />
                <span style={{ color: 'var(--text-primary)' }}>{t('phoneNumber')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {user?.user_metadata?.phone || t('notAdded')}
                </span>
                <ChevronRight size={16} style={{ color: 'var(--text-secondary)' }} />
              </div>
            </button>
          </div>
        </div>

        {/* Security Section */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Security</h3>
          <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            {/* Change Password */}
            <button 
              onClick={() => router.push('/profile/password')}
              className="w-full flex items-center justify-between p-4 border-b hover:opacity-80 transition-all"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-3">
                <Lock size={18} style={{ color: 'var(--text-secondary)' }} />
                <span style={{ color: 'var(--text-primary)' }}>{t('changePassword')}</span>
              </div>
              <ChevronRight size={16} style={{ color: 'var(--text-secondary)' }} />
            </button>
            
            {/* Two-Factor Authentication */}
            <button 
              onClick={() => router.push('/profile/two-factor')}
              className="w-full flex items-center justify-between p-4 border-b hover:opacity-80 transition-all"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-3">
                <Shield size={18} style={{ color: 'var(--text-secondary)' }} />
                <span style={{ color: 'var(--text-primary)' }}>{t('twoFactorAuth')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Off</span>
                <ChevronRight size={16} style={{ color: 'var(--text-secondary)' }} />
              </div>
            </button>
            
            {/* Login Activity */}
            <button 
              onClick={() => router.push('/profile/activity')}
              className="w-full flex items-center justify-between p-4 hover:opacity-80 transition-all"
            >
              <div className="flex items-center gap-3">
                <Calendar size={18} style={{ color: 'var(--text-secondary)' }} />
                <span style={{ color: 'var(--text-primary)' }}>{t('loginActivity')}</span>
              </div>
              <ChevronRight size={16} style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>
        </div>

        {/* Preferences Section */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Preferences</h3>
          <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            {/* Notifications */}
            <button 
              onClick={() => router.push('/profile/notifications')}
              className="w-full flex items-center justify-between p-4 border-b hover:opacity-80 transition-all"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-3">
                <Bell size={18} style={{ color: 'var(--text-secondary)' }} />
                <span style={{ color: 'var(--text-primary)' }}>{t('notifications')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: notifications ? '#10B981' : 'var(--text-secondary)' }}>
                  {notifications ? t('on') : t('off')}
                </span>
                <ChevronRight size={16} style={{ color: 'var(--text-secondary)' }} />
              </div>
            </button>
            
            {/* Dark Mode */}
            <button 
              onClick={() => router.push('/profile/darkmode')}
              className="w-full flex items-center justify-between p-4 border-b hover:opacity-80 transition-all"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-3">
                <Moon size={18} style={{ color: 'var(--text-secondary)' }} />
                <span style={{ color: 'var(--text-primary)' }}>{t('darkMode')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{theme === 'dark' ? t('on') : t('off')}</span>
                <ChevronRight size={16} style={{ color: 'var(--text-secondary)' }} />
              </div>
            </button>
            
            {/* Language */}
            <button 
              onClick={() => router.push('/profile/language')}
              className="w-full flex items-center justify-between p-4 hover:opacity-80 transition-all"
            >
              <div className="flex items-center gap-3">
                <Globe size={18} style={{ color: 'var(--text-secondary)' }} />
                <span style={{ color: 'var(--text-primary)' }}>{t('language')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{language}</span>
                <ChevronRight size={16} style={{ color: 'var(--text-secondary)' }} />
              </div>
            </button>
          </div>
        </div>

        {/* Support Section */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Support</h3>
          <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            {/* Help Center */}
            <button 
              onClick={() => router.push('/support')}
              className="w-full flex items-center justify-between p-4 border-b hover:opacity-80 transition-all"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-3">
                <HelpCircle size={18} style={{ color: 'var(--text-secondary)' }} />
                <span style={{ color: 'var(--text-primary)' }}>{t('helpCenter')}</span>
              </div>
              <ChevronRight size={16} style={{ color: 'var(--text-secondary)' }} />
            </button>
            
            {/* Contact Support */}
            <button 
              onClick={() => router.push('/support')}
              className="w-full flex items-center justify-between p-4 hover:opacity-80 transition-all"
            >
              <div className="flex items-center gap-3">
                <Mail size={18} style={{ color: 'var(--text-secondary)' }} />
                <span style={{ color: 'var(--text-primary)' }}>{t('contactSupport')}</span>
              </div>
              <ChevronRight size={16} style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          style={{
            width: '100%',
            backgroundColor: '#ef4444',
            color: 'white',
            padding: '16px',
            borderRadius: '12px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '24px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
        >
          <LogOut size={18} />
          {t('logout')}
        </button>

        <p className="text-center text-xs py-4" style={{ color: 'var(--text-secondary)' }}>
          {t('version')} 1.0.0
        </p>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
          <div className="rounded-2xl p-6 w-full max-w-sm border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <h3 className="text-xl font-bold text-center mb-2" style={{ color: 'var(--text-primary)' }}>{t('logout')}</h3>
            <p className="text-center mb-6" style={{ color: 'var(--text-secondary)' }}>
              Are you sure you want to log out?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 rounded-xl border font-semibold hover:opacity-80 transition-all"
                style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-all"
              >
                {t('confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}