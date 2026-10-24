import * as THREE from 'three';
import { B, lerp, suave, clamp } from './tempo';
import { E } from './estado';

type V = [number, number, number];
type Chave = { t: number; pos: V; alvo: V; fov?: number; d?: number; deriva?: V };

const chaves = (): Chave[] => [
  // gancho: de frente e de cima, o notebook gira inteiro no quadro
  { t: 0, pos: [0, 6.07, 9.19], alvo: [0, 0.9, 0.55], fov: 44, deriva: [0.03, 0, 0] },
  // a tecla O e a grade do teclado: do lado direito, de cima
  { t: B(1) - 0.1, pos: [2.1, 7.76, 8.28], alvo: [0.3, 0.8, 0.6], fov: 44, d: 1.6, deriva: [-0.03, 0, 0] },
  // chip do teclado e os pulsos até o processador: do lado esquerdo
  { t: E().chipzinho + 0.2, pos: [-1.86, 8.0, 7.82], alvo: [-0.3, 0.8, 0.5], fov: 44, d: 1.4, deriva: [0.03, 0, 0] },
  // processador
  { t: B(3) - 0.1, pos: [0.72, 8.24, 7.36], alvo: [0, 0.8, 0.4], fov: 44, d: 1.5, deriva: [-0.025, 0, 0] },
  // memória e o WhatsApp: do lado direito
  { t: B(4) - 0.1, pos: [2.12, 7.99, 7.6], alvo: [0.2, 0.85, 0.4], fov: 44, d: 1.4, deriva: [-0.03, 0, 0] },
  // chip de vídeo: do lado esquerdo
  { t: B(5) - 0.1, pos: [-2.12, 7.99, 7.6], alvo: [-0.2, 0.85, 0.4], fov: 44, d: 1.5, deriva: [0.03, 0, 0] },
  // a tela: de frente
  { t: B(6) - 0.1, pos: [0.4, 4.4, 8.6], alvo: [0, 0.75, 0.3], fov: 44, d: 1.6, deriva: [-0.03, 0, 0] },
  // tudo de novo para o i: aberto para ver a viagem inteira
  { t: E().denovo + 0.1, pos: [0, 6.07, 9.19], alvo: [0, 0.9, 0.55], fov: 44, d: 1.0 },
];

const LONGE = 1.13; // afasta todas as posições: o notebook inteiro cabe entre os cartões e a legenda
let cache: Chave[] | null = null;
const em = (k: Chave, t: number, limite: number) => {
  const dt = Math.max(0, Math.min(t, limite) - k.t);
  const dv = k.deriva ?? [0, 0, 0];
  const p = (i: number) => k.alvo[i] + (k.pos[i] + dv[i] * dt - k.alvo[i]) * LONGE;
  return { pos: [p(0), p(1), p(2)] as V, alvo: k.alvo, fov: k.fov ?? 36 };
};

export type Cam = { pos: V; alvo: V; fov: number };

export const camera = (t: number): Cam => {
  const ks = (cache ??= chaves());
  let i = 0;
  while (i + 1 < ks.length && ks[i + 1].t - (ks[i + 1].d ?? 1.2) <= t) i++;
  const k = ks[i];
  if (t >= k.t || i === 0) return em(k, t, Infinity);
  const ant = ks[i - 1];
  const d = k.d ?? 1.2;
  const u = suave(clamp((t - (k.t - d)) / d));
  const a = em(ant, t, k.t - d);
  const b = em(k, k.t, k.t);
  const mix = (p: V, q: V): V => [lerp(p[0], q[0], u), lerp(p[1], q[1], u), lerp(p[2], q[2], u)];
  return { pos: mix(a.pos, b.pos), alvo: mix(a.alvo, b.alvo), fov: lerp(a.fov, b.fov, u) };
};

const camProj = new THREE.PerspectiveCamera(36, 1080 / 1920, 0.05, 100);
const v = new THREE.Vector3();
export const projetar = (c: Cam, p: V) => {
  camProj.fov = c.fov;
  camProj.updateProjectionMatrix();
  camProj.position.set(...c.pos);
  camProj.lookAt(...c.alvo);
  camProj.updateMatrixWorld();
  v.set(...p).project(camProj);
  return { x: ((v.x + 1) / 2) * 1080, y: ((1 - v.y) / 2) * 1920, frente: v.z < 1 };
};
