import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, FECHADO, FundoReuniao, MascoteArticulado, Som, useVisivelNoHud, type CenaEp } from '../components';
import { COR, CONTORNO, FONTE, RAIO, SOMBRA, ESTEIRA_Y, CENTRO_X } from '../theme';
import { entra, lin, naEsteira } from '../anim';
import { palavra } from './tempo';

const B = 5;

/** Frase do Altman (hud). */
const Frase: React.FC<{ em: number }> = ({ em }) => {
  const frame = useCurrentFrame();
  const vis = useVisivelNoHud();
  if (frame < em) return null;
  const p = entra(frame, em, 160);
  return (
    <div
      style={{
        position: 'absolute',
        left: CENTRO_X,
        top: 425,
        width: 760,
        transform: `translateX(-50%) translateY(${(1 - p) * 30}px)`,
        opacity: Math.min(1, p * 1.5),
        background: COR.branco,
        border: `${CONTORNO}px solid ${COR.preto}`,
        borderRadius: RAIO.caixa,
        boxShadow: SOMBRA,
        padding: '14px 26px 12px',
        boxSizing: 'border-box',
        ...vis,
      }}
    >
      <div style={{ fontFamily: FONTE.titulo, fontSize: 35, lineHeight: 1.12, color: COR.preto }}>“O mais importante é o cérebro que faz o robô funcionar.”</div>
      <div style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 26, letterSpacing: 2, color: COR.preto, opacity: 0.75, marginTop: 10 }}>SAM ALTMAN · SET 2026</div>
    </div>
  );
};

/** O cérebro: o corpo apaga; os nós do visor acendem. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tDiz = palavra(B, 'diz');
  const tCorpo = palavra(B, 'corpo.');
  const tCerebro = palavra(B, 'cerebro');
  const membros = 1 - 0.7 * lin(frame, tCorpo, tCorpo + 10);
  const pensa = lin(frame, tCerebro, palavra(B, 'funcionar.', 0, true));
  return (
    <>
      <Som nome="tique" em={tDiz} />
      <Som nome="tique" em={tCorpo} volume={0.5} />
      {[0, 1, 2, 3].map((k) => <Som key={k} nome="tique" em={tCerebro + k * 8} volume={0.4} />)}
      <MascoteArticulado x={naEsteira(frame, 0, CENTRO_X)} base={ESTEIRA_Y} largura={270} membros={membros} pensa={pensa} />
      <Frase em={tDiz} />
    </>
  );
};

export const Cerebro: CenaEp = {
  Conteudo,
  Fundo: () => <FundoReuniao />,
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'cerebro'), CENTRO_X, 780, 1.12)],
};
