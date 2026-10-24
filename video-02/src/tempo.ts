import timing from './timing.json';

export type Palavra = { t: string; b: number; s: number; e: number };
export const PALAVRAS = timing.palavras as Palavra[];
export const BLOCOS = timing.blocos as { s: number; e: number }[];

export const FPS = 30;
export const DURACAO = BLOCOS[BLOCOS.length - 1].e + 1.8;

// mantém os acentos: "é" e "e" são palavras diferentes
const norm = (s: string) => s.normalize('NFC').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');

/** Início (s) da n-ésima ocorrência de `palavra` no bloco `b`. */
export const T = (b: number, palavra: string, n = 0): number => {
  const alvo = norm(palavra);
  const ws = PALAVRAS.filter((w) => w.b === b && norm(w.t) === alvo);
  if (!ws[n]) throw new Error(`palavra não encontrada: ${b} ${palavra}`);
  return ws[n].s;
};
export const B = (b: number) => BLOCOS[b].s;
export const BE = (b: number) => BLOCOS[b].e;

// ---- animação ----
export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
export const suave = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
export const saida = (u: number) => 1 - Math.pow(1 - u, 3);
export const entrada = (u: number) => u * u * u;
/** volta leve: passa um pouco do alvo e assenta (mola suave) */
export const volta = (u: number) => {
  const c = 1.2;
  return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2);
};

/** progresso 0..1 entre a e a+d, com curva */
export const prog = (t: number, a: number, d: number, curva = suave) => curva(clamp((t - a) / d));
/** visível entre a e b, com rampas de entrada/saída */
export const janela = (t: number, a: number, b: number, fi = 0.3, fo = 0.3) =>
  Math.min(prog(t, a, fi, saida), 1 - prog(t, b - fo, fo, entrada));

/** pseudo-aleatório com semente fixa */
export const aleatorio = (semente: number) => {
  let s = semente >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
};
