import { RotateCcw } from 'lucide-react';
import type { ComponentProps } from 'react';

import { cn } from '@/lib/design/utils';

/** filterを既定状態へ戻すためのボタンProps。 */
type FilterResetButtonProps = Omit<
  ComponentProps<'button'>,
  'children' | 'onClick' | 'type'
> & {
  /** リセット操作が選択されたときに呼び出す。 */
  onReset: () => void;
};

export function FilterResetButton({
  className,
  disabled = false,
  onReset,
  ...props
}: Readonly<FilterResetButtonProps>) {
  return (
    <button
      {...props}
      type="button"
      onClick={onReset}
      disabled={disabled}
      className={cn(
        'text-foreground hover:text-primary focus-visible:ring-ring inline-flex h-11 items-center justify-center gap-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-3 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-45 lg:px-1',
        className
      )}
    >
      <RotateCcw aria-hidden="true" className="size-4" />
      条件をリセット
    </button>
  );
}
