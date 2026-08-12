import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

const meta = {
  title: 'Components/UI/Spinner',
  component: Spinner,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    className: {
      control: false,
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => <Spinner />,
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner className="size-3" />
      <Spinner className="size-4" />
      <Spinner className="size-6" />
      <Spinner className="size-8" />
    </div>
  ),
};

export const InButton: Story = {
  render: () => <Button loading>保存中</Button>,
};

export const InContent: Story = {
  render: () => (
    <div aria-busy="true" className="flex items-center gap-3">
      <Spinner className="size-6" />
      <span className="text-muted-foreground text-sm">
        成績データを読み込み中です
      </span>
    </div>
  ),
};
