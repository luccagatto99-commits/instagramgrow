import { useMemo } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { BOTOES, Botao, CHIP, COR, Estado, H, RAIO, VOLMAIS, W, Y_LED } from '../estado';
import { clamp, lerp } from '../tempo';
import { Contorno, Peca, brilho, caminhoArredondado, extrudar, retanguloArredondado, toon } from './base';
import { acesoLED } from './pulsos';

// ---- alturas (z local, controle montado) ----
const Z_FUNDO = -0.2; // bandeja de -0.2 a 0
const Z_PLACA = 0.004; // placa de 0.004 a 0.026
const TOPO_PLACA = 0.026;
const Z_BORRACHA = 0.03; // lâmina de 0.03 a 0.05
const Z_TAMPA = 0.05; // tampa de 0.05 a 0.13

const formaBotao = (b: Botao, folga = 0) => {
  if (b.redondo) {
    const s = new THREE.Shape();
    s.absarc(b.x, b.y, b.w / 2 + folga, 0, Math.PI * 2, false);
    return s;
  }
  return retanguloArredondado(b.w + folga * 2, b.h + folga * 2, 0.03 + folga, b.x, b.y);
};
const furoBotao = (b: Botao, folga: number) => {
  if (b.redondo) {
    const p = new THREE.Path();
    p.absarc(b.x, b.y, b.w / 2 + folga, 0, Math.PI * 2, true);
    return p;
  }
  return caminhoArredondado(b.w + folga * 2, b.h + folga * 2, 0.03 + folga, b.x, b.y);
};

// trilhas: do pente de cada botão até o chip
const rotaTrilha = (b: Botao, i: number): THREE.Vector2[] => {
  const o = ((i % 5) - 2) * 0.012;
  const yb = 0.36 + (i % 6) * 0.011;
  const xs = CHIP.x + (b.x < -0.01 ? -0.05 : b.x > 0.01 ? 0.05 : 0) + o * 0.6;
  return [new THREE.Vector2(b.x + o, b.y - b.h / 2 - 0.01), new THREE.Vector2(b.x + o, yb), new THREE.Vector2(xs, yb), new THREE.Vector2(xs, CHIP.y + CHIP.l / 2)];
};
export const ROTAS = BOTOES.filter((b) => b.y > 0.4).map((b, i) => ({ b, pts: rotaTrilha(b, i) }));
export const ROTA_LED = [
  new THREE.Vector2(CHIP.x + CHIP.l / 2, CHIP.y), new THREE.Vector2(0.27, CHIP.y), new THREE.Vector2(0.27, 2.2),
  new THREE.Vector2(0.05, 2.27), new THREE.Vector2(0.0, Y_LED - 0.06),
];

const segmentos = (pts: THREE.Vector2[], larg = 0.008, z = TOPO_PLACA + 0.001) => {
  const gs: THREE.BufferGeometry[] = [];
  for (let i = 0; i + 1 < pts.length; i++) {
    const a = pts[i], b = pts[i + 1];
    const len = a.distanceTo(b);
    const g = new THREE.BoxGeometry(len + larg, larg, 0.002);
    g.rotateZ(Math.atan2(b.y - a.y, b.x - a.x));
    g.translate((a.x + b.x) / 2, (a.y + b.y) / 2, z);
    gs.push(g);
  }
  return gs;
};
// pente duplo (dois caminhos que quase se encostam) sob o botão
const pente = (b: Botao) => {
  const gs: THREE.BufferGeometry[] = [];
  const w = Math.min(b.w, b.h) * 0.75, z = TOPO_PLACA + 0.0012;
  const caixa = (cx: number, cy: number, sx: number, sy: number) => {
    const g = new THREE.BoxGeometry(sx, sy, 0.0024);
    g.translate(cx, cy, z);
    gs.push(g);
  };
  caixa(b.x - w / 2, b.y, 0.008, w); // espinha esquerda
  caixa(b.x + w / 2, b.y, 0.008, w); // espinha direita
  for (let k = 0; k < 4; k++) {
    const y = b.y - w / 2 + (k + 0.5) * (w / 4);
    caixa(k % 2 ? b.x + 0.006 : b.x - 0.006, y, w - 0.014, 0.007);
  }
  return gs;
};

