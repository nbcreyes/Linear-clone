function SkeletonLine({ width = 'w-full', height = 'h-3' }) {
  return (
    <div
      className={`${width} ${height} bg-[#242424] rounded animate-pulse`}
    />
  )
}

export function IssueRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-[#2e2e2e]">
      <SkeletonLine width="w-12" height="h-3" />
      <SkeletonLine width="w-16" height="h-3" />
      <SkeletonLine width="w-full" height="h-3" />
      <SkeletonLine width="w-20" height="h-3" />
      <div className="w-5 h-5 rounded-full bg-[#242424] animate-pulse flex-shrink-0" />
    </div>
  )
}

export function IssueDetailSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
      <SkeletonLine width="w-2/3" height="h-8" />
      <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg p-4 space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <SkeletonLine width="w-24" height="h-3" />
            <SkeletonLine width="w-32" height="h-3" />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <SkeletonLine width="w-24" height="h-3" />
        <SkeletonLine width="w-full" height="h-3" />
        <SkeletonLine width="w-full" height="h-3" />
        <SkeletonLine width="w-3/4" height="h-3" />
      </div>
    </div>
  )
}

export function WorkspaceListSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-3 py-2.5 rounded bg-[#242424] animate-pulse"
        >
          <div className="w-7 h-7 rounded bg-[#2e2e2e] flex-shrink-0" />
          <div className="space-y-1.5 flex-1">
            <SkeletonLine width="w-32" height="h-3" />
            <SkeletonLine width="w-20" height="h-2" />
          </div>
        </div>
      ))}
    </div>
  )
}