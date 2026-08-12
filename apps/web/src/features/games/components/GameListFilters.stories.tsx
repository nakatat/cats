import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, within } from 'storybook/test';

import { GameListFilters } from '@/features/games/components/GameListFilters';

const meta = {
  title: 'Features/Games/GameListFilters',
  component: GameListFilters,
  parameters: {
    layout: 'padded',
  },
  tags: ['component-test'],
  args: {
    season: 'all',
    tournament: 'all',
    result: 'all',
    sort: 'date-desc',
    seasonOptions: [
      [2019, '2019年'],
      [2018, '2018年'],
    ],
    tournamentOptions: [
      {
        value: 'tournament-name:ルーキーリーグ',
        label: 'ルーキーリーグ',
        tournamentIds: [1],
      },
      {
        value: 'tournament-name:練習試合',
        label: '練習試合',
        tournamentIds: [2],
      },
    ],
    onSeasonChange: fn(),
    onTournamentChange: fn(),
    onResultChange: fn(),
    onSortChange: fn(),
    onReset: fn(),
    hasActiveFilters: false,
  },
} satisfies Meta<typeof GameListFilters>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [season, setSeason] = useState(args.season);
    const [tournament, setTournament] = useState(args.tournament);
    const [result, setResult] = useState(args.result);
    const [sort, setSort] = useState(args.sort);

    return (
      <GameListFilters
        {...args}
        season={season}
        tournament={tournament}
        result={result}
        sort={sort}
        onSeasonChange={(value) => {
          setSeason(value);
          args.onSeasonChange(value);
        }}
        onTournamentChange={(value) => {
          setTournament(value);
          args.onTournamentChange(value);
        }}
        onResultChange={(value) => {
          setResult(value);
          args.onResultChange(value);
        }}
        onSortChange={(value) => {
          setSort(value);
          args.onSortChange(value);
        }}
      />
    );
  },
  play: async ({ args, canvas, userEvent }) => {
    const body = within(document.body);

    await userEvent.click(canvas.getByRole('combobox', { name: '勝敗' }));
    await userEvent.click(body.getByRole('option', { name: '勝利' }));

    await expect(args.onResultChange).toHaveBeenCalledWith('win');
    await expect(
      canvas.getByRole('combobox', { name: '勝敗' })
    ).toHaveTextContent('勝利');
  },
};

export const WithActiveFilters: Story = {
  args: {
    season: '2019',
    tournament: '1',
    result: 'win',
    sort: 'date-asc',
    hasActiveFilters: true,
  },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: '条件をリセット' })
    );

    await expect(args.onReset).toHaveBeenCalledOnce();
  },
};
