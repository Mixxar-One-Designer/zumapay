import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export async function getGeminiResponse(message: string, conversationHistory: string[] = []): Promise<string> {
  try {
    // Check if API key exists
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      console.error('Gemini API key not found');
      return getFallbackResponse(message);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // System prompt
    const systemPrompt = `You are ZumaBot, a friendly support assistant for ZumaPay.

YOUR JOB:
- Help users understand how to USE ZumaPay
- Give clear, step-by-step instructions
- Focus only on what the USER needs to do
- Be tolerant of typos and misspellings

HOW TO DEPOSIT:
"Go to Dashboard → Deposit Crypto. Copy your deposit address and send USDT from your wallet. The funds will appear in your balance after a few minutes."

HOW TO WITHDRAW:
"Go to Withdraw Cash page. Enter the amount, select your bank, and confirm. The money will be sent to your bank account instantly."

HOW TO BUY CRYPTO:
"Go to Buy Crypto page. Enter the amount in Naira you want to spend and confirm. USDT will be added to your wallet instantly."

HOW TO CONVERT:
"Go to Convert page. Choose whether you want USDT → NGN or NGN → USDT, enter the amount, and confirm."

KYC VERIFICATION:
"Go to Profile → KYC Verification. Submit your documents and wait for approval (1-2 business days)."

FEES:
"We charge 0.8% on conversions and withdrawals. Deposits are free."

RULES:
- Be friendly and use emojis 😊
- Keep responses to 2-3 sentences max
- Understand typos (withdaraw = withdraw, thaanks = thanks, etc.)
- Never mention technical details

Current date: ${new Date().toLocaleDateString()}`;

    // Build conversation
    let fullPrompt = systemPrompt + "\n\n";
    
    if (conversationHistory.length > 0) {
      fullPrompt += "Previous conversation:\n";
      for (const exchange of conversationHistory.slice(-4)) {
        fullPrompt += exchange + "\n";
      }
      fullPrompt += "\n";
    }
    
    fullPrompt += `User: ${message}\nZumaBot:`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    
    return text || "I'm here to help! What would you like to do on ZumaPay today?";
    
  } catch (error) {
    console.error('Gemini AI error:', error);
    return getFallbackResponse(message);
  }
}

// Fallback with typo handling
function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase().trim();
  
  // Common typos mapping
  const typos = {
    'withdaraw': 'withdraw',
    'withdral': 'withdraw',
    'withdrawl': 'withdraw',
    'depozit': 'deposit',
    'depozitt': 'deposit',
    'verifi': 'verify',
    'verif': 'verify',
    'verfication': 'verification',
    'convart': 'convert',
    'converting': 'convert',
    'conversion': 'convert',
    'converte': 'convert',
    'kyc': 'kyc',
    'kvc': 'kyc',
    'kys': 'kyc',
    'thank': 'thanks',
    'thanx': 'thanks',
    'thx': 'thanks',
    'tnx': 'thanks',
    'thaanks': 'thanks',
    'thannks': 'thanks',
    'thnks': 'thanks',
    'helo': 'hello',
    'hii': 'hi',
    'heyy': 'hey',
    'how r u': 'how are you',
    'hw r u': 'how are you',
    'howru': 'how are you',
    'hru': 'how are you',
  };

  // Check for typos first
  for (const [typo, correct] of Object.entries(typos)) {
    if (lowerMessage.includes(typo)) {
      // Replace the typo with correct word and process again
      const correctedMessage = lowerMessage.replace(typo, correct);
      return processCorrectedMessage(correctedMessage);
    }
  }

  return processCorrectedMessage(lowerMessage);
}

