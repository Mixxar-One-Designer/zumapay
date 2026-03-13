'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Chrome, Send, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#1F1F1F] flex flex-col p-6">
      {/* Logo */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col justify-center"
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-gray-400 text-sm">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-4 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-[#2C2C2C] text-white rounded-xl p-4 pl-12 outline-none focus:ring-2 focus:ring-[#F6A100]"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-gray-400 text-sm">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-4 text-gray-400" size={20} />
              <input
                type="email"
                placeholder="hello@zumapay.com"
                className="w-full bg-[#2C2C2C] text-white rounded-xl p-4 pl-12 outline-none focus:ring-2 focus:ring-[#F6A100]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-gray-400 text-sm">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-[#2C2C2C] text-white rounded-xl p-4 pl-12 pr-12 outline-none focus:ring-2 focus:ring-[#F6A100]"
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

          {!isLogin && (
            <div className="space-y-2">
              <label className="text-gray-400 text-sm">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-[#2C2C2C] text-white rounded-xl p-4 pl-12 pr-12 outline-none focus:ring-2 focus:ring-[#F6A100]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-4 text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          )}

          {isLogin && (
            <div className="text-right">
              <button type="button" className="text-[#F6A100] text-sm">
                Forgot Password?
              </button>
            </div>
          )}

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-[#F6A100] text-[#1F1F1F] font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-opacity-90 transition-all"
          >
            {isLogin ? 'Log In' : 'Create Account'}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-1 h-px bg-gray-700"></div>
          <span className="px-4 text-gray-500">or continue with</span>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        {/* Social Login */}
        <div className="space-y-3">
          <button className="w-full bg-white text-black rounded-xl p-4 flex items-center justify-center gap-3 font-medium hover:bg-opacity-90 transition-all">
            <Chrome size={20} />
            Google
          </button>
          <button className="w-full bg-[#0088cc] text-white rounded-xl p-4 flex items-center justify-center gap-3 font-medium hover:bg-opacity-90 transition-all">
            <Send size={20} />
            Telegram
          </button>
        </div>

        {/* Toggle */}
        <p className="text-center mt-8 text-gray-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#F6A100] font-semibold hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </p>

        {/* Terms */}
        <p className="text-center mt-8 text-xs text-gray-500">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </motion.div>
    </div>
  );
}