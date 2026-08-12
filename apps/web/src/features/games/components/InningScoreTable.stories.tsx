import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { InningScoreTable } from '@/features/games/components/InningScoreTable';

import {
  detailInningScores,
  extraInningScores,
  shortenedInningScores,
} from './game-detail.mock';

const meta = {
  title: 'Features/Games/InningScoreTable',
  component: InningScoreTable,
  parameters: {
    layout: 'padded',
  },
  args: {
    rows: detailInningScores,
    note: '9回コールド',
  },
} satisfies Meta<typeof InningScoreTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Default: Story = {};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const ExtraInnings: Story = {
  args: {
    rows: extraInningScores,
    note: null,
  },
};

export const ShortenedGame: Story = {
  args: {
    rows: shortenedInningScores,
    note: '7回コールド',
  },
};

export const MultilineNote: Story = {
  args: {
    note: '1年間お疲れさまでした。\n来年も頑張りましょう。',
  },
};

export const Draft: Story = {
  args: {
    rows: [],
    status: 'draft',
    note: null,
  },
};

export const Unregistered: Story = {
  args: {
    rows: [],
    status: 'unregistered',
    note: null,
  },
};
