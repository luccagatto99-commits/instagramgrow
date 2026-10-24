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
      { texto: 'o T é o Transformer', em: palavra(B, 'pré-treinado.') },
      { texto: 'lê tudo com atenção', em: palavra(B, 'atenção') },
      { texto: 'pedido: começo e fim', em: palavra(B, 'final.') },
    ]}
    destaque={{ indice: 2, em: palavra(B, 'final.') + 8 }}
  />
);

export const Resumo: CenaEp = {
  Conteudo,
  Fundo: () => <FundoGalpao />,
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'atenção') - 2, CENTRO_X, 680, 1.08), FECHADO(palavra(B, 'final.') - 2, CENTRO_X, 700, 1.14)],
};
