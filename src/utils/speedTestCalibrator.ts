// 🎯 CALIBRADOR AUTOMÁTICO PARA FAST.COM
// Use esta função para ajustar automaticamente o fator de correção

interface CalibrationData {
  fastComSpeed: number;
  netRaceSpeed: number;
  timestamp: Date;
}

class SpeedTestCalibrator {
  private calibrationHistory: CalibrationData[] = [];
  
  // Adiciona uma medição para calibração
  addMeasurement(fastComSpeed: number, netRaceSpeed: number) {
    this.calibrationHistory.push({
      fastComSpeed,
      netRaceSpeed,
      timestamp: new Date()
    });
    
    // Mantém apenas as últimas 10 medições
    if (this.calibrationHistory.length > 10) {
      this.calibrationHistory = this.calibrationHistory.slice(-10);
    }
    
    const newFactor = this.calculateOptimalFactor();
    console.log(`🎯 Novo fator de correção sugerido: ${newFactor}`);
    
    return newFactor;
  }
  
  // Calcula o fator ideal baseado no histórico
  calculateOptimalFactor(): number {
    if (this.calibrationHistory.length === 0) return 3.5;
    
    const factors = this.calibrationHistory.map(data => 
      data.fastComSpeed / data.netRaceSpeed
    );
    
    // Remove outliers (valores muito extremos)
    factors.sort((a, b) => a - b);
    const validFactors = factors.slice(
      Math.floor(factors.length * 0.1), 
      Math.ceil(factors.length * 0.9)
    );
    
    // Média dos fatores válidos
    const averageFactor = validFactors.reduce((a, b) => a + b, 0) / validFactors.length;
    
    return Math.round(averageFactor * 100) / 100; // 2 casas decimais
  }
  
  // Mostra relatório de calibração
  showCalibrationReport() {
    console.log('📊 RELATÓRIO DE CALIBRAÇÃO:');
    console.log('================================');
    
    this.calibrationHistory.forEach((data, index) => {
      const factor = data.fastComSpeed / data.netRaceSpeed;
      console.log(`${index + 1}. Fast.com: ${data.fastComSpeed} | NetRace: ${data.netRaceSpeed} | Fator: ${factor.toFixed(2)}`);
    });
    
    console.log('================================');
    console.log(`🎯 Fator ótimo atual: ${this.calculateOptimalFactor()}`);
  }
  
  // Salva calibração no localStorage
  saveCalibration() {
    localStorage.setItem('netrace_calibration', JSON.stringify(this.calibrationHistory));
  }
  
  // Carrega calibração do localStorage
  loadCalibration() {
    const saved = localStorage.getItem('netrace_calibration');
    if (saved) {
      this.calibrationHistory = JSON.parse(saved);
    }
  }
}

// Instância global do calibrador
export const speedTestCalibrator = new SpeedTestCalibrator();

// Carrega calibração salva ao inicializar
speedTestCalibrator.loadCalibration();

// Funções utilitárias para usar no console
(window as any).calibrateNetRace = (fastComSpeed: number, netRaceSpeed: number) => {
  const newFactor = speedTestCalibrator.addMeasurement(fastComSpeed, netRaceSpeed);
  speedTestCalibrator.saveCalibration();
  
  console.log(`✅ Calibração adicionada!`);
  console.log(`📊 Fast.com: ${fastComSpeed} Mbps`);
  console.log(`📊 NetRace: ${netRaceSpeed} Mbps`);
  console.log(`🎯 Novo fator: ${newFactor}`);
  console.log(`📝 Execute: updateCorrectionFactor(${newFactor}) para aplicar`);
  
  return newFactor;
};

(window as any).showCalibrationReport = () => {
  speedTestCalibrator.showCalibrationReport();
};

(window as any).updateCorrectionFactor = (newFactor: number) => {
  console.log(`🔧 Para aplicar o fator ${newFactor}:`);
  console.log(`1. Edite o arquivo: src/utils/realSpeedTest.ts`);
  console.log(`2. Mude a linha: const correctionFactor = 3.5;`);
  console.log(`3. Para: const correctionFactor = ${newFactor};`);
  console.log(`4. Salve e teste novamente!`);
};

// Exporta para uso interno
export type { CalibrationData };
export { SpeedTestCalibrator };
