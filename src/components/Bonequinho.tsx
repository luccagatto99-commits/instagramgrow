import React from 'react';
import { COR } from '../theme';

/**
 * Personagem de traço, sem rosto. Posicionado pelo centro x e pela base (pés).
 * `passo` anima as pernas (use frame * velocidade); `triste` abaixa a cabeça.
 */
export const Bonequinho: React.FC<{
  x: number;
  base: number;
  escala?: number;
  passo?: number;
  maleta?: boolean;
  triste?: number; // 0 → 1
  opacidade?: number;
  virado?: boolean; // olhando para a esquerda
}> = ({ x, base, escala = 1, passo = 0, maleta, triste = 0, opacidade = 1, virado }) => {
  const balanco = Math.abs(Math.sin(passo)) * 6;
  return (
    <svg
      width={140}
      height={230}
      viewBox="0 0 140 230"
      style={{
        position: 'absolute',
        left: x - 70,
        top: base - 230 - balanco,
        transform: `scale(${virado ? -escala : escala}, ${escala})`,
        transformOrigin: '50% 100%',
        opacity: opacidade,
        overflow: 'visible',
      }}
      fill={COR.branco}
      stroke={COR.preto}
      strokeWidth={9}
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {/* pernas */}
      <line x1={58} y1={150} x2={52 + Math.sin(passo) * 14} y2={224} />
      <line x1={82} y1={150} x2={88 - Math.sin(passo) * 14} y2={224} />
      {/* corpo */}
      <path d="M38 156 L46 84 Q70 70 94 84 L102 156 Z" />
      {/* braço com maleta */}
      <line x1={96} y1={92} x2={112} y2={140} />
      {maleta ? (
        <>
          <rect x={98} y={140} width={40} height={30} rx={6} />
          <path d="M110 140 L110 132 L126 132 L126 140" fill="none" />
        </>
      ) : null}
      <line x1={44} y1={92} x2={30} y2={140} />
      {/* cabeça */}
      <g transform={`rotate(${triste * 22} 70 70) translate(0 ${triste * 6})`}>
        <circle cx={70} cy={40} r={28} />
      </g>
    </svg>
  );
};
