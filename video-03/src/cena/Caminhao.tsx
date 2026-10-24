// O caminhão compactador: cabine, caixa com placa ejetora, tampa traseira com a pá e a placa deslizante.
import { useMemo } from 'react';
import * as THREE from 'three';
import {
  ANG_BORDA, ANG_FIM, BOTAO, CAIXA, COR, DOBRA, EIXOS, Estado, G_BAIXO, G_TOPO, GUIA_U, PA, RODA, R_FUNDO, V2, dir, pino,
} from '../estado';
import { lerp } from '../tempo';
import { Contorno, Peca, brilho, extrudar, toon } from './base';
import { Fluxo, Haste, Pistao, Placa } from './pecas';

const caixa = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) =>
  new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0).translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);

/** contorno da parede lateral da tampa (plano xy) */
const perfilTampa = () => {
  const s = new THREE.Shape();
  s.moveTo(DOBRA[0], DOBRA[1]);
  s.lineTo(3.35, 3.4);
  s.lineTo(4.05, 1.95);
  const R = R_FUNDO + 0.06;
  s.lineTo(G_BAIXO[0] + R * Math.cos(ANG_BORDA), G_BAIXO[1] + R * Math.sin(ANG_BORDA));
  s.absarc(G_BAIXO[0], G_BAIXO[1], R, ANG_BORDA, ANG_FIM, true);
  s.lineTo(DOBRA[0], 1.1);
  s.lineTo(DOBRA[0], DOBRA[1]);
  return s;
};

const perfilCabine = () => {
  const s = new THREE.Shape();
  s.moveTo(-3.95, 1.0);
  s.lineTo(-3.95, 2.05);
  s.lineTo(-3.72, 2.98);
  s.quadraticCurveTo(-3.7, 3.06, -3.6, 3.06);
  s.lineTo(-2.2, 3.06);
  s.quadraticCurveTo(-2.1, 3.06, -2.1, 2.96);
  s.lineTo(-2.1, 1.0);
  s.lineTo(-3.95, 1.0);
  return s;
};

const janelaCabine = () => {
  const s = new THREE.Shape();
  s.moveTo(-3.78, 2.08);
  s.lineTo(-3.6, 2.82);
  s.lineTo(-2.62, 2.82);
  s.lineTo(-2.62, 2.08);
  s.lineTo(-3.78, 2.08);
  return s;
};

/** faixa curva do fundo da boca */
const fundoBoca = () => {
  const s = new THREE.Shape();
  const r0 = R_FUNDO, r1 = R_FUNDO + 0.06;
  s.moveTo(G_BAIXO[0] + r0 * Math.cos(ANG_BORDA), G_BAIXO[1] + r0 * Math.sin(ANG_BORDA));
  s.absarc(G_BAIXO[0], G_BAIXO[1], r0, ANG_BORDA, ANG_FIM, true);
  s.lineTo(G_BAIXO[0] + r1 * Math.cos(ANG_FIM), G_BAIXO[1] + r1 * Math.sin(ANG_FIM));
  s.absarc(G_BAIXO[0], G_BAIXO[1], r1, ANG_FIM, ANG_BORDA, false);
  return s;
};
const FIM_FUNDO: V2 = [G_BAIXO[0] + 1.03 * Math.cos(ANG_FIM), G_BAIXO[1] + 1.03 * Math.sin(ANG_FIM)];

const Z = CAIXA.z;
const N_GUIA: V2 = [-GUIA_U[1], GUIA_U[0]]; // perpendicular à guia

