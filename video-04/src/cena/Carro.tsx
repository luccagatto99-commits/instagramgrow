// Gancho: carro em alta velocidade batendo num muro. Carroceria em "raio-x" (só contorno e um véu claro)
// para ver o boneco e o volante lá dentro; a frente amassa, o boneco vai para a frente e o airbag explode.
import { useMemo } from 'react';
import * as THREE from 'three';
import { COR, carro } from '../estado';
import { Contorno, Peca, brilho, extrudar, toon } from './base';

const LARG = 1.8; // largura do carro (z)

const forma = (pts: [number, number][]) => {
  const s = new THREE.Shape();
  s.moveTo(...pts[0]);
  for (const p of pts.slice(1)) s.lineTo(...p);
  s.closePath();
  return s;
};

// perfil (x para a frente, y para cima); a frente é separada para amassar
const X_CORTE = 0.95;
const CABINE: [number, number][] = [[-2.2, 0.32], [X_CORTE, 0.32], [X_CORTE, 0.98], [0.35, 1.48], [-1.15, 1.5], [-1.95, 1.05], [-2.25, 0.85]];
const CAPO: [number, number][] = [[0, 0.32], [1.25, 0.32], [1.3, 0.72], [1.15, 0.86], [0, 0.98]];

export const Carro: React.FC<{ t: number }> = ({ t }) => {
  const c = carro(t);
  const g = useMemo(() => {
    const cab = extrudar(forma(CABINE), LARG, 0.02).translate(0, 0, -LARG / 2);
    const capo = extrudar(forma(CAPO), LARG, 0.02).translate(0, 0, -LARG / 2);
    return {
      cab, capo,
      roda: new THREE.CylinderGeometry(0.36, 0.36, 0.26, 28).rotateX(Math.PI / 2),
      muro: new THREE.BoxGeometry(0.7, 1.9, 3.4),
      faixa: new THREE.BoxGeometry(1.6, 0.01, 0.14),
      banco: new THREE.BoxGeometry(0.5, 0.14, 0.6),
      encosto: new THREE.BoxGeometry(0.14, 0.75, 0.6),
      tronco: new THREE.CapsuleGeometry(0.17, 0.42, 6, 14),
      cabeca: new THREE.SphereGeometry(0.17, 24, 16),
      volante: new THREE.TorusGeometry(0.2, 0.035, 10, 32),
      bolsa: new THREE.SphereGeometry(1, 28, 20),
      braco: new THREE.CapsuleGeometry(0.06, 0.4, 4, 10),
    };
  }, []);
  const m = useMemo(() => {
    const veu = toon(COR.objeto, { transparent: true, opacity: 0.22, depthWrite: false });
    return { veu, solido: toon(COR.objeto), escuro: toon(COR.escuro), muro: toon(COR.sombra), faixa: new THREE.MeshBasicMaterial({ color: '#2B3A55' }), quente: brilho(COR.move, 2.6), tecido: toon(COR.tecido) };
  }, []);
  if (!c.visivel) return null;

  const amassa = 1 - 0.45 * c.esm; // o capô encolhe contra o muro
  const xMuro = X_CORTE + 1.3 + 0.36; // a frente encosta no muro na hora da batida
  const rodas: [number, number][] = [[-1.45, 0.36], [0.85, 0.36]];
  // boneco: quadril no banco, gira para a frente pelo quadril
  const QUADRIL: [number, number, number] = [-0.62, 0.62, 0.38];
  const ang = -0.75 * c.tronco; // inclina para a frente (+x)
  const volante: [number, number, number] = [0.08, 1.02, 0.38];
  return (
    <group>
      {/* rua */}
      {Array.from({ length: 40 }, (_, i) => (
        <mesh key={i} geometry={g.faixa} material={m.faixa} position={[-48 + i * 2.4, 0.005, 1.6]} />
      ))}
      {/* muro */}
      <group position={[xMuro, 0.95, 0]}>
        <Peca geo={g.muro} mat={m.muro} />
      </group>

      <group position={[c.x, 0, 0]}>
        {/* cabine em raio-x */}
        <mesh geometry={g.cab} material={m.veu} />
        <Contorno geo={g.cab} largura={2.2} />
        {/* capô: amassa contra o muro */}
        <group position={[X_CORTE, 0, 0]} scale={[amassa, 1 - 0.12 * c.esm, 1]}>
          <mesh geometry={g.capo} material={m.veu} />
          <Contorno geo={g.capo} largura={2.2} quente={c.flash} />
        </group>
        {/* rodas */}
        {rodas.map(([x, y], i) => (
          <group key={i} position={[x * (i === 1 ? 1 : 1), y, 0]}>
            {[-1, 1].map((s) => (
              <group key={s} position={[0, 0, s * 0.82]} rotation={[0, 0, -c.giroRodas]}>
                <Peca geo={g.roda} mat={m.escuro} />
                <mesh position={[0.2, 0, s * 0.14]} geometry={g.braco} material={m.solido} rotation={[0, 0, Math.PI / 2]} scale={[0.6, 0.5, 0.6]} />
              </group>
            ))}
          </group>
        ))}
        {/* banco */}
        <Peca geo={g.banco} mat={m.escuro} position={[-0.55, 0.52, 0.38]} />
        <Peca geo={g.encosto} mat={m.escuro} position={[-0.86, 0.92, 0.38]} rotation={[0, 0, 0.18]} />
        {/* volante (olha para trás, para o motorista) */}
        <group position={volante} rotation={[0, Math.PI / 2, 0.45]}>
          <Peca geo={g.volante} mat={m.solido} />
        </group>
        {/* airbag explodindo do volante */}
        {c.bolsa > 0.02 ? (
          <group position={[volante[0] - 0.25 * c.bolsa, volante[1] + 0.08, volante[2]]} scale={[0.26 * c.bolsa, 0.34 * c.bolsa, 0.34 * c.bolsa]}>
            <mesh geometry={g.bolsa} material={m.tecido} />
            <Contorno geo={g.bolsa} angulo={60} largura={1.8} />
          </group>
        ) : null}
        {/* boneco de teste */}
        <group position={QUADRIL} rotation={[0, 0, ang]}>
          <group position={[0, 0.33, 0]}>
            <Peca geo={g.tronco} mat={m.solido} />
          </group>
          <group position={[0.02, 0.78, 0]}>
            <Peca geo={g.cabeca} mat={m.solido} />
          </group>
          {/* braços até o volante */}
          <group position={[0.28, 0.42, 0]} rotation={[0, 0, -1.0 - ang * 0.6]}>
            <mesh geometry={g.braco} material={m.solido} />
          </group>
        </group>
        {/* faísca do impacto no para-choque */}
        {c.flash > 0.02 ? (
          <mesh position={[1.3 * amassa + X_CORTE, 0.6, 0]} scale={0.5 * c.flash} geometry={g.bolsa} material={m.quente} />
        ) : null}
      </group>
    </group>
  );
};

