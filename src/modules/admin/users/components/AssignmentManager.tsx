'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@/src/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/dialog'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select'
import { toDateOnlyInputValue } from '@/src/lib/dateOnly'
import {
  closeAssignmentAction,
  createAssignmentAction,
} from '../actions/assignments.actions'

interface Option {
  id: string
  name: string
}

interface AssignmentManagerProps {
  userId: string
  modules: Option[]
  operatives: Option[]
}

export function AssignmentCreateDialog({
  userId,
  modules,
  operatives,
}: AssignmentManagerProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [moduleId, setModuleId] = useState('')
  const [operativeId, setOperativeId] = useState('')
  const [startDate, setStartDate] = useState(toDateOnlyInputValue())
  const [isPending, setIsPending] = useState(false)

  async function submit() {
    setIsPending(true)
    const result = await createAssignmentAction({
      userId,
      moduleId,
      operativeId: operativeId || undefined,
      startDate,
    })
    setIsPending(false)

    if (!result.success) {
      toast.error(result.error)
      return
    }

    toast.success('Asignación creada correctamente')
    setOpen(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>Asignar módulo</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Asignar módulo</DialogTitle>
          <DialogDescription>
            Registra una asignación formal para este usuario.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="assignment-module">Módulo</Label>
            <Select
              value={moduleId}
              onValueChange={(value) => setModuleId(value ?? '')}
            >
              <SelectTrigger id="assignment-module" className="w-full">
                <SelectValue placeholder="Selecciona módulo" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {modules.map((module) => (
                    <SelectItem key={module.id} value={module.id}>
                      {module.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="assignment-operative">Operativo</Label>
            <Select
              value={operativeId}
              onValueChange={(value) => setOperativeId(value ?? '')}
            >
              <SelectTrigger id="assignment-operative" className="w-full">
                <SelectValue placeholder="Sin operativo específico" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {operatives.map((operative) => (
                    <SelectItem key={operative.id} value={operative.id}>
                      {operative.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="assignment-start">Fecha de inicio</Label>
            <Input
              id="assignment-start"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            disabled={isPending || !moduleId || !startDate}
            onClick={submit}
          >
            {isPending ? 'Guardando...' : 'Guardar asignación'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function CloseAssignmentButton({
  assignmentId,
}: {
  assignmentId: string
}) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  async function close() {
    setIsPending(true)
    const result = await closeAssignmentAction({
      assignmentId,
      endDate: toDateOnlyInputValue(),
    })
    setIsPending(false)

    if (!result.success) {
      toast.error(result.error)
      return
    }

    toast.success('Asignación cerrada correctamente')
    router.refresh()
  }

  return (
    <Button type="button" variant="outline" disabled={isPending} onClick={close}>
      {isPending ? 'Cerrando...' : 'Cerrar'}
    </Button>
  )
}
