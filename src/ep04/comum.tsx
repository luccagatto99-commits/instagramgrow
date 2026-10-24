import React from 'react';
import { useCurrentFrame } from 'remotion';
import { lin } from '../anim';
import { Carimbo, FichaDocumento } from '../components';
import { CENTRO_X } from '../theme';
import { PROCESSOS } from './dados';

export const COLS = [CENTRO_X - 260, CENTRO_X, CENTRO_X + 260];
export const BASES = [600, 760];
export const GRADE = PROCESSOS.map((p, i) => ({ ...p, x: COLS[i % 3], base: BASES[Math.floor(i / 3)] }));

/**
 * Os seis processos inventados, em grade 3 × 2. `pos(i)` permite animar cada um
 * (saída da tela do chat, retorno); `carimbo` é o frame do primeiro "NÃO EXISTE".
 */
export const GradeProcessos: React.FC<{
  pos?: (i: number) => { x: number; base: number; escala?: number; opacidade?: number };
  carimbo?: number;
  visiveis?: number; // quantos já apareceram
}> = ({ pos, carimbo, visiveis = 6 }) => {
  const frame = useCurrentFrame();
  return (
  <>
    {GRADE.slice(0, visiveis).map((g, i) => {
      const p = pos ? pos(i) : { x: g.x, base: g.base };
      return (
        <FichaDocumento key={i} x={p.x} base={p.base} nome={g.nome} numero={g.numero} largura={240} tamanho={24} escala={p.escala ?? 1} opacidade={p.opacidade ?? 1} anulada={carimbo === undefined ? 0 : lin(frame, carimbo + i * 4 - 2, carimbo + i * 4 + 2)}>
          {carimbo !== undefined ? <Carimbo x={120} y={58} texto="NÃO EXISTE" em={carimbo + i * 4} tamanho={22} rot={-14} /> : null}
        </FichaDocumento>
      );
    })}
  </>
  );
};
