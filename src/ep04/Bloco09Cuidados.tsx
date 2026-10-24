import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Carimbo, FECHADO, FichaDocumento, FundoEscritorio, Quadro, type CenaEp } from '../components';
import { CENTRO_X, ESTEIRA_Y } from '../theme';
import { lin, naEsteira, segue } from '../anim';
import { palavra } from './tempo';
import { PROCESSOS } from './dados';

const B = 8;

/** Três cuidados (checklist). No primeiro, a ficha falsa é pega antes do juiz. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tAdv = palavra(B, 'advogados');
  const tDescoberto = palavra(B, 'descoberto');
  const tSegundo = palavra(B, 'segundo');
  const sai = segue(frame, tSegundo - 6, 14);
  return (
    <>
      <Quadro
        titulo="3 CUIDADOS"
        inicio={2}
        top={430}
        feito
        itens={[
          { texto: 'peça a fonte e abra', em: palavra(B, 'link.') },
          { texto: 'atual? use busca', em: palavra(B, 'internet.') },
          { texto: 'confira os detalhes', em: palavra(B, 'específico.') },
        ]}
        destaque={{ indice: 0, em: palavra(B, 'link.') }}
      />
      {frame >= tAdv - 4 && sai < 1400 ? (
        <FichaDocumento x={naEsteira(frame, tAdv - 4, CENTRO_X) + sai} base={ESTEIRA_Y} nome={PROCESSOS[1].nome} numero={PROCESSOS[1].numero} largura={240} tamanho={24} escala={0.65} anulada={lin(frame, tDescoberto - 2, tDescoberto + 2)}>
          <Carimbo x={120} y={58} texto="NÃO EXISTE" em={tDescoberto} tamanho={22} rot={-14} />
        </FichaDocumento>
      ) : null}
    </>
  );
};

export const Cuidados: CenaEp = {
  Conteudo,
  Fundo: () => <FundoEscritorio />,
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'descoberto') - 4, CENTRO_X, 860, 1.08), ABERTO(palavra(B, 'segundo') - 2)],
};
