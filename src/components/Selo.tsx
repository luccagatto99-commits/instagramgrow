import React from 'react';
import { useCurrentFrame } from 'remotion';
import { COR, FONTE, SEGURA } from '../theme';
import { entra } from '../anim';

/** Pílula preta pequena, canto superior direito (dentro da zona segura). */
export const Selo: React.FC<{ tipo: 'REAL' | 'ILUSTRATIVO'; detalhe?: string; inicio?: number; top?: number }> = ({
  tipo, detalhe, inicio = 0, top = 420,
}) => {
  const frame = useCurrentFrame();
  const p = entra(frame, inicio, 220);
  return (
    <div
      style={{
        position: 'absolute',
        right: SEGURA.direita + 10,
        top,
        transform: `scale(${p})`,
        transformOrigin: '100% 50%',
        background: COR.preto,
        color: COR.branco,
        borderRadius: 999,
        padding: '10px 24px 8px',
        fontFamily: FONTE.rotulo,
        fontWeight: 700,
        fontSize: 30,
        letterSpacing: 2,
        whiteSpace: 'nowrap',
      }}
    >
      {tipo}
      {detalhe ? <span style={{ opacity: 0.8 }}> · {detalhe}</span> : null}
    </div>
  );
};
