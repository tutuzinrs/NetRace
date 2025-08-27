const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 9999;

// Middleware
app.use(cors());
app.use(express.json());

// Cache para o token do Fast.com
let fastComToken = null;
let tokenExpiry = 0;

// Função para obter token dinâmico do Fast.com
async function getFastComToken() {
  try {
    console.log('� Obtendo token dinâmico do Fast.com...');
    
    const response = await fetch('https://api.fast.com/app-boot?https=true', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Fast.com token request failed: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Token obtido:', data.token ? 'Sucesso' : 'Falhou');
    
    // Cache do token por 1 hora
    fastComToken = data.token;
    tokenExpiry = Date.now() + (60 * 60 * 1000);
    
    return data.token;
  } catch (error) {
    console.error('❌ Erro ao obter token Fast.com:', error);
    throw error;
  }
}

// Endpoint para obter configuração do Fast.com
app.get('/api/fast-config', async (req, res) => {
  try {
    console.log('🔗 Recebida requisição para /api/fast-config');
    
    // Verifica se precisa renovar o token
    if (!fastComToken || Date.now() > tokenExpiry) {
      await getFastComToken();
    }
    
    if (!fastComToken) {
      throw new Error('Não foi possível obter token do Fast.com');
    }
    
    console.log('📡 Fazendo request para Fast.com API com token...');
    const url = `https://api.fast.com/netflix/speedtest/v2?https=true&token=${fastComToken}&urlCount=5`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Fast.com API retornou status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Dados obtidos do Fast.com:', Object.keys(data));
    
    res.json(data);
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
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Download falhou com status: ${response.status}`);
    }
    
    const buffer = await response.buffer();
    
    res.json({
      size: buffer.length,
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
    tokenExpiry: new Date(tokenExpiry).toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor Fast.com proxy rodando na porta ${PORT}`);
  console.log(`📡 Acesse: http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`⚡ Fast.com config: http://localhost:${PORT}/api/fast-config`);
});
