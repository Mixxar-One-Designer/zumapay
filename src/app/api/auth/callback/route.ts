import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  console.log('🔐 Auth callback received')
  console.log('Code present:', code ? '✅ Yes' : '❌ No')
  console.log('Full URL:', request.url)

  if (code) {
    try {
      const cookieStore = await cookies()
      
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            async get(name: string) {
              const cookieStore = await cookies()
              return cookieStore.get(name)?.value
            },
            async set(name: string, value: string, options: any) {
              const cookieStore = await cookies()
              cookieStore.set({ 
                name, 
                value, 
                ...options,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
              })
            },
            async remove(name: string, options: any) {
              const cookieStore = await cookies()
              cookieStore.set({ 
                name, 
                value: '', 
                ...options,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
              })
            },
          },
        }
      )
      
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      console.log('Session exchange result:', { 
        success: !!data.session,
        userId: data.session?.user?.id,
        error: error?.message || 'None'
      })
      
      if (error) {
        console.error('Exchange error:', error.message)
        throw error
      }
      
    } catch (error: any) {
      console.error('Callback error:', error.message)
      // Redirect to login with error
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
      return NextResponse.redirect(new URL('/?error=auth_failed', baseUrl))
    }
  }

  // Get the base URL from environment or request
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

  console.log('✅ Auth successful, redirecting to dashboard')
  
  // Successful auth - redirect to dashboard
  return NextResponse.redirect(new URL('/dashboard', baseUrl))
}