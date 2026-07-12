'use client'

import Link from 'next/link'
import { InfoIcon, PowerIcon, PowerOffIcon } from 'lucide-react'
import { MODULE_TYPES } from '@/src/constants/dominio'

import { DropdownMenuItem } from '@/src/components/ui/dropdown-menu'
import Actions from '@/src/components/Actions'
import DataTable from '@/src/components/DataTable'
import StatusBadge from '@/src/components/status-badge'
import ModuleCreateDialog from '@/src/modules/admin/modules/components/ModuleCreateDialog'
import { useModules } from '@/src/modules/admin/modules/hooks/useModules'

export default function Modules() {
  const { modulesQuery, toggleModuleStatus } = useModules()
  const modules = modulesQuery.data || []

  return (
    <>
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Módulos</h1>
          <p className="text-sm text-muted-foreground ">
            Gestiona los puntos físicos donde se capturan atenciones del
            operativo.
          </p>
        </div>

        <ModuleCreateDialog />
      </div>

      <DataTable
        items={modules}
        isLoading={modulesQuery.isLoading}
        emptyMessage="No hay módulos registrados"
        getRowKey={(module) => module.id}
        columns={[
          { key: 'name', label: 'Nombre', render: (module) => module.name },
          {
            key: 'type',
            label: 'Tipo',
            render: (module) => MODULE_TYPES[module.type],
          },
          {
            key: 'location',
            label: 'Ubicación',
            className: 'max-w-[200px] truncate',
            render: (module) => module.location,
          },
          {
            key: 'municipality',
            label: 'Municipio',
            render: (module) => module.municipality,
          },
          { key: 'state', label: 'Estado', render: (module) => module.state },
          {
            key: 'isActive',
            label: 'Activo',
            className: 'w-28',
            render: (module) => <StatusBadge isActive={module.isActive} />,
          },
        ]}
        actions={{
          className: 'w-28',
          render: (module) => (
            <Actions>
              <DropdownMenuItem
                render={
                  <Link href={`/admin/modules/${module.id}`}>
                    <InfoIcon /> Detalles
                  </Link>
                }
              />
              <DropdownMenuItem
                onClick={() =>
                  toggleModuleStatus.mutate({
                    id: module.id,
                    isActive: !module.isActive,
                  })
                }
                variant={module.isActive ? 'destructive' : 'default'}
              >
                {module.isActive ? (
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
