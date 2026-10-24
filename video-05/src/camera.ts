import * as THREE from 'three';
import { B, T, lerp, suave, clamp } from './tempo';

type V = [number, number, number];
type Chave = { t: number; pos: V; alvo: V; fov?: number; d?: number; deriva?: V };

const chaves = (): Chave[] => [
  // de cima e da frente: dá para ver a boca, a água girando e o batedor, com a máquina inteira no quadro
  { t: 0, pos: [2.4, 6.2, 7.0], alvo: [0, 1.75, 0], fov: 44, deriva: [-0.03, 0, -0.03] },
  // a tampa abre e a roupa cai: mais de cima
  { t: B(1) - 0.2, pos: [1.8, 6.6, 6.6], alvo: [0, 2.0, 0], fov: 44, d: 1.6, deriva: [-0.02, 0, -0.02] },
  // válvula e sabão atrás, tubinho do lado
  { t: B(2) + 0.2, pos: [-3.4, 6.0, 6.0], alvo: [0, 1.9, -0.2], fov: 44, d: 1.6, deriva: [0.03, 0, -0.03] },
  // motor embaixo: um pouco mais baixo e de lado
  { t: B(3) - 0.2, pos: [5.4, 2.6, 6.2], alvo: [0, 1.3, 0], fov: 44, d: 1.6, deriva: [-0.03, 0, -0.03] },
  // batedor e roupa: de cima de novo
  { t: T(3, 'batedor') + 0.2, pos: [2.0, 6.4, 6.2], alvo: [0, 1.6, 0], fov: 44, d: 1.4, deriva: [-0.02, 0, -0.02] },
  // bomba: de lado e baixo
  { t: B(4) + 0.2, pos: [-4.8, 2.4, 6.6], alvo: [0, 1.2, 0.2], fov: 44, d: 1.4, deriva: [0.03, 0, -0.03] },
  // centrifugação: de cima
  { t: T(4, 'gira') - 0.3, pos: [2.0, 6.4, 6.4], alvo: [0, 1.6, 0], fov: 44, d: 1.3, deriva: [-0.02, 0, -0.02] },
  // anel e desequilíbrio: mais aberto para ver a máquina andar
  { t: B(5) + 0.2, pos: [3.2, 6.0, 8.6], alvo: [0.2, 1.6, 0], fov: 44, d: 1.6, deriva: [-0.03, 0, -0.03] },
  // varetas: de lado
  { t: T(5, 'varetas') - 0.3, pos: [5.6, 3.6, 6.4], alvo: [0.2, 1.6, 0], fov: 44, d: 1.0, deriva: [-0.03, 0, -0.03] },
  // fechamento
  { t: B(6) + 0.2, pos: [2.4, 6.2, 7.0], alvo: [0, 1.75, 0], fov: 44, d: 1.6, deriva: [-0.03, 0, -0.03] },
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
