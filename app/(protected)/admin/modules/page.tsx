'use client'

import { useState } from 'react'
import DataTable from '@/src/components/DataTable'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/src/components/ui/dialog'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select'
import { MODULE_TYPES, ModuleType } from '@/src/modules/domain/constants'
import { useModules } from '@/src/modules/admin/modules/hooks/useModules'
import { useValidatedForm } from '@/src/modules/login/hooks/useValidatedForm'
import { createModuleFormSchema, CreateModuleFormInput } from '@/src/modules/admin/modules/schema/modules.schema'
import { MapPinPlusIcon } from 'lucide-react'

export default function Modules() {
  const [open, setOpen] = useState(false)
  const { modulesQuery, createModule, toggleModuleStatus } = useModules()
  const modules = modulesQuery.data || []
  const { register, handleSubmit, errors, reset, setValue, watch } =
    useValidatedForm({
      formSchema: createModuleFormSchema,
      defaultValues: {
        name: '',
        type: 'airport',
        location: '',
        municipality: '',
        state: 'Guerrero',
      },
      onSubmit: (data) => {
        createModule.mutate(data as CreateModuleFormInput, {
          onSuccess: () => {
            reset()
            setOpen(false)
          },
        })
      },
    })
  const selectedType = watch('type') as ModuleType

  return (
    <>
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Módulos</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona los puntos físicos donde se capturan atenciones del
            operativo.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button size="lg"><MapPinPlusIcon />Crear módulo</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear módulo</DialogTitle>
              <DialogDescription>Registra un nuevo punto de atención.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-3">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" {...register('name')} aria-invalid={!!errors.name} />
              <p className="text-sm text-destructive">{errors.name?.message}</p>
              <Label htmlFor="type">Tipo</Label>
              <Select value={selectedType} onValueChange={(value) => value && setValue('type', value as ModuleType, { shouldDirty: true, shouldValidate: true })}>
                <SelectTrigger id="type" className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent><SelectGroup>{Object.entries(MODULE_TYPES).map(([key, label]) => <SelectItem key={key} value={key}>{label}</SelectItem>)}</SelectGroup></SelectContent>
              </Select>
              <Label htmlFor="location">Ubicación</Label>
              <Input id="location" {...register('location')} aria-invalid={!!errors.location} />
              <p className="text-sm text-destructive">{errors.location?.message}</p>
              <Label htmlFor="municipality">Municipio</Label>
              <Input id="municipality" {...register('municipality')} aria-invalid={!!errors.municipality} />
              <p className="text-sm text-destructive">{errors.municipality?.message}</p>
              <Label htmlFor="state">Estado</Label>
              <Input id="state" {...register('state')} aria-invalid={!!errors.state} />
              <p className="text-sm text-destructive">{errors.state?.message}</p>
              <DialogFooter className="mt-3">
                <Button type="submit" disabled={createModule.isPending}>Guardar módulo</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        items={modules}
        isLoading={modulesQuery.isLoading}
        emptyMessage="No hay módulos registrados"
        getRowKey={(module) => module.id}
        columns={[
          { key: 'name', label: 'Nombre', render: (module) => module.name },
          { key: 'type', label: 'Tipo', render: (module) => MODULE_TYPES[module.type] },
          { key: 'location', label: 'Ubicación', render: (module) => module.location },
          { key: 'municipality', label: 'Municipio', render: (module) => module.municipality },
          { key: 'state', label: 'Estado', render: (module) => module.state },
          { key: 'isActive', label: 'Activo', render: (module) => <Badge variant={module.isActive ? 'default' : 'secondary'}>{module.isActive ? 'Activo' : 'Inactivo'}</Badge> },
        ]}
        actions={{ render: (module) => <Button variant="outline" onClick={() => toggleModuleStatus.mutate({ id: module.id, isActive: !module.isActive })}>{module.isActive ? 'Desactivar' : 'Activar'}</Button> }}
      />
    </>
  )
}
