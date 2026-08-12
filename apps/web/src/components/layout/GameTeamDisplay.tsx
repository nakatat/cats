import { Box } from '@/components/system/Box';
import { Typography } from '@/components/system/Typography';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function GameTeamDisplay({
  teamName,
  imageSrc,
  variant,
  className,
}: Readonly<{
  teamName: string;
  imageSrc?: string | null;
  variant: 'featured' | 'compact' | 'detail';
  className?: string;
}>) {
  const isFeatured = variant === 'featured';
  const isDetail = variant === 'detail';

  return (
    <Box
      display="flex"
      direction="column"
      align="center"
      gap="sm"
      className={`min-w-0 self-start text-center ${isDetail ? 'sm:gap-2' : ''} ${className ?? ''}`}
    >
      <Avatar
        size={isFeatured ? 'xl' : 'lg'}
        className={
          imageSrc
            ? `rounded-xl bg-transparent after:hidden ${isFeatured ? 'size-14 sm:size-16' : isDetail ? 'size-12 sm:size-24' : 'size-12 sm:size-14'}`
            : `bg-neutral-800 text-white after:hidden ${isDetail ? 'size-10 sm:size-14' : ''}`
        }
      >
        {imageSrc ? (
          <AvatarImage
            src={imageSrc}
            alt=""
            className={`rounded-none object-contain ${imageSrc === '/brand/cats-logo-mark.png' ? 'scale-[1.2]' : ''}`}
          />
        ) : null}
        <AvatarFallback
          className={`bg-neutral-800 font-bold text-white ${isFeatured ? 'text-base' : isDetail ? 'text-sm sm:text-3xl' : 'text-sm'}`}
        >
          {teamName.slice(0, 1)}
        </AvatarFallback>
      </Avatar>
      <Typography
        as="p"
        variant="bodySm"
        weight={isDetail ? 'bold' : 'semibold'}
        title={teamName}
        className={
          isFeatured
            ? 'w-full max-w-48 truncate text-sm sm:text-lg'
            : isDetail
              ? 'w-full max-w-40 truncate sm:max-w-full sm:overflow-visible sm:text-base sm:leading-7 sm:wrap-break-word sm:whitespace-normal'
              : 'w-full max-w-40 truncate'
        }
      >
        {teamName}
      </Typography>
    </Box>
  );
}
