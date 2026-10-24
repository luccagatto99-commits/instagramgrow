import React from 'react';
import { COR } from '../theme';

export type Ponto2D = [number, number];

/**
 * Seta preta grossa de `de` até `para` (coordenadas do elemento pai).
 * `p` 0 → 1 desenha a seta; `recuo` para a ponta antes do alvo (para não cobrir o ponto).
 */
export const SetaVetor: React.FC<{
  de: Ponto2D;
  para: Ponto2D;
  p?: number;
  espessura?: number;
  recuo?: number;
  tracejada?: boolean;
  semPonta?: boolean;
  opacidade?: number;
}> = ({ de, para, p = 1, espessura = 12, recuo = 26, tracejada, semPonta, opacidade = 1 }) => {
  if (p <= 0) return null;
  const dx = para[0] - de[0];
  const dy = para[1] - de[1];
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const ini = Math.min(recuo, len / 3);
  const total = len - ini - (semPonta ? ini : recuo);
  const fim = ini + total * Math.min(1, p);
  const x0 = de[0] + ux * ini;
  const y0 = de[1] + uy * ini;
  const x1 = de[0] + ux * fim;
  const y1 = de[1] + uy * fim;
  const cab = espessura * 2.6; // tamanho da ponta
  const ang = Math.atan2(uy, ux);
  const ponta = [
    [x1 + Math.cos(ang) * cab * 0.35, y1 + Math.sin(ang) * cab * 0.35],
    [x1 + Math.cos(ang + 2.5) * cab, y1 + Math.sin(ang + 2.5) * cab],
    [x1 + Math.cos(ang - 2.5) * cab, y1 + Math.sin(ang - 2.5) * cab],
  ];
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: opacidade }} width={1} height={1}>
      <line
        x1={x0}
        y1={y0}
        x2={x1}
        y2={y1}
        stroke={COR.preto}
        strokeWidth={espessura}
        strokeLinecap="round"
        strokeDasharray={tracejada ? `${espessura * 1.6} ${espessura * 1.8}` : undefined}
      />
      {semPonta || p < 0.15 ? null : <polygon points={ponta.map((q) => q.join(',')).join(' ')} fill={COR.preto} stroke={COR.preto} strokeWidth={4} strokeLinejoin="round" />}
    </svg>
  );
};
