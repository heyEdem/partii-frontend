import Link from 'next/link'

export function PublicNav() {
  return (
    <header className="sticky top-0 z-30 bg-bg-elevated/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-content mx-auto px-4 md:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2" aria-label="Partii home">
          <div className="w-8 h-8 rounded-logo bg-avatar-gradient flex items-center justify-center">
            <span className="text-black font-bold text-sm">P</span>
          </div>
          <span
            className="text-lg font-bold"
            style={{ background: 'linear-gradient(135deg, #9B8EC4, #FF8C42)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            Partii
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/search"
            className="text-body-medium text-text-secondary hover:text-text-primary transition-colors px-4 py-2"
          >
            Explore
          </Link>
          <Link
            href="/login"
            className="text-body-medium text-accent-primary border border-accent-primary px-4 py-2 rounded-button hover:bg-accent-primary/15 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-body-medium font-semibold text-black bg-accent-action px-4 py-2 rounded-button hover:shadow-orange-glow hover:-translate-y-px transition-all active:scale-95"
          >
            Get started
          </Link>
        </nav>
      </div>
    </header>
  )
}
