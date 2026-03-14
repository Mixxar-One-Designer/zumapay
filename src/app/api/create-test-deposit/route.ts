import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Get first user from database
    const { data: users } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (!users || users.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'No users found' 
      }, { status: 404 });
    }

    const userId = users[0].id;

    // Create a test transaction
    const { data, error } = await supabase
      .from('crypto_transactions')
      .insert({
        user_id: userId,
        amount: 50.00,
        status: 'pending',
        confirmations: 0,
        tx_hash: 'test_tx_' + Date.now(),
        from_address: 'TTestAddress123',
        to_address: 'TUserAddress456',
        network: 'TRC20'
      })
      .select();

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      message: 'Test transaction created',
      transaction: data 
    });
    
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error?.message || 'Unknown error' 
    }, { status: 500 });
  }
}