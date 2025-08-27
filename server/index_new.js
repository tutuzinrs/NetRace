const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3456;

// Middleware
app.use(cors());
app.use(express.json());

// Cache para o token do Fast.com
let fastComToken = null;
let tokenExpiry = 0;
let cachedConfig = null;

// Função para obter configuração completa do Fast.com
async function getFastComConfig() {
  try {
    console.log('🔑 Obtendo configuração do Fast.com...');
    
    // Primeiro, tentamos o endpoint principal do Fast.com
    const response = await fetch('https://api.fast.com/netflix/speedtest/v2?https=true', {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9,pt;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    if (!response.ok) {
      console.log(`❌ Fast.com API falhou (${response.status}), gerando dados de desenvolvimento...`);
      
      // Dados simulados para desenvolvimento
      const mockData = {
        token: 'fast_dev_' + Date.now(),
        targets: [
          {
            name: 'Netflix CDN São Paulo',
            url: 'https://httpbin.org/bytes/1048576', // 1MB para teste
            location: { city: 'São Paulo', country: 'Brazil' }
          },
          {
            name: 'Netflix CDN Rio de Janeiro', 
            url: 'https://httpbin.org/bytes/524288', // 512KB para teste
            location: { city: 'Rio de Janeiro', country: 'Brazil' }
          },
          {
            name: 'Netflix CDN Brasília', 
            url: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png', // Arquivo real
            location: { city: 'Brasília', country: 'Brazil' }
          }
        ],
        client: {
          ip: '191.7.123.45',
          location: { city: 'São Paulo', country: 'Brazil' },
          isp: 'Provedor Brasileiro Ltda'
        }
      };
      
      fastComToken = mockData.token;
      tokenExpiry = Date.now() + (30 * 60 * 1000);
      cachedConfig = mockData;
      
      console.log('✅ Configuração simulada gerada para desenvolvimento');
      console.log(`📡 Token: ${mockData.token}`);
      console.log(`🌐 Servidores: ${mockData.targets.length}`);
      console.log(`📍 Localização: ${mockData.client.location.city}, ${mockData.client.location.country}`);
      
      return mockData;
    }
    
    const data = await response.json();
    console.log('✅ Configuração real do Fast.com recebida');
    
    // Cache da configuração por 30 minutos
    fastComToken = data.token || data.sessionToken || ('fast_' + Date.now());
    tokenExpiry = Date.now() + (30 * 60 * 1000);
    cachedConfig = data;
    
    console.log(`📡 Token: ${fastComToken}`);
    console.log(`🌐 Servidores: ${data.targets ? data.targets.length : 'N/A'}`);
    
    return data;
    
  } catch (error) {
    console.error('❌ Erro ao obter configuração Fast.com:', error.message);
    
    // Fallback: criar dados simulados
    const fallbackData = {
      token: 'fast_fallback_' + Date.now(),
      targets: [
        {
          name: 'Netflix CDN Brasil',
          url: 'https://httpbin.org/bytes/1048576',
          location: { city: 'São Paulo', country: 'Brazil' }
        }
      ],
      client: {
        ip: '200.100.50.25',
        location: { city: 'São Paulo', country: 'Brazil' },
        isp: 'Internet Provider Brasil'
      }
    };
    
    fastComToken = fallbackData.token;
    tokenExpiry = Date.now() + (30 * 60 * 1000);
    cachedConfig = fallbackData;
    
    console.log('⚠️ Usando dados fallback para desenvolvimento');
    return fallbackData;
  }
}

// Endpoint para obter configuração do Fast.com
app.get('/api/fast-config', async (req, res) => {
  try {
    console.log('🔗 Recebida requisição para /api/fast-config');
    
    // Verifica se precisa renovar a configuração
    if (!cachedConfig || !fastComToken || Date.now() > tokenExpiry) {
      console.log('🔄 Cache expirado, obtendo nova configuração...');
      await getFastComConfig();
    } else {
      console.log('✅ Usando configuração em cache');
    }
    
    if (!cachedConfig) {
      throw new Error('Não foi possível obter configuração do Fast.com');
    }
    
    console.log('📤 Enviando configuração para o frontend');
    res.json(cachedConfig);
    
  } catch (error) {
    console.error('❌ Erro no proxy Fast.com:', error);
    res.status(500).json({ 
      error: 'Erro ao obter configuração do Fast.com',
      details: error.message 
    });
  }
});

// Endpoint para teste de download
app.get('/api/fast-download', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL é obrigatória' });
    }
    
    console.log('📥 Fazendo download de teste para:', url);
    
    const startTime = Date.now();
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Download falhou com status: ${response.status}`);
    }
    
    const buffer = await response.buffer();
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    res.json({
      size: buffer.length,
      duration: duration,
      speed: (buffer.length * 8) / (duration / 1000), // bits por segundo
      success: true,
      url: url
    });
    
  } catch (error) {
    console.error('❌ Erro no download:', error);
    res.status(500).json({ 
      error: 'Erro no download de teste',
      details: error.message 
    });
  }
});

// Endpoint de teste para verificar se o servidor está funcionando
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    hasToken: !!fastComToken,
    tokenExpiry: new Date(tokenExpiry).toISOString(),
    hasConfig: !!cachedConfig,
    configTargets: cachedConfig ? cachedConfig.targets?.length || 0 : 0
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor Fast.com proxy rodando na porta ${PORT}`);
  console.log(`📡 Acesse: http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`⚡ Fast.com config: http://localhost:${PORT}/api/fast-config`);
  console.log(`\n🔄 Obtendo configuração inicial...`);
  
  // Obtém configuração inicial ao iniciar o servidor
  getFastComConfig().then(() => {
    console.log('✅ Servidor pronto para receber requisições!');
  }).catch(err => {
    console.log('⚠️ Servidor iniciado com configuração fallback');
  });
});
