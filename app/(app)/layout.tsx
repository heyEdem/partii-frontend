import { redirect } from 'next/navigation'
import { getAccessToken } from '@/lib/auth/tokens'
import { DesktopSidebar } from '@/components/layout/DesktopSidebar'
import { MobileTabBar } from '@/components/layout/MobileTabBar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const token = await getAccessToken()
  if (!token) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <DesktopSidebar />
      <main className="md:ml-60 pb-20 md:pb-0 min-h-screen">
        {children}
      </main>
      <MobileTabBar />
    </div>
  )
}
