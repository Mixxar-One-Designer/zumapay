export function formatUSDT(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '0.00';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatNGN(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₦0.00';
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount).replace('NGN', '₦');
}

export function formatRate(rate: number): string {
  if (isNaN(rate) || rate === null || rate === undefined) return '0.00';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(rate);
}

export function formatCompact(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '0';
  if (amount >= 1_000_000) {
    return (amount / 1_000_000).toFixed(2) + 'M';
  }
  if (amount >= 1_000) {
    return (amount / 1_000).toFixed(2) + 'K';
  }
  return amount.toFixed(2);
}