// Vista de detalhe de UM botão, grande e cortado ao meio: cúpula de borracha, carbono e o pente de trilhas.
import { useMemo } from 'react';
import * as THREE from 'three';
import { COR, DETALHE, Estado } from '../estado';
import { lerp, saida } from '../tempo';
import { Contorno, Peca, brilho, toon } from './base';

const TOPO = 0.54; // topo da placa
const CURSO = 0.25; // quanto o botão desce até o carbono tocar o pente

// caminhos da corrente (no plano da placa, x e z locais)
const A_PTS = [new THREE.Vector2(-0.85, -0.28), new THREE.Vector2(-0.3, -0.28), new THREE.Vector2(-0.05, -0.28), new THREE.Vector2(-0.05, 0.1)];
const B_PTS = [new THREE.Vector2(0.05, -0.1), new THREE.Vector2(0.05, 0.28), new THREE.Vector2(-0.3, 0.28), new THREE.Vector2(-0.85, 0.28)];

const aoLongo = (pts: THREE.Vector2[], s: number) => {
  let r = s;
  for (let i = 0; i + 1 < pts.length; i++) {
    const l = pts[i].distanceTo(pts[i + 1]);
    if (r <= l) return pts[i].clone().lerp(pts[i + 1], r / l);
    r -= l;
  }
  return pts[pts.length - 1].clone();
};
const comp = (pts: THREE.Vector2[]) => pts.slice(1).reduce((s, p, i) => s + p.distanceTo(pts[i]), 0);

export const Detalhe: React.FC<{ e: Estado }> = ({ e }) => {
  const g = useMemo(() => {
    const caixa = (sx: number, sz: number, x: number, z: number, h = 0.014) => new THREE.BoxGeometry(sx, h, sz).translate(x, TOPO + h / 2, z);
    // pente A (espinha atrás) e pente B (espinha na frente), dedos intercalados
    const penteA = [caixa(0.62, 0.04, -0.0, -0.28), ...[-0.25, -0.05, 0.15].map((x) => caixa(0.04, 0.5, x, -0.04))];
    const penteB = [caixa(0.62, 0.04, 0.0, 0.28), ...[-0.15, 0.05, 0.25].map((x) => caixa(0.04, 0.5, x, 0.04))];
    const trilhaA = caixa(0.55, 0.04, -0.575, -0.28);
    const trilhaB = caixa(0.55, 0.04, -0.575, 0.28);
    return {
      placa: new THREE.BoxGeometry(1.8, 0.08, 1.1).translate(0, TOPO - 0.04, 0),
      penteA, penteB, trilhaA, trilhaB,
      // cúpula de borracha cortada ao meio (só a metade x ≥ 0)
      saia: new THREE.CylinderGeometry(0.3, 0.48, 0.3, 48, 1, true, 0, Math.PI).translate(0, 0.15, 0),
      aba: new THREE.CylinderGeometry(0.56, 0.56, 0.03, 48, 1, false, 0, Math.PI).translate(0, 0.015, 0),
      tampo: new THREE.CylinderGeometry(0.3, 0.3, 0.14, 48, 1, false, 0, Math.PI).translate(0, 0.37, 0),
      corteTampo: new THREE.PlaneGeometry(0.6, 0.14).rotateY(-Math.PI / 2).translate(0, 0.37, 0),
      pilula: new THREE.CylinderGeometry(0.13, 0.13, 0.035, 40, 1, false, 0, Math.PI).translate(0, 0.283, 0),
      cortePilula: new THREE.PlaneGeometry(0.26, 0.035).rotateY(-Math.PI / 2).translate(0, 0.283, 0),
    };
  }, []);
  const m = useMemo(() => ({
    placa: toon('#E9E3D6'),
    trilha: toon(COR.sombra),
    trilhaB: toon(COR.sombra),
    borracha: toon('#E6E0D3', { side: THREE.DoubleSide }),
    corte: toon('#D3CCBD', { side: THREE.DoubleSide }),
    carbono: toon(COR.carbono, { side: THREE.DoubleSide }),
    ponto: brilho(COR.move, 2.6),
  }), []);
  if (e.detalhe <= 0.001) return null;
  const s = saida(e.detalhe);
  const d = e.destaque;
  const desce = CURSO * e.aperto;
  const comprime = (0.3 - desce) / 0.3;
  // corrente: as trilhas ficam laranja
  for (const mt of [m.trilha, m.trilhaB]) {
    mt.color.set(COR.sombra).lerp(new THREE.Color(COR.move), e.corrente);
    mt.emissive = new THREE.Color(COR.move);
    mt.emissiveIntensity = 1.1 * e.corrente;
  }
  const pontos: JSX.Element[] = [];
  if (e.corrente > 0.01) {
    [A_PTS, B_PTS].forEach((pts, j) => {
      const L = comp(pts);
      for (let k = 0; k < 4; k++) {
        const p = aoLongo(pts, ((e.t * 0.5 + k / 4 + j * 0.13) % 1) * L);
        pontos.push(
          <mesh key={`${j}${k}`} material={m.ponto} position={[p.x, TOPO + 0.03, p.y]} scale={e.corrente}>
            <sphereGeometry args={[0.03, 12, 8]} />
          </mesh>,
        );
      }
    });
  }
  return (
    <group position={[DETALHE.x, DETALHE.y, DETALHE.z]} scale={s}>
      {/* pedaço da placa com o pente */}
      <group position={[0, -0.04 * d.trilhas, 0]}>
        <Peca geo={g.placa} mat={m.placa} />
        {[...g.penteA, g.trilhaA].map((geo, i) => <Peca key={`a${i}`} geo={geo} mat={m.trilha} quente={d.trilhas} largura={1.4} />)}
        {[...g.penteB, g.trilhaB].map((geo, i) => <Peca key={`b${i}`} geo={geo} mat={m.trilhaB} quente={d.trilhas} largura={1.4} />)}
        {pontos}
      </group>
      {/* botão de borracha (cúpula) sobre o pente */}
      <group position={[0, TOPO, 0]}>
        <Peca geo={g.aba} mat={m.borracha} quente={d.botao} largura={1.6} />
        <group scale={[1, comprime, 1]}>
          <mesh geometry={g.saia} material={m.borracha} castShadow />
          <Contorno geo={g.saia} quente={d.botao} largura={1.6} angulo={60} />
        </group>
        <group position={[0, -desce, 0]}>
          <Peca geo={g.tampo} mat={m.borracha} quente={d.botao} largura={1.6} />
          <mesh geometry={g.corteTampo} material={m.corte} />
          <group position={[0, -0.02 * d.carbono, 0]}>
            <Peca geo={g.pilula} mat={m.carbono} quente={d.carbono} largura={1.8} />
            <mesh geometry={g.cortePilula} material={m.carbono} />
          </group>
        </group>
      </group>
    </group>
  );
};

export { lerp };
