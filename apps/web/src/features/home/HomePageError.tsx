import { Box } from '@/components/system/Box';
import { Typography } from '@/components/system/Typography';

export function HomePageError() {
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
          トップページのデータを取得できませんでした。API
          の起動状況を確認してください。
        </Typography>
        <Typography as="p" variant="caption" tone="muted">
          しばらくしてから、もう一度お試しください。
        </Typography>
      </Box>
    </Box>
  );
}
