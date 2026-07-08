import 'dotenv/config'
import { auth } from '@/src/lib/auth'

async function main() {
  const username = process.env.SEED_ADMIN_USERNAME ?? 'admin'
  const password = process.env.SEED_ADMIN_PASSWORD
  const name = process.env.SEED_ADMIN_NAME ?? 'Administrador'

  if (!password) {
    console.error('Falta SEED_ADMIN_PASSWORD en tu .env')
    process.exit(1)
  }

  const result = await auth.api.createUser({
    body: {
      email: `${username}@paisanos-inm.local`,
      password,
      name,
      role: 'admin',
      data: {
        username,
        displayUsername: username,
      },
    },
  })

  console.log('Usuario admin creado:')
  console.log(result)
  process.exit(0)
}

main().catch((err) => {
  console.error('Error al crear el usuario admin:', err)
  process.exit(1)
})
