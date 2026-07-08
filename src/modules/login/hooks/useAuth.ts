import { authClient } from '@/src/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const login = async ({
    username,
    password,
  }: {
    username: string
    password: string
  }) => {
    setLoading(true)
    const { error } = await authClient.signIn.username(
      {
        username,
        password,
        callbackURL: '/',
      },
      {
        onSuccess: () => {
          setLoading(false)
          toast.success('Inicio de sesión exitoso')
          router.push('/')
        },
      },
    )

    if (error) {
      toast.error(error.message ?? 'Credenciales inválidas')
      setLoading(false)
    }
  }

  const logout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/login')
        },
      },
    })
  }

  return {
    login,
    logout,
    loading,
  }
}
