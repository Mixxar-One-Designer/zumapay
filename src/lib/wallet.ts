// Update this function to generate different addresses per network
export function generateDepositAddress(userId: string, network: string) {
  // Base addresses for different networks
  const addresses = {
    TRC20: "TQ8k8j9a7e2B3F5Y1Kx7",
    ERC20: "0x7a8b3c9d2e1f4a5b6c7d",
    BEP20: "bnb1a2b3c4d5e6f7a8b9c0"
  };
  
  // Get the base for selected network
  const baseAddress = addresses[network as keyof typeof addresses] || addresses.TRC20;
  
  // Use last 4 chars of userId to make it unique per user
  const userSuffix = userId.substring(userId.length - 4);
  
  return {
    address: `${baseAddress}${userSuffix}`,
    network: network,
    qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${baseAddress}${userSuffix}`
  };
}