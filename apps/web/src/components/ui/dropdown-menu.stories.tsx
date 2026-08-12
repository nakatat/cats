import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  CalendarDaysIcon,
  Columns3Icon,
  CopyIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  Share2Icon,
  Trash2Icon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const meta = {
  title: 'Components/UI/DropdownMenu',
  component: DropdownMenu,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline">
          メニュー
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>表示設定</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>成績を見る</DropdownMenuItem>
          <DropdownMenuItem>
            コピー
            <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label="試合メニューを開く" size="icon" variant="outline">
          <EllipsisVerticalIcon data-icon="inline-start" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <EyeIcon />
            詳細を見る
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CopyIcon />
            試合情報をコピー
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Share2Icon />
            共有
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

function CheckboxItemsExample() {
  const [showAverage, setShowAverage] = useState(true);
  const [showHits, setShowHits] = useState(true);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline">
          表示列
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>成績表に表示する項目</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuCheckboxItem
            checked={showAverage}
            onCheckedChange={setShowAverage}
          >
            打率
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={showHits}
            onCheckedChange={setShowHits}
          >
            安打
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const CheckboxItems: Story = {
  render: () => <CheckboxItemsExample />,
};

function RadioItemsExample() {
  const [sortOrder, setSortOrder] = useState('average');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline">
          並び順
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>ランキングの並び順</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuRadioGroup
            onValueChange={setSortOrder}
            value={sortOrder}
          >
            <DropdownMenuRadioItem value="average">
              打率順
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="hits">安打順</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="games">
              試合数順
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const RadioItems: Story = {
  render: () => <RadioItemsExample />,
};

export const Submenu: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline">
          対象を選択
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem>通算成績</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <CalendarDaysIcon />
              シーズン別
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuGroup>
                <DropdownMenuItem>2026年度</DropdownMenuItem>
                <DropdownMenuItem>2025年度</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const Destructive: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline">
          操作
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem>編集</DropdownMenuItem>
          <DropdownMenuItem>複製</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive">
            <Trash2Icon />
            削除
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const GameActions: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="試合カードのメニューを開く"
          size="icon"
          variant="outline"
        >
          <EllipsisVerticalIcon data-icon="inline-start" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <EyeIcon />
            詳細を見る
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Share2Icon />
            共有
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Columns3Icon />
            成績を見る
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive">
            <Trash2Icon />
            削除
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
