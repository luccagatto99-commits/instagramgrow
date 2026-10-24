import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, CaixaToken, FECHADO, FundoGalpao, Quadro, type CenaEp } from '../components';
import { CENTRO_X, ESTEIRA_Y } from '../theme';
import { naEsteira } from '../anim';
import { palavra } from './tempo';
import { T_LETRA } from './Bloco01Gancho';
import { fileira } from '../components';

const X_LETRAS = fileira(['G', 'P', 'T'], CENTRO_X, T_LETRA, 70);

const B = 1;

/** Promessa: o que você vai entender neste turno. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {['G', 'P', 'T'].map((l, i) => (
        <CaixaToken key={l} texto={l} tamanho={T_LETRA} x={CENTRO_X + (naEsteira(frame, i * 4, X_LETRAS[i]) - CENTRO_X) * 0.6} base={ESTEIRA_Y} escala={0.55} />
      ))}
      <Quadro
        titulo="HOJE NA FÁBRICA"
        inicio={2}
        top={395}
        itens={[
          { texto: 'o que é cada letra', em: palavra(B, 'letra') },
          { texto: 'a invenção de 2017', em: palavra(B, '2017') },
          { texto: 'um cuidado prático', em: palavra(B, 'cuidado') },
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
    FECHADO(palavra(B, '2017') - 2, CENTRO_X, 650, 1.1),
    FECHADO(palavra(B, 'cuidado') - 2, CENTRO_X, 760, 1.1),
    ABERTO(palavra(B, 'acompanhe')),
  ],
};
