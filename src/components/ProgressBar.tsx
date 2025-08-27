import React from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  progress: number;
  currentStep: 'idle' | 'ping' | 'download' | 'upload' | 'complete';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  currentStep 
}) => {
  const getStepText = () => {
    switch (currentStep) {
      case 'ping':
        return '⚡ Medindo latência...';
      case 'download':
        return '📥 Testando velocidade de download...';
      case 'upload':
        return '📤 Testando velocidade de upload...';
      case 'complete':
        return '✅ Teste concluído!';
      default:
        return 'Preparando...';
    }
  };

  const getStepEmoji = () => {
    switch (currentStep) {
      case 'ping':
        return '⚡';
      case 'download':
        return '📥';
      case 'upload':
        return '📤';
      case 'complete':
        return '✅';
      default:
        return '🔄';
    }
  };

  return (
    <div className="progress-container active">
      <div className="progress-steps">
        <div className={`progress-step ${currentStep === 'ping' || progress > 20 ? 'active' : ''} ${progress > 30 ? 'completed' : ''}`}>
          <span className="step-emoji">⚡</span>
          <span className="step-label">Ping</span>
        </div>
        
        <div className={`progress-step ${currentStep === 'download' || progress > 30 ? 'active' : ''} ${progress > 70 ? 'completed' : ''}`}>
          <span className="step-emoji">📥</span>
          <span className="step-label">Download</span>
        </div>
        
        <div className={`progress-step ${currentStep === 'upload' || progress > 70 ? 'active' : ''} ${progress >= 100 ? 'completed' : ''}`}>
          <span className="step-emoji">📤</span>
          <span className="step-label">Upload</span>
        </div>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="progress-text">
        <span className="progress-emoji">{getStepEmoji()}</span>
        <span>{getStepText()}</span>
        <span className="progress-percentage">{Math.round(progress)}%</span>
      </div>
    </div>
  );
};
