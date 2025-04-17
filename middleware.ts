import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const runtime = 'experimental-edge';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  
  // If accessing the root, directly serve the landing page
  if (url.pathname === '/') {
    url.pathname = '/landing'
    return NextResponse.redirect(url)
  }
  
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/'],
} 