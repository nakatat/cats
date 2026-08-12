import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/design/utils';

/** Boxが描画できるsemantic HTML element。`as`で変更する。 */
export type BoxElement =
  | 'div'
  | 'main'
  | 'section'
  | 'article'
  | 'aside'
  | 'header'
  | 'footer'
  | 'nav';

export const boxVariants = cva('', {
  variants: {
    display: {
      block: 'block',
      flex: 'flex',
      inlineFlex: 'inline-flex',
      grid: 'grid',
      none: 'hidden',
    },
    direction: {
      row: 'flex-row',
      column: 'flex-col',
    },
    wrap: {
      nowrap: 'flex-nowrap',
      wrap: 'flex-wrap',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
    },
    gap: {
      none: 'gap-0',
      xs: 'gap-0.5',
      sm: 'gap-1',
      md: 'gap-2',
      lg: 'gap-3',
      xl: 'gap-4',
    },
    surface: {
      none: '',
      default:
        'border border-border/70 bg-card text-card-foreground rounded-lg',
      muted: 'bg-muted/50 text-foreground rounded-lg',
      highlight:
        'border border-primary/30 bg-primary/5 text-foreground rounded-lg',
    },
  },
  defaultVariants: {
    display: 'block',
    surface: 'none',
  },
});

type BoxOwnProps<T extends BoxElement> = VariantProps<typeof boxVariants> & {
  as?: T;
  width?: React.CSSProperties['width'];
  maxWidth?: React.CSSProperties['maxWidth'];
};

/**
 * layout用Boxのpolymorphic Props。
 *
 * `as`を変更すると、指定したelementに対応するHTML属性も利用できる。
 */
export type BoxProps<T extends BoxElement = 'div'> = BoxOwnProps<T> &
  Omit<
    React.ComponentPropsWithoutRef<T>,
    keyof BoxOwnProps<T> | 'className' | 'style'
  > & {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
  };

export type BoxRef<T extends BoxElement> =
  React.ComponentPropsWithRef<T>['ref'];

type BoxComponent = <T extends BoxElement = 'div'>(
  props: BoxProps<T> & { ref?: BoxRef<T> }
) => React.ReactElement | null;

const BoxBase = React.forwardRef<HTMLElement, BoxProps<BoxElement>>(
  function Box(
    {
      as,
      display,
      direction,
      wrap,
      align,
      justify,
      gap,
      surface,
      width,
      maxWidth,
      className,
      style,
      ...props
    }: BoxProps<BoxElement>,
    ref
  ) {
    const boxStyle: React.CSSProperties = {
      ...style,
      ...(width !== undefined ? { width } : {}),
      ...(maxWidth !== undefined ? { maxWidth } : {}),
    };

    const Component = as ?? 'div';

    return React.createElement(Component, {
      ref,
      'data-slot': 'box',
      className: cn(
        boxVariants({
          display,
          direction,
          wrap,
          align,
          justify,
          gap,
          surface,
        }),
        className
      ),
      style: boxStyle,
      ...props,
    });
  }
);

export const Box = BoxBase as BoxComponent;
