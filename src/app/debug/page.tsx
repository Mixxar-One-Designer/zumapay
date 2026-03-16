'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DebugPage() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Debug Session</h1>
      <pre className="bg-gray-800 p-4 rounded text-white">
        {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  );
}