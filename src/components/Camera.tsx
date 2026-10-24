import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

/** Um plano: a partir do frame `de`, a câmera enquadra `foco` com `zoom`. */
export type Plano = { de: number; zoom: number; foco: [number, number] };

/**
 * Câmera com cortes secos entre planos. Dentro de cada plano a câmera
 * aproxima devagar (+4%), e no corte há um pequeno "soco" de escala.
 */
export const Camera: React.FC<{ planos: Plano[]; children: React.ReactNode; aproxima?: number }> = ({ planos, children, aproxima = 0.04 }) => {
  const frame = useCurrentFrame();
  const idx = planos.reduce((acc, p, i) => (frame >= p.de ? i : acc), 0);
  const p = planos[idx];
  const fim = planos[idx + 1]?.de ?? p.de + 90;
  const lento = interpolate(frame, [p.de, fim], [0, aproxima], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const soco = idx > 0 ? interpolate(frame, [p.de, p.de + 5], [0.035, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  // limites: nada do mundo sobe para a área da placa/títulos nem desce para a legenda
  const z = Math.min(p.zoom, 1.2) * (1 + lento + soco);
  // nunca mostra além das bordas do cenário (1080 px de largura)
  const fx = Math.min(Math.max(p.foco[0], 540 / z), 1080 - 540 / z);
  // y 1020 (esteira + rodapé) fica acima de 1060, onde começa a legenda
  const fy = Math.min(Math.max(p.foco[1], 1020 - 300 / z), 770);
  // leva o foco para o centro do quadro
  const tx = 540 - fx * z;
  const ty = 760 - fy * z;
  return (
    <AbsoluteFill style={{ transform: `translate(${tx}px, ${ty}px) scale(${z})`, transformOrigin: '0 0' }}>{children}</AbsoluteFill>
  );
};
