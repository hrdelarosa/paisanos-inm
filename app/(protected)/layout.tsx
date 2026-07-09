import AppSidebar from '@/src/components/sidebar/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/src/components/ui/sidebar'
import { auth } from '@/src/lib/auth'
import { SessionProvider } from '@/src/modules/login/context/session-context'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) redirect('/login')

  return (
    <SessionProvider user={session.user}>
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <div className="flex flex-1 flex-col gap-4 md:gap-6 p-4 md:p-6">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </SessionProvider>
  )
}
