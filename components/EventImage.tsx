'use client';

import { useEffect, useRef } from 'react';

interface EventImageProps {
  tier?: 'silver' | 'gold' | 'platinum';
  width: number;
  height: number;
}

const TIER_COLORS = {
  silver: '#C0C0C0',
  gold: '#FFD700',
  platinum: '#E5E4E2',
  default: '#F0F0F0',
};

export default function EventImage({ tier = 'default', width, height }: EventImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set background color
    ctx.fillStyle = TIER_COLORS[tier as keyof typeof TIER_COLORS];
    ctx.fillRect(0, 0, width, height);

    // Add gradient overlay
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, 'rgba(0,0,0,0.2)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.4)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add tier text
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'white';
    ctx.fillText(tier.toUpperCase(), width / 2, height / 2);

    // Save the canvas as an image
    const dataUrl = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.download = `tier-${tier}.jpg`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [tier, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ display: 'none' }}
    />
  );
} 