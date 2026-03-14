import { NextResponse } from 'next/server';
import { sendFromTreasury } from '@/lib/treasuryWallet';

export async function POST(request: Request) {
  try {
    const { toAddress, amount } = await request.json();
    
    if (!toAddress || !amount) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 });
    }
    
    const result = await sendFromTreasury(toAddress, amount);
    return NextResponse.json(result);
    
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error?.message || 'Unknown error' 
    }, { status: 500 });
  }
}