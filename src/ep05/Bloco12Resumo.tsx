import React from 'react';
import { ABERTO, FECHADO, FundoGalpao, Quadro, type CenaEp } from '../components';
import { CENTRO_X } from '../theme';
import { palavra } from './tempo';

const B = 11;

/** Resumo do turno: os mesmos 3 pontos da promessa, agora respondidos. */
const Conteudo: React.FC = () => (
  <Quadro
    titulo="RESUMO DO TURNO"
    inicio={2}
    top={450}
    feito
    itens={[
      { texto: 'teste = conversa', em: palavra(B, 'conversa.') },
      { texto: 'a gente se engana', em: palavra(B, 'fácil.') },
      { texto: 'exemplos > regras', em: palavra(B, 'exemplos.') },
    ]}
    destaque={{ indice: 2, em: palavra(B, 'exemplos.') + 8 }}
  />
);

export const Resumo: CenaEp = {
  Conteudo,
  Fundo: () => <FundoGalpao />,
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'fácil.') - 2, CENTRO_X, 680, 1.08), FECHADO(palavra(B, 'exemplos.') - 2, CENTRO_X, 700, 1.12)],
};
