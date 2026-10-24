// Central eletrônica com o sensor, fio com a corrente, gás (câmara, filtro, enchimento, vazamento),
// fagulhas, cabeça do boneco e o pó branco.
import { useMemo } from 'react';
import * as THREE from 'three';
import { C, COR, ECU, ECU_TAM, GERADOR, SACO, Estado, V3 } from '../estado';
import { Contorno, Peca, brilho, toon } from './base';
import { Fluxo } from './pecas';
import { aleatorio, clamp, janela, B, T } from '../tempo';

const BOLA = new THREE.SphereGeometry(1, 10, 8);

/** caminho do fio: do sensor (dentro da central) sobe pela coluna até o iniciador */
export const CURVA_FIO = new THREE.CatmullRomCurve3(
  [
    [ECU[0] + 0.2, ECU[1] + 0.05, ECU[2]],
    [0.1, 0.3, -0.2],
    [0.12, 0.55, -1.15],
    [0.12, 1.15, -1.95],
    [0.1, 1.85, -0.75],
    [0, C[1], GERADOR.z - 0.12],
  ].map((p) => new THREE.Vector3(...(p as V3))),
);

/** central (ECU): caixa com a tampa de cima em corte e o sensor (massinha numa mola) dentro */
export const Central: React.FC<{ e: Estado; v: number }> = ({ e, v }) => {
  const g = useMemo(() => ({ caixa: new THREE.BoxGeometry(...ECU_TAM), chip: new THREE.BoxGeometry(0.34, 0.05, 0.3), massa: new THREE.BoxGeometry(0.16, 0.12, 0.16), fio: new THREE.TubeGeometry(CURVA_FIO, 120, 0.028, 8) }), []);
  const m = useMemo(() => ({ caixa: toon(COR.objeto, { transparent: true }), chip: toon(COR.escuro), massa: toon(COR.sombra), fio: toon(COR.escuro, { transparent: true }) }), []);
  m.caixa.opacity = 0.18 * v;
  m.caixa.depthWrite = false;
  m.fio.opacity = v;
  if (v < 0.01) return null;
  // a massinha é jogada para a frente pelo tranco
  const dz = e.tranco * 0.22;
  const mola = new THREE.CatmullRomCurve3(
    Array.from({ length: 12 }, (_, i) => new THREE.Vector3(0.12 * Math.sin(i * 2.2), 0, -0.28 + (i / 11) * (0.2 + dz))),
  );
  return (
    <group>
      <group position={ECU}>
        <mesh geometry={g.caixa} material={m.caixa} />
        <Contorno geo={g.caixa} opacidade={v} />
        <Peca geo={g.chip} mat={m.chip} position={[0.25, -0.13, 0.12]} />
        {/* sensor: mola e massa */}
        <group position={[-0.2, -0.05, 0]}>
          <mesh>
            <tubeGeometry args={[mola, 60, 0.012, 6]} />
            <meshBasicMaterial color={COR.rotulo} />
          </mesh>
          <Peca geo={g.massa} mat={m.massa} position={[0, 0, -0.08 + 0.2 + dz]} quente={e.tranco > 0.6 ? 1 : 0} />
        </group>
      </group>
      <mesh geometry={g.fio} material={m.fio} />
    </group>
  );
};

/** corrente: pontos laranja correndo pelo fio */
export const Corrente: React.FC<{ e: Estado }> = ({ e }) => (
  <Fluxo curva={CURVA_FIO} n={26} t={e.t} vel={0.55} v={e.corrente} r={0.05} />
);

