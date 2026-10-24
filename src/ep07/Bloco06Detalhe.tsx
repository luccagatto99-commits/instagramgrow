import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Destaque, FECHADO, FundoPrateleiras, PastaVazia, Som, type CenaEp } from '../components';
import { ESTEIRA_Y, CENTRO_X } from '../theme';
import { entra, lin, naEsteira, segue } from '../anim';
import { palavra } from './tempo';
import { Telinha } from './comum';

const B = 5;
const COLUNAS = [CENTRO_X - 216, CENTRO_X, CENTRO_X + 216];
const LINHAS = [690, 834];

/** O detalhe: a IA de rua aprendeu com milhões de vídeos; vídeos de carro dando mortal: zero. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tAprendeu = palavra(B, 'dirigir') + 2;
  const tMilhoes = palavra(B, 'milhões');
  const tMas = palavra(B, 'mas');
  const tNinguem = palavra(B, 'ninguém');
  const tMortal = palavra(B, 'mortal.');

  const sai = segue(frame, tMas - 6, 14);

  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => <Som key={i} nome="tique" em={tAprendeu - 6 + i * 4} volume={0.35} />)}
      <Som nome="tique" em={tNinguem - 2} />
      <Som nome="carimbo" em={tMortal} volume={0.45} />

      <Destaque de={tMilhoes - 2} ate={tMas - 6} top={470} tamanho={72}>
        milhões de vídeos
      </Destaque>
      {sai < 1200
        ? LINHAS.flatMap((top, l) =>
            COLUNAS.map((x, c) => {
              const i = l * 3 + c;
              return <Telinha key={i} x={x + sai} top={top} anda={frame * 5 + i * 70} escala={entra(frame, tAprendeu - 6 + i * 4, 170)} />;
            }),
          )
        : null}

      {frame >= tNinguem - 6 ? (
        <PastaVazia x={naEsteira(frame, tNinguem - 6, CENTRO_X)} base={ESTEIRA_Y} rotulo="VÍDEOS DE MORTAL" valor="0" treme={Math.sin(Math.PI * lin(frame, tMortal, tMortal + 12)) * Math.sin(frame * 1.5)} />
      ) : null}
    </>
  );
};

export const Detalhe: CenaEp = {
  Conteudo,
  Fundo: () => <FundoPrateleiras />,
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'motoristas.') - 4, 540, 820, 1.06), ABERTO(palavra(B, 'mas') - 6), FECHADO(palavra(B, 'mortal.') - 4, 540, 860, 1.08)],
};
