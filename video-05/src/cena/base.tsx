// Materiais e contornos no visual da marca: faces chapadas (3 tons) + traço fino azul-noite.
import { useMemo } from 'react';
import * as THREE from 'three';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { COR } from '../estado';

// rampa de luz em degraus: dá o aspecto de ilustração (face clara, face média, face de sombra)
let rampa: THREE.DataTexture | null = null;
const gradiente = () => {
  if (rampa) return rampa;
  const tons = new Uint8Array([105, 165, 215, 255]);
  rampa = new THREE.DataTexture(tons, tons.length, 1, THREE.RedFormat);
  rampa.minFilter = THREE.NearestFilter;
  rampa.magFilter = THREE.NearestFilter;
  rampa.generateMipmaps = false;
  rampa.needsUpdate = true;
  return rampa;
};

export const toon = (cor: string, extra: Partial<THREE.MeshToonMaterialParameters> = {}) =>
  new THREE.MeshToonMaterial({ color: cor, gradientMap: gradiente(), ...extra });

export const brilho = (cor: string = COR.move, k = 2.4) =>
  new THREE.MeshBasicMaterial({ color: new THREE.Color(cor).multiplyScalar(k), toneMapped: false, transparent: true });

const RES = new THREE.Vector2(1080, 1920);

/** traço por cima das arestas da peça; `quente` (0..1) acende a borda laranja do destaque */
export const Contorno: React.FC<{ geo: THREE.BufferGeometry; quente?: number; largura?: number; angulo?: number; opacidade?: number }> = ({
  geo, quente = 0, largura = 2.2, angulo = 28, opacidade = 1,
}) => {
  const { linha, laranja, mat, matL } = useMemo(() => {
    const arestas = new THREE.EdgesGeometry(geo, angulo);
    const lg = new LineSegmentsGeometry().setPositions(arestas.attributes.position.array as Float32Array);
    const mat = new LineMaterial({ color: COR.traco, linewidth: largura, resolution: RES, transparent: true });
    const matL = new LineMaterial({
      color: new THREE.Color(COR.move).multiplyScalar(2.2).getHex(), linewidth: largura * 2.6, resolution: RES, transparent: true,
    });
    (matL as unknown as { toneMapped: boolean }).toneMapped = false;
    const linha = new LineSegments2(lg, mat);
    const laranja = new LineSegments2(lg, matL);
    laranja.renderOrder = 5;
    return { linha, laranja, mat, matL };
  }, [geo, largura, angulo]);
  mat.opacity = opacidade;
  matL.opacity = quente;
  laranja.visible = quente > 0.01;
  return (
    <>
      <primitive object={linha} />
      <primitive object={laranja} />
    </>
  );
};

/** malha + contorno */
export const Peca: React.FC<{
  geo: THREE.BufferGeometry; mat: THREE.Material; quente?: number; contorno?: boolean; sombra?: boolean;
  position?: [number, number, number]; rotation?: [number, number, number]; largura?: number; opacidade?: number;
}> = ({ geo, mat, quente = 0, contorno = true, sombra = true, position, rotation, largura, opacidade }) => (
  <group position={position} rotation={rotation}>
    <mesh geometry={geo} material={mat} castShadow={sombra} receiveShadow />
    {contorno && <Contorno geo={geo} quente={quente} largura={largura} opacidade={opacidade} />}
  </group>
);

// ---- formas ----
export const retanguloArredondado = (w: number, h: number, r: number, cx = 0, cy = 0) => {
  const s = new THREE.Shape();
  const x0 = cx - w / 2, y0 = cy - h / 2;
  r = Math.min(r, w / 2, h / 2);
  s.moveTo(x0 + r, y0);
  s.lineTo(x0 + w - r, y0); s.quadraticCurveTo(x0 + w, y0, x0 + w, y0 + r);
  s.lineTo(x0 + w, y0 + h - r); s.quadraticCurveTo(x0 + w, y0 + h, x0 + w - r, y0 + h);
  s.lineTo(x0 + r, y0 + h); s.quadraticCurveTo(x0, y0 + h, x0, y0 + h - r);
  s.lineTo(x0, y0 + r); s.quadraticCurveTo(x0, y0, x0 + r, y0);
  return s;
};
export const caminhoArredondado = (w: number, h: number, r: number, cx = 0, cy = 0) => {
  const p = new THREE.Path();
  const x0 = cx - w / 2, y0 = cy - h / 2;
  r = Math.min(r, w / 2, h / 2);
  p.moveTo(x0 + r, y0);
  p.lineTo(x0 + w - r, y0); p.quadraticCurveTo(x0 + w, y0, x0 + w, y0 + r);
  p.lineTo(x0 + w, y0 + h - r); p.quadraticCurveTo(x0 + w, y0 + h, x0 + w - r, y0 + h);
  p.lineTo(x0 + r, y0 + h); p.quadraticCurveTo(x0, y0 + h, x0, y0 + h - r);
  p.lineTo(x0, y0 + r); p.quadraticCurveTo(x0, y0, x0 + r, y0);
  return p;
};
export const extrudar = (s: THREE.Shape, prof: number, chanfro = 0.012) =>
  new THREE.ExtrudeGeometry(s, {
    depth: prof - chanfro * 2, bevelEnabled: chanfro > 0, bevelThickness: chanfro, bevelSize: chanfro,
    bevelSegments: 2, curveSegments: 10,
  }).translate(0, 0, chanfro);
