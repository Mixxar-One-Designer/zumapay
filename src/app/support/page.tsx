'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, ChevronDown } from 'lucide-react';

export default function Support() {
  const router = useRouter();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const faqs = [
    {
      question: "How do I deposit cash?",
      answer: "Go to Dashboard → Quick Actions → Deposit Cash. Choose your payment method (Bank Transfer, Card, or USSD) and follow the instructions."
    },
    {
      question: "How long do withdrawals take?",
      answer: "Withdrawals are processed instantly. Bank transfers typically reflect within 5-10 minutes depending on your bank."
    },
    {
      question: "What are your fees?",
      answer: "We charge 0.8% on all conversions. Deposits are free. Bank transfers have no additional fees."
    },
    {
      question: "Is my money safe?",
      answer: "Yes! We use bank-level security and 2FA protection. Your crypto is stored in secure wallets with multi-signature authentication."
    },
    {
      question: "How do I buy crypto?",
      answer: "Click 'Buy Crypto' from Dashboard, enter the amount in Naira, and confirm. The crypto will be credited to your wallet instantly."
    },
    {
      question: "What is the exchange rate?",
      answer: "Our rates are live from Binance/CoinGecko. You always see the current rate before confirming any transaction."
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message && email) {
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setMessage('');
        setEmail('');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#1F1F1F]">
      {/* Header */}
      <div className="p-6 flex items-center gap-4 border-b border-gray-800">
        <button onClick={() => router.back()}>
          <ArrowLeft className="text-white" size={24} />
        </button>
        <h1 className="text-xl font-bold">Support Center</h1>
      </div>

      <div className="p-6">
        {/* Quick Help */}
        <div className="bg-gradient-to-r from-[#F6A100] to-[#F6A100]/80 rounded-2xl p-6 mb-8">
          <h2 className="text-[#1F1F1F] text-xl font-bold mb-2">How can we help?</h2>
          <p className="text-[#1F1F1F] text-sm opacity-90">We're here 24/7 to assist you</p>
        </div>

        {/* FAQ Section */}
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <span className="text-[#F6A100]">❓</span>
          Frequently Asked Questions
        </h2>

        <div className="space-y-3 mb-8">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-[#2C2C2C] rounded-xl border border-gray-800 overflow-hidden"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <span className="text-white font-medium">{faq.question}</span>
                <ChevronDown
                  size={20}
                  className={`text-gray-400 transition-transform ${
                    activeFaq === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {activeFaq === index && (
                <div className="px-4 pb-4 text-gray-400 text-sm border-t border-gray-800 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <span className="text-[#F6A100]">📧</span>
          Send us a message
        </h2>

        {sent ? (
          <div className="bg-green-500 bg-opacity-20 border border-green-500 rounded-xl p-6 text-center">
            <span className="text-green-500 text-4xl block mb-3">✓</span>
            <h3 className="text-white font-semibold mb-2">Message Sent!</h3>
            <p className="text-gray-400 text-sm">We'll get back to you within 24 hours</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[#2C2C2C] rounded-xl p-5 border border-gray-800">
            <div className="mb-4">
              <label className="text-gray-400 text-sm mb-2 block">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-[#1F1F1F] text-white rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#F6A100]"
              />
            </div>

            <div className="mb-4">
              <label className="text-gray-400 text-sm mb-2 block">Your Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help you today?"
                rows={4}
                required
                className="w-full bg-[#1F1F1F] text-white rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#F6A100] resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={!message || !email}
              className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${
                message && email
                  ? 'bg-[#F6A100] text-[#1F1F1F]'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send size={18} />
              Send Message
            </button>
          </form>
        )}

        {/* Contact Options */}
        <div className="mt-8 grid grid-cols-2 gap-3">
          <div className="bg-[#2C2C2C] rounded-xl p-4 text-center border border-gray-800">
            <span className="text-[#F6A100] text-2xl block mb-2">📞</span>
            <p className="text-white text-sm font-medium">Phone Support</p>
            <p className="text-gray-400 text-xs mt-1">+234 800 123 4567</p>
          </div>
          <div className="bg-[#2C2C2C] rounded-xl p-4 text-center border border-gray-800">
            <span className="text-[#F6A100] text-2xl block mb-2">💬</span>
            <p className="text-white text-sm font-medium">Live Chat</p>
            <p className="text-gray-400 text-xs mt-1">Available 24/7</p>
          </div>
        </div>

        {/* Status */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span className="text-gray-400 text-sm">All systems operational</span>
        </div>
      </div>
    </div>
  );
}