// Sacos de lixo soltos (chão, mão do coletor, boca) e o lixo já compactado dentro da caixa, que vira o monte no aterro.
import { useMemo } from 'react';
import * as THREE from 'three';
import { CAIXA, COR, DESCARGA, DX_MASSA, Estado, X_FUNDO, ejetora, posSaco, sacos } from '../estado';
import { aleatorio, clamp, lerp, prog, suave } from '../tempo';
import { Contorno, toon } from './base';

const SACO = new THREE.IcosahedronGeometry(1, 1);
SACO.computeVertexNormals(); // faces chapadas: cara de saco amassado
const NO = new THREE.ConeGeometry(0.28, 0.5, 6).translate(0, 1.05, 0);

export const SacosSoltos: React.FC<{ e: Estado }> = ({ e }) => {
  const m = useMemo(() => toon(COR.saco), []);
  return (
    <>
      {sacos().map((k) => {
        const p = posSaco(k, e.t);
        if (!p || p.esc < 0.01) return null;
        const s = 0.21 * k.tam * p.esc;
        return (
          <group key={k.id} position={p.p} rotation={[0.3 * Math.sin(p.giro), p.giro, 0.25 * Math.cos(p.giro * 1.3)]} scale={[s, s * 0.88, s]}>
            <mesh geometry={SACO} material={m} castShadow />
            <mesh geometry={NO} material={m} />
            <Contorno geo={SACO} largura={1.3} angulo={25} />
          </group>
        );
      })}
    </>
  );
};

// grade do lixo compactado: colunas em x (a partir da placa ejetora), linhas em y, fileiras em z
const LINHAS = 6, FILEIRAS = 6, COLUNAS = 9;
const N = LINHAS * FILEIRAS * COLUNAS;

export const Massa: React.FC<{ e: Estado }> = ({ e }) => {
  const dados = useMemo(() => {
    const r = aleatorio(23);
    return Array.from({ length: N }, (_, i) => {
      const col = Math.floor(i / (LINHAS * FILEIRAS));
      const lin = Math.floor(i / FILEIRAS) % LINHAS;
      const fil = i % FILEIRAS;
      // destino no monte do aterro (cone atrás do caminhão)
      const raio = 1.7 * Math.sqrt(r()), a = r() * Math.PI * 2;
      const alturaMax = 1.25 * (1 - raio / 1.7);
      return {
        col,
        y: CAIXA.y0 + 0.2 + lin * 0.34 + (r() - 0.5) * 0.06,
        z: -0.92 + fil * 0.37 + (r() - 0.5) * 0.06,
        dx: (r() - 0.5) * 0.06,
        sx: 0.2 + r() * 0.05, sy: 0.15 + r() * 0.04, sz: 0.2 + r() * 0.05,
        rot: [r() * 6, r() * 6, r() * 6] as [number, number, number],
        cor: ['#4A5770', '#3D485E', '#586580', '#4F5B73'][Math.floor(r() * 4)],
        monte: [4.6 + raio * Math.cos(a), 0.14 + alturaMax * r(), raio * Math.sin(a) * 0.8] as [number, number, number],
        atraso: r() * 0.25,
      };
    });
  }, []);
  const inst = useMemo(() => {
    const im = new THREE.InstancedMesh(SACO, toon('#ffffff'), N);
    im.frustumCulled = false;
    im.castShadow = true;
    const c = new THREE.Color();
    dados.forEach((d, i) => im.setColorAt(i, c.set(d.cor)));
    return im;
  }, [dados]);
  const o = useMemo(() => new THREE.Object3D(), []);

  const des = DESCARGA();
  const descarregando = e.t >= des.a;
  // quantas colunas existem: no carregamento depende da placa ejetora; na descarga fica fixo
  const xe = e.xEj;
  const xeCheio = ejetora(des.a);
  const nCol = (X_FUNDO - (descarregando ? xeCheio : xe) - 0.17) / DX_MASSA + 1;
  const fim = prog(e.t, des.b - 0.3, 0.7);

  dados.forEach((d, i) => {
    const vis = clamp(nCol - d.col);
    if (vis <= 0.001) {
      o.scale.setScalar(0.0001);
    } else {
      const x = xe + 0.17 + d.col * DX_MASSA + d.dx;
      let p: [number, number, number] = [x, d.y, d.z];
      if (descarregando) {
        // passou da boca: cai no monte
        const f = Math.max(clamp((x - 2.35 - d.atraso) / 0.7), fim);
        if (f > 0) {
          const u = suave(f);
          const saida: [number, number, number] = [2.75, d.y, d.z];
          // o monte fica no chão do aterro: desconta o caminhão andando depois
          p = [lerp(saida[0], d.monte[0], u) - e.x, lerp(saida[1], d.monte[1], u) + Math.sin(u * Math.PI) * 0.5, lerp(saida[2], d.monte[2], u)];
        }
      }
      o.position.set(...p);
      o.rotation.set(...d.rot);
      const k = vis < 1 ? suave(vis) : 1;
      o.scale.set(d.sx * k, d.sy * k, d.sz * k);
    }
    o.updateMatrix();
    inst.setMatrixAt(i, o.matrix);
  });
  inst.instanceMatrix.needsUpdate = true;
  return (
    <group position={[e.x, 0, 0]} rotation={[0, e.giro, 0]}>
      <primitive object={inst} />
    </group>
  );
};
