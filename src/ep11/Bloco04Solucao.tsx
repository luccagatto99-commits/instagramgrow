import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, No3D, Som, Visto, type CenaEp } from '../components';
import { COR } from '../theme';
import { entra, lin, mola } from '../anim';
import { palavra } from './tempo';
import { ALTURA_ESTEIRA, CenaPraiaViva, Fabrica3D, QuadroFilme3D, cameraPor, orelhaNaCena } from './comum';
import { RotuloHud } from '../ep10/comum';

const B = 3;
const W_IMG = 200;
const N = 6;
const PASSO_FILA = 250;
const FRENTE = [-275, 0, 275]; // fotos 1, 2 e 3 na vista de frente
const ESC_FRENTE = 1.25; // de frente, as três fotos crescem para a orelha aparecer
const FAIXA = Math.round(W_IMG * 0.14);
const H_IMG = (W_IMG * 3) / 4;
const TOPO_IMG = -(H_IMG + FAIXA * 2) + FAIXA; // topo da imagem, relativo à base do quadro
const passoDo = (i: number) => i * 12; // o cachorro anda um pouco a cada foto

/** Ponto da imagem (viewBox 400 × 300) da foto centrada em `xq` (escala `s`) → coordenada do mundo. */
const naImagem = (xq: number, px: number, py: number, s = ESC_FRENTE): [number, number] => [
  xq + ((px * W_IMG) / 400 - W_IMG / 2) * s,
  -ALTURA_ESTEIRA + (TOPO_IMG + (py * H_IMG) / 300) * s,
];

/** Arco azul entre dois pontos, desenhado até `p` (0 → 1). */
const Arco: React.FC<{ a: [number, number]; b: [number, number]; p: number; espessura?: number; altura?: number }> = ({ a, b, p, espessura = 7, altura = 70 }) => {
  if (p <= 0) return null;
  const mx = (a[0] + b[0]) / 2;
  const my = Math.min(a[1], b[1]) - altura;
  const comp = Math.hypot(b[0] - a[0], b[1] - a[1]) * 1.3;
  return (
    <path d={`M${a[0]} ${a[1]} Q${mx} ${my} ${b[0]} ${b[1]}`} fill="none" stroke={COR.azul} strokeWidth={espessura} strokeLinecap="round" strokeDasharray={comp} strokeDashoffset={comp * (1 - p)} />
  );
};

/** Círculo azul em volta da orelha, com pop na entrada. */
const Anel: React.FC<{ c: [number, number]; e: number }> = ({ c, e }) =>
  e > 0.01 ? <circle cx={c[0]} cy={c[1]} r={30 * e} fill="none" stroke={COR.azul} strokeWidth={8} /> : null;

