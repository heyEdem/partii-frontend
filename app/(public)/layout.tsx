import { PublicNav } from '@/components/layout/PublicNav'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-primary">
      <PublicNav />
      <main>{children}</main>
    </div>
  )
}
