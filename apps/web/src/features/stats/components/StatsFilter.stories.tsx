import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';

import { StatsFilter } from '@/features/stats/components/StatsFilter';

const meta = {
  title: 'Features/Stats/StatsFilter',
  component: StatsFilter,
  parameters: {
    layout: 'padded',
  },
  tags: ['component-test'],
  args: {
    qualifiedOnly: false,
    onQualifiedOnlyChange: fn(),
  },
} satisfies Meta<typeof StatsFilter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const toggle = canvas.getByRole('switch', { name: '規定到達のみ' });

    await expect(toggle).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(toggle);

    await expect(args.onQualifiedOnlyChange).toHaveBeenCalledWith(true);
  },
};

export const QualifiedOnly: Story = {
  args: {
    qualifiedOnly: true,
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('switch', { name: '規定到達のみ' })
    ).toHaveAttribute('aria-checked', 'true');
  },
};
