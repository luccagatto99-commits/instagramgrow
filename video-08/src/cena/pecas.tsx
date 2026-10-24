// Peças genéricas: placa entre dois pontos, cilindro entre dois pontos, pistão hidráulico e fluxo de partículas.
import { useMemo } from 'react';
import * as THREE from 'three';
import { COR, V2, V3 } from '../estado';
import { Contorno, brilho, toon } from './base';

const CUBO = new THREE.BoxGeometry(1, 1, 1);
const CIL = new THREE.CylinderGeometry(1, 1, 1, 24);
const BOLA = new THREE.SphereGeometry(1, 10, 8);
const Y = new THREE.Vector3(0, 1, 0);

/** placa no plano xy, de p até q, com espessura `esp` e largura `lz` em z */
export const Placa: React.FC<{
  p: V2; q: V2; esp: number; lz: number; z?: number; mat: THREE.Material; quente?: number; opacidade?: number; largura?: number;
}> = ({ p, q, esp, lz, z = 0, mat, quente = 0, opacidade = 1, largura = 1.8 }) => {
  const l = Math.hypot(q[0] - p[0], q[1] - p[1]);
  const a = Math.atan2(q[1] - p[1], q[0] - p[0]);
  return (
    <group position={[(p[0] + q[0]) / 2, (p[1] + q[1]) / 2, z]} rotation={[0, 0, a]} scale={[l, esp, lz]}>
      <mesh geometry={CUBO} material={mat} castShadow receiveShadow />
      <Contorno geo={CUBO} quente={quente} largura={largura} opacidade={opacidade} />
    </group>
  );
};

const quat = (a: V3, b: V3) => {
  const d = new THREE.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  const l = d.length();
  const q = new THREE.Quaternion().setFromUnitVectors(Y, l > 1e-6 ? d.clone().divideScalar(l) : Y);
  return { q, l };
};

/** cilindro de a até b */
export const Haste: React.FC<{ a: V3; b: V3; r: number; mat: THREE.Material; contorno?: boolean; quente?: number }> = ({ a, b, r, mat, contorno = false, quente = 0 }) => {
  const { q, l } = quat(a, b);
  return (
    <group position={[(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]} quaternion={q} scale={[r, Math.max(0.001, l), r]}>
      <mesh geometry={CIL} material={mat} castShadow />
      {contorno && <Contorno geo={CIL} largura={1.4} angulo={60} quente={quente} />}
    </group>
  );
};

/** pistão: camisa presa em `a`, haste até `b`. `oleo` (0..1) enche a camisa de laranja; `quente` acende o contorno */
export const Pistao: React.FC<{ a: V3; b: V3; camisa: number; r: number; oleo?: number; quente?: number }> = ({ a, b, camisa, r, oleo = 0, quente = 0 }) => {
  const m = useMemo(() => ({ camisa: toon(COR.objeto), haste: toon('#CFCBC2'), cheio: brilho(COR.move, 2.2) }), []);
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const l = Math.hypot(...d);
  const u: V3 = [d[0] / l, d[1] / l, d[2] / l];
  const c = Math.min(camisa, l * 0.92);
  const fimCamisa: V3 = [a[0] + u[0] * c, a[1] + u[1] * c, a[2] + u[2] * c];
  const cheia = oleo > 0.01;
  return (
    <group>
      <Haste a={a} b={b} r={r * 0.5} mat={m.haste} />
      <Haste a={a} b={fimCamisa} r={r} mat={cheia ? m.cheio : m.camisa} contorno quente={quente} />
      {cheia && <OpacidadeOleo m={m.cheio} v={oleo} />}
    </group>
  );
};
const OpacidadeOleo: React.FC<{ m: THREE.MeshBasicMaterial; v: number }> = ({ m, v }) => {
  m.opacity = 0.35 + 0.65 * v;
  return null;
};

/** gotas/partículas andando ao longo de uma curva */
export const Fluxo: React.FC<{ curva: THREE.Curve<THREE.Vector3>; n: number; t: number; vel: number; v: number; r?: number; cor?: string }> = ({
  curva, n, t, vel, v, r = 0.035, cor = COR.move,
}) => {
  const inst = useMemo(() => {
    const im = new THREE.InstancedMesh(BOLA, brilho(cor, 2.3), n);
    im.frustumCulled = false;
    return im;
  }, [n, cor]);
  const o = useMemo(() => new THREE.Object3D(), []);
  const p = useMemo(() => new THREE.Vector3(), []);
  (inst.material as THREE.MeshBasicMaterial).opacity = v;
  inst.visible = v > 0.01;
  for (let i = 0; i < n; i++) {
    const u = (((i / n + t * vel) % 1) + 1) % 1;
    curva.getPointAt(u, p);
    o.position.copy(p);
    o.scale.setScalar(r * Math.min(1, u * 8, (1 - u) * 8));
    o.updateMatrix();
    inst.setMatrixAt(i, o.matrix);
  }
  inst.instanceMatrix.needsUpdate = true;
  return <primitive object={inst} />;
};
