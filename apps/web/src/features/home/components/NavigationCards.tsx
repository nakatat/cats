import { ChartNoAxesColumnIncreasing } from 'lucide-react';

import { Box } from '@/components/system/Box';
import { Typography } from '@/components/system/Typography';

import { NavigationCard } from './NavigationCard';

const navigationCards = [
  {
    href: '/games',
    title: '試合一覧',
    description: '試合結果と予定をまとめて確認',
    icon: '/icons/icon-games.png',
  },
  {
    href: '/players',
    title: '選手一覧',
    description: '背番号やポジションを確認',
    icon: '/icons/icon-players.png',
  },
  {
    href: '/stats?section=batting',
    title: '打撃成績',
    description: '個人成績を一覧で比較',
    icon: '/icons/icon-batting.png',
  },
  {
    href: '/stats?section=pitching',
    title: '投手成績',
    description: '防御率や登板記録を確認',
    icon: '/icons/icon-pitching.png',
  },
] as const;

export function NavigationCards() {
  return (
    <Box as="section" display="flex" direction="column" gap="lg">
      <Box display="flex" align="center" gap="sm">
        <ChartNoAxesColumnIncreasing
          aria-hidden="true"
          className="text-primary size-6"
        />
        <Typography as="h2" variant="headingMd">
          データを見る
        </Typography>
      </Box>

      <Box display="grid" gap="md" className="grid-cols-2 lg:grid-cols-4">
        {navigationCards.map((card) => (
          <NavigationCard key={card.href} {...card} />
        ))}
      </Box>
    </Box>
  );
}
