import type { PoolType, PullType, PullRecord, PullStatistics, Card } from "@/types/card";


const STORAGE_KEY = 'gacha_history';
const MAX_RECORDS = 1000;

export class HistoryManager {
    private records: PullRecord[] = [];

    constructor() {
        this.loadFromStorage();
    }

    // 从本地存储加载历史记录
    private loadFromStorage() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                this.records = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Failed to load history from storage:', error);
            this.records = [];
        }
    }

    // 保存到本地存储
    private saveToStorage() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.records));
        } catch (error) {
            console.error('Failed to save history to storage:', error);
        }
    }

    // 添加新的抽卡记录
    addRecord(
        poolType: PoolType,
        pullType: PullType,
        cards: Card[],
        isGuaranteed: boolean
    ): PullRecord {
        const record: PullRecord = {
            id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
            poolType,
            pullType,
            cards,
            isGuaranteed,
        };

        this.records.unshift(record);

        // 限制历史记录数量
        if (this.records.length > MAX_RECORDS) {
            this.records = this.records.slice(0, MAX_RECORDS);
        }

        this.saveToStorage();
        return record;
    }

    // 获取所有历史记录
    getAllRecords(): PullRecord[] {
        return this.records;
    }

    //新增：导入历史记录
    importRecords(importedRecords: PullRecord[]): void {
        // 合并新导入的记录和现有记录
        const merged = [...importedRecords, ...this.records];
        // 按时间戳排序（新的在前）
        merged.sort((a, b) => b.timestamp - a.timestamp);
        // 去重（基于ID）
        const uniqueRecords: PullRecord[] = [];
        const seenIds = new Set<string>();

        for (const record of merged) {
            if (!seenIds.has(record.id)) {
                uniqueRecords.push(record);
                seenIds.add(record.id);
            }
        }

        // 限制数量
        this.records = uniqueRecords.slice(0, MAX_RECORDS);
        this.saveToStorage();
    }

    // 根据卡池类型筛选
    filterByPoolType(poolType: PoolType): PullRecord[] {
        return this.records.filter(record => record.poolType === poolType);
    }

    // 根据抽卡类型筛选
    filterByPullType(pullType: PullType): PullRecord[] {
        return this.records.filter(record => record.pullType === pullType);
    }

    // 根据稀有度筛选
    filterByRarity(rarity: string): PullRecord[] {
        return this.records.filter(record =>
            record.cards.some(card => card.rarity === rarity)
        );
    }

    // 组合筛选
    filterRecords(
        poolType?: PoolType,
        pullType?: PullType,
        rarity?: string
    ): PullRecord[] {
        return this.records.filter(record => {
            if (poolType && record.poolType !== poolType) return false;
            if (pullType && record.pullType !== pullType) return false;
            if (rarity && !record.cards.some(card => card.rarity === rarity)) {
                return false;
            }
            return true;
        });
    }

    // 获取统计信息
    getStatistics(records: PullRecord[] = this.records): PullStatistics {
        const stats: PullStatistics = {
            totalPulls: 0,
            totalCards: 0,
            rCards: 0,
            srCards: 0,
            ssrCards: 0,
            spCards: 0,
            urCards: 0,
            guaranteedCount: 0,
        };

        records.forEach(record => {
            stats.totalPulls += 1;
            stats.totalCards += record.cards.length;

            if (record.isGuaranteed) {
                stats.guaranteedCount += 1;
            }

            record.cards.forEach(card => {
                switch (card.rarity) {
                    case 'R':
                        stats.rCards += 1;
                        break;
                    case 'SR':
                        stats.srCards += 1;
                        break;
                    case 'SSR':
                        stats.ssrCards += 1;
                        break;
                    case 'SP':
                        stats.spCards += 1;
                        break;
                    case 'UR':
                        stats.urCards += 1;
                        break;
                }
            });
        });

        return stats;
    }

    // 获取近N条记录
    getRecentRecords(limit: number): PullRecord[] {
        return this.records.slice(0, limit);
    }

    // 清空所有历史记录
    clearAllRecords() {
        this.records = [];
        this.saveToStorage();
    }

    // 删除单条记录
    deleteRecord(recordId: string) {
        this.records = this.records.filter(record => record.id !== recordId);
        this.saveToStorage();
    }

    // 导出历史记录（JSON格式）
    exportAsJson(): string {
        return JSON.stringify(this.records, null, 2);
    }

    // 导出统计报告
    exportStatisticsReport(): string {
        const stats = this.getStatistics();
        const poolStats: Record<string, any> = {};

        (['normal', 'event_sp', 'event_ssr', 'event_ur'] as PoolType[]).forEach(
            poolType => {
                const filtered = this.filterByPoolType(poolType);
                poolStats[poolType] = this.getStatistics(filtered);
            }
        );

        return JSON.stringify(
            {
                exportTime: new Date().toISOString(),
                totalRecords: this.records.length,
                overallStatistics: stats,
                byPool: poolStats,
            },
            null,
            2
        );
    }

    // 获取记录总数
    getRecordCount(): number {
        return this.records.length;
    }
}