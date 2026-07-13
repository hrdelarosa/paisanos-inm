'use client'

import { useState } from 'react'
import { EllipsisVerticalIcon, Trash2Icon } from 'lucide-react'

import { Button } from '@/src/components/ui/button'
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

interface Props {
  canDeleted?: boolean
  children?: React.ReactNode
}

export default function Actions({ canDeleted = false, children }: Props) {
  const [alertOpen, setAlertOpen] = useState(false)

  const removeUserHandler = () => {
    console.log('removeUserHandler called')
    // removeUser.mutate(user.id, {
    //   onSuccess: () => {
    //     setAlertOpen(false)
    //   },
    // })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          nativeButton
          render={
            <Button variant="outline" size="icon-sm">
              <span className="sr-only">Abrir acciones</span>
              <EllipsisVerticalIcon />
            </Button>
          }
        />
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            {children}
          </DropdownMenuGroup>
          {canDeleted && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setAlertOpen(true)}
                // disabled={currentUser?.id === user.id}
              >
                <Trash2Icon />
                Eliminar
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {canDeleted && (
        <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                <Trash2Icon />
              </AlertDialogMedia>
              <AlertDialogTitle>¿Eliminar registro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Esto eliminará permanentemente
                el registro.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel
                variant="outline"
                // disabled={removeUser.isPending}
              >
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={removeUserHandler}
                // disabled={removeUser.isPending}
              >
                {/* {removeUser.isPending ? <SpinnerCustom /> : 'Eliminar'} */}
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}
