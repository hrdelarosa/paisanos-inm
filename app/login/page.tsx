import type { Metadata } from 'next'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/src/components/ui/card'
import LoginForm from '@/src/modules/login/components/LoginForm'

export const metadata: Metadata = {
  title: 'Iniciar sesión',
  description:
    'Inicia sesión con tu cuenta para acceder al sistema de registro de atenciones del Programa Héroes Paisanos del Instituto Nacional de Migración.',
}

export default function Login() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Iniciar sesión con tu cuenta</CardTitle>

        <CardDescription>
          Introduce tu usuario y contraseña a continuación para iniciar sesión
          en tu cuenta
        </CardDescription>
      </CardHeader>

      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  )
}
