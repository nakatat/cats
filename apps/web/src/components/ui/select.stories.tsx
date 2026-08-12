import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type SelectStoryArgs = {
  placeholder: string;
  size: 'sm' | 'default';
};

const meta = {
  title: 'Components/UI/Select',
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'default'],
    },
    placeholder: {
      control: 'text',
    },
  },
} satisfies Meta<SelectStoryArgs>;

export default meta;

type Story = StoryObj<SelectStoryArgs>;

export const Playground: Story = {
  args: {
    size: 'default',
    placeholder: 'シーズンを選択',
  },
  render: ({ placeholder, size }) => (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium" htmlFor="season-playground">
        対象シーズン
      </label>
      <Select>
        <SelectTrigger id="season-playground" size={size}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="2026">2026年度</SelectItem>
            <SelectItem value="2025">2025年度</SelectItem>
            <SelectItem value="all">通算</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground text-xs font-medium">sm</span>
        <Select defaultValue="2026">
          <SelectTrigger aria-label="小さいシーズン選択" size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="2026">2026年度</SelectItem>
              <SelectItem value="2025">2025年度</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground text-xs font-medium">
          default
        </span>
        <Select defaultValue="2026">
          <SelectTrigger aria-label="標準のシーズン選択" size="default">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="2026">2026年度</SelectItem>
              <SelectItem value="2025">2025年度</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium" htmlFor="grouped-season">
        表示する成績
      </label>
      <Select>
        <SelectTrigger className="w-48" id="grouped-season">
          <SelectValue placeholder="表示する成績を選択" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>シーズン別</SelectLabel>
            <SelectItem value="2026">2026年度</SelectItem>
            <SelectItem value="2025">2025年度</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>集計</SelectLabel>
            <SelectItem value="all">通算</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium" htmlFor="disabled-season">
          確定前のシーズン
        </label>
        <Select disabled>
          <SelectTrigger id="disabled-season">
            <SelectValue placeholder="シーズンを選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="2026">2026年度</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium" htmlFor="partially-disabled">
          表示対象
        </label>
        <Select defaultValue="2026">
          <SelectTrigger id="partially-disabled">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="2026">2026年度</SelectItem>
              <SelectItem disabled value="2027">
                2027年度（準備中）
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
};

export const SeasonFilter: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium" htmlFor="season-filter">
        成績の表示期間
      </label>
      <Select defaultValue="2026">
        <SelectTrigger className="w-40" id="season-filter">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="2026">2026年度</SelectItem>
            <SelectItem value="2025">2025年度</SelectItem>
            <SelectItem value="all">通算</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const LongOptions: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium" htmlFor="tournament-filter">
        大会
      </label>
      <Select defaultValue="sapporo">
        <SelectTrigger className="w-72" id="tournament-filter">
          <SelectValue placeholder="大会を選択" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="sapporo">
              2026年度 札幌市草野球春季リーグ戦 Aブロック
            </SelectItem>
            <SelectItem value="hokkaido">
              北海道ベースボールクラブ親善大会
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};
