import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const calculateBracket = (level) => {
  const numericLevel = parseInt(level, 10);
  
  if (isNaN(numericLevel) || numericLevel < 10) return '10-19';
  if (numericLevel >= 60) return '60-60'; // Matches dropdown bracket

  const lowerBound = Math.floor(numericLevel / 10) * 10;
  const upperBound = lowerBound + 9;
  return `${lowerBound}-${upperBound}`;
};