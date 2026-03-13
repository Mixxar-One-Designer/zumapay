'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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
  Check
} from 'lucide-react';

export default function Profile() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const user = {
    name: 'Ibraheem Zuma',
    email: 'i*******m@example.com',
    phone: '+234 *** *** 7890',
    kycStatus: 'verified',
    memberSince: 'March 2026',
    referralCode: 'ZUMA2026',
    stats: {
      totalTransactions: 47,
      totalVolume: '12,500 USDT',
      savings: '2,500 USDT'
    }
  };

  const menuSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Personal Information', value: 'View', route: '#' },
        { icon: Shield, label: 'KYC Verification', value: 'Verified', badge: true, route: '#' },
        { icon: Lock, label: 'Change Password', value: '', route: '#' },
        { icon: Shield, label: 'Two-Factor Authentication', value: 'Off', route: '#' },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: Bell, label: 'Notifications', value: 'On', route: '#' },
        { icon: Moon, label: 'Dark Mode', value: 'On', route: '#' },
        { icon: Globe, label: 'Language', value: 'English', route: '#' },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', value: '', route: '#' },
        { icon: HelpCircle, label: 'FAQ', value: '', route: '#' },
        { icon: Mail, label: 'Contact Support', value: '', route: '#' },
      ]
    }
  ];

  const copyReferral = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#1F1F1F] pb-20">
      {/* Header */}
      <div className="p-6 flex items-center gap-4 border-b border-gray-800">
        <button onClick={() => router.back()}>
          <ArrowLeft className="text-white" size={24} />
        </button>
        <h1 className="text-xl font-bold flex-1">Profile & Settings</h1>
        <button className="text-gray-400">
          <Bell size={20} />
        </button>
      </div>

      {/* Profile Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-4">
          {/* Avatar with your stylized image */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#F6A100] to-[#F6A100]/50 flex items-center justify-center text-white text-3xl font-bold border-2 border-[#F6A100]">
              IZ
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-[#1F1F1F]"></div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold">{user.name}</h2>
              <CheckCircle size={16} className="text-green-500" />
            </div>
            <p className="text-gray-400 text-sm">{user.email}</p>
            <p className="text-gray-400 text-sm">{user.phone}</p>
          </div>
        </div>

        {/* KYC Badge */}
        <div className="mt-4 flex items-center gap-2">
          <div className="bg-green-500 bg-opacity-20 rounded-full px-3 py-1 flex items-center gap-1">
            <CheckCircle size={14} className="text-green-500" />
            <span className="text-green-500 text-xs">KYC Verified</span>
          </div>
          <div className="bg-[#2C2C2C] rounded-full px-3 py-1">
            <span className="text-gray-400 text-xs">Member since {user.memberSince}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-6 grid grid-cols-3 gap-3">
        <div className="bg-[#2C2C2C] rounded-xl p-3 text-center">
          <p className="text-gray-400 text-xs mb-1">Transactions</p>
          <p className="text-white font-bold">{user.stats.totalTransactions}</p>
        </div>
        <div className="bg-[#2C2C2C] rounded-xl p-3 text-center">
          <p className="text-gray-400 text-xs mb-1">Volume</p>
          <p className="text-white font-bold">{user.stats.totalVolume}</p>
        </div>
        <div className="bg-[#2C2C2C] rounded-xl p-3 text-center">
          <p className="text-gray-400 text-xs mb-1">Savings</p>
          <p className="text-[#F6A100] font-bold">{user.stats.savings}</p>
        </div>
      </div>

      {/* Referral Card */}
      <div className="px-6 mb-6">
        <div className="bg-gradient-to-r from-[#F6A100] to-[#F6A100]/80 rounded-xl p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-[#1F1F1F] text-xs font-semibold mb-1">REFERRAL PROGRAM</p>
              <p className="text-[#1F1F1F] font-bold text-lg">Invite Friends, Earn 10 USDT</p>
            </div>
            <Award className="text-[#1F1F1F]" size={24} />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-[#1F1F1F] bg-opacity-20 rounded-xl p-3">
              <p className="text-[#1F1F1F] text-xs mb-1">Your Referral Code</p>
              <div className="flex items-center justify-between">
                <span className="text-[#1F1F1F] font-bold text-lg">{user.referralCode}</span>
                <button 
                  onClick={copyReferral}
                  className="bg-[#1F1F1F] bg-opacity-20 p-2 rounded-lg"
                >
                  {copied ? <Check size={16} className="text-[#1F1F1F]" /> : <Copy size={16} className="text-[#1F1F1F]" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="px-6 space-y-6">
        {menuSections.map((section) => (
          <div key={section.title}>
            <h3 className="text-gray-400 text-sm font-semibold mb-3">{section.title}</h3>
            <div className="bg-[#2C2C2C] rounded-xl overflow-hidden">
              {section.items.map((item, index) => (
                <motion.button
                  key={item.label}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => item.route !== '#' && router.push(item.route)}
                  className={`w-full flex items-center justify-between p-4 ${
                    index !== section.items.length - 1 ? 'border-b border-gray-700' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} className="text-gray-400" />
                    <span className="text-white">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.value && (
                      <span className={`text-sm ${item.badge ? 'text-green-500' : 'text-gray-400'}`}>
                        {item.value}
                      </span>
                    )}
                    <ChevronRight size={18} className="text-gray-400" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-[#2C2C2C] rounded-xl p-4 flex items-center justify-center gap-2 text-red-500 font-semibold hover:bg-opacity-80 transition-all"
        >
          <LogOut size={20} />
          Log Out
        </button>

        <p className="text-center text-gray-500 text-xs py-4">
          Version 1.0.0 • Terms • Privacy
        </p>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-[#2C2C2C] rounded-2xl p-6 w-full max-w-sm"
          >
            <h3 className="text-xl font-bold text-center mb-2">Log Out</h3>
            <p className="text-gray-400 text-center mb-6">
              Are you sure you want to log out?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 rounded-xl border border-gray-600 text-white font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold"
              >
                Log Out
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}