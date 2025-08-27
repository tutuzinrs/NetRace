import React from 'react';
import { useModalStore } from '../store/modalStore';
import './RankingModal.css';

export const RankingModal: React.FC = () => {
  const { closeRanking } = useModalStore();

  // Mock data para demonstração do ranking futuro
  const mockRanking = [
    { position: 1, speed: 1200, location: 'São Paulo, SP', user: 'SpeedKing2024' },
    { position: 2, speed: 980, location: 'Rio de Janeiro, RJ', user: 'NetRacer' },
    { position: 3, speed: 850, location: 'Belo Horizonte, MG', user: 'TurboUser' },
    { position: 4, speed: 720, location: 'Curitiba, PR', user: 'FastConnection' },
    { position: 5, speed: 680, location: 'Porto Alegre, RS', user: 'QuickNet' },
  ];

  return (
    <div className="ranking-modal">
      <div className="modal-header">
        <h3>🏆 Ranking Global</h3>
        <button onClick={closeRanking} className="modal-close" aria-label="Fechar">
          ×
        </button>
      </div>
      
      <div className="modal-body">
        <div className="ranking-coming-soon">
          <div className="coming-soon-icon">🚧</div>
          <h4>Sistema de Ranking em Desenvolvimento</h4>
          <p>
            Em breve você poderá competir com usuários do mundo todo e ver quem tem a internet mais rápida!
          </p>
          
          <div className="features-preview">
            <h5>🎯 O que está vindo:</h5>
            <ul>
              <li>🥇 Ranking global em tempo real</li>
              <li>🌎 Rankings por cidade e estado</li>
              <li>🎮 Competições semanais e mensais</li>
              <li>🏅 Sistema de conquistas e badges</li>
              <li>📊 Comparações detalhadas</li>
              <li>👥 Perfis de usuário</li>
            </ul>
          </div>

          <div className="mock-ranking">
            <h5>📈 Preview do Ranking:</h5>
            <div className="ranking-list">
              {mockRanking.map((entry, index) => (
                <div key={index} className={`ranking-item ${index < 3 ? 'podium' : ''}`}>
                  <div className="ranking-position">
                    <span className="position-number">#{entry.position}</span>
                    {index === 0 && <span className="medal">🥇</span>}
                    {index === 1 && <span className="medal">🥈</span>}
                    {index === 2 && <span className="medal">🥉</span>}
                  </div>
                  <div className="ranking-info">
                    <div className="user-name">{entry.user}</div>
                    <div className="user-location">{entry.location}</div>
                  </div>
                  <div className="ranking-speed">
                    {entry.speed} Mbps
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="cta-section">
            <p>Quer ser notificado quando o ranking estiver disponível?</p>
            <button className="cta-button">
              🔔 Me Avise Quando Estiver Pronto!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
