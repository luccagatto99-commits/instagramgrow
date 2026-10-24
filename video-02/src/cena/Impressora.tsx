import { useMemo } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { ALT_CAMADA, BICO_ABAIXO, CARRETEL, COMP_CAMINHO, COR, Estado, LADO, MOTOR, N_CAMADAS, Y_MESA, pontoCaminho } from '../estado';
import { clamp, lerp, saida } from '../tempo';
import { Contorno, Peca, brilho, extrudar, retanguloArredondado, toon } from './base';
import { Favo } from './Favo';

const caixa = (x: number, y: number, z: number, sx: number, sy: number, sz: number) => new THREE.BoxGeometry(sx, sy, sz).translate(x, y, z);

export const Impressora: React.FC<{ e: Estado }> = ({ e }) => {
  const g = useMemo(() => {
    const cil = (r: number, h: number, seg = 32) => new THREE.CylinderGeometry(r, r, h, seg);
    return {
      base: extrudar(retanguloArredondado(2.1, 1.7, 0.08, 0, 0), 0.22, 0.02).rotateX(-Math.PI / 2).translate(0, 0, 0),
      trilhos: mergeGeometries([-0.3, 0.3].map((x) => cil(0.025, 1.5).rotateX(Math.PI / 2).translate(x, 0.26, 0)))!,
      carroMesa: caixa(0, 0.29, 0, 0.9, 0.05, 0.7),
      mesa: extrudar(retanguloArredondado(1.3, 1.3, 0.05, 0, 0), 0.05, 0.008).rotateX(-Math.PI / 2).translate(0, Y_MESA - 0.05, 0),
      colunas: mergeGeometries([-0.98, 0.98].map((x) => caixa(x, 1.25, -0.1, 0.12, 2.1, 0.12)))!,
      topo: caixa(0, 2.34, -0.1, 2.08, 0.1, 0.12),
      suporte: mergeGeometries([caixa(0, 2.47, -0.1, 0.06, 0.16, 0.06), cil(0.03, 0.5).rotateZ(Math.PI / 2).translate(0, 2.66, -0.05)])!,
      viga: caixa(0, 0, -0.04, 2.0, 0.1, 0.1),
      carro: caixa(0, 0, 0.05, 0.32, 0.3, 0.05),
      dissipador: mergeGeometries(Array.from({ length: 6 }, (_, i) => caixa(0, -0.05 - i * 0.025, 0.14, 0.18, 0.012, 0.16)))!,
      ventoinha: caixa(0, -0.1, 0.25, 0.24, 0.24, 0.06),
      pas: mergeGeometries(Array.from({ length: 5 }, (_, i) => caixa(0, 0.045, 0, 0.035, 0.09, 0.008).rotateZ((i / 5) * Math.PI * 2)))!,
      bloco: caixa(0, -0.24, 0.14, 0.14, 0.07, 0.12),
      bocal: new THREE.CylinderGeometry(0.035, 0.01, 0.06, 20).translate(0, -BICO_ABAIXO + 0.03, 0.14),
      // carretel (eixo x)
      flanges: mergeGeometries([-0.13, 0.13].map((x) => cil(0.34, 0.02, 48).rotateZ(Math.PI / 2).translate(x, 0, 0)))!,
      rolo: cil(0.29, 0.24, 48).rotateZ(Math.PI / 2),
      cubo: cil(0.08, 0.3).rotateZ(Math.PI / 2),
      // motor da extrusora
      motor: caixa(0, 0, 0, 0.3, 0.3, 0.26),
      alavanca: caixa(0.0, 0.02, 0.16, 0.24, 0.2, 0.06),
      camada: new THREE.BoxGeometry(LADO, ALT_CAMADA, LADO),
      linha: new THREE.BoxGeometry(1, 0.012, 0.022),
    };
  }, []);
  const m = useMemo(() => ({
    objeto: toon(COR.objeto),
    escuro: toon(COR.escuro),
    sombra: toon(COR.sombra),
    metal: toon('#CFCBC2'),
    mesa: toon('#DCD6C8'),
    fio: toon(COR.objeto),
    bloco: toon(COR.sombra),
    camada: toon(COR.objeto),
    camadaB: toon('#E7E2D6'),
    quente: brilho(COR.move, 2.4),
    linha: new THREE.MeshToonMaterial({ color: '#ffffff' }),
  }), []);

  // linha da primeira camada: instâncias que nascem laranja e esfriam
  const N = 600;
  const inst = useMemo(() => {
    const im = new THREE.InstancedMesh(g.linha, m.linha, N);
    im.frustumCulled = false;
    return im;
  }, [g.linha, m.linha]);
  const o = useMemo(() => new THREE.Object3D(), []);
  const cor = useMemo(() => new THREE.Color(), []);
  const passo = COMP_CAMINHO / N;
  const primeiraVisivel = e.nCamadas <= 1 && e.s1 > 0;
  if (primeiraVisivel) {
    const fria = new THREE.Color(COR.objeto), viva = new THREE.Color(COR.move).multiplyScalar(2.2);
    const tempoPorPasso = (e.c1 - e.c0) / N;
    for (let i = 0; i < N; i++) {
      const s = i * passo;
      if (s > e.s1) { o.scale.setScalar(0.0001); o.updateMatrix(); inst.setMatrixAt(i, o.matrix); continue; }
      const p = pontoCaminho(s), q = pontoCaminho(Math.min(COMP_CAMINHO, s + passo));
      o.position.set((p.x + q.x) / 2, Y_MESA + 0.006, (p.y + q.y) / 2);
      o.rotation.set(0, -Math.atan2(q.y - p.y, q.x - p.x), 0);
      o.scale.set(Math.max(0.01, p.distanceTo(q)) + 0.01, 1, 1);
      o.updateMatrix();
      inst.setMatrixAt(i, o.matrix);
      const idade = e.t - (e.c0 + i * tempoPorPasso);
      const lim = e.ventilador > 0 ? e.resfria * 0.5 : e.resfria;
      inst.setColorAt(i, cor.copy(fria).lerp(viva, clamp(1 - idade / lim)));
    }
    inst.instanceMatrix.needsUpdate = true;
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
  }

  const d = e.destaque;
  const ab = saida(e.abre);
  const yViga = e.alturaBico + BICO_ABAIXO;
  m.bloco.color.set(COR.sombra).lerp(new THREE.Color(COR.move), e.aquecido ? 0.85 : 0);
  m.bloco.emissive = new THREE.Color(COR.move);
  m.bloco.emissiveIntensity = e.aquecido ? 0.9 : 0;

  // peça: camadas empilhadas (a de cima ainda quente)
  const nPeca = e.nCamadas > 1 ? e.nCamadas : 0;
  const pecaY = lerp(0, 0.9, saida(e.levanta)) * (1 - e.volta);
  const pecaZ = lerp(0, 0.9, saida(e.levanta)) * (1 - e.volta);
  const escala = lerp(1, 1.6, saida(e.levanta) * (1 - e.volta));
  const cortada = e.corta * (1 - e.volta);

  return (
    <group>
      <Peca geo={g.base} mat={m.objeto} />
      <mesh geometry={g.trilhos} material={m.metal} />
      {/* mesa (vai para frente e para trás) com a peça em cima */}
      <group position={[0, 0, e.zMesa + 0.55 * ab]}>
        <mesh geometry={g.carroMesa} material={m.escuro} />
        <group position={[0, 0.06 * d.mesa, 0]}>
          <Peca geo={g.mesa} mat={m.mesa} quente={d.mesa} />
        </group>
        {primeiraVisivel && <primitive object={inst} />}
        {nPeca > 0 && (
          <group position={[0, Y_MESA + pecaY, pecaZ]} scale={escala}>
            {cortada < 0.01 ? (
              Array.from({ length: nPeca }, (_, i) => (
                <mesh key={i} geometry={g.camada} material={i === nPeca - 1 && e.cresce < 1 ? m.quente : i % 2 ? m.camadaB : m.camada}
                  position={[0, (i + 0.5) * ALT_CAMADA, 0]} castShadow />
              ))
            ) : (
              <Favo abre={cortada} quente={d.peca} />
            )}
            {cortada < 0.01 && nPeca === N_CAMADAS && (
              <group position={[0, LADO / 2, 0]}>
                <Contorno geo={useCaixaPeca()} quente={d.peca} />
              </group>
            )}
          </group>
        )}
      </group>
      {/* estrutura */}
      <Peca geo={g.colunas} mat={m.objeto} />
      <Peca geo={g.topo} mat={m.objeto} />
      <mesh geometry={g.suporte} material={m.metal} />
      {/* carretel no alto */}
      <group position={[CARRETEL.x, CARRETEL.y + 0.55 * ab + 0.12 * d.carretel, CARRETEL.z]} rotation={[e.giroCarretel, 0, 0]}>
        <Peca geo={g.flanges} mat={m.objeto} quente={d.carretel} />
        <mesh geometry={g.rolo} material={m.fio} />
        <Contorno geo={g.rolo} quente={d.carretel} largura={1.6} angulo={60} />
        <mesh geometry={g.cubo} material={m.sombra} />
      </group>
      {/* motor da extrusora na coluna esquerda */}
      <group position={[MOTOR.x - 0.5 * ab, MOTOR.y + 0.1 * d.motor, MOTOR.z + 0.1 * d.motor]}>
        <Peca geo={g.motor} mat={m.escuro} quente={d.motor} />
        <Peca geo={g.alavanca} mat={m.objeto} quente={d.motor} largura={1.6} />
      </group>
      {/* viga X com o carro do bico */}
      <group position={[0, yViga, 0]}>
        <Peca geo={g.viga} mat={m.objeto} />
        <group position={[e.xBico, 0.12 * d.bico, 0.5 * ab + 0.1 * d.bico]}>
          <Peca geo={g.carro} mat={m.objeto} quente={d.bico} />
          <mesh geometry={g.dissipador} material={m.metal} />
          <Peca geo={g.ventoinha} mat={m.escuro} quente={d.ventilador} largura={1.6} />
          <group position={[0, -0.1, 0.285]} rotation={[0, 0, e.ventilador * 22]}>
            <mesh geometry={g.pas} material={m.metal} />
          </group>
          <Peca geo={g.bloco} mat={m.bloco} quente={d.bico} largura={1.6} />
          <Peca geo={g.bocal} mat={m.sombra} quente={d.bico} largura={1.4} />
        </group>
      </group>
      <Fios e={e} yViga={yViga} />
    </group>
  );
};

