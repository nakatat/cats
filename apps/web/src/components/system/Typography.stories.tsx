import { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Box } from '@/components/system/Box';
import {
  Typography,
  type TypographyElement,
  type TypographyProps,
} from '@/components/system/Typography';

type TypographyStoryArgs = Pick<
  TypographyProps,
  'align' | 'tone' | 'variant' | 'weight'
> & {
  as: TypographyElement;
  children: string;
};

const meta = {
  title: 'Components/System/Typography',
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    as: {
      control: 'select',
      options: [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'p',
        'span',
        'div',
        'strong',
        'small',
      ],
    },
    variant: {
      control: 'select',
      options: [
        'display',
        'headingXl',
        'headingLg',
        'headingMd',
        'headingSm',
        'body',
        'bodySm',
        'caption',
        'label',
      ],
    },
    tone: {
      control: 'select',
      options: [
        'default',
        'inherit',
        'muted',
        'primary',
        'primaryForeground',
        'destructive',
      ],
    },
    weight: {
      control: 'select',
      options: ['normal', 'medium', 'semibold', 'bold'],
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right'],
    },
    children: {
      control: 'text',
    },
  },
} satisfies Meta<TypographyStoryArgs>;

export default meta;

type Story = StoryObj<TypographyStoryArgs>;

export const Playground: Story = {
  args: {
    as: 'h2',
    variant: 'headingLg',
    tone: 'default',
    children: '最近の試合',
  },
  render: ({ align, as, children, tone, variant, weight }) => (
    <Typography
      align={align}
      as={as}
      tone={tone}
      variant={variant}
      weight={weight}
    >
      {children}
    </Typography>
  ),
};

export const Variants: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="md" className="max-w-3xl">
      <Typography as="h1" variant="display">
        新琴似CATS
      </Typography>
      <Typography as="h2" variant="headingXl">
        2026年度 チーム成績
      </Typography>
      <Typography as="h2" variant="headingLg">
        最近の試合
      </Typography>
      <Typography as="h3" variant="headingMd">
        6月22日（日）の試合予定
      </Typography>
      <Typography as="h4" variant="headingSm">
        集合時刻
      </Typography>
      <Typography as="p" variant="body">
        新琴似CATSは札幌市を拠点に活動する草野球チームです。
      </Typography>
      <Typography as="p" tone="muted" variant="bodySm">
        詳細な試合情報は各試合ページから確認できます。
      </Typography>
      <Typography as="small" tone="muted" variant="caption">
        最終更新: 2026年6月22日
      </Typography>
      <Typography as="span" variant="label">
        試合結果
      </Typography>
    </Box>
  ),
};

export const Tones: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="sm" className="max-w-xl">
      <Typography tone="default">標準のテキスト</Typography>
      <Box className="bg-primary p-3">
        <Typography tone="primaryForeground">
          プライマリ背景上のテキスト
        </Typography>
      </Box>
      <Typography tone="muted">補足のテキスト</Typography>
      <Typography tone="primary">強調したい成績</Typography>
      <Typography tone="destructive">確認が必要な情報</Typography>
    </Box>
  ),
};

export const Weights: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="sm" className="max-w-xl">
      <Typography weight="normal">normal</Typography>
      <Typography weight="medium">medium</Typography>
      <Typography weight="semibold">semibold</Typography>
      <Typography weight="bold">bold</Typography>
    </Box>
  ),
};

export const Alignments: Story = {
  render: () => (
    <Box surface="muted" className="max-w-xl p-4">
      <Box display="flex" direction="column" gap="sm">
        <Typography align="left">左揃えのテキスト</Typography>
        <Typography align="center">中央揃えのテキスト</Typography>
        <Typography align="right">右揃えのテキスト</Typography>
      </Box>
    </Box>
  ),
};

export const SemanticHeadings: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="sm" className="max-w-xl">
      <Typography as="h1" variant="headingXl">
        チーム情報
      </Typography>
      <Typography as="h2" variant="headingLg">
        最近の試合
      </Typography>
      <Typography as="h3" variant="headingSm">
        試合結果
      </Typography>
    </Box>
  ),
};

export const VisualHierarchy: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="sm" className="max-w-xl">
      <Typography as="h2" variant="headingLg">
        大きなh2
      </Typography>
      <Typography as="h2" variant="headingSm">
        小さなh2
      </Typography>
    </Box>
  ),
};

export const InContent: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="sm" className="max-w-xl">
      <Typography as="h2" variant="headingLg">
        最近の試合
      </Typography>
      <Typography as="p" tone="muted" variant="bodySm">
        直近の試合結果を紹介します。
      </Typography>
    </Box>
  ),
};

function RefExample() {
  const headingRef = useRef<HTMLHeadingElement>(null);

  return (
    <Typography as="h2" ref={headingRef} variant="headingMd">
      ref付き見出し
    </Typography>
  );
}

export const WithRefs: Story = {
  render: () => <RefExample />,
};
