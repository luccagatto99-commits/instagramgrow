import React from 'react';
import { COR, W, ESTEIRA_Y } from '../theme';

/** Barra preta arredondada com roletes amarelos. `deslocamento` em px move os roletes. */
export const Esteira: React.FC<{ deslocamento: number; y?: number; largura?: number; x?: number; altura?: number }> = ({
  deslocamento, y = ESTEIRA_Y, largura = W + 80, x = -40, altura = 46,
}) => {
  const passo = 70;
  const off = ((deslocamento % passo) + passo) % passo;
  const n = Math.ceil(largura / passo) + 2;
  const r = altura * 0.27;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: largura, height: altura, background: `var(--esteira, ${COR.preto})`, borderRadius: altura / 2, overflow: 'hidden' }}>
      {Array.from({ length: n }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: altura / 2 - r,
            left: i * passo - passo + off,
            width: r * 2,
            height: r * 2,
            borderRadius: r,
            background: `var(--rolete, ${COR.amarelo})`,
          }}
        />
      ))}
    </div>
  );
};
