import { useSpeedTestStore } from '../store/speedTestStore';

// Simula testes de velocidade para demonstração
// Em produção, seria conectado a serviços reais como fast.com ou speedtest.net

export const performSpeedTest = async (): Promise<void> => {
  const { updateProgress, updateResult, completeTest } = useSpeedTestStore.getState();
  
  try {
    // 1. Teste de Ping
    updateProgress(10, 'ping');
    const ping = await simulatePingTest();
    updateResult('ping', ping);
    
    // 2. Teste de Download
    updateProgress(30, 'download');
    const download = await simulateDownloadTest();
    updateResult('download', download);
    
    // 3. Teste de Upload
    updateProgress(70, 'upload');
    const upload = await simulateUploadTest();
    updateResult('upload', upload);
    
    // 4. Finalizar
    updateProgress(100, 'complete');
    
    // Simular localização (em produção usaria IP geolocation API)
    updateResult('location', {
      city: 'São Paulo',
      country: 'Brasil',
      ip: '192.168.1.1'
    });
    
    // Aguardar um pouco antes de completar
    await new Promise(resolve => setTimeout(resolve, 500));
    
    completeTest();
    
  } catch (error) {
    console.error('Erro no teste de velocidade:', error);
    throw error;
  }
};

// Simula teste de ping
const simulatePingTest = async (): Promise<number> => {
  const startTime = performance.now();
  
  // Simula requisições para medir latência
  for (let i = 0; i < 5; i++) {
    await fetch('/favicon.ico', { cache: 'no-cache' }).catch(() => {});
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  const endTime = performance.now();
  const ping = Math.round((endTime - startTime) / 5);
  
  // Adiciona variação realística
  return Math.max(10, ping + Math.random() * 30);
};

// Simula teste de download
const simulateDownloadTest = async (): Promise<number> => {
  const { updateProgress } = useSpeedTestStore.getState();
  
  // Simula download progressivo
  for (let progress = 30; progress <= 60; progress += 5) {
    updateProgress(progress, 'download');
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  // Simula velocidade baseada na latência da conexão
  const testStart = performance.now();
  
  try {
    // Tenta baixar um arquivo pequeno para medir velocidade
    const response = await fetch('/favicon.ico?' + Math.random(), {
      cache: 'no-cache'
    });
    
    if (response.ok) {
      const testEnd = performance.now();
      const duration = testEnd - testStart;
      
      // Calcula velocidade simulada (Mbps)
      const baseSpeed = Math.max(1, 100 - (duration / 10));
      return Math.round(baseSpeed + Math.random() * 50);
    }
  } catch (error) {
    console.log('Erro no teste de download, usando velocidade simulada');
  }
  
  // Fallback: velocidade aleatória realística
  return Math.round(10 + Math.random() * 90);
};

// Simula teste de upload
const simulateUploadTest = async (): Promise<number> => {
  const { updateProgress } = useSpeedTestStore.getState();
  
  // Simula upload progressivo
  for (let progress = 70; progress <= 95; progress += 5) {
    updateProgress(progress, 'upload');
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  // Upload geralmente é mais lento que download
  const downloadSpeed = useSpeedTestStore.getState().currentResult?.download || 50;
  const uploadRatio = 0.1 + Math.random() * 0.4; // 10% - 50% da velocidade de download
  
  return Math.round(downloadSpeed * uploadRatio);
};

// Função para obter comparações baseadas na velocidade
export const getSpeedComparisons = (download: number, ping: number) => {
  const comparisons = [];
  
  // Comparação com média brasileira
  const brazilAverage = 60; // Mbps
  const brazilComparison = download > brazilAverage ? 'superior' : 
                          download > brazilAverage * 0.8 ? 'similar' : 'inferior';
  
  comparisons.push({
    label: 'Média do Brasil',
    value: `${brazilComparison === 'superior' ? '⬆️' : brazilComparison === 'similar' ? '↔️' : '⬇️'} ${Math.round((download / brazilAverage) * 100)}%`,
    status: brazilComparison === 'superior' ? 'good' : brazilComparison === 'similar' ? 'average' : 'poor'
  });
  
  // Gaming performance
  const gamingStatus = ping < 20 && download > 25 ? 'excellent' :
                      ping < 50 && download > 15 ? 'good' :
                      ping < 100 && download > 10 ? 'average' : 'poor';
  
  comparisons.push({
    label: 'Gaming Online',
    value: gamingStatus === 'excellent' ? '🎮 Excelente' :
           gamingStatus === 'good' ? '👍 Bom' :
           gamingStatus === 'average' ? '⚠️ Regular' : '❌ Ruim',
    status: gamingStatus as any
  });
  
  // Streaming quality
  const streamingQuality = download >= 100 ? '4K Ultra' :
                          download >= 50 ? '4K' :
                          download >= 25 ? '1080p HD' :
                          download >= 15 ? '720p' :
                          download >= 5 ? '480p' : '360p';
  
  comparisons.push({
    label: 'Streaming Netflix',
    value: `📺 ${streamingQuality}`,
    status: download >= 50 ? 'good' : download >= 15 ? 'average' : 'poor'
  });
  
  return comparisons;
};

// Função para gerar cenários baseados na velocidade
export const getSpeedScenarios = (download: number, upload: number, ping: number) => {
  const scenarios = [];
  
  // Download de jogo
  const gameSize = 50; // GB
  const downloadTimeMinutes = (gameSize * 8 * 1024) / (download * 60); // Conversão GB para Mb
  const downloadTimeHours = Math.floor(downloadTimeMinutes / 60);
  const downloadTimeRemainingMinutes = Math.floor(downloadTimeMinutes % 60);
  
  scenarios.push({
    label: 'Download GTA VI (50GB)',
    value: downloadTimeHours > 0 ? 
           `${downloadTimeHours}h ${downloadTimeRemainingMinutes}min` : 
           `${Math.round(downloadTimeMinutes)}min`,
    icon: '🎮'
  });
  
  // Upload de vídeo
  const videoSize = 1; // GB
  const uploadTimeMinutes = (videoSize * 8 * 1024) / (upload * 60);
  
  scenarios.push({
    label: 'Upload vídeo 1GB YouTube',
    value: uploadTimeMinutes > 60 ? 
           `${Math.floor(uploadTimeMinutes / 60)}h ${Math.floor(uploadTimeMinutes % 60)}min` :
           `${Math.round(uploadTimeMinutes)}min`,
    icon: '📹'
  });
  
  // Qualidade de videoconferência
  const videoCallQuality = download >= 50 && upload >= 25 && ping < 50 ? 
                          'HD sem problemas' :
                          download >= 25 && upload >= 10 && ping < 100 ?
                          'HD com possíveis travamentos' :
                          'Qualidade reduzida';
  
  scenarios.push({
    label: 'Zoom/Teams',
    value: videoCallQuality,
    icon: '💼'
  });
  
  return scenarios;
};

// Função para gerar feedback criativo
export const getCreativeFeedback = (download: number, upload: number, ping: number) => {
  if (download >= 100 && ping < 20) {
    return {
      title: 'Velocidade Supersônica! 🚀',
      message: `Com ${download}Mbps, sua internet voa mais rápido que um foguete da SpaceX! Dá pra baixar GTA VI e ainda sobra banda pra assistir Netflix em 8K (quando inventarem isso 😅).`,
      emoji: '🚀',
      level: 'excellent' as const
    };
  }
  
  if (download >= 50 && ping < 50) {
    return {
      title: 'Internet Turbinada! ⚡',
      message: `${download}Mbps tá ótimo! Dá pra fazer tudo: jogar online, assistir 4K e ainda fazer aquela call importante sem travar. Teu chefe não vai ter desculpa pra reclamar! 😎`,
      emoji: '⚡',
      level: 'good' as const
    };
  }
  
  if (download >= 25 && ping < 100) {
    return {
      title: 'Na Média, Guerreiro! 📡',
      message: `${download}Mbps é suficiente pra maioria das coisas. Netflix roda suave em HD, mas se todo mundo em casa resolver usar ao mesmo tempo... aí complica! 😅`,
      emoji: '📡',
      level: 'average' as const
    };
  }
  
  return {
    title: 'Houston, Temos um Problema! 🐌',
    message: `${download}Mbps... bem, pelo menos dá pra mandar email! YouTube em 480p vai ser seu melhor amigo. Hora de ligar pra operadora e fazer aquele drama! 😤`,
    emoji: '🐌',
    level: 'poor' as const
  };
};
