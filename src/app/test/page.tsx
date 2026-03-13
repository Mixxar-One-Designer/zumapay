'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestPage() {
  useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error:', error);
      } else {
        console.log('Supabase connected!', data);
      }
    }
    testConnection();
  }, []);

  return (
    <div className="text-white p-8">
      <h1 className="text-2xl">Supabase Test</h1>
      <p>Check the browser console (F12) for results</p>
    </div>
  );
}