import { useState } from 'react'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

import { Button } from '@/src/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/src/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/src/components/ui/input-group'
import type { Input } from '@/src/components/ui/input'

interface Props extends React.ComponentProps<typeof Input> {
  label?: string
  children?: React.ReactNode
  error?: string | undefined
}

export function PasswordInput({ label, children, error, ...props }: Props) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Field className="gap-1.5">
      {label && <FieldLabel htmlFor={props.id}>{label}</FieldLabel>}
      {children}

      <InputGroup>
        <InputGroupInput
          {...props}
          id={props.id}
          type={showPassword ? 'text' : 'password'}
          aria-invalid={!!error}
        />
        <InputGroupAddon align="inline-end">
          <Button
            variant="ghost"
            size="icon-xs"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeIcon /> : <EyeOffIcon />}
          </Button>
        </InputGroupAddon>
      </InputGroup>

      <FieldError className="text-destructive-active">{error}</FieldError>
    </Field>
  )
}
