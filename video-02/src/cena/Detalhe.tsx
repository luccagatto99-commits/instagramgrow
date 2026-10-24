// Estação de detalhe: engrenagens empurrando o fio, tubo e o bico que derrete o plástico.
import { useMemo } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { COR, DET, Estado } from '../estado';
import { lerp, saida } from '../tempo';
import { Contorno, Peca, brilho, extrudar, toon } from './base';

const engrenagem = (r: number, dentes: number, prof: number, esp: number) => {
  const s = new THREE.Shape();
  const n = dentes * 4;
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rr = r + ((i % 4) === 1 || (i % 4) === 2 ? prof : 0);
    const x = rr * Math.cos(a), y = rr * Math.sin(a);
    if (i === 0) s.moveTo(x, y); else s.lineTo(x, y);
  }
  const furo = new THREE.Path();
  furo.absarc(0, 0, r * 0.3, 0, Math.PI * 2, true);
  s.holes.push(furo);
  return extrudar(s, esp, 0.006).translate(0, 0, -esp / 2);
};

const Y_ENG = 2.3, Y_BLOCO = 0.96, Y_PONTA = 0.7, Y_PLACA = 0.52;

export const Detalhe: React.FC<{ e: Estado }> = ({ e }) => {
  const g = useMemo(() => ({
    motora: engrenagem(0.17, 14, 0.03, 0.12),
    rolete: new THREE.CylinderGeometry(0.19, 0.19, 0.12, 40).rotateX(Math.PI / 2),
    motor: new THREE.BoxGeometry(0.46, 0.46, 0.34),
    fio: new THREE.CylinderGeometry(0.045, 0.045, 1.0, 24),
    marca: new THREE.CylinderGeometry(0.047, 0.047, 0.018, 24),
    tubo: new THREE.CylinderGeometry(0.085, 0.085, 0.8, 32, 1, true),
    aletas: mergeGeometries(Array.from({ length: 6 }, (_, i) => new THREE.BoxGeometry(0.42, 0.022, 0.36).translate(0, 1.16 + i * 0.035, 0)))!,
    garganta: new THREE.CylinderGeometry(0.05, 0.05, 0.1, 20).translate(0, 1.11, 0),
    bloco: new THREE.BoxGeometry(0.5, 0.24, 0.36).translate(0, Y_BLOCO, 0),
    bocal: new THREE.CylinderGeometry(0.085, 0.02, 0.14, 6).translate(0, Y_PONTA + 0.07, 0),
    placa: new THREE.BoxGeometry(1.4, 0.04, 0.7).translate(0, Y_PLACA - 0.02, 0),
    jato: new THREE.CylinderGeometry(0.022, 0.03, 1, 16),
    linha: new THREE.BoxGeometry(1, 0.03, 0.05),
  }), []);
  const m = useMemo(() => ({
    objeto: toon(COR.objeto), escuro: toon(COR.escuro), metal: toon('#CFCBC2'), sombra: toon(COR.sombra),
    tubo: toon('#EDE8DD', { transparent: true, opacity: 0.45, side: THREE.DoubleSide }),
    bloco: toon(COR.sombra, { transparent: true, opacity: 0.7 }),
    fio: toon(COR.objeto), quente: brilho(COR.move, 2.4), placa: toon('#DCD6C8'),
  }), []);
  if (e.detalhe <= 0.001) return null;
  const d = e.destaque;
  // calor: o bloco fica laranja
  m.bloco.color.set(COR.sombra).lerp(new THREE.Color(COR.move), e.calor);
  m.bloco.emissive = new THREE.Color(COR.move);
  m.bloco.emissiveIntensity = 1.1 * e.calor;
  const desce = e.giroEngrenagem * 0.17; // o fio anda junto com o dente da engrenagem
  const marcas = Array.from({ length: 16 }, (_, i) => {
    const y = 3.05 - ((i * 0.13 + desce) % 2.08);
    return y;
  }).filter((y) => y > Y_BLOCO + 0.14 && y < 3.0);
  const jato = e.escorre * (Y_PONTA - Y_PLACA);
  const linhaLen = e.linhaDet;
  return (
    <group position={[DET.x, DET.y, DET.z]} scale={saida(e.detalhe)}>
      {/* motor e engrenagens */}
      <mesh geometry={g.motor} material={m.escuro} position={[-0.24, Y_ENG, -0.3]} />
      <group position={[-0.245, Y_ENG, 0]} rotation={[0, 0, -e.giroEngrenagem]}>
        <Peca geo={g.motora} mat={m.metal} quente={d.motor} largura={1.6} />
      </group>
      <group position={[0.235, Y_ENG, 0]} rotation={[0, 0, e.giroEngrenagem * 0.9]}>
        <Peca geo={g.rolete} mat={m.objeto} quente={d.motor} largura={1.6} />
      </group>
      {/* fio de plástico (de cima até o bloco) */}
      <mesh geometry={g.fio} material={m.fio} position={[0, 2.05, 0]} scale={[1, 2.0, 1]} />
      {marcas.map((y, i) => <mesh key={i} geometry={g.marca} material={m.sombra} position={[0, y, 0]} />)}
      {/* tubo até o bico */}
      <mesh geometry={g.tubo} material={m.tubo} position={[0, 1.6, 0]} />
      <Contorno geo={g.tubo} quente={d.tubo} largura={1.4} angulo={80} />
      {/* bico: dissipador, bloco que esquenta e a ponta */}
      <Peca geo={g.aletas} mat={m.metal} largura={1.4} />
      <mesh geometry={g.garganta} material={m.metal} />
      <Peca geo={g.bloco} mat={m.bloco} quente={d.bico} />
      {/* plástico derretido dentro do bloco */}
      <mesh material={m.quente} position={[0, Y_BLOCO, 0]} scale={[1, lerp(0.001, 1, e.derrete), 1]}>
        <cylinderGeometry args={[0.05, 0.03, 0.26, 20]} />
      </mesh>
      <Peca geo={g.bocal} mat={m.sombra} quente={d.bico} largura={1.4} />
      {/* plástico saindo pela ponta e virando linha na placa */}
      {e.escorre > 0.01 && (
        <mesh geometry={g.jato} material={m.quente} position={[0, Y_PONTA - jato / 2, 0]} scale={[1, Math.max(0.001, jato), 1]} />
      )}
      <Peca geo={g.placa} mat={m.placa} largura={1.4} />
      {e.escorre > 0.01 && (
        <mesh geometry={g.linha} material={m.quente} position={[-linhaLen / 2, Y_PLACA + 0.015, 0]} scale={[Math.max(0.001, linhaLen), 1, 1]} />
      )}
    </group>
  );
};
