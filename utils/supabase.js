import { createClient } from '@supabase/supabase-js';

// You will get these from your Supabase project settings
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Utility function to calculate the BG bracket
export const calculateBracket = (level) => {
  if (level < 10) return 'Under 10';
  const lowerBound = Math.floor(level / 10) * 10;
  const upperBound = lowerBound + 9;
  return `${lowerBound}-${upperBound}`;
};