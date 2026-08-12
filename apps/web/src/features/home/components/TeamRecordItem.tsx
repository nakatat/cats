import { Box } from '@/components/system/Box';
import { Typography } from '@/components/system/Typography';

export function TeamRecordItem({
  label,
  value,
  highlighted = false,
}: Readonly<{
  label: string;
  value: number | string | null | undefined;
  highlighted?: boolean;
}>) {
  return (
    <Box
      display="flex"
      direction="column"
      align="center"
      gap="xs"
      className="min-w-0 border-r border-white/15 px-1.5 py-3 text-center last:border-r-0 md:px-3 md:py-4"
    >
      <Typography
        as="p"
        variant="caption"
        tone="primaryForeground"
        weight="semibold"
        className="text-[9px] opacity-75 md:text-[10px]"
      >
        {label}
      </Typography>
      <Typography
        as="p"
        tone="primaryForeground"
        className={`text-lg leading-none font-bold md:text-2xl ${
          highlighted ? 'text-secondary' : ''
        }`}
      >
        {value ?? '—'}
      </Typography>
    </Box>
  );
}
