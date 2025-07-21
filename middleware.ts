import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
  locales: ['fr', 'ar','en', 'zh' ],
  defaultLocale: 'fr',
  localeDetection: true
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // If the path is exactly '/', redirect to /fr
  if (pathname === '/' || pathname === '') {
    return NextResponse.redirect(new URL('/fr', request.url));
  }
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
}; 