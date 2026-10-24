import React from 'react';
import { COR, CONTORNO } from '../theme';

/** Cadeado de traço. `abertura` 0 = fechado, 1 = aberto (haste sobe e gira). */
export const Cadeado: React.FC<{ x: number; y: number; tamanho?: number; abertura?: number }> = ({
  x, y, tamanho = 90, abertura = 0,
}) => {
  const s = tamanho / 100;
  return (
    <svg
      width={tamanho}
      height={tamanho * 1.2}
      viewBox="-10 -30 120 150"
      style={{ position: 'absolute', left: x - tamanho / 2, top: y - tamanho * 0.6, overflow: 'visible' }}
    >
      <g transform={`translate(0 ${-18 * abertura}) rotate(${-28 * abertura} 78 46)`}>
        <path d="M22 50 V30 a28 28 0 0 1 56 0 V50" fill="none" stroke={COR.preto} strokeWidth={CONTORNO / s * 1.1} strokeLinecap="round" />
      </g>
      <rect x="5" y="46" width="90" height="70" rx="16" fill={COR.branco} stroke={COR.preto} strokeWidth={CONTORNO / s} />
      <circle cx="50" cy="76" r="9" fill={COR.preto} />
      <rect x="46" y="78" width="8" height="20" rx="3" fill={COR.preto} />
    </svg>
  );
};
