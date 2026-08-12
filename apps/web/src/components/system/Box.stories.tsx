import { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { CSSProperties, ReactNode } from 'react';

import { Box, type BoxElement, type BoxProps } from '@/components/system/Box';

type BoxStoryArgs = Pick<
  BoxProps,
  'align' | 'direction' | 'display' | 'gap' | 'justify' | 'surface' | 'wrap'
> & {
  as: BoxElement;
  maxWidth?: CSSProperties['maxWidth'];
  width?: CSSProperties['width'];
};

const meta = {
  title: 'Components/System/Box',
  component: Box,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    as: {
      control: 'select',
      options: [
        'div',
        'main',
        'section',
        'article',
        'aside',
        'header',
        'footer',
        'nav',
      ],
    },
    display: {
      control: 'select',
      options: ['block', 'flex', 'inlineFlex', 'grid', 'none'],
    },
    direction: {
      control: 'select',
      options: ['row', 'column'],
    },
    wrap: {
      control: 'select',
      options: ['nowrap', 'wrap'],
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch'],
    },
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'between'],
    },
    gap: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
    },
    surface: {
      control: 'select',
      options: ['none', 'default', 'muted', 'highlight'],
    },
    width: {
      control: 'text',
    },
    maxWidth: {
      control: 'text',
    },
  },
} satisfies Meta<BoxStoryArgs>;

export default meta;

type Story = StoryObj<BoxStoryArgs>;

function Item({ children }: { children: ReactNode }) {
  return (
    <Box className="bg-muted text-foreground rounded-md px-3 py-2 text-sm">
      {children}
    </Box>
  );
}

export const Playground: Story = {
  args: {
    as: 'div',
    display: 'flex',
    direction: 'column',
    wrap: 'nowrap',
    align: 'stretch',
    justify: 'start',
    gap: 'md',
    surface: 'default',
    width: '100%',
    maxWidth: '36rem',
  },
  render: ({
    align,
    as,
    direction,
    display,
    gap,
    justify,
    maxWidth,
    surface,
    width,
    wrap,
  }) => (
    <Box
      align={align}
      as={as}
      direction={direction}
      display={display}
      gap={gap}
      justify={justify}
      maxWidth={maxWidth}
      surface={surface}
      width={width}
      wrap={wrap}
      className="p-4"
    >
      <Item>Box の表示内容</Item>
      <Item>Controls でレイアウトを変更できます</Item>
    </Box>
  ),
};

export const Displays: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="md" className="max-w-xl">
      <Box display="block" surface="default" className="p-3">
        block
      </Box>
      <Box display="flex" gap="sm" surface="default" className="p-3">
        <Item>flex</Item>
        <Item>item</Item>
      </Box>
      <Box surface="default" className="p-3">
        <Box display="inlineFlex" gap="sm">
          <Item>inlineFlex</Item>
          <Item>item</Item>
        </Box>
      </Box>
      <Box
        display="grid"
        gap="sm"
        surface="default"
        className="grid-cols-2 p-3"
      >
        <Item>grid</Item>
        <Item>item</Item>
      </Box>
      <Box surface="default" className="p-3">
        <Box display="none">この内容は表示されません</Box>
        <span className="text-muted-foreground text-sm">none: hidden</span>
      </Box>
    </Box>
  ),
};

export const FlexDirections: Story = {
  render: () => (
    <Box display="flex" gap="md" wrap="wrap" className="max-w-xl">
      <Box
        display="flex"
        direction="row"
        gap="sm"
        surface="default"
        className="p-4"
      >
        <Item>row</Item>
        <Item>横並び</Item>
      </Box>
      <Box
        display="flex"
        direction="column"
        gap="sm"
        surface="default"
        className="p-4"
      >
        <Item>column</Item>
        <Item>縦並び</Item>
      </Box>
    </Box>
  ),
};

