import React from 'react';
import { useSpeedTestStore } from '../store/speedTestStore';
import { getSpeedComparisons, getSpeedScenarios, getCreativeFeedback } from '../utils/speedTest';
import './Results.css';

export const Results: React.FC = () => {
  const { currentResult } = useSpeedTestStore();

  if (!currentResult || !currentResult.download || !currentResult.upload || !currentResult.ping) {
    return null;
  }

  const { download, upload, ping } = currentResult;
  const comparisons = getSpeedComparisons(download, ping);
  const scenarios = getSpeedScenarios(download, upload, ping);
  const feedback = getCreativeFeedback(download, upload, ping);

  return (
    <section className="results-section">
      {/* Comparisons */}
      <div className="results-card comparison-card">
        <h3>📊 Comparações</h3>
        <div className="comparison-list">
          {comparisons.map((comparison, index) => (
            <div key={index} className={`comparison-item ${comparison.status}`}>
              <span className="item-label">{comparison.label}</span>
              <span className="item-value">{comparison.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scenarios */}
      <div className="results-card scenarios-card">
        <h3>🎮 Cenários Reais</h3>
        <div className="scenarios-list">
          {scenarios.map((scenario, index) => (
            <div key={index} className="scenario-item">
              <div className="scenario-info">
                <span className="scenario-icon">{scenario.icon}</span>
                <span className="item-label">{scenario.label}</span>
              </div>
              <span className="item-value">{scenario.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Creative Feedback */}
      <div className="results-card feedback-card">
        <h3>💬 Veredicto</h3>
        <div className={`feedback-content ${feedback.level}`}>
          <div className="feedback-header">
            <span className="feedback-emoji">{feedback.emoji}</span>
            <h4 className="feedback-title">{feedback.title}</h4>
          </div>
          <p className="feedback-message">{feedback.message}</p>
        </div>
      </div>
    </section>
  );
};
