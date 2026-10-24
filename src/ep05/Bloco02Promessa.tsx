import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Carimbo, FECHADO, FichaDocumento, FundoGalpao, Quadro, type CenaEp } from '../components';
import { CENTRO_X, ESTEIRA_Y } from '../theme';
import { naEsteira } from '../anim';
import { palavra } from './tempo';

const B = 1;

/** Promessa: o que você vai entender neste turno. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <FichaDocumento x={naEsteira(frame, 0, CENTRO_X)} base={ESTEIRA_Y} rotulo="PLANO" nome="criar a IA" numero="prazo: 1 verão" largura={260} tamanho={26} escala={0.8} anulada={1}>
        <Carimbo x={130} y={66} texto="ERRARAM" em={-30} tamanho={24} rot={-12} />
      </FichaDocumento>
      <Quadro
        titulo="HOJE NA FÁBRICA"
        inicio={2}
        top={420}
        itens={[
          { texto: 'o teste de Turing', em: palavra(B, 'turing.') },
          { texto: 'o truque de 1966', em: palavra(B, 'programa') },
          { texto: 'por que demorou', em: palavra(B, 'demorou') },
        ]}
        destaque={{ indice: 2, em: palavra(B, 'acompanhe') }}
      />
    </>
  );
};

export const Promessa: CenaEp = {
  Conteudo,
  Fundo: () => <FundoGalpao />,
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'programa') - 2, CENTRO_X, 700, 1.08), FECHADO(palavra(B, 'demorou') - 2, CENTRO_X, 780, 1.1), ABERTO(palavra(B, 'acompanhe'))],
};
