import React, { useState } from 'react';
import type { Card, CardRarity, PoolConfig } from '@/types/card';

import '@/styles/pool-manager.less';
import { PoolStorage } from '@/utils/poolStorage';
import { CardImageUploader } from '@/components/CardImageUploader';

interface PoolManagerProps {
    poolConfig: PoolConfig;
    onUpdatePool: (poolConfig: PoolConfig) => void;
}

export const PoolManager: React.FC<PoolManagerProps> = ({
    poolConfig,
    onUpdatePool,
}) => {
    const [showManager, setShowManager] = useState(false);
    const [newCardName, setNewCardName] = useState('');
    const [newCardRarity, setNewCardRarity] = useState<CardRarity>('SR');
    const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
    const [message, setMessage] = useState('');

    const cardCountByRarity = {
        R: poolConfig.cards.filter(c => c.rarity === 'R').length,
        SR: poolConfig.cards.filter(c => c.rarity === 'SR').length,
        SSR: poolConfig.cards.filter(c => c.rarity === 'SSR').length,
        SP: poolConfig.cards.filter(c => c.rarity === 'SP').length,
        UR: poolConfig.cards.filter(c => c.rarity === 'UR').length,
    };

    const handleAddCard = () => {
        if (!newCardName) return;

        const newCard: Card = {
            id: `${poolConfig.type}_${newCardRarity}_${Date.now()}`,
            name: newCardName,
            rarity: newCardRarity,
            poolType: poolConfig.type,
            isEventCard: false,
        };

        const updatedPool = {
            ...poolConfig,
            cards: [...poolConfig.cards, newCard],
        };

        onUpdatePool(updatedPool);
        PoolStorage.savePoolConfig(poolConfig.type, updatedPool);
        setNewCardName('');
        setNewCardRarity('SR');
        showMessage('卡牌添加成功');
    };

    const handleRemoveCard = (cardId: string) => {
        const updatedPool = {
            ...poolConfig,
            cards: poolConfig.cards.filter(c => c.id !== cardId),
        };
        onUpdatePool(updatedPool);
        PoolStorage.savePoolConfig(poolConfig.type, updatedPool);
        showMessage('卡牌删除成功');
    };

    const handleImageUpdate = (cardId: string, imageUrl: string) => {
        const updatedCards = poolConfig.cards.map(card =>
            card.id === cardId ? { ...card, imageUrl } : card
        );
        const updatedPool = {
            ...poolConfig,
            cards: updatedCards,
        };
        onUpdatePool(updatedPool);
        PoolStorage.savePoolConfig(poolConfig.type, updatedPool);
        showMessage('图片更新成功');
    };

    const handleExportPool = () => {
        const data = PoolStorage.exportAsJson(poolConfig.type);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${poolConfig.type}_config_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showMessage('导出成功');
    };

    const handleImportPool = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = event => {
            try {
                const jsonData = event.target?.result as string;
                const result = PoolStorage.importFromJson(jsonData);
                if (result.success) {
                    showMessage(result.message);
                    //刷新当前卡池配置
                    const stored = PoolStorage.getPoolConfig(poolConfig.type);
                    if (stored) {
                        onUpdatePool(stored);
                    }
                } else {
                    showMessage(result.message);
                }
            } catch (error) {
                showMessage('导入失败');
            }
        };
        reader.readAsText(file);
    };

    const handleExportAll = () => {
        const data = PoolStorage.exportAsJson();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `all_pools_config_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showMessage('全部导出成功');
    };

    const showMessage = (msg: string) => {
        setMessage(msg);
        setTimeout(() => setMessage(''), 2000);
    };

    return (
        <div className="pool-manager">
            <button
                className="pool-manager__toggle"
                onClick={() => setShowManager(!showManager)}>
                {showManager ? '关闭' : '打开'}卡池管理
            </button>

            {message && <div className="pool-manager__message">{message}</div>}

            {showManager && (
                <div className="pool-manager__panel">
                    <h3>卡池管理 - {poolConfig.name}</h3>

                    <div className="pool-manager__stats">
                        <div className="stat-item">
                            <span>R卡:</span>
                            <strong>{cardCountByRarity.R}</strong>
                        </div>
                        <div className="stat-item">
                            <span>SR卡:</span>
                            <strong>{cardCountByRarity.SR}</strong>
                        </div>
                        <div className="stat-item">
                            <span>SSR卡:</span>
                            <strong>{cardCountByRarity.SSR}</strong>
                        </div>
                        <div className="stat-item">
                            <span>SP卡:</span>
                            <strong>{cardCountByRarity.SP}</strong>
                        </div>
                        <div className="stat-item">
                            <span>UR卡:</span>
                            <strong>{cardCountByRarity.UR}</strong>
                        </div>
                    </div>

                    <div className="pool-manager__add-card">
                        <input
                            type="text"
                            placeholder="输入卡名"
                            value={newCardName}
                            onChange={e => setNewCardName(e.target.value)}
                        />
                        <select
                            value={newCardRarity}
                            onChange={e => setNewCardRarity(e.target.value as CardRarity)}>

                            <option value="R">R</option>
                            <option value="SR">SR</option>
                            <option value="SSR">SSR</option>
                            <option value="SP">SP</option>
                            <option value="UR">UR</option>
                        </select>
                        <button onClick={handleAddCard}>添加</button>
                    </div>

                    <div className="pool-manager__actions">
                        <button className="action-btn action-btn--export" onClick={handleExportPool}>
                            导出此卡池
                        </button>
                        <label className="action-btn action-btn--import">
                            导入卡池配置
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImportPool}
                                style={{ display: 'none' }}
                            />
                        </label>
                        <button className="action-btn action-btn--export" onClick={handleExportAll}>
                            导出全部卡池
                        </button>
                    </div>


                    <div className="pool-manager__card-list">
                        <h4>卡池内容</h4>
                        <div className="card-grid">
                            {
                                poolConfig.cards.map(card => (
                                    <div
                                        key={card.id}
                                        className="card-grid-item"
                                        onClick={() =>
                                            setExpandedCardId(
                                                expandedCardId === card.id ? null : card.id
                                            )
                                        }>
                                        <div className="card-grid-item__header">
                                            <span className={`rarity rarity--${card.rarity.toLowerCase()}`}>
                                                {card.rarity}
                                            </span>
                                            <span className="card-grid-item__name">{card.name}</span>
                                            <button
                                                className="card-grid-item__delete"
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    handleRemoveCard(card.id);
                                                }}>

                                                ×
                                            </button>
                                        </div>
                                        {expandedCardId === card.id && (
                                            <div className="card-grid-item__expanded">
                                                <CardImageUploader
                                                    card={card}
                                                    onImageUpdate={handleImageUpdate}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))
                            }
                        </div>
                        {/* <div className="card-list">
                            {poolConfig.cards.map(card => (
                                <div key={card.id} className="card-list-item">
                                    <span className={`rarity rarity--${card.rarity.toLowerCase()}`}>
                                        {card.rarity}
                                    </span>
                                    <span>{card.name}</span>
                                    <button onClick={() => handleRemoveCard(card.id)}>删除</button>
                                </div>
                            ))}
                        </div> */}
                    </div>
                </div>
            )}
        </div>
    );
};