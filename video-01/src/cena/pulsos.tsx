// Rajadas de luz infravermelha (o que se move: laranja). O mesmo código serve para o LED piscar
// e para os pulsos que viajam até a TV ou até o celular.
import { useMemo } from 'react';
import * as THREE from 'three';
import { COR, Estado, SENSOR, X_CEL } from '../estado';
import { clamp } from '../tempo';
import { brilho } from './base';

const CODIGO = [1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1];
const LONGA = 0.12, CURTA = 0.04, PAUSA = 0.08, ENTRE = 0.4; // segundos
const V = 3.0; // velocidade (unidades/s)
export const ORIGEM: [number, number, number] = [1.2, 1.22, 0.06]; // ponta do LED com o controle deitado

type Rajada = { t0: number; t1: number };
const agenda = (a: number, b: number) => {
  const out: Rajada[] = [];
  let t = a;
  while (t < b) {
    for (const bit of CODIGO) {
      const d = bit ? LONGA : CURTA;
      if (t + d > b) break;
      out.push({ t0: t, t1: t + d });
      t += d + PAUSA;
    }
    t += ENTRE;
  }
  return out;
};
let cacheTV: Rajada[] | null = null, cacheCel: Rajada[] | null = null;
const rajadasTV = (e: Estado) => (cacheTV ??= agenda(e.pulsosTV.a, e.pulsosTV.b));
const rajadasCel = (e: Estado) => (cacheCel ??= agenda(e.pulsosCel.a, e.pulsosCel.b));

/** o LED está aceso agora? */
export const acesoLED = (e: Estado) =>
  [...rajadasTV(e), ...rajadasCel(e)].some((r) => e.t >= r.t0 && e.t < r.t1);

export const ALVO_TV: [number, number, number] = [SENSOR.x, SENSOR.y, SENSOR.z];
export const ALVO_CEL: [number, number, number] = [X_CEL - 0.13, 1.91, 0.24]; // câmera traseira do celular
const distancia = (a: [number, number, number]) => Math.hypot(a[0] - ORIGEM[0], a[1] - ORIGEM[1], a[2] - ORIGEM[2]);

/** alguma rajada está chegando no alvo agora? (para acender o sensor / a tela do celular) */
export const chegando = (e: Estado, qual: 'tv' | 'cel') => {
  const dt = distancia(qual === 'tv' ? ALVO_TV : ALVO_CEL) / V;
  return (qual === 'tv' ? rajadasTV(e) : rajadasCel(e)).some((r) => e.t >= r.t0 + dt && e.t < r.t1 + dt);
};

const Feixe: React.FC<{ rajadas: Rajada[]; t: number; alvo: [number, number, number] }> = ({ rajadas, t, alvo }) => {
  const mat = useMemo(() => brilho(COR.move, 2.6), []);
  const geo = useMemo(() => new THREE.CapsuleGeometry(0.03, 1, 4, 10).rotateZ(Math.PI / 2), []);
  // direção da ponta do LED até o alvo (sobe/desce de leve até a altura do sensor)
  const dir = new THREE.Vector3(alvo[0] - ORIGEM[0], alvo[1] - ORIGEM[1], alvo[2] - ORIGEM[2]);
  const comp = dir.length();
  dir.normalize();
  const rot = new THREE.Euler(0, Math.atan2(-dir.z, dir.x), Math.asin(dir.y));
  return (
    <>
      {rajadas.map((r, i) => {
        const frente = clamp((t - r.t0) * V, 0, comp);
        const tras = clamp((t - r.t1) * V, 0, comp);
        if (frente <= 0.001 || tras >= comp - 0.001) return null;
        const len = Math.max(0.02, frente - tras);
        const meio = (frente + tras) / 2;
        const p = [ORIGEM[0] + dir.x * meio, ORIGEM[1] + dir.y * meio, ORIGEM[2] + dir.z * meio];
        return (
          <mesh key={i} geometry={geo} material={mat} position={p as [number, number, number]} rotation={rot} scale={[len, 1, 1]} />
        );
      })}
    </>
  );
};

export const Pulsos: React.FC<{ e: Estado }> = ({ e }) => (
  <>
    <Feixe rajadas={rajadasTV(e)} t={e.t} alvo={ALVO_TV} />
    <Feixe rajadas={rajadasCel(e)} t={e.t} alvo={ALVO_CEL} />
  </>
);
