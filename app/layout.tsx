import './globals.css'

import { geistSans, roboto, inter } from '@/src/config/fonts'
import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import { cn } from '@/src/lib/utils'
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
        <Providers>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </Providers>
      </body>
    </html>
  )
}
