'use client'

import { useState } from 'react'
import { CalendarIcon, ClipboardCheckIcon } from 'lucide-react'
import { CreateOperativeInput } from '../types/operatives.types'
import { createOperativeFormSchema } from '../schema/operatives.schema'
import { OPERATIVE_SEASONS, OperativeSeason } from '@/src/constants/dominio'

import { es } from 'date-fns/locale'
import { DateRange } from 'react-day-picker'
import { format, addMonths } from 'date-fns'

import { Input } from '@/src/components/ui/input'
import { Button } from '@/src/components/ui/button'
import { Calendar } from '@/src/components/ui/calendar'
import { SpinnerCustom } from '@/src/components/ui/spinner'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/src/components/ui/popover'
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
import { useOperatives } from '../hooks/useOperatives'
import { useValidatedForm } from '@/src/modules/login/hooks/useValidatedForm'
import { getSelectableYears } from '@/src/utils/selectableYears'
import { toUTCEndOfDay, toUTCStartOfDay } from '@/src/lib/dateOnly'

export default function OperativeCreateDialog() {
  const [open, setOpen] = useState(false)
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addMonths(new Date(), 1),
  })
  const { createOperative } = useOperatives()
  const { register, handleSubmit, errors, reset, setValue, watch } =
    useValidatedForm({
      formSchema: createOperativeFormSchema,
      defaultValues: {
        name: '',
        season: 'holy_week',
        year: new Date().getFullYear().toString(),
        startDate: toUTCStartOfDay(new Date()).toISOString(),
        endDate: toUTCEndOfDay(addMonths(new Date(), 1)).toISOString(),
      },
      onSubmit: (data) => {
        createOperative.mutate(data as CreateOperativeInput)
        reset()
        setRange({
          from: new Date(),
          to: addMonths(new Date(), 1),
        })
        setOpen(false)
      },
    })
  const years = getSelectableYears()
  const selectedSeason = watch('season') as OperativeSeason
  const selectedSeasonLabel = OPERATIVE_SEASONS[selectedSeason]
  const selectedYear = watch('year')
  const handleRangeSelect = (selected: DateRange | undefined) => {
    setRange(selected)
    setValue(
      'startDate',
      selected?.from ? toUTCStartOfDay(selected.from).toISOString() : '',
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    )
    setValue(
      'endDate',
      selected?.to ? toUTCEndOfDay(selected.to).toISOString() : '',
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="lg">
            <ClipboardCheckIcon />
            Crear operativo
          </Button>
        }
      />

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Crear operativo</DialogTitle>
          <DialogDescription>
            Complete los campos para crear un nuevo operativo.
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

            <FieldGroup className="grid grid-cols-2 gap-2">
              <Field className="gap-1.5">
                <FieldLabel htmlFor="season">Temporada</FieldLabel>

                <Select
                  value={selectedSeason ?? ''}
                  onValueChange={(value) => {
                    if (!value) return

                    setValue('season', value, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }}
                >
                  <SelectTrigger
                    id="season"
                    className="w-full"
                    aria-invalid={!!errors.season}
                    aria-describedby={
                      errors.season ? 'season-error' : undefined
                    }
                  >
                    {selectedSeasonLabel ? (
                      <span className="truncate">{selectedSeasonLabel}</span>
                    ) : (
                      <SelectValue placeholder="Selecciona una temporada" />
                    )}
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {Object.entries(OPERATIVE_SEASONS).map(([key, value]) => (
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
                  id="season-error"
                >
                  {errors.season?.message}
                </FieldError>
              </Field>

              <Field className="gap-1.5">
                <FieldLabel htmlFor="year">Año</FieldLabel>

                <Select
                  value={selectedYear ?? ''}
                  onValueChange={(value) => {
                    if (!value) return

                    setValue('year', value, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }}
                >
                  <SelectTrigger
                    id="year"
                    className="w-full"
                    aria-invalid={!!errors.year}
                    aria-describedby={errors.year ? 'year-error' : undefined}
                  >
                    <SelectValue placeholder="Selecciona un año" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <FieldError
                  className="text-destructive"
                  role="alert"
                  id="year-error"
                >
                  {errors.year?.message}
                </FieldError>
              </Field>
            </FieldGroup>

            <Field className="gap-1.5">
              <FieldLabel htmlFor="date-range">Fechas del operativo</FieldLabel>

              <Popover>
                <PopoverTrigger
                  render={
                    <Button
                      id="date-range"
                      variant="outline"
                      data-empty={!range?.from}
                      className="w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
                    >
                      <CalendarIcon data-icon="inline-start" />
                      {range?.from ? (
                        range.to ? (
                          <>
                            {format(range.from, "d 'de' MMMM 'de' yyyy", {
                              locale: es,
                            })}{' '}
                            -{' '}
                            {format(range.to, "d 'de' MMMM 'de' yyyy", {
                              locale: es,
                            })}
                          </>
                        ) : (
                          format(range.from, "d 'de' MMMM 'de' yyyy", {
                            locale: es,
                          })
                        )
                      ) : (
                        <span>Selecciona un rango de fechas</span>
                      )}
                    </Button>
                  }
                />

                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    defaultMonth={range?.from}
                    selected={range}
                    onSelect={handleRangeSelect}
                    numberOfMonths={2}
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-8">
            <DialogClose
              render={
                <Button variant="outline" disabled={createOperative.isPending}>
                  Cancelar
                </Button>
              }
            />
            <Button type="submit" disabled={createOperative.isPending}>
              {createOperative.isPending ? <SpinnerCustom /> : 'Guardar módulo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
