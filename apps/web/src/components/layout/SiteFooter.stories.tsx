import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SiteFooter } from '@/components/layout/SiteFooter';

const meta = {
  title: 'Components/Layout/SiteFooter',
  component: SiteFooter,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SiteFooter>;

export default meta;

type Story = StoryObj<typeof meta>;

function FooterPreview() {
  return (
    <div className="bg-background min-h-screen">
      <main className="mx-auto flex min-h-56 max-w-360 flex-col justify-end px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-primary text-xs font-semibold tracking-[0.28em] uppercase">
          Shinkotoni Cats
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">非公式サイト</h1>
      </main>
      <SiteFooter />
    </div>
  );
}

export const Default: Story = {
  render: () => <FooterPreview />,
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => <FooterPreview />,
};
