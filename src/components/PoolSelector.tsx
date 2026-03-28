import type { PoolType } from '@/types/card';
import React from 'react';
import '@/styles/pool.less';


interface PoolSelectorProps {
  selectedPool: PoolType;
  onPoolChange: (pool: PoolType) => void;
}

export const PoolSelector: React.FC<PoolSelectorProps> = ({
  selectedPool,
  onPoolChange,
}) => {
  const pools: Array<{ type: PoolType; label: string }> = [
    { type: 'normal', label: '常驻池' },
    { type: 'event_sp', label: '活动SP卡池' },
    { type: 'event_ssr', label: '活动SSR卡池' },
    { type: 'event_ur', label: '活动UR卡池' },
  ];

  return (
    <div className="pool-selector">
      <h3>选择卡池</h3>
      <div className="pool-selector__buttons">
        {pools.map(pool => (
          <button
            key={pool.type}
            className={`pool-selector__btn ${
              selectedPool === pool.type ? 'pool-selector__btn--active' : ''
            }`}
            onClick={() => onPoolChange(pool.type)}>

            {pool.label}
          </button>
        ))}
      </div>
    </div>
  );
};