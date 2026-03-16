'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface ExchangeRateData {
  rate: number;
  percentChange: number;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  source: string;
}

const API_SOURCES = [
  {
    name: 'BingX',
    url: 'https://open-api.bingx.com/open/api/spot/v1/ticker/price?symbol=USDT-NGN',
    parser: (data: any) => parseFloat(data.data.price)
  },
  {
    name: 'Gate.com',
    url: 'https://api.gateio.ws/api/v4/spot/tickers?currency_pair=USDT_NGN',
    parser: (data: any) => parseFloat(data[0].last)
  },
  {
    name: 'Curvert',
    url: 'https://api.curvert.com/v1/rate?from=USDT&to=NGN',
    parser: (data: any) => data.rate
  }
];

const FALLBACK_RATE = 1377;

export function useExchangeRate(): ExchangeRateData {
  const [rate, setRate] = useState<number>(FALLBACK_RATE);
  const [percentChange, setPercentChange] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [source, setSource] = useState<string>('fallback');
  
  // Store the previous rate for change calculation
  const previousRateRef = useRef<number>(FALLBACK_RATE);

  const fetchRate = useCallback(async () => {
    for (const api of API_SOURCES) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(api.url, { 
          signal: controller.signal,
          headers: { 'Accept': 'application/json' }
        });
        clearTimeout(timeoutId);
        
        if (!response.ok) continue;
        
        const data = await response.json();
        const fetchedRate = api.parser(data);
        
        if (fetchedRate && fetchedRate > 1000 && fetchedRate < 2000) {
          // Calculate change from previous rate
          const change = ((fetchedRate - previousRateRef.current) / previousRateRef.current) * 100;
          
          setRate(fetchedRate);
          setPercentChange(change);
          setError(null);
          setLastUpdated(new Date());
          setSource(api.name);
          setLoading(false);
          
          // Update previous rate for next comparison
          previousRateRef.current = fetchedRate;
          
          console.log(`✅ Rate: ₦${fetchedRate} (${change > 0 ? '+' : ''}${change.toFixed(2)}%)`);
          return;
        }
      } catch (err) {
        console.log(`⚠️ ${api.name} failed`);
        continue;
      }
    }

    // Fallback with small random change (only every 30 seconds, not every render)
    const randomChange = (Math.random() * 2 - 1) * 0.5;
    const newRate = FALLBACK_RATE * (1 + randomChange / 100);
    
    setRate(newRate);
    setPercentChange(randomChange);
    setError('Using estimated rate');
    setLastUpdated(new Date());
    setSource('estimated');
    setLoading(false);
    
    previousRateRef.current = newRate;
    
  }, []); // Empty dependency array - only created once

  useEffect(() => {
    fetchRate();
    const intervalId = setInterval(fetchRate, 30000); // 30 seconds
    return () => clearInterval(intervalId);
  }, [fetchRate]); // Only depends on fetchRate which is stable

  return { rate, percentChange, loading, error, lastUpdated, source };
}