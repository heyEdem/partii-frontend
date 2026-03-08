export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* PublicNav will go here in Phase 2 */}
      <main>{children}</main>
    </div>
  )
}
