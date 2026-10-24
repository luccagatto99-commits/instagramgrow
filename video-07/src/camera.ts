import * as THREE from 'three';
import { B, lerp, suave, clamp } from './tempo';
import { E } from './estado';

type V = [number, number, number];
type Chave = { t: number; pos: V; alvo: V; fov?: number; d?: number; deriva?: V };

const chaves = (): Chave[] => [
  // gancho: o poço inteiro, de frente e um pouco de lado
  { t: 0, pos: [3.4, 5.2, 13.6], alvo: [-0.25, 3.0, 0], fov: 44, deriva: [-0.04, 0, 0] },
  // 1854: a plataforma do Otis
  { t: E().otis + 0.5, pos: [2.4, 4.2, 11.2], alvo: [0, 2.55, 0], fov: 44, d: 0.9, deriva: [-0.04, 0, 0] },
  // hoje: motor, polia, cabine e contrapeso
  { t: B(2) - 0.2, pos: [3.2, 5.4, 13.6], alvo: [-0.25, 3.0, 0], fov: 44, d: 0.9, deriva: [-0.04, 0, 0] },
  // cabos e limitador: do outro lado (o limitador fica à esquerda)
  { t: B(4) - 0.2, pos: [-2.6, 5.0, 13.8], alvo: [-0.25, 2.85, 0], fov: 44, d: 1.6, deriva: [0.04, 0, 0] },
  // garras
  { t: B(5) - 0.1, pos: [2.0, 4.0, 13.8], alvo: [-0.25, 2.75, 0], fov: 44, d: 1.6, deriva: [-0.03, 0, 0] },
  // fechamento
  { t: B(6) + 0.1, pos: [3.2, 5.2, 13.6], alvo: [-0.25, 3.0, 0], fov: 44, d: 1.6, deriva: [-0.03, 0, 0] },
];

const LONGE = 1.15; // afasta todas as posições: o notebook inteiro cabe entre os cartões e a legenda
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
