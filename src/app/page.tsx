'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Chrome, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        if (data.user) router.push('/dashboard');
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } }
        });
        if (error) throw error;
        if (data.user) {
          await supabase.from('profiles').insert([{ 
            id: data.user.id, 
            email, 
            full_name: fullName 
          }]);
          await supabase.from('balances').insert([{ 
            user_id: data.user.id,
            usdt_balance: 0,
            ngn_balance: 0
          }]);
          router.push('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="min-h-screen bg-[#1F1F1F] flex flex-col p-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full"
      >
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-3">
            <span className="text-white">Zuma</span>
            <span className="text-[#F6A100]">Pay</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Crypto to cash. Cash to crypto. Instantly.
          </p>
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-xl p-4 mb-4">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="text-gray-400 text-sm">Full Name</label>
              <div className="relative mt-1">
                <User className="absolute left-4 top-4 text-gray-400" size={20} />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-[#2C2C2C] text-white rounded-xl p-4 pl-12 outline-none focus:ring-2 focus:ring-[#F6A100]"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-gray-400 text-sm">Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-4 top-4 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@zumapay.com"
                className="w-full bg-[#2C2C2C] text-white rounded-xl p-4 pl-12 outline-none focus:ring-2 focus:ring-[#F6A100]"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-sm">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#2C2C2C] text-white rounded-xl p-4 pl-12 pr-12 outline-none focus:ring-2 focus:ring-[#F6A100]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full bg-[#F6A100] text-[#1F1F1F] font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Create Account')}
          </motion.button>
        </form>

        <div className="flex items-center my-8">
          <div className="flex-1 h-px bg-gray-700"></div>
          <span className="px-4 text-gray-500">or</span>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white text-black rounded-xl p-4 flex items-center justify-center gap-3 font-medium hover:bg-opacity-90 transition-all"
          >
            <Chrome size={20} />
            Continue with Google
          </button>
        </div>

        <p className="text-center mt-8 text-gray-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#F6A100] font-semibold hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </p>

        <p className="text-center mt-8 text-xs text-gray-500">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </motion.div>
    </div>
  );
}