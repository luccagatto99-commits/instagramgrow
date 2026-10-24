import React from 'react';
import { COR } from '../theme';

/**
 * Selo redondo de conferência: ✓ verde (confirmado) ou ✗ vermelho (falso).
 * `vira` 0 → 1 gira o selo de ✓ para ✗ (meia-volta). Posicionado pelo centro.
 */
export const Visto: React.FC<{ x: number; y: number; r?: number; ok?: boolean; vira?: number; escala?: number }> = ({
  x, y, r = 44, ok = true, vira = 0, escala = 1,
}) => {
  const mostraOk = ok && vira < 0.5;
  const giro = Math.cos(Math.min(1, vira) * Math.PI); // 1 → -1
  const tam = r * 2 + 12;
  return (
    <svg
      width={tam}
      height={tam}
      viewBox={`${-tam / 2} ${-tam / 2} ${tam} ${tam}`}
      style={{ position: 'absolute', left: x - tam / 2, top: y - tam / 2, transform: `scale(${escala * Math.abs(giro) || 0.001}, ${escala})`, overflow: 'visible' }}
    >
      <circle r={r} fill={mostraOk ? COR.verde : COR.vermelho} stroke={COR.preto} strokeWidth={8} />
      {mostraOk ? (
        <path d={`M${-r * 0.45} ${r * 0.02} L${-r * 0.12} ${r * 0.34} L${r * 0.5} ${-r * 0.32}`} fill="none" stroke={COR.branco} strokeWidth={r * 0.24} strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d={`M${-r * 0.36} ${-r * 0.36} L${r * 0.36} ${r * 0.36} M${r * 0.36} ${-r * 0.36} L${-r * 0.36} ${r * 0.36}`} fill="none" stroke={COR.branco} strokeWidth={r * 0.24} strokeLinecap="round" />
      )}
    </svg>
  );
};
