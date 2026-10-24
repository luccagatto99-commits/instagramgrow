import * as THREE from 'three';
import { B, T, lerp, suave, clamp } from './tempo';

type V = [number, number, number];
type Chave = { t: number; pos: V; alvo: V; fov?: number; d?: number; deriva?: V };

const chaves = (): Chave[] => [
  // gancho: o caminhão chega de perfil e para no meio
  { t: 0, pos: [1.6, 3.6, 29], alvo: [0.6, 1.9, 0], deriva: [-0.12, -0.05, -0.5] },
  // as três partes
  { t: B(1) - 0.1, pos: [0.7, 3.1, 24.5], alvo: [0.25, 1.95, 0], d: 1.5, deriva: [0.03, 0, -0.1] },
  // o coletor joga os sacos na boca
  { t: T(2, 'O') - 0.2, pos: [5.6, 2.6, 14.5], alvo: [4.5, 1.15, 0], d: 1.7, deriva: [-0.05, 0, -0.06] },
  // botão
  { t: T(2, 'Quando') + 0.3, pos: [5.1, 2.5, 12.8], alvo: [4.3, 1.2, 0.5], d: 1.2, deriva: [0.0, 0, -0.04] },
  // o ciclo, de perto, pela parede cortada
  { t: B(3) + 0.1, pos: [3.7, 2.6, 11.6], alvo: [3.3, 1.75, 0], d: 1.4, deriva: [0.02, 0, -0.04] },
  // o óleo: o caminhão inteiro, do motor até a tampa
  { t: B(4) + 0.2, pos: [0.0, 4.4, 30], alvo: [0.4, 1.65, 0], d: 1.6, deriva: [0.04, 0, -0.08] },
  { t: T(4, 'pistões') - 0.1, pos: [3.8, 2.6, 11.8], alvo: [3.3, 1.75, 0], d: 1.4, deriva: [-0.02, 0, -0.04] },
  // a placa ejetora
  { t: B(5) + 0.1, pos: [1.4, 3.0, 23], alvo: [1.35, 2.0, 0], d: 1.6, deriva: [-0.03, 0, -0.06] },
  // chorume
  { t: B(6) + 0.2, pos: [3.9, 2.6, 13.5], alvo: [3.15, 1.75, 0], d: 1.5, deriva: [0.02, 0, -0.03] },
  // aterro: a tampa levanta e a placa empurra tudo
  { t: B(7) + 0.1, pos: [1.3, 3.8, 32.5], alvo: [0.95, 2.1, 0], d: 1.6, deriva: [-0.04, 0, -0.06] },
  // fechamento
  { t: B(8) + 0.4, pos: [0.7, 3.4, 33.5], alvo: [0.3, 2.0, 0], d: 1.6, deriva: [-0.05, 0, -0.08] },
];

let cache: Chave[] | null = null;
const em = (k: Chave, t: number, limite: number) => {
  const dt = Math.max(0, Math.min(t, limite) - k.t);
  const dv = k.deriva ?? [0, 0, 0];
  return { pos: [k.pos[0] + dv[0] * dt, k.pos[1] + dv[1] * dt, k.pos[2] + dv[2] * dt] as V, alvo: k.alvo, fov: k.fov ?? 36 };
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
