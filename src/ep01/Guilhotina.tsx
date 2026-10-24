import React from 'react';
import { Maquina } from '../components';
import { COR, CONTORNO } from '../theme';

/** Guilhotina do Tokenizador: cabeça vermelha com lâmina que desce até a caixa. */
export const Guilhotina: React.FC<{ x: number; top: number; golpe: number; dy?: number }> = ({ x, top, golpe, dy = 0 }) => {
  const W = 300;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, transform: `translateY(${dy}px)` }}>
      {/* lâmina */}
      <div
        style={{
          position: 'absolute',
          left: x - 22,
          top: top + 120 + golpe * 190,
          width: 44,
          height: 110,
          background: COR.branco,
          border: `${CONTORNO}px solid ${COR.preto}`,
          borderRadius: '8px 8px 4px 4px',
          borderBottomWidth: 18,
        }}
      />
      <Maquina x={x - W / 2} y={top} w={W} h={140} nome="GUILHOTINA" termo="tokenizador">
        <svg width="90" height="70" viewBox="0 0 90 70">
          <path d="M8 10 H82 L60 60 H30 Z" fill="none" stroke={COR.preto} strokeWidth="10" strokeLinejoin="round" />
        </svg>
      </Maquina>
    </div>
  );
};
