'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, QrCode, Smartphone, Check, AlertCircle } from 'lucide-react';

export default function TwoFactorAuth() {
  const router = useRouter();
  const [enabled, setEnabled] = useState(false);
  const [showQR, setShowQR] = useState(false);

  return (
    <div className="min-h-screen bg-[#1F1F1F] pb-24">
      <div className="p-6 flex items-center gap-4 border-b border-gray-800">
        <button onClick={() => router.back()}>
          <ArrowLeft className="text-white" size={24} />
        </button>
        <h1 className="text-xl font-bold flex-1">Two-Factor Authentication</h1>
      </div>

      <div className="p-6">
        <div className="bg-[#2C2C2C] rounded-xl p-6 border border-gray-800 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Shield className="text-[#F6A100]" size={24} />
              <div>
                <p className="text-white font-semibold">Secure Your Account</p>
                <p className="text-gray-400 text-sm">Add an extra layer of security</p>
              </div>
            </div>
            <button
              onClick={() => setEnabled(!enabled)}
              className={`px-4 py-2 rounded-xl font-medium ${
                enabled 
                  ? 'bg-green-500 bg-opacity-20 text-green-500' 
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              {enabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>

        {!enabled ? (
          <div className="space-y-4">
            <div className="bg-[#2C2C2C] rounded-xl p-5 border border-gray-800">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Smartphone size={18} className="text-[#F6A100]" />
                Setup Instructions
              </h3>
              <ol className="space-y-3 text-gray-400 text-sm">
                <li>1. Download Google Authenticator or Authy</li>
                <li>2. Scan the QR code when you enable 2FA</li>
                <li>3. Enter the 6-digit code to verify</li>
              </ol>
            </div>

            <button
              onClick={() => setShowQR(true)}
              className="w-full bg-[#F6A100] text-[#1F1F1F] font-semibold py-3 rounded-xl hover:bg-opacity-90 transition-all"
            >
              Enable Two-Factor Auth
            </button>
          </div>
        ) : (
          <div className="bg-green-500 bg-opacity-10 border border-green-500 rounded-xl p-6 text-center">
            <Check className="text-green-500 mx-auto mb-3" size={32} />
            <p className="text-white font-semibold mb-1">2FA is Enabled</p>
            <p className="text-gray-400 text-sm">Your account is protected</p>
          </div>
        )}

        {showQR && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
            <div className="bg-[#2C2C2C] rounded-2xl p-6 w-full max-w-sm border border-gray-800">
              <h3 className="text-xl font-bold text-center text-white mb-4">Scan QR Code</h3>
              <div className="bg-white p-4 rounded-xl mb-4 flex justify-center">
                <QrCode className="text-black" size={150} />
              </div>
              <p className="text-gray-400 text-xs text-center mb-4">
                Scan with Google Authenticator or Authy
              </p>
              <button
                onClick={() => setShowQR(false)}
                className="w-full py-3 rounded-xl bg-[#F6A100] text-[#1F1F1F] font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}