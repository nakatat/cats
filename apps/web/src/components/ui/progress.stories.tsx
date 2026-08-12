import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Progress } from '@/components/ui/progress';

const values = [0, 25, 50, 75, 100];

const meta = {
  title: 'Components/UI/Progress',
  component: Progress,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
  },
} satisfies Meta<typeof Progress>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    'aria-label': '進捗',
    value: 50,
  },
};

export const Values: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-3">
      {values.map((value) => (
        <div key={value} className="flex items-center gap-3">
          <Progress aria-label={`${value}% 完了`} value={value} />
          <span className="text-muted-foreground w-10 text-right text-sm">
            {value}%
          </span>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-4">
      <Progress aria-label="小さい進捗" className="h-1" value={50} />
      <Progress aria-label="標準の進捗" className="h-2" value={50} />
      <Progress aria-label="大きい進捗" className="h-3" value={50} />
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <span id="batting-average-progress" className="font-medium">
          打率目標
        </span>
        <span className="text-muted-foreground text-sm">72%</span>
      </div>
      <Progress aria-labelledby="batting-average-progress" value={72} />
    </div>
  ),
};

export const SeasonProgress: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <span id="season-progress" className="font-medium">
          シーズン進行状況
        </span>
        <span className="text-muted-foreground text-sm">8 / 12 試合</span>
      </div>
      <Progress aria-labelledby="season-progress" value={67} />
    </div>
  ),
};
