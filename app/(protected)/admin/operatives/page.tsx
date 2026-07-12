'use client'

import Link from 'next/link'
import { InfoIcon, PowerIcon, PowerOffIcon } from 'lucide-react'
import { OPERATIVE_SEASONS } from '@/src/constants/dominio'
import { formatDate } from '@/src/lib/format'

import { DropdownMenuItem } from '@/src/components/ui/dropdown-menu'
import DataTable from '@/src/components/DataTable'
import Actions from '@/src/components/Actions'
import StatusBadge from '@/src/components/status-badge'
import OperativeCreateDialog from '@/src/modules/admin/operatives/components/OperativeCreateDialog'
import { useOperatives } from '@/src/modules/admin/operatives/hooks/useOperatives'

export default function Operatives() {
  const { operativesQuery, toggleOperativeStatus } = useOperatives()
  const operatives = operativesQuery.data || []

  return (
    <>
      <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Operativos</h1>
          <p className="text-sm text-muted-foreground">
            Administra las temporadas del Programa Héroes Paisanos.
          </p>
        </div>

        <OperativeCreateDialog />
      </div>

      <DataTable
        items={operatives}
        isLoading={operativesQuery.isLoading}
        emptyMessage="No hay operativos registrados"
        getRowKey={(operative) => operative.id}
        columns={[
          {
            key: 'name',
            label: 'Nombre',
            render: (operative) => operative.name,
          },
          {
            key: 'season',
            label: 'Temporada',
            render: (operative) => OPERATIVE_SEASONS[operative.season],
          },
          { key: 'year', label: 'Año', render: (operative) => operative.year },
          {
            key: 'startDate',
            label: 'Inicio',
            render: (operative) => formatDate(operative.startDate),
          },
          {
            key: 'endDate',
            label: 'Fin',
            render: (operative) => formatDate(operative.endDate),
          },
          {
            key: 'isActive',
            label: 'Estado',
            className: 'w-28',
            render: (operative) => (
              <StatusBadge isActive={operative.isActive} />
            ),
          },
        ]}
        actions={{
          className: 'w-28',
          render: (operative) => (
            <Actions>
              <DropdownMenuItem
                render={
                  <Link href={`/admin/operatives/${operative.id}`}>
                    <InfoIcon /> Detalles
                  </Link>
                }
              />
              <DropdownMenuItem
                onClick={() =>
                  toggleOperativeStatus.mutate({
                    id: operative.id,
                    isActive: !operative.isActive,
                  })
                }
                variant={operative.isActive ? 'destructive' : 'default'}
              >
                {operative.isActive ? (
                  <>
                    <PowerOffIcon />
                    Desactivar
                  </>
                ) : (
                  <>
                    <PowerIcon />
                    Activar
                  </>
                )}
              </DropdownMenuItem>
            </Actions>
          ),
        }}
      />
    </>
  )
}
