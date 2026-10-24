import * as THREE from 'three';
import { B, T, lerp, suave, clamp } from './tempo';
import { E, carro } from './estado';

type V = [number, number, number];
type Chave = { t: number; pos: V; alvo: V; fov?: number; d?: number; deriva?: V };

const chaves = (): Chave[] => [
  // depois do corte: o volante grande de frente, girando
  { t: 0, pos: [0.0, 2.45, 10.4], alvo: [0, 2.15, 0], deriva: [0.0, 0, -0.12] },
  // vista explodida: de lado e um pouco de cima, para ver a tampa, a bolsa e a cápsula saindo
  { t: T(1, 'tampa') - 0.3, pos: [4.3, 3.9, 7.4], alvo: [0, 2.75, 0.4], d: 1.6, deriva: [-0.04, 0, -0.06] },
  // o sensor e o fio: volante e central no mesmo quadro
  { t: B(2) + 0.6, pos: [4.6, 2.4, 6.4], alvo: [0, 1.15, 0.0], d: 1.6, deriva: [-0.04, 0, -0.06] },
  { t: T(2, 'buraco') - 0.3, pos: [3.0, 1.6, 4.0], alvo: [0, 0.55, 0.3], d: 1.2, deriva: [-0.02, 0, -0.04] },
  { t: T(2, 'sinal') - 0.3, pos: [4.8, 1.9, 4.6], alvo: [0, 1.15, -0.5], d: 1.2, deriva: [-0.03, 0, -0.04] },
  // dentro da cápsula, de frente
  { t: B(3) + 0.3, pos: [0.6, 2.7, 2.5], alvo: [0, 2.2, -0.13], d: 1.4, deriva: [-0.01, 0, -0.03] },
  // a bolsa rasga a tampa e enche
  { t: T(4, 'rasga') - 0.4, pos: [4.2, 3.0, 6.2], alvo: [0, 2.15, 0.7], d: 1.0, deriva: [-0.03, 0, -0.05] },
  // de lado: os furos e a cabeça
  { t: B(5) + 0.3, pos: [9.4, 2.9, 1.25], alvo: [0, 2.1, 1.2], fov: 42, d: 1.6, deriva: [-0.04, 0, -0.02] },
  // o pó
  { t: B(6) + 0.1, pos: [3.6, 2.9, 6.6], alvo: [0, 2.0, 0.9], d: 1.5, deriva: [-0.03, 0, -0.06] },
  // fechamento
  { t: B(7) + 0.2, pos: [0.4, 2.6, 11.5], alvo: [0, 2.0, 0], d: 1.6, deriva: [0, 0, -0.1] },
];

/** câmera do gancho: acompanha o carro de lado; depois da batida chega perto da janela e entra no volante */
const cameraCarro = (t: number): Cam => {
  const e = E();
  const c = carro(t);
  const segue: Cam = { pos: [c.x + 0.3, 1.9, 12.5], alvo: [c.x + 0.5, 0.9, 0], fov: 44 };
  const perto: Cam = { pos: [0.6, 1.5, 6.4], alvo: [0.4, 1.0, 0], fov: 42 };
  const dentro: Cam = { pos: [0.1, 1.3, 4.0], alvo: [0.0, 1.1, 0.38], fov: 40 };
  const u1 = suave(clamp((t - (e.batidaCarro + 0.15)) / 1.0));
  const u2 = suave(clamp((t - T(0, 'Em')) / (e.corteCarro - T(0, 'Em'))));
  const mix = (a: Cam, b: Cam, u: number): Cam => ({
    pos: [lerp(a.pos[0], b.pos[0], u), lerp(a.pos[1], b.pos[1], u), lerp(a.pos[2], b.pos[2], u)],
    alvo: [lerp(a.alvo[0], b.alvo[0], u), lerp(a.alvo[1], b.alvo[1], u), lerp(a.alvo[2], b.alvo[2], u)],
    fov: lerp(a.fov, b.fov, u),
  });
  // tremida curta na batida
  const k = Math.max(0, 1 - (t - e.batidaCarro) / 0.5) * (t > e.batidaCarro ? 1 : 0);
  const r = mix(mix(segue, perto, u1), dentro, u2);
  r.pos = [r.pos[0] + Math.sin(t * 70) * 0.06 * k, r.pos[1] + Math.cos(t * 63) * 0.05 * k, r.pos[2]];
  return r;
};

let cache: Chave[] | null = null;
const em = (k: Chave, t: number, limite: number) => {
  const dt = Math.max(0, Math.min(t, limite) - k.t);
  const dv = k.deriva ?? [0, 0, 0];
  return { pos: [k.pos[0] + dv[0] * dt, k.pos[1] + dv[1] * dt, k.pos[2] + dv[2] * dt] as V, alvo: k.alvo, fov: k.fov ?? 36 };
};

export type Cam = { pos: V; alvo: V; fov: number };

export const camera = (t: number): Cam => {
  if (t < E().corteCarro) return cameraCarro(t);
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
