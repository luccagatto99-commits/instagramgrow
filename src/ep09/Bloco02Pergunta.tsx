import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, FundoGalpao, MascoteArticulado, Som, type CenaEp } from '../components';
import { COR, FONTE, ESTEIRA_Y, CENTRO_X } from '../theme';
import { entra, lin, tranco } from '../anim';
import { palavra } from './tempo';
import { Casa } from './comum';
import { LARG_MASCOTE } from './Bloco01Gancho';

const B = 1;

/** A pergunta: a casa some, o mascote fica parado e um "?" vermelho cai sobre ele. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tCorpo = palavra(B, 'corpo?');
  const tTexto = palavra(B, 'texto');
  const cai = entra(frame, tCorpo - 6, 160);
  const baque = tranco(frame, tCorpo + 2);
  return (
    <>
      <Som nome="carimbo" em={tCorpo + 2} volume={0.5} />
      <div style={{ opacity: 1 - lin(frame, 0, 12) }}>
        <Casa x={CENTRO_X} base={ESTEIRA_Y} altura={400} p={1} />
      </div>
      <MascoteArticulado x={CENTRO_X} base={ESTEIRA_Y} largura={LARG_MASCOTE} olhar={frame >= tTexto ? Math.sin(frame / 10) : 0} escala={1 - baque * 0.06} />
      {frame >= tCorpo - 6 ? (
        <div
          style={{
            position: 'absolute',
            left: CENTRO_X,
            top: 430 + (1 - cai) * -300,
            transform: 'translateX(-50%) rotate(-6deg)',
            fontFamily: FONTE.titulo,
            fontSize: 200,
            lineHeight: 1,
            color: COR.vermelho,
            opacity: Math.min(1, cai * 2),
          }}
        >
          ?
        </div>
      ) : null}
    </>
  );
};

export const Pergunta: CenaEp = {
  Conteudo,
  Fundo: () => <FundoGalpao />,
  planos: () => [ABERTO(0), ABERTO(palavra(B, 'corpo?') + 2)],
};
