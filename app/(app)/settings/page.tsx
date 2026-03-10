'use client'

import {
  User,
  Bell,
  ShieldCheck,
  SignOut,
  ArrowRight,
} from '@phosphor-icons/react'
import Link from 'next/link'
import { useAuth } from '@/lib/hooks/useAuth'
import { VelvetButton } from '@/components/ui/VelvetButton'

interface SettingsItem {
  icon: React.ReactNode
  label: string
  href?: string
  onClick?: () => void
  description: string
  destructive?: boolean
}

export default function SettingsPage() {
  const { user, logout } = useAuth()

  const items: SettingsItem[] = [
    {
      icon: <User weight="thin" size={22} />,
      label: 'Edit Profile',
      href: '/profile/edit',
      description: 'Update your name, bio, and picture',
    },
    {
      icon: <Bell weight="thin" size={22} />,
      label: 'Notifications',
      href: '/settings',
      description: 'Manage notification preferences',
    },
    {
      icon: <ShieldCheck weight="thin" size={22} />,
      label: 'Privacy & Security',
      href: '/settings',
      description: 'Account privacy and security options',
    },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-8">
      <h1 className="text-display text-text-primary mb-2">Settings</h1>
      {user && (
        <p className="text-body text-text-secondary mb-8">{user.email}</p>
      )}

      {/* Settings list */}
      <div className="flex flex-col gap-2 mb-8">
        {items.map((item) => {
          const content = (
            <div className="flex items-center justify-between bg-bg-elevated rounded-card p-4 hover:bg-bg-surface transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-button bg-bg-surface flex items-center justify-center text-accent-primary flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-body-medium text-text-primary">{item.label}</p>
                  <p className="text-caption text-text-secondary">{item.description}</p>
                </div>
              </div>
              <ArrowRight weight="thin" size={18} className="text-text-secondary flex-shrink-0" />
            </div>
          )

          if (item.href) {
            return (
              <Link key={item.label} href={item.href}>
                {content}
              </Link>
            )
          }

          return (
            <button key={item.label} onClick={item.onClick} className="text-left">
              {content}
            </button>
          )
        })}
      </div>

      {/* Logout */}
      <div className="border-t border-border pt-6">
        <VelvetButton variant="destructive" className="w-full" onClick={logout}>
          <SignOut weight="thin" size={18} />
          Sign Out
        </VelvetButton>
      </div>

      {/* App info */}
      <p className="text-caption text-text-secondary text-center mt-8">
        Partii v1.0.0
      </p>
    </div>
  )
}
