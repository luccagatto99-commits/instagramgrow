// Volante com o módulo do airbag: aro, raios, miolo em corte, tampa que rasga, gerador de gás em corte
// (iniciador, pastilhas, filtro), bolsa dobrada e bolsa cheia com os dois furos.
import { useMemo } from 'react';
import * as THREE from 'three';
import { C, ARO, CUBO, GERADOR, SACO, COR, Estado } from '../estado';
import { Contorno, Peca, brilho, toon } from './base';
import { Haste } from './pecas';

const MEIO = Math.PI; // metade de um cilindro
// cilindro com eixo em z (o volante olha para +z); `ini` = ângulo inicial da fatia
const cilZ = (r: number, h: number, ini = 0, arco = Math.PI * 2, aberto = false, seg = 48) =>
  new THREE.CylinderGeometry(r, r, h, seg, 1, aberto, ini, arco).rotateX(Math.PI / 2);
// metade de longe (x < 0) e de perto (x > 0): no three o ângulo 0 aponta para +z antes de girar → após girar em x, para -y…
// por isso usamos ini = π (lado -x) e ini = 0 (lado +x)
const LONGE = Math.PI;
const PERTO = 0;

/** material com opacidade controlada por quadro */
const useMat = (cor: string, transparente = true) => useMemo(() => toon(cor, { transparent: transparente }), [cor, transparente]);

