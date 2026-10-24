// O coletor: boneco simples, de frente para o caminhão (olhando para -x), que arremessa os sacos e aperta o botão.
import { useMemo } from 'react';
import * as THREE from 'three';
import { COR, OMBRO, aparece, coletor } from '../estado';
import { Contorno, toon } from './base';

export const Coletor: React.FC<{ t: number }> = ({ t }) => {
  const g = useMemo(() => ({
    perna: new THREE.CapsuleGeometry(0.075, 0.62, 4, 12).translate(0, -0.38, 0),
    tronco: new THREE.CapsuleGeometry(0.17, 0.42, 4, 16),
    cabeca: new THREE.SphereGeometry(0.13, 20, 14),
    bone: new THREE.SphereGeometry(0.14, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2),
    aba: new THREE.BoxGeometry(0.14, 0.02, 0.2).translate(-0.12, 0, 0),
    braco: new THREE.CapsuleGeometry(0.055, 0.5, 4, 10).translate(0, -0.3, 0),
    faixa: new THREE.CylinderGeometry(0.178, 0.178, 0.05, 20),
  }), []);
  const m = useMemo(() => ({ roupa: toon(COR.objeto), escuro: toon(COR.escuro), faixa: toon(COR.rotulo), pele: toon('#E3D3BF') }), []);
  const c = coletor(t);
  const passo = c.andando * Math.sin(t * 11) * 0.5;
  return (
    <group position={c.pos} scale={Math.max(0.001, aparece(t))}>
      {/* pernas */}
      {[0.1, -0.1].map((z, i) => (
        <group key={z} position={[0, 0.78, z]} rotation={[0, 0, (i ? -1 : 1) * passo]}>
          <mesh geometry={g.perna} material={m.escuro} castShadow />
          <Contorno geo={g.perna} largura={1.2} angulo={60} />
        </group>
      ))}
      {/* tronco inclina para pegar o saco */}
      <group position={[0, 0.82, 0]} rotation={[0, 0, c.curva * 0.45]}>
        <group position={[0, 0.4, 0]}>
          <mesh geometry={g.tronco} material={m.roupa} castShadow />
          <Contorno geo={g.tronco} largura={1.4} angulo={60} />
          {/* faixa refletiva */}
          <mesh geometry={g.faixa} material={m.faixa} position={[0, -0.05, 0]} />
          <group position={[0, 0.5, 0]}>
            <mesh geometry={g.cabeca} material={m.pele} castShadow />
            <mesh geometry={g.bone} material={m.escuro} position={[0, 0.01, 0]} />
            <mesh geometry={g.aba} material={m.escuro} position={[0, 0.02, 0]} />
          </group>
          {/* braço de trás (parado) */}
          <group position={[0, 0.2, -OMBRO.z]} rotation={[0, 0, 0.15 - passo * 0.6]}>
            <mesh geometry={g.braco} material={m.roupa} />
          </group>
        </group>
      </group>
      {/* braço que arremessa (lado da câmera) */}
      <group position={[0, OMBRO.y - c.curva * 0.12, OMBRO.z]} rotation={[0, 0, -c.braco]}>
        <mesh geometry={g.braco} material={m.roupa} castShadow />
        <Contorno geo={g.braco} largura={1.3} angulo={60} />
      </group>
    </group>
  );
};
