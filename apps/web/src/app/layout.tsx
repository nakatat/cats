import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import type { ReactNode } from 'react';

import { SiteShell } from '@/components/layout/SiteShell';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  createPageMetadata,
  SITE_DESCRIPTION,
  SITE_METADATA_BASE,
  SITE_NAME,
} from '@/lib/site-metadata';

import './globals.css';

const notoSansJp = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-noto-sans-jp',
  display: 'swap',
});

const topPageMetadata = createPageMetadata({
  title: 'トップ',
  path: '/',
});

export const metadata: Metadata = {
  ...topPageMetadata,
  metadataBase: SITE_METADATA_BASE,
  title: {
    default: `${SITE_NAME} | トップ`,
    template: `${SITE_NAME} | %s`,
  },
  description: SITE_DESCRIPTION,
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  icons: {
    icon: '/brand/cats-logo-mark.png',
    apple: '/brand/cats-logo-mark.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ja" className={notoSansJp.variable}>
      <body className="bg-background text-foreground antialiased">
        <TooltipProvider>
          <SiteShell>{children}</SiteShell>
        </TooltipProvider>
      </body>
    </html>
  );
}
