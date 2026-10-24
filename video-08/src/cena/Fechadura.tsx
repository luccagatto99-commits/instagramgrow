// A fechadura aberta ao meio: corpo, cilindro, 5 colunas de pinos e molas, a chave, a came e a lingueta.
import { useMemo } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {
  COR, CHAVE_BAIXO, Chave, Estado, FURO_TOPO, KB, KE, KT, LAMINA, L_BAIXO, L_CIMA, PROF, PX, R, RF, RP, TOPO, X0, X1, topoChave,
} from '../estado';
import { Contorno, Peca, brilho, toon } from './base';

const dupla = (cor: string) => toon(cor, { side: THREE.DoubleSide });

// ---------- geometrias fixas ----------
const retangulos = (rs: [number, number, number, number][]) =>
  rs.map(([xa, ya, xb, yb]) => {
    const s = new THREE.Shape();
    s.moveTo(xa, ya); s.lineTo(xb, ya); s.lineTo(xb, yb); s.lineTo(xa, yb); s.closePath();
    return s;
  });

/** corpo, parte de cima: perto do corte, um "pente" com os 5 furos abertos para baixo; atrás, bloco maciço
 *  (assim a metade da frente, espelhada, fica fechada por fora) */
const corpoCima = () => {
  const pente = new THREE.Shape();
  pente.moveTo(X0, R);
  for (const px of PX) {
    pente.lineTo(px - RF, R); pente.lineTo(px - RF, FURO_TOPO); pente.lineTo(px + RF, FURO_TOPO); pente.lineTo(px + RF, R);
  }
  pente.lineTo(X1, R); pente.lineTo(X1, TOPO - 0.14); pente.quadraticCurveTo(X1, TOPO, X1 - 0.14, TOPO);
  pente.lineTo(X0 + 0.14, TOPO); pente.quadraticCurveTo(X0, TOPO, X0, TOPO - 0.14); pente.closePath();
  const bloco = new THREE.Shape();
  bloco.moveTo(X0, R); bloco.lineTo(X1, R); bloco.lineTo(X1, TOPO - 0.14); bloco.quadraticCurveTo(X1, TOPO, X1 - 0.14, TOPO);
  bloco.lineTo(X0 + 0.14, TOPO); bloco.quadraticCurveTo(X0, TOPO, X0, TOPO - 0.14); bloco.closePath();
  const a = new THREE.ExtrudeGeometry(pente, { depth: RF, bevelEnabled: false }).translate(0, 0, -RF);
  const b = new THREE.ExtrudeGeometry(bloco, { depth: PROF - RF, bevelEnabled: false }).translate(0, 0, -PROF);
  return mergeGeometries([a, b])!;
};
const corpoBaixo = () => {
  const s = new THREE.Shape();
  const y0 = -0.95;
  s.moveTo(X0, -R); s.lineTo(X1, -R); s.lineTo(X1, y0 + 0.14); s.quadraticCurveTo(X1, y0, X1 - 0.14, y0);
  s.lineTo(X0 + 0.14, y0); s.quadraticCurveTo(X0, y0, X0, y0 + 0.14); s.closePath();
  return new THREE.ExtrudeGeometry(s, { depth: PROF, bevelEnabled: false }).translate(0, 0, -PROF);
};
/** meio-cilindro (z ≤ 0) com eixo em x, de xa a xb */
const meioCilindro = (r: number, xa: number, xb: number) =>
  new THREE.CylinderGeometry(r, r, xb - xa, 40, 1, true, Math.PI / 2, Math.PI).rotateZ(-Math.PI / 2).translate((xa + xb) / 2, 0, 0);
/** meio-cilindro vertical (z ≤ 0): parede de um furo */
const sulco = (r: number, ya: number, yb: number) =>
  new THREE.CylinderGeometry(r, r, yb - ya, 20, 1, true, Math.PI / 2, Math.PI).translate(0, (ya + yb) / 2, 0);
/** meio-disco no plano yz (tampa do fundo do cilindro) */
const meioDisco = (r: number, x: number) => {
  const g = new THREE.CircleGeometry(r, 40, Math.PI / 2, Math.PI); // no plano xy, metade x ≤ 0
  return g.rotateY(-Math.PI / 2).translate(x, 0, 0); // x ≤ 0 vira z ≤ 0
};
/** face do corte do cilindro (z = 0): material em volta do canal da chave e dos furos */
const faceCilindro = () => {
  const topo: [number, number, number, number][] = [];
  let xa = X0;
  for (const px of PX) { topo.push([xa, KT, px - RF, R]); xa = px + RF; }
  topo.push([xa, KT, KE, R]);
  return new THREE.ShapeGeometry(retangulos([[X0, -R, X1, KB], [KE, KB, X1, R], ...topo]));
};

