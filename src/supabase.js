import { createClient } from '@supabase/supabase-js'

const options = {
    schema: 'public',
    headers: { 'x-my-custom-header': 'you2live' },
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
}
export const supabase = createClient("https://xqcrijhmvpiqqgjltumo.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxY3JpamhtdnBpcXFnamx0dW1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTc5NTU4NDcsImV4cCI6MTk3MzUzMTg0N30.ti2zfjv70j5WP8e8XrnvqBO9IWmqN7F0eGNJly34A_o", options)