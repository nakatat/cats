import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Info, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const tooltipSides = ['top', 'right', 'bottom', 'left'] as const;

const meta = {
  title: 'Components/UI/Tooltip',
  component: TooltipContent,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    children: {
      control: 'text',
    },
    side: {
      control: 'select',
      options: tooltipSides,
    },
    sideOffset: {
      control: { type: 'number', min: 0, max: 24, step: 1 },
      description: 'Trigger と Tooltip の間隔',
    },
  },
} satisfies Meta<typeof TooltipContent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    children: '試合結果の詳細を表示します',
    side: 'top',
    sideOffset: 8,
  },
  render: (args) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">試合結果</Button>
        </TooltipTrigger>
        <TooltipContent {...args} />
      </Tooltip>
    </TooltipProvider>
  ),
};

export const Positions: Story = {
  render: () => (
    <TooltipProvider>
      <div className="grid grid-cols-2 gap-x-28 gap-y-20 p-12">
        {tooltipSides.map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger asChild>
              <Button variant="outline">{side}</Button>
            </TooltipTrigger>
            <TooltipContent side={side} sideOffset={8}>
              {side} に表示
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  ),
};

export const WithIconButton: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button aria-label="お問い合わせ" size="icon" variant="outline">
            <Mail />
          </Button>
        </TooltipTrigger>
        <TooltipContent sideOffset={8}>お問い合わせ</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const InContent: Story = {
  render: () => (
    <TooltipProvider>
      <div className="flex max-w-sm flex-col gap-3">
        <p className="text-muted-foreground text-sm">打撃成績</p>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            <span className="font-medium">OPS</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button aria-label="OPS の説明" size="icon-sm" variant="ghost">
                  <Info />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={8}>
                出塁率と長打率を足した打撃指標です。
              </TooltipContent>
            </Tooltip>
          </div>
          <span className="text-xl font-bold">.921</span>
        </div>
      </div>
    </TooltipProvider>
  ),
};
