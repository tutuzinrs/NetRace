import React, { useRef, useEffect } from 'react';
import { useSpeedTestStore } from '../store/speedTestStore';
import './HistoryChart.css';

export const HistoryChart: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { history } = useSpeedTestStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || history.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Chart dimensions
    const padding = 40;
    const chartWidth = rect.width - (padding * 2);
    const chartHeight = rect.height - (padding * 2);

    // Data preparation
    const sortedHistory = [...history].sort((a, b) => a.timestamp - b.timestamp);
    const maxSpeed = Math.max(...sortedHistory.map(h => Math.max(h.download, h.upload)));
    const minSpeed = Math.min(...sortedHistory.map(h => Math.min(h.download, h.upload)));
    const speedRange = maxSpeed - minSpeed || 1;

    // Helper functions
    const getX = (index: number) => padding + (index / (sortedHistory.length - 1)) * chartWidth;
    const getY = (speed: number) => padding + ((maxSpeed - speed) / speedRange) * chartHeight;

    // Draw grid
    ctx.strokeStyle = 'rgba(51, 51, 71, 0.3)';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i / 5) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + chartWidth, y);
      ctx.stroke();
    }

    // Vertical grid lines
    for (let i = 0; i < sortedHistory.length; i++) {
      const x = getX(i);
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, padding + chartHeight);
      ctx.stroke();
    }

    // Draw download line
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 3;
    ctx.beginPath();
    sortedHistory.forEach((test, index) => {
      const x = getX(index);
      const y = getY(test.download);
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw upload line
    ctx.strokeStyle = '#ff6b35';
    ctx.lineWidth = 2;
    ctx.beginPath();
    sortedHistory.forEach((test, index) => {
      const x = getX(index);
      const y = getY(test.upload);
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw points
    sortedHistory.forEach((test, index) => {
      const x = getX(index);
      
      // Download point
      ctx.fillStyle = '#00ff88';
      ctx.beginPath();
      ctx.arc(x, getY(test.download), 4, 0, 2 * Math.PI);
      ctx.fill();

      // Upload point
      ctx.fillStyle = '#ff6b35';
      ctx.beginPath();
      ctx.arc(x, getY(test.upload), 3, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw labels
    ctx.fillStyle = '#a0a0b8';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'left';

    // Y-axis labels (speeds)
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i / 5) * chartHeight;
      const speed = maxSpeed - (i / 5) * speedRange;
      ctx.fillText(`${speed.toFixed(0)} Mbps`, 5, y + 4);
    }

    // Draw legend
    const legendY = 20;
    
    // Download legend
    ctx.fillStyle = '#00ff88';
    ctx.fillRect(rect.width - 150, legendY, 15, 3);
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Download', rect.width - 130, legendY + 8);

    // Upload legend
    ctx.fillStyle = '#ff6b35';
    ctx.fillRect(rect.width - 150, legendY + 20, 15, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Upload', rect.width - 130, legendY + 28);

  }, [history]);

  if (history.length === 0) {
    return null;
  }

  return (
    <section className="chart-section">
      <div className="chart-card">
        <h3>📈 Evolução da Velocidade</h3>
        <div className="chart-container">
          <canvas 
            ref={canvasRef}
            className="history-chart"
            style={{ width: '100%', height: '300px' }}
          />
        </div>
        <div className="chart-info">
          <p>Últimos {history.length} testes • Atualizado automaticamente</p>
        </div>
      </div>
    </section>
  );
};
