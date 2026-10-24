import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Carimbo, FECHADO, FundoSaida, QuadroRuido, Som, type CenaEp } from '../components';
import { ESTEIRA_Y, CENTRO_X } from '../theme';
import { entra, naEsteira } from '../anim';
import { palavra } from './tempo';
import { CenaPraia, PilhaFotos } from './comum';

const B = 6;
const BASE = ESTEIRA_Y - 10;
const LARG = 420;
const ETAPAS = 6;

/**
 * Frase final: uma pilha de fotos com tesoura ("copiar") chega e leva o carimbo NÃO COPIA;
 * em "parte do nada" ela segue pela esteira e o quadro volta a ser só pontos;
 * em "vai limpando" ele se limpa de novo, até a foto nova.
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tCopia = palavra(B, 'copia');
  const tParte = palavra(B, 'parte');
  const tLimpando = palavra(B, 'limpando');
  const tReal = palavra(B, 'real.', 0, true);

  const xPilha = naEsteira(frame, 0, CENTRO_X, tParte - 12);
  const pQuadro = frame >= tParte + 6 ? entra(frame, tParte + 6, 170) : 0;
  const dur = (tReal - tLimpando) / ETAPAS;
  const er = Math.max(0, (frame - tLimpando) / dur);
  const etapa = Math.floor(er) + Math.min(1, (er - Math.floor(er)) / 0.4);
  const nivel = 1 - Math.min(ETAPAS, etapa) / ETAPAS;
  return (
    <>
      <Som nome="tique" em={4} />
      <Som nome="carimbo" em={tCopia + 2} volume={0.5} />
      <Som nome="chiado" em={tParte} volume={0.35} />
      {Array.from({ length: ETAPAS }).map((_, k) => <Som key={k} nome="tique" em={Math.round(tLimpando + k * dur)} volume={0.3} />)}
      <Som nome="ding" em={tReal} volume={0.45} />

      {frame < tParte + 6 ? (
        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${xPilha - CENTRO_X}px)` }}>
          <PilhaFotos x={CENTRO_X} base={BASE} />
          <Carimbo x={CENTRO_X - 60} y={830} texto="NÃO COPIA" em={tCopia + 2} tamanho={52} />
        </div>
      ) : null}

      {pQuadro > 0 ? (
        <QuadroRuido x={CENTRO_X} base={BASE} largura={LARG} nivel={nivel} semente={5} escala={pQuadro}>
          <CenaPraia nova />
        </QuadroRuido>
      ) : null}
    </>
  );
};

export const Final: CenaEp = {
  Conteudo,
  Fundo: () => <FundoSaida />,
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'copia'), CENTRO_X, 830, 1.1), ABERTO(palavra(B, 'parte')), FECHADO(palavra(B, 'limpando'), CENTRO_X, 830, 1.1)],
};
