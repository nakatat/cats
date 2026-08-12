import type { ReactNode } from 'react';

import { Box } from '@/components/system/Box';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/design/utils';

/**
 * labelとSelectを組み合わせたfilter用のcontrolled ComponentのProps。
 *
 * labelは表示またはscreen reader向けに使用され、childrenにはSelectItemなどの選択肢を渡す。
 */
type FilterSelectProps = {
  id: string;
  label: string;
  /** 現在選択中の値。選択肢のvalueと一致させる。 */
  value: string;
  /** ユーザーが選択肢を変更したとき、新しいvalueを渡す。 */
  onValueChange: (value: string) => void;
  children: ReactNode;
  className?: string;
  triggerClassName?: string;
  /** SelectTrigger内に表示するlabel。未指定時は選択肢の表示を使用する。 */
  valueLabel?: ReactNode;
  /** trueの場合はlabelを視覚的に隠すが、accessible nameは維持する。 */
  hideLabel?: boolean;
};

export function FilterSelect({
  id,
  label,
  value,
  onValueChange,
  children,
  className,
  triggerClassName,
  valueLabel,
  hideLabel = false,
}: Readonly<FilterSelectProps>) {
  return (
    <Box
      display="flex"
      direction="column"
      gap="sm"
      className={cn('min-w-0', className)}
    >
      <label
        htmlFor={id}
        className={cn(
          'text-muted-foreground text-xs font-semibold',
          hideLabel && 'sr-only'
        )}
      >
        {label}
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          id={id}
          aria-label={label}
          className={cn(
            'bg-card h-11 w-full rounded-md px-3',
            triggerClassName
          )}
        >
          <SelectValue>{valueLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </Box>
  );
}
