'use client'

import DataTable from '@/src/components/DataTable'
import { Badge } from '@/src/components/ui/badge'
import { useAttentionTypes } from '@/src/modules/admin/attention-types/hooks/useAttentionTypes'

export default function AttentionConcepts() {
  const { attentionTypesQuery } = useAttentionTypes()
  const attentionTypes = attentionTypesQuery.data || []

  return (
    <>
      <div className="mb-2">
        <h1 className="text-2xl font-bold">Conceptos de atención</h1>
        <p className="text-sm text-muted-foreground">
          Catálogo basado en el formato físico de cierre de jornada.
        </p>
      </div>

      <DataTable
        items={attentionTypes}
        isLoading={attentionTypesQuery.isLoading}
        emptyMessage="No hay conceptos registrados. Ejecuta el seed de conceptos."
        getRowKey={(type) => type.id}
        columns={[
          {
            key: 'code',
            label: 'Código',
            className: 'w-24',
            render: (type) => type.code,
          },
          {
            key: 'name',
            label: 'Concepto',
            className: 'max-w-[200px] truncate md:w-full',
            render: (type) => type.name,
          },
          {
            key: 'requiresDescription',
            label: 'Requiere descripción',
            className: 'w-47',
            render: (type) => (type.requiresDescription ? 'Sí' : 'No'),
          },
          {
            key: 'isActive',
            label: 'Estado',
            className: 'w-27',
            render: (type) => (
              <Badge variant={type.isActive ? 'default' : 'secondary'}>
                {type.isActive ? 'Inactivo' : 'Inactivo'}
              </Badge>
            ),
          },
        ]}
      />
    </>
  )
}
