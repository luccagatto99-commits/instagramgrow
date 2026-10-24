import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Carimbo, FECHADO, FichaDocumento, FundoGalpao, Quadro, type CenaEp } from '../components';
import { CENTRO_X, ESTEIRA_Y } from '../theme';
import { naEsteira } from '../anim';
import { palavra } from './tempo';
import { PROCESSOS } from './dados';

const B = 1;

/** Promessa: o que você vai entender neste turno. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <FichaDocumento x={naEsteira(frame, 0, CENTRO_X)} base={ESTEIRA_Y} nome={PROCESSOS[0].nome} numero={PROCESSOS[0].numero} largura={240} tamanho={24} escala={0.8} anulada={1}>
        <Carimbo x={120} y={58} texto="NÃO EXISTE" em={-30} tamanho={22} rot={-14} />
      </FichaDocumento>
      <Quadro
        titulo="HOJE NA FÁBRICA"
        inicio={2}
        top={395}
        itens={[
          { texto: 'por que ela inventa', em: palavra(B, 'inventa') },
          { texto: 'por que ela chuta', em: palavra(B, 'quase') },
          { texto: '3 cuidados práticos', em: palavra(B, 'cuidados') },
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
    FECHADO(palavra(B, 'quase') - 2, CENTRO_X, 650, 1.1),
    FECHADO(palavra(B, 'cuidados') - 2, CENTRO_X, 760, 1.1),
    ABERTO(palavra(B, 'acompanhe')),
  ],
};
