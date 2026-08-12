import { Box } from '@/components/system/Box';
import { Typography } from '@/components/system/Typography';

export function HomePageMissingData() {
  return (
    <Box
      width="100%"
      maxWidth={1440}
      className="mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12"
    >
      <Box
        surface="default"
        display="flex"
        direction="column"
        gap="md"
        className="p-5 sm:p-6"
      >
        <Typography as="h1" variant="headingXl">
          新琴似CATS
        </Typography>
        <Typography as="p" variant="bodySm" tone="muted" className="leading-7">
          チーム情報を取得できませんでした。時間をおいて再度お試しください。
        </Typography>
      </Box>
    </Box>
  );
}
