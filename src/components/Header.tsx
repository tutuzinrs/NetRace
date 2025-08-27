import React from 'react';
import { useModalStore } from '../store/modalStore';
import './Header.css';

export const Header: React.FC = () => {
  const { openHistory, openRanking } = useModalStore();

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <h1>🚀 NetRace</h1>
          <span>Teste de Velocidade Gamificado</span>
        </div>
        
        <nav className="nav">
          <button 
            onClick={openHistory}
            className="nav-btn"
            aria-label="Abrir histórico de testes"
          >
            📊 Histórico
          </button>
          
          <button 
            onClick={openRanking}
            className="nav-btn"
            aria-label="Abrir ranking global"
          >
            🏆 Ranking
          </button>
        </nav>
      </div>
    </header>
  );
};