// pino de baixo: ponta arredondada embaixo (encosta na chave)
const pinoBaixo = (l: number) =>
  new THREE.LatheGeometry([new THREE.Vector2(0, 0), new THREE.Vector2(RP * 0.55, 0.012), new THREE.Vector2(RP, 0.07), new THREE.Vector2(RP, l), new THREE.Vector2(0, l)], 24);
const pinoCima = () => new THREE.CylinderGeometry(RP, RP, L_CIMA, 24).translate(0, L_CIMA / 2, 0);
/** mola de altura 1 (esticada por escala) */
const mola = () => {
  const voltas = 7, n = 220;
  const pts = Array.from({ length: n + 1 }, (_, i) => {
    const u = i / n, a = u * voltas * Math.PI * 2;
    return new THREE.Vector3(Math.cos(a) * RP * 0.82, u, Math.sin(a) * RP * 0.82);
  });
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), n, 0.016, 6, false);
};

// chave: lâmina com os cortes (ponta em x = 0, cresce para −x) + cabeça
const laminaGeo = (cortes: number[]) => {
  const s = new THREE.Shape();
  const passo = 0.02;
  s.moveTo(0, CHAVE_BAIXO + 0.12);
  for (let u = 0; u <= LAMINA + 1e-6; u += passo) s.lineTo(-u, topoChave(cortes, u)!);
  s.lineTo(-LAMINA, CHAVE_BAIXO); s.lineTo(-0.12, CHAVE_BAIXO); s.closePath();
  return new THREE.ExtrudeGeometry(s, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.008, bevelSegments: 1 }).translate(0, 0, -0.05);
};
const cabecaGeo = (forma: 'redonda' | 'quadrada' | 'gota') => {
  const cy = -0.12, x = -LAMINA - 0.62;
  const s = new THREE.Shape();
  if (forma === 'quadrada') {
    const h = 0.52, r = 0.1;
    s.moveTo(x - h + r, cy - h); s.lineTo(x + h - r, cy - h); s.quadraticCurveTo(x + h, cy - h, x + h, cy - h + r);
    s.lineTo(x + h, cy + h - r); s.quadraticCurveTo(x + h, cy + h, x + h - r, cy + h); s.lineTo(x - h + r, cy + h);
    s.quadraticCurveTo(x - h, cy + h, x - h, cy + h - r); s.lineTo(x - h, cy - h + r); s.quadraticCurveTo(x - h, cy - h, x - h + r, cy - h);
  } else if (forma === 'gota') {
    s.absellipse(x - 0.08, cy, 0.62, 0.5, 0, Math.PI * 2, false, 0);
  } else {
    s.absarc(x, cy, 0.55, 0, Math.PI * 2, false);
  }
  const furo = new THREE.Path();
  furo.absarc(x - 0.26, cy, 0.12, 0, Math.PI * 2, true);
  s.holes.push(furo);
  const pescoco = new THREE.Shape();
  pescoco.moveTo(-LAMINA - 0.15, CHAVE_BAIXO - 0.04); pescoco.lineTo(-LAMINA + 0.02, CHAVE_BAIXO - 0.04);
  pescoco.lineTo(-LAMINA + 0.02, 0.22); pescoco.lineTo(-LAMINA - 0.15, 0.22); pescoco.closePath();
  return new THREE.ExtrudeGeometry([s, pescoco], { depth: 0.14, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.012, bevelSegments: 1 }).translate(0, 0, -0.07);
};

