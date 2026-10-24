import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Carimbo, FundoMapa, MarcoTempo, Som, type CenaEp } from '../components';
import { COR, FONTE, ESTEIRA_Y, CENTRO_X } from '../theme';
import { entra, lin } from '../anim';
import { palavra } from './tempo';
import { CuboMagico } from './comum';

const B = 6;
const XS = [CENTRO_X - 255, CENTRO_X, CENTRO_X + 255];

/** A volta: 2019 cubo mágico → 2021 fechado → hoje 27 vagas. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const t2019 = palavra(B, '2019,');
  const tCubo = palavra(B, 'cubo');
  const tDesistiu = palavra(B, 'desistiu.');
  const tAgora = palavra(B, 'agora');
  const t27 = palavra(B, '27');
  const vagas = lin(frame, t27 - 4, t27 + 14, 0, 27);
  // a linha que liga os marcos se estende conforme eles aparecem
  const linha = frame < tDesistiu ? 0 : frame < tAgora ? 0.5 * lin(frame, tDesistiu - 4, tDesistiu + 6) : 0.5 + 0.5 * lin(frame, tAgora - 4, tAgora + 6);
  return (
    <>
      <Som nome="tique" em={t2019} />
      <Som nome="tique" em={tCubo} />
      <Som nome="carimbo" em={tDesistiu + 4} volume={0.6} />
      <Som nome="tique" em={tAgora} />
      {[0, 1, 2, 3, 4].map((k) => <Som key={k} nome="tique" em={t27 - 4 + k * 4} volume={0.35} />)}

      <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <line x1={XS[0]} y1={660} x2={XS[0] + (XS[2] - XS[0]) * linha} y2={660} stroke={`var(--tinta, ${COR.preto})`} strokeWidth={8} strokeDasharray="18 14" />
      </svg>
      {frame >= t2019 - 2 ? (
        <MarcoTempo x={XS[0]} base={ESTEIRA_Y} ano="2019" legenda="MÃO MONTA CUBO" escala={entra(frame, t2019 - 2, 190)}>
          {frame >= tCubo - 2 ? <CuboMagico giro={(frame - tCubo) * 9} tamanho={120} /> : null}
        </MarcoTempo>
      ) : null}
      {frame >= tDesistiu - 4 ? (
        <MarcoTempo x={XS[1]} base={ESTEIRA_Y} ano="2021" legenda="EQUIPE ENCERRADA" escala={entra(frame, tDesistiu - 4, 190)}>
          <div style={{ position: 'relative', width: 0, height: 0 }}>
            <Carimbo x={0} y={0} texto="FECHADO" em={tDesistiu + 4} tamanho={32} rot={-12} />
          </div>
        </MarcoTempo>
      ) : null}
      {frame >= tAgora - 4 ? (
        <MarcoTempo x={XS[2]} base={ESTEIRA_Y} ano="2026" legenda="VAGAS EM ROBÓTICA" escala={entra(frame, tAgora - 4, 190)}>
          <span style={{ fontFamily: FONTE.numero, fontWeight: 800, fontSize: 110, color: COR.azul, lineHeight: 1 }}>{Math.round(vagas)}</span>
        </MarcoTempo>
      ) : null}
    </>
  );
};

export const Volta: CenaEp = {
  Conteudo,
  Fundo: () => <FundoMapa />,
  planos: () => [ABERTO(0), ABERTO(palavra(B, 'desistiu.')), ABERTO(palavra(B, '27'))],
};
