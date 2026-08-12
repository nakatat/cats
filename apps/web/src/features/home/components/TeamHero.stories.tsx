import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { TeamHero } from '@/features/home/components/TeamHero';

import { homeTeam } from './home.mock';

const meta = {
  title: 'Features/Home/TeamHero',
  component: TeamHero,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof TeamHero>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    team: homeTeam,
  },
};

export const Mobile: Story = {
  args: {
    team: homeTeam,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const LongTeamName: Story = {
  args: {
    team: {
      ...homeTeam,
      name: '新琴似キャッツベースボールクラブ',
    },
  },
};

export const LongDescription: Story = {
  args: {
    team: {
      ...homeTeam,
      description:
        '札幌市を拠点に、仲間と野球を楽しみながら勝利を目指して活動しています。地域の皆さまに応援されるチームを目指し、毎週の試合と練習に全力で取り組んでいます。',
    },
  },
};

export const NoDescription: Story = {
  args: {
    team: {
      ...homeTeam,
      description: '',
    },
  },
};
