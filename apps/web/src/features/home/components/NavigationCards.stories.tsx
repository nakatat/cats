import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { NavigationCards } from '@/features/home/components/NavigationCards';

const meta = {
  title: 'Features/Home/NavigationCards',
  component: NavigationCards,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof NavigationCards>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};
