import { Box } from '@/components/system/Box';
import { Skeleton } from '@/components/ui/skeleton';

import { RecordItemSkeleton } from './RecordItemSkeleton';

export function TeamRecordCardSkeleton() {
  return (
    <Box className="bg-primary overflow-hidden rounded-xl border border-white/25 shadow-[0_14px_32px_rgba(0,0,0,0.16)]">
      <Box className="border-b border-white/15 px-4 py-3 sm:px-6 sm:py-3">
        <Skeleton className="h-5 w-24 bg-white/20" />
      </Box>

      <Box className="sm:hidden">
        <Box className="grid grid-cols-4 border-b border-white/15">
          {[1, 2, 3, 4].map((item) => (
            <RecordItemSkeleton key={item} />
          ))}
        </Box>
        <Box className="grid grid-cols-3">
          {[1, 2, 3].map((item) => (
            <RecordItemSkeleton key={item} />
          ))}
        </Box>
      </Box>

      <Box className="hidden sm:grid sm:grid-cols-7">
        {[1, 2, 3, 4, 5, 6, 7].map((item) => (
          <RecordItemSkeleton key={item} />
        ))}
      </Box>
    </Box>
  );
}
