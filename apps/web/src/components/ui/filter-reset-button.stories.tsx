import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import { FilterResetButton } from '@/components/ui/filter-reset-button';

const meta = {
  title: 'Components/UI/FilterResetButton',
  component: FilterResetButton,
  parameters: {
    layout: 'padded',
  },
  args: {
    onReset: fn(),
  },
} satisfies Meta<typeof FilterResetButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
