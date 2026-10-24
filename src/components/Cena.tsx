import React from 'react';
import { AbsoluteFill, interpolate, Easing, useCurrentFrame } from 'remotion';
import { Esteira } from './Esteira';
import { saidaDireita } from '../anim';

const VEL = 4; // px por frame dos roletes em ritmo normal

/**
 * Cena padrão: esteira na base e, nos últimos `transicao` frames, a esteira acelera
 * e leva todo o conteúdo para fora pela direita.
 * `inicioAbs` mantém os roletes contínuos entre cenas.
 */
export const Cena: React.FC<{
  dur: number;
  inicioAbs: number;
  transicao?: number; // 0 = sem saída (última cena)
  esteira?: boolean;
  paraEm?: number; // roletes param neste frame (fechamento parado)
  sentido?: 1 | -1; // -1: roletes andam para a esquerda
  children: React.ReactNode;
}> = ({ dur, inicioAbs, transicao = 8, esteira = true, paraEm, sentido = 1, children }) => {
  const frameReal = useCurrentFrame();
  const frame = paraEm !== undefined ? Math.min(frameReal, paraEm) : frameReal;
  const sai = transicao ? saidaDireita(frame, dur, transicao) : 0;
  const acelera = transicao
    ? interpolate(frame, [dur - transicao, dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.quad) })
    : 0;
  const deslocamento = sentido * (inicioAbs + frame) * VEL + acelera * acelera * 900;
  return (
    <AbsoluteFill>
      {esteira ? <Esteira deslocamento={deslocamento} /> : null}
      <AbsoluteFill style={{ transform: `translateX(${sai}px)` }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
