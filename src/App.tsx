import { Header } from './components/Header';
import { SpeedTest } from './components/SpeedTest';
import { Results } from './components/Results';
import { HistoryChart } from './components/HistoryChart';
import { Modal } from './components/Modal';
import { HistoryModal } from './components/HistoryModal';
import { RankingModal } from './components/RankingModal';
import { useSpeedTestStore } from './store/speedTestStore';
import { useModalStore } from './store/modalStore';
import './App.css';

function App() {
  const { isTestComplete, hasHistory } = useSpeedTestStore();
  const { historyOpen, rankingOpen } = useModalStore();

  return (
    <div className="app">
      <Header />
      
      <main className="main">
        <div className="container">
          <SpeedTest />
          
          {isTestComplete && (
            <div className="fade-in">
              <Results />
            </div>
          )}
          
          {hasHistory && (
            <div className="fade-in">
              <HistoryChart />
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <Modal isOpen={historyOpen} onClose={() => useModalStore.getState().closeHistory()}>
        <HistoryModal />
      </Modal>

      <Modal isOpen={rankingOpen} onClose={() => useModalStore.getState().closeRanking()}>
        <RankingModal />
      </Modal>
    </div>
  );
}

export default App;
