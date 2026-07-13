import { Skeleton } from '@/src/components/ui/skeleton'

export default function ProtectedLoading() {
  return (
    <div aria-busy="true" className="grid gap-4">
      <Skeleton className="h-10 w-72" />
      <Skeleton className="h-48 w-full rounded-4xl" />
      <Skeleton className="h-64 w-full rounded-4xl" />
    </div>
  )
}
