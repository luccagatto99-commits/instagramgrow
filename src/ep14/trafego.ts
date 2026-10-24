import { interpolate } from 'remotion';
import { RUAS, dAv, simula, type Via } from './comum';
import { inicioBloco, palavra } from './tempo';

const V = 5; // velocidade livre (px do mapa por frame)
const lento = (d: number, de: number, ate: number, forca: number) => {
  // rampa de 30 px na entrada do trecho lento; depois dele, volta ao normal
  const dentro = interpolate(d, [de - 30, de, ate - 10, ate], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return 1 - forca * dentro;
};
const ruasLivres = (pre: string, n = 1): Record<'r1' | 'r2' | 'v1' | 'v2' | 'v3', Via> => ({
  r1: { id: `${pre}-r1`, pts: RUAS.r1, n: 30, gap: 150 * n, v: V, d0: 860, pre: 120 },
  r2: { id: `${pre}-r2`, pts: RUAS.r2, n: 30, gap: 170 * n, v: V, d0: 800, pre: 120 },
  v1: { id: `${pre}-v1`, pts: RUAS.v1, n: 25, gap: 190 * n, v: V, d0: 640, pre: 120 },
  v2: { id: `${pre}-v2`, pts: RUAS.v2, n: 25, gap: 230 * n, v: V, d0: 600, pre: 120 },
  v3: { id: `${pre}-v3`, pts: RUAS.v3, n: 25, gap: 200 * n, v: V, d0: 700, pre: 120 },
});
export const livre = () => 1;

// ---------- gancho e sensor (blocos 1 e 2): engarrafamento já formado no meio da avenida ----------
export const JAM_G: [number, number] = [dAv(250), dAv(570)];
export const GANCHO = {
  av: { id: 'g-av', pts: RUAS.av, n: 24, gap: 250, v: V, d0: 900, pre: 150 } as Via,
  ...ruasLivres('g'),
};
export const fatorGanchoAv = (d: number) => lento(d, JAM_G[0], JAM_G[1], 0.82);
/** Frame absoluto (do vídeo) para a simulação do gancho. */
export const absGancho = (b: 0 | 1, frame: number) => inicioBloco(b) + frame;

// ---------- ao vivo (blocos 3 e 4): a avenida começa livre, engarrafa em "devagar" e o engarrafamento muda de lugar em "mudou" ----------
export const AO_VIVO = {
  av: { id: 'v-av', pts: RUAS.av, n: 22, gap: 250, v: V, d0: 830 } as Via,
  ...ruasLivres('v'),
};
const absDe = (b: number, f: number) => inicioBloco(b) + f;
/** Trecho engarrafado [de, ate] (distâncias na avenida) e intensidade no frame absoluto. */
export const jamAoVivo = (fAbs: number): { de: number; ate: number; forca: number } => {
  const tDevagar = absDe(2, palavra(2, 'devagar'));
  const tMudou = absDe(3, palavra(3, 'mudou')) - 6;
  const forca = interpolate(fAbs, [tDevagar - 6, tDevagar + 20], [0, 0.82], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const p = interpolate(fAbs, [tMudou, tMudou + 24], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return { de: dAv(250) + (dAv(470) - dAv(250)) * p, ate: dAv(570) + (dAv(800) - dAv(570)) * p, forca };
};
export const fatorAoVivoAv = (d: number, f: number) => {
  const j = jamAoVivo(f + inicioBloco(2));
  return lento(d, j.de, j.ate, j.forca);
};
/** A simulação ao vivo começa no início do bloco 3. */
export const absAoVivo = (b: 2 | 3, frame: number) => inicioBloco(b) + frame - inicioBloco(2);

let SEGUIDO: number | null = null;
/** Carro da avenida que a câmera acompanha no bloco 2 (o mais perto do meio do engarrafamento). */
export const carroSeguido = (): number => {
  if (SEGUIDO === null) {
    const e = simula(GANCHO.av, inicioBloco(1), fatorGanchoAv);
    let melhor = 0;
    e.d.forEach((d, i) => {
      if (Math.abs(d - dAv(390)) < Math.abs(e.d[melhor] - dAv(390))) melhor = i;
    });
    SEGUIDO = melhor;
  }
  return SEGUIDO;
};
/** x (mapa) do carro seguido no frame absoluto. */
export const xSeguido = (fAbs: number) => simula(GANCHO.av, fAbs, fatorGanchoAv).d[carroSeguido()] - 80;