/**
 * A solução, uma ideia por vez: as fotos enfileiradas limpam TODAS JUNTAS; de frente, arcos azuis
 * mostram que cada foto é comparada com a vizinha; depois um anel marca a orelha numa foto e, na
 * próxima, outro anel mostra a orelha logo ao lado (bem perto). ✓ verde em "nada pula".
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tLimpa = palavra(B, 'limpa');
  const tTodas = palavra(B, 'todas');
  const tJuntas = palavra(B, 'juntas.', 0, true);
  const tCompara = palavra(B, 'compara');
  const tVizinha = palavra(B, 'vizinha.', 0, true);
  const tOrelha = palavra(B, 'orelha');
  const tAqui = palavra(B, 'aqui');
  const tProxima = palavra(B, 'próxima');
  const tPerto = palavra(B, 'perto.', 0, true);
  const tAssim = palavra(B, 'assim,');

  // limpeza em 4 degraus, igual em todas as fotos
  const etapas = 4;
  const real = lin(frame, tLimpa, tJuntas + 4) * etapas;
  const degrau = Math.floor(real) + Math.min(1, (real - Math.floor(real)) / 0.4);
  const nivel = 1 - Math.min(etapas, degrau) / etapas;

  const frente = frame >= tJuntas + 2 ? mola(frame, tJuntas + 2, 0, 1) : 0;
  const pVizinha = [0, 1].map((k) => lin(frame, tCompara + k * 8, tCompara + k * 8 + 12));
  const someVizinha = lin(frame, tOrelha - 4, tOrelha + 4);
  const anel = [tAqui - 2, tProxima + 2, tPerto - 4].map((t0) => (frame >= t0 ? mola(frame, t0, 0, 1) : 0));
  const pOrelha = [lin(frame, tProxima, tProxima + 12), lin(frame, tPerto - 2, tPerto + 10)];

  // posições: fila em profundidade (ao longo da esteira) → três de frente, maiores
  const xFila = (i: number) => (i - (N - 1) / 2) * PASSO_FILA;
  const xDe = (i: number) => (i >= 1 && i <= 3 ? xFila(i) + (FRENTE[i - 1] - xFila(i)) * frente : xFila(i));
  const escDe = (i: number) => (i >= 1 && i <= 3 ? 1 + (ESC_FRENTE - 1) * frente : 1 - frente);

  const orelha = (q: number) => {
    const [px, py] = orelhaNaCena(passoDo(q + 1));
    return naImagem(FRENTE[q], px, py);
  };
  const topoFoto = (q: number): [number, number] => naImagem(FRENTE[q], 200, 0);
  const marcas = frente > 0.9 ? (
    <svg width={1000} height={600} viewBox="-500 -560 1000 600" style={{ position: 'absolute', left: -500, top: -560, overflow: 'visible' }}>
      <g opacity={1 - someVizinha}>
        {[0, 1].map((k) => (
          <Arco key={k} a={[topoFoto(k)[0] + 40, topoFoto(k)[1] - 30]} b={[topoFoto(k + 1)[0] - 40, topoFoto(k + 1)[1] - 30]} p={pVizinha[k]} altura={60} espessura={9} />
        ))}
      </g>
      {[0, 1].map((k) => <Arco key={`o${k}`} a={orelha(k)} b={orelha(k + 1)} p={pOrelha[k]} altura={90} />)}
      {[0, 1, 2].map((q) => <Anel key={q} c={orelha(q)} e={anel[q]} />)}
    </svg>
  ) : null;

  const cam = cameraPor(frame, [
    { em: 0, rx: 14, ry: -34, zoom: -120, foco: [0, -150, 0], centra: 0 },
    { em: tJuntas + 2, rx: 12, ry: 0, zoom: 60, foco: [0, -170, 0], centra: 0 },
    { em: tOrelha - 4, zoom: 160, foco: [0, -190, 0] },
    { em: tAssim, zoom: 90 },
  ], 1.2, B);
  return (
    <>
      <Som nome="chiado" em={tLimpa} volume={0.35} />
      {Array.from({ length: etapas }).map((_, k) => <Som key={k} nome="tique" em={Math.round(tLimpa + ((tJuntas + 4 - tLimpa) / etapas) * k)} volume={0.3} />)}
      <Som nome="ding" em={tJuntas} volume={0.4} />
      <Som nome="ding" em={palavra(B, 'cor.', 0, true)} volume={0.4} />

      <Fabrica3D bloco={B} cam={cam} poeira={0.3 * nivel}>
        {Array.from({ length: N }).map((_, i) => {
          const esc = escDe(i);
          if (esc <= 0.01) return null;
          return (
            <No3D key={i} x={xDe(i)} y={-ALTURA_ESTEIRA} escala={esc}>
              <QuadroFilme3D w={W_IMG} nivel={nivel} semente={60 + i} cols={20}>
                <CenaPraiaViva t={frame} passo={passoDo(i)} />
              </QuadroFilme3D>
            </No3D>
          );
        })}
        {marcas ? <No3D z={14}>{marcas}</No3D> : null}
      </Fabrica3D>

      {frame >= tTodas - 2 && frame < tCompara - 2 ? <RotuloHud texto="TODAS JUNTAS" escala={entra(frame, tTodas - 2, 200)} /> : null}
      {frame >= tCompara - 2 && frame < tOrelha - 2 ? <RotuloHud texto="COMPARA COM A VIZINHA" escala={entra(frame, tCompara - 2, 200)} /> : null}
      {frame >= tOrelha - 2 && frame < tAssim - 2 ? <RotuloHud texto="A ORELHA FICA PERTO" escala={entra(frame, tOrelha - 2, 200)} /> : null}
      {frame >= tAssim - 2 ? (
        <>
          <Visto x={300} y={500} r={38} escala={entra(frame, tAssim - 2, 220)} />
          <RotuloHud texto="NADA PULA" x={580} escala={entra(frame, tAssim - 2, 200)} />
        </>
      ) : null}
    </>
  );
};

export const Solucao: CenaEp = {
  Conteudo,
  Fundo: () => null,
  planos: () => [ABERTO(0)],
  esteira: false,
  transicao: 0,
};
