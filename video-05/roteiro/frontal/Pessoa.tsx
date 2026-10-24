// Pessoa de traço (sem rosto), no visual da marca: põe a roupa, fecha a porta, põe o sabão e liga.
// Local: frente em +z, pés em y = 0. A pose vem de pessoa(t) em estado.ts.
import { useMemo } from 'react';
import * as THREE from 'three';
import { COR, PoseP, V3 } from '../estado';
import { Contorno, toon } from './base';

const ALT = { quadril: 2.55, tronco: 1.45, ombro: 0.46, braco: 0.95, ante: 0.9, coxa: 1.25, perna: 1.25 };

const Osso: React.FC<{ comp: number; r: number; mat: THREE.Material }> = ({ comp, r, mat }) => {
  const geo = useMemo(() => new THREE.CapsuleGeometry(r, comp, 6, 14).translate(0, -comp / 2, 0), [comp, r]);
  return (
    <>
      <mesh geometry={geo} material={mat} castShadow />
      <Contorno geo={geo} angulo={60} largura={1.6} />
    </>
  );
};

/** braço pendurado: ombro (x = frente/cima, z = abre para o lado) e cotovelo */
const Braco: React.FC<{ lado: 1 | -1; ombro: [number, number]; cotovelo: number; mat: THREE.Material; children?: React.ReactNode }> = ({ lado, ombro, cotovelo, mat, children }) => (
  <group position={[lado * ALT.ombro, ALT.tronco - 0.05, 0]} rotation={[-ombro[0], 0, lado * ombro[1]]}>
    <Osso comp={ALT.braco} r={0.12} mat={mat} />
    <group position={[0, -ALT.braco - 0.12, 0]} rotation={[-cotovelo, 0, 0]}>
      <Osso comp={ALT.ante} r={0.1} mat={mat} />
      <group position={[0, -ALT.ante - 0.2, 0]}>{children}</group>
    </group>
  </group>
);

export const Pessoa: React.FC<{ p: PoseP; cesto?: React.ReactNode; mao?: React.ReactNode }> = ({ p, cesto, mao }) => {
  const m = useMemo(() => ({ corpo: toon(COR.objeto, { transparent: true }), roupa: toon('#C9D6EE', { transparent: true }), escuro: toon(COR.escuro, { transparent: true }) }), []);
  m.corpo.opacity = p.v; m.roupa.opacity = p.v; m.escuro.opacity = p.v;
  m.corpo.depthWrite = p.v > 0.5; m.roupa.depthWrite = p.v > 0.5;
  const g = useMemo(() => ({ cabeca: new THREE.SphereGeometry(0.38, 28, 20), tronco: new THREE.CapsuleGeometry(0.42, 1.0, 8, 18) }), []);
  if (p.v < 0.01) return null;
  // agachar: o quadril desce e os joelhos vão para a frente
  const desce = p.agacha * 0.75;
  const yq = ALT.quadril - desce;
  const joelhoZ = p.agacha * 0.75;
  const perna = (lado: 1 | -1) => {
    const quadril: V3 = [lado * 0.24, yq, 0];
    const pe: V3 = [lado * 0.26, 0.12, 0.1];
    const joelho: V3 = [lado * 0.25, (yq + 0.12) / 2 + 0.05, joelhoZ];
    return [quadril, joelho, pe] as const;
  };
  return (
    <group position={p.pos} rotation={[0, p.yaw, 0]}>
      {/* pernas */}
      {([1, -1] as const).map((l) => {
        const [a, b, c] = perna(l);
        return (
          <group key={l}>
            <Segmento a={a} b={b} r={0.15} mat={m.roupa} />
            <Segmento a={b} b={c} r={0.13} mat={m.roupa} />
          </group>
        );
      })}
      {/* tronco, cabeça e braços (dobram pelo quadril) */}
      <group position={[0, yq, 0]} rotation={[p.dobra, 0, 0]}>
        <group position={[0, 0.72, 0]}>
          <mesh geometry={g.tronco} material={m.roupa} castShadow />
          <Contorno geo={g.tronco} angulo={60} largura={1.6} />
        </group>
        <group position={[0, ALT.tronco + 0.62, 0.02]}>
          <mesh geometry={g.cabeca} material={m.corpo} castShadow />
          <Contorno geo={g.cabeca} angulo={60} largura={1.6} />
        </group>
        <Braco lado={1} ombro={p.bracoD} cotovelo={p.cotD} mat={m.corpo}>{mao}</Braco>
        <Braco lado={-1} ombro={p.bracoE} cotovelo={p.cotE} mat={m.corpo} />
        {cesto ? <group position={[-0.62, 0.45, 0.42]}>{cesto}</group> : null}
      </group>
    </group>
  );
};

const Y = new THREE.Vector3(0, 1, 0);
const CIL = new THREE.CylinderGeometry(1, 1, 1, 14);
const BOLA = new THREE.SphereGeometry(1, 14, 10);
/** cilindro de a até b com uma junta redonda em cada ponta */
const Segmento: React.FC<{ a: V3; b: V3; r: number; mat: THREE.Material }> = ({ a, b, r, mat }) => {
  const d = new THREE.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  const l = d.length();
  const q = new THREE.Quaternion().setFromUnitVectors(Y, d.clone().normalize());
  return (
    <>
      <group position={[(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]} quaternion={q} scale={[r, l, r]}>
        <mesh geometry={CIL} material={mat} castShadow />
      </group>
      <mesh geometry={BOLA} material={mat} position={a} scale={r} />
      <mesh geometry={BOLA} material={mat} position={b} scale={r} />
    </>
  );
};
