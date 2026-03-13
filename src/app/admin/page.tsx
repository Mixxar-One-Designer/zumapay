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
  Award,
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

export default function Profile() {
  const router = useRouter();
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
    
    // Get profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    setProfile(profile);
    
    // Get balance
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
      <div className="min-h-screen bg-[#1F1F1F] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F6A100]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1F1F1F] pb-20">
      {/* Header */}
      <div className="p-6 flex items-center gap-4 border-b border-gray-800">
        <button onClick={() => router.back()}>
          <ArrowLeft className="text-white" size={24} />
        </button>
        <h1 className="text-xl font-bold flex-1">Profile</h1>
      </div>

      {/* Profile Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-4">
          {/* Avatar with initials */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#F6A100] to-[#F6A100]/70 flex items-center justify-center text-white text-3xl font-bold border-2 border-[#F6A100]">
            {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-white">{profile?.full_name || 'User'}</h2>
              <CheckCircle size={16} className="text-green-500" />
            </div>
            <p className="text-gray-400 text-sm">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="bg-green-500 bg-opacity-20 rounded-full px-2 py-0.5">
                <span className="text-green-500 text-xs">Verified</span>
              </div>
              <div className="bg-[#2C2C2C] rounded-full px-2 py-0.5">
                <span className="text-gray-400 text-xs">Member since {formatDate(user?.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-6 grid grid-cols-2 gap-3">
        <div className="bg-[#2C2C2C] rounded-xl p-4 border border-gray-800">
          <Wallet className="text-[#F6A100] mb-2" size={20} />
          <p className="text-white font-bold text-xl">{balance?.usdt_balance || 0} USDT</p>
          <p className="text-gray-400 text-xs">Wallet Balance</p>
        </div>
        <div className="bg-[#2C2C2C] rounded-xl p-4 border border-gray-800">
          <TrendingUp className="text-[#F6A100] mb-2" size={20} />
          <p className="text-white font-bold text-xl">₦{((balance?.usdt_balance || 0) * 1600).toLocaleString()}</p>
          <p className="text-gray-400 text-xs">Naira Value</p>
        </div>
      </div>

      {/* User ID Card */}
      <div className="px-6 mb-6">
        <div className="bg-[#2C2C2C] rounded-xl p-4 border border-gray-800">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400 text-sm">User ID</span>
            <button onClick={copyUserId} className="text-[#F6A100] text-xs flex items-center gap-1">
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="text-white text-xs font-mono break-all">{user?.id}</p>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="px-6 space-y-6">
        {/* Account Section */}
        <div>
          <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Account</h3>
          <div className="bg-[#2C2C2C] rounded-xl border border-gray-800 overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 border-b border-gray-800 hover:bg-[#3C3C3C] transition-all">
              <div className="flex items-center gap-3">
                <User size={18} className="text-gray-400" />
                <span className="text-white text-sm">Personal Information</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
            
            <button className="w-full flex items-center justify-between p-4 border-b border-gray-800 hover:bg-[#3C3C3C] transition-all">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-gray-400" />
                <span className="text-white text-sm">Email Address</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs">{user?.email}</span>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </button>
            
            <button className="w-full flex items-center justify-between p-4 hover:bg-[#3C3C3C] transition-all">
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-gray-400" />
                <span className="text-white text-sm">Phone Number</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs">Not added</span>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </button>
          </div>
        </div>

        {/* Security Section */}
        <div>
          <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Security</h3>
          <div className="bg-[#2C2C2C] rounded-xl border border-gray-800 overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 border-b border-gray-800 hover:bg-[#3C3C3C] transition-all">
              <div className="flex items-center gap-3">
                <Lock size={18} className="text-gray-400" />
                <span className="text-white text-sm">Change Password</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
            
            <button className="w-full flex items-center justify-between p-4 border-b border-gray-800 hover:bg-[#3C3C3C] transition-all">
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-gray-400" />
                <span className="text-white text-sm">Two-Factor Authentication</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 text-xs">Off</span>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </button>
            
            <button className="w-full flex items-center justify-between p-4 hover:bg-[#3C3C3C] transition-all">
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-gray-400" />
                <span className="text-white text-sm">Login Activity</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Preferences Section */}
        <div>
          <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Preferences</h3>
          <div className="bg-[#2C2C2C] rounded-xl border border-gray-800 overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 border-b border-gray-800 hover:bg-[#3C3C3C] transition-all">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-gray-400" />
                <span className="text-white text-sm">Notifications</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500 text-xs">On</span>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </button>
            
            <button className="w-full flex items-center justify-between p-4 border-b border-gray-800 hover:bg-[#3C3C3C] transition-all">
              <div className="flex items-center gap-3">
                <Moon size={18} className="text-gray-400" />
                <span className="text-white text-sm">Dark Mode</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500 text-xs">On</span>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </button>
            
            <button className="w-full flex items-center justify-between p-4 hover:bg-[#3C3C3C] transition-all">
              <div className="flex items-center gap-3">
                <Globe size={18} className="text-gray-400" />
                <span className="text-white text-sm">Language</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs">English</span>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </button>
          </div>
        </div>

        {/* Support Section */}
        <div>
          <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Support</h3>
          <div className="bg-[#2C2C2C] rounded-xl border border-gray-800 overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 border-b border-gray-800 hover:bg-[#3C3C3C] transition-all">
              <div className="flex items-center gap-3">
                <HelpCircle size={18} className="text-gray-400" />
                <span className="text-white text-sm">Help Center</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
            
            <button className="w-full flex items-center justify-between p-4 hover:bg-[#3C3C3C] transition-all">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-gray-400" />
                <span className="text-white text-sm">Contact Support</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full bg-red-500 bg-opacity-10 border border-red-500 rounded-xl p-4 flex items-center justify-center gap-2 text-red-500 font-semibold hover:bg-opacity-20 transition-all mt-6"
        >
          <LogOut size={18} />
          Log Out
        </button>

        <p className="text-center text-gray-500 text-xs py-4">
          Version 1.0.0
        </p>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
          <div className="bg-[#2C2C2C] rounded-2xl p-6 w-full max-w-sm border border-gray-800">
            <h3 className="text-xl font-bold text-center text-white mb-2">Log Out</h3>
            <p className="text-gray-400 text-center mb-6">
              Are you sure you want to log out?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 rounded-xl border border-gray-600 text-white font-semibold hover:bg-gray-800 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-all"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}