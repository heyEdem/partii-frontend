'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  House,
  MagnifyingGlass,
  CalendarBlank,
  User,
  Gear,
  Bell,
  Plus,
} from '@phosphor-icons/react'
import { useAuth } from '@/lib/hooks/useAuth'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', icon: House, label: 'Home' },
  { href: '/search', icon: MagnifyingGlass, label: 'Search' },
  { href: '/notifications', icon: Bell, label: 'Notifications' },
  { href: '/profile', icon: User, label: 'Profile' },
  { href: '/settings', icon: Gear, label: 'Settings' },
]

export function DesktopSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <aside
      className="hidden md:flex flex-col w-60 min-h-screen bg-bg-elevated border-r border-border fixed left-0 top-0 z-30"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6">
        <div
          className="w-10 h-10 rounded-logo flex items-center justify-center bg-avatar-gradient"
          aria-hidden="true"
        >
          <span className="text-black font-bold text-base leading-none">P</span>
        </div>
        <span
          className="text-[22px] font-bold text-gradient"
          style={{ background: 'linear-gradient(135deg, #9B8EC4, #FF8C42)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          Partii
        </span>
      </div>

      {/* Create button */}
      <div className="px-3 mb-2">
        <Link
          href="/events/new"
          className="flex items-center gap-3 w-full px-4 py-3 rounded-button bg-accent-action text-black font-semibold text-body-medium transition-all hover:shadow-orange-glow hover:-translate-y-px active:scale-95"
        >
          <Plus size={18} weight="bold" aria-hidden="true" />
          Create Event
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-button text-body-medium transition-colors relative',
                isActive
                  ? 'text-accent-primary bg-accent-primary/15'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface',
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-accent-primary rounded-r-full"
                  aria-hidden="true"
                />
              )}
              <Icon size={20} weight="thin" aria-hidden="true" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User card */}
      {user && (
        <button
          onClick={logout}
          className="mx-3 mb-4 flex items-center gap-3 px-4 py-3 rounded-button hover:bg-bg-surface transition-colors text-left group"
          aria-label="Account options"
        >
          <div className="w-10 h-10 rounded-avatar overflow-hidden flex-shrink-0">
            {user.profilePictureUrl ? (
              <img src={user.profilePictureUrl} alt={user.displayName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-avatar-gradient flex items-center justify-center">
                <span className="text-black font-semibold text-sm">
                  {user.displayName.slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-body-medium text-text-primary truncate">{user.displayName}</p>
            {user.generalLocation && (
              <p className="text-caption text-text-secondary truncate">{user.generalLocation}</p>
            )}
          </div>
        </button>
      )}
    </aside>
  )
}
