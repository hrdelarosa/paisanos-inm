import { usePathname } from 'next/navigation'

export function useActiveRoute() {
  const pathname = usePathname()
  const isActive = (path: string) => pathname === path

  return { isActive }
}
