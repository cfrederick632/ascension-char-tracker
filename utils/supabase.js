import { createClient } from '@supabase/supabase-js';

// Fallback to empty string to prevent build-time instantiation crashes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const calculateBracket = (level) => {
  if (level < 10) return 'Under 10';
  const lowerBound = Math.floor(level / 10) * 10;
  const upperBound = lowerBound + 9;
  return `${lowerBound}-${upperBound}`;
};