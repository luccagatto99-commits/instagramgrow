// A peça impressa aberta ao meio: paredes de fora + preenchimento em favo de mel.
import { useMemo } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { COR, LADO } from '../estado';
import { saida } from '../tempo';
import { Contorno, toon } from './base';

const H = LADO, P = 0.03; // altura e espessura da parede

const hexagonos = () => {
  const r = 0.045; // lado do hexágono
  const gs: THREE.BufferGeometry[] = [];
  const lim = LADO / 2 - P;
  const w = Math.sqrt(3) * r;
  for (let lin = -6; lin <= 6; lin++) {
    for (let col = -6; col <= 6; col++) {
      const cx = col * w + (lin % 2 ? w / 2 : 0), cz = lin * 1.5 * r;
      for (let k = 0; k < 6; k++) {
        const a0 = Math.PI / 6 + (k * Math.PI) / 3, a1 = a0 + Math.PI / 3;
        let p = new THREE.Vector2(cx + r * Math.cos(a0), cz + r * Math.sin(a0));
        let q = new THREE.Vector2(cx + r * Math.cos(a1), cz + r * Math.sin(a1));
        // só a metade x >= 0, dentro das paredes
        if (p.x < 0 && q.x < 0) continue;
        if (p.x < 0 || q.x < 0) {
          const u = -p.x / (q.x - p.x);
          const c = p.clone().lerp(q, u);
          if (p.x < 0) p = c; else q = c;
        }
        if ([p, q].some((v) => Math.abs(v.x) > lim || Math.abs(v.y) > lim)) continue;
        const len = p.distanceTo(q);
        if (len < 0.005) continue;
        const g = new THREE.BoxGeometry(len + 0.008, H - 2 * P, 0.012);
        g.rotateY(-Math.atan2(q.y - p.y, q.x - p.x));
        g.translate((p.x + q.x) / 2, H / 2, (p.y + q.y) / 2);
        gs.push(g);
      }
    }
  }
  return mergeGeometries(gs)!;
};

export const Favo: React.FC<{ abre: number; quente: number }> = ({ abre, quente }) => {
  const g = useMemo(() => {
    const L = LADO, h = L / 2;
    const metade = (x: number, w: number) => x + w / 2; // de x até x+w
    return {
      paredes: mergeGeometries([
        new THREE.BoxGeometry(P, H, L).translate(h - P / 2, H / 2, 0), // fundo da metade (+x)
        new THREE.BoxGeometry(h, H, P).translate(metade(0, h), H / 2, -h + P / 2),
        new THREE.BoxGeometry(h, H, P).translate(metade(0, h), H / 2, h - P / 2),
        new THREE.BoxGeometry(h, P, L).translate(metade(0, h), P / 2, 0), // base
      ])!,
      favo: hexagonos(),
      outra: new THREE.BoxGeometry(h, H, L).translate(-h / 2, H / 2, 0), // a outra metade (fechada)
    };
  }, []);
  const m = useMemo(() => ({ parede: toon(COR.objeto), favo: toon('#E7E2D6'), outra: toon(COR.objeto) }), []);
  const s = saida(abre);
  return (
    <group>
      <mesh geometry={g.paredes} material={m.parede} castShadow />
      <Contorno geo={g.paredes} quente={quente} />
      <mesh geometry={g.favo} material={m.favo} />
      <Contorno geo={g.favo} largura={1.2} />
      {/* a outra metade sai para cima e para trás */}
      <group position={[-0.35 * s, -0.05 * s, -0.9 * s]} rotation={[0, 0.4 * s, 0]}>
        <mesh geometry={g.outra} material={m.outra} castShadow />
        <Contorno geo={g.outra} />
      </group>
    </group>
  );
};
