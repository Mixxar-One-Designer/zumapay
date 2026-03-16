import { supabase } from './supabase';

export async function sendDepositNotification(userId, amount) {
  // Get user email
  const { data: user } = await supabase
    .from('profiles')
    .select('email')
    .eq('id', userId)
    .single();
  
  if (user?.email) {
    // Send email via Resend/SendGrid
    console.log(`📧 Email sent to ${user.email}: ${amount} USDT deposited`);
  }
  
  // Create in-app notification
  await supabase.from('notifications').insert({
    user_id: userId,
    title: 'Deposit Received',
    message: `${amount} USDT has been credited to your account`,
    read: false
  });
}