import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/src/components/ui/card'
import LoginForm from '@/src/modules/login/components/LoginForm'

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
