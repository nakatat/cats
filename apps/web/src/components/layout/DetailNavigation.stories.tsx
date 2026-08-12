import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { DetailNavigation } from '@/components/layout/DetailNavigation';

const meta = {
  title: 'Components/Layout/DetailNavigation',
  component: DetailNavigation,
  parameters: {
    layout: 'padded',
  },
  args: {
    previous: {
      href: '#previous',
      label: '前の試合',
      title: '2018年10月28日 つるぎ団戦',
    },
    next: {
      href: '#next',
      label: '次の試合',
      title: '2019年6月22日 未定戦',
    },
  },
} satisfies Meta<typeof DetailNavigation>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const PreviousOnly: Story = {
  args: {
    next: undefined,
  },
};

export const NextOnly: Story = {
  args: {
    previous: undefined,
  },
};

export const Empty: Story = {
  args: {
    previous: undefined,
    next: undefined,
  },
};
