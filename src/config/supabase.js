import { createClient } from '@supabase/supabase-js'

// Supabase configuration
// TODO: Replace these with your actual Supabase project URL and anon key
// Get these from: https://app.supabase.com → Your Project → Settings → API
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

// #region agent log
fetch('http://127.0.0.1:7242/ingest/0d0ecb30-d292-41a4-8076-aaa48e196c12',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabase.js:6',message:'Supabase config loaded',data:{hasUrl:!!supabaseUrl,urlLength:supabaseUrl?.length,urlContainsXezy:supabaseUrl?.includes('xezy'),hasKey:!!supabaseAnonKey,keyLength:supabaseAnonKey?.length,keyStartsWithEy:supabaseAnonKey?.startsWith('eyJ')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
// #endregion

if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL') {
  console.warn('⚠️ VITE_SUPABASE_URL is not set. Please set it in your .env file')
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/0d0ecb30-d292-41a4-8076-aaa48e196c12',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabase.js:10',message:'Supabase URL missing',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
  // #endregion
}

if (!supabaseAnonKey || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
  console.warn('⚠️ VITE_SUPABASE_ANON_KEY is not set. Please set it in your .env file')
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/0d0ecb30-d292-41a4-8076-aaa48e196c12',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabase.js:14',message:'Supabase key missing',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
  // #endregion
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// #region agent log
fetch('http://127.0.0.1:7242/ingest/0d0ecb30-d292-41a4-8076-aaa48e196c12',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabase.js:23',message:'Supabase client created',data:{url:supabaseUrl?.substring(0,50)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
// #endregion

