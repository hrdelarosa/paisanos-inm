import { Skeleton } from './ui/skeleton'

export function SkeletonTable() {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="grid grid-cols-[1fr_2fr_1fr_1fr_2fr_0.7fr] gap-2">
        <Skeleton className="h-12" />
        <Skeleton className="h-12" />
        <Skeleton className="h-12" />
        <Skeleton className="h-12" />
        <Skeleton className="h-12" />
        <Skeleton className="h-12" />
      </div>

      {Array.from({ length: 7 }).map((_, index) => (
        <div
          className="grid grid-cols-[1fr_2fr_1fr_1fr_2fr_0.7fr] gap-2"
          key={index}
        >
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      ))}
    </div>
  )
}
