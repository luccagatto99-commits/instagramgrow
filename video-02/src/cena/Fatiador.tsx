// O "computador": o cubo da marca é fatiado em camadas e uma delas mostra o caminho do bico.
import { useMemo } from 'react';
import * as THREE from 'three';
import { CAMINHO, COR, Estado, FATIA, LADO, Y_MESA } from '../estado';
import { lerp, saida } from '../tempo';
import { Contorno, toon } from './base';

const N = 8;
export const Fatiador: React.FC<{ e: Estado }> = ({ e }) => {
  const g = useMemo(() => ({ fatia: new THREE.BoxGeometry(0.55, 0.55 / N - 0.004, 0.55) }), []);
  const m = useMemo(() => ({ fatia: toon(COR.objeto), linha: new THREE.LineBasicMaterial({ color: COR.rotulo }) }), []);
  const linha = useMemo(() => {
    const k = 0.55 / LADO;
    const pts = CAMINHO.map((p) => new THREE.Vector3(p.x * k, 0, p.y * k));
    return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), m.linha);
  }, [m.linha]);
  if (e.fatia <= 0.001) return null;
  const s = saida(e.fatia);
  const v = saida(e.voa);
  // as fatias se afastam; depois encolhem e voam para a mesa
  const alvo = new THREE.Vector3(0, Y_MESA + 0.1, 0.14);
  const base = new THREE.Vector3(FATIA.x, FATIA.y, FATIA.z).lerp(alvo, v);
  const giro = e.t * 0.4;
  const nPontos = Math.max(2, Math.floor(e.tracado * CAMINHO.length));
  linha.geometry.setDrawRange(0, nPontos);
  return (
    <group position={base} scale={s * lerp(1, 0.2, v)} rotation={[0.35, giro, 0]}>
      {Array.from({ length: N }, (_, i) => {
        const y = (i - (N - 1) / 2) * (0.55 / N) * (1 + 1.1 * saida(e.separa));
        const destaque = i === 3;
        return (
          <group key={i} position={[0, y, 0]}>
            <mesh geometry={g.fatia} material={m.fatia} castShadow />
            <Contorno geo={g.fatia} largura={1.6} />
            {destaque && e.tracado > 0 && <primitive object={linha} position={[0, 0.55 / N / 2 + 0.003, 0]} />}
          </group>
        );
      })}
    </group>
  );
};
