import React from 'react';
import { FundoGalpao, Quadro } from '../components';
import { CENTRO_X } from '../theme';
import { palavra } from './tempo';
import { ABERTO, FECHADO, type CenaEp } from './comum';

const B = 9;

/** Resumo do turno: os mesmos 3 pontos da promessa, agora respondidos. */
const Conteudo: React.FC = () => (
  <Quadro
    titulo="RESUMO DO TURNO"
    inicio={2}
    top={450}
    feito
    itens={[
      { texto: 'a IA só lê números', em: palavra(B, 'números.') },
      { texto: 'token = pedaço + ID', em: palavra(B, 'token') },
      { texto: 'os R ficam escondidos', em: palavra(B, 'morango') },
    ]}
    destaque={{ indice: 2, em: palavra(B, 'escondidas') }}
  />
);

export const Resumo: CenaEp = {
  Conteudo,
  Fundo: () => <FundoGalpao />,
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'token') - 2, CENTRO_X, 680, 1.08), FECHADO(palavra(B, 'morango') - 2, CENTRO_X, 700, 1.14)],
};
