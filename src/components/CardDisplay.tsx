import type { Card } from '@/types/card';
import React from 'react';
import '@/styles/card.less';

interface CardDisplayProps {
    card: Card;
    size?: 'small' | 'medium' | 'large';
}

export const CardDisplay: React.FC<CardDisplayProps> = ({
    card,
    size = 'medium'
}) => {
    const rarityColors: Record<string, string> = {
        R: '#808080',
        SR: '#4169E1',
        SSR: '#FFD700',
        SP: '#FF1493',
        UR: '#FF8C00',
    };

    return (
        <div className={`card card--${size} card--${card.rarity.toLowerCase()}`}>
            {card.imageUrl && (
                <img src={card.imageUrl} alt={card.name} className="card__image" />
            )}
            <div
                className="card__rarity"
                style={{ borderColor: rarityColors[card.rarity] }}>

                {card.rarity}
            </div>
            <div className="card__name">{card.name}</div>
            {card.isEventCard && <div className="card__event-badge">活动</div>}
        </div>
    );
};