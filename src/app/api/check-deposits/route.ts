import { NextResponse } from 'next/server';
import { scanForDeposits } from '@/lib/realBlockchainListener';

export async function GET() {
  try {
    console.log('🚀 Starting real deposit scan...');
    
    // Call the blockchain scanner
    await scanForDeposits();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Real deposit check completed',
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('❌ Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error?.message || 'Unknown error occurred' 
    }, { status: 500 });
  }
}