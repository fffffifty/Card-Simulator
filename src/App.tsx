import { PoolSelector } from '@/components/PoolSelector';
import { PoolManager } from '@/components/PoolManager';
import { PullButton } from '@/components/PullButton';
import { CardResult } from '@/components/CardResult';
import type { PoolType, PoolConfig, PullResult } from '@/types/card';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { normalPoolConfig, eventSpPoolConfig, eventSsrPoolConfig, eventUrPoolConfig } from '@/utils/poolConfig';
import { GachaSystem } from '@/utils/gacha';
import '@/styles/index.less';
import { HistoryManager } from '@/utils/historyManager';
import { StatisticsPanel } from '@/components/StatisticsPanel';
import { HistoryPanel } from '@/components/HistoryPanel';
import { PoolStorage } from '@/utils/poolStorage';

const App: React.FC = () => {

  const [selectedPoolType, setSelectedPoolType] = useState<PoolType>('normal');
  const [poolConfigs, setPoolConfigs] = useState<Record<PoolType, PoolConfig>>(() => {
    //尝试从本地存储加载，否则使用默认配置
    const stored = PoolStorage.getAllConfigs();
    return {
      normal: stored.normal || normalPoolConfig,
      event_sp: stored.event_sp || eventSpPoolConfig,
      event_ssr: stored.event_ssr || eventSsrPoolConfig,
      event_ur: stored.event_ur || eventUrPoolConfig,
    };
  });
  const [result, setResult] = useState<PullResult | null>(null);
  const [loading, setLoading] = useState(false);

  const [historyRecords, setHistoryRecords] = useState(() => {
    const manager = new HistoryManager();
    return manager.getAllRecords();
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const historyManager = useMemo(() => new HistoryManager(), []);

  // 初始化历史记录
  useEffect(() => {
    setHistoryRecords(historyManager.getAllRecords());
  }, [historyManager]);

  const currentPoolConfig = poolConfigs[selectedPoolType];

  const gachaSystem = useMemo(() => {
    return new GachaSystem(currentPoolConfig);
  }, [currentPoolConfig]);

  const handleSinglePull = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const card = gachaSystem.singlePull();
      if (card) {
        const pullResult = { cards: [card], isGuaranteed: false };
        setResult(pullResult);

        historyManager.addRecord(selectedPoolType, 'single', [card], false);
        // 关键修复：主动刷新历史记录和统计
        setHistoryRecords([...historyManager.getAllRecords()]);
        setRefreshTrigger(prev => prev + 1);
      }
      setLoading(false);
    }, 300);
  }, [gachaSystem, selectedPoolType, historyManager]);

  const handleTenPull = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const pullResult = gachaSystem.tenPull();
      setResult(pullResult);

      historyManager.addRecord(
        selectedPoolType,
        'ten',
        pullResult.cards,
        pullResult.isGuaranteed
      );
      // 关键修复：主动刷新历史记录和统计
      setHistoryRecords([...historyManager.getAllRecords()]);
      setRefreshTrigger(prev => prev + 1);
      setLoading(false);
    }, 300);
  }, [gachaSystem, selectedPoolType, historyManager]);

  const handlePoolChange = (pool: PoolType) => {
    setSelectedPoolType(pool);
  };

  const handleUpdatePool = (updatedConfig: PoolConfig) => {
    setPoolConfigs(prev => ({
      ...prev,
      [selectedPoolType]: updatedConfig,
    }));
    PoolStorage.savePoolConfig(selectedPoolType, updatedConfig);
  };

  const handleDeleteRecord = (recordId: string) => {
    historyManager.deleteRecord(recordId);
    //刷新UI
    setHistoryRecords([...historyManager.getAllRecords()]);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleClearAllRecords = () => {
    historyManager.clearAllRecords();
    // 刷新UI
    setHistoryRecords([]);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleImportHistory = (records: any[]) => {
    historyManager.importRecords(records);
    // 刷新UI
    setHistoryRecords([...historyManager.getAllRecords()]);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="app">
      <div className="container">
        <h1>模拟</h1>

        <PoolSelector
          selectedPool={selectedPoolType}
          onPoolChange={handlePoolChange}
        />

        <PoolManager
          poolConfig={currentPoolConfig}
          onUpdatePool={handleUpdatePool}
        />

        <PullButton
          onSinglePull={handleSinglePull}
          onTenPull={handleTenPull}
          loading={loading}
        />

        {/* 使用 refreshTrigger 强制重新渲染，确保数据是最新的 */}
        <StatisticsPanel records={historyRecords} key={`stats-${refreshTrigger}`} />

        <HistoryPanel
          records={historyRecords}
          onDelete={handleDeleteRecord}
          onClearAll={handleClearAllRecords}
          onImportHistory={handleImportHistory}
          key={`history-${refreshTrigger}`}
        />

        <CardResult result={result} onClose={() => setResult(null)} />
      </div>
    </div>
  );
};

export default App
