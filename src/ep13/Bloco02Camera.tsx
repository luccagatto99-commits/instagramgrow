import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Som, type CenaEp } from '../components';
import { CENTRO_X } from '../theme';
import { entra, lin, naEsteira, suave } from '../anim';
import { palavra } from './tempo';
import { CameraGrande, CarroFrente, Deteccao, Lua, PlacaMercosul, PLACA, Sol } from './comum';
import { COR } from '../theme';

const B = 1;

/**
 * A câmera: chega pela esteira; em "infravermelha" o anel de LEDs acende. "De dia e de noite": sol à
 * esquerda, lua à direita. "Na foto": flash e, no lugar da câmera, o carro de frente (a foto). A IA
 * acha a placa (moldura azul) e a placa grande aparece em cima, lida letra por letra.
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tInfra = palavra(B, 'infravermelha');
  const tDia = palavra(B, 'dia');
  const tNoite = palavra(B, 'noite');
  const tNa = palavra(B, 'na');
  const tAcha = palavra(B, 'acha');
  const tLetra = palavra(B, 'letra');

  const xCam = naEsteira(frame, -6, CENTRO_X);
  const luz = frame >= tInfra ? 0.6 + 0.4 * Math.sin((frame - tInfra) / 4) : 0;
  const someCam = suave(frame, tNa - 2, 8);
  const pSol = frame >= tDia - 4 ? entra(frame, tDia - 4, 170) : 0;
  const pLua = frame >= tNoite - 4 ? entra(frame, tNoite - 4, 170) : 0;
  const somemIcones = suave(frame, tNa - 6, 8);
  const flash = lin(frame, tNa - 2, tNa + 1) * (1 - lin(frame, tNa + 3, tNa + 14));
  const pCarro = frame >= tNa + 2 ? entra(frame, tNa + 2, 150) : 0;
  const pPlacaAchada = frame >= tAcha - 2 ? entra(frame, tAcha - 2, 170) : 0;
  const pPlaca = frame >= tLetra - 10 ? entra(frame, tLetra - 10, 160) : 0;
  const lidas = lin(frame, tLetra - 2, tLetra + 7 * 6, 0, PLACA.length);
  return (
    <>
      <Som nome="chiado" em={tInfra} volume={0.15} />
      <Som nome="tique" em={tNa - 2} volume={0.5} />
      <Som nome="tique" em={tAcha - 2} volume={0.35} />
      <Som nome="ding" em={tLetra + 7 * 6} volume={0.35} />

      <Sol x={255} y={640} escala={pSol * (1 - somemIcones)} />
      <Lua x={825} y={640} escala={pLua * (1 - somemIcones)} />
      <CameraGrande x={xCam} y={740} luz={luz} escala={1 - 0.4 * someCam} opacidade={1 - someCam} />

      <CarroFrente x={CENTRO_X} base={1000} escala={pCarro} />
      <Deteccao cx={CENTRO_X} cy={909} w={210} h={74} texto="PLACA" p={pPlacaAchada * (1 - suave(frame, tLetra + 7 * 6 + 10, 8))} cor={COR.azul} />
      <PlacaMercosul x={CENTRO_X} top={470} lidas={lidas} escala={pPlaca * 0.85} />

      {flash > 0.01 ? <div style={{ position: 'absolute', inset: 0, background: COR.branco, opacity: flash * 0.6 }} /> : null}
    </>
  );
};

export const Camera: CenaEp = {
  Conteudo,
  Fundo: () => null,
  planos: () => [ABERTO(0)],
};