// came (presa no fundo do cilindro) e lingueta
const cameGeo = () => {
  const s = new THREE.Shape();
  s.absarc(0, 0, 0.5, 0, Math.PI * 2, false);
  const dedo = new THREE.Shape();
  dedo.moveTo(-0.16, 0); dedo.lineTo(0.16, 0); dedo.lineTo(0.12, -0.95); dedo.quadraticCurveTo(0, -1.05, -0.12, -0.95); dedo.closePath();
  return new THREE.ExtrudeGeometry([s, dedo], { depth: 0.16, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 1 })
    .rotateY(Math.PI / 2).translate(X1 + 0.06, 0, 0); // no plano yz
};
const LING = { x: X1 + 0.14, y: -1.22, w: 0.32, h: 0.32, z0: -1.25, z1: 1.35 };
const linguetaGeo = () => new THREE.BoxGeometry(LING.w, LING.h, LING.z1 - LING.z0).translate(LING.x + LING.w / 2, LING.y, (LING.z0 + LING.z1) / 2);
const guiaGeo = () => new THREE.BoxGeometry(0.5, 0.56, 1.0).translate(LING.x + LING.w / 2, LING.y, -1.55);

const g = () => ({
  corpoCima: corpoCima(), corpoBaixo: corpoBaixo(), fundo: new THREE.BoxGeometry(X1 - X0, 2 * R, PROF - R).translate((X0 + X1) / 2, 0, -(R + PROF) / 2),
  casca: meioCilindro(R, X0, X1), tampa: meioDisco(R, X1), face: faceCilindro(),
  canal: new THREE.PlaneGeometry(KE - X0, KT - KB).translate((X0 + KE) / 2, (KT + KB) / 2, -0.075),
  sulcoCorpo: sulco(RF, R, FURO_TOPO), sulcoCil: sulco(RF, KT, R),
  pinosBaixo: L_BAIXO.map(pinoBaixo), pinoCima: pinoCima(), mola: mola(),
  laminas: { sua: laminaGeo([3, 5, 2, 4, 1]), vizinho: laminaGeo([3, 2, 2, 4, 1]), outra: laminaGeo([3, 5, 2, 4, 1]) },
  cabecas: { sua: cabecaGeo('redonda'), vizinho: cabecaGeo('gota'), outra: cabecaGeo('quadrada') },
  came: cameGeo(), lingueta: linguetaGeo(), guia: guiaGeo(),
  linha: new THREE.BoxGeometry(X1 - X0 + 0.5, 0.028, 0.02).translate((X0 + X1) / 2, R, 0.13),
});
let G: ReturnType<typeof g> | null = null;

const materiais = () => ({
  corpo: dupla(COR.objeto), cilindro: dupla('#E4DDCD'), interno: dupla(COR.escuro), canal: dupla('#1E2838'),
  pinoBaixo: toon(COR.objeto), pinoCima: toon(COR.sombra), mola: toon(COR.mola), molaQuente: brilho(COR.move, 2.0),
  chave: toon(COR.objeto), chaveVizinho: toon('#DCD6C8'), chaveOutra: toon('#E9E3D6'),
  came: toon(COR.sombra), lingueta: toon(COR.objeto), guia: toon('#55627A'),
  linha: brilho(COR.move, 2.6), linhaFria: new THREE.MeshBasicMaterial({ color: COR.rotulo, transparent: true }),
  // metade da frente (some quando abre)
  corpoF: toon(COR.objeto, { side: THREE.DoubleSide, transparent: true }), cilindroF: toon('#E4DDCD', { side: THREE.DoubleSide, transparent: true }),
});
let M: ReturnType<typeof materiais> | null = null;

const ChaveMalha: React.FC<{ c: Chave & { ponta: number }; m: ReturnType<typeof materiais>; geo: ReturnType<typeof g> }> = ({ c, m, geo }) => {
  if (c.ponta < -4.55) return null;
  const mat = c.nome === 'sua' ? m.chave : c.nome === 'vizinho' ? m.chaveVizinho : m.chaveOutra;
  return (
    <group position={[c.ponta, 0, 0]}>
      <Peca geo={geo.laminas[c.nome]} mat={mat} largura={1.8} />
      <Peca geo={geo.cabecas[c.nome]} mat={mat} largura={1.8} />
    </group>
  );
};