export const Volante: React.FC<{ e: Estado; v?: number }> = ({ e, v = 1 }) => {
  const g = useMemo(
    () => ({
      aro: new THREE.TorusGeometry(ARO, 0.13, 18, 72),
      raio: new THREE.BoxGeometry(1, 0.2, 0.14),
      cuboLonge: cilZ(CUBO.r, CUBO.z1 - CUBO.z0, LONGE, MEIO, true),
      cuboPerto: cilZ(CUBO.r, CUBO.z1 - CUBO.z0, PERTO, MEIO, true),
      fundo: new THREE.CircleGeometry(CUBO.r, 48),
      tampaCima: cilZ(CUBO.r, 0.06, Math.PI / 2, MEIO),
      tampaBaixo: cilZ(CUBO.r, 0.06, -Math.PI / 2, MEIO),
      gerParede: cilZ(GERADOR.r, GERADOR.h, 0, Math.PI * 2, true),
      gerTampa: new THREE.CircleGeometry(GERADOR.r, 48),
      iniciador: cilZ(0.065, 0.17),
      pastilha: cilZ(0.034, 0.04, 0, Math.PI * 2, false, 16),
      barra: new THREE.CylinderGeometry(0.012, 0.012, GERADOR.h * 0.9, 6),
      dobra: cilZ(CUBO.r - 0.09, 0.045, LONGE, MEIO),
      dobraPerto: cilZ(CUBO.r - 0.09, 0.045, PERTO, MEIO),
      saco: new THREE.SphereGeometry(1, 40, 28),
      furo: new THREE.TorusGeometry(0.11, 0.035, 10, 24),
    }),
    [],
  );
  const m = {
    objeto: useMat(COR.objeto, false),
    perto: useMat(COR.objeto),
    tampa: useMat(COR.objeto),
    fundo: useMat(COR.sombra, false),
    metal: useMat('#D9D5CC', false),
    metalPerto: useMat('#D9D5CC'),
    tecido: useMat(COR.tecido),
    tecidoPerto: useMat(COR.tecido),
    escuro: useMat(COR.escuro, false),
    quente: useMemo(() => brilho(COR.move, 2.4), []),
  };
  // corte: a metade de cá some (fica só o contorno)
  m.perto.opacity = 1 - e.corte;
  m.perto.depthWrite = e.corte < 0.5;
  m.tampa.opacity = 1 - Math.max(e.corte, e.corteGerador) * 0.92;
  m.tampa.depthWrite = Math.max(e.corte, e.corteGerador) < 0.5;
  m.metalPerto.opacity = 1 - e.corteGerador;
  m.metalPerto.depthWrite = e.corteGerador < 0.5;
  const saco = e.cheio;
  m.tecidoPerto.opacity = e.dobrada ? 1 - e.corteGerador : 1;
  m.tecidoPerto.depthWrite = e.corteGerador < 0.5;
  m.tecido.transparent = true;
  m.tecido.opacity = e.dobrada ? 1 - e.corteGerador : 1;
  m.tecido.depthWrite = e.corteGerador < 0.5;

  const pastilhas = useMemo(() => {
    const out: { p: [number, number, number]; i: number }[] = [];
    let i = 0;
    for (const r of [0.15, 0.25]) {
      const n = r < 0.2 ? 9 : 14;
      for (let k = 0; k < n; k++) {
        const a = (k / n) * Math.PI * 2 + (r < 0.2 ? 0 : 0.2);
        out.push({ p: [Math.cos(a) * r, Math.sin(a) * r, GERADOR.z], i: i++ });
      }
    }
    return out;
  }, []);

  const zG = GERADOR.z;
  const tampaZ = CUBO.z1 + 0.03;
  const abre = e.abreTampa * 1.9; // rad
  const sacoZ = 0.3 + 0.55 * saco;
  return (
    <group visible={v > 0.5} position={[C[0] + e.xEntrada + e.tremor * 0.4, C[1] + e.tremor, C[2]]} rotation={[0, e.giro, 0]}>
      {/* coluna de direção */}
      <Haste a={[0, 0, CUBO.z0 - 0.02]} b={[0, -1.25, -2.4]} r={0.15} mat={m.escuro} contorno />
      {/* aro e raios */}
      <Peca geo={g.aro} mat={m.objeto} />
      {[
        { p: [-0.98, -0.05, -0.05], r: 0.12 },
        { p: [0.98, -0.05, -0.05], r: -0.12 },
        { p: [0, -1.06, -0.05], r: Math.PI / 2 },
      ].map((k, i) => (
        <group key={i} position={k.p as [number, number, number]} rotation={[0, 0, k.r]} scale={[i === 2 ? 0.72 : 0.78, 1, 1]}>
          <Peca geo={g.raio} mat={m.objeto} />
        </group>
      ))}
      {/* miolo: fundo, metade de longe (sempre) e metade de perto (some no corte) */}
      <mesh geometry={g.fundo} material={m.fundo} position={[0, 0, CUBO.z0]} rotation={[0, 0, 0]} />
      <group position={[0, 0, (CUBO.z0 + CUBO.z1) / 2]}>
        <Peca geo={g.cuboLonge} mat={m.objeto} />
        <mesh geometry={g.cuboPerto} material={m.perto} />
        <Contorno geo={g.cuboPerto} opacidade={1} />
      </group>
      {/* tampa em duas abas: rasga na linha do meio e abre para cima e para baixo */}
      <group position={[0, CUBO.r, tampaZ]} rotation={[-abre, 0, 0]}>
        <group position={[0, -CUBO.r, 0]}>
          <mesh geometry={g.tampaCima} material={m.tampa} />
          <Contorno geo={g.tampaCima} opacidade={1} quente={e.destTampa} />
        </group>
      </group>
      <group position={[0, -CUBO.r, tampaZ]} rotation={[abre, 0, 0]}>
        <group position={[0, CUBO.r, 0]}>
          <mesh geometry={g.tampaBaixo} material={m.tampa} />
          <Contorno geo={g.tampaBaixo} opacidade={1} quente={e.destTampa} />
        </group>
      </group>

      {/* cápsula (gerador de gás): na vista explodida sai para a frente */}
      <group position={[0, 0, e.sobeCapsula * 0.85]}>
      <group position={[0, 0, zG]}>
        <Peca geo={g.gerParede} mat={m.metal} quente={e.destCapsula} />
        <mesh geometry={g.gerTampa} material={m.fundo} position={[0, 0, -GERADOR.h / 2]} />
        <mesh geometry={g.gerTampa} material={m.metalPerto} position={[0, 0, GERADOR.h / 2]} />
      </group>
      {/* filtro: grade de barrinhas na metade de longe */}
      {Array.from({ length: 26 }, (_, k) => {
        const a = (k / 26) * Math.PI * 2;
        return <mesh key={k} geometry={g.barra} material={m.escuro} position={[Math.cos(a) * 0.36, Math.sin(a) * 0.36, zG]} rotation={[Math.PI / 2, 0, 0]} />;
      })}
      {/* pastilhas */}
      {pastilhas.map(({ p, i }) => {
        const aceso = e.pastilhaAcesa(i, pastilhas.length);
        const s = e.pastilhaTam;
        if (s < 0.03) return null;
        return (
          <group key={i} position={p} scale={[s, s, s]}>
            <mesh geometry={g.pastilha} material={aceso > 0.5 ? m.quente : m.escuro} />
          </group>
        );
      })}
      {/* iniciador (espoleta) */}
      <group position={[0, 0, zG - 0.02]}>
        <mesh geometry={g.iniciador} material={e.iniciador > 0.3 ? m.quente : m.escuro} />
      </group>
      </group>

      {/* bolsa dobrada (some quando enche) */}
      {e.dobrada || saco < 0.05
        ? [0, 1, 2, 3].map((k) => (
            <group key={k} position={[0, e.sobeBolsa * 1.2, 0.02 + k * 0.055 + e.sobeBolsa * 0.6]}>
              <mesh geometry={g.dobra} material={m.tecido} />
              <Contorno geo={g.dobra} largura={1.6} opacidade={1 - e.corteGerador * 0.85} quente={e.destBolsa} />
              {e.corte < 0.98 ? <><mesh geometry={g.dobraPerto} material={m.tecidoPerto} /><Contorno geo={g.dobraPerto} largura={1.6} opacidade={1 - e.corteGerador * 0.85} quente={e.destBolsa} /></> : null}
            </group>
          ))
        : null}
      {/* bolsa cheia */}
      {saco > 0.02 ? (
        <group position={[0, 0.05, sacoZ]} scale={[SACO.rx * (0.55 + 0.45 * saco), SACO.ry * (0.55 + 0.45 * saco), SACO.rz * saco]}>
          <mesh geometry={g.saco} material={m.tecido} castShadow />
          <Contorno geo={g.saco} angulo={60} largura={1.6} />
        </group>
      ) : null}
      {/* furos atrás da bolsa */}
      {saco > 0.3
        ? [-1, 1].map((s) => (
            <group key={s} position={[s * 0.62 * SACO.rx * (0.55 + 0.45 * saco), 0.42, sacoZ - SACO.rz * saco * 0.62]} rotation={[0, s * 0.9, 0]}>
              <mesh geometry={g.furo} material={e.furos > 0.5 ? m.quente : m.escuro} />
            </group>
          ))
        : null}
    </group>
  );
};
