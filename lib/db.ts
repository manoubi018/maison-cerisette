function getRequiredEnv(name: string) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing ${name} in .env.local`)
  }
  return value
}

function getFirstAvailableEnv(names: string[]) {
  for (const name of names) {
    const value = process.env[name]
    if (value) {
      return value
    }
  }

  throw new Error(`Missing one of ${names.join(", ")} in .env.local`)
}

const supabaseUrl: string = getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL")
const supabasePublishableKey: string = getFirstAvailableEnv([
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
])
const supabaseServerKey: string = getFirstAvailableEnv([
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
])

export { supabaseUrl, supabasePublishableKey, supabaseServerKey }
