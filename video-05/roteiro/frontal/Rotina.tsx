// O dia a dia sem pessoa: a roupa voa do cesto para o tambor, a porta fecha, o sabão cai na gaveta e a máquina liga.
import { useMemo } from 'react';
import * as THREE from 'three';
import { ARREMESSOS, E, Estado, GAVETA, V3, VOO } from '../estado';
import { Contorno, toon } from './base';

const Cesto: React.FC<{ cheio: number; mat: THREE.Material; roupa: THREE.Material }> = ({ cheio, mat, roupa }) => {
  const g = useMemo(() => ({ cesto: new THREE.CylinderGeometry(0.42, 0.34, 0.42, 24, 1, true), fundo: new THREE.CircleGeometry(0.34, 24), bola: new THREE.SphereGeometry(1, 14, 10) }), []);
  return (
    <group>
      <mesh geometry={g.cesto} material={mat} castShadow />
      <Contorno geo={g.cesto} angulo={60} largura={1.6} />
      <mesh geometry={g.fundo} material={mat} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]} />
      {Array.from({ length: Math.round(cheio * 5) }, (_, i) => (
        <mesh key={i} geometry={g.bola} material={roupa} position={[Math.cos(i * 2.4) * 0.16, 0.1 + (i % 2) * 0.06, Math.sin(i * 2.4) * 0.16]} scale={[0.22, 0.12, 0.2]} />
      ))}
    </group>
  );
};

const CESTO: V3 = [-1.55, 0.22, 1.55];

export const Rotina: React.FC<{ e: Estado }> = ({ e }) => {
  const t = e.t;
  const m = useMemo(() => ({
    cesto: toon('#C9D6EE', { side: THREE.DoubleSide }),
    roupa: toon('#D9D2C2'),
    sabao: new THREE.MeshBasicMaterial({ color: '#EAF1FF', transparent: true, opacity: 0.85 }),
  }), []);
  const g = useMemo(() => ({ bola: new THREE.SphereGeometry(1, 14, 10) }), []);
  const e0 = E();
  // de onde a roupa sai: o cesto, no mundo (aproximado pela pose)
  const de: V3 = [CESTO[0], CESTO[1] + 0.25, CESTO[2]];
  const ate: V3 = [0, 1.15, 0.2];
  const restantes = ARREMESSOS.filter((a0) => t < a0).length;
  const cesto = (
    <Cesto cheio={restantes / ARREMESSOS.length + (t < ARREMESSOS[0] ? 0 : 0)} mat={m.cesto} roupa={m.roupa} />
  );
  return (
    <>
      {/* cesto no chão, ao lado da máquina (some depois de vazio) */}
      {t < e0.sabao ? <group position={[CESTO[0], CESTO[1], CESTO[2]]}>{cesto}</group> : null}
      {/* roupas voando do cesto até o tambor */}
      {ARREMESSOS.map((a0, i) => {
        const u = (t - a0) / VOO;
        if (u < 0 || u > 1) return null;
        const x = de[0] + (ate[0] - de[0]) * u, z = de[2] + (ate[2] - de[2]) * u;
        const y = de[1] + (ate[1] - de[1]) * u + Math.sin(u * Math.PI) * 1.1;
        return <mesh key={i} geometry={g.bola} material={m.roupa} position={[x, y, z]} rotation={[u * 4, u * 3, 0]} scale={[0.24, 0.13, 0.22]} />;
      })}
      {/* fio de sabão caindo na gaveta */}
      {e.despeja > 0.02 ? (
        <mesh position={[GAVETA[0], GAVETA[1] + 0.75, GAVETA[2] + 0.42]} scale={[1, e.despeja, 1]}>
          <cylinderGeometry args={[0.025, 0.035, 1.3, 10]} />
          <primitive object={m.sabao} attach="material" />
        </mesh>
      ) : null}
    </>
  );
};

