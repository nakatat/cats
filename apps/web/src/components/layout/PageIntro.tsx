import Image from 'next/image';

import { Box } from '@/components/system/Box';
import { Typography } from '@/components/system/Typography';

type PageIntroProps = {
  iconSrc: string;
  iconAlt?: string;
  title: string;
  description?: string;
};

export function PageIntro({
  iconSrc,
  iconAlt = '',
  title,
  description,
}: Readonly<PageIntroProps>) {
  return (
    <Box display="flex" direction="column" gap="md">
      <Box display="flex" align="center" gap="lg">
        <Image
          src={iconSrc}
          alt={iconAlt}
          width={56}
          height={56}
          className="size-10 object-contain sm:size-12"
        />
        <Typography as="h1" variant="headingLg">
          {title}
        </Typography>
      </Box>
      {description ? (
        <Typography as="p" variant="body" tone="muted">
          {description}
        </Typography>
      ) : null}
    </Box>
  );
}
