import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Box } from '@/components/system/Box';
import { Typography } from '@/components/system/Typography';

import { SiteShell } from './SiteShell';

const meta = {
  title: 'Components/Layout/SiteShell',
  component: SiteShell,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    children: null,
  },
} satisfies Meta<typeof SiteShell>;

export default meta;

type Story = StoryObj<typeof meta>;

const longContentItems = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  title: `コンテンツ ${index + 1}`,
}));

function ShortPageContent() {
  return (
    <Box
      width="100%"
      maxWidth={1440}
      className="mx-auto px-4 py-8 sm:px-6 lg:px-8"
    >
      <Box
        surface="default"
        display="flex"
        direction="column"
        gap="sm"
        className="p-6"
      >
        <Typography
          as="p"
          variant="caption"
          tone="primary"
          weight="semibold"
          className="tracking-[0.24em] uppercase"
        >
          Games
        </Typography>
        <Typography as="h1" variant="headingLg">
          試合一覧
        </Typography>
        <Typography as="p" variant="bodySm" tone="muted">
          試合結果と今後の予定を確認できます。
        </Typography>
      </Box>
    </Box>
  );
}

function LongPageContent() {
  return (
    <Box
      width="100%"
      maxWidth={1440}
      display="flex"
      direction="column"
      gap="lg"
      className="mx-auto px-4 py-8 sm:px-6 lg:px-8"
    >
      <Box display="flex" direction="column" gap="sm">
        <Typography
          as="p"
          variant="caption"
          tone="primary"
          weight="semibold"
          className="tracking-[0.24em] uppercase"
        >
          Players
        </Typography>
        <Typography as="h1" variant="headingLg">
          選手一覧
        </Typography>
        <Typography as="p" variant="bodySm" tone="muted">
          SiteShell内で縦に続くコンテンツの表示を確認します。
        </Typography>
      </Box>

      {longContentItems.map((item) => (
        <Box key={item.id} surface="default" className="p-6">
          <Typography as="h2" variant="headingSm">
            {item.title}
          </Typography>
          <Typography as="p" variant="bodySm" tone="muted" className="mt-2">
            SiteShell内で縦に並ぶダミーコンテンツです。
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

function FullBleedPageContent() {
  return (
    <>
      <Box as="section" className="bg-primary text-primary-foreground">
        <Box
          width="100%"
          maxWidth={1440}
          className="mx-auto px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
        >
          <Typography as="h1" variant="display" tone="primaryForeground">
            新琴似CATS
          </Typography>

          <Typography
            as="p"
            variant="bodySm"
            tone="primaryForeground"
            className="mt-3 max-w-xl opacity-[0.85]"
          >
            full-bleed sectionと通常のcontainer
            sectionを同じmain内で表示する例です。
          </Typography>
        </Box>
      </Box>

      <Box
        width="100%"
        maxWidth={1440}
        className="mx-auto px-4 py-8 sm:px-6 lg:px-8"
      >
        <Box
          surface="default"
          display="flex"
          direction="column"
          gap="sm"
          className="p-6"
        >
          <Typography as="h2" variant="headingMd">
            コンテナ内セクション
          </Typography>
          <Typography as="p" variant="bodySm" tone="muted">
            main自体に幅制限を持たせず、ページ側で必要なcontainerを指定します。
          </Typography>
        </Box>
      </Box>
    </>
  );
}

export const ShortContent: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/games',
      },
    },
  },
  render: () => (
    <SiteShell>
      <ShortPageContent />
    </SiteShell>
  ),
};

export const LongContent: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/players',
      },
    },
  },
  render: () => (
    <SiteShell>
      <LongPageContent />
    </SiteShell>
  ),
};

export const FullBleedAndContained: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/about',
      },
    },
  },
  render: () => (
    <SiteShell>
      <FullBleedPageContent />
    </SiteShell>
  ),
};

export const Mobile: Story = {
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
  render: () => (
    <SiteShell>
      <ShortPageContent />
    </SiteShell>
  ),
};
