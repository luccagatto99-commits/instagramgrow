import * as THREE from 'three';
import { B, T, lerp, suave, clamp } from './tempo';
import { CARRETEL, DET, FATIA } from './estado';

type V = [number, number, number];
type Chave = { t: number; pos: V; alvo: V; fov?: number; d?: number; deriva?: V };

const chaves = (): Chave[] => [
  // gancho: a impressora inteira, de 3/4
  { t: 0, pos: [2.6, 2.2, 7.6], alvo: [0, 1.3, 0], deriva: [-0.25, 0, -0.1] },
  // o cubo no "computador", sendo fatiado
  { t: B(1) + 0.4, pos: [1.0, 2.0, 5.6], alvo: [FATIA.x, FATIA.y, FATIA.z], d: 1.6, deriva: [0.06, 0, 0] },
  // o carretel
  { t: T(2, 'carretel') - 0.1, pos: [1.9, 3.2, 3.4], alvo: [CARRETEL.x, CARRETEL.y - 0.2, CARRETEL.z], d: 1.5, deriva: [-0.08, 0, 0] },
  // engrenagens (estação de detalhe)
  { t: T(3, 'motor') + 0.1, pos: [DET.x - 1.7, 2.55, DET.z + 2.3], alvo: [DET.x, 2.28, DET.z], d: 1.6, deriva: [0.02, 0, 0] },
  // desce acompanhando o tubo até o bico
  { t: T(3, 'tubo') + 0.4, pos: [DET.x - 1.6, 1.7, DET.z + 2.4], alvo: [DET.x, 1.55, DET.z], d: 1.4 },
  { t: T(4, 'bico') + 0.1, pos: [DET.x - 1.5, 1.2, DET.z + 2.2], alvo: [DET.x, 0.9, DET.z], d: 1.2, deriva: [0.02, 0, 0] },
  // a impressora desenhando a primeira camada
  { t: B(5) + 0.7, pos: [1.7, 1.65, 3.9], alvo: [0, 0.6, 0.2], d: 1.6, deriva: [-0.05, 0, 0] },
  { t: T(5, 'ventilador') - 0.1, pos: [1.0, 1.0, 2.2], alvo: [0.1, 0.55, 0.1], d: 1.1 },
  // camada por camada
  { t: T(6, 'sobe') + 0.2, pos: [2.2, 1.6, 3.9], alvo: [0, 0.75, 0], d: 1.2, deriva: [-0.12, 0.02, 0] },
  // a peça aberta ao meio
  { t: T(7, 'maciça') + 0.5, pos: [-1.3, 3.2, 3.9], alvo: [0, 1.3, 1.0], d: 1.4, deriva: [0.02, 0, 0] },
  // fechamento
  { t: B(8) + 0.6, pos: [2.4, 2.1, 9.6], alvo: [0, 1.55, 0], d: 1.6, deriva: [-0.12, 0, -0.06] },
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
