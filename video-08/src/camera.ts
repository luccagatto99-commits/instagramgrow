import * as THREE from 'three';
import { B, lerp, suave, clamp } from './tempo';
import { E } from './estado';

type V = [number, number, number];
type Chave = { t: number; pos: V; alvo: V; fov?: number; d?: number; deriva?: V };

const chaves = (): Chave[] => {
  const e = E();
  return [
    // gancho: a fechadura inteira, de três quartos; a chave do vizinho entra e trava
    { t: 0, pos: [3.0, 2.2, 9.6], alvo: [-0.7, 0.5, 0], fov: 40, deriva: [-0.05, 0, 0] },
    // aberta ao meio: de frente
    { t: e.abre + 0.4, pos: [0.9, 1.5, 11.0], alvo: [-0.15, 0.55, 0], fov: 40, d: 1.2, deriva: [-0.03, 0, 0] },
    // furos, mola e pinos: perto da coluna do meio
    { t: e.furos + 0.2, pos: [0.7, 1.7, 6.6], alvo: [-0.1, 0.9, 0], fov: 40, d: 1.2, deriva: [-0.04, 0, 0] },
    // a chave entra: de frente, um pouco de cima
    { t: e.chave - 0.2, pos: [0.4, 1.9, 10.2], alvo: [-0.5, 0.4, 0], fov: 40, d: 1.0, deriva: [0.03, 0, 0] },
    // linha de corte: perto
    { t: e.emenda + 0.2, pos: [0.5, 1.3, 6.4], alvo: [0.0, 0.62, 0], fov: 40, d: 1.0, deriva: [-0.04, 0, 0] },
    // gira + came e lingueta: de lado, por trás
    { t: e.gira - 0.3, pos: [6.6, 1.6, 6.8], alvo: [0.6, -0.1, 0], fov: 40, d: 1.1, deriva: [-0.05, 0, 0] },
    // chave errada: de frente
    { t: B(5) - 0.5, pos: [0.3, 1.6, 8.6], alvo: [-0.4, 0.55, 0], fov: 40, d: 1.1, deriva: [0.03, 0, 0] },
    // às vezes abre: três quartos
    { t: B(6) - 0.1, pos: [3.4, 2.0, 9.8], alvo: [-0.6, 0.4, 0], fov: 40, d: 1.1, deriva: [-0.04, 0, 0] },
    // fechamento
    { t: e.fim + 0.3, pos: [-2.6, 2.4, 10.4], alvo: [-0.4, 0.5, 0], fov: 40, d: 1.6, deriva: [0.04, 0, 0] },
  ];
};

const LONGE = 1.55; // afasta todas as posições: a fechadura inteira (com a chave) cabe na largura
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
