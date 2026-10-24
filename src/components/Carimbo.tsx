import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { COR, FONTE } from '../theme';

/**
 * Carimbo vermelho girado que "bate" no frame `em`: desce grande e transparente,
 * crava com um tranco e fica. Posicionado pelo centro.
 */
export const Carimbo: React.FC<{
  x: number;
  y: number;
  texto: string;
  em: number;
  tamanho?: number;
  rot?: number;
}> = ({ x, y, texto, em, tamanho = 40, rot = -12 }) => {
  const frame = useCurrentFrame();
  if (frame < em - 4) return null;
  const desce = interpolate(frame, [em - 4, em], [1.8, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const baque = interpolate(frame, [em, em + 3, em + 10], [1, 0.92, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${desce * baque})`,
        opacity: interpolate(frame, [em - 4, em], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        border: `${Math.round(tamanho * 0.18)}px solid ${COR.vermelho}`,
        borderRadius: 12,
        padding: `${Math.round(tamanho * 0.15)}px ${Math.round(tamanho * 0.4)}px`,
        fontFamily: FONTE.titulo,
        fontSize: tamanho,
        lineHeight: 1,
        color: COR.vermelho,
        whiteSpace: 'nowrap',
        background: 'rgba(255,255,255,0.0)',
        pointerEvents: 'none',
      }}
    >
      {texto}
    </div>
  );
};
