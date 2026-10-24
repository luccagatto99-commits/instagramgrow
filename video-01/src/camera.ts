import * as THREE from 'three';
import { B, T, lerp, suave, clamp } from './tempo';
import { DETALHE, SENSOR, X_TV, X_CEL } from './estado';

type V = [number, number, number];
type Chave = { t: number; pos: V; alvo: V; fov?: number; d?: number; deriva?: V };

const chaves = (): Chave[] => [
  // gancho: controle inteiro girando, de frente
  { t: 0, pos: [0, 1.75, 7.4], alvo: [0, 1.45, 0], deriva: [0.1, 0, -0.12] },
  // as quatro camadas: vista de 3/4, como na parede
  { t: B(1) + 0.3, pos: [7.4, 3.1, 5.6], alvo: [0, 1.38, -0.15], d: 1.9, deriva: [-0.1, 0, 0.08] },
  // o botão VOL+ de perto (de lado, para ver o carbono descer até as trilhas)
  // detalhe de um botão cortado ao meio (visto pelo lado do corte)
  { t: T(2, 'pontinho') + 0.1, pos: [DETALHE.x - 2.9, 2.1, DETALHE.z + 3.6], alvo: [DETALHE.x - 0.1, 0.62, DETALHE.z], d: 1.4, deriva: [0.03, -0.01, -0.04] },
  // a placa inteira com o chip
  { t: T(3, 'chip') + 0.1, pos: [0.75, 1.0, 1.55], alvo: [0, 0.55, 0.02], d: 1.3, deriva: [-0.06, 0.2, 0.34] },
  // o LED na ponta
  { t: T(4, 'LED') - 0.1, pos: [1.0, 3.05, 1.5], alvo: [0, 2.5, 0], d: 1.3, deriva: [0.02, 0, 0.05] },
  // controle fechado, deitado, piscando para a direita
  { t: T(4, 'Ele') + 0.6, pos: [1.1, 2.1, 7.2], alvo: [1.4, 1.2, 0], d: 1.5, deriva: [0.14, 0, -0.05] },
  // a TV
  { t: B(5) + 0.3, pos: [X_TV - 2.9, 1.75, 3.4], alvo: [X_TV - 0.1, 1.3, 0.2], d: 1.5, deriva: [0.05, 0, -0.05] },
  // de perto, a janelinha e o sensor
  { t: T(5, 'sensor') + 0.2, pos: [SENSOR.x - 1.25, 0.95, SENSOR.z + 0.95], alvo: [SENSOR.x + 0.02, SENSOR.y, SENSOR.z], d: 1.2, deriva: [0, 0, 0.03] },
  // abre para mostrar o sol
  { t: T(5, 'sol') - 0.1, pos: [X_TV - 2.6, 1.8, 3.4], alvo: [X_TV - 0.4, 1.35, 0.6], d: 1.0, deriva: [0, 0, 0] },
  // o volume subindo na tela
  { t: T(5, 'aumenta') - 0.3, pos: [X_TV - 3.0, 1.55, 2.4], alvo: [X_TV - 0.05, 1.35, 0.1], d: 1.1, deriva: [0.05, 0, 0] },
  // o celular filmando o controle
  { t: T(6, 'Aponte') + 0.1, pos: [X_CEL + 2.7, 1.95, 3.3], alvo: [X_CEL - 0.7, 1.3, 0], d: 1.6, deriva: [0.03, 0, -0.04] },
  // fechamento: o controle de pé de novo
  { t: B(7) + 0.7, pos: [0, 2.0, 10], alvo: [0, 1.75, 0], d: 1.6, deriva: [0, 0, -0.08] },
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
