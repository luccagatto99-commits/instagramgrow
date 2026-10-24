import React from 'react';
import { COR } from '../theme';

/**
 * Onda de som em barras verticais (centradas numa linha). `amp(i)` dá a altura 0 → 1
 * de cada barra; para reagir à narração, passe o envelope do áudio.
 * Posicionada pelo centro (x, y).
 */
export const OndaDeSom: React.FC<{
  x: number;
  y: number;
  largura: number;
  altura: number;
  n?: number;
  amp: (i: number) => number;
  cor?: string;
  minimo?: number; // altura mínima da barra (px)
  opacidade?: number;
  escala?: number;
}> = ({ x, y, largura, altura, n = 32, amp, cor = COR.branco, minimo = 14, opacidade = 1, escala = 1 }) => {
  const passo = largura / n;
  const w = passo * 0.62;
  return (
    <svg
      width={largura}
      height={altura}
      style={{ position: 'absolute', left: x - largura / 2, top: y - altura / 2, opacity: opacidade, transform: `scale(${escala})`, overflow: 'visible' }}
    >
      {Array.from({ length: n }).map((_, i) => {
        const h = Math.max(minimo, Math.min(1, amp(i)) * altura);
        return <rect key={i} x={i * passo + (passo - w) / 2} y={(altura - h) / 2} width={w} height={h} rx={w / 2} fill={cor} />;
      })}
    </svg>
  );
};

/** Amplitude "falada" determinística para ondas decorativas (sem áudio). */
export const ampFalada = (i: number, t = 0) => {
  const a = Math.abs(Math.sin(i * 1.7 + t * 0.21) * 0.6 + Math.sin(i * 0.53 + t * 0.13) * 0.4);
  return 0.18 + a * 0.82;
};
