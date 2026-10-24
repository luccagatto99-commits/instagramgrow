import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, CaixaToken, FECHADO, FundoGalpao, Quadro, comEspaco, type CenaEp } from '../components';
import { CENTRO_X, ESTEIRA_Y } from '../theme';
import { naEsteira } from '../anim';
import { palavra } from './tempo';
import { CACHORRO, GATO } from './dados';
import { X_CACHORRO, X_GATO } from './Bloco01Gancho';

const B = 1;

/** Promessa: o que você vai entender neste turno. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {/* as duas caixas do gancho continuam esperando na esteira */}
      <CaixaToken texto={comEspaco(CACHORRO.t)} id={CACHORRO.id} tamanho={64} x={naEsteira(frame, 0, X_CACHORRO)} base={ESTEIRA_Y} escala={0.7} />
      <CaixaToken texto={comEspaco(GATO.t)} id={GATO.id} tamanho={64} x={naEsteira(frame, 6, X_GATO)} base={ESTEIRA_Y} escala={0.7} />
      <Quadro
        titulo="HOJE NA FÁBRICA"
        inicio={2}
        top={395}
        itens={[
          { texto: 'número ≠ significado', em: palavra(B, 'número') },
          { texto: 'o que é embedding', em: palavra(B, 'embedding.') },
          { texto: 'como ela entende você', em: palavra(B, 'outras') },
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
    FECHADO(palavra(B, 'embedding.') - 2, CENTRO_X, 650, 1.1),
    FECHADO(palavra(B, 'outras') - 2, CENTRO_X, 760, 1.1),
    ABERTO(palavra(B, 'acompanhe')),
  ],
};
