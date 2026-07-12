import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { username, admin } from 'better-auth/plugins'
import { nextCookies } from 'better-auth/next-js'
import { db } from '@/src/db/index'
import * as schema from '@/src/db/schema'

export const auth = betterAuth({
  appName: 'Programa Heroínas y Héroes Paisanos',
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL!,
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET!,
  trustedOrigins: [process.env.NEXT_PUBLIC_BASE_URL!],
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
  plugins: [username(), admin(), nextCookies()],
})
