import React from 'react';
import { useSpeedTestStore } from '../store/speedTestStore';
import { RocketCanvas } from './RocketCanvas';
import { SpeedDisplay } from './SpeedDisplay';
import { ProgressBar } from './ProgressBar';
import { performSpeedTest } from '../utils/speedTest';
import { performFastComRealTest } from '../utils/fastComRealTest';
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

  const handleStartTest = async (testType: 'simulated' | 'real' | 'fastcom' = 'simulated') => {
    if (isTestRunning) return;
    
    startTest();
    
    try {
      switch (testType) {
        case 'fastcom':
          await performFastComRealTest();
          break;
        case 'real':
          await performSpeedTest(true);
          break;
        default:
          await performSpeedTest(false);
      }
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
    
    return '🚀 Teste Rápido';
  };

  return (
    <section className="test-section">
      <div className="test-card">
        <h2>Teste sua Velocidade</h2>
        
        {!isTestRunning && !isTestComplete && (
          <div style={{ 
            marginBottom: '20px', 
            padding: '15px', 
            backgroundColor: '#1a1a1a', 
            borderRadius: '8px',
            border: '1px solid #333'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#00d4aa' }}>Escolha o Tipo de Teste:</h3>
            <p style={{ margin: '5px 0', fontSize: '14px', color: '#ccc' }}>
              🔵 <strong>Rápido</strong>: Simulado, 5 segundos<br/>
              🟠 <strong>Real</strong>: CDNs reais, 20 segundos<br/>
              🟢 <strong>Fast.com Oficial</strong>: API Netflix, resultado idêntico
            </p>
          </div>
        )}
        
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
          onClick={() => isTestComplete ? handleReset() : handleStartTest('simulated')}
          disabled={isTestRunning}
          className={`test-btn ${isTestRunning ? 'loading' : ''} ${isTestComplete ? 'complete' : ''}`}
          aria-label={getButtonText()}
        >
          {getButtonText()}
        </button>
        
        {!isTestRunning && !isTestComplete && (
          <>
            <button
              onClick={() => handleStartTest('real')}
              className="test-btn test-btn-real"
              style={{ 
                marginLeft: '10px', 
                backgroundColor: '#ff6b35',
                fontSize: '14px'
              }}
            >
              🌐 Teste REAL
            </button>
            
            <button
              onClick={() => handleStartTest('fastcom')}
              className="test-btn test-btn-official"
              style={{ 
                marginLeft: '10px', 
                backgroundColor: '#00d4aa',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              🚀 FAST.COM OFICIAL
            </button>
          </>
        )}
        
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
