import type { Metadata } from 'next';

export const SITE_NAME = '新琴似CATS';
export const SITE_DESCRIPTION =
  '新琴似CATSの試合結果・選手・成績を紹介する非公式公開サイト。';
export const SITE_METADATA_BASE = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cats-ochre.vercel.app'
);

export const SITE_OG_IMAGE = {
  url: '/hero/cats-hero-bg.png',
  width: 1672,
  height: 941,
  alt: '野球場にボールがある新琴似CATSのサイトイメージ',
};

type PageMetadataOptions = {
  title: string;
  path: string;
  description?: string;
};

export function createPageMetadata({
  title,
  path,
  description = SITE_DESCRIPTION,
}: PageMetadataOptions): Metadata {
  const fullTitle = `${SITE_NAME} | ${title}`;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: 'website',
      locale: 'ja_JP',
      url: path,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      images: [SITE_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [SITE_OG_IMAGE.url],
    },
  };
}
