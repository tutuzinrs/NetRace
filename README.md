# NetRace 🚀 - Teste de Velocidade Gamificado

Uma aplicação moderna e divertida para testar a velocidade da internet, desenvolvida em React + TypeScript com foco em gamificação e experiência do usuário.

## 🎯 Características Principais

### ✨ Diferenciais
- **Visualização Gamificada**: Foguete animado que acelera conforme a velocidade
- **Comparações em Tempo Real**: Compare sua internet com médias do Brasil
- **Cenários Reais**: Veja quanto tempo levaria para baixar jogos, fazer upload, etc.
- **Feedback Criativo**: Mensagens divertidas baseadas na sua velocidade
- **Histórico Inteligente**: Gráficos de evolução da velocidade
- **Design Moderno**: Dark mode nativo com animações suaves

### 🛠 Tecnologias
- **Frontend**: React 18 + TypeScript
- **Estado Global**: Zustand
- **Animações**: CSS Animations + Canvas
- **Gráficos**: Chart.js
- **Build**: Vite
- **Estilização**: CSS Modules + CSS Variables

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone https://github.com/tutuzinrs/NetRace.git
cd NetRace

# Instale as dependências
npm install

# Execute em desenvolvimento
npm run dev

# Build para produção
npm run build
```

### Scripts Disponíveis
- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run preview` - Preview do build
- `npm run lint` - Verificação de código
- `npm run type-check` - Verificação de tipos

## 📱 Preparado para Mobile

O projeto foi desenvolvido com React pensando na futura migração para **React Native**, seguindo boas práticas:

- Componentes reutilizáveis
- Lógica de negócio separada (stores)
- CSS responsivo
- Hooks customizados
- Tipagem TypeScript completa

## 🎮 Funcionalidades

### Teste de Velocidade
- Medição de **Download**, **Upload** e **Ping**
- Animação em tempo real do foguete
- Barras de progresso animadas
- Indicadores visuais de status

### Comparações Inteligentes
- Comparação com média brasileira
- Avaliação para gaming online
- Qualidade de streaming (Netflix, YouTube)
- Performance para videoconferência

### Cenários Práticos
- Tempo para baixar jogos (ex: GTA VI 50GB)
- Upload de vídeos para YouTube
- Qualidade de chamadas Zoom/Teams
- Streaming em diferentes resoluções

### Feedback Criativo
Sistema de mensagens personalizadas:
- **Excelente** (100+ Mbps): "Velocidade Supersônica! 🚀"
- **Bom** (50+ Mbps): "Internet Turbinada! ⚡"
- **Regular** (25+ Mbps): "Na Média, Guerreiro! 📡"
- **Ruim** (<25 Mbps): "Houston, Temos um Problema! 🐌"

### Histórico e Analytics
- Armazenamento local dos últimos 20 testes
- Gráfico de evolução temporal
- Comparação de performance
- Estatísticas detalhadas

## 🎨 Design System

### Cores
- **Primary**: `#00ff88` (Verde neon)
- **Secondary**: `#ff6b35` (Laranja)
- **Background**: `#0a0a0f` (Preto espacial)
- **Surface**: `#1a1a24` (Cinza escuro)

### Tipografia
- **Primary**: Orbitron (títulos e números)
- **Body**: Inter (texto geral)

### Animações
- Transições suaves (cubic-bezier)
- Hover effects com shadow
- Loading states animados
- Progressão visual fluida

## 📊 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── Header/         # Cabeçalho com navegação
│   ├── SpeedTest/      # Componente principal de teste
│   ├── RocketCanvas/   # Animação do foguete
│   ├── SpeedDisplay/   # Display dos resultados
│   ├── ProgressBar/    # Barra de progresso
│   ├── Results/        # Exibição de resultados
│   ├── HistoryChart/   # Gráfico histórico
│   └── Modal/          # Sistema de modais
├── store/              # Estado global (Zustand)
│   ├── speedTestStore  # Estado do teste
│   └── modalStore      # Estado dos modais
├── utils/              # Utilitários
│   └── speedTest       # Lógica dos testes
├── types/              # Tipos TypeScript
└── styles/             # Estilos CSS
```

## 🔮 Roadmap Futuro

### Próximas Funcionalidades
- [ ] Backend Node.js para ranking global
- [ ] Sistema de usuários e perfis
- [ ] Comparações por região/cidade
- [ ] Testes agendados automáticos
- [ ] Alertas de queda de performance
- [ ] Integração com APIs reais de speed test
- [ ] PWA (Progressive Web App)
- [ ] **App React Native** 📱

### Melhorias Planejadas
- [ ] Mais animações Canvas/WebGL
- [ ] Themes customizáveis
- [ ] Exportação de relatórios
- [ ] Integração com social media
- [ ] Modo competitivo/torneios
- [ ] Machine learning para predições

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature
3. Fazer commit das mudanças
4. Abrir um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📧 Contato

- **GitHub**: [@tutuzinrs](https://github.com/tutuzinrs)
- **Email**: seu-email@exemplo.com

---

**NetRace** - Transformando testes de velocidade em uma experiência divertida! 🚀✨
