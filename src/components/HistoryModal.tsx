import React from 'react';
import { useSpeedTestStore } from '../store/speedTestStore';
import { useModalStore } from '../store/modalStore';
import './HistoryModal.css';

export const HistoryModal: React.FC = () => {
  const { history, clearHistory } = useSpeedTestStore();
  const { closeHistory } = useModalStore();

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSpeedRating = (download: number) => {
    if (download >= 100) return { text: 'Excelente', class: 'excellent' };
    if (download >= 50) return { text: 'Boa', class: 'good' };
    if (download >= 25) return { text: 'Regular', class: 'average' };
    return { text: 'Ruim', class: 'poor' };
  };

  const averageSpeed = history.length > 0 
    ? history.reduce((sum, test) => sum + test.download, 0) / history.length 
    : 0;

  return (
    <div className="history-modal">
      <div className="modal-header">
        <h3>📊 Histórico de Testes</h3>
        <button onClick={closeHistory} className="modal-close" aria-label="Fechar">
          ×
        </button>
      </div>
      
      <div className="modal-body">
        {history.length === 0 ? (
          <div className="empty-history">
            <div className="empty-icon">📈</div>
            <h4>Nenhum teste realizado ainda</h4>
            <p>Faça seu primeiro teste de velocidade para começar a acompanhar seu histórico!</p>
          </div>
        ) : (
          <>
            <div className="history-stats">
              <div className="stat-item">
                <span className="stat-label">Total de Testes</span>
                <span className="stat-value">{history.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Velocidade Média</span>
                <span className="stat-value">{averageSpeed.toFixed(1)} Mbps</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Melhor Resultado</span>
                <span className="stat-value">
                  {Math.max(...history.map(h => h.download)).toFixed(1)} Mbps
                </span>
              </div>
            </div>

            <div className="history-list">
              {history.map((test) => {
                const rating = getSpeedRating(test.download);
                return (
                  <div key={test.id} className="history-item">
                    <div className="history-date">
                      {formatDate(test.timestamp)}
                    </div>
                    <div className="history-speeds">
                      <div className="speed-group">
                        <span className="speed-label">Download</span>
                        <span className={`speed-value ${rating.class}`}>
                          {test.download.toFixed(1)} Mbps
                        </span>
                      </div>
                      <div className="speed-group">
                        <span className="speed-label">Upload</span>
                        <span className="speed-value">
                          {test.upload.toFixed(1)} Mbps
                        </span>
                      </div>
                      <div className="speed-group">
                        <span className="speed-label">Ping</span>
                        <span className="speed-value">
                          {Math.round(test.ping)} ms
                        </span>
                      </div>
                    </div>
                    <div className={`speed-rating ${rating.class}`}>
                      {rating.text}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="history-actions">
              <button 
                onClick={clearHistory}
                className="clear-button"
                aria-label="Limpar histórico"
              >
                🗑️ Limpar Histórico
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
