import type { Card, CardRarity, PoolConfig, PullResult } from "@/types/card";


export class GachaSystem {
  private poolConfig: PoolConfig;

  constructor(poolConfig: PoolConfig) {
    this.poolConfig = poolConfig;
  }

  updatePool(poolConfig: PoolConfig) {
    this.poolConfig = poolConfig;
  }

  // 根据概率获取卡牌稀有度
  private getRandomRarity(): CardRarity {
    const rates = this.poolConfig.rarityRates;
    const random = Math.random();
    let accumulated = 0;

    for (const [rarity, rate] of Object.entries(rates)) {
      accumulated += rate;
      if (random <= accumulated) {
        return rarity as CardRarity;
      }
    }

    return 'R';
  }

  // 获取特定稀有度的随机卡牌
  private getRandomCardByRarity(rarity: CardRarity): Card | null {
    const cards = this.poolConfig.cards.filter(card => card.rarity === rarity);
    if (cards.length === 0) return null;
    return cards[Math.floor(Math.random() * cards.length)];
  }

  // 单抽
  singlePull(): Card | null {
    const rarity = this.getRandomRarity();
    return this.getRandomCardByRarity(rarity);
  }

  // 十连抽：保证至少一张SR
  tenPull(): PullResult {
    const cards: Card[] = [];
    let hasGuaranteedSr = false;

    //抽9张
    for (let i = 0; i < 9; i++) {
      const rarity = this.getRandomRarity();
      const card = this.getRandomCardByRarity(rarity);
      if (card) {
        cards.push(card);
        if (card.rarity === 'SR') {
          hasGuaranteedSr = true;
        }
      }
    }

    // 第10张：如果前9张没有SR，则必定是SR
    let tenthCard: Card | null;
    if (!hasGuaranteedSr) {
      tenthCard = this.getRandomCardByRarity('SR');
    } else {
      tenthCard = this.singlePull();
    }

    if (tenthCard) {
      cards.push(tenthCard);
    }

    return {
      cards: cards.slice(0, 10),
      isGuaranteed: !hasGuaranteedSr,
    };
  }

  // 添加卡到卡池
  addCard(card: Card) {
    this.poolConfig.cards.push(card);
  }

  // 移除卡从卡池（按ID）
  removeCard(cardId: string) {
    this.poolConfig.cards = this.poolConfig.cards.filter(
      card => card.id !== cardId
    );
  }

  // 清空某个稀有度的卡
  clearCardsByRarity(rarity: CardRarity) {
    this.poolConfig.cards = this.poolConfig.cards.filter(
      card => card.rarity !== rarity
    );
  }

  // 获取卡池中某稀有度卡的数量
  getCardCountByRarity(rarity: CardRarity): number {
    return this.poolConfig.cards.filter(card => card.rarity === rarity).length;
  }

  // 获取卡池配置
  getPoolConfig(): PoolConfig {
    return this.poolConfig;
  }
}