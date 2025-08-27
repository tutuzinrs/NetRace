import React from 'react';
import './SpeedDisplay.css';

interface SpeedDisplayProps {
  download: number;
  upload: number;
  ping: number;
  isLoading: boolean;
}

export const SpeedDisplay: React.FC<SpeedDisplayProps> = ({
  download,
  upload,
  ping,
  isLoading
}) => {
  const formatSpeed = (value: number) => {
    if (value === 0) return '--';
    return value.toFixed(1);
  };

  const formatPing = (value: number) => {
    if (value === 0) return '--';
    return Math.round(value).toString();
  };

  return (
    <div className="speed-display">
      <div className="speed-item">
        <span className="speed-label">Download</span>
        <span className={`speed-value ${isLoading ? 'testing' : ''}`}>
          {formatSpeed(download)}
        </span>
        <span className="speed-unit">Mbps</span>
      </div>
      
      <div className="speed-item">
        <span className="speed-label">Upload</span>
        <span className={`speed-value ${isLoading ? 'testing' : ''}`}>
          {formatSpeed(upload)}
        </span>
        <span className="speed-unit">Mbps</span>
      </div>
      
      <div className="speed-item">
        <span className="speed-label">Ping</span>
        <span className={`speed-value ${isLoading ? 'testing' : ''}`}>
          {formatPing(ping)}
        </span>
        <span className="speed-unit">ms</span>
      </div>
    </div>
  );
};
