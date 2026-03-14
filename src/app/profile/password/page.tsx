'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Lock, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ChangePassword() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setSuccess('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        router.push('/profile');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1F1F1F] pb-24">
      <div className="p-6 flex items-center gap-4 border-b border-gray-800">
        <button onClick={() => router.back()}>
          <ArrowLeft className="text-white" size={24} />
        </button>
        <h1 className="text-xl font-bold flex-1">Change Password</h1>
      </div>

      <div className="p-6">
        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-xl p-4 mb-4 flex gap-2">
            <AlertCircle className="text-red-500 flex-shrink-0" size={18} />
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-500 bg-opacity-10 border border-green-500 rounded-xl p-4 mb-4 flex gap-2">
            <Check className="text-green-500 flex-shrink-0" size={18} />
            <p className="text-green-500 text-sm">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-[#2C2C2C] rounded-xl p-5 border border-gray-800 space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#1F1F1F] text-white rounded-xl p-3 pl-10 pr-10 outline-none focus:ring-1 focus:ring-[#F6A100]"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-3 text-gray-400"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#1F1F1F] text-white rounded-xl p-3 pl-10 pr-10 outline-none focus:ring-1 focus:ring-[#F6A100]"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3 text-gray-400"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F6A100] text-[#1F1F1F] font-semibold py-3 rounded-xl hover:bg-opacity-90 transition-all mt-4"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>

        <p className="text-gray-500 text-xs text-center mt-4">
          Password must be at least 6 characters
        </p>
      </div>
    </div>
  );
}