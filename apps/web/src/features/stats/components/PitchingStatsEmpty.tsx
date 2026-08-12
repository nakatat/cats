import { Typography } from '@/components/system/Typography';
import { Empty, EmptyDescription, EmptyHeader } from '@/components/ui/empty';

export function PitchingStatsEmpty() {
  return (
    <Empty className="min-h-40 rounded-none border-0 border-dashed">
      <EmptyHeader>
        <Typography as="p" variant="bodySm" weight="semibold">
          選択した範囲の投手成績はまだありません
        </Typography>
        <EmptyDescription>
          成績が登録されると、ここに一覧表示されます。
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
