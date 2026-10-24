import React from 'react';
import { COR } from '../theme';

/**
 * Lápis de contorno (inclinado, ponta para baixo à esquerda). `risco` 0 → 1 passa um traço
 * vermelho por cima (o lápis "não serve"). Posicionado pelo centro.
 */
export const Lapis: React.FC<{ x: number; y: number; tamanho?: number; risco?: number; escala?: number; rot?: number }> = ({
  x, y, tamanho = 260, risco = 0, escala = 1, rot = 0,
}) => (
  <svg
    width={tamanho}
    height={tamanho}
    viewBox="0 0 200 200"
    style={{ position: 'absolute', left: x - tamanho / 2, top: y - tamanho / 2, overflow: 'visible', transform: `rotate(${rot}deg) scale(${escala})` }}
  >
    <g transform="rotate(-45 100 100)" stroke={COR.preto} strokeWidth={8} strokeLinejoin="round">
      <rect x={52} y={78} width={110} height={44} fill={COR.branco} />
      <line x1={52} y1={93} x2={162} y2={93} strokeWidth={4} />
      <line x1={52} y1={107} x2={162} y2={107} strokeWidth={4} />
      <rect x={162} y={78} width={26} height={44} rx={8} fill={COR.branco} />
      <path d="M52 78 L14 100 L52 122 Z" fill={COR.branco} />
      <path d="M27 92.5 L14 100 L27 107.5 Z" fill={COR.preto} />
    </g>
    {risco > 0 ? (
      <line x1={10} y1={190} x2={10 + 180 * Math.min(1, risco)} y2={190 - 180 * Math.min(1, risco)} stroke={COR.vermelho} strokeWidth={22} strokeLinecap="round" />
    ) : null}
  </svg>
);
