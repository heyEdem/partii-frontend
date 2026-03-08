import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from '@/lib/providers'
import { getAccessToken } from '@/lib/auth/tokens'
import { usersApi } from '@/lib/api/users'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Partii — Where the party plans itself',
  description: 'Plan and manage events with your crew. Split costs, coordinate contributions, and communicate in one place.',
}

export const viewport: Viewport = {
  themeColor: '#000000',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Try to prefetch current user for providers
  let initialUser = null
  try {
    const token = await getAccessToken()
    if (token) {
      initialUser = await usersApi.getMe({ token })
    }
  } catch {
    // Not authenticated, that's fine
  }

  return (
    <html lang="en" className={plusJakartaSans.variable} suppressHydrationWarning>
      <body className="bg-bg-primary text-text-primary font-sans antialiased">
        <Providers initialUser={initialUser}>{children}</Providers>
      </body>
    </html>
  )
}
