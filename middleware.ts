import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Pour l'instant, on laisse passer toutes les requêtes
  // La protection sera ajoutée plus tard
  return NextResponse.next()
}

export const config = {
  matcher: ['/search/:path*'],
}