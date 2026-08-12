import { Typography } from '@/components/system/Typography';
import { Card } from '@/components/ui/card';

export function EmptyPlayers() {
  return (
    <Card className="items-center justify-center rounded-xl border-dashed px-6 py-14 text-center shadow-none">
      <Typography as="p" variant="headingSm">
        まだ選手が登録されていません。
      </Typography>
    </Card>
  );
}
