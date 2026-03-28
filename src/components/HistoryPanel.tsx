import React, { useState, useMemo } from 'react';

import { CardDisplay } from './CardDisplay';
import type { PullRecord, PoolType, PullType } from '@/types/card';
import '@/styles/history.less';


interface HistoryPanelProps {
    records: PullRecord[];
    onDelete: (recordId: string) => void;
    onClearAll: () => void;
    onImportHistory: (records: PullRecord[]) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
    records,
    onDelete,
    onClearAll,
    onImportHistory,
}) => {
    const [expanded, setExpanded] = useState(false);
    const [filterPoolType, setFilterPoolType] = useState<PoolType | 'all'>('all');
    const [filterPullType, setFilterPullType] = useState<PullType | 'all'>('all');
    const [filterRarity, setFilterRarity] = useState<string | 'all'>('all');
    const [importMessage, setImportMessage] = useState('');

    const filteredRecords = useMemo(() => {
        return records.filter(record => {
            if (filterPoolType !== 'all' && record.poolType !== filterPoolType) {
                return false;
            }
            if (filterPullType !== 'all' && record.pullType !== filterPullType) {
                return false;
            }
            if (
                filterRarity !== 'all' &&
                !record.cards.some(card => card.rarity === filterRarity)
            ) {
                return false;
            }
            return true;
        });
    }, [records, filterPoolType, filterPullType, filterRarity]);

    const poolNames: Record<PoolType, string> = {
        normal: '常驻池',
        event_sp: '活动SP卡池',
        event_ssr: '活动SSR卡池',
        event_ur: '活动UR卡池',
    };

    const handleImportHistory = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = event => {
            try {
                const data = JSON.parse(event.target?.result as string);
                const importedRecords = Array.isArray(data) ? data : [];

                if (importedRecords.length === 0) {
                    setImportMessage('未找到有效的历史记录');
                    setTimeout(() => setImportMessage(''), 2000);
                    return;
                }

                onImportHistory(importedRecords);
                setImportMessage(`成功导入 ${importedRecords.length} 条记录`);
                setTimeout(() => setImportMessage(''), 2000);
            } catch (error) {
                setImportMessage('导入失败：文件格式错误');
                setTimeout(() => setImportMessage(''), 2000);
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="history-panel">
            {importMessage && <div className="history-panel__message">{importMessage}</div>}
            <div
                className="history-panel__header"
                onClick={() => setExpanded(!expanded)}>

                <h3>
                    抽卡历史
                    <span className="history-panel__count">{records.length}</span>
                </h3>
                <span className="history-panel__toggle">
                    {expanded ? '▼' : '▶'}
                </span>
            </div>

            {expanded && (
                <div className="history-panel__content">
                    <div className="history-panel__filters">
                        <div className="filter-group">
                            <label>卡池:</label>
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

                        <div className="filter-group">
                            <label>抽卡类型:</label>
                            <select
                                value={filterPullType}
                                onChange={e => setFilterPullType(e.target.value as any)}>

                                <option value="all">全部</option>
                                <option value="single">单抽</option>
                                <option value="ten">十连</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>稀有度:</label>
                            <select
                                value={filterRarity}
                                onChange={e => setFilterRarity(e.target.value)}>

                                <option value="all">全部</option>
                                <option value="UR">UR</option>
                                <option value="SP">SP</option>
                                <option value="SSR">SSR</option>
                                <option value="SR">SR</option>
                                <option value="R">R</option>
                            </select>
                        </div>
                    </div>

                    <div className="history-panel__records">
                        {filteredRecords.length === 0 ? (
                            <div className="history-panel__empty">没有符合条件的记录</div>
                        ) : (
                            filteredRecords.map(record => (
                                <div key={record.id} className="history-record">
                                    <div className="history-record__header">
                                        <div className="history-record__info">
                                            <span className="pool-badge">
                                                {poolNames[record.poolType]}
                                            </span>
                                            <span className="pull-badge pull-badge--{record.pullType}">
                                                {record.pullType === 'single' ? '单抽' : '十连'}
                                            </span>
                                            {record.isGuaranteed && (
                                                <span className="guarantee-badge">保底</span>
                                            )}
                                        </div>
                                        <div className="history-record__time">
                                            {new Date(record.timestamp).toLocaleString()}
                                        </div>
                                        <button
                                            className="history-record__delete"
                                            onClick={() => onDelete(record.id)}
                                            title="删除此记录">

                                            ×
                                        </button>
                                    </div>

                                    <div className="history-record__cards">
                                        {record.cards.map(card => (
                                            <CardDisplay
                                                key={card.id}
                                                card={card}
                                                size="small"
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="history-panel__actions">
                        <button
                            className="action-btn action-btn--export"
                            onClick={() => {
                                const data = JSON.stringify(filteredRecords, null, 2);
                                const blob = new Blob([data], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `gacha_history_${Date.now()}.json`;
                                a.click();
                                URL.revokeObjectURL(url);
                            }}>

                            导出JSON
                        </button>
                        <label className="action-btn action-btn--import">
                            导入历史记录
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImportHistory}
                                style={{ display: 'none' }}
                            />
                        </label>
                        <button
                            className="action-btn action-btn--clear"
                            onClick={() => {
                                if (window.confirm('确定要清空所有历史记录吗？此操作无法撤销！')) {
                                    onClearAll();
                                }
                            }}>

                            清空历史
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};