import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/design/utils';

const cardVariants = cva(
  'group/card flex flex-col overflow-hidden border text-card-foreground transition-colors has-[>img:first-child]:pt-0 *:[img:first-child]:rounded-t-[inherit] *:[img:last-child]:rounded-b-[inherit]',
  {
    variants: {
      variant: {
        default: 'border-border bg-card shadow-sm',
        subtle: 'border-border/70 bg-muted/50 shadow-none',
        highlight:
          'border-secondary/50 bg-gradient-to-br from-card to-secondary/10 shadow-sm ring-1 ring-secondary/30',
      },
      size: {
        sm: 'gap-3 rounded-xl py-3 text-sm',
        default: 'gap-4 rounded-xl py-4 text-sm',
        lg: 'gap-5 rounded-xl py-5 text-base',
      },
      padding: {
        default: '',
        content: 'p-3 sm:p-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      padding: 'default',
    },
  }
);

function Card({
  className,
  variant = 'default',
  size = 'default',
  padding = 'default',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof cardVariants>) {
  return (
    <div
      data-slot="card"
      data-variant={variant}
      data-size={size}
      className={cn(cardVariants({ variant, size, padding }), className)}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        'group/card-header @container/card-header grid auto-rows-min items-start gap-1 px-4 group-data-[size=lg]/card:px-6 group-data-[size=sm]/card:px-3 has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[size=lg]/card:[.border-b]:pb-5 group-data-[size=sm]/card:[.border-b]:pb-3',
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        'text-base leading-snug font-semibold group-data-[size=lg]/card:text-lg group-data-[size=sm]/card:text-sm',
        className
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        'text-muted-foreground text-sm leading-6 group-data-[size=lg]/card:text-base group-data-[size=sm]/card:text-xs',
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        'px-4 group-data-[size=lg]/card:px-6 group-data-[size=sm]/card:px-3',
        className
      )}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        'flex items-center gap-2 px-4 group-data-[size=lg]/card:px-6 group-data-[size=sm]/card:px-3',
        className
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
