import React from 'react';
import { Img, staticFile, useCurrentFrame } from 'remotion';
import { ABERTO, Celular, FECHADO, FundoEscritorio, Som, useVisivelNoHud, type CenaEp } from '../components';
import { ESTEIRA_Y, CENTRO_X } from '../theme';
import { entra, lin, mola, naEsteira, pop, segue } from '../anim';
import { palavra } from './tempo';
import { TelaChamada } from './comum';

const B = 0;
export const VALOR = 95_000_000;
const LARG_MANCHETE = 720; // manchete.png: 984 × 789

/** Quando a manchete sai e o celular entra. */
export const saidaManchete = () => palavra(B, 'ligacao.', 0, true) + 8;

/** Manchete da notícia (hud): já está na tela no frame 0, se aproxima devagar e sai pela direita. */
const Manchete: React.FC = () => {
  const frame = useCurrentFrame();
  const vis = useVisivelNoHud();
  const sai = segue(frame, saidaManchete(), 14);
  if (sai >= 1200) return null;
  const esc = mola(frame, -4, 0.9, 1) + lin(frame, 0, saidaManchete(), 0, 0.04);
  return (
    <div
      style={{
        position: 'absolute',
        left: CENTRO_X - LARG_MANCHETE / 2,
        top: 420,
        width: LARG_MANCHETE,
        transform: `translateX(${sai}px) scale(${esc * pop(frame, palavra(B, '95'), 0.05)}) rotate(${-1.5 + lin(frame, 0, 20, 0, 1.5)}deg)`,
        ...vis,
      }}
    >
      <Img src={staticFile('ep08/manchete.png')} style={{ width: '100%', display: 'block' }} />
    </div>
  );
};

/** Gancho: manchete do golpe (banco, valor); depois atende o "advogado" e ele se desfaz em números. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tCel = saidaManchete() + 4;
  const tAdvogado = palavra(B, 'advogado');
  const tIA = palavra(B, 'ia.');
  const desfaz = lin(frame, tIA, tIA + 26);
  const segundos = Math.max(0, Math.floor((frame - tAdvogado) / 30));
  return (
    <>
      <Som nome="tique" em={palavra(B, '95')} volume={0.5} />
      <Som nome="tique" em={tCel + 6} />
      <Som nome="tique" em={tAdvogado} />
      <Som nome="tique" em={tIA} volume={0.6} />

      <Manchete />
      {frame >= tCel ? (
        <Celular x={naEsteira(frame, tCel, CENTRO_X)} base={ESTEIRA_Y} escala={0.8 * entra(frame, tCel, 200)}>
          {frame >= tAdvogado ? (
            <TelaChamada nome="ADVOGADO" estado={desfaz > 0.5 ? 'voz gerada' : `00:0${Math.min(9, segundos)}`} desfaz={desfaz} />
          ) : (
            <TelaChamada nome="CHAMADA" estado="atendida" vazio />
          )}
        </Celular>
      ) : null}
    </>
  );
};

export const Gancho: CenaEp = {
  Conteudo,
  Fundo: () => <FundoEscritorio />,
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'advogado'), CENTRO_X, 790, 1.15), ABERTO(palavra(B, 'mas'))],
};
