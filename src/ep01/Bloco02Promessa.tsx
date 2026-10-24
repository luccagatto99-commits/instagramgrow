import React from 'react';
import { useCurrentFrame } from 'remotion';
import { FundoGalpao, Quadro } from '../components';
import { CENTRO_X, ESTEIRA_Y } from '../theme';
import { naEsteira } from '../anim';
import { palavra } from './tempo';
import { ABERTO, FECHADO, MorangoTrancado, type CenaEp } from './comum';

const B = 1;

/** Promessa: o que você vai entender neste turno. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tMorango = palavra(B, 'morango');
  return (
    <>
      {frame >= tMorango - 6 ? <MorangoTrancado x={naEsteira(frame, tMorango - 6, CENTRO_X)} base={ESTEIRA_Y} escala={0.75} /> : null}
      <Quadro
        titulo="HOJE NA FÁBRICA"
        inicio={2}
        top={395}
        itens={[
          { texto: 'como a IA lê o texto', em: palavra(B, 'como') },
          { texto: 'o que é um token', em: palavra(B, 'token.') },
          { texto: 'o erro do morango', em: palavra(B, 'morango') },
        ]}
        destaque={{ indice: 2, em: palavra(B, 'acompanhe') }}
      />
    </>
  );
};

export const Promessa: CenaEp = {
  Conteudo,
  Fundo: () => <FundoGalpao />,
  planos: () => [
    ABERTO(0),
    FECHADO(palavra(B, 'token.') - 2, CENTRO_X, 650, 1.1),
    FECHADO(palavra(B, 'morango') - 2, CENTRO_X, 760, 1.1),
    ABERTO(palavra(B, 'acompanhe')),
  ],
};
