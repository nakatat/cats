import Image from 'next/image';

import { Box } from '@/components/system/Box';
import { Typography } from '@/components/system/Typography';

export function SiteFooter() {
  return (
    <Box
      as="footer"
      className="bg-primary text-primary-foreground relative overflow-hidden border-t border-white/10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(234,179,8,0.12),transparent_28%),linear-gradient(135deg,rgba(11,79,42,1),rgba(7,57,30,1))]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-8 -left-10 text-[clamp(4rem,12vw,8rem)] font-black tracking-tight text-white/5 italic select-none"
      >
        Cats
      </div>
      <Box
        width="100%"
        maxWidth={1440}
        display="grid"
        gap="xl"
        className="relative mx-auto px-4 py-10 sm:px-6 md:grid-cols-[1fr_minmax(240px,360px)] md:items-center lg:px-8"
      >
        <Box display="flex" align="center" gap="sm">
          <Image
            src="/brand/cats-logo-mark.png"
            alt="新琴似CATS ロゴ"
            width={64}
            height={64}
            className="h-14 w-14 shrink-0 object-contain md:h-16 md:w-16"
          />
          <Box display="flex" direction="column" gap="xs">
            <Typography
              as="p"
              variant="body"
              tone="primaryForeground"
              weight="bold"
              className="tracking-[0.02em]"
            >
              新琴似CATS 非公式サイト
            </Typography>
            <Typography
              as="p"
              variant="bodySm"
              tone="primaryForeground"
              className="opacity-75"
            >
              札幌市を拠点に活動する草野球チーム
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box className="relative border-t border-white/5 bg-[rgba(2,24,12,0.42)]">
        <Box
          width="100%"
          maxWidth={1440}
          className="mx-auto px-4 py-4 sm:px-6 lg:px-8"
        >
          <Typography
            as="p"
            variant="caption"
            align="center"
            tone="primaryForeground"
            className="opacity-60"
          >
            2019-2026 新琴似CATS 非公式サイト
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