export const Alignment: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="md" className="max-w-xl">
      <Box
        align="center"
        display="flex"
        gap="sm"
        justify="between"
        surface="default"
        className="h-24 p-3"
      >
        <Item>align center</Item>
        <Item>justify between</Item>
      </Box>
      <Box
        align="end"
        display="flex"
        gap="sm"
        justify="end"
        surface="default"
        className="h-24 p-3"
      >
        <Item>align end</Item>
        <Item>justify end</Item>
      </Box>
      <Box
        display="flex"
        gap="sm"
        surface="default"
        wrap="wrap"
        className="max-w-xs p-3"
      >
        <Item>wrap</Item>
        <Item>wrap</Item>
        <Item>wrap</Item>
        <Item>wrap</Item>
      </Box>
    </Box>
  ),
};

export const Gaps: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="md" className="max-w-xl">
      {(['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const).map((gap) => (
        <Box
          key={gap}
          display="flex"
          gap={gap}
          surface="default"
          className="p-3"
        >
          <Item>{gap}</Item>
          <Item>gap</Item>
        </Box>
      ))}
    </Box>
  ),
};

export const Widths: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="md">
      <Box width={240} surface="default" className="p-4">
        width=&#123;240&#125;
      </Box>
      <Box width="100%" maxWidth={640} surface="default" className="p-4">
        width=&quot;100%&quot; / maxWidth=&#123;640&#125;
      </Box>
      <Box maxWidth="48rem" surface="default" className="p-4">
        maxWidth=&quot;48rem&quot;
      </Box>
    </Box>
  ),
};

export const Surfaces: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="md" className="max-w-xl">
      {(['none', 'default', 'muted', 'highlight'] as const).map((surface) => (
        <Box key={surface} surface={surface} className="p-4 text-sm">
          {surface}
        </Box>
      ))}
    </Box>
  ),
};

export const AsElements: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="sm" className="max-w-xl">
      <Box as="div" surface="muted" className="p-3">
        div
      </Box>
      <Box as="section" surface="muted" className="p-3">
        section
      </Box>
      <Box as="article" surface="muted" className="p-3">
        article
      </Box>
      <Box as="aside" surface="muted" className="p-3">
        aside
      </Box>
      <Box
        as="nav"
        aria-label="Storybook用ナビゲーション"
        surface="muted"
        className="p-3"
      >
        nav
      </Box>
    </Box>
  ),
};

export const ContainerExample: Story = {
  render: () => (
    <Box width="100%" maxWidth={1440} className="mx-auto px-4 sm:px-6 lg:px-8">
      <Box surface="default" className="p-4">
        Container 相当の内容
      </Box>
    </Box>
  ),
};

export const StackExample: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="md" className="max-w-sm">
      <Item>1行目</Item>
      <Item>2行目</Item>
      <Item>3行目</Item>
    </Box>
  ),
};

export const InlineExample: Story = {
  render: () => (
    <Box
      align="center"
      direction="row"
      display="flex"
      gap="sm"
      wrap="wrap"
      className="max-w-sm"
    >
      <Item>新琴似CATS</Item>
      <Item>2026年度</Item>
      <Item>打撃成績</Item>
    </Box>
  ),
};

export const SectionExample: Story = {
  render: () => (
    <Box as="section" surface="muted" className="py-10 sm:py-14">
      <Box
        width="100%"
        maxWidth={1440}
        className="mx-auto px-4 sm:px-6 lg:px-8"
      >
        <Box display="flex" direction="column" gap="md">
          <p className="text-sm font-medium">今季チーム成績</p>
          <p className="text-muted-foreground text-sm">
            背景面、コンテナ、縦方向の間隔を Box の組み合わせで表現します。
          </p>
        </Box>
      </Box>
    </Box>
  ),
};

function RefExample() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <Box as="section" ref={sectionRef} surface="default" className="p-3">
      ref付きsection
    </Box>
  );
}

export const WithRefs: Story = {
  render: () => <RefExample />,
};
