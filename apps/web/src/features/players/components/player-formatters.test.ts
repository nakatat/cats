import { describe, expect, it } from 'vitest';

import type { PlayerResponse } from '@/lib/api/players';

import { formatJoinedYear, formatPitchInfo } from './player-formatters';

describe('formatPitchInfo', () => {
  it('投打の情報を投手側と打者側の順で表示する', () => {
    const player: PlayerResponse = { throwingHand: '右', battingHand: '左' };

    expect(formatPitchInfo(player)).toBe('右投 / 左打');
  });

  it('片方だけの情報はもう片方をplaceholderで補完する', () => {
    expect(formatPitchInfo({ throwingHand: '右' })).toBe('右投 / —打');
    expect(formatPitchInfo({ battingHand: '左' })).toBe('—投 / 左打');
  });

  it('投打の情報がない場合はundefinedを返す', () => {
    expect(formatPitchInfo({})).toBeUndefined();
  });
});

describe('formatJoinedYear', () => {
  it('加入日の年だけを加入年表示に変換する', () => {
    expect(formatJoinedYear('2020-04-01')).toBe('2020年');
  });

  it('加入日がない場合はundefinedを返す', () => {
    expect(formatJoinedYear()).toBeUndefined();
  });
});
