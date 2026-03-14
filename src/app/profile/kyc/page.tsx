'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Upload,
  User,
  CreditCard,
  Camera,
  Check,
  X
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useTranslation } from '@/hooks/useTranslation';

export default function KYCVerification() {
  const router = useRouter();
  const { t } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [kycStatus, setKycStatus] = useState('not_started');
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    nationality: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    documentType: 'passport',
    documentNumber: '',
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/');
        return;
      }
      setUser(user);
      setFormData(prev => ({ ...prev, fullName: user.user_metadata?.full_name || '' }));
      
      await loadKYCStatus(user.id);
    } catch (error) {
      console.error('Error checking user:', error);
      setLoading(false);
    }
  };

  const loadKYCStatus = async (userId: string) => {
    try {
      // First check if user is verified in profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('kyc_status')
        .eq('id', userId)
        .single();

      if (!profileError && profile?.kyc_status === 'verified') {
        setKycStatus('verified');
        setLoading(false);
        return;
      }

      // If not verified in profile, check kyc_verifications table
      const { data: kycData, error: kycError } = await supabase
        .from('kyc_verifications')
        .select('status')
        .eq('user_id', userId)
        .maybeSingle();

      if (kycData) {
        setKycStatus(kycData.status);
      } else {
        // No record found, user hasn't started KYC
        setKycStatus('not_started');
      }
    } catch (error) {
      console.log('Error loading KYC status:', error);
      setKycStatus('not_started');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Save to kyc_verifications table
      const { error } = await supabase
        .from('kyc_verifications')
        .insert([{
          user_id: user.id,
          status: 'pending',
          full_name: formData.fullName,
          date_of_birth: formData.dateOfBirth,
          nationality: formData.nationality,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postalCode,
          document_type: formData.documentType,
          document_number: formData.documentNumber,
          submitted_at: new Date(),
        }]);

      if (error) throw error;
      
      setKycStatus('pending');
    } catch (error) {
      console.error('Error submitting KYC:', error);
    }
  };

  const steps = [
    { number: 1, title: 'Personal Info', icon: User },
    { number: 2, title: 'Identity', icon: CreditCard },
    { number: 3, title: 'Upload', icon: Upload },
    { number: 4, title: 'Submit', icon: CheckCircle },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F6A100]"></div>
      </div>
    );
  }

  // ✅ VERIFIED - User is already verified
  if (kycStatus === 'verified') {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.back()}>
            <ArrowLeft style={{ color: 'var(--text-primary)' }} size={24} />
          </button>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>KYC Verification</h1>
        </div>

        <div className="rounded-xl p-8 text-center" style={{ backgroundColor: 'var(--bg-card)' }}>
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Verified!</h2>
          <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
            Your identity has been successfully verified.
          </p>
          <button
            onClick={() => router.push('/profile')}
            className="px-6 py-3 rounded-lg font-medium"
            style={{ backgroundColor: '#F6A100', color: '#1F1F1F' }}
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  // ⏳ PENDING - Under review
  if (kycStatus === 'pending') {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.back()}>
            <ArrowLeft style={{ color: 'var(--text-primary)' }} size={24} />
          </button>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>KYC Verification</h1>
        </div>

        <div className="rounded-xl p-8 text-center" style={{ backgroundColor: 'var(--bg-card)' }}>
          <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Pending Review</h2>
          <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
            Your documents are being reviewed by our team.
          </p>
          <button
            onClick={() => router.push('/profile')}
            className="px-6 py-3 rounded-lg font-medium"
            style={{ backgroundColor: '#F6A100', color: '#1F1F1F' }}
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  // ❌ REJECTED - Verification failed
  if (kycStatus === 'rejected') {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.back()}>
            <ArrowLeft style={{ color: 'var(--text-primary)' }} size={24} />
          </button>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>KYC Verification</h1>
        </div>

        <div className="rounded-xl p-8 text-center" style={{ backgroundColor: 'var(--bg-card)' }}>
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <X size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Verification Failed</h2>
          <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
            We couldn't verify your identity with the documents provided.
          </p>
          <button
            onClick={() => {
              setKycStatus('not_started');
              setActiveStep(1);
            }}
            className="px-6 py-3 rounded-lg font-medium w-full"
            style={{ backgroundColor: '#F6A100', color: '#1F1F1F' }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // 🆕 NOT STARTED - Show the KYC process for new/unverified users
  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()}>
          <ArrowLeft style={{ color: 'var(--text-primary)' }} size={24} />
        </button>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Verify Your Identity</h1>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="flex flex-col items-center flex-1">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    step.number < activeStep 
                      ? 'bg-green-500' 
                      : step.number === activeStep 
                      ? 'bg-[#F6A100]' 
                      : 'bg-gray-600'
                  }`}
                >
                  {step.number < activeStep ? (
                    <Check size={18} className="text-white" />
                  ) : (
                    <Icon size={18} className="text-white" />
                  )}
                </div>
                <span className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
        <div className="relative mt-2">
          <div className="absolute top-0 left-0 h-1 bg-gray-600 rounded-full" style={{ width: '100%' }} />
          <div 
            className="absolute top-0 left-0 h-1 bg-[#F6A100] rounded-full transition-all duration-300" 
            style={{ width: `${((activeStep - 1) / 3) * 100}%` }} 
          />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Personal Information */}
        {activeStep === 1 && (
          <div className="space-y-4">
            <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Personal Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm mb-2 block" style={{ color: 'var(--text-secondary)' }}>Full Name (as on ID)</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full rounded-xl p-3 outline-none focus:ring-1 focus:ring-[#F6A100]"
                    style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm mb-2 block" style={{ color: 'var(--text-secondary)' }}>Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full rounded-xl p-3 outline-none focus:ring-1 focus:ring-[#F6A100]"
                    style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm mb-2 block" style={{ color: 'var(--text-secondary)' }}>Nationality</label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    className="w-full rounded-xl p-3 outline-none focus:ring-1 focus:ring-[#F6A100]"
                    style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className="w-full py-3 rounded-xl font-semibold"
              style={{ backgroundColor: '#F6A100', color: '#1F1F1F' }}
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Identity Verification */}
        {activeStep === 2 && (
          <div className="space-y-4">
            <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Identity Verification</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm mb-2 block" style={{ color: 'var(--text-secondary)' }}>Document Type</label>
                  <select
                    name="documentType"
                    value={formData.documentType}
                    onChange={handleInputChange}
                    className="w-full rounded-xl p-3 outline-none focus:ring-1 focus:ring-[#F6A100]"
                    style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                    required
                  >
                    <option value="passport">International Passport</option>
                    <option value="drivers">Driver's License</option>
                    <option value="national">National ID Card</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm mb-2 block" style={{ color: 'var(--text-secondary)' }}>Document Number</label>
                  <input
                    type="text"
                    name="documentNumber"
                    value={formData.documentNumber}
                    onChange={handleInputChange}
                    className="w-full rounded-xl p-3 outline-none focus:ring-1 focus:ring-[#F6A100]"
                    style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="flex-1 py-3 rounded-xl border font-semibold"
                style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className="flex-1 py-3 rounded-xl font-semibold"
                style={{ backgroundColor: '#F6A100', color: '#1F1F1F' }}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Upload Documents */}
        {activeStep === 3 && (
          <div className="space-y-4">
            <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Upload Documents</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm mb-2 block" style={{ color: 'var(--text-secondary)' }}>Front of ID</label>
                  <div 
                    className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-[#F6A100]"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <Camera size={32} className="mx-auto mb-2" style={{ color: 'var(--text-secondary)' }} />
                    <p className="text-sm" style={{ color: 'var(--text-primary)' }}>Click to upload</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm mb-2 block" style={{ color: 'var(--text-secondary)' }}>Back of ID</label>
                  <div 
                    className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-[#F6A100]"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <Camera size={32} className="mx-auto mb-2" style={{ color: 'var(--text-secondary)' }} />
                    <p className="text-sm" style={{ color: 'var(--text-primary)' }}>Click to upload</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="flex-1 py-3 rounded-xl border font-semibold"
                style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(4)}
                className="flex-1 py-3 rounded-xl font-semibold"
                style={{ backgroundColor: '#F6A100', color: '#1F1F1F' }}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Submit */}
        {activeStep === 4 && (
          <div className="space-y-4">
            <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Review & Submit</h3>
              
              <div className="space-y-3 mb-4">
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Please review your information before submitting.</p>
              </div>

              <label className="flex items-center gap-2 mb-4">
                <input type="checkbox" className="rounded" required />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  I confirm that all information is accurate
                </span>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className="flex-1 py-3 rounded-xl border font-semibold"
                style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl font-semibold"
                style={{ backgroundColor: '#F6A100', color: '#1F1F1F' }}
              >
                Submit for Review
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}