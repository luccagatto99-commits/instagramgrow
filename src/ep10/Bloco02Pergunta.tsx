import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, FundoEscritorio, QuadroRuido, Som, type CenaEp } from '../components';
import { ESTEIRA_Y } from '../theme';
import { entra, lin, mola, tranco } from '../anim';
import { palavra } from './tempo';
import { CenaPraia, Interrogacao } from './comum';

const B = 1;
const BASE = ESTEIRA_Y - 10;

/** A pergunta: o quadro volta a ser só pontos e um "?" vermelho cai ao lado; a placa CONTROLE DE QUALIDADE desce em "treino". */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tComo = palavra(B, 'como');
  const tTirar = palavra(B, 'tirar?');
  const tTreino = palavra(B, 'treino.');
  const pQuadro = entra(frame, 0, 160);
  const pInter = frame >= tComo - 2 ? entra(frame, tComo - 2, 200) : 0;
  const baque = tranco(frame, tTirar);
  const nivel = lin(frame, 0, 14, 0.25, 1);
  return (
    <>
      <Som nome="chiado" em={2} volume={0.3} />
      <Som nome="tique" em={tComo - 2} />
      <Som nome="carimbo" em={tTreino} volume={0.45} />
      <QuadroRuido x={410} base={BASE} largura={440} nivel={nivel} escala={pQuadro * (1 - baque * 0.04)}>
        <CenaPraia />
      </QuadroRuido>
      {pInter > 0 ? <Interrogacao x={790} top={620 - (1 - pInter) * 120} escala={pInter} rot={Math.sin(frame / 9) * 5 + mola(frame, tTreino, 0, -8)} /> : null}
    </>
  );
};

export const Pergunta: CenaEp = {
  Conteudo,
  Fundo: () => <FundoEscritorio />,
  planos: () => [ABERTO(0)],
};
