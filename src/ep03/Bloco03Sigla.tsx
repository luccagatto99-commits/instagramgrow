import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, CaixaToken, FECHADO, FundoPrensa, Som, type CenaEp } from '../components';
import { COR, FONTE, CENTRO_X, ESTEIRA_Y } from '../theme';
import { entra, mola, naEsteira, pop } from '../anim';
import { palavra } from './tempo';

const B = 2;
const T = 84;
const ALT = T * 1.1 + Math.round(T * 0.18) * 2 + 20;
const BASES = [ESTEIRA_Y - 2 * (ALT + 14), ESTEIRA_Y - (ALT + 14), ESTEIRA_Y];
const X_LETRA = 210;
const LINHAS = [
  { l: 'G', palavra: 'generativo', sub: 'GERA TEXTO', gatilho: 'g' },
  { l: 'P', palavra: 'pré-treinado', sub: 'LEU MUITO ANTES', gatilho: 'p' },
  { l: 'T', palavra: 'Transformer', sub: 'A PEÇA QUE MUDOU TUDO', gatilho: 't' },
];

/** A sigla: cada letra desliza para a esquerda e revela o que significa. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tHist = palavra(B, 'tudo.');
  return (
    <>
      {LINHAS.map((ln, i) => {
        const t = palavra(B, ln.gatilho);
        const x = frame < t - 4 ? naEsteira(frame, -6 + i * 5, CENTRO_X) : mola(frame, t - 4, CENTRO_X, X_LETRA);
        const p = entra(frame, t + 2, 150);
        const ehT = i === 2;
        const yMeio = BASES[i] - ALT / 2;
        return (
          <React.Fragment key={ln.l}>
            <Som nome="carimbo" em={t} volume={0.5} />
            <CaixaToken texto={ln.l} tamanho={T} x={x} base={BASES[i]} destaque={ehT && frame >= t} escala={ehT ? pop(frame, tHist, 0.12) : 1} />
            {frame >= t + 2 ? (
              <div
                style={{
                  position: 'absolute',
                  left: 310,
                  top: yMeio,
                  transform: `translate(${(1 - p) * -40}px, -50%)`,
                  opacity: Math.min(1, p * 1.5),
                  whiteSpace: 'nowrap',
                }}
              >
                <div
                  style={{
                    fontFamily: FONTE.titulo,
                    fontSize: 64,
                    lineHeight: 1.05,
                    color: ehT ? COR.amarelo : COR.preto,
                    background: ehT ? COR.preto : 'transparent',
                    borderRadius: 16,
                    padding: ehT ? '4px 18px 8px' : 0,
                    display: 'inline-block',
                    transform: `scale(${ehT ? pop(frame, tHist, 0.1) : 1})`,
                    transformOrigin: '0% 50%',
                  }}
                >
                  {ln.palavra}
                </div>
                <div style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 30, letterSpacing: 2, color: COR.preto, marginTop: 6 }}>{ln.sub}</div>
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
    </>
  );
};

export const Sigla: CenaEp = {
  Conteudo,
  Fundo: () => { const f = useCurrentFrame(); return <FundoPrensa giro={f * 0.6} />; },
  planos: () => [ABERTO(0), FECHADO(palavra(B, 't') - 2, CENTRO_X, 900, 1.1), ABERTO(palavra(B, 'tudo.'))],
};
