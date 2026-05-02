interface SkeletonProps {
  variant?: 'card' | 'text' | 'circle' | 'row'
  className?: string
}

function Base({ className = '' }: { className?: string }) {
  return (
    <div
      className={`bg-gradient-to-r from-[#1A1A1A] via-[#222222] to-[#1A1A1A] bg-[length:200%_100%] animate-shimmer rounded ${className}`}
    />
  )
}

export default function Skeleton({ variant = 'text', className }: SkeletonProps) {
  if (variant === 'card') {
    return (
      <div className="bg-[#111111] border border-[#222222] rounded-xl p-5 space-y-3">
        <Base className="h-4 w-2/3" />
        <Base className="h-3 w-1/2" />
        <div className="flex gap-2 mt-4">
          {[0, 1, 2].map(i => <Base key={i} className="h-8 w-8 rounded-full" />)}
        </div>
        <Base className="h-6 w-full mt-2" />
        <Base className="h-10 w-full mt-1" />
      </div>
    )
  }
  if (variant === 'circle') return <Base className={`rounded-full ${className}`} />
  if (variant === 'row') {
    return (
      <div className="flex items-center gap-3 py-3">
        <Base className="h-8 w-8 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Base className="h-3 w-1/3" />
          <Base className="h-3 w-1/2" />
        </div>
        <Base className="h-4 w-16" />
      </div>
    )
  }
  return <Base className={`h-4 ${className}`} />
}
