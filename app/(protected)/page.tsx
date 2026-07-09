'use client'

import { Button } from '@/src/components/ui/button'
import { useAuth } from '@/src/modules/login/hooks/useAuth'
import { useSession } from '@/src/modules/login/hooks/useSession'
import Image from 'next/image'

export default function Home() {
  const { user } = useSession()
  const { logout } = useAuth()

  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans dark:bg-black">
      <span>
        Hola, {user?.name} ({user?.role})
      </span>
      <Button onClick={logout}>Cerrar sesión</Button>
      <p className="text-2xl text-muted-foreground font-semibold">
        Pruba de texto
      </p>
      {/* <Image
        src="/paisanos-logo.webp"
        alt="Logo del Programa Heroínas y Héroes Paisanos"
        width={150}
        height={50}
        className="h-auto w-full"
        unoptimized
      /> */}
    </div>
  )
}
