import type { Metadata } from 'next'
import '../globals.css'
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations} from 'next-intl/server';

export async function generateMetadata({params}: {params: {locale: string}}): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({locale, namespace: 'Metadata'});
 
  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    authors: [{ name: 'Import Auto Algérie' }],
    creator: 'Import Auto Algérie',
    publisher: 'Import Auto Algérie',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title: t('og_title'),
      description: t('og_description'),
      url: 'https://import-auto-algerie.com', // To be updated with actual domain
      siteName: 'Import Auto Algérie',
      images: [
        {
          url: 'https://import-auto-algerie.com/og-image.jpg', // To be updated with actual domain
          width: 1200,
          height: 630,
          alt: t('og_alt'),
        },
      ],
      locale: locale === 'ar' ? 'ar_DZ' : 'fr_FR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('og_title'),
      description: t('og_description'),
      images: ['https://import-auto-algerie.com/twitter-image.jpg'], // To be updated with actual domain
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode,
  params: {locale: string}
}) {
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="scroll-smooth">
      <body className="antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
} 