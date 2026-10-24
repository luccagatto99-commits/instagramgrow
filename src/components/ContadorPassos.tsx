import React from 'react';
import { COR, FONTE } from '../theme';
import { useVisivelNoHud } from './Camada';

/**
 * Contador do hud: rótulo em caixa alta + número em azul (JetBrains Mono), ex. "passo 3 / 5".
 * Fica na faixa livre entre a placa de área e a cena. Posicionado pelo centro.
 */
export const ContadorPassos: React.FC<{ rotulo: string; valor: React.ReactNode; total?: React.ReactNode; x?: number; y?: number; escala?: number; cor?: string }> = ({
  rotulo, valor, total, x = 540, y = 500, escala = 1, cor = COR.azul,
}) => {
  const vis = useVisivelNoHud();
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${escala})`,
        display: 'flex',
        alignItems: 'baseline',
        gap: 18,
        whiteSpace: 'nowrap',
        textShadow: 'var(--halo, none)',
        ...vis,
      }}
    >
      <span style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 38, letterSpacing: 2, color: `var(--tinta, ${COR.preto})` }}>{rotulo}</span>
      <span style={{ fontFamily: FONTE.numero, fontWeight: 800, fontSize: 56, color: cor }}>
        {valor}
        {total !== undefined ? <span style={{ fontSize: 40, opacity: 0.7 }}> / {total}</span> : null}
      </span>
    </div>
  );
};
