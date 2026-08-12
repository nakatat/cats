import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';

import { ListPagination } from '@/components/ui/list-pagination';

const meta = {
  title: 'Components/UI/ListPagination',
  component: ListPagination,
  parameters: {
    layout: 'padded',
  },
  tags: ['component-test'],
  args: {
    currentPage: 1,
    totalPages: 5,
    href: '#list',
  },
} satisfies Meta<typeof ListPagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    onPageChange: fn(),
  },
  render: (args) => {
    const [currentPage, setCurrentPage] = useState(args.currentPage);

    return (
      <ListPagination
        {...args}
        currentPage={currentPage}
        onPageChange={(page) => {
          setCurrentPage(page);
          args.onPageChange(page);
        }}
      />
    );
  },
  play: async ({ args, canvas, userEvent }) => {
    await expect(
      canvas.getByRole('link', { name: '前のページへ' })
    ).toHaveAttribute('aria-disabled', 'true');

    await userEvent.click(canvas.getByRole('link', { name: '2ページ' }));

    await expect(args.onPageChange).toHaveBeenCalledWith(2);
  },
};

export const WithEllipsis: Story = {
  args: {
    currentPage: 6,
    totalPages: 12,
    onPageChange: fn(),
  },
};
