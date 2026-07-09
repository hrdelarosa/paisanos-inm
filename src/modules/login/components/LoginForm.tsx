'use client'
import { loginFormSchema } from '../schemas/login.schemas'

import { Input } from '@/src/components/ui/input'
import { Button } from '@/src/components/ui/button'
import { SpinnerCustom } from '@/src/components/ui/spinner'
import { PasswordInput } from './ui/password-input'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/src/components/ui/field'
import { useAuth } from '../hooks/useAuth'
import { useValidatedForm } from '../hooks/useValidatedForm'

export default function LoginForm() {
  const { login, loading } = useAuth()
  const { register, handleSubmit, errors } = useValidatedForm({
    formSchema: loginFormSchema,
    onSubmit: async ({ username, password }) => {
      await login({ username, password })
    },
  })

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup className="gap-7">
        <Field>
          <FieldGroup className="gap-3.5">
            <Field className="gap-1.5">
              <FieldLabel htmlFor="user">Usuario</FieldLabel>
              <Input
                {...register('username')}
                id="user"
                type="text"
                autoComplete="username"
                placeholder="paisanosinm"
                autoFocus
                aria-invalid={!!errors.username}
              />
              <FieldError className="text-destructive">
                {errors.username?.message}
              </FieldError>
            </Field>

            <PasswordInput
              {...register('password')}
              id="password"
              label="Contraseña"
              error={errors.password?.message}
              autoComplete="current-password"
            />
          </FieldGroup>
        </Field>

        <Field>
          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="hover:bg-primary-hover"
          >
            {loading ? (
              <>
                <SpinnerCustom data-icon="inline-start" />
                Cargando...
              </>
            ) : (
              'Iniciar sesión'
            )}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
