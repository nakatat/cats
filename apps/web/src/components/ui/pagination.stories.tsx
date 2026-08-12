import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ComponentProps } from 'react';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

type PaginationStoryArgs = ComponentProps<typeof Pagination> & {
  currentPage: number;
};

function PageLinks({ currentPage }: { currentPage: number }) {
  return (
    <>
      {[1, 2, 3, 4, 5].map((page) => (
        <PaginationItem key={page}>
          <PaginationLink href="#" isActive={page === currentPage}>
            {page}
          </PaginationLink>
        </PaginationItem>
      ))}
    </>
  );
}

const meta = {
  title: 'Components/UI/Pagination',
  component: Pagination,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    currentPage: {
      control: { type: 'number', min: 1, max: 5, step: 1 },
    },
  },
} satisfies Meta<PaginationStoryArgs>;

export default meta;

type Story = StoryObj<PaginationStoryArgs>;

export const Playground: Story = {
  args: {
    currentPage: 2,
  },
  render: ({ currentPage, ...args }) => (
    <Pagination {...args}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PageLinks currentPage={currentPage} />
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

export const Basic: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PageLinks currentPage={3} />
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

export const WithEllipsis: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            9
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">10</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

export const Compact: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

export const GameListPagination: Story = {
  render: () => (
    <div className="flex max-w-lg flex-col gap-4">
      <p className="font-medium">試合一覧</p>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PageLinks currentPage={2} />
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  ),
};