const N_GAS = 90;
/** gás: gira na câmara, atravessa o filtro, enche a bolsa e escapa pelos furos */
export const Gas: React.FC<{ e: Estado }> = ({ e }) => {
  const dados = useMemo(() => {
    const r = aleatorio(11);
    return Array.from({ length: N_GAS }, () => ({ a: r() * Math.PI * 2, rr: 0.07 + r() * 0.2, z: (r() - 0.5) * 0.14, f: r(), v: 0.6 + r() * 0.8, lado: r() < 0.5 ? -1 : 1, y: r() }));
  }, []);
  const inst = useMemo(() => {
    const im = new THREE.InstancedMesh(BOLA, brilho(COR.move, 2.2), N_GAS);
    im.frustumCulled = false;
    return im;
  }, []);
  const o = useMemo(() => new THREE.Object3D(), []);
  const vis = Math.max(e.gasCamara, e.enchendo, e.vazando);
  inst.visible = vis > 0.01;
  (inst.material as THREE.MeshBasicMaterial).opacity = vis;
  const t = e.t;
  dados.forEach((d, i) => {
    let p: V3 = [0, 0, 0];
    let s = 0.028;
    if (e.vazando > 0.01) {
      // escapa pelos furos de trás, para os lados
      const u = (d.f + t * d.v * 0.7) % 1;
      const xs = d.lado * (0.62 * SACO.rx * (0.55 + 0.45 * e.cheio) + u * 1.1);
      p = [xs, C[1] + 0.42 + (d.y - 0.5) * 0.25 + u * 0.3, 0.3 + 0.55 * e.cheio - SACO.rz * e.cheio * 0.6 - u * 0.5];
      s = 0.035 * (1 - u);
    } else if (e.enchendo > 0.01) {
      // jorra do miolo para dentro da bolsa
      const u = (d.f + t * d.v * 1.4) % 1;
      const ang = d.a * 2 + d.y * 6;
      const rr = u * 0.95;
      p = [Math.cos(ang) * rr * SACO.rx, C[1] + 0.05 + Math.sin(ang) * rr * SACO.ry, 0.2 + u * 0.9 * e.cheio];
      s = 0.04 * (1 - u * 0.6);
    } else {
      // na câmara: gira; com o filtro, sai pela grade (raio maior)
      const ang = d.a + Math.sin(t * d.v + d.f * 6) * 0.25;
      const fora = e.gasFiltro > 0.01 ? ((d.f + t * d.v * 0.6) % 1) : 0;
      const rr = d.rr + fora * 0.32;
      p = [Math.cos(ang) * rr, C[1] + Math.sin(ang) * rr, GERADOR.z + d.z];
      s = 0.017 * (fora > 0.6 ? 0.6 : 1);
    }
    o.position.set(...p);
    o.scale.setScalar(s);
    o.updateMatrix();
    inst.setMatrixAt(i, o.matrix);
  });
  inst.instanceMatrix.needsUpdate = true;
  return <primitive object={inst} />;
};

const N_FAISCA = 40;
/** fagulhas: estouram no iniciador e batem no filtro */
export const Fagulhas: React.FC<{ e: Estado; tFogo: number }> = ({ e, tFogo }) => {
  const dados = useMemo(() => {
    const r = aleatorio(21);
    return Array.from({ length: N_FAISCA }, () => ({ a: r() * Math.PI * 2, z: (r() - 0.5) * 0.12, v: 0.5 + r() * 0.6 }));
  }, []);
  const inst = useMemo(() => {
    const im = new THREE.InstancedMesh(BOLA, brilho('#FFC27A', 3.0), N_FAISCA);
    im.frustumCulled = false;
    return im;
  }, []);
  const o = useMemo(() => new THREE.Object3D(), []);
  inst.visible = e.faisca > 0.01;
  dados.forEach((d, i) => {
    const u = clamp((e.t - tFogo) * d.v * 2.2);
    const rr = Math.min(0.34, 0.04 + u * 0.5); // param no filtro
    o.position.set(Math.cos(d.a) * rr, C[1] + Math.sin(d.a) * rr, GERADOR.z + d.z);
    o.scale.setScalar(0.013 * (1 - u * 0.5));
    o.updateMatrix();
    inst.setMatrixAt(i, o.matrix);
  });
  inst.instanceMatrix.needsUpdate = true;
  return <primitive object={inst} />;
};

