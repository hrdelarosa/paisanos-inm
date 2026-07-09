'use client'

import { useState } from 'react'
import {
  EllipsisVerticalIcon,
  InfoIcon,
  Trash2Icon,
  UserRoundPenIcon,
} from 'lucide-react'
import { User } from '@/src/modules/login/types/user.types'

import { Button } from '@/src/components/ui/button'
import { SpinnerCustom } from '@/src/components/ui/spinner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/src/components/ui/alert-dialog'
import { useSession } from '@/src/modules/login/hooks/useSession'
import { useAdminUsers } from '../hooks/useAdminUsers'

interface Props {
  user: User
  isDeleted?: boolean
}

export default function Actions({ user, isDeleted = true }: Props) {
  const [alertOpen, setAlertOpen] = useState(false)
  const { removeUser, toggleBanUser } = useAdminUsers()
  const { user: currentUser } = useSession()

  const removeUserHandler = () => {
    removeUser.mutate(user.id, {
      onSuccess: () => {
        setAlertOpen(false)
      },
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          nativeButton
          render={
            <Button variant="outline">
              <EllipsisVerticalIcon />
            </Button>
          }
        />
        <DropdownMenuContent className="w-40" align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>

            <DropdownMenuItem>
              <InfoIcon /> Detalles
            </DropdownMenuItem>
            <DropdownMenuItem>
              <UserRoundPenIcon /> Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => toggleBanUser.mutate(user)}
              disabled={currentUser?.id === user.id || toggleBanUser.isPending}
            >
              Banear
            </DropdownMenuItem>
            <DropdownMenuItem disabled={currentUser?.id === user.id}>
              Revocar sesiones
            </DropdownMenuItem>
          </DropdownMenuGroup>
          {isDeleted && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setAlertOpen(true)}
                disabled={currentUser?.id === user.id}
              >
                <Trash2Icon />
                Eliminar
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              <Trash2Icon />
            </AlertDialogMedia>
            <AlertDialogTitle>Eliminar usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente a
              el usuario.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              variant="outline"
              disabled={removeUser.isPending}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={removeUserHandler}
              disabled={removeUser.isPending}
            >
              {removeUser.isPending ? <SpinnerCustom /> : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
