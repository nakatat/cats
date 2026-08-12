import { Typography } from '@/components/system/Typography';
import { Empty, EmptyDescription, EmptyHeader } from '@/components/ui/empty';

export function GamePitchingEmpty() {
  return (
    <Empty className="min-h-36 border border-dashed">
      <EmptyHeader>
        <Typography as="p" variant="bodySm" weight="semibold">
          投手成績はまだ登録されていません。
        </Typography>
        <EmptyDescription>
          成績が登録されると、ここに一覧表示されます。
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