/** posição de um ponto ao longo de uma rota, pelo comprimento */
export const aoLongo = (pts: THREE.Vector2[], s: number) => {
  let rest = s;
  for (let i = 0; i + 1 < pts.length; i++) {
    const l = pts[i].distanceTo(pts[i + 1]);
    if (rest <= l) return pts[i].clone().lerp(pts[i + 1], rest / l);
    rest -= l;
  }
  return pts[pts.length - 1].clone();
};
const comprimento = (pts: THREE.Vector2[]) => pts.slice(1).reduce((s, p, i) => s + p.distanceTo(pts[i]), 0);

export const Controle: React.FC<{ e: Estado }> = ({ e }) => {
  const g = useMemo(() => {
    const borda = retanguloArredondado(W, H, RAIO, 0, H / 2);
    // tampa com furos dos botões
    const sTampa = retanguloArredondado(W, H, RAIO, 0, H / 2);
    BOTOES.forEach((b) => sTampa.holes.push(furoBotao(b, 0.018)));
    const tampa = extrudar(sTampa, 0.08, 0.014).translate(0, 0, Z_TAMPA);
    // janela escura do infravermelho na ponta
    const janela = new THREE.BoxGeometry(0.3, 0.045, 0.07).translate(0, H - 0.01, Z_TAMPA + 0.04);
    // lâmina de borracha + botões
    const lamina = extrudar(retanguloArredondado(W - 0.06, H - 0.06, RAIO - 0.03, 0, H / 2), 0.02, 0.004).translate(0, 0, Z_BORRACHA);
    const outros = BOTOES.filter((b) => b.id !== 'vol+');
    const botoes = mergeGeometries(outros.map((b) => extrudar(formaBotao(b), 0.1, 0.012).translate(0, 0, Z_BORRACHA + 0.02)))!;
    const volMais = extrudar(formaBotao(VOLMAIS), 0.1, 0.012).translate(0, 0, Z_BORRACHA + 0.02);
    const pilula = (b: Botao) => new THREE.CylinderGeometry(Math.min(b.w, b.h) * 0.36, Math.min(b.w, b.h) * 0.36, 0.01, 24).rotateX(Math.PI / 2).translate(b.x, b.y, Z_BORRACHA - 0.004);
    const carbonos = mergeGeometries(outros.map(pilula))!;
    const carbonoVol = pilula(VOLMAIS);
    // placa
    const placa = extrudar(retanguloArredondado(W - 0.08, H - 0.1, RAIO - 0.04, 0, H / 2), 0.022, 0.003).translate(0, 0, Z_PLACA);
    const trilhas = mergeGeometries([
      ...ROTAS.filter((r) => r.b.id !== 'vol+').flatMap((r) => segmentos(r.pts)),
      ...segmentos(ROTA_LED),
      ...outros.filter((b) => b.y > 0.4).flatMap(pente),
    ])!;
    const rotaVol = ROTAS.find((r) => r.b.id === 'vol+')!.pts;
    const trilhaVol = mergeGeometries([...segmentos(rotaVol), ...pente(VOLMAIS)])!;
    const chip = new THREE.BoxGeometry(CHIP.l, CHIP.l, 0.035).translate(CHIP.x, CHIP.y, TOPO_PLACA + 0.0175);
    const pinos = mergeGeometries(
      Array.from({ length: 28 }, (_, i) => {
        const lado = Math.floor(i / 7), k = (i % 7) - 3;
        const p = new THREE.BoxGeometry(lado % 2 ? 0.03 : 0.012, lado % 2 ? 0.012 : 0.03, 0.006);
        const d = CHIP.l / 2 + 0.012;
        const [x, y] = [[k * 0.021, d], [d, k * 0.021], [k * 0.021, -d], [-d, k * 0.021]][lado];
        return p.translate(CHIP.x + x, CHIP.y + y, TOPO_PLACA + 0.004);
      }),
    )!;
    const ressonador = extrudar(retanguloArredondado(0.09, 0.045, 0.02, 0.21, 0.2), 0.04, 0.006).translate(0, 0, TOPO_PLACA);
    const capacitor = new THREE.CylinderGeometry(0.03, 0.03, 0.075, 24).rotateX(Math.PI / 2).translate(-0.21, 0.2, TOPO_PLACA + 0.0375);
    const transistor = new THREE.CylinderGeometry(0.03, 0.03, 0.045, 24, 1, false, 0, Math.PI).rotateX(Math.PI / 2).translate(0.16, 2.2, TOPO_PLACA + 0.0225);
    // LED deitado na ponta, apontando para +y
    const ledCorpo = new THREE.CylinderGeometry(0.036, 0.036, 0.06, 28).translate(0, Y_LED - 0.03, TOPO_PLACA + 0.04);
    const ledCupula = new THREE.SphereGeometry(0.036, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2).translate(0, Y_LED, TOPO_PLACA + 0.04);
    const ledPernas = mergeGeometries([-0.014, 0.014].map((x) => new THREE.CylinderGeometry(0.005, 0.005, 0.07, 8).translate(x, Y_LED - 0.095, TOPO_PLACA + 0.03)))!;
    // fundo (bandeja) com pilhas
    const sParede = retanguloArredondado(W, H, RAIO, 0, H / 2);
    sParede.holes.push(caminhoArredondado(W - 0.07, H - 0.07, RAIO - 0.035, 0, H / 2));
    const parede = extrudar(sParede, 0.17, 0.01).translate(0, 0, Z_FUNDO + 0.03);
    const piso = extrudar(borda, 0.03, 0.01).translate(0, 0, Z_FUNDO);
    const pilha = new THREE.CylinderGeometry(0.075, 0.075, 0.6, 32);
    const faixa = new THREE.CylinderGeometry(0.0765, 0.0765, 0.16, 32).translate(0, 0.22, 0);
    const polo = new THREE.CylinderGeometry(0.028, 0.028, 0.03, 20).translate(0, 0.315, 0);
    const mola = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(Array.from({ length: 60 }, (_, i) => {
        const a = i * 0.55;
        return new THREE.Vector3(Math.cos(a) * 0.045, -i * 0.0012, Math.sin(a) * 0.045);
      })),
      120, 0.006, 6,
    );
    return { tampa, janela, lamina, botoes, volMais, carbonos, carbonoVol, placa, trilhas, trilhaVol, rotaVol, chip, pinos, ressonador, capacitor, transistor, ledCorpo, ledCupula, ledPernas, parede, piso, pilha, faixa, polo, mola };
  }, []);

  const m = useMemo(() => ({
    objeto: toon(COR.objeto),
    borracha: toon('#E6E0D3'),
    placa: toon('#E9E3D6'),
    trilha: toon(COR.sombra),
    trilhaVol: toon(COR.sombra),
    escuro: toon('#2A3446'),
    carbono: toon(COR.carbono),
    metal: toon('#CFCBC2'),
    sombra: toon(COR.sombra),
    led: toon('#F7F4EE', { transparent: true, opacity: 0.92 }),
    ledAceso: brilho(COR.move, 2.6),
    ponto: brilho(COR.move, 2.6),
    janela: toon('#3A4558'),
  }), []);

  const { off, destaque: d } = e;
  // corrente acende as trilhas do VOL+
  m.trilhaVol.color.set(COR.sombra).lerp(new THREE.Color(COR.move), e.corrente);
  m.trilhaVol.emissive = new THREE.Color(COR.move);
  m.trilhaVol.emissiveIntensity = 1.2 * e.corrente;

  // levanta (y) e afasta um pouco (z) a camada em destaque
  const sobe = (k: number): [number, number, number] => [0, 0.22 * k, 0.1 * k];
  const camada = (z: number, k: number, x = 0): [number, number, number] => {
    const s = sobe(k);
    return [x + s[0], s[1], z + s[2]];
  };

  // botão VOL+: desce até o carbono tocar o pente da placa
  const pilulaZ = Z_BORRACHA - 0.008 + off.borracha;
  const alvoZ = TOPO_PLACA + 0.0035 + off.placa;
  const desce = (alvoZ - pilulaZ) * e.aperto;

  // pontos de corrente correndo nas trilhas (até o chip)
  const pontos: JSX.Element[] = [];
  const corre = (pts: THREE.Vector2[], fase: number, v: number, key: string) => {
    const L = comprimento(pts);
    for (let k = 0; k < 3; k++) {
      const s = ((e.t * 0.55 + fase + k / 3) % 1) * L;
      const p = aoLongo(pts, s);
      pontos.push(
        <mesh key={`${key}${k}`} material={m.ponto} position={[p.x, p.y, TOPO_PLACA + 0.006]} scale={v}>
          <sphereGeometry args={[0.012, 10, 8]} />
        </mesh>,
      );
    }
  };
  if (e.corrente > 0.01) corre(g.rotaVol, 0, e.corrente, 'v');
  if (e.vigia > 0.01) ROTAS.forEach((r, i) => corre(r.pts, i * 0.17, e.vigia, `r${i}`));
  m.ponto.opacity = 1;

  const aceso = acesoLED(e);

  return (
    <group position={e.pose.pos} rotation={[0, e.pose.rotY, e.pose.rotZ]}>
      {/* tampa */}
      <group position={camada(off.tampa, d.tampa, off.tampaX)}>
        <Peca geo={g.tampa} mat={m.objeto} quente={d.tampa} />
        <Peca geo={g.janela} mat={m.janela} />
      </group>

      {/* borracha com botões e carbono */}
      <group position={camada(off.borracha, d.borracha, off.borrachaX)}>
        <Peca geo={g.lamina} mat={m.borracha} quente={d.borracha} />
        <Peca geo={g.botoes} mat={m.borracha} quente={d.borracha} largura={1.6} />
        <mesh geometry={g.carbonos} material={m.carbono} />
        <group position={[0, 0, desce]}>
          <Peca geo={g.volMais} mat={m.borracha} quente={Math.max(d.borracha, d.botao)} largura={1.6} />
          <group position={[0, 0, -0.004 * d.carbono]}>
            <Peca geo={g.carbonoVol} mat={m.carbono} quente={d.carbono} largura={1.6} />
          </group>
        </group>
      </group>

      {/* placa de circuito */}
      <group position={camada(off.placa, d.placa)}>
        <Peca geo={g.placa} mat={m.placa} quente={d.placa} />
        <mesh geometry={g.trilhas} material={m.trilha} />
        <group position={[0, 0, 0.004 * d.trilhas]}>
          <mesh geometry={g.trilhaVol} material={m.trilhaVol} />
          {d.trilhas > 0.01 && <Contorno geo={g.trilhaVol} quente={d.trilhas} largura={1.2} opacidade={0} />}
        </group>
        <group position={[0, 0, 0.16 * d.chip]}>
          <Peca geo={g.chip} mat={m.escuro} quente={d.chip} />
          <mesh geometry={g.pinos} material={m.metal} />
        </group>
        <Peca geo={g.ressonador} mat={m.objeto} largura={1.4} />
        <Peca geo={g.capacitor} mat={m.sombra} largura={1.4} />
        <Peca geo={g.transistor} mat={m.escuro} largura={1.4} />
        <group position={[0, 0.12 * d.led, 0.12 * d.led]}>
          <Peca geo={g.ledCorpo} mat={aceso ? m.ledAceso : m.led} quente={d.led} largura={1.6} />
          <Peca geo={g.ledCupula} mat={aceso ? m.ledAceso : m.led} quente={d.led} largura={1.6} />
          <mesh geometry={g.ledPernas} material={m.metal} />
        </group>
        {pontos}
      </group>

      {/* fundo com pilhas e molas */}
      <group position={camada(off.fundo, d.fundo)}>
        <Peca geo={g.piso} mat={m.objeto} quente={d.fundo} />
        <Peca geo={g.parede} mat={m.objeto} quente={d.fundo} />
        {[-0.115, 0.115].map((x, i) => (
          <group key={x} position={[x, 0.66, Z_FUNDO + 0.105]} rotation={[0, 0, i ? Math.PI : 0]}>
            <Peca geo={g.pilha} mat={m.objeto} quente={d.fundo * 0.8} largura={1.6} />
            <mesh geometry={g.faixa} material={m.sombra} />
            <mesh geometry={g.polo} material={m.metal} />
            <group position={[0, -0.3, 0]}>
              <mesh geometry={g.mola} material={m.metal} />
            </group>
          </group>
        ))}
      </group>
    </group>
  );
};

export { clamp, lerp };
