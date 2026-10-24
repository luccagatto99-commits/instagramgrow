import React from 'react';
import { ABERTO, FECHADO, FundoGalpao, Quadro, type CenaEp } from '../components';
import { CENTRO_X } from '../theme';
import { palavra } from './tempo';

const B = 9;

/** Resumo do turno: os mesmos 3 pontos da promessa, agora respondidos. */
const Conteudo: React.FC = () => (
  <Quadro
    titulo="RESUMO DO TURNO"
    inicio={2}
    top={450}
    feito
    itens={[
      { texto: 'escreve o provável', em: palavra(B, 'verdadeiro.') },
      { texto: 'chuta por avaliação', em: palavra(B, 'assim.') },
      { texto: 'certeza ≠ acerto', em: palavra(B, 'acerto.') },
    ]}
    destaque={{ indice: 2, em: palavra(B, 'acerto.') + 8 }}
  />
);

export const Resumo: CenaEp = {
  Conteudo,
  Fundo: () => <FundoGalpao />,
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'assim.') - 2, CENTRO_X, 680, 1.08), FECHADO(palavra(B, 'acerto.') - 2, CENTRO_X, 700, 1.14)],
};
