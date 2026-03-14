'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, QrCode, Smartphone, Check } from 'lucide-react';
import { useSettings } from '@/app/SettingsProvider';

export default function TwoFactorAuth() {
  const router = useRouter();
  const { twoFactorEnabled, setTwoFactorEnabled } = useSettings();
  const [showQR, setShowQR] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()}>
          <ArrowLeft style={{ color: 'var(--text-primary)' }} size={24} />
        </button>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Two-Factor Authentication</h1>
      </div>

      {/* Status Card */}
      <div className="rounded-xl p-6 border mb-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="text-[#F6A100]" size={24} />
            <div>
              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Secure Your Account</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Add an extra layer of security</p>
            </div>
          </div>
          <div style={{ 
            backgroundColor: twoFactorEnabled ? 'rgba(34, 197, 94, 0.2)' : 'rgba(234, 179, 8, 0.2)',
            padding: '8px 16px',
            borderRadius: '12px',
            display: 'inline-block'
          }}>
            <span style={{ 
              color: twoFactorEnabled ? '#22c55e' : '#eab308',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              {twoFactorEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
      </div>

      {!twoFactorEnabled ? (
        <>
          {/* Instructions */}
          <div className="rounded-xl p-5 border mb-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Smartphone size={18} className="text-[#F6A100]" />
              Setup Instructions
            </h3>
            <ol className="space-y-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <li>1. Download Google Authenticator or Authy</li>
              <li>2. Scan the QR code</li>
              <li>3. Enter the 6-digit code</li>
            </ol>
          </div>

          {/* Enable Button */}
          <button
            onClick={() => setShowQR(true)}
            style={{
              backgroundColor: '#F6A100',
              color: '#1F1F1F',
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Enable Two-Factor Auth
          </button>
        </>
      ) : (
        /* Enabled State */
        <div style={{
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          border: '1px solid #22c55e',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <Check style={{ color: '#22c55e', margin: '0 auto 12px' }} size={32} />
          <p style={{ color: 'var(--text-primary)', fontWeight: '600', marginBottom: '4px' }}>2FA is Enabled</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>Your account is protected</p>
          
          {/* Disable Button */}
          <button
            onClick={() => setTwoFactorEnabled(false)}
            style={{
              backgroundColor: '#F6A100',
              color: '#1F1F1F',
              padding: '8px 24px',
              borderRadius: '8px',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Disable 2FA
          </button>
        </div>
      )}

      {/* QR Modal */}
      {showQR && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          zIndex: 50
        }}>
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '16px',
            padding: '24px',
            width: '100%',
            maxWidth: '400px',
            border: '1px solid var(--border)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center', marginBottom: '16px', color: 'var(--text-primary)' }}>
              Scan QR Code
            </h3>
            
            <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
              <QrCode style={{ color: 'black' }} size={150} />
            </div>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '12px', textAlign: 'center', marginBottom: '16px' }}>
              Scan with Google Authenticator or Authy
            </p>
            
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
              style={{
                width: '100%',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                textAlign: 'center',
                marginBottom: '16px',
                outline: 'none'
              }}
            />
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowQR(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  backgroundColor: 'transparent',
                  color: 'var(--text-primary)',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (verificationCode.length === 6) {
                    setTwoFactorEnabled(true);
                    setShowQR(false);
                    setVerificationCode('');
                  }
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: verificationCode.length === 6 ? '#F6A100' : '#6b7280',
                  color: verificationCode.length === 6 ? '#1F1F1F' : 'white',
                  fontWeight: '600',
                  cursor: verificationCode.length === 6 ? 'pointer' : 'not-allowed',
                  opacity: verificationCode.length === 6 ? 1 : 0.5
                }}
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}