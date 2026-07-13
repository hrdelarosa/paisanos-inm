'use client'

import { useEffect, useState } from 'react'
import { UserPlus2Icon } from 'lucide-react'
import { createUserFormSchema } from '../schema/users.schema'
import { USER_ROLES, UserRole } from '@/src/constants/dominio'

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
import { useAdminUsers } from '../hooks/useUsers'
import { useModules } from '../../modules/hooks/useModules'

export default function UserCreateDialog() {
  const [open, setOpen] = useState(false)
  const { createUser } = useAdminUsers()
  const { modulesQuery } = useModules()
  const { register, handleSubmit, errors, reset, setValue, watch } =
    useValidatedForm({
      formSchema: createUserFormSchema,
      defaultValues: {
        name: '',
        username: '',
        role: 'capturista',
        password: '',
        moduleId: '',
      },
      onSubmit: (data) => {
        createUser.mutate(data, {
          onSuccess: () => {
            reset()
            setOpen(false)
          },
        })
      },
    })
  const selectedRole = watch('role') as UserRole
  const selectedRoleLabel = USER_ROLES[selectedRole]
  const selectedModuleId = watch('moduleId')
  const modules = modulesQuery.data || []
  const selectedModuleLabel =
    modules.find((module) => module.id === selectedModuleId)?.name ?? ''

  useEffect(() => {
    if (selectedRole !== 'capturista' && selectedModuleId) {
      setValue('moduleId', '', {
        shouldDirty: true,
        shouldValidate: true,
      })
    }
  }, [selectedModuleId, selectedRole, setValue])

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)

        if (!nextOpen) {
          reset()
        }
      }}
    >
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
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              <FieldError
                className="text-destructive"
                role="alert"
                id="name-error"
              >
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
                aria-describedby={
                  errors.username ? 'username-error' : undefined
                }
              />
              <FieldError
                className="text-destructive"
                role="alert"
                id="username-error"
              >
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

                    if (value !== 'capturista') {
                      setValue('moduleId', '', {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  }}
                >
                  <SelectTrigger
                    id="role"
                    className="w-full"
                    aria-invalid={!!errors.role}
                    aria-describedby={errors.role ? 'role-error' : undefined}
                  >
                    {selectedRoleLabel ? (
                      <span className="truncate">{selectedRoleLabel}</span>
                    ) : (
                      <SelectValue placeholder="Selecciona un rol" />
                    )}
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {Object.entries(USER_ROLES).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <FieldError
                  className="text-destructive"
                  role="alert"
                  id="role-error"
                >
                  {errors.role?.message}
                </FieldError>
              </Field>
            </FieldGroup>

            {selectedRole === 'capturista' && (
              <Field className="gap-1.5">
                <FieldLabel htmlFor="moduleId">Módulo</FieldLabel>

                <Select
                  value={selectedModuleId ?? ''}
                  onValueChange={(value) => {
                    if (!value) return

                    setValue('moduleId', value, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }}
                  disabled={modulesQuery.isLoading}
                >
                  <SelectTrigger
                    id="moduleId"
                    className="w-full"
                    aria-invalid={!!errors.moduleId}
                    aria-describedby={
                      errors.moduleId ? 'moduleId-error' : undefined
                    }
                  >
                    {selectedModuleLabel ? (
                      <span className="truncate">{selectedModuleLabel}</span>
                    ) : (
                      <SelectValue
                        placeholder={
                          modulesQuery.isLoading
                            ? 'Cargando módulos...'
                            : 'Selecciona un módulo'
                        }
                      />
                    )}
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {modules.map((module) => (
                        <SelectItem key={module.id} value={module.id}>
                          {module.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <FieldError
                  className="text-destructive"
                  role="alert"
                  id="moduleId-error"
                >
                  {errors.moduleId?.message}
                </FieldError>
              </Field>
            )}
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
