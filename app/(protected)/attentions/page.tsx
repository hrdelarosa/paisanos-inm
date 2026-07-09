import { Button } from '@/src/components/ui/button'
import { ClipboardPlusIcon } from 'lucide-react'
import Link from 'next/link'

export default function Attentions() {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Atenciones</h1>
          <p className="text-sm text-muted-foreground">
            Listado de atenciones registradas en el sistema
          </p>
        </div>

        <Link href="/attentions/new">
          <Button size="lg">
            <ClipboardPlusIcon />
            Crear atención
          </Button>
        </Link>
      </div>
    </div>
  )
}
