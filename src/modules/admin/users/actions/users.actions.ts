'use server'

import { headers } from 'next/headers'
import { APIError } from 'better-auth'
import { CreateUserFormInput } from '../schema/users.schema'
import { auth } from '@/src/lib/auth'
import { db } from '@/src/db'
import { modules, user, userProfiles } from '@/src/db/schema'
import { asc, eq } from 'drizzle-orm'
import type { AdminUser } from '../types/users.types'
import { createId } from '@/src/lib/id'

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  return session
}

export async function usersActios() {
  await requireAdmin()

  const users = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      username: user.username,
      displayUsername: user.displayUsername,
      role: user.role,
      banned: user.banned,
      banReason: user.banReason,
      banExpires: user.banExpires,
      profileId: userProfiles.id,
      module: modules.name,
      profileCreatedAt: userProfiles.createdAt,
      profileUpdatedAt: userProfiles.updatedAt,
    })
    .from(user)
    .leftJoin(userProfiles, eq(user.id, userProfiles.userId))
    .leftJoin(modules, eq(userProfiles.moduleId, modules.id))
    .orderBy(asc(user.createdAt))

  return {
    users: users as AdminUser[],
  }
}

export async function createUserAction({
  input,
}: {
  input: CreateUserFormInput
}) {
  await requireAdmin()

  try {
    const { user: createdUser } = await auth.api.createUser({
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

    const moduleId =
      input.role === 'capturista' ? input.moduleId : undefined

    if (input.role === 'capturista') {
      if (!moduleId) {
        await auth.api.removeUser({
          body: { userId: createdUser.id },
          headers: await headers(),
        })

        return {
          success: false,
          error: 'El módulo es requerido para un capturista',
        }
      }

      await db.insert(userProfiles).values({
        id: createId(),
        userId: createdUser.id,
        moduleId,
      })
    }

    return {
      success: true,
      data: createdUser,
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
