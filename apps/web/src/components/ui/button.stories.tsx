import Link from 'next/link';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ArrowRight, Mail, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

const meta = {
  title: 'Components/UI/Button',
  component: Button,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'secondary',
        'outline',
        'ghost',
        'destructive',
        'link',
      ],
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'icon', 'icon-sm', 'icon-lg'],
    },
    loading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    children: 'ボタン',
    variant: 'default',
    size: 'default',
    loading: false,
    disabled: false,
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <Button {...args} />,
};

export const Variants: Story = {
  render: () => (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <Button className="w-full">Default</Button>
      <Button className="w-full" variant="secondary">
        Secondary
      </Button>
      <Button className="w-full" variant="outline">
        Outline
      </Button>
      <Button className="w-full" variant="ghost">
        Ghost
      </Button>
    </div>
  ),
};

export const SpecialVariants: Story = {
  render: () => (
    <div className="grid gap-3 md:grid-cols-2">
      <Button className="w-full" variant="destructive">
        Destructive
      </Button>
      <Button className="w-full" variant="link">
        Link
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Small</Button>
      <Button>Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="grid gap-3 md:grid-cols-3">
      <Button className="w-full" disabled>
        Disabled
      </Button>
      <Button className="w-full" loading>
        Loading
      </Button>
      <Button className="w-full" loading>
        保存中
      </Button>
    </div>
  ),
};

export const DisabledVariants: Story = {
  render: () => (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <Button className="w-full" disabled>
        Default
      </Button>
      <Button className="w-full" disabled variant="secondary">
        Secondary
      </Button>
      <Button className="w-full" disabled variant="outline">
        Outline
      </Button>
      <Button className="w-full" disabled variant="ghost">
        Ghost
      </Button>
    </div>
  ),
};

export const LoadingVariants: Story = {
  render: () => (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <Button className="w-full" loading>
        Default
      </Button>
      <Button className="w-full" loading variant="secondary">
        Secondary
      </Button>
      <Button className="w-full" loading variant="outline">
        Outline
      </Button>
      <Button className="w-full" loading variant="ghost">
        Ghost
      </Button>
    </div>
  ),
};

export const NaturalWidth: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>結果を見る</Button>
      <Button variant="outline">成績を見る</Button>
      <Button variant="ghost">ランキング</Button>
    </div>
  ),
};

export const FullWidth: Story = {
  render: () => (
    <div className="max-w-md space-y-3">
      <Button className="w-full">試合結果を見る</Button>
      <Button className="w-full" variant="outline">
        成績を見る
      </Button>
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>
        <Mail data-icon="inline-start" />
        お問い合わせ
      </Button>
      <Button variant="secondary">
        <Plus data-icon="inline-start" />
        試合を追加
      </Button>
      <Button variant="outline">
        次の試合へ
        <ArrowRight data-icon="inline-end" />
      </Button>
    </div>
  ),
};

export const IconSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="icon-sm" aria-label="Small icon button">
        <Mail />
      </Button>
      <Button size="icon" aria-label="Default icon button">
        <Mail />
      </Button>
      <Button size="icon-lg" aria-label="Large icon button">
        <Mail />
      </Button>
    </div>
  ),
};

export const AsChild: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button asChild>
        <Link href="/teams">チームを見る</Link>
      </Button>
      <Button asChild variant="outline">
        <Link href="https://example.com" rel="noreferrer" target="_blank">
          外部リンク
        </Link>
      </Button>
      <Button asChild loading>
        <Link href="/games" rel="noreferrer" target="_blank">
          試合を見る
        </Link>
      </Button>
    </div>
  ),
};
