import { SessionProvider } from '@/src/modules/login/context/session-context'
import type { User } from '@/src/modules/login/types/user.types'

interface Props {
  children: React.ReactNode
  user: User | null
}

export default function Providers({ children, user }: Props) {
  return <SessionProvider user={user}>{children}</SessionProvider>
}
