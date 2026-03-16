'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, Phone, Mail, MessageCircle, ChevronDown, CheckCircle, X, Bot } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getGeminiResponse } from '@/lib/ai-support';
import toast from 'react-hot-toast';

interface FAQItem {
  question: string;
  answer: string;
  open: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export default function SupportPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [showAi, setShowAi] = useState(false);
  const [sent, setSent] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: '👋 Hello! I\'m ZumaBot. How can I help you with ZumaPay today? You can ask me about deposits, withdrawals, fees, KYC, or anything else!',
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);
  
  const [faqs, setFaqs] = useState<FAQItem[]>([
    { 
      question: "How do I deposit crypto?", 
      answer: "Go to Dashboard → Deposit Crypto. Copy your deposit address and send USDT from your wallet. The funds will appear in your balance after a few minutes.", 
      open: false 
    },
    { 
      question: "How do I withdraw to my bank account?", 
      answer: "Go to Withdraw Cash page. Enter the amount, select your bank, enter your account number, and confirm. The money will be sent to your bank account instantly.", 
      open: false 
    },
    { 
      question: "What are your fees?", 
      answer: "We charge 0.8% on conversions and withdrawals. Deposits are completely free!", 
      open: false 
    },
    { 
      question: "How do I buy crypto with Naira?", 
      answer: "Go to Buy Crypto page. Enter how much Naira you want to spend and confirm. USDT will be added to your wallet instantly.", 
      open: false 
    },
    { 
      question: "How do I convert between USDT and Naira?", 
      answer: "Go to Convert page. Choose whether you want USDT → NGN or NGN → USDT, enter the amount, and confirm. It's instant!", 
      open: false 
    },
    { 
      question: "What are the withdrawal limits?", 
      answer: "Withdrawal limits depend on your KYC level. Complete verification in Profile to increase your limits.", 
      open: false 
    },
    { 
      question: "How do I verify my account (KYC)?", 
      answer: "Go to Profile → KYC Verification. Fill in your information and upload your documents. It takes 1-2 business days to approve.", 
      open: false 
    },
    { 
      question: "Is ZumaPay safe?", 
      answer: "Yes! We use bank-level security, 2FA, and secure wallets. Your funds and data are protected.", 
      open: false 
    },
    { 
      question: "How do I change my password?", 
      answer: "Go to Profile → Security → Change Password to update your password.", 
      open: false 
    },
    { 
      question: "How do I enable 2FA?", 
      answer: "Go to Profile → Security → Two-Factor Authentication and follow the instructions for extra account security.", 
      open: false 
    },
  ]);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        setEmail(user.email || '');
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setName(profile.full_name || '');
        }
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFaq = (index: number) => {
    setFaqs(faqs.map((faq, i) => ({
      ...faq,
      open: i === index ? !faq.open : false
    })));
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    
    const userText = chatInput;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    
    // Show typing indicator
    const typingId = 'typing-' + Date.now();
    setChatMessages(prev => [...prev, {
      id: typingId,
      sender: 'ai',
      text: '...',
      timestamp: new Date()
    }]);
    
    try {
      // Prepare conversation history for context
      const history = chatMessages.map(msg => 
        `${msg.sender === 'user' ? 'User' : 'ZumaBot'}: ${msg.text}`
      );
      
      // Get AI response from Gemini
      const aiResponse = await getGeminiResponse(userText, history);
      
      // Remove typing indicator
      setChatMessages(prev => prev.filter(msg => msg.id !== typingId));
      
      // Add AI response
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiResponse,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      // Remove typing indicator
      setChatMessages(prev => prev.filter(msg => msg.id !== typingId));
      
      // Fallback
      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "I'm having trouble connecting. Please try again or use the contact form below.",
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, fallbackMessage]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message) return;
    
    try {
      if (user) {
        const { error } = await supabase
          .from('support_messages')
          .insert({
            user_id: user.id,
            name: name || 'User',
            email: email,
            message: message,
            status: 'pending'
          });
        
        if (error) throw error;
      }
      
      setSent(true);
      setMessage('');
      toast.success('Message sent! We\'ll respond within 24 hours.');
      
      setTimeout(() => {
        setSent(false);
      }, 3000);
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendChat();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F6A100]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1F1F1F] pb-24">
      {/* Header */}
      <div className="p-6 flex items-center gap-4 border-b border-gray-800">
        <button onClick={() => router.back()}>
          <ArrowLeft className="text-white" size={24} />
        </button>
        <h1 className="text-xl font-bold">Support Center</h1>
      </div>

      <div className="p-6">
        {/* Quick Help Banner */}
        <div className="bg-gradient-to-r from-[#F6A100] to-[#F6A100]/80 rounded-2xl p-6 mb-8">
          <h2 className="text-[#1F1F1F] text-xl font-bold mb-2">How can we help?</h2>
          <p className="text-[#1F1F1F] text-sm opacity-90">We're here 24/7 to assist you</p>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div 
            onClick={() => window.location.href = 'tel:+2348001234567'}
            className="bg-[#2C2C2C] rounded-xl p-4 text-center border border-gray-800 hover:border-[#F6A100] transition-all cursor-pointer"
          >
            <Phone className="text-[#F6A100] mx-auto mb-2" size={24} />
            <p className="text-white text-sm font-medium">Call Us</p>
            <p className="text-gray-400 text-xs mt-1">+234 800 123 4567</p>
          </div>
          <div 
            onClick={() => window.location.href = 'mailto:support@zumapay.com'}
            className="bg-[#2C2C2C] rounded-xl p-4 text-center border border-gray-800 hover:border-[#F6A100] transition-all cursor-pointer"
          >
            <Mail className="text-[#F6A100] mx-auto mb-2" size={24} />
            <p className="text-white text-sm font-medium">Email</p>
            <p className="text-gray-400 text-xs mt-1">support@zumapay.com</p>
          </div>
          <div 
            onClick={() => setChatOpen(true)}
            className="bg-[#2C2C2C] rounded-xl p-4 text-center border border-gray-800 hover:border-[#F6A100] transition-all cursor-pointer"
          >
            <MessageCircle className="text-[#F6A100] mx-auto mb-2" size={24} />
            <p className="text-white text-sm font-medium">Live Chat</p>
            <p className="text-gray-400 text-xs mt-1">Click to chat with AI</p>
          </div>
        </div>

        {/* AI Chat Modal */}
        {chatOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#2C2C2C] rounded-2xl w-full max-w-lg border border-gray-800 overflow-hidden">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="text-[#F6A100]" size={24} />
                  <div>
                    <h3 className="text-white font-semibold">ZumaBot</h3>
                    <p className="text-xs text-gray-400">AI Support Assistant</p>
                  </div>
                </div>
                <button
                  onClick={() => setChatOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-xl p-3 ${
                        msg.sender === 'user'
                          ? 'bg-[#F6A100] text-[#1F1F1F]'
                          : 'bg-[#1F1F1F] text-white'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {msg.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-800">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 bg-[#1F1F1F] text-white rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#F6A100]"
                  />
                  <button
                    onClick={handleSendChat}
                    disabled={!chatInput.trim()}
                    className="bg-[#F6A100] text-[#1F1F1F] rounded-xl px-4 py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={18} />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Powered by Google Gemini AI
                </p>
              </div>
            </div>
          </div>
        )}

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
                onClick={() => toggleFaq(index)}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <span className="text-white font-medium">{faq.question}</span>
                <ChevronDown
                  size={20}
                  className={`text-gray-400 transition-transform ${
                    faq.open ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {faq.open && (
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
            <CheckCircle className="text-green-500 mx-auto mb-3" size={40} />
            <h3 className="text-white font-semibold mb-2">Message Sent!</h3>
            <p className="text-gray-400 text-sm">We'll get back to you within 24 hours</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[#2C2C2C] rounded-xl p-5 border border-gray-800">
            {!user && (
              <>
                <div className="mb-4">
                  <label className="text-gray-400 text-sm mb-2 block">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-[#1F1F1F] text-white rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#F6A100]"
                    required={!user}
                  />
                </div>
                <div className="mb-4">
                  <label className="text-gray-400 text-sm mb-2 block">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-[#1F1F1F] text-white rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#F6A100]"
                    required={!user}
                  />
                </div>
              </>
            )}

            <div className="mb-4">
              <label className="text-gray-400 text-sm mb-2 block">Your Message</label>
              <textarea
                value={message}
                onChange={handleMessageChange}
                placeholder="How can we help you today?"
                rows={4}
                required
                className="w-full bg-[#1F1F1F] text-white rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#F6A100] resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={!message}
              className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${
                message
                  ? 'bg-[#F6A100] text-[#1F1F1F] hover:bg-opacity-90 transition-all'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send size={18} />
              Send Message
            </button>
          </form>
        )}

        {/* Status */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span className="text-gray-400 text-sm">All systems operational</span>
        </div>
      </div>
    </div>
  );
}