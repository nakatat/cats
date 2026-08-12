import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/design/utils';

/** Typographyが描画できる見出し・本文用のHTML element。`as`で変更する。 */
export type TypographyElement =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'span'
  | 'div'
  | 'strong'
  | 'small';

export const typographyVariants = cva('', {
  variants: {
    variant: {
      display: 'text-4xl font-bold tracking-tight sm:text-5xl',
      headingXl: 'text-3xl font-bold tracking-tight sm:text-4xl',
      headingLg: 'text-2xl font-semibold tracking-tight sm:text-3xl',
      headingMd: 'text-xl font-semibold tracking-tight sm:text-2xl',
      headingSm: 'text-base font-semibold sm:text-lg',
      body: 'text-base leading-7',
      bodySm: 'text-sm leading-6',
      caption: 'text-xs leading-5',
      label: 'text-sm font-medium leading-none',
    },
    tone: {
      default: 'text-foreground',
      inherit: 'text-inherit',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      primaryForeground: 'text-primary-foreground',
      destructive: 'text-destructive',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    variant: 'body',
    tone: 'default',
  },
});

type TypographyOwnProps<T extends TypographyElement> = VariantProps<
  typeof typographyVariants
> & {
  as?: T;
};

/**
 * typography variantとsemantic elementを組み合わせるpolymorphic Props。
 *
 * `variant`は見た目、`as`はHTML上の意味を指定するため、両者は独立して選択できる。
 */
export type TypographyProps<T extends TypographyElement = 'p'> =
  TypographyOwnProps<T> &
    Omit<
      React.ComponentPropsWithoutRef<T>,
      keyof TypographyOwnProps<T> | 'className' | 'style'
    > & {
      children?: React.ReactNode;
      className?: string;
      style?: React.CSSProperties;
    };

export type TypographyRef<T extends TypographyElement> =
  React.ComponentPropsWithRef<T>['ref'];

type TypographyComponent = <T extends TypographyElement = 'p'>(
  props: TypographyProps<T> & { ref?: TypographyRef<T> }
) => React.ReactElement | null;

const TypographyBase = React.forwardRef<
  HTMLElement,
  TypographyProps<TypographyElement>
>(function Typography(
  { as, variant, tone, weight, align, className, style, ...props },
  ref
) {
  const Component = as ?? 'p';

  return React.createElement(Component, {
    ref,
    'data-slot': 'typography',
    className: cn(
      typographyVariants({ variant, tone, weight, align }),
      className
    ),
    style,
    ...props,
  });
});

export const Typography = TypographyBase as TypographyComponent;
