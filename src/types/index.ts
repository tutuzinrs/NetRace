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

export interface Comparison {
  label: string;
  value: string;
  status: 'good' | 'average' | 'poor';
}

export interface Scenario {
  label: string;
  value: string;
  icon: string;
}

export interface Feedback {
  title: string;
  message: string;
  emoji: string;
  level: 'excellent' | 'good' | 'average' | 'poor';
}