function processCorrectedMessage(message: string): string {
  
  // ===== GREETINGS =====
  if (message.match(/^(hi|hello|hey|howdy|greetings|sup|yo)$/)) {
    return "Hello! 👋 How can I help you with ZumaPay today?";
  }
  
  if (message.includes("how are you") || message.includes("how do you do")) {
    return "I'm doing great, thanks! 😊 Ready to help you with ZumaPay. What do you need?";
  }
  
  if (message.includes("good morning") || message.includes("good afternoon") || message.includes("good evening")) {
    return "Good day! 🌞 How can I assist you with ZumaPay today?";
  }
  
  // ===== DEPOSIT =====
  if (message.includes("deposit")) {
    if (message.includes("how")) {
      return "To deposit: Go to Dashboard → Deposit Crypto. Copy your address and send USDT from your wallet. The funds will appear in your balance after a few minutes.";
    }
    if (message.includes("time") || message.includes("how long")) {
      return "Deposits usually take a few minutes to appear in your balance.";
    }
    if (message.includes("fee") || message.includes("cost")) {
      return "Deposits are completely free! No charges for adding funds.";
    }
    if (message.includes("minimum") || message.includes("min")) {
      return "Minimum deposit is 10 USDT. You can deposit any amount above that.";
    }
    if (message.includes("address") || message.includes("where to send")) {
      return "Your deposit address is in Dashboard → Deposit Crypto. Make sure to copy the correct one for your network (TRC20 recommended).";
    }
    return "To deposit: Go to Dashboard → Deposit Crypto, copy your address, and send USDT from your wallet. It's free and takes a few minutes.";
  }
  
  // ===== WITHDRAW =====
  if (message.includes("withdraw")) {
    if (message.includes("how")) {
      return "To withdraw: Go to Withdraw Cash page. Enter the amount, select your bank, enter account number, and confirm. The money will be sent to your bank account instantly.";
    }
    if (message.includes("time") || message.includes("how long")) {
      return "Withdrawals are instant! The money will arrive in your bank account within minutes.";
    }
    if (message.includes("fee") || message.includes("cost")) {
      return "Withdrawal fee is 0.8%. For example, withdrawing ₦100,000 costs ₦800.";
    }
    if (message.includes("minimum") || message.includes("min")) {
      return "Minimum withdrawal is 10 USDT (about ₦15,000).";
    }
    if (message.includes("limit") || message.includes("maximum")) {
      return "Withdrawal limits depend on your KYC level. Complete verification in Profile to increase your limits.";
    }
    if (message.includes("bank") || message.includes("which banks")) {
      return "We support all Nigerian banks! You can select your bank from the list when withdrawing.";
    }
    return "To withdraw: Go to Withdraw Cash page, enter amount and bank details, and confirm. Funds arrive instantly.";
  }
  
  // ===== KYC / VERIFY =====
  if (message.includes("kyc") || message.includes("verify") || message.includes("verification")) {
    if (message.includes("how")) {
      return "To verify your account: Go to Profile → KYC Verification. Fill in your information and upload your documents. It takes 1-2 business days to approve.";
    }
    if (message.includes("time") || message.includes("how long")) {
      return "KYC verification usually takes 1-2 business days. You'll get a notification when it's approved.";
    }
    if (message.includes("document") || message.includes("need")) {
      return "You can use your International Passport, National ID, Driver's License, NIN, or BVN for verification.";
    }
    if (message.includes("level") || message.includes("tier") || message.includes("limit")) {
      return "Higher verification levels give you higher withdrawal limits. Complete KYC in Profile to increase your limits.";
    }
    return "Complete KYC in Profile → KYC Verification to increase your withdrawal limits. It takes 1-2 business days.";
  }
  
  // ===== BUY CRYPTO =====
  if (message.includes("buy") || message.includes("purchase")) {
    if (message.includes("how")) {
      return "To buy crypto: Go to Buy Crypto page. Enter how much Naira you want to spend and confirm. USDT will be added to your wallet instantly.";
    }
    if (message.includes("fee") || message.includes("cost")) {
      return "Buy fee is 0.8%. The amount you see includes the fee.";
    }
    return "Buy USDT with Naira on the Buy Crypto page. Enter amount and confirm – it's instant!";
  }
  
  // ===== CONVERT =====
  if (message.includes("convert")) {
    if (message.includes("how")) {
      return "To convert: Go to Convert page. Choose whether you want USDT → NGN or NGN → USDT, enter the amount, and confirm. It's instant!";
    }
    if (message.includes("rate") || message.includes("exchange rate")) {
      return "You'll see the current exchange rate on the Convert page before you confirm. Rates update live.";
    }
    if (message.includes("fee") || message.includes("cost")) {
      return "Conversion fee is 0.8%. The amount you'll receive is shown before you confirm.";
    }
    return "Convert between USDT and Naira on the Convert page. It's instant with 0.8% fee.";
  }
  
  // ===== FEES =====
  if (message.includes("fee") || message.includes("charge") || message.includes("cost")) {
    return "We charge 0.8% on conversions and withdrawals. Deposits are completely free!";
  }
  
  // ===== ACCOUNT / PROFILE =====
  if (message.includes("change password")) {
    return "To change your password: Go to Profile → Security → Change Password.";
  }
  if (message.includes("2fa") || message.includes("two factor")) {
    return "Enable 2FA in Profile → Security → Two-Factor Authentication for extra account security.";
  }
  if (message.includes("phone number")) {
    return "Add your phone number in Profile → Account → Phone Number for account recovery.";
  }
  if (message.includes("change name")) {
    return "To change your name: Go to Profile → Personal Information and click Edit.";
  }
  
  // ===== THANK YOU =====
  if (message.includes("thank") || message.includes("thanks")) {
    return "You're welcome! 😊 Anything else you need help with?";
  }
  
  // ===== BYE =====
  if (message.includes("bye") || message.includes("goodbye") || message.includes("see you")) {
    return "Goodbye! 👋 Thanks for using ZumaPay. Come back anytime!";
  }
  
  // ===== HELP / MENU =====
  if (message.includes("help") || message.includes("what can you do") || message.includes("menu")) {
    return "I can help you with:\n💰 How to deposit\n💸 How to withdraw\n✅ How to verify your account\n💱 How to convert\n💳 How to buy crypto\n🔐 Account security\n\nJust ask! 😊";
  }
  
  // ===== DEFAULT =====
  return "I can help you with deposits, withdrawals, KYC verification, conversions, and more! What would you like to do on ZumaPay today?";
}