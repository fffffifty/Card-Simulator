import React from 'react';

interface PullButtonProps {
  onSinglePull: () => void;
  onTenPull: () => void;
  loading?: boolean;
}

export const PullButton: React.FC<PullButtonProps> = ({
  onSinglePull,
  onTenPull,
  loading = false,
}) => {
  return (
    <div className="pull-buttons">
      <button
        className="pull-btn pull-btn--single"
        onClick={onSinglePull}
        disabled={loading}>

        单抽
      </button>
      <button
        className="pull-btn pull-btn--ten"
        onClick={onTenPull}
        disabled={loading}>

        十连抽
      </button>
    </div>
  );
};