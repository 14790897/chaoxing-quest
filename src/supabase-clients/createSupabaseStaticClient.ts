import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types'


// 从环境变量中获取 Supabase URL 和匿名公钥
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 创建 Supabase 客户端实例
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: fetch.bind(window),
  },
  auth: {
    persistSession: true,
  },
})