import type { Card, CardRarity, PoolConfig, PoolType } from "@/types/card";

// 初始化卡池数据
const createCards = (rarity: CardRarity, poolType: PoolType, count: number, isEvent: boolean = false): Card[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${poolType}_${rarity}_${isEvent ? 'event_' : ''}${i}`,
    name: `${isEvent ? '活动' : ''}${rarity}卡 ${i + 1}`,
    rarity,
    poolType,
    isEventCard: isEvent,
  }));
};

// 常驻池配置
export const normalPoolConfig: PoolConfig = {
  type: 'normal',
  name: '常驻池',
  cards: [
    ...createCards('R', 'normal', 8, false),
    ...createCards('SR', 'normal', 6, false),
    ...createCards('SSR', 'normal', 3, false),
    ...createCards('SP', 'normal', 4, false),
  ],
  rarityRates: {
    R: 0.89,
    SR: 0.1,
    SSR: 0.005,
    SP: 0.005,
    UR: 0,
  },
};

// 活动SP卡池配置
export const eventSpPoolConfig: PoolConfig = {
  type: 'event_sp',
  name: '活动SP卡池',
  cards: [
    ...createCards('R', 'event_sp', 8, false),
    ...createCards('SR', 'event_sp', 6, false),
    ...createCards('SSR', 'event_sp', 3, false),
    ...createCards('SP', 'event_sp', 4, false),
    ...createCards('SP', 'event_sp', 4, true),
  ],
  rarityRates: {
    R: 0.875,
    SR: 0.1,
    SSR: 0.01,
    SP: 0.015,
    UR: 0,
  },
  eventCardRates: {
    SP: 0.015,
  },
};

// 活动SSR卡池配置
export const eventSsrPoolConfig: PoolConfig = {
  type: 'event_ssr',
  name: '活动SSR卡池',
  cards: [
    ...createCards('R', 'event_ssr', 8, false),
    ...createCards('SR', 'event_ssr', 6, false),
    ...createCards('SSR', 'event_ssr', 3, false),
    ...createCards('SP', 'event_ssr', 4, false),
    ...createCards('SSR', 'event_ssr', 4, true),
  ],
  rarityRates: {
    R: 0.875,
    SR: 0.1,
    SSR: 0.015,
    SP: 0.01,
    UR: 0,
  },
  eventCardRates: {
    SSR: 0.015,
  },
};

// 活动UR卡池配置
export const eventUrPoolConfig: PoolConfig = {
  type: 'event_ur',
  name: '活动UR卡池',
  cards: [
    ...createCards('R', 'event_ur', 8, false),
    ...createCards('SR', 'event_ur', 6, false),
    ...createCards('SSR', 'event_ur', 3, false),
    ...createCards('SP', 'event_ur', 4, false),
    ...createCards('UR', 'event_ur', 4, true),
  ],
  rarityRates: {
    R: 0.875,
    SR: 0.1,
    SSR: 0.01,
    SP: 0.01,
    UR: 0.015,
  },
  eventCardRates: {
    UR: 0.015,
  },
};

export const allPoolConfigs: Record<PoolType, PoolConfig> = {
  normal: normalPoolConfig,
  event_sp: eventSpPoolConfig,
  event_ssr: eventSsrPoolConfig,
  event_ur: eventUrPoolConfig,
};