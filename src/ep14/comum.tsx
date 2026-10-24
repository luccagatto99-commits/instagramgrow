import React from 'react';
import { COR, FONTE, CONTORNO, SOMBRA } from '../theme';

const P = COR.preto;
/** Trânsito médio (laranja do mapa de trânsito). Só aparece no trânsito. */
export const LARANJA = '#FF9A2E';
const FUNDO_MAPA = '#ECECEC';

export type Pt = [number, number];

/** Área útil do mapa na tela (dentro do contorno). */
export const MAPA = { x: 160, y: 470, w: 760, h: 560 };

/** Câmera do mapa: zoom e ponto (em coordenadas do mapa) que fica no centro do painel. */
export type Cam = { zoom: number; foco: Pt };
export const CAM_ABERTA: Cam = { zoom: 1, foco: [MAPA.w / 2, MAPA.h / 2] };

// ruas genéricas: três horizontais (a do meio é a avenida) e três verticais
export const Y_R1 = 120;
export const Y_AV = 315;
export const Y_R2 = 480;
export const X_V1 = 150;
export const X_V2 = 420;
export const X_V3 = 630;

export const RUAS: Record<'r1' | 'av' | 'r2' | 'v1' | 'v2' | 'v3', Pt[]> = {
  r1: [[-80, Y_R1], [840, Y_R1]],
  av: [[-80, Y_AV], [840, Y_AV]],
  r2: [[-80, Y_R2], [840, Y_R2]],
  v1: [[X_V1, -80], [X_V1, 670]],
  v2: [[X_V2, 670], [X_V2, -80]],
  v3: [[X_V3, -80], [X_V3, 670]],
};
/** Distância ao longo da avenida para um x do mapa. */
export const dAv = (x: number) => x + 80;

export const NOS: Pt[] = [Y_R1, Y_AV, Y_R2].flatMap((y) => [X_V1, X_V2, X_V3].map((x) => [x, y] as Pt));

const str = (pts: Pt[]) => pts.map(([x, y]) => `${x},${y}`).join(' ');
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

const limita = (cam: Cam): Cam => {
  const mw = MAPA.w / (2 * cam.zoom);
  const mh = MAPA.h / (2 * cam.zoom);
  return { zoom: cam.zoom, foco: [clamp(cam.foco[0], mw, MAPA.w - mw), clamp(cam.foco[1], mh, MAPA.h - mh)] };
};

/** Ponto do mapa → ponto da tela (para pôr peças de HTML em cima do mapa). */
export const aTela = (cam: Cam, [x, y]: Pt, dx = 0): Pt => {
  const c = limita(cam);
  return [MAPA.x + dx + MAPA.w / 2 + (x - c.foco[0]) * c.zoom, MAPA.y + MAPA.h / 2 + (y - c.foco[1]) * c.zoom];
};

/** Mistura de câmeras (p = 0 → a, 1 → b). */
export const misturaCam = (a: Cam, b: Cam, p: number): Cam => ({
  zoom: a.zoom + (b.zoom - a.zoom) * p,
  foco: [a.foco[0] + (b.foco[0] - a.foco[0]) * p, a.foco[1] + (b.foco[1] - a.foco[1]) * p],
});

/**
 * Mapa de contorno genérico (sem marca): painel branco com ruas brancas de contorno preto.
 * O conteúdo (trechos coloridos, carros) vem em coordenadas do mapa. `grafo` 0 → 1 troca as ruas
 * por uma rede de pontos ligados. `dx` desloca o painel (entrada/saída pela esteira).
 */
