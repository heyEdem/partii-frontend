export default function RootLoading() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-12 h-12 rounded-logo flex items-center justify-center text-xl font-bold text-white animate-pulse-ring"
          style={{ background: 'linear-gradient(135deg, #9B8EC4, #FF8C42)' }}
        >
          P
        </div>
        <span className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  )
}
