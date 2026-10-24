import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Quadro } from '../components';
import { palavra } from './tempo';

const B = 9;

/** Resumo do turno: os mesmos 3 pontos da promessa, agora respondidos. */
export const Bloco10: React.FC = () => {
  useCurrentFrame();
  return (
    <Quadro
      titulo="RESUMO DO TURNO"
      inicio={2}
      top={410}
      feito
      itens={[
        { texto: 'texto vira tokens', em: palavra(B, 'texto') },
        { texto: 'token vira número', em: palavra(B, 'cada') },
        { texto: 'a IA só vê números', em: palavra(B, 'enxerga') },
      ]}
      destaque={{ indice: 2, em: palavra(B, 'nunca') }}
    />
  );
};
