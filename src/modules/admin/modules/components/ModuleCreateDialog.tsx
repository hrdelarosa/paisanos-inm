'use client'

import { useState } from 'react'
import { MapPinPlusIcon } from 'lucide-react'
import { CreateModuleInput } from '../types/modules.types'
import { createModuleFormSchema } from '../schema/modules.schema'
import { MODULE_TYPES, ModuleType } from '@/src/constants/dominio'

import { Input } from '@/src/components/ui/input'
import { Button } from '@/src/components/ui/button'
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
import { useModules } from '../hooks/useModules'
import { useValidatedForm } from '@/src/modules/login/hooks/useValidatedForm'

export default function ModuleCreateDialog() {
  const [open, setOpen] = useState(false)
  const { createModule } = useModules()
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
        createModule.mutate(data as CreateModuleInput)
        reset()
        setOpen(false)
      },
    })
  const selectedType = watch('type') as ModuleType
  const selectedTypeLabel = MODULE_TYPES[selectedType]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="lg">
            <MapPinPlusIcon />
            Crear módulo
          </Button>
        }
      />

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Crear módulo</DialogTitle>
          <DialogDescription>
            Complete los campos para crear un nuevo punto de atención.
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
              <FieldLabel htmlFor="type">Tipo de módulo</FieldLabel>

              <Select
                value={selectedType ?? ''}
                onValueChange={(value) => {
                  if (!value) return

                  setValue('type', value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }}
              >
                <SelectTrigger
                  id="type"
                  className="w-full"
                  aria-invalid={!!errors.type}
                  aria-describedby={errors.type ? 'type-error' : undefined}
                >
                  {selectedTypeLabel ? (
                    <span className="truncate">{selectedTypeLabel}</span>
                  ) : (
                    <SelectValue placeholder="Selecciona un tipo" />
                  )}
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {Object.entries(MODULE_TYPES).map(([key, value]) => (
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
                id="type-error"
              >
                {errors.type?.message}
              </FieldError>
            </Field>

            <Field className="gap-1.5">
              <FieldLabel htmlFor="location">Ubicación</FieldLabel>
              <Input
                {...register('location')}
                id="location"
                type="text"
                aria-invalid={!!errors.location}
                aria-describedby={
                  errors.location ? 'location-error' : undefined
                }
              />
              <FieldError
                className="text-destructive"
                role="alert"
                id="location-error"
              >
                {errors.location?.message}
              </FieldError>
            </Field>

            <FieldGroup className="grid grid-cols-2 gap-2">
              <Field className="gap-1.5">
                <FieldLabel htmlFor="municipality">Municipio</FieldLabel>
                <Input
                  {...register('municipality')}
                  id="municipality"
                  type="text"
                  aria-invalid={!!errors.municipality}
                  aria-describedby={
                    errors.municipality ? 'municipality-error' : undefined
                  }
                />
                <FieldError
                  className="text-destructive"
                  role="alert"
                  id="municipality-error"
                >
                  {errors.municipality?.message}
                </FieldError>
              </Field>

              <Field className="gap-1.5">
                <FieldLabel htmlFor="state">Estado</FieldLabel>
                <Input
                  {...register('state')}
                  id="state"
                  type="text"
                  autoComplete="name"
                  aria-invalid={!!errors.state}
                  aria-describedby={errors.state ? 'state-error' : undefined}
                  disabled
                />
                <FieldError
                  className="text-destructive"
                  role="alert"
                  id="state-error"
                >
                  {errors.state?.message}
                </FieldError>
              </Field>
            </FieldGroup>
          </FieldGroup>

          <DialogFooter className="mt-8">
            <DialogClose
              render={
                <Button variant="outline" disabled={createModule.isPending}>
                  Cancelar
                </Button>
              }
            />
            <Button type="submit" disabled={createModule.isPending}>
              {createModule.isPending ? <SpinnerCustom /> : 'Guardar módulo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
