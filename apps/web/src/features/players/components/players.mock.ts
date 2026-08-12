import type { PlayerResponse } from '@/lib/api/players';

export const playerListPlayers: PlayerResponse[] = [
  {
    playerId: 1,
    name: '田中 健太',
    kana: 'たなか けんた',
    uniformNumber: '10',
    primaryPosition: '投手',
    throwingHand: '右',
    battingHand: '右',
    joinedAt: '2018-04-01',
    leftAt: undefined,
    profileImageUrl: undefined,
  },
  {
    playerId: 2,
    name: '佐藤 翔太',
    uniformNumber: '1',
    primaryPosition: '捕手',
    throwingHand: '右',
    battingHand: '右',
    joinedAt: '2016-04-01',
  },
  {
    playerId: 3,
    name: '鈴木 大輔',
    uniformNumber: '3',
    primaryPosition: '一塁手',
    throwingHand: '右',
    battingHand: '右',
    joinedAt: '2017-04-01',
  },
  {
    playerId: 4,
    name: '高橋 優斗',
    uniformNumber: '7',
    primaryPosition: '二塁手',
    throwingHand: '右',
    battingHand: '左',
    joinedAt: '2019-04-01',
  },
  {
    playerId: 5,
    name: '伊藤 将也',
    uniformNumber: undefined,
    primaryPosition: '外野手',
    throwingHand: '右',
    battingHand: '右',
    joinedAt: '2020-04-01',
  },
  {
    playerId: 6,
    name: '斎藤 拓也',
    uniformNumber: '11',
    primaryPosition: '投手',
    throwingHand: '左',
    battingHand: '左',
    joinedAt: '2016-04-01',
    leftAt: '2024-03-31',
  },
];

export const playerWithoutOptionalFields: PlayerResponse = {
  playerId: 99,
  name: '芳尾',
  uniformNumber: undefined,
  primaryPosition: undefined,
  throwingHand: undefined,
  battingHand: undefined,
  joinedAt: undefined,
  leftAt: undefined,
  profileImageUrl: undefined,
};

export const playerLongName: PlayerResponse = {
  ...playerListPlayers[0],
  playerId: 100,
  name: 'とても長い選手名の表示確認サンプル 太郎',
  kana: 'とてもながいせんしゅめいのひょうじかくにんさんぷる たろう',
};
