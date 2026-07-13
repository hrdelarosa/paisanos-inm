# Paisanos INM

Sistema interno para registrar y revisar atenciones del Programa Heroínas y Héroes Paisanos.

## Requisitos

- Node.js compatible con Next.js 16.
- pnpm.
- Base de datos Turso/libSQL.

## Configuración

1. Copia `.env.example` a `.env`.
2. Define `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `TURSO_DATABASE_URL` y `TURSO_AUTH_TOKEN`.
3. Ejecuta migraciones y seeds.

```bash
pnpm install
pnpm db:migrate
pnpm seed:admin
pnpm seed:attention-types
pnpm dev
```

## Scripts

```bash
pnpm lint
pnpm typecheck
pnpm check
pnpm build
```

## Roles

- `admin`: administra usuarios, módulos, operativos y catálogos.
- `enlace`: consulta y revisa reportes según alcance operativo.
- `capturista`: captura reportes y consulta información propia o de su módulo asignado.

## Notas De Seguridad

- No uses variables con secretos bajo prefijo `NEXT_PUBLIC_`.
- La aplicación está marcada como privada para buscadores con `robots.txt`, metadata y `X-Robots-Tag`.
- Los controles SEO no sustituyen la autenticación ni autorización del servidor.
