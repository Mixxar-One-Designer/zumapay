'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Mail, Calendar, Check, Edit2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function PersonalInfo() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState('');

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
    setFullName(profile?.full_name || '');
    setLoading(false);
  };

  const updateProfile = async () => {
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', user.id);

    if (!error) {
      setProfile({ ...profile, full_name: fullName });
      setEditing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1F1F1F] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F6A100]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1F1F1F] pb-24">
      <div className="p-6 flex items-center gap-4 border-b border-gray-800">
        <button onClick={() => router.back()}>
          <ArrowLeft className="text-white" size={24} />
        </button>
        <h1 className="text-xl font-bold flex-1">Personal Information</h1>
      </div>

      <div className="p-6">
        <div className="bg-[#2C2C2C] rounded-xl p-6 border border-gray-800 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F6A100] to-[#F6A100]/70 flex items-center justify-center text-white text-xl font-bold">
                {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white font-semibold">{profile?.full_name || 'User'}</p>
                <p className="text-gray-400 text-sm">Member since {new Date(user?.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#2C2C2C] rounded-xl border border-gray-800 overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <User size={18} className="text-gray-400" />
                <span className="text-white text-sm">Full Name</span>
              </div>
              {!editing ? (
                <button onClick={() => setEditing(true)} className="text-[#F6A100] text-sm flex items-center gap-1">
                  <Edit2 size={14} /> Edit
                </button>
              ) : (
                <button onClick={updateProfile} className="text-green-500 text-sm flex items-center gap-1">
                  <Check size={14} /> Save
                </button>
              )}
            </div>
            {editing ? (
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full mt-2 bg-[#1F1F1F] text-white rounded-lg p-2 outline-none focus:ring-1 focus:ring-[#F6A100]"
              />
            ) : (
              <p className="text-white mt-2">{profile?.full_name || 'Not set'}</p>
            )}
          </div>

          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center gap-3 mb-2">
              <Mail size={18} className="text-gray-400" />
              <span className="text-white text-sm">Email Address</span>
            </div>
            <p className="text-gray-400 text-sm ml-7">{user?.email}</p>
            <p className="text-green-500 text-xs ml-7 mt-1">Verified</p>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Calendar size={18} className="text-gray-400" />
              <span className="text-white text-sm">Account Created</span>
            </div>
            <p className="text-gray-400 text-sm ml-7">{new Date(user?.created_at).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}