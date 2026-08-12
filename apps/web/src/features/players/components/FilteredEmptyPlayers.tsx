import { Typography } from '@/components/system/Typography';
import { Card } from '@/components/ui/card';

export function FilteredEmptyPlayers() {
  return (
    <Card className="items-center justify-center rounded-xl border-dashed px-6 py-14 text-center shadow-none">
      <Typography as="p" variant="headingSm">
        条件に一致する選手が見つかりませんでした。
      </Typography>
    </Card>
  );
}
