import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from '@/components/ui/avatar';

const avatarSizes = ['sm', 'default', 'lg', 'xl'] as const;

const players = [
  { name: '中田 太郎', number: '10', fallback: '中' },
  { name: '佐藤 恒一', number: '18', fallback: '佐' },
  { name: '鈴木 健', number: '7', fallback: '鈴' },
];

const meta = {
  title: 'Components/UI/Avatar',
  component: Avatar,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    size: {
      control: 'select',
      options: avatarSizes,
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    size: 'default',
    children: (
      <>
        <AvatarImage alt="新琴似CATS" src="/brand/cats-logo-mark.png" />
        <AvatarFallback>CA</AvatarFallback>
      </>
    ),
  },
};

export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage alt="新琴似CATS" src="/brand/cats-logo-mark.png" />
      <AvatarFallback>CA</AvatarFallback>
    </Avatar>
  ),
};

export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>中</AvatarFallback>
    </Avatar>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {avatarSizes.map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Avatar size={size}>
            <AvatarFallback>中</AvatarFallback>
          </Avatar>
          <span className="text-muted-foreground text-xs">{size}</span>
        </div>
      ))}
    </div>
  ),
};

export const WithBadge: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="lg">
        <AvatarFallback>中</AvatarFallback>
        <AvatarBadge aria-label="オンライン" />
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>佐</AvatarFallback>
        <AvatarBadge
          aria-label="離席中"
          className="bg-secondary text-secondary-foreground"
        />
      </Avatar>
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <AvatarGroup>
      <Avatar>
        <AvatarFallback>中</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>佐</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>鈴</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>+3</AvatarGroupCount>
    </AvatarGroup>
  ),
};

export const PlayerList: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-3">
      {players.map((player) => (
        <div key={player.number} className="flex items-center gap-3">
          <Avatar size="sm">
            <AvatarFallback>{player.fallback}</AvatarFallback>
          </Avatar>
          <span className="min-w-0 flex-1 font-medium">{player.name}</span>
          <span className="text-muted-foreground text-sm">
            #{player.number}
          </span>
        </div>
      ))}
    </div>
  ),
};
