import createMiddleware from 'next-intl/middleware';
import { createMiddlewareSupabaseClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n/config';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Handle admin routes (outside locale prefix)
  if (pathname.startsWith('/admin')) {
    const response = NextResponse.next();
    
    // Create Supabase client
    const supabase = createMiddlewareSupabaseClient(request, response);

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      // Redirect to register page with best locale
      const locale = getBestLocale(request);
      return NextResponse.redirect(new URL(`/${locale}/register`, request.url));
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/403', request.url));
    }

    return response;
  }

  // Handle all other routes with i18n
  return intlMiddleware(request);
}

function getBestLocale(request: NextRequest): string {
  // Check for cookie
  const localeCookie = request.cookies.get('NEXT_LOCALE');
  if (localeCookie && locales.includes(localeCookie.value as any)) {
    return localeCookie.value;
  }
  
  // Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].trim())
      .find(lang => locales.includes(lang as any) || locales.includes(lang.split('-')[0] as any));
    
    if (preferredLocale) {
      const locale = locales.includes(preferredLocale as any) 
        ? preferredLocale 
        : preferredLocale.split('-')[0];
      if (locales.includes(locale as any)) {
        return locale;
      }
    }
  }
  
  return defaultLocale;
}

export const config = {
  matcher: ['/((?!admin|_next|api|.*\\..*).*)']
};