export const Mapa: React.FC<{ cam: Cam; grafo?: number; dx?: number; children?: React.ReactNode }> = ({ cam, grafo = 0, dx = 0, children }) => {
  const c = limita(cam);
  const vw = MAPA.w / c.zoom;
  const vh = MAPA.h / c.zoom;
  const ruas = Object.values(RUAS);
  return (
    <div
      style={{
        position: 'absolute',
        left: MAPA.x - CONTORNO + dx,
        top: MAPA.y - CONTORNO,
        width: MAPA.w + 2 * CONTORNO,
        height: MAPA.h + 2 * CONTORNO,
        border: `${CONTORNO}px solid ${P}`,
        borderRadius: 36,
        boxShadow: SOMBRA,
        background: FUNDO_MAPA,
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      <svg width={MAPA.w} height={MAPA.h} viewBox={`${c.foco[0] - vw / 2} ${c.foco[1] - vh / 2} ${vw} ${vh}`} style={{ display: 'block' }}>
        <g opacity={1 - grafo} fill="none">
          {ruas.map((pts, i) => (
            <polyline key={`c${i}`} points={str(pts)} stroke={P} strokeWidth={54} />
          ))}
          {ruas.map((pts, i) => (
            <polyline key={`b${i}`} points={str(pts)} stroke={COR.branco} strokeWidth={40} />
          ))}
        </g>
        {grafo > 0.01 ? (
          <g opacity={grafo}>
            {ruas.map((pts, i) => (
              <polyline key={`g${i}`} points={str(pts)} fill="none" stroke={P} strokeWidth={8} />
            ))}
          </g>
        ) : null}
        {children}
        {grafo > 0.01
          ? NOS.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={20 * grafo} fill={COR.branco} stroke={P} strokeWidth={7} />
            ))
          : null}
      </svg>
    </div>
  );
};