export const Caminhao: React.FC<{ e: Estado }> = ({ e }) => {
  const g = useMemo(() => ({
    pneu: new THREE.CylinderGeometry(RODA, RODA, 0.36, 40).rotateX(Math.PI / 2),
    aro: new THREE.CylinderGeometry(0.27, 0.27, 0.04, 32).rotateX(Math.PI / 2),
    raios: [0, 1, 2].map((i) => new THREE.BoxGeometry(0.06, 0.46, 0.02).rotateZ((i / 3) * Math.PI)),
    chassi: caixa(-3.75, 3.35, 0.72, 0.98, -0.42, 0.42),
    sub: caixa(CAIXA.x0, CAIXA.x1, 0.98, CAIXA.y0, -0.55, 0.55),
    parachoque: caixa(-4.08, -3.88, 0.72, 1.12, -1.15, 1.15),
    cabine: extrudar(perfilCabine(), 2.3, 0.03).translate(0, 0, -1.15),
    janela: extrudar(janelaCabine(), 0.02, 0).translate(0, 0, 1.152),
    giroflex: new THREE.CylinderGeometry(0.11, 0.13, 0.14, 20).translate(-2.9, 3.13, 0),
    motor: caixa(-3.55, -2.45, 0.62, 1.55, -0.45, 0.45),
    eixoMotor: new THREE.CylinderGeometry(0.05, 0.05, 1, 12).rotateZ(Math.PI / 2),
    bomba: new THREE.CylinderGeometry(0.13, 0.13, 0.3, 24).rotateZ(Math.PI / 2).translate(-1.98, 0.84, 0.3),
    // caixa
    teto: caixa(CAIXA.x0, CAIXA.x1, CAIXA.y1 - 0.06, CAIXA.y1, -Z, Z),
    piso: caixa(CAIXA.x0, CAIXA.x1, CAIXA.y0, CAIXA.y0 + 0.05, -Z, Z),
    frente: caixa(CAIXA.x0, CAIXA.x0 + 0.06, CAIXA.y0, CAIXA.y1, -Z, Z),
    paredeFundo: caixa(CAIXA.x0, CAIXA.x1, CAIXA.y0, CAIXA.y1, -Z, -Z + 0.05),
    paredeFrente: caixa(CAIXA.x0, CAIXA.x1, CAIXA.y0, CAIXA.y1, Z - 0.05, Z),
    ejetora: caixa(-0.06, 0.06, CAIXA.y0 + 0.07, CAIXA.y1 - 0.08, -Z + 0.07, Z - 0.07),
    // tampa
    lado: extrudar(perfilTampa(), 0.05, 0),
    fundo: extrudar(fundoBoca(), 2 * Z - 0.1, 0),
    tanque: caixa(3.15, 4.1, 0.34, 0.66, -0.55, 0.55),
    caixaBotao: caixa(-0.09, 0.09, -0.13, 0.13, -0.04, 0.04),
    botao: new THREE.CylinderGeometry(0.045, 0.045, 0.04, 16).rotateX(Math.PI / 2),
  }), []);

  const m = useMemo(() => ({
    objeto: toon(COR.objeto),
    escuro: toon(COR.escuro),
    sombra: toon(COR.sombra),
    metal: toon('#CFCBC2'),
    interno: toon('#E4DED1'),
    cabine: toon(COR.objeto, { transparent: true }),
    janela: toon('#24324A'),
    paredeCa: toon(COR.objeto, { transparent: true, side: THREE.DoubleSide, depthWrite: false }),
    ladoCa: toon(COR.objeto, { transparent: true, side: THREE.DoubleSide, depthWrite: false }),
    tanque: toon('#EDE8DD', { transparent: true, opacity: 0.45, depthWrite: false }),
    chorume: brilho(COR.move, 2.2),
    luz: brilho(COR.move, 2.6),
    luzApagada: toon(COR.sombra),
    mangueira: toon('#3A4760'),
  }), []);

  const d = e.destaque;
  const corte = e.corte;
  m.paredeCa.opacity = 1 - corte;
  m.paredeCa.visible = corte < 0.995;
  m.ladoCa.opacity = 1 - corte;
  m.ladoCa.visible = corte < 0.995;
  m.cabine.opacity = 1 - 0.65 * e.motorVisivel;
  m.cabine.depthWrite = e.motorVisivel < 0.05;
  const linhaCa = lerp(1, 0.55, corte);

  // giroflex: pisca enquanto o caminhão trabalha
  const trabalhando = e.t > 14 && e.t < 79;
  const piscaGiroflex = trabalhando && Math.sin(e.t * 9) > 0.1;

  // ---- mecanismo da tampa ----
  const pp = pino(e.s);
  const pa: V2 = [pp[0] + PA * Math.cos(e.phi), pp[1] + PA * Math.sin(e.phi)];
  const topoPlaca: V2 = [pp[0] - GUIA_U[0] * 0.78, pp[1] - GUIA_U[1] * 0.78];
  // pistão da placa deslizante (preso no alto)
  const ancora: V2 = [G_TOPO[0] - GUIA_U[0] * 0.32, G_TOPO[1] - GUIA_U[1] * 0.32];
  // pistão da pá (preso na placa, empurra uma alavanca curta atrás da pá)
  const c1: V2 = [pp[0] - GUIA_U[0] * 0.55 + N_GUIA[0] * 0.12, pp[1] - GUIA_U[1] * 0.55 + N_GUIA[1] * 0.12];
  const alav = dir(e.phi + (150 * Math.PI) / 180);
  const c2: V2 = [pp[0] + 0.28 * alav[0], pp[1] + 0.28 * alav[1]];
  const oleoD = e.ativoDesliza * e.oleo;
  const oleoP = e.ativoPa * e.oleo;

  // ---- pistão de levantar a tampa (fora da tampa, lado de cá) ----
  const giraTampa = (p: V2): V2 => {
    const c = Math.cos(e.angTampa), s = Math.sin(e.angTampa);
    const x = p[0] - DOBRA[0], y = p[1] - DOBRA[1];
    return [DOBRA[0] + x * c - y * s, DOBRA[1] + x * s + y * c];
  };
  const topoLev = giraTampa([3.15, 2.75]);

  return (
    <group position={[e.x, 0, 0]} rotation={[0, e.giro, 0]}>
      {/* rodas */}
      {EIXOS.map((x, i) => (
        <group key={i}>
          {[1, -1].map((lado) => (
            <group key={lado} position={[x, RODA, 0.95 * lado]} rotation={[0, 0, e.giroRoda]}>
              <mesh geometry={g.pneu} material={m.escuro} castShadow />
              <Contorno geo={g.pneu} largura={1.6} angulo={50} />
              {(
                <group position={[0, 0, 0.19 * lado]}>
                  <Peca geo={g.aro} mat={m.objeto} largura={1.4} />
                  {g.raios.map((r, k) => <mesh key={k} geometry={r} material={m.sombra} position={[0, 0, 0.025]} />)}
                </group>
              )}
            </group>
          ))}
        </group>
      ))}
      <mesh geometry={g.chassi} material={m.escuro} castShadow />
      <mesh geometry={g.sub} material={m.sombra} castShadow />
      <Peca geo={g.parachoque} mat={m.escuro} largura={1.6} />

      {/* motor (aparece pela cabine) e bomba */}
      <Peca geo={g.motor} mat={m.sombra} quente={d.motor} sombra={false} />
      <mesh geometry={g.eixoMotor} material={m.metal} position={[-2.2, 0.84, 0.3]} scale={[0.5, 1, 1]} />
      <Peca geo={g.bomba} mat={m.objeto} quente={d.bomba} largura={1.6} />

      {/* cabine */}
      <mesh geometry={g.cabine} material={m.cabine} castShadow={e.motorVisivel < 0.05} />
      <Contorno geo={g.cabine} quente={d.cabine} />
      <mesh geometry={g.janela} material={m.janela} />
      <mesh geometry={g.janela} material={m.janela} position={[0, 0, -2.324]} />
      <mesh geometry={g.giroflex} material={piscaGiroflex ? m.luz : m.luzApagada} />

      {/* caixa */}
      <Peca geo={g.teto} mat={m.objeto} quente={d.caixa} />
      <mesh geometry={g.piso} material={m.interno} />
      <Contorno geo={g.piso} quente={d.caixa} />
      <Peca geo={g.frente} mat={m.objeto} quente={d.caixa} />
      <mesh geometry={g.paredeFundo} material={m.interno} />
      <mesh geometry={g.paredeFrente} material={m.paredeCa} />
      <Contorno geo={g.paredeFrente} quente={d.caixa} opacidade={linhaCa} />

      {/* placa ejetora + pistão telescópico */}
      <group position={[e.xEj, 0, 0]}>
        <Peca geo={g.ejetora} mat={m.sombra} quente={d.ejetora} />
      </group>
      <Telescopico x0={CAIXA.x0 + 0.06} x1={e.xEj - 0.06} y={2.45} quente={d.ejetora} />

      {/* tampa traseira (gira na dobradiça) */}
      <group position={[DOBRA[0], DOBRA[1], 0]} rotation={[0, 0, e.angTampa]}>
        <group position={[-DOBRA[0], -DOBRA[1], 0]}>
          <Placa p={DOBRA} q={[3.35, 3.4]} esp={0.06} lz={2 * Z} z={0} mat={m.objeto} quente={d.tampa} />
          <Placa p={[3.35, 3.4]} q={[4.05, 1.95]} esp={0.06} lz={2 * Z} mat={m.objeto} quente={d.tampa} />
          <mesh geometry={g.lado} material={m.interno} position={[0, 0, -Z]} />
          <group position={[0, 0, Z - 0.05]}>
            <mesh geometry={g.lado} material={m.ladoCa} />
            <Contorno geo={g.lado} quente={Math.max(d.tampa, d.boca)} opacidade={linhaCa} />
          </group>
          <group position={[0, 0, -Z + 0.05]}>
            <mesh geometry={g.fundo} material={m.objeto} castShadow />
            <Contorno geo={g.fundo} quente={d.boca} largura={1.8} angulo={40} />
          </group>
          <Placa p={FIM_FUNDO} q={[DOBRA[0], CAIXA.y0 - 0.02]} esp={0.06} lz={2 * Z - 0.1} mat={m.objeto} quente={d.boca} />
          {/* trilhos da placa deslizante */}
          <Placa p={G_TOPO} q={G_BAIXO} esp={0.05} lz={0.05} z={-(Z - 0.1)} mat={m.metal} largura={1.2} />
          {/* placa deslizante e pá */}
          <Placa p={pp} q={topoPlaca} esp={0.07} lz={2 * Z - 0.24} mat={m.sombra} quente={d.pa * 0.6} />
          <Placa p={pp} q={pa} esp={0.08} lz={2 * Z - 0.24} mat={m.objeto} quente={d.pa} />
          <Haste a={[pp[0], pp[1], -Z + 0.1]} b={[pp[0], pp[1], Z - 0.1]} r={0.05} mat={m.metal} />
          {/* pistões da tampa */}
          <Pistao a={[ancora[0], ancora[1], Z - 0.28]} b={[pp[0], pp[1], Z - 0.28]} camisa={0.5} r={0.05} oleo={oleoD} quente={d.pistoes} />
          <Pistao a={[c1[0], c1[1], Z - 0.42]} b={[c2[0], c2[1], Z - 0.42]} camisa={0.34} r={0.058} oleo={oleoP} quente={d.pistoes} />
          {/* botão de comando */}
          <group position={BOTAO}>
            <Peca geo={g.caixaBotao} mat={m.escuro} largura={1.4} />
            <mesh geometry={g.botao} material={e.luzBotao > 0.3 ? m.luz : m.sombra} position={[0, 0.03, 0.05]} />
          </group>
          {/* tanque de chorume (embaixo da boca) */}
          <mesh geometry={g.tanque} material={m.tanque} />
          <Contorno geo={g.tanque} quente={d.tanque} />
          <mesh visible={e.nivelChorume > 0.01} material={m.chorume} position={[3.625, 0.36 + 0.14 * e.nivelChorume, 0]} scale={[0.9, Math.max(0.001, 0.28 * e.nivelChorume), 1.0]}>
            <boxGeometry args={[1, 1, 1]} />
          </mesh>
          <Haste a={[3.75, 0.74, 0.3]} b={[3.75, 0.62, 0.3]} r={0.04} mat={m.metal} />
          <Chorume e={e} />
        </group>
      </group>
      <Pistao a={[2.22, 1.62, Z + 0.08]} b={[topoLev[0], topoLev[1], Z + 0.08]} camisa={1.05} r={0.07} oleo={e.pistaoTampa} />

      {/* mangueiras de óleo */}
      <Mangueiras e={e} m={m.mangueira} />
    </group>
  );
};


