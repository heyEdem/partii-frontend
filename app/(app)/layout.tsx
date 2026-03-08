import { redirect } from 'next/navigation'
import { getAccessToken } from '@/lib/auth/tokens'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const token = await getAccessToken()
  if (!token) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* DesktopSidebar will go here in Phase 2 */}
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      {/* MobileTabBar will go here in Phase 2 */}
    </div>
  )
}
