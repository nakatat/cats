'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Tabs as TabsPrimitive } from 'radix-ui';

import { cn } from '@/lib/design/utils';

type TabsOrientation = 'horizontal' | 'vertical';

const TabsOrientationContext =
  React.createContext<TabsOrientation>('horizontal');

function Tabs({
  className,
  orientation = 'horizontal',
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsOrientationContext.Provider value={orientation}>
      <TabsPrimitive.Root
        data-slot="tabs"
        data-orientation={orientation}
        orientation={orientation}
        className={cn(
          'group/tabs flex gap-2',
          orientation === 'horizontal' ? 'flex-col' : 'flex-row items-start',
          className
        )}
        {...props}
      />
    </TabsOrientationContext.Provider>
  );
}

const tabsListVariants = cva(
  'group/tabs-list inline-flex w-fit items-center justify-center rounded-md p-1 text-muted-foreground',
  {
    variants: {
      variant: {
        default: 'bg-muted',
        line: 'gap-0 rounded-none bg-transparent p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function TabsList({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  const orientation = React.useContext(TabsOrientationContext);

  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(
        tabsListVariants({ variant }),
        orientation === 'horizontal' ? 'h-9 flex-row' : 'h-fit flex-col',
        variant === 'line' &&
          (orientation === 'horizontal' ? 'border-b' : 'border-r'),
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const orientation = React.useContext(TabsOrientationContext);

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        'text-muted-foreground hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring relative inline-flex h-full items-center justify-center gap-1.5 rounded-sm border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
        orientation === 'vertical' && 'w-full justify-start',
        'group-data-[variant=default]/tabs-list:data-[state=active]:bg-background group-data-[variant=default]/tabs-list:data-[state=active]:text-foreground group-data-[variant=default]/tabs-list:data-[state=active]:font-semibold group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm',
        'group-data-[variant=line]/tabs-list:data-[state=active]:text-foreground group-data-[variant=line]/tabs-list:rounded-none group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none',
        'after:bg-foreground after:absolute after:opacity-0 after:transition-opacity group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100',
        orientation === 'horizontal'
          ? 'after:inset-x-0 after:-bottom-px after:h-px'
          : 'after:inset-y-0 after:-right-px after:w-px',
        className
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  const orientation = React.useContext(TabsOrientationContext);

  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        'flex-1 text-sm outline-none',
        orientation === 'horizontal' ? 'px-2 pt-1' : 'px-3 py-1',
        className
      )}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, tabsListVariants, TabsTrigger };
