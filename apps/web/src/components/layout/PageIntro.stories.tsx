import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { PageIntro } from './PageIntro';

const meta = {
  title: 'Components/Layout/PageIntro',
  component: PageIntro,
  parameters: {
    layout: 'padded',
  },
  args: {
    iconSrc: '/icons/icon-games.png',
    title: '試合一覧',
    description: '新琴似CATSの試合結果をご覧いただけます。',
  },
} satisfies Meta<typeof PageIntro>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Players: Story = {
  args: {
    iconSrc: '/icons/icon-players.png',
    title: '選手一覧',
    description: '新琴似CATSに所属する選手の一覧です。',
  },
};

export const Stats: Story = {
  args: {
    iconSrc: '/icons/icon-batting.png',
    title: '成績一覧',
    description: 'チーム・選手成績をシーズンごとに確認できます。',
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
