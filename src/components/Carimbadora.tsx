import React from 'react';
import { Maquina } from './Maquina';
import { COR, CONTORNO } from '../theme';

/** Carimbadora: prensa vermelha com um carimbo que desce até a caixa. */
export const Carimbadora: React.FC<{ x: number; top: number; golpe: number; curso?: number; dy?: number }> = ({
  x, top, golpe, curso = 170, dy = 0,
}) => {
  const W = 320;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, transform: `translateY(${dy}px)` }}>
      {/* haste + carimbo */}
      <div style={{ position: 'absolute', left: x - 14, top: top + 120, width: 28, height: 24 + golpe * curso, background: COR.preto }} />
      <div
        style={{
          position: 'absolute',
          left: x - 90,
          top: top + 140 + golpe * curso,
          width: 180,
          height: 56,
          background: COR.branco,
          border: `${CONTORNO}px solid ${COR.preto}`,
          borderBottom: `22px solid ${COR.azul}`,
          borderRadius: 14,
        }}
      />
      <Maquina x={x - W / 2} y={top} w={W} h={140} nome="CARIMBADORA" termo="ID do token">
        <svg width="80" height="70" viewBox="0 0 80 70">
          <path d="M40 8 V40 M18 40 H62 V58 H18 Z" fill="none" stroke={COR.preto} strokeWidth="10" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      </Maquina>
    </div>
  );
};
