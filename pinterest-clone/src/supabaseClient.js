import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cdplzstwdccxjydqcgqn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkcGx6c3R3ZGNjeGp5ZHFjZ3FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNjcxMDAsImV4cCI6MjA2Mzk0MzEwMH0.8UyDVd1Xd348a_dmUJT8TS8PTkvQHJlDH30Zaau6Kio';

export const supabase = createClient(supabaseUrl, supabaseKey);
