import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from '@/i18n/request';
import { locales } from '@/i18n/config';
import { notFound } from 'next/navigation';
import { Toaster } from 'sonner';

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: '#0F172A',
                color: '#E5E7EB',
                border: '1px solid rgba(255,255,255,0.08)',
              },
            }}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