/** pistão telescópico da placa ejetora: três estágios */
const Telescopico: React.FC<{ x0: number; x1: number; y: number; quente: number }> = ({ x0, x1, y, quente }) => {
  const m = useMemo(() => ({ a: toon(COR.objeto), b: toon('#E6E1D6'), c: toon('#CFCBC2') }), []);
  const l = Math.max(0.3, x1 - x0);
  const k = l / 3;
  const raios = [0.15, 0.115, 0.085];
  const mats = [m.a, m.b, m.c];
  return (
    <>
      {[0, 1, 2].map((i) => (
        <Haste key={i} a={[x0 + i * k * 0.96, y, 0]} b={[x0 + (i + 1) * k + 0.04, y, 0]} r={raios[i]} mat={mats[i]} contorno quente={quente} />
      ))}
    </>
  );
};

/** mangueiras da bomba até os pistões da tampa e da placa ejetora; o óleo aparece andando no bloco do óleo */
const Mangueiras: React.FC<{ e: Estado; m: THREE.Material }> = ({ e, m }) => {
  const c = useMemo(() => {
    const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
    const tampa = new THREE.CatmullRomCurve3([v(-1.86, 0.84, 0.45), v(-1.6, 0.95, 0.66), v(0.5, 1.0, 0.68), v(2.25, 1.02, 0.7), v(2.5, 1.6, 0.9), v(2.62, 2.9, 0.95), v(2.88, 3.22, 0.92)]);
    const ejetora = new THREE.CatmullRomCurve3([v(-1.86, 0.84, 0.45), v(-1.7, 1.25, 0.6), v(-1.72, 2.0, 0.55), v(-1.76, 2.45, 0.2)]);
    return {
      tampa, ejetora,
      gTampa: new THREE.TubeGeometry(tampa, 80, 0.035, 8),
      gEj: new THREE.TubeGeometry(ejetora, 30, 0.035, 8),
    };
  }, []);
  const vel = 0.55;
  return (
    <>
      <mesh geometry={c.gTampa} material={m} />
      <mesh geometry={c.gEj} material={m} />
      <Fluxo curva={c.tampa} n={46} t={e.t} vel={vel * 0.45} v={e.oleo} r={0.05} />
      <Fluxo curva={c.ejetora} n={14} t={e.t} vel={vel} v={e.oleo} r={0.05} />
    </>
  );
};

/** chorume escorrendo do lixo apertado, pelo fundo da boca, até o tanque */
const Chorume: React.FC<{ e: Estado }> = ({ e }) => {
  const curva = useMemo(() => {
    const pts: THREE.Vector3[] = [new THREE.Vector3(2.45, 1.24, 0.3), new THREE.Vector3(2.75, 1.14, 0.3)];
    for (let a = ANG_FIM + 0.05; a <= -Math.PI / 2; a += 0.12) {
      pts.push(new THREE.Vector3(G_BAIXO[0] + 0.97 * Math.cos(a), G_BAIXO[1] + 0.97 * Math.sin(a), 0.3));
    }
    pts.push(new THREE.Vector3(3.75, 0.7, 0.3), new THREE.Vector3(3.75, 0.5, 0.3));
    return new THREE.CatmullRomCurve3(pts);
  }, []);
  return <Fluxo curva={curva} n={22} t={e.t} vel={0.32} v={e.chorume} r={0.045} />;
};

