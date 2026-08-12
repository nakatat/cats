import { describe, expect, it } from 'vitest';

import type {
  BattingLineResponse,
  PitchingLineResponse,
} from '@/lib/api/games';

import {
  calculateBattingAverage,
  calculateOnBasePercentage,
  calculateOps,
  calculatePitchingEarnedRunAverage,
  calculatePitchingStrikeoutsPerSeven,
  calculatePitchingWhip,
  calculateSluggingPercentage,
  formatRecentGameOuts,
} from './player-recent-games-calculations';

describe('formatRecentGameOuts', () => {
  it('outsがない場合はplaceholderを返す', () => {
    expect(formatRecentGameOuts()).toBe('—');
  });

  it('outsをイニングと残りアウトに変換する', () => {
    expect(formatRecentGameOuts(6)).toBe('2回');
    expect(formatRecentGameOuts(5)).toBe('1回2/3');
  });
});

describe('batting recent-game calculations', () => {
  const line: BattingLineResponse = {
    atBats: 10,
    hits: 4,
    doubles: 1,
    triples: 1,
    homeRuns: 1,
    walks: 2,
    hitByPitch: 1,
    sacrificeFlies: 1,
  };

  it('打数、安打、塁打から打率・出塁率・長打率・OPSを計算する', () => {
    expect(calculateBattingAverage(line)).toBe('.400');
    expect(calculateOnBasePercentage(line)).toBe('.500');
    expect(calculateSluggingPercentage(line)).toBe('1.000');
    expect(calculateOps(line)).toBe('1.500');
  });

  it('分母がないnullableなlineは各率を.000として表示する', () => {
    const emptyLine: BattingLineResponse = {};

    expect(calculateBattingAverage(emptyLine)).toBe('.000');
    expect(calculateOnBasePercentage(emptyLine)).toBe('.000');
    expect(calculateSluggingPercentage(emptyLine)).toBe('.000');
    expect(calculateOps(emptyLine)).toBe('.000');
  });
});

describe('pitching recent-game calculations', () => {
  it('自責点、被安打、四球、奪三振を9アウト基準の率へ変換する', () => {
    const line: PitchingLineResponse = {
      outsPitched: 9,
      earnedRuns: 2,
      hitsAllowed: 4,
      walks: 2,
      strikeouts: 3,
    };

    expect(calculatePitchingEarnedRunAverage(line)).toBe('4.667');
    expect(calculatePitchingWhip(line)).toBe('2.000');
    expect(calculatePitchingStrikeoutsPerSeven(line)).toBe('7.000');
  });

  it('outsが0またはnullableの場合は各率を.000として表示する', () => {
    expect(calculatePitchingEarnedRunAverage({ outsPitched: 0 })).toBe('.000');
    expect(calculatePitchingWhip({})).toBe('.000');
    expect(calculatePitchingStrikeoutsPerSeven({ outsPitched: 0 })).toBe(
      '.000'
    );
  });
});
