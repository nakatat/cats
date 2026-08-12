import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ComponentProps } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type TabsStoryArgs = ComponentProps<typeof Tabs> & {
  listVariant: 'default' | 'line';
};

const meta = {
  title: 'Components/UI/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    listVariant: {
      control: 'select',
      options: ['default', 'line'],
    },
  },
} satisfies Meta<TabsStoryArgs>;

export default meta;

type Story = StoryObj<TabsStoryArgs>;

export const Playground: Story = {
  args: {
    listVariant: 'default',
    orientation: 'horizontal',
  },
  render: ({ listVariant, ...args }) => (
    <Tabs defaultValue="batting" {...args}>
      <TabsList variant={listVariant}>
        <TabsTrigger value="batting">打撃成績</TabsTrigger>
        <TabsTrigger value="pitching">投手成績</TabsTrigger>
      </TabsList>
      <TabsContent value="batting">打率・安打・打点を表示します。</TabsContent>
      <TabsContent value="pitching">
        防御率・投球回・奪三振を表示します。
      </TabsContent>
    </Tabs>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex max-w-lg flex-col gap-6">
      {(['default', 'line'] as const).map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <p className="text-muted-foreground text-xs font-medium uppercase">
            {variant}
          </p>
          <Tabs defaultValue="games">
            <TabsList variant={variant}>
              <TabsTrigger value="games">試合</TabsTrigger>
              <TabsTrigger value="players">選手</TabsTrigger>
            </TabsList>
            <TabsContent value="games">試合情報</TabsContent>
            <TabsContent value="players">選手情報</TabsContent>
          </Tabs>
        </div>
      ))}
    </div>
  ),
};

export const Orientations: Story = {
  render: () => (
    <div className="grid max-w-2xl gap-8 md:grid-cols-2">
      <Tabs className="min-h-36 max-w-sm" defaultValue="batting">
        <TabsList>
          <TabsTrigger value="batting">打撃</TabsTrigger>
          <TabsTrigger value="pitching">投手</TabsTrigger>
        </TabsList>
        <TabsContent value="batting">水平タブの表示例です。</TabsContent>
        <TabsContent value="pitching">投手成績を表示します。</TabsContent>
      </Tabs>
      <Tabs
        className="min-h-36 max-w-sm"
        defaultValue="batting"
        orientation="vertical"
      >
        <TabsList className="w-24 shrink-0">
          <TabsTrigger value="batting">打撃</TabsTrigger>
          <TabsTrigger value="pitching">投手</TabsTrigger>
        </TabsList>
        <TabsContent value="batting">垂直タブの表示例です。</TabsContent>
        <TabsContent value="pitching">投手成績を表示します。</TabsContent>
      </Tabs>
    </div>
  ),
};

export const Stats: Story = {
  render: () => (
    <Tabs className="max-w-lg" defaultValue="batting">
      <TabsList variant="line">
        <TabsTrigger value="batting">打撃成績</TabsTrigger>
        <TabsTrigger value="pitching">投手成績</TabsTrigger>
      </TabsList>
      <TabsContent value="batting" className="pt-3">
        打率 .421 / 安打 12 / 打点 9
      </TabsContent>
      <TabsContent value="pitching" className="pt-3">
        防御率 2.38 / 投球回 24.0 / 奪三振 18
      </TabsContent>
    </Tabs>
  ),
};

export const SeasonTabs: Story = {
  render: () => (
    <Tabs className="max-w-lg" defaultValue="2026">
      <TabsList variant="line">
        <TabsTrigger value="2026">2026</TabsTrigger>
        <TabsTrigger value="2025">2025</TabsTrigger>
        <TabsTrigger value="all">通算</TabsTrigger>
      </TabsList>
      <TabsContent value="2026" className="pt-3">
        2026年度のチーム成績を表示します。
      </TabsContent>
      <TabsContent value="2025" className="pt-3">
        2025年度のチーム成績を表示します。
      </TabsContent>
      <TabsContent value="all" className="pt-3">
        通算成績を表示します。
      </TabsContent>
    </Tabs>
  ),
};
