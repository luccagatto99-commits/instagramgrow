import { useMemo } from 'react';
import * as THREE from 'three';
import { COR } from '../estado';
import { aleatorio } from '../tempo';

/** fundo azul-noite, luz de estúdio e sombras suaves no chão invisível */
export const Mundo: React.FC<{ t: number }> = ({ t }) => (
  <>
    <color attach="background" args={[COR.fundo]} />
    <fog attach="fog" args={[COR.fundo, 34, 70]} />
    <hemisphereLight args={['#ffffff', '#41506a', 0.9]} />
    <directionalLight
      position={[-4, 7, 6]}
      intensity={2.1}
      castShadow
      shadow-mapSize={[4096, 4096]}
      shadow-bias={-0.0003}
      shadow-normalBias={0.015}
      shadow-camera-left={-10}
      shadow-camera-right={11}
      shadow-camera-top={8}
      shadow-camera-bottom={-6}
      shadow-camera-near={0.5}
      shadow-camera-far={30}
    />
    <directionalLight position={[5, 3, -4]} intensity={0.5} color="#b9d0ff" />
    {/* chão que só mostra a sombra */}
    <mesh rotation-x={-Math.PI / 2} position={[3, 0, 0]} receiveShadow>
      <planeGeometry args={[60, 40]} />
      <shadowMaterial opacity={0.32} color="#050a12" />
    </mesh>
    <Faixas />
    <Poeira t={t} />
  </>
);

/** faixas da rua: mostram o caminhão andando */
const Faixas: React.FC = () => {
  const g = useMemo(() => new THREE.BoxGeometry(1.4, 0.01, 0.14), []);
  const m = useMemo(() => new THREE.MeshBasicMaterial({ color: '#2B3A55' }), []);
  return (
    <>
      {Array.from({ length: 16 }, (_, i) => (
        <mesh key={i} geometry={g} material={m} position={[-24 + i * 3.4, 0.005, 2.3]} />
      ))}
    </>
  );
};

const N = 90;
const Poeira: React.FC<{ t: number }> = ({ t }) => {
  const dados = useMemo(() => {
    const r = aleatorio(5);
    return Array.from({ length: N }, () => ({
      x: -9 + r() * 20, y: 0.2 + r() * 6, z: -6 + r() * 14, s: 0.006 + r() * 0.014, f: r() * 6.28, v: 0.04 + r() * 0.1,
    }));
  }, []);
  const inst = useMemo(() => {
    const m = new THREE.InstancedMesh(
      new THREE.SphereGeometry(1, 8, 6),
      new THREE.MeshBasicMaterial({ color: COR.rotulo, transparent: true, opacity: 0.35 }),
      N,
    );
    m.frustumCulled = false;
    return m;
  }, []);
  const o = useMemo(() => new THREE.Object3D(), []);
  dados.forEach((d, i) => {
    o.position.set(d.x + Math.sin(t * d.v + d.f) * 0.3, d.y + Math.sin(t * d.v * 0.7 + d.f) * 0.2, d.z + Math.cos(t * d.v + d.f) * 0.3);
    o.scale.setScalar(d.s);
    o.updateMatrix();
    inst.setMatrixAt(i, o.matrix);
  });
  inst.instanceMatrix.needsUpdate = true;
  return <primitive object={inst} />;
};
