import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { ABERTO, CarroEsportivo, Som, Velocimetro, Visto, type CenaEp } from '../components';
import { CENTRO_X } from '../theme';
import { entra, lin } from '../anim';
import { palavra } from './tempo';
import { CARRO_ESC, CARRO_Y, Cota, RADAR_A, RADAR_B, Radar, rodas } from './comum';
import { FeixeRadar, flashEm } from './Bloco01Gancho';

const B = 4;

/**
 * Frear não adianta: o carro vem rápido, freia só na frente do radar A (o velocímetro cai), acelera de
 * novo e passa pelo B. "Ela mede o trecho inteiro": a cota liga os dois radares e o velocímetro
 * mostra a média (120), com ✗.
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tFrear = palavra(B, 'frear');
  const tAdianta = palavra(B, 'adianta');
  const tTrecho = palavra(B, 'trecho');
  const tInteiro = palavra(B, 'inteiro');

  const KF = [0, tFrear, tFrear + 22, tFrear + 40, tAdianta + 16, tAdianta + 28, tAdianta + 60];
  const XS = [-260, 120, RADAR_A - 40, RADAR_A + 70, RADAR_A + 330, RADAR_B + 60, 1400];
  const xDe = (f: number) => interpolate(f, KF, XS, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const x = xDe(frame);
  // velocidade mostrada: deslocamento por frame, suavizado (média de 8 frames)
  const v = (xDe(frame + 4) - xDe(frame - 4)) / 8;
  const media = frame >= tInteiro;
  const fA = flashEm(frame, tFrear + 26);
  const fB = flashEm(frame, tAdianta + 24);
  const pV = entra(frame, 2, 160);
  const pCota = frame >= tTrecho - 4 ? lin(frame, tTrecho - 4, tTrecho + 10) : 0;
  const xis = frame >= tInteiro + 6 ? entra(frame, tInteiro + 6, 180) : 0;
  return (
    <>
      <Som nome="tique" em={tFrear + 26} volume={0.45} />
      <Som nome="tique" em={tAdianta + 24} volume={0.45} />
      <Som nome="carimbo" em={tInteiro + 6} volume={0.3} />

      <Radar x={RADAR_A} flash={fA} escala={entra(frame, -8, 150)} />
      <Radar x={RADAR_B} flash={fB} escala={entra(frame, -4, 150)} />
      <Velocimetro x={CENTRO_X} y={500} r={70} max={140} valor={media ? 120 : frame > KF[5] ? 140 : Math.min(140, Math.max(0, v * 10))} rodape={media ? 'MÉDIA' : undefined} escala={pV} />
      <Visto x={CENTRO_X + 150} y={480} r={34} ok={false} escala={xis} />
      <Cota x1={RADAR_A} x2={RADAR_B} y={790} texto="10 km" p={pCota} />

      <CarroEsportivo x={x} y={CARRO_Y} escala={CARRO_ESC} rodas={rodas(x)} />
      <FeixeRadar radar={RADAR_A} carro={x} f={fA} />
      <FeixeRadar radar={RADAR_B} carro={x} f={fB} />
    </>
  );
};

export const Frear: CenaEp = {
  Conteudo,
  Fundo: () => null,
  planos: () => [ABERTO(0)],
};
