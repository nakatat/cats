import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import { FilterSelect } from '@/components/ui/filter-select';
import { SelectItem } from '@/components/ui/select';

const meta = {
  title: 'Components/UI/FilterSelect',
  component: FilterSelect,
  parameters: {
    layout: 'padded',
  },
  args: {
    id: 'filter-select-playground',
    label: 'シーズン',
    value: 'all',
    onValueChange: fn(),
    children: (
      <>
        <SelectItem value="all">すべて</SelectItem>
        <SelectItem value="2025">2025年</SelectItem>
        <SelectItem value="2024">2024年</SelectItem>
      </>
    ),
  },
} satisfies Meta<typeof FilterSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
