import React, { useRef, useEffect } from 'react';
import { useSpeedTestStore } from '../store/speedTestStore';
import { RocketCanvas } from './RocketCanvas';
import { SpeedDisplay } from './SpeedDisplay';
import { ProgressBar } from './ProgressBar';
import { performSpeedTest } from '../utils/speedTest';
import './SpeedTest.css';

export const SpeedTest: React.FC = () => {
  const {
    isTestRunning,
    isTestComplete,
    currentStep,
    progress,
    currentResult,
    startTest,
    resetTest,
  } = useSpeedTestStore();

  const handleStartTest = async () => {
    if (isTestRunning) return;
    
    startTest();
    
    try {
      await performSpeedTest();
    } catch (error) {
      console.error('Erro durante o teste:', error);
      resetTest();
    }
  };

  const handleReset = () => {
    resetTest();
  };

  const getButtonText = () => {
    if (isTestRunning) {
      switch (currentStep) {
        case 'ping':
          return '⚡ Testando Ping...';
        case 'download':
          return '📥 Testando Download...';
        case 'upload':
          return '📤 Testando Upload...';
        default:
          return '🔄 Testando...';
      }
    }
    
    if (isTestComplete) {
      return '🔄 Testar Novamente';
    }
    
    return '🚀 Iniciar Teste';
  };

  return (
    <section className="test-section">
      <div className="test-card">
        <h2>Teste sua Velocidade</h2>
        
        <div className="rocket-container">
          <RocketCanvas 
            isActive={isTestRunning} 
            progress={progress}
            speed={currentResult?.download || 0}
          />
        </div>
        
        <SpeedDisplay 
          download={currentResult?.download || 0}
          upload={currentResult?.upload || 0}
          ping={currentResult?.ping || 0}
          isLoading={isTestRunning}
        />
        
        <button
          onClick={isTestComplete ? handleReset : handleStartTest}
          disabled={isTestRunning}
          className={`test-btn ${isTestRunning ? 'loading' : ''} ${isTestComplete ? 'complete' : ''}`}
          aria-label={getButtonText()}
        >
          {getButtonText()}
        </button>
        
        {isTestRunning && (
          <ProgressBar 
            progress={progress} 
            currentStep={currentStep}
          />
        )}
      </div>
    </section>
  );
};
