import React from 'react';
import { useCurrentFrame } from 'remotion';
import { COR } from '../theme';

/** Barra de progresso do turno (retenção): quem vê que falta pouco, fica até o fim. */
export const Progresso: React.FC<{ total: number; top?: number; direita?: number }> = ({ total, top = 262, direita = 60 }) => {
  const frame = useCurrentFrame();
  const p = Math.min(1, frame / total);
  return (
    <div style={{ position: 'absolute', left: 60, right: direita, top, height: 18, border: `5px solid ${COR.preto}`, borderRadius: 12, background: COR.branco, overflow: 'hidden' }}>
      <div style={{ width: `${p * 100}%`, height: '100%', background: `var(--placa, ${COR.preto})` }} />
    </div>
  );
};
