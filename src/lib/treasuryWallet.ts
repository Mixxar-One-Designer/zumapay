import { supabase } from './supabase';

// USDT TRC20 contract address
export const USDT_CONTRACT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';

// TronGrid API base URL
const TRONGRID_API = 'https://api.trongrid.io';

export async function getTreasuryBalance() {
  try {
    const address = process.env.TREASURY_WALLET_ADDRESS;
    
    if (!address) {
      throw new Error('Treasury wallet address not configured');
    }

    // Query TRC20 token balance
    const response = await fetch(
      `${TRONGRID_API}/v1/accounts/${address}`,
      {
        headers: {
          'TRON-PRO-API-KEY': process.env.TRONGRID_API_KEY || '',
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`TronGrid API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Find USDT balance in the account's trc20 array
    let usdtBalance = 0;
    
    if (data.data && data.data[0] && data.data[0].trc20) {
      const trc20Balances = data.data[0].trc20;
      for (const token of trc20Balances) {
        if (token[USDT_CONTRACT]) {
          // USDT has 6 decimals
          usdtBalance = Number(token[USDT_CONTRACT]) / 1_000_000;
          break;
        }
      }
    }

    return {
      success: true,
      address,
      balance: usdtBalance
    };
    
  } catch (error: any) {
    console.error('Error getting treasury balance:', error);
    return { 
      success: false, 
      error: error?.message || 'Unknown error' 
    };
  }
}

export async function sendFromTreasury(toAddress: string, amount: number) {
  // Note: For security reasons, we cannot send transactions from the browser.
  // This would need to be done on a secure backend server with the private key.
  // For now, we'll return a message explaining this.
  
  return {
    success: false,
    error: 'Sending transactions requires a secure backend implementation with private key. This is not available in the browser for security reasons.'
  };
}

export async function getTreasuryTransactions(limit = 20) {
  try {
    const address = process.env.TREASURY_WALLET_ADDRESS;
    
    if (!address) {
      throw new Error('Treasury wallet address not configured');
    }

    // Get recent transactions
    const response = await fetch(
      `${TRONGRID_API}/v1/accounts/${address}/transactions?limit=${limit}&only_confirmed=true`,
      {
        headers: {
          'TRON-PRO-API-KEY': process.env.TRONGRID_API_KEY || '',
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`TronGrid API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Filter for USDT transfers
    const usdtTransfers = (data.data || [])
      .filter((tx: any) => {
        const contract = tx.raw_data?.contract[0]?.parameter?.value?.contract_address;
        return contract === USDT_CONTRACT;
      })
      .map((tx: any) => {
        // Parse amount from transaction data
        const dataHex = tx.raw_data?.contract[0]?.parameter?.value?.data || '';
        let amount = 0;
        
        // USDT transfer data format: a9059cbb + recipient(32 bytes) + amount(32 bytes)
        if (dataHex.startsWith('a9059cbb') && dataHex.length >= 144) {
          const amountHex = dataHex.substring(72, 136);
          amount = parseInt(amountHex, 16) / 1_000_000;
        }
        
        return {
          txID: tx.txID,
          amount,
          to_address: tx.raw_data?.contract[0]?.parameter?.value?.to_address || '',
          from_address: tx.raw_data?.contract[0]?.parameter?.value?.owner_address || '',
          timestamp: tx.block_timestamp,
        };
      });

    return {
      success: true,
      transactions: usdtTransfers,
      count: usdtTransfers.length
    };
    
  } catch (error: any) {
    console.error('Error getting treasury transactions:', error);
    return { 
      success: false, 
      error: error?.message || 'Unknown error' 
    };
  }
}