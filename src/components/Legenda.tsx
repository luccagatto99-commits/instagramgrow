import React from 'react';
import { useCurrentFrame } from 'remotion';
import { COR, FONTE, SEGURA, CENTRO_X } from '../theme';
import { pop } from '../anim';

export type PalavraTempo = { t: string; s: number; e: number; b: number };
export type Grupo = { palavras: { t: string; f: number }[]; ini: number; fim: number };

const MAX = 4;

/** Agrupa em blocos de até 4 palavras, quebrando após pontuação. */
export const agrupar = (palavras: PalavraTempo[], fps: number): Grupo[] => {
  const grupos: Grupo[] = [];
  let atual: { t: string; f: number; b: number; e: number }[] = [];
  const fecha = () => {
    if (!atual.length) return;
    grupos.push({
      palavras: atual.map(({ t, f }) => ({ t, f })),
      ini: atual[0].f,
      fim: Math.round(atual[atual.length - 1].e * fps),
    });
    atual = [];
  };
  palavras.forEach((p, i) => {
    if (atual.length && (atual[0].b !== p.b || atual.length >= MAX)) fecha();
    atual.push({ t: p.t, f: Math.round(p.s * fps), b: p.b, e: p.e });
    const prox = palavras[i + 1];
    const fimFrase = /[.?!:]["”]?$/.test(p.t) || p.t.endsWith('...');
    const virgula = /,["”]?$/.test(p.t);
    if (fimFrase || virgula || (prox && prox.b !== p.b)) fecha();
  });
  fecha();
  // cada grupo fica até o próximo começar (no máx. 0,6 s depois da última palavra)
  grupos.forEach((g, i) => {
    const prox = grupos[i + 1];
    const extra = Math.round(0.6 * fps);
    g.fim = prox ? Math.min(prox.ini, g.fim + extra) : g.fim + extra;
  });
  return grupos;
};

const ehNumero = (t: string) => /^\d/.test(t);
const limpa = (t: string) => t.replace(/["“”]/g, '');

/** Legenda palavra por palavra, palavra atual em vermelho com leve pop. */
export const Legenda: React.FC<{ grupos: Grupo[] }> = ({ grupos }) => {
  const frame = useCurrentFrame();
  const g = grupos.find((x) => frame >= x.ini && frame < x.fim);
  if (!g) return null;
  const idxAtual = g.palavras.reduce((acc, p, i) => (frame >= p.f ? i : acc), 0);
  const sobe = Math.max(0, 1 - (frame - g.ini) / 5);
  return (
    <div
      style={{
        position: 'absolute',
        left: CENTRO_X,
        top: SEGURA.legendaYMin,
        width: 760, // estreita para não ficar sob os botões do Instagram
        height: SEGURA.legendaYMax - SEGURA.legendaYMin,
        transform: `translate(-50%, ${sobe * 18}px)`,
        opacity: 1 - sobe * 0.6,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignContent: 'center',
        columnGap: 30,
        rowGap: 4,
      }}
    >
      {g.palavras.map((p, i) => {
        const atual = i === idxAtual && frame >= p.f;
        const num = ehNumero(p.t);
        return (
          <span
            key={i}
            style={{
              fontFamily: num ? FONTE.numero : FONTE.titulo,
              fontWeight: num ? 800 : 400,
              fontSize: 80,
              lineHeight: 1.15,
              color: atual ? `var(--fala-texto, ${COR.vermelho})` : `var(--tinta, ${COR.preto})`,
              background: atual ? 'var(--fala-fundo, transparent)' : undefined,
              borderRadius: 14,
              padding: 'var(--fala-pad, 0)',
              margin: 'var(--fala-margem, 0)',
              display: 'inline-block',
              transform: `scale(${atual ? pop(frame, p.f, 0.06) : 1})`,
            }}
          >
            {limpa(p.t)}
          </span>
        );
      })}
    </div>
  );
};
