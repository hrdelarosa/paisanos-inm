'use server'

import { headers } from 'next/headers'
import { APIError } from 'better-auth'
import { CreateUserFormInput } from '../users/schema/users.schema'
import { auth } from '@/src/lib/auth'

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  return session
}

export async function usersActios() {
  await requireAdmin()

  return await auth.api.listUsers({
    query: { limit: 100 },
    headers: await headers(),
  })
}

export async function createUserAction({
  input,
}: {
  input: CreateUserFormInput
}) {
  await requireAdmin()

  try {
    const newUser = await auth.api.createUser({
      body: {
        email: `${input.username}@paisanos-inm.local`,
        password: input.password,
        name: input.name,
        role: input.role as 'admin' | 'user',
        data: {
          username: input.username,
          displayUsername: input.username,
        },
      },
    })

    return {
      success: true,
      data: newUser,
    }
  } catch (error) {
    if (error instanceof APIError) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: false,
      error: 'Error al crear el usuario',
    }
  }
}

export async function banUserAction({
  userId,
  reason,
}: {
  userId: string
  reason?: string
}) {
  const session = await requireAdmin()

  if (session?.user?.id === userId)
    return { success: false, error: 'No puedes banear tu propio usuario' }

  try {
    await auth.api.banUser({
      body: { userId, banReason: reason },
      headers: await headers(),
    })

    return { success: true }
  } catch (error) {
    if (error instanceof APIError) {
      return {
        success: false,
        error: error.message,
      }
    }
    return {
      success: false,
      error: 'Error al banear el usuario',
    }
  }
}

export async function unbanUserAction({ userId }: { userId: string }) {
  const session = await requireAdmin()

  if (session?.user?.id === userId)
    return { success: false, error: 'No puedes desbanear tu propio usuario' }

  try {
    await auth.api.unbanUser({
      body: { userId },
      headers: await headers(),
    })

    return { success: true }
  } catch (error) {
    if (error instanceof APIError) {
      return {
        success: false,
        error: error.message,
      }
    }
    return {
      success: false,
      error: 'Error al desbanear el usuario',
    }
  }
}

export async function removeUserAction({ userId }: { userId: string }) {
  const session = await requireAdmin()

  if (session?.user?.id === userId)
    return { success: false, error: 'No puedes eliminar tu propio usuario' }

  try {
    await auth.api.removeUser({
      body: { userId },
      headers: await headers(),
    })

    return {
      success: true,
    }
  } catch (error) {
    if (error instanceof APIError) {
      return {
        success: false,
        error: error.message,
      }
    }
    return {
      success: false,
      error: 'Error al eliminar el usuario',
    }
  }
}
