import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) || defaultLocale;
  if (!locales.includes(locale as any)) {
    return {
      locale: defaultLocale,
      messages: (await import(`../messages/${defaultLocale}.json`)).default
    };
  }
  
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});

export async function getLocale(request: Request): Promise<string> {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  if (pathnameLocale) return pathnameLocale;
  
  // Check for cookie
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map(cookie => {
        const [name, value] = cookie.trim().split('=');
        return [name, value];
      })
    );
    if (cookies.NEXT_LOCALE && locales.includes(cookies.NEXT_LOCALE as any)) {
      return cookies.NEXT_LOCALE;
    }
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

export async function getMessages(locale: string) {
  return (await import(`../messages/${locale}.json`)).default;
}
