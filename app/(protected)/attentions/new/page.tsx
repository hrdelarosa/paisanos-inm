'use client'

import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select'
import { Textarea } from '@/src/components/ui/textarea'
import { useAttentionTypes } from '@/src/modules/admin/attention-types/hooks/useAttentionTypes'
import { useModules } from '@/src/modules/admin/modules/hooks/useModules'
import { useOperatives } from '@/src/modules/admin/operatives/hooks/useOperatives'
import { useAttentionReports } from '@/src/modules/attentions/hooks/useAttentionReports'
import { useValidatedForm } from '@/src/modules/login/hooks/useValidatedForm'
import { createAttentionReportFormSchema, CreateAttentionReportFormInput } from '@/src/modules/attentions/schema/attentions.schema'
import { toDateOnlyInputValue } from '@/src/lib/dateOnly'

export default function NewAttentionReport() {
  const { attentionTypesQuery } = useAttentionTypes()
  const { modulesQuery } = useModules()
  const { operativesQuery } = useOperatives()
  const { createReport } = useAttentionReports()
  const { register, handleSubmit, errors, setValue, watch } = useValidatedForm({
    formSchema: createAttentionReportFormSchema,
    defaultValues: {
      operativeId: '',
      moduleId: '',
      reportDate: toDateOnlyInputValue(),
      notes: '',
      items: {},
    },
    onSubmit: (data) => {
      const input = data as CreateAttentionReportFormInput

      createReport.mutate({
        operativeId: input.operativeId,
        moduleId: input.moduleId,
        reportDate: input.reportDate,
        notes: input.notes,
        items: Object.entries(input.items).map(([attentionTypeId, item]) => ({
          attentionTypeId,
          quantity: item.quantity,
          description: item.description,
        })),
      })
    },
  })

  const attentionTypes = attentionTypesQuery.data?.filter((type) => type.isActive) || []
  const modules = modulesQuery.data?.filter((module) => module.isActive) || []
  const operatives = operativesQuery.data?.filter((operative) => operative.isActive) || []
  const operativeId = watch('operativeId')
  const moduleId = watch('moduleId')

  return <form onSubmit={handleSubmit} className="grid gap-4">
    <div>
      <h1 className="text-2xl font-bold">Nuevo reporte de atención</h1>
      <p className="text-sm text-muted-foreground">Captura las cantidades del formato al cierre de jornada.</p>
    </div>

    <Card>
      <CardHeader><CardTitle>Datos generales</CardTitle></CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <div className="grid gap-2">
          <Label>Operativo</Label>
          <Select value={operativeId} onValueChange={(value) => value && setValue('operativeId', value, { shouldDirty: true, shouldValidate: true })}><SelectTrigger className="w-full" aria-invalid={!!errors.operativeId}><SelectValue placeholder="Selecciona operativo" /></SelectTrigger><SelectContent><SelectGroup>{operatives.map((operative) => <SelectItem key={operative.id} value={operative.id}>{operative.name}</SelectItem>)}</SelectGroup></SelectContent></Select>
          <p className="text-sm text-destructive">{errors.operativeId?.message}</p>
        </div>
        <div className="grid gap-2">
          <Label>Módulo</Label>
          <Select value={moduleId} onValueChange={(value) => value && setValue('moduleId', value, { shouldDirty: true, shouldValidate: true })}><SelectTrigger className="w-full" aria-invalid={!!errors.moduleId}><SelectValue placeholder="Selecciona módulo" /></SelectTrigger><SelectContent><SelectGroup>{modules.map((module) => <SelectItem key={module.id} value={module.id}>{module.name}</SelectItem>)}</SelectGroup></SelectContent></Select>
          <p className="text-sm text-destructive">{errors.moduleId?.message}</p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="reportDate">Fecha</Label>
          <Input id="reportDate" type="date" {...register('reportDate')} aria-invalid={!!errors.reportDate} />
          <p className="text-sm text-destructive">{errors.reportDate?.message}</p>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>Conceptos del formato</CardTitle></CardHeader>
      <CardContent className="grid gap-3">
        {attentionTypes.map((type) => <div key={type.id} className="grid gap-2 rounded-3xl border bg-white/60 p-3 md:grid-cols-[1fr_140px] md:items-center">
          <div>
            <p className="font-medium">{type.code}. {type.name}</p>
            {type.requiresDescription && <Input className="mt-2" placeholder="Especifica cuál" {...register(`items.${type.id}.description`)} />}
          </div>
          <Input type="number" min={0} {...register(`items.${type.id}.quantity`)} placeholder="0" />
        </div>)}
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>Notas</CardTitle></CardHeader>
      <CardContent><Textarea {...register('notes')} placeholder="Observaciones generales del reporte" /></CardContent>
    </Card>

    <div className="flex justify-end">
      <Button type="submit" size="lg" disabled={!operativeId || !moduleId || createReport.isPending}>Guardar reporte</Button>
    </div>
  </form>
}