/** cabeça do boneco de teste (sem rosto): esfera com as marcas em cruz e pescoço */
export const Cabeca: React.FC<{ e: Estado }> = ({ e }) => {
  const g = useMemo(() => ({ cabeca: new THREE.SphereGeometry(0.4, 32, 22), pescoco: new THREE.CylinderGeometry(0.15, 0.17, 0.5, 20), anel: new THREE.TorusGeometry(0.405, 0.012, 6, 48), ombro: new THREE.CapsuleGeometry(0.28, 0.9, 6, 16) }), []);
  const m = useMemo(() => ({ pele: toon(COR.objeto, { transparent: true }), escuro: new THREE.MeshBasicMaterial({ color: COR.escuro, transparent: true }) }), []);
  m.pele.opacity = e.cabeca;
  m.escuro.opacity = e.cabeca;
  if (e.cabeca < 0.01) return null;
  const y = C[1] + 0.25;
  return (
    <group position={[0, y, e.zCabeca]}>
      <mesh geometry={g.cabeca} material={m.pele} castShadow />
      <Contorno geo={g.cabeca} angulo={60} opacidade={e.cabeca} />
      <mesh geometry={g.anel} material={m.escuro} rotation={[0, Math.PI / 2, 0]} />
      <mesh geometry={g.anel} material={m.escuro} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={g.pescoco} material={m.pele} position={[0, -0.5, 0.08]} />
    </group>
  );
};

const N_PO = 280;
/** pó branco (talco/amido) saindo da bolsa e baixando devagar */
export const Po: React.FC<{ e: Estado }> = ({ e }) => {
  const dados = useMemo(() => {
    const r = aleatorio(31);
    return Array.from({ length: N_PO }, () => ({ dx: (r() - 0.5) * 2, dy: (r() - 0.3) * 1.4, dz: 0.3 + r() * 1.6, s: 0.007 + r() * 0.018, f: r() * 6 }));
  }, []);
  const inst = useMemo(() => {
    const im = new THREE.InstancedMesh(BOLA, new THREE.MeshBasicMaterial({ color: COR.objeto, transparent: true }), N_PO);
    im.frustumCulled = false;
    return im;
  }, []);
  const o = useMemo(() => new THREE.Object3D(), []);
  inst.visible = e.poV > 0.01;
  (inst.material as THREE.MeshBasicMaterial).opacity = 0.4 * e.poV;
  const u = 1 - Math.pow(1 - e.po, 2);
  dados.forEach((d, i) => {
    o.position.set(d.dx * (0.4 + u * 1.4) + Math.sin(e.t * 0.7 + d.f) * 0.05, C[1] + d.dy * (0.3 + u) - u * 0.5, 0.6 + d.dz * u);
    o.scale.setScalar(d.s * (0.5 + u));
    o.updateMatrix();
    inst.setMatrixAt(i, o.matrix);
  });
  inst.instanceMatrix.needsUpdate = true;
  return <primitive object={inst} />;
};

/** fundo azul-noite, luz de estúdio, sombra no chão e poeira no ar */
export const Mundo: React.FC<{ t: number }> = ({ t }) => (
  <>
    <color attach="background" args={[COR.fundo]} />
    <fog attach="fog" args={[COR.fundo, 16, 40]} />
    <hemisphereLight args={['#ffffff', '#41506a', 0.9]} />
    <directionalLight position={[-4, 7, 6]} intensity={2.1} castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0003} shadow-normalBias={0.015}
      shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={5} shadow-camera-bottom={-3} shadow-camera-near={0.5} shadow-camera-far={25} />
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

/** visibilidade da central: aparece no bloco do sensor e fica até a bolsa encher */
export const vCentral = (t: number) => janela(t, B(2) - 0.2, T(4, 'rasga') + 1.5, 0.8, 0.8);
