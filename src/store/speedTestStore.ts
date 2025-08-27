import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SpeedTestResult {
  id: string;
  timestamp: number;
  download: number;
  upload: number;
  ping: number;
  location?: {
    city?: string;
    country?: string;
    ip?: string;
  };
}

export interface SpeedTestState {
  // Current test state
  isTestRunning: boolean;
  isTestComplete: boolean;
  currentStep: 'idle' | 'ping' | 'download' | 'upload' | 'complete';
  progress: number;
  
  // Current test results
  currentResult: Partial<SpeedTestResult> | null;
  
  // History
  history: SpeedTestResult[];
  hasHistory: boolean;
  
  // Actions
  startTest: () => void;
  updateProgress: (progress: number, step: SpeedTestState['currentStep']) => void;
  updateResult: (field: keyof SpeedTestResult, value: any) => void;
  completeTest: () => void;
  resetTest: () => void;
  addToHistory: (result: SpeedTestResult) => void;
  clearHistory: () => void;
}

export const useSpeedTestStore = create<SpeedTestState>()(
  persist(
    (set, get) => ({
      // Initial state
      isTestRunning: false,
      isTestComplete: false,
      currentStep: 'idle',
      progress: 0,
      currentResult: null,
      history: [],
      hasHistory: false,

      // Actions
      startTest: () => {
        set({
          isTestRunning: true,
          isTestComplete: false,
          currentStep: 'ping',
          progress: 0,
          currentResult: {
            id: `test-${Date.now()}`,
            timestamp: Date.now(),
          },
        });
      },

      updateProgress: (progress, step) => {
        set({ progress, currentStep: step });
      },

      updateResult: (field, value) => {
        set((state) => ({
          currentResult: {
            ...state.currentResult,
            [field]: value,
          },
        }));
      },

      completeTest: () => {
        const { currentResult, addToHistory } = get();
        
        if (currentResult && currentResult.download && currentResult.upload && currentResult.ping) {
          const completeResult: SpeedTestResult = {
            id: currentResult.id || `test-${Date.now()}`,
            timestamp: currentResult.timestamp || Date.now(),
            download: currentResult.download,
            upload: currentResult.upload,
            ping: currentResult.ping,
            location: currentResult.location,
          };
          
          addToHistory(completeResult);
        }
        
        set({
          isTestRunning: false,
          isTestComplete: true,
          currentStep: 'complete',
          progress: 100,
        });
      },

      resetTest: () => {
        set({
          isTestRunning: false,
          isTestComplete: false,
          currentStep: 'idle',
          progress: 0,
          currentResult: null,
        });
      },

      addToHistory: (result) => {
        set((state) => ({
          history: [result, ...state.history].slice(0, 20), // Keep only last 20 tests
          hasHistory: true,
        }));
      },

      clearHistory: () => {
        set({
          history: [],
          hasHistory: false,
        });
      },
    }),
    {
      name: 'netrace-speed-test',
      partialize: (state) => ({ 
        history: state.history,
        hasHistory: state.hasHistory,
      }),
    }
  )
);
