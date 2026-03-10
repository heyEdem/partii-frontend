import Link from 'next/link'
import { VelvetButton } from '@/components/ui/VelvetButton'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1
          className="text-[80px] font-bold leading-none mb-4"
          style={{
            background: 'linear-gradient(135deg, #9B8EC4, #FF8C42)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          404
        </h1>
        <h2 className="text-h1 text-text-primary mb-2">Page not found</h2>
        <p className="text-body text-text-secondary mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <VelvetButton variant="primary">Go Home</VelvetButton>
          </Link>
          <Link href="/dashboard">
            <VelvetButton variant="secondary">Dashboard</VelvetButton>
          </Link>
        </div>
      </div>
    </div>
  )
}
