import React from 'react';
import { COR } from '../theme';
import { hash01 } from './QuadroRuido';

// bloco de pedra num viewBox de 300 × 340 (a estátua por baixo usa o mesmo viewBox)
const VB = { w: 300, h: 340 };
const COLS = 8;
const LINHAS = 9;
const PEDESTAL = 300; // y do topo do pedestal: o bloco vai de 0 até aqui

// vértices da grade com um leve tremor: os pedaços parecem lascas de pedra
const vertice = (c: number, l: number): [number, number] => {
  const borda = c === 0 || c === COLS || l === 0 || l === LINHAS;
  const j = borda ? 0 : 1;
  return [
    (c * VB.w) / COLS + j * (hash01(c, l, 3) - 0.5) * 18,
    (l * PEDESTAL) / LINHAS + j * (hash01(c, l, 5) - 0.5) * 16,
  ];
};

/**
 * Bloco de pedra de contorno que perde pedaços até sobrar a estátua (children, no viewBox 300 × 340).
 * `p` 0 → 1: os pedaços longe do centro caem primeiro; em 1 só resta a estátua sobre o pedestal.
 * Posicionado pelo centro x e pela base.
 */
export const Escultura: React.FC<{ x: number; base: number; largura?: number; p: number; escala?: number; children?: React.ReactNode }> = ({
  x, base, largura = 300, p, escala = 1, children,
}) => {
  const altura = (largura * VB.h) / VB.w;
  const pedacos: React.ReactNode[] = [];
  for (let l = 0; l < LINHAS; l++) {
    for (let c = 0; c < COLS; c++) {
      // ordem de queda: borda primeiro, miolo por último, com um pouco de acaso
      const dx = Math.abs((c + 0.5) / COLS - 0.5) * 2;
      const dy = Math.abs((l + 0.5) / LINHAS - 0.55) * 2;
      const vez = 1 - Math.max(dx, dy) * 0.75 - hash01(c, l, 9) * 0.25; // 0 = cai primeiro
      const t = Math.min(1, Math.max(0, (p - vez * 0.8) / 0.2)); // 0 = no lugar, 1 = caiu
      if (t >= 1) continue;
      const pts = [vertice(c, l), vertice(c + 1, l), vertice(c + 1, l + 1), vertice(c, l + 1)];
      const cx = pts.reduce((a, q) => a + q[0], 0) / 4;
      const cy = pts.reduce((a, q) => a + q[1], 0) / 4;
      const lado = hash01(c, l, 13) < 0.5 ? -1 : 1;
      pedacos.push(
        <polygon
          key={`${c}-${l}`}
          points={pts.map((q) => q.join(',')).join(' ')}
          fill={COR.branco}
          stroke={COR.preto}
          strokeWidth={4}
          strokeLinejoin="round"
          opacity={1 - t * t}
          transform={`translate(${lado * t * 40} ${t * t * 260}) rotate(${lado * t * 50} ${cx} ${cy})`}
        />,
      );
    }
  }
  return (
    <svg
      width={largura}
      height={altura}
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      style={{ position: 'absolute', left: x - largura / 2, top: base - altura, overflow: 'visible', transform: `scale(${escala})`, transformOrigin: '50% 100%' }}
    >
      {children}
      {pedacos}
      {/* contorno do bloco enquanto ele ainda está inteiro o bastante */}
      <rect x={0} y={0} width={VB.w} height={PEDESTAL} rx={14} fill="none" stroke={COR.preto} strokeWidth={10} opacity={Math.max(0, 1 - p * 4)} />
      <rect x={30} y={PEDESTAL} width={VB.w - 60} height={VB.h - PEDESTAL} rx={8} fill={COR.branco} stroke={COR.preto} strokeWidth={10} />
    </svg>
  );
};
