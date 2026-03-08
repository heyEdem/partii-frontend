'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { House, MagnifyingGlass, CalendarBlank, User, Plus } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

const tabs = [
  { href: '/dashboard', icon: House, label: 'Home' },
  { href: '/search', icon: MagnifyingGlass, label: 'Search' },
  { href: '/events/new', icon: null, label: '' }, // Create — special treatment
  { href: '/dashboard?tab=events', icon: CalendarBlank, label: 'Events' },
  { href: '/profile', icon: User, label: 'Profile' },
]

export function MobileTabBar() {
  const pathname = usePathname()

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-bg-elevated border-t border-border backdrop-blur-xl"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Mobile navigation"
    >
      <div className="flex items-end justify-around px-2 pt-2 pb-1">
        {tabs.map(({ href, icon: Icon, label }, i) => {
          const isCreate = i === 2
          const isActive = !isCreate && (pathname === href || pathname.startsWith(href.split('?')[0] + '/'))

          if (isCreate) {
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center -mt-4 px-3"
                aria-label="Create event"
              >
                <span className="w-11 h-11 rounded-full bg-accent-action flex items-center justify-center shadow-orange-glow-sm active:scale-95 transition-transform">
                  <Plus size={22} weight="bold" className="text-black" aria-hidden="true" />
                </span>
              </Link>
            )
          }

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1 transition-colors',
                isActive ? 'text-accent-action' : 'text-text-secondary',
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              {Icon && <Icon size={24} weight={isActive ? 'fill' : 'thin'} aria-hidden="true" />}
              {label && <span className="text-[10px] font-medium">{label}</span>}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
