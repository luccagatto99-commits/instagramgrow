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
      { texto: 'o ID é só etiqueta', em: palavra(B, 'etiqueta.') },
      { texto: 'embedding = endereço', em: palavra(B, 'embedding') },
      { texto: 'compara posições', em: palavra(B, 'posições,') },
    ]}
    destaque={{ indice: 2, em: palavra(B, 'letras.') }}
  />
);

export const Resumo: CenaEp = {
  Conteudo,
  Fundo: () => <FundoGalpao />,
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'embedding') - 2, CENTRO_X, 680, 1.08), FECHADO(palavra(B, 'posições,') - 2, CENTRO_X, 700, 1.14)],
};