let caixaPeca: THREE.BufferGeometry | null = null;
const useCaixaPeca = () => (caixaPeca ??= new THREE.BoxGeometry(LADO, LADO, LADO));

/** fio do carretel até o motor e tubo do motor até o bico (refeitos a cada quadro: o bico anda) */
const Fios: React.FC<{ e: Estado; yViga: number }> = ({ e, yViga }) => {
  const m = useMemo(() => ({ fio: toon(COR.objeto), tubo: toon('#E2DCCF', { transparent: true, opacity: 0.85 }) }), []);
  const ab = saida(e.abre);
  const geoFio = new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.2, CARRETEL.y - 0.25 + 0.55 * ab, CARRETEL.z + 0.1),
      new THREE.Vector3(-0.8, 2.4 + 0.3 * ab, 0.15),
      new THREE.Vector3(MOTOR.x - 0.5 * ab, MOTOR.y + 0.18, MOTOR.z + 0.05),
    ]), 24, 0.012, 6,
  );
  const geoTubo = new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(MOTOR.x - 0.5 * ab, MOTOR.y - 0.16, MOTOR.z + 0.05),
      new THREE.Vector3(-0.9, 1.5, 0.45),
      new THREE.Vector3(e.xBico * 0.5, yViga + 0.45, 0.4 + 0.5 * ab),
      new THREE.Vector3(e.xBico, yViga + 0.02, 0.14 + 0.5 * ab),
    ]), 40, 0.028, 8,
  );
  return (
    <>
      <mesh geometry={geoFio} material={m.fio} />
      <mesh geometry={geoTubo} material={m.tubo} />
    </>
  );
};
