// TronWeb integration is temporarily disabled
// We're using REST API directly instead

/*
import TronWeb from 'tronweb';

// Initialize TronWeb with proper typing
let tronWebInstance: any = null;

export function getTronWeb() {
  if (!tronWebInstance) {
    const HttpProvider = TronWeb.providers.HttpProvider;
    const fullNode = new HttpProvider('https://api.trongrid.io');
    const solidityNode = new HttpProvider('https://api.trongrid.io');
    const eventServer = 'https://api.trongrid.io';
    
    tronWebInstance = new TronWeb(
      fullNode,
      solidityNode,
      eventServer,
      process.env.TREASURY_PRIVATE_KEY
    );
    
    // Set API key if provided
    if (process.env.TRONGRID_API_KEY) {
      tronWebInstance.setHeader('TRON-PRO-API-KEY', process.env.TRONGRID_API_KEY);
    }
  }
  
  return tronWebInstance;
}

// USDT TRC20 contract address
export const USDT_CONTRACT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
*/