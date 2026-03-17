import { supabase } from './supabase';

// We'll use REST API instead of TronWeb
const TRONGRID_API = 'https://api.trongrid.io';
const USDT_CONTRACT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';

let lastCheckedBlock = 0;

export async function checkRealDeposits() {
  console.log('🔍 Checking for real USDT deposits...');
  
  try {
    // Get all user wallet addresses
    const { data: wallets } = await supabase
      .from('user_wallets')
      .select('user_id, trc20_address');
    
    if (!wallets || wallets.length === 0) {
      console.log('❌ No user wallets found');
      return { success: true, message: 'No wallets found' };
    }

    console.log(`👥 Monitoring ${wallets.length} wallet addresses`);
    
    // For now, we'll just return success
    // In production, you would need to scan blocks using TronGrid API
    // This requires more complex implementation with pagination
    
    return { 
      success: true, 
      walletsChecked: wallets.length,
      message: 'Deposit check completed (mock mode)'
    };
    
  } catch (error) {
    console.error('❌ Error checking deposits:', error);
    return { success: false, error };
  }
}

export async function confirmRealDeposits() {
  console.log('🔍 Checking confirmations...');
  
  try {
    // Get pending transactions
    const { data: pendingTxs } = await supabase
      .from('crypto_transactions')
      .select('*')
      .eq('status', 'pending');
    
    if (!pendingTxs || pendingTxs.length === 0) {
      console.log('No pending transactions');
      return { success: true, message: 'No pending transactions' };
    }

    console.log(`📊 Found ${pendingTxs.length} pending transactions`);

    // For mock/test transactions, increment confirmations
    for (const tx of pendingTxs) {
      if (tx.tx_hash.startsWith('test_tx_')) {
        const newConfirmations = (tx.confirmations || 0) + 1;
        
        await supabase
          .from('crypto_transactions')
          .update({ confirmations: newConfirmations })
          .eq('id', tx.id);
        
        if (newConfirmations >= 20) {
          console.log(`💰 Crediting ${tx.amount} USDT to user ${tx.user_id} (test transaction)`);
          
          await supabase.rpc('increment_balance', {
            user_id: tx.user_id,
            amount: tx.amount
          });
          
          // Mark as completed
          await supabase
            .from('crypto_transactions')
            .update({ status: 'completed' })
            .eq('id', tx.id);
            
          // CREATE NOTIFICATION FOR DEPOSIT
          await supabase
            .from('notifications')
            .insert({
              user_id: tx.user_id,
              title: 'Deposit Received',
              message: `${tx.amount} USDT has been credited to your account`,
              read: false
            });
            
          console.log(`📨 Notification created for user ${tx.user_id}`);
        }
      }
    }
    
    return { success: true, processed: pendingTxs.length };
    
  } catch (error) {
    console.error('❌ Error confirming deposits:', error);
    return { success: false, error };
  }
}

export async function scanForDeposits() {
  console.log('🚀 Starting deposit scan...');
  
  const depositsResult = await checkRealDeposits();
  const confirmResult = await confirmRealDeposits();
  
  return {
    deposits: depositsResult,
    confirmations: confirmResult
  };
}