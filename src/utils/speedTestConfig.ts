// Configurações para testes de velocidade reais
// Adicione suas próprias APIs e endpoints aqui

export interface SpeedTestEndpoint {
  name: string;
  downloadUrl: string;
  uploadUrl?: string;
  requiresAuth?: boolean;
  apiKey?: string;
}

// Endpoints públicos e gratuitos
export const freeEndpoints: SpeedTestEndpoint[] = [
  {
    name: 'Cloudflare',
    downloadUrl: 'https://speed.cloudflare.com/__down?bytes=',
  },
  {
    name: 'HTTPBin',
    downloadUrl: 'https://httpbin.org/bytes/',
    uploadUrl: 'https://httpbin.org/post'
  },
  {
    name: 'Postman Echo',
    downloadUrl: 'https://postman-echo.com/bytes/',
    uploadUrl: 'https://postman-echo.com/post'
  }
];

// Endpoints premium (requerem API key)
export const premiumEndpoints: SpeedTestEndpoint[] = [
  {
    name: 'Speedtest.net (Ookla)',
    downloadUrl: 'https://www.speedtest.net/api/js/servers?engine=js',
    requiresAuth: true,
    apiKey: 'SEU_API_KEY_AQUI' // Substitua pela sua chave real
  },
  {
    name: 'Fast.com (Netflix)',
    downloadUrl: 'https://api.fast.com/netflix/speedtest/v2.0/download',
    requiresAuth: false // Fast.com permite uso sem chave, mas com limitações
  }
];

// Configurações por região
export const regionalEndpoints = {
  'brasil': [
    'https://speed-sao.cloudflare.com/__down?bytes=',
    'https://speedtest-sao.example.com/download',
  ],
  'eua': [
    'https://speed-nyc.cloudflare.com/__down?bytes=',
    'https://speedtest-nyc.example.com/download',
  ],
  'europa': [
    'https://speed-lhr.cloudflare.com/__down?bytes=',
    'https://speedtest-lhr.example.com/download',
  ]
};

// Serviços de geolocalização
export const geolocationServices = [
  'https://ipapi.co/json/',
  'https://api.ipify.org?format=json',
  'https://ipinfo.io/json',
  'https://api.myip.com'
];

export const testConfig = {
  // Duração dos testes
  pingTestDuration: 3000,      // 3 segundos
  downloadTestDuration: 10000, // 10 segundos  
  uploadTestDuration: 8000,    // 8 segundos
  
  // Conexões simultâneas
  maxDownloadConnections: 8,
  maxUploadConnections: 4,
  
  // Tamanhos de dados para teste
  testDataSizes: [
    50 * 1024,     // 50KB
    100 * 1024,    // 100KB
    500 * 1024,    // 500KB
    1024 * 1024,   // 1MB
    5 * 1024 * 1024 // 5MB
  ],
  
  // Timeouts
  requestTimeout: 10000, // 10 segundos
  pingTimeout: 5000,     // 5 segundos
  
  // Fatores de calibração (ajustar baseado em testes)
  downloadSpeedMultiplier: 1.2,
  uploadSpeedMultiplier: 0.8,
  
  // Debug
  enableLogging: true,
  enableDetailedStats: true
};
