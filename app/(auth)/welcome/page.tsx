import Link from 'next/link'
import { GoogleLogo, GithubLogo } from '@phosphor-icons/react/dist/ssr'
import { VelvetButton } from '@/components/ui/VelvetButton'

export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center gap-8 py-12">
      {/* Logo */}
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-20 h-20 rounded-logo flex items-center justify-center text-3xl font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #9B8EC4, #FF8C42)' }}
        >
          P
        </div>
        <div className="text-center">
          <h1
            className="text-display font-bold"
            style={{
              background: 'linear-gradient(135deg, #9B8EC4, #FF8C42)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Partii
          </h1>
          <p className="text-body text-text-secondary mt-1">Where the party plans itself</p>
        </div>
      </div>

      {/* Primary auth actions */}
      <div className="w-full flex flex-col gap-3">
        <Link href="/signup" className="w-full">
          <VelvetButton variant="primary" className="w-full">
            Get Started
          </VelvetButton>
        </Link>
        <Link href="/login" className="w-full">
          <VelvetButton variant="secondary" className="w-full">
            Sign In
          </VelvetButton>
        </Link>
      </div>

      {/* Divider */}
      <div className="w-full flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-caption text-text-secondary">or continue with</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* OAuth */}
      <div className="w-full flex flex-col gap-3">
        <a
          href={`${process.env.NEXT_PUBLIC_API_URL ?? ''}/oauth2/authorization/google`}
          className="w-full"
        >
          <VelvetButton variant="ghost" className="w-full border border-border text-text-primary">
            <GoogleLogo weight="thin" size={20} />
            Continue with Google
          </VelvetButton>
        </a>
        <a
          href={`${process.env.NEXT_PUBLIC_API_URL ?? ''}/oauth2/authorization/github`}
          className="w-full"
        >
          <VelvetButton variant="ghost" className="w-full border border-border text-text-primary">
            <GithubLogo weight="thin" size={20} />
            Continue with GitHub
          </VelvetButton>
        </a>
      </div>

      {/* Disclaimer */}
      <p className="text-caption text-text-secondary text-center">
        By continuing, you agree to our{' '}
        <span className="text-accent-primary">Terms of Service</span> and{' '}
        <span className="text-accent-primary">Privacy Policy</span>.
        <br />
        You must be 18+ to use Partii.
      </p>
    </div>
  )
}
