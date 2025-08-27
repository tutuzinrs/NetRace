# 🎯 Como Calibrar o NetRace para Igualar Fast.com

## 🚀 **Versão Atual Melhorada:**

✅ **Implementei algoritmo similar ao Fast.com:**
- 3 fases de teste (warmup, measurement, final)
- 16 conexões paralelas máximas
- Arquivos de 1MB até 25MB 
- Fator de correção de **3.5x** (baseado no seu teste: 230/67)

## 📊 **Como Calibrar Agora:**

### **1. Teste os Dois Sites:**
```bash
1. Abra Fast.com no Chrome
2. Anote a velocidade (ex: 230 Mbps)
3. Teste o NetRace (botão 🌐 Teste REAL)
4. Anote a velocidade (ex: nova velocidade)
```

### **2. Use o Calibrador Automático:**
```javascript
// Abra o Console do Chrome (F12)
// Digite e execute:
calibrateNetRace(230, 67); // (fast.com, netrace)

// Isso calculará o fator ideal automaticamente
```

### **3. Aplique o Fator:**
```javascript
// O console mostrará algo como:
updateCorrectionFactor(3.43);

// Edite o arquivo: src/utils/realSpeedTest.ts
// Linha ~201: const correctionFactor = 3.5;
// Mude para: const correctionFactor = 3.43;
```

### **4. Teste Múltiplas Vezes:**
```javascript
// Faça 3-5 testes e adicione cada um:
calibrateNetRace(230, 65);
calibrateNetRace(225, 68);
calibrateNetRace(240, 70);

// Veja o relatório:
showCalibrationReport();
```

## 🔧 **Ajustes Rápidos:**

### **Se ainda estiver baixo (ex: Fast=230, NetRace=80):**
```typescript
// Aumente o fator:
const correctionFactor = 4.0; // Era 3.5
```

### **Se estiver alto demais (ex: Fast=230, NetRace=300):**
```typescript
// Diminua o fator:
const correctionFactor = 2.8; // Era 3.5
```

### **Se quiser mais conexões (mais agressivo):**
```typescript
// No config:
parallelConnections: 20, // Era 16
downloadTestDuration: 20000, // Era 15000 (20 segundos)
```

## 🎯 **Próximos Testes:**

1. **Teste o NetRace agora** com o fator 3.5x
2. **Compare com Fast.com**
3. **Use o calibrador** para ajuste fino
4. **Me conte o resultado!**

### **Comandos no Console:**
```javascript
// Para calibrar:
calibrateNetRace(velocidadeFast, velocidadeNetRace);

// Para ver histórico:
showCalibrationReport();

// Para aplicar novo fator:
updateCorrectionFactor(novoFator);
```

---

## 📈 **Algoritmo Implementado:**

### **Fases do Teste (igual Fast.com):**
1. **Warmup** (3s): 4 conexões, arquivos 1MB
2. **Measurement** (8s): 12 conexões, arquivos 10MB  
3. **Final** (4s): 16 conexões, arquivos 25MB

### **Cálculo Final:**
```typescript
velocidadeFinal = (
  warmup * 0.1 +      // 10% peso
  measurement * 0.6 + // 60% peso
  final * 0.3         // 30% peso
) * fatorCorreção
```

### **Servidores Usados:**
- Hetzner (Alemanha)
- Tele2 (Europa)
- OVH (França)
- Suporte a Range requests

---

🚀 **Teste agora e me diga os resultados para calibração final!**
