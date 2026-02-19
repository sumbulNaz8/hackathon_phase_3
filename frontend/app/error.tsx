'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-amber-50">
      <div className="text-center p-8 glass-card max-w-md">
        <h1 className="text-4xl font-black text-amber-900 mb-4">Something went wrong</h1>
        <p className="text-amber-700 mb-6">{error.message || 'An error occurred'}</p>
        <button
          onClick={reset}
          className="btn-primary"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
