import { interpolate, spring, Easing } from 'remotion';
import { FPS } from './theme';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/** Entrada com spring e leve overshoot (0 → 1, passa um pouco de 1). */
export const entra = (frame: number, inicio: number, rigidez = 170) =>
  spring({ frame: frame - inicio, fps: FPS, config: { damping: 14, stiffness: rigidez, mass: 0.8 } });

/** Entrada sem overshoot. */
export const suave = (frame: number, inicio: number, dur = 12) =>
  interpolate(frame, [inicio, inicio + dur], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

/** Tranco de máquina: desce rápido (3 f), sobe devagar (14 f). Retorna 0 → 1 → 0. */
export const tranco = (frame: number, t: number) =>
  interpolate(frame, [t, t + 3, t + 17], [0, 1, 0], clamp);

/** Faixa linear com clamp. */
export const lin = (frame: number, a: number, b: number, de = 0, ate = 1) =>
  interpolate(frame, [a, b], [de, ate], clamp);

/** Saída acelerada para a direita (transição de esteira, 8 frames). */
export const saidaDireita = (frame: number, fim: number, dur = 8) =>
  interpolate(frame, [fim - dur, fim], [0, 1400], { ...clamp, easing: Easing.in(Easing.quad) });

/** Saída para a direita sem ser a transição (objeto seguindo na esteira). */
export const segue = (frame: number, inicio: number, dur = 14, dist = 1200) =>
  interpolate(frame, [inicio, inicio + dur], [0, dist], { ...clamp, easing: Easing.in(Easing.cubic) });

/** Pop rápido de escala no instante t (1 → 1.15 → 1). */
export const pop = (frame: number, t: number, forca = 0.15) =>
  1 + forca * interpolate(frame, [t, t + 3, t + 10], [0, 1, 0], clamp);

/**
 * Posição x de um objeto que chega pela esteira (esquerda → alvo) e,
 * se `sai` for dado, segue para fora pela direita.
 */
export const naEsteira = (frame: number, chega: number, alvo: number, sai?: number, de = -700) => {
  const p = spring({ frame: frame - chega, fps: FPS, config: { damping: 18, stiffness: 90, mass: 0.9 } });
  const fora = sai === undefined ? 0 : interpolate(frame, [sai, sai + 16], [0, 1500], { ...clamp, easing: Easing.in(Easing.cubic) });
  return de + (alvo - de) * p + fora;
};

/** Transição suave entre dois valores a partir de `t` (spring sem overshoot). */
export const mola = (frame: number, t: number, de: number, para: number) =>
  de + (para - de) * spring({ frame: frame - t, fps: FPS, config: { damping: 20, stiffness: 110, mass: 0.9 } });
