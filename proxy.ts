import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

// const PUBLIC_ROUTES = ['/login']

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)
  const isPublicRoute = request.nextUrl.pathname.startsWith('/login')

  if (!sessionCookie && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  // const isPublicRoute = PUBLIC_ROUTES.some((route) =>
  //   request.nextUrl.pathname.startsWith(route),
  // )

  // if (!sessionCookie && !isPublicRoute) {
  //   return NextResponse.redirect(new URL('/login', request.url))
  // }

  // if (sessionCookie && isPublicRoute) {
  //   return NextResponse.redirect(new URL('/', request.url))
  // }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
