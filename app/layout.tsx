import './globals.css'

import { headers } from 'next/headers'
import { Toaster } from 'sonner'
import type { Metadata } from 'next'
import { geistSans, roboto, inter } from '@/src/config/fonts'
import { cn } from '@/src/lib/utils'
import { auth } from '@/src/lib/auth'
import Providers from './providers'

export const metadata: Metadata = {
  title:
    'Sistema de Registro de Atenciones | Programa Heroínas y Héroes Paisanos',
  description:
    'Sistema institucional para el registro, seguimiento y consolidación de las atenciones realizadas en los módulos del Programa Héroes Paisanos del Instituto Nacional de Migración.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth.api.getSession({ headers: await headers() })

  return (
    <html
      lang="en"
      className={cn(
        'h-full',
        'antialiased',
        geistSans.variable,
        roboto.variable,
        'font-sans',
        inter.variable,
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers user={session?.user ?? null}>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </Providers>
      </body>
    </html>
  )
}
