export type CardRarity = 'R' | 'SR' | 'SSR' | 'SP' | 'UR';
export type PoolType = 'normal' | 'event_sp' | 'event_ssr' | 'event_ur';
export type PullType = 'single' | 'ten';

export interface Card {
  id: string;
  name: string;
  rarity: CardRarity;
  poolType: PoolType;
  isEventCard: boolean;
  imageUrl?: string; // 新增：卡牌图片
}

export interface PoolConfig {
  type: PoolType;
  name: string;
  cards: Card[];
  rarityRates: Record<CardRarity, number>;
  eventCardRates?: Partial<Record<CardRarity, number>>;
}

export interface PullResult {
  cards: Card[];
  isGuaranteed: boolean;
}
// 新增：历史记录相关类型
export interface PullRecord {
  id: string;
  timestamp: number;
  poolType: PoolType;
  pullType: PullType;
  cards: Card[];
  isGuaranteed: boolean;
}

export interface PullStatistics {
  totalPulls: number;
  totalCards: number;
  rCards: number;
  srCards: number;
  ssrCards: number;
  spCards: number;
  urCards: number;
  guaranteedCount: number;
}