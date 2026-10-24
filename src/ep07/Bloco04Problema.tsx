import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Bonequinho, CarroEsportivo, Cronometro, FECHADO, FundoPrensa, Som, Veredito, type CenaEp } from '../components';
import { ESTEIRA_Y, CENTRO_X } from '../theme';
import { entra, lin, mola, segue } from '../anim';
import { palavra } from './tempo';
import { CORTE_Y, ESC_CORTE } from './Bloco03ComoVoa';
import { PainelBotoes } from './comum';

const B = 3;
const AR_Y = 800;

/** O problema: no ar cada milissegundo conta; um humano não acerta 10 jatos ao mesmo tempo. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tFracao = palavra(B, 'fração');
  const tNenhum = palavra(B, 'nenhum');
  const tAcerta = palavra(B, 'acerta');
  const tTempo = palavra(B, 'tempo.');

  // o carro sobe da pista e fica parado no ar, torto, tremendo
  const esc = mola(frame, 0, ESC_CORTE, 1.2);
  const y = mola(frame, 0, CORTE_Y, AR_Y) + Math.sin(frame * 0.9) * 3;
  const rot = mola(frame, 0, 0, 12) + Math.sin(frame * 0.7) * 1.5;
  const sai = segue(frame, tNenhum - 10, 14);
  const ms = Math.max(0, frame - tFracao + 4) / 30;
  const pCrono = entra(frame, tFracao - 4, 160);

  // o humano aperta botões errados, em qualquer ordem
  const embola = frame >= tAcerta - 2;
  const acesos = Array.from({ length: 10 }, (_, i) => embola && Math.sin(frame * 0.9 + i * 2.7) > 0.35);

  return (
    <>
      <Som nome="tique" em={tFracao - 4} />
      <Som nome="tique" em={tNenhum - 4} />
      {[0, 5, 10, 15].map((k) => <Som key={k} nome="tique" em={tAcerta + k} volume={0.35} />)}
      <Som nome="carimbo" em={tTempo} volume={0.5} />

      {sai < 1200 ? (
        <>
          <Cronometro x={CENTRO_X + sai} top={606} segundos={ms} escala={pCrono} />
          <CarroEsportivo x={CENTRO_X + sai} y={y} escala={esc} rot={rot} frame={frame} />
        </>
      ) : null}

      {frame >= tNenhum - 8 ? (
        <>
          <Bonequinho x={230} base={ESTEIRA_Y} escala={entra(frame, tNenhum - 8, 150)} passo={embola ? frame * 1.4 : 0} />
          <PainelBotoes x={610} top={742} acesos={acesos} escala={entra(frame, tNenhum - 4, 150)} />
        </>
      ) : null}
      <Veredito x={230} y={648} marca="✗" escala={entra(frame, tTempo, 170)} tamanho={110} />
    </>
  );
};

export const Problema: CenaEp = {
  Conteudo,
  Fundo: () => { const f = useCurrentFrame(); return <FundoPrensa giro={f * 2} />; },
  planos: () => [FECHADO(0, 540, 800, 1.06), ABERTO(palavra(B, 'nenhum') - 8)],
};
