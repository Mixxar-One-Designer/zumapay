// This file is deprecated. Wallet generation is handled by walletGenerator.ts
// Keeping this as a placeholder to prevent import errors

export function generateAddressForUser(userId: string) {
  console.warn('walletService is deprecated. Use walletGenerator instead.');
  return {
    address: `TQ8k8j9a7e2B3F5Y1Kx7${userId.slice(-4)}`,
    network: 'TRC20'
  };
}