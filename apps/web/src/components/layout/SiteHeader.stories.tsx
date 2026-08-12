import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SiteHeader } from '@/components/layout/SiteHeader';

const meta = {
  title: 'Components/Layout/SiteHeader',
  component: SiteHeader,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SiteHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

function HeaderPreview() {
  return (
    <div className="bg-background min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex min-h-180 max-w-360 flex-col gap-4 px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-primary text-xs font-semibold tracking-[0.28em] uppercase">
          Shinkotoni Cats
        </p>
        <h1 className="text-3xl font-bold tracking-tight">チームのページ</h1>
        <p className="text-muted-foreground max-w-xl text-sm leading-7">
          Headerの下に続く本文を表示し、sticky配置とページ上部の接続を確認します。
        </p>
      </main>
    </div>
  );
}

export const Default: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/',
      },
    },
  },
  render: () => <HeaderPreview />,
};

export const Mobile: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/',
      },
    },
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => <HeaderPreview />,
};

export const GamesActive: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/games',
      },
    },
  },
  render: () => <HeaderPreview />,
};

export const MobileMenuOpen: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/games',
      },
    },
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => <HeaderPreview />,
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector<HTMLButtonElement>(
      'button[aria-label="メニューを開く"]'
    );

    if (!button) {
      throw new Error('モバイルメニューボタンが見つかりません');
    }

    button.click();
  },
};
