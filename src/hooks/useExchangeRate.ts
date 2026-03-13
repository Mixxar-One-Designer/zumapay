'use client';

import { useState, useEffect } from 'react';

interface ExchangeRateData {
  rate: number;
  loading: boolean;
  error: string | null;
}

export function useExchangeRate(): ExchangeRateData {
  const [rate, setRate] = useState<number>(1600); // Default fallback
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        // Try Binance API first
        try {
          const binanceRes = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=USDTNGN');
          if (binanceRes.ok) {
            const binanceData = await binanceRes.json();
            setRate(parseFloat(binanceData.price));
            setLoading(false);
            return;
          }
        } catch (e) {
          console.log('Binance API failed, trying CoinGecko...');
        }

        // Try CoinGecko as backup
        try {
          const geckoRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=ngn');
          if (geckoRes.ok) {
            const geckoData = await geckoRes.json();
            setRate(geckoData.tether.ngn);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.log('CoinGecko API failed, using fallback rate...');
        }

        // If both fail, use fallback rate
        setRate(1600);
        setError('Using default rate');
        setLoading(false);
        
      } catch (err) {
        console.error('Error fetching rate:', err);
        setError('Failed to fetch rate');
        setRate(1600); // Fallback
        setLoading(false);
      }
    };

    fetchRate();
    
    // Refresh every 60 seconds
    const interval = setInterval(fetchRate, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return { rate, loading, error };
}