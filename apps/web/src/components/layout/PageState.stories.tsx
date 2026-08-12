import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FileQuestion, TriangleAlert } from 'lucide-react';

import { PageState } from '@/components/layout/PageState';
import { Button } from '@/components/ui/button';

const meta = {
  title: 'Components/Layout/PageState',
  component: PageState,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    code: {
      control: 'text',
    },
    title: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
    icon: {
      control: false,
    },
    actions: {
      control: false,
    },
  },
} satisfies Meta<typeof PageState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    code: '404',
    title: 'ページが見つかりません',
    description:
      '指定されたページは見つかりませんでした。URLをご確認ください。',
    icon: <FileQuestion className="size-7" />,
    actions: <Button>トップへ戻る</Button>,
  },
  render: ({ actions, code, description, icon, title }) => (
    <PageState
      actions={actions}
      code={code}
      description={description}
      icon={icon}
      title={title}
    />
  ),
};

export const NotFound: Story = {
  args: {
    code: '404',
    title: 'ページが見つかりません',
    description:
      '指定されたページは見つかりませんでした。URLをご確認いただくか、トップページへ戻ってください。',
    icon: <FileQuestion className="size-7" />,
    actions: <Button>トップへ戻る</Button>,
  },
  render: ({ actions, code, description, icon, title }) => (
    <PageState
      actions={actions}
      code={code}
      description={description}
      icon={icon}
      title={title}
    />
  ),
};

export const Error: Story = {
  args: {
    code: 'ERROR',
    title: 'エラーが発生しました',
    description:
      'ページの読み込みに失敗しました。時間をおいて再度お試しください。',
    icon: <TriangleAlert className="size-7" />,
    actions: (
      <>
        <Button>再試行</Button>
        <Button variant="outline">トップへ戻る</Button>
      </>
    ),
  },
  render: ({ actions, code, description, icon, title }) => (
    <PageState
      actions={actions}
      code={code}
      description={description}
      icon={icon}
      title={title}
    />
  ),
};
