import React, { useRef, useEffect } from 'react';

interface RocketCanvasProps {
  isActive: boolean;
  progress: number;
  speed: number;
}

export const RocketCanvas: React.FC<RocketCanvasProps> = ({ 
  isActive, 
  progress, 
  speed 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Background stars
      drawStars(ctx, canvas.width, canvas.height);
      
      // Rocket
      const rocketX = isActive ? (progress / 100) * (canvas.width - 60) : 20;
      drawRocket(ctx, rocketX, canvas.height / 2 - 15, isActive);
      
      // Speed trail
      if (isActive && speed > 0) {
        drawSpeedTrail(ctx, rocketX, canvas.height / 2, speed);
      }
      
      // Speed text
      drawSpeedText(ctx, canvas.width, canvas.height, speed);
      
      if (isActive) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, progress, speed]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={200}
      className="rocket-canvas"
      style={{
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '12px',
        border: '1px solid var(--border)',
      }}
    />
  );
};

// Helper functions for drawing
const drawStars = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 50; i++) {
    const x = (i * 37) % width;
    const y = (i * 23) % height;
    const size = Math.random() * 2;
    ctx.fillRect(x, y, size, size);
  }
};

const drawRocket = (ctx: CanvasRenderingContext2D, x: number, y: number, isActive: boolean) => {
  // Rocket body
  ctx.fillStyle = isActive ? '#00ff88' : '#666';
  ctx.fillRect(x, y, 30, 20);
  
  // Rocket tip
  ctx.beginPath();
  ctx.moveTo(x + 30, y + 10);
  ctx.lineTo(x + 40, y + 10);
  ctx.strokeStyle = isActive ? '#00ff88' : '#666';
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // Flames when active
  if (isActive) {
    ctx.fillStyle = '#ff6b35';
    ctx.fillRect(x - 15, y + 5, 15, 10);
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(x - 10, y + 7, 10, 6);
  }
};

const drawSpeedTrail = (ctx: CanvasRenderingContext2D, x: number, y: number, speed: number) => {
  const trailLength = Math.min(speed * 2, 100);
  const gradient = ctx.createLinearGradient(x - trailLength, y, x, y);
  gradient.addColorStop(0, 'rgba(0, 255, 136, 0)');
  gradient.addColorStop(1, 'rgba(0, 255, 136, 0.8)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(x - trailLength, y + 8, trailLength, 4);
};

const drawSpeedText = (ctx: CanvasRenderingContext2D, width: number, height: number, speed: number) => {
  if (speed > 0) {
    ctx.fillStyle = '#00ff88';
    ctx.font = 'bold 16px Orbitron, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${speed.toFixed(1)} Mbps`, width / 2, height - 20);
  }
};
