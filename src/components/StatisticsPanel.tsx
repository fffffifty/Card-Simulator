import React, { useState, useMemo } from 'react';


import type { PullRecord, PoolType, PullStatistics } from '@/types/card';
import '@/styles/statistics.less';

interface StatisticsPanelProps {
  records: PullRecord[];
}

export const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ records }) => {
  const [expanded, setExpanded] = useState(false);
  const [filterPoolType, setFilterPoolType] = useState<PoolType | 'all'>('all');

  const filteredRecords = useMemo(() => {
    if (filterPoolType === 'all') return records;
    return records.filter(record => record.poolType === filterPoolType);
  }, [records, filterPoolType]);

  const stats = useMemo(() => {
    const result: PullStatistics = {
      totalPulls: 0,
      totalCards: 0,
      rCards: 0,
      srCards: 0,
      ssrCards: 0,
      spCards: 0,
      urCards: 0,
      guaranteedCount: 0,
    };

    filteredRecords.forEach(record => {
      result.totalPulls += 1;
      result.totalCards += record.cards.length;

      if (record.isGuaranteed) {
        result.guaranteedCount += 1;
      }

      record.cards.forEach(card => {
        switch (card.rarity) {
          case 'R':
            result.rCards += 1;
            break;
          case 'SR':
            result.srCards += 1;
            break;
          case 'SSR':
            result.ssrCards += 1;
            break;
          case 'SP':
            result.spCards += 1;
            break;
          case 'UR':
            result.urCards += 1;
            break;
        }
      });
    });

    return result;
  }, [filteredRecords]);

  const rarityRates = {
    UR: ((stats.urCards / stats.totalCards) * 100).toFixed(2),
    SP: ((stats.spCards / stats.totalCards) * 100).toFixed(2),
    SSR: ((stats.ssrCards / stats.totalCards) * 100).toFixed(2),
    SR: ((stats.srCards / stats.totalCards) * 100).toFixed(2),
    R: ((stats.rCards / stats.totalCards) * 100).toFixed(2),
  };

  const guaranteeRate = ((stats.guaranteedCount / stats.totalPulls) * 100).toFixed(2);

  if (stats.totalCards === 0) {
    return null;
  }

  return (
    <div className="statistics-panel">
      <div
        className="statistics-panel__header"
        onClick={() => setExpanded(!expanded)}>

        <h3>统计数据</h3>
        <span className="statistics-panel__toggle">
          {expanded ? '▼' : '▶'}
        </span>
      </div>

      {expanded && (
        <div className="statistics-panel__content">
          <div className="statistics-panel__filter">
            <label>按卡池筛选:</label>
            <select
              value={filterPoolType}
              onChange={e => setFilterPoolType(e.target.value as any)}>

              <option value="all">全部</option>
              <option value="normal">常驻池</option>
              <option value="event_sp">活动SP卡池</option>
              <option value="event_ssr">活动SSR卡池</option>
              <option value="event_ur">活动UR卡池</option>
            </select>
          </div>

          <div className="statistics-panel__grid">
            <div className="stat-card stat-card--primary">
              <div className="stat-card__label">总抽卡数</div>
              <div className="stat-card__value">{stats.totalPulls}</div>
              <div className="stat-card__detail">
                {stats.totalCards}张卡牌
              </div>
            </div>

            <div className="stat-card stat-card--ur">
              <div className="stat-card__label">UR</div>
              <div className="stat-card__value">{stats.urCards}</div>
              <div className="stat-card__detail">{rarityRates.UR}%</div>
            </div>

            <div className="stat-card stat-card--sp">
              <div className="stat-card__label">SP</div>
              <div className="stat-card__value">{stats.spCards}</div>
              <div className="stat-card__detail">{rarityRates.SP}%</div>
            </div>

            <div className="stat-card stat-card--ssr">
              <div className="stat-card__label">SSR</div>
              <div className="stat-card__value">{stats.ssrCards}</div>
              <div className="stat-card__detail">{rarityRates.SSR}%</div>
            </div>

            <div className="stat-card stat-card--sr">
              <div className="stat-card__label">SR</div>
              <div className="stat-card__value">{stats.srCards}</div>
              <div className="stat-card__detail">{rarityRates.SR}%</div>
            </div>

            <div className="stat-card stat-card--r">
              <div className="stat-card__label">R</div>
              <div className="stat-card__value">{stats.rCards}</div>
              <div className="stat-card__detail">{rarityRates.R}%</div>
            </div>

            <div className="stat-card stat-card--guarantee">
              <div className="stat-card__label">保底触发</div>
              <div className="stat-card__value">{stats.guaranteedCount}</div>
              <div className="stat-card__detail">{guaranteeRate}%</div>
            </div>
          </div>

          <div className="statistics-panel__chart">
            <h4>稀有度分布</h4>
            <div className="rarity-distribution">
              {[
                { name: 'UR', count: stats.urCards, rate: rarityRates.UR, color: '#FF8C00' },
                { name: 'SP', count: stats.spCards, rate: rarityRates.SP, color: '#FF1493' },
                { name: 'SSR', count: stats.ssrCards, rate: rarityRates.SSR, color: '#FFD700' },
                { name: 'SR', count: stats.srCards, rate: rarityRates.SR, color: '#4169E1' },
                { name: 'R', count: stats.rCards, rate: rarityRates.R, color: '#808080' },
              ].map(item => (
                <div key={item.name} className="distribution-item">
                  <div className="distribution-label">{item.name}</div>
                  <div className="distribution-bar-container">
                    <div
                      className="distribution-bar"
                      style={{
                        width: `${item.rate}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                <div className="distribution-value">
                    {item.count} ({item.rate}%)
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};