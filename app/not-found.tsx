import Link from 'next/link'

import { Button } from '@/src/components/ui/button'

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center p-6">
      <div className="grid max-w-md gap-3 text-center">
        <h1 className="text-3xl font-bold">No se encontró la página</h1>
        <p className="text-sm text-muted-foreground">
          El recurso solicitado no existe o ya no está disponible.
        </p>
        <Button render={<Link href="/" />}>Volver al inicio</Button>
      </div>
    </main>
  )
}
