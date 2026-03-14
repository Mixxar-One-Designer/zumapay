'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Phone, Check, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function PhoneNumber() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentPhone, setCurrentPhone] = useState('');

  useEffect(() => {
    loadPhone();
  }, []);

  const loadPhone = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.user_metadata?.phone) {
      setPhone(user.user_metadata.phone);
      setCurrentPhone(user.user_metadata.phone);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Simple validation
      if (!phone || phone.length < 10) {
        throw new Error('Please enter a valid phone number');
      }

      // Update phone in user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { phone: phone }
      });

      if (updateError) throw updateError;

      setSuccess('Phone number updated successfully!');
      setCurrentPhone(phone);
      
      // Clear success message after 2 seconds
      setTimeout(() => {
        setSuccess('');
        router.push('/profile');
      }, 2000);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()}>
          <ArrowLeft style={{ color: 'var(--text-primary)' }} size={24} />
        </button>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Phone Number</h1>
      </div>

      {/* Current Phone Display */}
      {currentPhone && (
        <div className="mb-4 p-4 rounded-xl" style={{ 
          backgroundColor: 'var(--bg-card)', 
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Phone size={18} style={{ color: 'var(--text-secondary)' }} />
          <span style={{ color: 'var(--text-secondary)' }}>Current: </span>
          <span style={{ color: '#F6A100', fontWeight: '500' }}>{currentPhone}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 rounded-xl" style={{ 
          backgroundColor: 'rgba(239, 68, 68, 0.1)', 
          border: '1px solid rgba(239, 68, 68, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#ef4444'
        }}>
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-4 rounded-xl" style={{ 
          backgroundColor: 'rgba(34, 197, 94, 0.1)', 
          border: '1px solid rgba(34, 197, 94, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#22c55e'
        }}>
          <Check size={18} />
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm mb-2 block" style={{ color: 'var(--text-secondary)' }}>
            Phone Number
          </label>
          <div className="relative">
            <Phone size={18} style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '14px', 
              color: 'var(--text-secondary)' 
            }} />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08012345678"
              className="w-full rounded-xl p-3 pl-10 outline-none focus:ring-1 focus:ring-[#F6A100]"
              style={{ 
                backgroundColor: 'var(--bg-card)', 
                color: 'var(--text-primary)',
                border: '1px solid var(--border)'
              }}
            />
          </div>
          <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
            Enter Nigerian number (e.g., 08012345678)
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            backgroundColor: '#F6A100',
            color: '#1F1F1F',
            padding: '14px',
            borderRadius: '12px',
            fontWeight: '600',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.5 : 1
          }}
        >
          {loading ? 'Updating...' : 'Update Phone Number'}
        </button>
      </form>
    </div>
  );
}