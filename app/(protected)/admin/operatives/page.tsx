'use client'

import { useState } from 'react'
import DataTable from '@/src/components/DataTable'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/src/components/ui/dialog'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select'
import { formatDate } from '@/src/lib/format'
import { OPERATIVE_SEASONS, OperativeSeason } from '@/src/modules/domain/constants'
import { useOperatives } from '@/src/modules/admin/operatives/hooks/useOperatives'
import { useValidatedForm } from '@/src/modules/login/hooks/useValidatedForm'
import { createOperativeFormSchema, CreateOperativeFormInput } from '@/src/modules/admin/operatives/schema/operatives.schema'
import { MilestoneIcon } from 'lucide-react'

export default function Operatives() {
  const [open, setOpen] = useState(false)
  const { operativesQuery, createOperative, toggleOperativeStatus } = useOperatives()
  const operatives = operativesQuery.data || []
  const { register, handleSubmit, errors, reset, setValue, watch } =
    useValidatedForm({
      formSchema: createOperativeFormSchema,
      defaultValues: {
        name: '',
        season: 'holy_week',
        year: new Date().getFullYear(),
        startDate: '',
        endDate: '',
      },
      onSubmit: (data) => {
        createOperative.mutate(data as CreateOperativeFormInput, {
          onSuccess: () => {
            reset()
            setOpen(false)
          },
        })
      },
    })
  const selectedSeason = watch('season') as OperativeSeason

  return <>
    <div className="mb-2 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Operativos</h1>
        <p className="text-sm text-muted-foreground">Administra las temporadas del Programa Héroes Paisanos.</p>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button size="lg"><MilestoneIcon />Crear operativo</Button>} />
        <DialogContent>
          <DialogHeader><DialogTitle>Crear operativo</DialogTitle><DialogDescription>Define una temporada de captura.</DialogDescription></DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-3">
            <Label htmlFor="name">Nombre</Label><Input id="name" {...register('name')} placeholder="Verano 2026" aria-invalid={!!errors.name} /><p className="text-sm text-destructive">{errors.name?.message}</p>
            <Label htmlFor="season">Temporada</Label>
            <Select value={selectedSeason} onValueChange={(value) => value && setValue('season', value as OperativeSeason, { shouldDirty: true, shouldValidate: true })}><SelectTrigger id="season" className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{Object.entries(OPERATIVE_SEASONS).map(([key, label]) => <SelectItem key={key} value={key}>{label}</SelectItem>)}</SelectGroup></SelectContent></Select>
            <Label htmlFor="year">Año</Label><Input id="year" {...register('year')} type="number" aria-invalid={!!errors.year} /><p className="text-sm text-destructive">{errors.year?.message}</p>
            <Label htmlFor="startDate">Inicio</Label><Input id="startDate" {...register('startDate')} type="date" aria-invalid={!!errors.startDate} /><p className="text-sm text-destructive">{errors.startDate?.message}</p>
            <Label htmlFor="endDate">Fin</Label><Input id="endDate" {...register('endDate')} type="date" aria-invalid={!!errors.endDate} /><p className="text-sm text-destructive">{errors.endDate?.message}</p>
            <DialogFooter className="mt-3"><Button type="submit" disabled={createOperative.isPending}>Guardar operativo</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
    <DataTable
      items={operatives}
      isLoading={operativesQuery.isLoading}
      emptyMessage="No hay operativos registrados"
      getRowKey={(operative) => operative.id}
      columns={[
        { key: 'name', label: 'Nombre', render: (operative) => operative.name },
        { key: 'season', label: 'Temporada', render: (operative) => OPERATIVE_SEASONS[operative.season] },
        { key: 'year', label: 'Año', render: (operative) => operative.year },
        { key: 'startDate', label: 'Inicio', render: (operative) => formatDate(operative.startDate) },
        { key: 'endDate', label: 'Fin', render: (operative) => formatDate(operative.endDate) },
        { key: 'isActive', label: 'Estado', render: (operative) => <Badge variant={operative.isActive ? 'default' : 'secondary'}>{operative.isActive ? 'Activo' : 'Inactivo'}</Badge> },
      ]}
      actions={{ render: (operative) => <Button variant="outline" onClick={() => toggleOperativeStatus.mutate({ id: operative.id, isActive: !operative.isActive })}>{operative.isActive ? 'Desactivar' : 'Activar'}</Button> }}
    />
  </>
}