/** Trecho de rua colorido (trânsito). `p` desenha do começo ao fim do trecho. */
export const Trecho: React.FC<{ pts: Pt[]; cor: string; p?: number; largura?: number }> = ({ pts, cor, p = 1, largura = 32 }) =>
  p > 0.001 ? (
    <polyline points={str(pts)} fill="none" stroke={cor} strokeWidth={largura} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${p} 2`} />
  ) : null;

/** Ponto e ângulo (graus) a uma distância d ao longo da polilinha (estende nas pontas). */
export const pontoEm = (pts: Pt[], d: number): [number, number, number] => {
  let resto = d;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[i + 1];
    const L = Math.hypot(x2 - x1, y2 - y1);
    const ultimo = i === pts.length - 2;
    if (resto <= L || ultimo || (i === 0 && resto < 0)) {
      const t = resto / L;
      return [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI];
    }
    resto -= L;
  }
  return [pts[0][0], pts[0][1], 0];
};

export const comprimento = (pts: Pt[]) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);

/** Cor do ponto do celular pela velocidade (fração da velocidade livre). */
export const corVelocidade = (r: number) => (r > 0.6 ? COR.verde : r > 0.3 ? LARANJA : COR.vermelho);

/**
 * Carro visto de cima (genérico), centro x,y, ângulo em graus. `celular` 0 → 1 mostra o celular
 * de quem está no carro, com o ponto na cor da velocidade.
 */
export const CarroTopo: React.FC<{ x: number; y: number; ang?: number; celular?: number; corPonto?: string; escala?: number }> = ({
  x, y, ang = 0, celular = 0, corPonto = COR.verde, escala = 1,
}) => (
  <g transform={`translate(${x} ${y})`}>
    <g transform={`rotate(${ang}) scale(${escala})`}>
      <rect x={-23} y={-12} width={46} height={24} rx={9} fill={COR.branco} stroke={P} strokeWidth={5} />
      <rect x={5} y={-7} width={9} height={14} rx={3} fill={P} />
      <rect x={-17} y={-6} width={6} height={12} rx={2} fill={P} />
    </g>
    {celular > 0.01 ? <IconeCelular x={0} y={-40} escala={celular} cor={corPonto} /> : null}
  </g>
);

/** Celular pequeno (ícone de mapa): retângulo de contorno com o ponto colorido. */
export const IconeCelular: React.FC<{ x: number; y: number; escala?: number; cor?: string }> = ({ x, y, escala = 1, cor = COR.verde }) => (
  <g transform={`translate(${x} ${y}) scale(${escala})`}>
    <rect x={-13} y={-20} width={26} height={40} rx={7} fill={COR.branco} stroke={P} strokeWidth={4} />
    <circle r={7} fill={cor} />
  </g>
);

// ---------- simulação simples de trânsito (fila de carros numa rua) ----------

export type Via = { id: string; pts: Pt[]; n: number; gap: number; v: number; d0: number; pre?: number };
type Estado = { d: number[]; v: number[] };
const CACHE = new Map<string, Estado[]>();
const DIST_MIN = 54;

/**
 * Posições dos carros de uma via no frame (calculadas passo a passo e guardadas).
 * `fator(d, f, i)` = fração da velocidade livre que o carro i quer andar naquele ponto/frame.
 * O carro de trás nunca encosta no da frente. `pre` frames simulados antes do frame 0.
 */
export const simula = (via: Via, frame: number, fator: (d: number, f: number, i: number) => number): Estado => {
  const pre = via.pre ?? 0;
  let hist = CACHE.get(via.id);
  if (!hist) {
    hist = [{ d: Array.from({ length: via.n }, (_, i) => via.d0 - i * via.gap), v: Array(via.n).fill(via.v) }];
    CACHE.set(via.id, hist);
  }
  const alvo = Math.max(0, Math.floor(frame) + pre);
  while (hist.length <= alvo) {
    const k = hist.length - 1;
    const a = hist[k];
    const d: number[] = [];
    const v: number[] = [];
    for (let i = 0; i < via.n; i++) {
      const quer = via.v * fator(a.d[i], k - pre, i);
      let vel = a.v[i] + (quer - a.v[i]) * 0.2;
      let nd = a.d[i] + vel;
      if (i > 0) nd = Math.min(nd, d[i - 1] - DIST_MIN);
      nd = Math.max(nd, a.d[i]);
      vel = nd - a.d[i];
      d.push(nd);
      v.push(vel);
    }
    hist.push({ d, v });
  }
  return hist[alvo];
};

/** Trecho da avenida (x inicial e final) ocupado pelos carros lentos (fração da velocidade livre < limite). */
export const trechoLento = (via: Via, estado: Estado, limite = 0.4): [number, number] | null => {
  const xs = estado.d.filter((d, i) => estado.v[i] / via.v < limite && d > 0).map((d) => pontoEm(via.pts, d)[0]);
  if (xs.length < 2) return null;
  return [Math.min(...xs) - 26, Math.max(...xs) + 26];
};

/** Desenha os carros de uma via (só os que estão no mapa). */
export const CarrosDaVia: React.FC<{ via: Via; estado: Estado; celular?: number; pular?: number[]; xMin?: number }> = ({ via, estado, celular = 0, pular = [], xMin = -999 }) => {
  const L = comprimento(via.pts);
  return (
    <>
      {estado.d.map((d, i) => {
        if (d < 10 || d > L - 10 || pular.includes(i)) return null;
        const [x, y, ang] = pontoEm(via.pts, d);
        if (x < xMin) return null;
        return <CarroTopo key={i} x={x} y={y} ang={ang} celular={celular} corPonto={corVelocidade(estado.v[i] / via.v)} />;
      })}
    </>
  );
};

// ---------- peças em HTML por cima do mapa ----------

/** Pino de mapa vermelho (ponta em x,y da tela), com rótulo opcional embaixo. */
export const Pino: React.FC<{ x: number; y: number; escala?: number; rotulo?: string; tam?: number }> = ({ x, y, escala = 1, rotulo, tam = 70 }) =>
  escala > 0.01 ? (
    <div style={{ position: 'absolute', left: x, top: y, transform: `scale(${escala})`, transformOrigin: '0 0' }}>
      <svg width={tam} height={tam * 1.3} viewBox="-35 -91 70 91" style={{ position: 'absolute', left: -tam / 2, top: -tam * 1.3, overflow: 'visible' }}>
        <path d="M0 0 C-8 -22 -30 -38 -30 -58 A30 30 0 1 1 30 -58 C30 -38 8 -22 0 0 Z" fill={COR.vermelho} stroke={P} strokeWidth={7} strokeLinejoin="round" />
        <circle cx={0} cy={-58} r={11} fill={COR.branco} stroke={P} strokeWidth={5} />
      </svg>
      {rotulo ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: -tam * 1.3 - 44,
            transform: 'translateX(-50%)',
            background: P,
            color: COR.branco,
            borderRadius: 999,
            padding: '4px 16px 2px',
            fontFamily: FONTE.rotulo,
            fontWeight: 900,
            fontSize: 26,
            letterSpacing: 2,
            whiteSpace: 'nowrap',
          }}
        >
          {rotulo}
        </div>
      ) : null}
    </div>
  ) : null;

/** Lupa (centro da lente em x,y). */
export const Lupa: React.FC<{ x: number; y: number; r?: number; escala?: number }> = ({ x, y, r = 72, escala = 1 }) =>
  escala > 0.01 ? (
    <svg width={r * 4} height={r * 4} viewBox={`${-r * 2} ${-r * 2} ${r * 4} ${r * 4}`} style={{ position: 'absolute', left: x - r * 2, top: y - r * 2, transform: `scale(${escala})`, overflow: 'visible' }}>
      <line x1={r * 0.7} y1={r * 0.7} x2={r * 1.55} y2={r * 1.55} stroke={P} strokeWidth={30} strokeLinecap="round" />
      <circle r={r} fill={COR.branco} fillOpacity={0.35} stroke={P} strokeWidth={14} />
    </svg>
  ) : null;

/** Cartão branco de contorno (centro x, topo). */
export const Cartao: React.FC<{ x: number; top: number; largura?: number; escala?: number; children: React.ReactNode; origem?: string }> = ({
  x, top, largura, escala = 1, children, origem = '50% 0',
}) =>
  escala > 0.01 ? (
    <div
      style={{
        position: 'absolute',
        left: x,
        top,
        width: largura,
        transform: `translateX(-50%) scale(${escala})`,
        transformOrigin: origem,
        background: COR.branco,
        border: `7px solid ${P}`,
        borderRadius: 22,
        boxShadow: `12px 12px 0 var(--sombra, ${P})`,
        padding: '14px 22px 10px',
        boxSizing: 'border-box',
        fontFamily: FONTE.rotulo,
        fontWeight: 900,
        color: P,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </div>
  ) : null;

/** Rótulo pequeno em caixa alta (dentro de cartões). */
export const Rotulo: React.FC<{ children: React.ReactNode; tam?: number }> = ({ children, tam = 24 }) => (
  <div style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: tam, letterSpacing: 2, lineHeight: 1.1 }}>{children}</div>
);

/** Número em azul (JetBrains Mono). */
export const Numero: React.FC<{ children: React.ReactNode; tam?: number; cor?: string }> = ({ children, tam = 48, cor = COR.azul }) => (
  <div style={{ fontFamily: FONTE.numero, fontWeight: 800, fontSize: tam, color: cor, lineHeight: 1.15 }}>{children}</div>
);

/** Ícone de pino pequeno (inline, para cartões). */
export const PinoMini: React.FC<{ tam?: number }> = ({ tam = 34 }) => (
  <svg width={tam} height={tam * 1.3} viewBox="-35 -91 70 91" style={{ display: 'block' }}>
    <path d="M0 0 C-8 -22 -30 -38 -30 -58 A30 30 0 1 1 30 -58 C30 -38 8 -22 0 0 Z" fill={COR.vermelho} stroke={P} strokeWidth={9} strokeLinejoin="round" />
    <circle cx={0} cy={-58} r={11} fill={COR.branco} stroke={P} strokeWidth={6} />
  </svg>
);

/** Bandeira quadriculada de chegada, em coordenadas do mapa (base do mastro em x,y). */
export const Bandeira: React.FC<{ x: number; y: number; escala?: number }> = ({ x, y, escala = 1 }) =>
  escala > 0.01 ? (
    <g transform={`translate(${x} ${y}) scale(${escala})`}>
      <line x1={0} y1={0} x2={0} y2={-80} stroke={P} strokeWidth={7} strokeLinecap="round" />
      <rect x={0} y={-80} width={54} height={36} fill={COR.branco} stroke={P} strokeWidth={5} />
      {[0, 1, 2].flatMap((c) => [0, 1].map((l) => ((c + l) % 2 === 0 ? <rect key={`${c}${l}`} x={c * 18} y={-80 + l * 18} width={18} height={18} fill={P} /> : null)))}
    </g>
  ) : null;
