import { useMemo } from 'react';
import * as THREE from 'three';
import { COR } from '../estado';
import { aleatorio } from '../tempo';

const BOLA = new THREE.SphereGeometry(1, 10, 8);

/** fundo azul-noite, luz de estúdio, sombra no chão e poeira no ar */
export const Mundo: React.FC<{ t: number }> = ({ t }) => (
  <>
    <color attach="background" args={[COR.fundo]} />
    <fog attach="fog" args={[COR.fundo, 16, 40]} />
    <hemisphereLight args={['#ffffff', '#41506a', 0.9]} />
    <directionalLight position={[-4, 7, 6]} intensity={2.1} castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0003} shadow-normalBias={0.015}
      shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={6} shadow-camera-bottom={-3} shadow-camera-near={0.5} shadow-camera-far={25} />
    <directionalLight position={[5, 3, -4]} intensity={0.5} color="#b9d0ff" />
    <mesh rotation-x={-Math.PI / 2} position={[0, -0.05, 0]} receiveShadow>
      <planeGeometry args={[40, 30]} />
      <shadowMaterial opacity={0.3} color="#050a12" />
    </mesh>
    <Poeira t={t} />
  </>
);

const N = 70;
const Poeira: React.FC<{ t: number }> = ({ t }) => {
  const dados = useMemo(() => {
    const r = aleatorio(5);
    return Array.from({ length: N }, () => ({ x: -5 + r() * 10, y: 0.2 + r() * 5, z: -4 + r() * 8, s: 0.005 + r() * 0.01, f: r() * 6.28, v: 0.04 + r() * 0.1 }));
  }, []);
  const inst = useMemo(() => {
    const m = new THREE.InstancedMesh(BOLA, new THREE.MeshBasicMaterial({ color: COR.rotulo, transparent: true, opacity: 0.3 }), N);
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

