const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = 4000;

// Middleware para CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'User-Agent', 'Accept']
}));

app.use(express.json());

// Log de todas as requisições
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url} - ${new Date().toLocaleTimeString()}`);
  next();
});

// Rota de proxy genérica
app.get('/proxy', async (req, res) => {
  const targetUrl = req.query.url;
  
  if (!targetUrl) {
    console.error('❌ URL não fornecida');
    return res.status(400).json({ error: 'Missing URL parameter' });
  }

  try {
    console.log(`🔗 Fazendo proxy para: ${targetUrl}`);
    
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9,pt;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Detecta o tipo de conteúdo
    const contentType = response.headers.get('content-type') || '';
    console.log(`📄 Content-Type: ${contentType}`);

    if (contentType.includes('application/json')) {
      const data = await response.json();
      console.log(`✅ JSON recebido (${JSON.stringify(data).length} chars)`);
      res.json(data);
    } else if (contentType.includes('text/')) {
      const data = await response.text();
      console.log(`✅ Texto recebido (${data.length} chars)`);
      res.set('Content-Type', contentType);
      res.send(data);
    } else {
      // Para imagens, binários, etc.
      const buffer = await response.buffer();
      console.log(`✅ Binário recebido (${buffer.length} bytes)`);
      res.set('Content-Type', contentType);
      res.send(buffer);
    }

  } catch (error) {
    console.error(`❌ Erro no proxy: ${error.message}`);
    res.status(500).json({ 
      error: 'Proxy request failed',
      details: error.message,
      targetUrl: targetUrl
    });
  }
});

// Rota específica para Fast.com API
app.get('/fastcom-config', async (req, res) => {
  try {
    console.log('🚀 Obtendo configuração Fast.com...');
    
    // Primeiro tenta obter token
    const tokenResponse = await fetch('https://api.fast.com/netflix/speedtest/v2?https=true', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });

    if (!tokenResponse.ok) {
      console.log('❌ Fast.com API não disponível, usando dados simulados...');
      
      // Dados simulados com arquivos maiores para teste real
      const mockData = {
        token: 'netrace_' + Date.now(),
        targets: [
          {
            name: 'São Paulo CDN 1',
            url: 'https://httpbin.org/bytes/5242880', // 5MB
            location: { city: 'São Paulo', country: 'Brazil' }
          },
          {
            name: 'São Paulo CDN 2', 
            url: 'https://httpbin.org/bytes/3145728', // 3MB
            location: { city: 'São Paulo', country: 'Brazil' }
          },
          {
            name: 'Rio de Janeiro CDN 1',
            url: 'https://httpbin.org/bytes/4194304', // 4MB
            location: { city: 'Rio de Janeiro', country: 'Brazil' }
          },
          {
            name: 'Rio de Janeiro CDN 2',
            url: 'https://httpbin.org/bytes/2097152', // 2MB
            location: { city: 'Rio de Janeiro', country: 'Brazil' }
          },
          {
            name: 'Brasília CDN 1',
            url: 'https://httpbin.org/bytes/6291456', // 6MB
            location: { city: 'Brasília', country: 'Brazil' }
          },
          {
            name: 'Brasília CDN 2',
            url: 'https://httpbin.org/bytes/1048576', // 1MB
            location: { city: 'Brasília', country: 'Brazil' }
          }
        ],
        client: {
          ip: '191.123.45.67',
          location: { city: 'São Paulo', country: 'Brazil' },
          isp: 'Provedor Internet Brasil'
        }
      };

      console.log('✅ Configuração simulada gerada com arquivos grandes');
      return res.json(mockData);
    }

    const data = await tokenResponse.json();
    console.log('✅ Configuração real Fast.com obtida');
    res.json(data);

  } catch (error) {
    console.error('❌ Erro Fast.com:', error.message);
    res.status(500).json({ 
      error: 'Fast.com configuration failed',
      details: error.message 
    });
  }
});

// Rota para teste de velocidade via proxy
app.get('/speed-test', async (req, res) => {
  const { url, size } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'Missing URL parameter' });
  }

  try {
    console.log(`⚡ Teste de velocidade: ${url}`);
    
    const startTime = Date.now();
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Cache-Control': 'no-cache'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const buffer = await response.buffer();
    const endTime = Date.now();
    
    const duration = (endTime - startTime) / 1000; // segundos
    const sizeBytes = buffer.length;
    const speedBps = sizeBytes / duration; // bytes por segundo
    const speedMbps = (speedBps * 8) / (1024 * 1024); // Mbps

    const result = {
      success: true,
      size: sizeBytes,
      duration: duration,
      speedBps: speedBps,
      speedMbps: Math.round(speedMbps * 100) / 100,
      url: url
    };

    console.log(`✅ Teste concluído: ${result.speedMbps} Mbps`);
    res.json(result);

  } catch (error) {
    console.error(`❌ Erro no teste: ${error.message}`);
    res.status(500).json({ 
      error: 'Speed test failed',
      details: error.message 
    });
  }
});

// Endpoint para teste de múltiplas conexões simultâneas (como Fast.com real)
app.post('/multi-speed-test', async (req, res) => {
  const { urls, duration = 15 } = req.body; // 15 segundos por padrão
  
  if (!urls || !Array.isArray(urls)) {
    return res.status(400).json({ error: 'Missing URLs array' });
  }

  try {
    console.log(`🚀 Iniciando teste multi-conexão com ${urls.length} URLs por ${duration}s`);
    
    let totalBytes = 0;
    let activeConnections = 0;
    const startTime = Date.now();
    const endTime = startTime + (duration * 1000);
    
    // Função para download contínuo de uma URL
    const downloadWorker = async (url, workerId) => {
      console.log(`🏃 Worker ${workerId} iniciado: ${url}`);
      activeConnections++;
      let workerBytes = 0;
      
      while (Date.now() < endTime) {
        try {
          const response = await fetch(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Cache-Control': 'no-cache'
            }
          });
          
          if (response.ok) {
            const buffer = await response.buffer();
            workerBytes += buffer.length;
            totalBytes += buffer.length;
          }
        } catch (error) {
          console.log(`⚠️ Worker ${workerId} erro temporário:`, error.message);
        }
        
        // Pequena pausa para não sobrecarregar
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      activeConnections--;
      console.log(`✅ Worker ${workerId} finalizado: ${(workerBytes / 1024 / 1024).toFixed(2)} MB`);
      return workerBytes;
    };
    
    // Inicia todos os workers simultaneamente
    const promises = urls.map((url, index) => downloadWorker(url, index));
    
    // Aguarda todos terminarem
    const results = await Promise.all(promises);
    
    const actualDuration = (Date.now() - startTime) / 1000;
    const speedBps = totalBytes / actualDuration;
    const speedMbps = (speedBps * 8) / (1024 * 1024);
    
    const result = {
      success: true,
      totalBytes: totalBytes,
      duration: actualDuration,
      speedBps: speedBps,
      speedMbps: Math.round(speedMbps * 100) / 100,
      connections: urls.length,
      workerResults: results.map((bytes, i) => ({
        workerId: i,
        url: urls[i],
        bytes: bytes,
        mbps: Math.round(((bytes / actualDuration) * 8) / (1024 * 1024) * 100) / 100
      }))
    };

    console.log(`🎯 RESULTADO MULTI-CONEXÃO: ${result.speedMbps} Mbps (${result.totalBytes} bytes em ${result.duration}s)`);
    res.json(result);

  } catch (error) {
    console.error(`❌ Erro no teste multi-conexão: ${error.message}`);
    res.status(500).json({ 
      error: 'Multi-connection speed test failed',
      details: error.message 
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    server: 'FastCom Proxy',
    port: PORT
  });
});

// Página de status
app.get('/', (req, res) => {
  res.send(`
    <h1>🚀 FastCom Proxy Server</h1>
    <p><strong>Status:</strong> ✅ Online</p>
    <p><strong>Port:</strong> ${PORT}</p>
    <p><strong>Endpoints:</strong></p>
    <ul>
      <li><code>/proxy?url=URL</code> - Proxy genérico</li>
      <li><code>/fastcom-config</code> - Configuração Fast.com</li>
      <li><code>/speed-test?url=URL</code> - Teste de velocidade</li>
      <li><code>/health</code> - Health check</li>
    </ul>
    <p><strong>Exemplo:</strong></p>
    <code>http://localhost:${PORT}/proxy?url=${encodeURIComponent('https://httpbin.org/bytes/1024')}</code>
  `);
});

app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('🚀 FastCom Proxy Server iniciado!');
  console.log(`📡 Servidor: http://localhost:${PORT}`);
  console.log(`🔍 Health: http://localhost:${PORT}/health`);
  console.log(`⚡ Fast.com: http://localhost:${PORT}/fastcom-config`);
  console.log(`🌐 Proxy: http://localhost:${PORT}/proxy?url=URL`);
  console.log('='.repeat(60));
});
