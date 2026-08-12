'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { StatsSectionsSkeleton } from '@/components/layout/StatsPageSkeleton';
import { Box } from '@/components/system/Box';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent } from '@/components/ui/tabs';

import { BattingStatsSection } from './components/BattingStatsSection';
import { PitchingStatsSection } from './components/PitchingStatsSection';
import { StatsFilter } from './components/StatsFilter';
import { StatsSectionNavigation } from './components/StatsSectionNavigation';
import {
  createBattingLeaders,
  createBattingLeadersFromRanking,
  createPitchingLeaders,
  createPitchingLeadersFromRanking,
} from './data/statLeaders';
import {
  CAREER_SEASON,
  type StatsFilterValue,
  type StatsViewData,
} from './data/stats';

type StatsPageContentProps = {
  data: StatsViewData;
};

type StatsSection = 'batting' | 'pitching';

const defaultStatsSection: StatsSection = 'batting';

export function StatsPageContent({ data }: Readonly<StatsPageContentProps>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const sectionFromUrl = parseStatsSection(searchParams.get('section'));
  const [activeSection, setActiveSection] =
    useState<StatsSection>(sectionFromUrl);
  const [selectedSeason, setSelectedSeason] = useState(data.season);
  const [qualifiedOnly, setQualifiedOnly] = useState(false);
  const statsFilter: StatsFilterValue = qualifiedOnly ? 'qualified' : 'all';
  const battingStats = useMemo(
    () => filterStats(data.batting, statsFilter),
    [data.batting, statsFilter]
  );
  const pitchingStats = useMemo(
    () => filterStats(data.pitching, statsFilter),
    [data.pitching, statsFilter]
  );
  const battingLeaders = useMemo(
    () =>
      data.rankings?.[statsFilter === 'qualified' ? 'qualified' : 'all']
        ? createBattingLeadersFromRanking(
            statsFilter === 'qualified'
              ? data.rankings.qualified
              : data.rankings.all
          )
        : createBattingLeaders(battingStats),
    [battingStats, data.rankings, statsFilter]
  );
  const pitchingLeaders = useMemo(
    () =>
      data.rankings?.[statsFilter === 'qualified' ? 'qualified' : 'all']
        ? createPitchingLeadersFromRanking(
            statsFilter === 'qualified'
              ? data.rankings.qualified
              : data.rankings.all
          )
        : createPitchingLeaders(pitchingStats),
    [data.rankings, pitchingStats, statsFilter]
  );

  function handleSeasonChange(season: string) {
    setSelectedSeason(season);

    const params = new URLSearchParams(searchParams.toString());
    params.delete('season');
    params.delete('seasonYear');
    params.set('section', activeSection);

    if (season === CAREER_SEASON) {
      params.set('season', CAREER_SEASON);
    } else {
      params.set('seasonYear', season);
    }

    startTransition(() => {
      router.push(`/stats?${params.toString()}`, { scroll: false });
    });
  }

  function handleSectionChange(value: string) {
    if (value !== 'batting' && value !== 'pitching') {
      return;
    }

    setActiveSection(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set('section', value);
    router.push(`/stats?${params.toString()}`, { scroll: false });
  }

  useEffect(() => {
    setActiveSection(sectionFromUrl);
  }, [sectionFromUrl]);

  useEffect(() => {
    if (!isPending) {
      setSelectedSeason(data.season);
    }
  }, [data.season, isPending]);

  return (
    <Box display="flex" direction="column" gap="xl" aria-busy={isPending}>
      <Box
        display="grid"
        gap="xl"
        className="grid-cols-1 gap-y-1 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-y-4"
      >
        <Box
          display="flex"
          align="center"
          gap="sm"
          className="order-1 w-full sm:col-start-2 sm:row-start-1 sm:w-auto sm:gap-4"
        >
          <Box className="min-w-0 flex-1 sm:w-44 sm:flex-none">
            <label htmlFor="stats-season" className="sr-only">
              シーズン
            </label>
            <Select value={selectedSeason} onValueChange={handleSeasonChange}>
              <SelectTrigger id="stats-season" className="h-11 w-full">
                <SelectValue placeholder="集計期間を選択">
                  <span className="sm:hidden">
                    {selectedSeason === CAREER_SEASON
                      ? '通算'
                      : `${selectedSeason}年シーズン`}
                  </span>
                  <span className="hidden sm:inline">
                    {selectedSeason === CAREER_SEASON
                      ? '通算'
                      : `${selectedSeason}年シーズン`}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={CAREER_SEASON}>通算</SelectItem>
                  {data.seasons.map((season) => (
                    <SelectItem key={season} value={season}>
                      {season}年
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Box>
          <Box className="flex min-w-0 flex-1 justify-end sm:flex-none">
            <StatsFilter
              qualifiedOnly={qualifiedOnly}
              onQualifiedOnlyChange={setQualifiedOnly}
            />
          </Box>
        </Box>
        <Tabs
          value={activeSection}
          onValueChange={handleSectionChange}
          className="contents"
        >
          <Box className="order-2 sm:col-start-1 sm:row-start-1">
            <StatsSectionNavigation />
          </Box>
          {isPending ? (
            <Box className="order-3 sm:col-span-2 sm:row-start-2">
              <StatsSectionsSkeleton />
            </Box>
          ) : (
            <>
              <TabsContent
                value="batting"
                className="order-3 px-0 pt-0 sm:col-span-2 sm:row-start-2"
              >
                <BattingStatsSection
                  leaders={battingLeaders}
                  summary={data.battingSummary}
                  stats={battingStats}
                  qualificationThreshold={data.battingQualificationThreshold}
                />
              </TabsContent>
              <TabsContent
                value="pitching"
                className="order-3 px-0 pt-0 sm:col-span-2 sm:row-start-2"
              >
                <PitchingStatsSection
                  leaders={pitchingLeaders}
                  summary={data.pitchingSummary}
                  stats={pitchingStats}
                  qualificationThresholdText={
                    data.pitchingQualificationThresholdText
                  }
                />
              </TabsContent>
            </>
          )}
        </Tabs>
      </Box>
    </Box>
  );
}

function parseStatsSection(value: string | null): StatsSection {
  return value === 'pitching' ? 'pitching' : defaultStatsSection;
}

function filterStats<T extends { isQualified: boolean }>(
  stats: T[],
  filter: StatsFilterValue
) {
  return filter === 'qualified'
    ? stats.filter((stat) => stat.isQualified)
    : stats;
}
