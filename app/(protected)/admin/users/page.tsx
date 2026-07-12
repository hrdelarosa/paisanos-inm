'use client'

import { Badge } from '@/src/components/ui/badge'
import Actions from '@/src/modules/admin/users/components/Actions'
import DataTable from '@/src/components/DataTable'
import UserCreateDialog from '@/src/modules/admin/users/components/UserCreateDialog'
import { useAdminUsers } from '@/src/modules/admin/users/hooks/useAdminUsers'

export default function Users() {
  const { usersQuery } = useAdminUsers()
  const users = usersQuery.data || []

  return (
    <>
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Usuarios</h1>
          <p className="text-sm text-muted-foreground">
            Aquí puedes gestionar los usuarios del sistema, crear nuevos
            usuarios, editar los existentes, asignar roles y banear usuarios
            según sea necesario.
          </p>
        </div>

        <UserCreateDialog />
      </div>

      <DataTable
        items={users}
        isLoading={usersQuery.isLoading}
        emptyMessage="No se encontraron usuarios"
        getRowKey={(user) => user.id}
        columns={[
          {
            key: 'username',
            label: 'Usuario',
            render: (user) => user.username,
          },
          {
            key: 'fullName',
            label: 'Nombre',
            render: (user) => user.name,
          },
          {
            key: 'role',
            label: 'Rol',
            render: (user) => user.role,
          },
          {
            key: 'state',
            label: 'Estado',
            className: 'w-30',
            render: (user) => (
              <Badge variant={user.banned ? 'destructive' : 'default'}>
                {user.banned ? 'Bloqueado' : 'Activo'}
              </Badge>
            ),
          },
          {
            key: 'createdAt',
            label: 'Creado',
            render: (user) =>
              user.createdAt.toLocaleDateString('es-MX', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }),
          },
        ]}
        actions={{
          className: 'w-28',
          render: (user) => <Actions user={user} />,
        }}
      />
    </>
  )
}
