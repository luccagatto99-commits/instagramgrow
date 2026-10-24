import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, FECHADO, FundoGalpao, MascoteArticulado, Som, type CenaEp } from '../components';
import { ESTEIRA_Y, CENTRO_X } from '../theme';
import { entra, lin, mola } from '../anim';
import { palavra } from './tempo';
import { Casa } from './comum';

const B = 0;
export const LARG_MASCOTE = 280;

/** Gancho: o mascote ganha pernas e braços peça por peça; em "em casa", uma casa se desenha em volta. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tCorpo = palavra(B, 'corpo');
  const tGente = palavra(B, 'gente.');
  const tHumanoide = palavra(B, 'humanoide');
  const tCasa = palavra(B, 'em', 0);
  const pE = entra(frame, 2, 220);
  const pD = entra(frame, 9, 220);
  const bE = frame >= tCorpo ? entra(frame, tCorpo, 220) : 0;
  const bD = frame >= tGente ? entra(frame, tGente, 220) : 0;
  const aceno = frame >= tHumanoide ? mola(frame, tHumanoide, 0, 1) : 0;
  return (
    <>
      <Som nome="tique" em={2} />
      <Som nome="tique" em={9} />
      <Som nome="carimbo" em={tCorpo} volume={0.35} />
      <Som nome="carimbo" em={tGente} volume={0.35} />
      <Som nome="tique" em={tCasa} />

      {frame >= tCasa ? <Casa x={CENTRO_X} base={ESTEIRA_Y} altura={400} p={lin(frame, tCasa, tCasa + 22)} /> : null}
      <MascoteArticulado
        x={CENTRO_X}
        base={ESTEIRA_Y}
        largura={LARG_MASCOTE}
        pernas={[pE, pD]}
        bracos={[bE, bD]}
        aceno={aceno}
        balanco={Math.sin(frame / 4) * 18 * aceno}
        escala={mola(frame, -6, 0.85, 1)}
      />
    </>
  );
};

export const Gancho: CenaEp = {
  Conteudo,
  Fundo: () => <FundoGalpao />,
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'corpo'), CENTRO_X, 860, 1.15), ABERTO(palavra(B, 'sam'))],
  transicao: 0,
};
