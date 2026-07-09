'use client'

import { useState } from 'react'
import { UserPlus2Icon } from 'lucide-react'
import {
  CreateUserFormInput,
  createUserFormSchema,
} from '../schema/users.schema'
import { USER_ROLES } from '../types/users.types'

import { Input } from '@/src/components/ui/input'
import { Button } from '@/src/components/ui/button'
import { PasswordInput } from '@/src/modules/login/components/ui/password-input'
import { SpinnerCustom } from '@/src/components/ui/spinner'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/src/components/ui/field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/dialog'
import { useValidatedForm } from '@/src/modules/login/hooks/useValidatedForm'
import { useAdminUsers } from '../hooks/useAdminUsers'

export default function UserCreateDialog() {
  const [open, setOpen] = useState(false)
  const { createUser } = useAdminUsers()
  const { register, handleSubmit, errors, reset, setValue, watch } =
    useValidatedForm({
      formSchema: createUserFormSchema,
      defaultValues: {
        name: '',
        username: '',
        role: '',
        password: '',
      },
      onSubmit: (data) => {
        createUser.mutate(data as CreateUserFormInput, {
          onSuccess: () => {
            reset()
            setOpen(false)
          },
        })
      },
    })
  const selectedRole = watch('role')

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="lg">
            <UserPlus2Icon />
            Crear usuario
          </Button>
        }
      />

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Crear usuario</DialogTitle>
          <DialogDescription>
            Complete los campos para crear un nuevo usuario.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldGroup className="gap-3.5">
            <Field className="gap-1.5">
              <FieldLabel htmlFor="name">Nombre</FieldLabel>
              <Input
                {...register('name')}
                id="name"
                type="text"
                autoComplete="name"
                autoFocus
                aria-invalid={!!errors.name}
              />
              <FieldError className="text-destructive">
                {errors.name?.message}
              </FieldError>
            </Field>

            <Field className="gap-1.5">
              <FieldLabel htmlFor="username">Nombre de usuario</FieldLabel>
              <Input
                {...register('username')}
                id="username"
                type="text"
                autoComplete="username"
                aria-invalid={!!errors.username}
              />
              <FieldError className="text-destructive">
                {errors.username?.message}
              </FieldError>
            </Field>

            <FieldGroup className="grid grid-cols-2 gap-2">
              <PasswordInput
                {...register('password')}
                id="password"
                label="Contraseña"
                error={errors.password?.message}
                autoComplete="current-password"
              />

              <Field className="gap-1.5">
                <FieldLabel htmlFor="role">Rol</FieldLabel>

                <Select
                  value={selectedRole ?? ''}
                  onValueChange={(value) => {
                    if (!value) return

                    setValue('role', value, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }}
                >
                  <SelectTrigger
                    id="role"
                    className="w-full"
                    aria-invalid={!!errors.role}
                  >
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {Object.entries(USER_ROLES).map(([, value]) => (
                        <SelectItem key={value} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <FieldError className="text-destructive">
                  {errors.role?.message}
                </FieldError>
              </Field>
            </FieldGroup>
          </FieldGroup>

          <DialogFooter className="mt-8">
            <DialogClose
              render={
                <Button variant="outline" disabled={createUser.isPending}>
                  Cancelar
                </Button>
              }
            />
            <Button type="submit" disabled={createUser.isPending}>
              {createUser.isPending ? <SpinnerCustom /> : 'Guardar usuario'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
