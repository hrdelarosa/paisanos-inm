'use client'

import { Button } from '@/src/components/ui/button'

export default function ProtectedError({ reset }: { reset: () => void }) {
  return (
    <div className="grid gap-3 rounded-4xl border p-6">
      <h2 className="text-xl font-semibold">No se pudo cargar la información</h2>
      <p className="text-sm text-muted-foreground">
        Intenta nuevamente. Si el problema continúa, revisa tu sesión o conexión.
      </p>
      <div>
        <Button onClick={reset}>Reintentar</Button>
      </div>
    </div>
  )
}
