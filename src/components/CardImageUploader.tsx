import React, { useState } from 'react';

import type { Card } from '@/types/card';
import { ImageUtil } from '@/utils/imageUtil';
import '@/styles/image-uploader.less';


interface CardImageUploaderProps {
  card: Card;
  onImageUpdate: (cardId: string, imageUrl: string) => void;
}

export const CardImageUploader: React.FC<CardImageUploaderProps> = ({
  card,
  onImageUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      // 验证图片
      const validation = await ImageUtil.validateImage(file);
      if (!validation.valid) {
        setError(validation.message);
        setLoading(false);
        return;
      }

      // 压缩图片
      const compressed = await ImageUtil.compressImage(file);
      onImageUpdate(card.id, compressed);
    } catch (err) {
      setError('图片处理失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-image-uploader">
      {card.imageUrl ? (
        <div className="image-preview">
          <img src={card.imageUrl} alt={card.name} />
          <div className="image-overlay">
            <label className="upload-btn">
              更改
              <input
                type="file"
                accept="image/"
                onChange={handleImageChange}
                disabled={loading}
              />
            </label>
          </div>
        </div>
      ) : (
        <label className="image-placeholder">
          <div className="placeholder-icon">📷</div>
          <div className="placeholder-text">上传图片</div>
          <input
            type="file"
            accept="image/"
            onChange={handleImageChange}
            disabled={loading}
          />
        </label>
      )}
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">处理中...</div>}
    </div>
  );
};