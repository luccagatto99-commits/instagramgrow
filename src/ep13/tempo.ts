import timing from './timing.json';
import { FPS } from '../theme';
import type { PalavraTempo } from '../components';

export const PALAVRAS = timing.palavras as PalavraTempo[];
export const BLOCOS = timing.blocos as { s: number; e: number }[];

export const DUR_NARRACAO = 80.002; // ffprobe public/narracao-13.mp3
export const DUR_TOTAL = Math.ceil((DUR_NARRACAO + 1.5) * FPS);

const f = (s: number) => Math.round(s * FPS);
const norm = (t: string) =>
  t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');

/** Frame absoluto em que cada bloco começa (6 frames antes da fala, dentro da pausa). */
export const inicioBloco = (b: number) => (b === 0 ? 0 : f(BLOCOS[b].s) - 6);
export const fimBloco = (b: number) => (b === BLOCOS.length - 1 ? DUR_TOTAL : inicioBloco(b + 1));
export const durBloco = (b: number) => fimBloco(b) - inicioBloco(b);

/**
 * Frame (relativo ao início do bloco) em que a palavra começa a ser falada.
 * `n` = ocorrência dentro do bloco (0 = primeira). Falha alto se não achar.
 */
export const palavra = (b: number, alvo: string, n = 0, fim = false): number => {
  const ws = PALAVRAS.filter((w) => w.b === b && norm(w.t) === norm(alvo));
  const w = ws[n];
  if (!w) throw new Error(`palavra "${alvo}" (#${n}) não encontrada no bloco ${b + 1}`);
  return f(fim ? w.e : w.s) - inicioBloco(b);
};
