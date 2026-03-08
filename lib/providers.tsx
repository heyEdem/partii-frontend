'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState, ReactNode } from 'react'
import { AuthProvider } from '@/lib/hooks/useAuth'
import { ToastProvider } from '@/lib/hooks/useToast'
import { ToastContainer } from '@/components/ui/ToastContainer'
import { UserProfileResponse } from '@/types'

export function Providers({ children, initialUser }: { children: ReactNode; initialUser?: UserProfileResponse | null }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider initialUser={initialUser}>
        <ToastProvider>
          {children}
          <ToastContainer />
        </ToastProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
