import React from 'react';
import { CardDisplay } from './CardDisplay';
import type { PullResult, Card } from '@/types/card';
import '@/styles/result.less';

interface CardResultProps {
  result: PullResult | null;
  onClose: () => void;
}

export const CardResult: React.FC<CardResultProps> = ({ result, onClose }) => {
  if (!result) return null;

  const resultsByRarity = result.cards.reduce(
    (acc, card) => {
      if (!acc[card.rarity]) acc[card.rarity] = [];
      acc[card.rarity].push(card);
      return acc;
    },
    {} as Record<string, Card[]>
  );

  const rarityOrder = ['UR', 'SP', 'SSR', 'SR', 'R'];

  return (
    <div className="result-modal" onClick={onClose}>
      <div className="result-modal__content" onClick={e => e.stopPropagation()}>
        <div className="result-modal__header">
          <h2>抽卡结果</h2>
          {result.isGuaranteed && (
            <span className="result-modal__guaranteed">保底触发</span>
          )}
        </div>

        <div className="result-modal__cards">
          {rarityOrder.map(rarity => (
            resultsByRarity[rarity] && (
              <div key={rarity} className={`result-group result-group--${rarity.toLowerCase()}`}>
                <h4 className="result-group__title">{rarity}</h4>
                <div className="result-group__items">
                  {resultsByRarity[rarity].map(card => (
                    <CardDisplay key={card.id} card={card} size="small" />
                  ))}
                </div>
              </div>
            )
          ))}
        </div>

        <button className="result-modal__close" onClick={onClose}>
          确定
        </button>
      </div>
    </div>
  );
};