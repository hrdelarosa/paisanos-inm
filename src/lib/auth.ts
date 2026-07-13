import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { username, admin } from 'better-auth/plugins'
import { nextCookies } from 'better-auth/next-js'
import { db } from '@/src/db/index'
import * as schema from '@/src/db/schema'
import { env } from '@/src/config/env.server'

export const auth = betterAuth({
  appName: 'Programa Heroínas y Héroes Paisanos',
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: [env.BETTER_AUTH_URL],
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  plugins: [username(), admin({ defaultRole: 'capturista' }), nextCookies()],
})