/** corpo + cilindro (sem pinos); `frente` espelha para a metade da frente */
const Metade: React.FC<{ e: Estado; frente?: boolean }> = ({ e, frente = false }) => {
  const geo = (G ??= g());
  const m = (M ??= materiais());
  const op = frente ? 1 - e.abertura : 1;
  if (frente) { m.corpoF.opacity = op; m.cilindroF.opacity = op; m.corpoF.depthWrite = op > 0.98; m.cilindroF.depthWrite = op > 0.98; }
  if (frente && op < 0.01) return null;
  const corpo = frente ? m.corpoF : m.corpo;
  const cil = frente ? m.cilindroF : m.cilindro;
  const qCorpo = frente ? 0 : e.dest.corpo;
  const qCil = frente ? 0 : e.dest.cilindro;
  const qFuros = frente ? 0 : e.dest.furos;
  return (
    <group scale={[1, 1, frente ? -1 : 1]}>
      <Peca geo={geo.corpoCima} mat={corpo} quente={Math.max(qCorpo, qFuros)} opacidade={op} />
      <Peca geo={geo.corpoBaixo} mat={corpo} quente={qCorpo} opacidade={op} />
      <mesh geometry={geo.fundo} material={corpo} />
      {!frente && PX.map((px, i) => <mesh key={i} geometry={geo.sulcoCorpo} material={m.interno} position={[px, 0, 0]} />)}
      <group rotation={[e.rot, 0, 0]}>
        <mesh geometry={geo.casca} material={cil} castShadow receiveShadow />
        <Contorno geo={geo.casca} quente={qCil} angulo={60} opacidade={op} />
        <mesh geometry={geo.tampa} material={cil} />
        <Peca geo={geo.face} mat={cil} quente={Math.max(qCil, qFuros)} opacidade={op} sombra={false} />
        {!frente && <mesh geometry={geo.canal} material={m.canal} />}
        {!frente && PX.map((px, i) => <mesh key={i} geometry={geo.sulcoCil} material={m.interno} position={[px, 0, 0]} />)}
      </group>
    </group>
  );
};

export const Fechadura: React.FC<{ e: Estado }> = ({ e }) => {
  const geo = (G ??= g());
  const m = (M ??= materiais());
  m.linha.opacity = e.linhaVisivel * e.linhaQuente;
  m.linhaFria.opacity = e.linhaVisivel * (1 - e.linhaQuente) * 0.9;
  const sai = e.abertura; // metade da frente: desliza para a câmera e some
  return (
    <group rotation={[0, e.giroInicial, 0]}>
      <Metade e={e} />
      <group position={[0, 0.25 * sai, 2.2 * sai]}>
        <Metade e={e} frente />
      </group>

      {/* linha de corte: azul quando trava, laranja quando os 5 alinham */}
      <mesh geometry={geo.linha} material={m.linha} />
      <mesh geometry={geo.linha} material={m.linhaFria} />

      {/* pinos de cima + molas (ficam no corpo) */}
      {e.pinos.map((p, i) => {
        const q = Math.max(e.dest.cima, i === 1 ? e.dest.pino2 : 0);
        const topoCima = p.baseCima + L_CIMA;
        return (
          <group key={i}>
            <Peca geo={geo.pinoCima} mat={m.pinoCima} position={[p.px, p.baseCima, 0]} quente={Math.max(q, p.alinhado && e.linhaVisivel > 0.5 ? 0.9 : 0)} largura={1.6} />
            <group position={[p.px, topoCima, 0]} scale={[1, FURO_TOPO - topoCima, 1]}>
              <mesh geometry={geo.mola} material={e.mola > 0.5 ? m.molaQuente : m.mola} />
            </group>
          </group>
        );
      })}

      {/* tudo que gira com o cilindro: pinos de baixo e chave */}
      <group rotation={[e.rot, 0, 0]}>
        {e.pinos.map((p, i) => (
          <Peca key={i} geo={geo.pinosBaixo[i]} mat={m.pinoBaixo} position={[p.px, p.base, 0]} largura={1.6}
            quente={Math.max(e.dest.baixo, i === 1 ? e.dest.pino2 : 0, p.alinhado && e.linhaVisivel > 0.5 ? 0.9 : 0)} />
        ))}
        {e.chaves.map((c) => <ChaveMalha key={c.nome} c={c} m={m} geo={geo} />)}
        <Peca geo={geo.came} mat={m.came} quente={e.dest.came} largura={1.8} />
      </group>

      {/* lingueta: a came puxa para dentro da porta */}
      {e.linguetaVisivel > 0.01 && (
        <group scale={[1, 1, 1]} position={[0, -0.4 * (1 - e.linguetaVisivel), 0]}>
          <Peca geo={geo.guia} mat={m.guia} largura={1.4} />
          <group position={[0, 0, e.lingueta]}>
            <Peca geo={geo.lingueta} mat={m.lingueta} quente={e.dest.lingueta} largura={1.8} />
          </group>
        </group>
      )}
    </group>
  );
};
