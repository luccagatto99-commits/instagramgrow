import React from 'react';
import { interpolate, Easing, useCurrentFrame } from 'remotion';
import { ABERTO, CarroEsportivo, Som, type CenaEp } from '../components';
import { entra } from '../anim';
import { palavra } from './tempo';
import { CARRO_ESC, CARRO_Y, PLACA, RADAR_A, RADAR_B, Radar, Registro, rodas } from './comum';
import { FeixeRadar, flashEm } from './Bloco01Gancho';

const B = 2;
export const HORA_A = '08:00:00';
export const HORA_B = '08:05:00';
export const REG_TOP = 450;

/**
 * Relógio: o carro passa pelo radar A (flash); o cartão mostra a placa e depois a hora exata.
 * "Quilômetros depois": o radar B sobe lá na frente; o carro chega, flash, e o cartão B aparece com a
 * mesma placa e outra hora. Os dois cartões ficam para a conta do próximo bloco.
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tAnota = palavra(B, 'anota');
  const tHora = palavra(B, 'hora');
  const tQuilo = palavra(B, 'quilometros');
  const tMesma = palavra(B, 'mesma');

  const x = interpolate(
    frame,
    [0, tAnota, tQuilo, tMesma - 4, tMesma + 40],
    [-200, RADAR_A - 40, RADAR_A + 160, RADAR_B - 40, 1400],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad) },
  );
  const fA = flashEm(frame, tAnota - 4);
  const fB = flashEm(frame, tMesma - 8);
  const pB = frame >= tQuilo - 4 ? entra(frame, tQuilo - 4, 150) : 0;
  const cA = frame >= tAnota + 8 ? entra(frame, tAnota + 8, 170) : 0;
  const cB = frame >= tMesma ? entra(frame, tMesma, 170) : 0;
  return (
    <>
      <Som nome="tique" em={tAnota - 4} volume={0.45} />
      <Som nome="tique" em={tHora} volume={0.3} />
      <Som nome="tique" em={tMesma - 8} volume={0.45} />

      <Radar x={RADAR_A} flash={fA} escala={entra(frame, -10, 150)} />
      <Radar x={RADAR_B} flash={fB} escala={pB} />
      <Registro x={RADAR_A} top={REG_TOP} linhas={frame >= tHora ? [PLACA, HORA_A] : [PLACA]} escala={cA} />
      <Registro x={RADAR_B} top={REG_TOP} linhas={[PLACA, HORA_B]} escala={cB} />

      <CarroEsportivo x={x} y={CARRO_Y} escala={CARRO_ESC} rodas={rodas(x)} />
      <FeixeRadar radar={RADAR_A} carro={x} f={fA} />
      <FeixeRadar radar={RADAR_B} carro={x} f={fB} />
    </>
  );
};

export const Relogio: CenaEp = {
  Conteudo,
  Fundo: () => null,
  planos: () => [ABERTO(0)],
  transicao: 0,
};
