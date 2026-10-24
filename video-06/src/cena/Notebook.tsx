// Notebook aberto ao meio: teclado erguido e transparente (com a grade de fios das teclas), placa à mostra com o chip do
// teclado, o processador (bilhões de chavinhas), dois pentes de memória e o chip de vídeo; tampa com a tela do WhatsApp.
// Os bits (laranja = 1, contorno = 0) correm pelos fios na ordem da viagem da letra.
import { useMemo } from 'react';
import * as THREE from 'three';
import {
  BASE, COD_O, COL_O, COR, CPU, E, EC, ERGUE, Estado, FIL_OI, FITA, GPU, LETRA_I, LETRA_O, NUM_O, RAM_A, RAM_B,
  PUXA, TAMPA, TECLA, TECLA_I, TECLA_O, TELA, V3, naTampa,
} from '../estado';
import { Contorno, Peca, brilho, toon } from './base';
import { Fluxo, Haste } from './pecas';
import { aleatorio } from '../tempo';

const v3 = (p: V3) => new THREE.Vector3(...p);
const curva = (pts: V3[]) => new THREE.CatmullRomCurve3(pts.map(v3), false, 'catmullrom', 0.1);
const Y = BASE.h;
const YT = 0.075; // altura das trilhas na placa
const YD = Y + ERGUE; // altura do teclado puxado
const TRAS = PUXA - BASE.d / 2; // borda de trás do teclado puxado

// ---- caminhos dos bits ----
const fioTecla = (k: [number, number]) => curva([
  [k[0], YD + 0.06, k[1]], [k[0], YD + 0.02, k[1] - 0.03], [(k[0] + FITA[0]) / 2, YD + 0.02, TRAS + 0.25],
  [FITA[0], YD, TRAS + 0.02], [FITA[0], 0.2, (TRAS + FITA[2]) / 2], [FITA[0], YT + 0.02, FITA[2]], [EC[0] + 0.14, YT, EC[2]],
]);
const F_TECLA_O = fioTecla(TECLA_O);
const F_TECLA_I = fioTecla(TECLA_I);
const F_EC_CPU = curva([[EC[0], YT, EC[2] - 0.14], [-0.6, YT, 0.26], [-0.2, YT, 0.2], [CPU[0], YT, CPU[2] + 0.41]]);
const F_CPU_RAM = curva([[CPU[0] + 0.41, YT, CPU[2]], [0.55, YT, CPU[2] + 0.02], [RAM_A[0], YT + 0.03, RAM_A[2]]]);
const F_CPU_GPU = curva([[CPU[0] - 0.41, YT, CPU[2]], [-0.55, YT, CPU[2] + 0.02], [GPU[0] + 0.24, YT + 0.02, GPU[2]]]);
const F_GPU_RAM = curva([[GPU[0], YT, GPU[2] - 0.24], [-0.7, YT, -0.82], [0.6, YT, -0.84], [RAM_B[0], YT, -0.86], [RAM_B[0], YT + 0.03, -0.66]]);
const F_RAM_GPU = curva([[RAM_B[0] + 0.05, YT + 0.03, -0.66], [RAM_B[0] + 0.1, YT, -0.9], [0.6, YT, -0.9], [-0.7, YT, -0.88], [GPU[0] - 0.08, YT, GPU[2] - 0.24]]);
const F_GPU_TELA = curva([
  [GPU[0] - 0.12, YT, GPU[2] - 0.24], [-1.05, YT, -0.86], [-0.95, Y - 0.02, -0.94], naTampa(-0.95, 0.06, 0), naTampa(-0.95, TELA.y - TELA.h / 2, 0.034),
]);
const DECOR: V3[][] = [
  [[0.3, YT, CPU[2] - 0.41], [0.5, YT, -0.78]], [[-0.3, YT, CPU[2] + 0.41], [-0.4, YT, 0.62], [-0.2, YT, 0.8]],
  [[0.42, YT, CPU[2] + 0.25], [0.7, YT, 0.3], [1.15, YT, 0.35]], [[0.25, YT, CPU[2] + 0.41], [0.45, YT, 0.6], [0.9, YT, 0.66]],
  [[-0.42, YT, CPU[2] + 0.25], [-1.1, YT, 0.2]],
];
const FIOS_DECOR = DECOR.map((p) => curva(p));
const VIAGEM_O = new THREE.CurvePath<THREE.Vector3>();
const VIAGEM_I = new THREE.CurvePath<THREE.Vector3>();
[F_TECLA_O, F_EC_CPU, F_CPU_RAM, F_CPU_GPU, F_GPU_RAM, F_RAM_GPU, F_GPU_TELA].forEach((c) => VIAGEM_O.add(c));
[F_TECLA_I, F_EC_CPU, F_CPU_RAM, F_CPU_GPU, F_GPU_RAM, F_RAM_GPU, F_GPU_TELA].forEach((c) => VIAGEM_I.add(c));
const L_VIAGEM = [VIAGEM_O.getLength(), VIAGEM_I.getLength()];

const CUBO = new THREE.BoxGeometry(1, 1, 1);

/** fila de bits andando por um fio: `d` = distância percorrida (mundo) de cada bit; some no fim do fio */
const Trem: React.FC<{ c: THREE.Curve<THREE.Vector3>; bits: number[]; d: number[]; v?: number }> = ({ c, bits, d, v = 1 }) => {
  const L = useMemo(() => c.getLength(), [c]);
  const m = useMemo(() => ({ um: brilho(COR.move, 2.6), zero: new THREE.MeshBasicMaterial({ color: COR.rotulo, transparent: true, opacity: 0.9 }) }), []);
  const p = new THREE.Vector3();
  if (v <= 0.01) return null;
  return (
    <group>
      {bits.map((b, k) => {
        const u = d[k] / L;
        if (u <= 0 || u >= 1) return null;
        c.getPointAt(u, p);
        const s = 0.1 * Math.min(1, u * 12, (1 - u) * 12) * v;
        return b ? (
          <mesh key={k} geometry={CUBO} material={m.um} position={[p.x, p.y + 0.03, p.z]} scale={s} />
        ) : (
          <group key={k} position={[p.x, p.y + 0.03, p.z]} scale={s}>
            <mesh geometry={CUBO} material={m.zero} scale={0.55} />
            <Contorno geo={CUBO} largura={2} />
          </group>
        );
      })}
    </group>
  );
};

/** chavinhas (transistores) do miolo do chip: piscam ligando e desligando; no "para tudo" congelam */
const N_CH = 11;
const Chaves: React.FC<{ e: Estado }> = ({ e }) => {
  const inst = useMemo(() => {
    const im = new THREE.InstancedMesh(CUBO, new THREE.MeshBasicMaterial({ color: 'white', toneMapped: false }), N_CH * N_CH);
    im.frustumCulled = false;
    return im;
  }, []);
  const sem = useMemo(() => { const r = aleatorio(17); return Array.from({ length: N_CH * N_CH }, () => [r(), r() * 10] as const); }, []);
  const o = useMemo(() => new THREE.Object3D(), []);
  const ligada = useMemo(() => new THREE.Color(COR.move).multiplyScalar(2.4), []);
  const apagada = useMemo(() => new THREE.Color(COR.escuro).multiplyScalar(1.6), []);
  const passo = 0.046;
  const tq = e.atende > 0.5 ? E().atender : e.t;
  for (let i = 0; i < N_CH * N_CH; i++) {
    const [f, fase] = sem[i];
    const on = e.chaveando > 0.01 && Math.sin(tq * e.ritmo * (0.6 + f) + fase * 3) > 0.15;
    o.position.set(((i % N_CH) - (N_CH - 1) / 2) * passo, 0.012, (Math.floor(i / N_CH) - (N_CH - 1) / 2) * passo);
    o.scale.set(passo * 0.7, 0.02, passo * 0.7);
    o.updateMatrix();
    inst.setMatrixAt(i, o.matrix);
    inst.setColorAt(i, on ? ligada : apagada);
  }
  inst.instanceMatrix.needsUpdate = true;
  if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
  return <primitive object={inst} />;
};

/** fio: traço fino claro; acende laranja com a corrente */
const Trilha: React.FC<{ c: THREE.Curve<THREE.Vector3>; aceso: number; r?: number }> = ({ c, aceso, r = 0.012 }) => {
  const g = useMemo(() => [new THREE.TubeGeometry(c, 60, r, 6), new THREE.TubeGeometry(c, 60, r * 1.6, 6)], [c, r]);
  const m = useMemo(() => ({ base: new THREE.MeshBasicMaterial({ color: '#7E8FAE' }), luz: brilho(COR.move, 2.2) }), []);
  m.luz.opacity = aceso;
  return (
    <>
      <mesh geometry={g[0]} material={m.base} />
      {aceso > 0.01 && <mesh geometry={g[1]} material={m.luz} renderOrder={3} />}
    </>
  );
};

const Opac: React.FC<{ m: THREE.Material; v: number }> = ({ m, v }) => {
  m.opacity = v;
  m.visible = v > 0.005;
  return null;
};

// ---------------- tela do WhatsApp (desenhada num canvas) ----------------
const TW = 1024, TH = Math.round((1024 * TELA.h) / TELA.w);
const arred = (c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
};
const letra = (c: CanvasRenderingContext2D, l: string[], x: number, y: number, px: number, frac = 1, cor = '#E9EDEF') => {
  const pts: [number, number][] = [];
  l.forEach((linha, r) => [...linha].forEach((ch, k) => { if (ch === '#') pts.push([k, r]); }));
  const n = Math.round(frac * pts.length);
  c.fillStyle = cor;
  pts.slice(0, n).forEach(([k, r]) => c.fillRect(x + k * px, y + r * px, px - 1, px - 1));
};
const desenhaTela = (c: CanvasRenderingContext2D, e: Estado) => {
  c.fillStyle = '#0B141A'; c.fillRect(0, 0, TW, TH);
  // cabeçalho da conversa
  c.fillStyle = '#202C33'; c.fillRect(0, 0, TW, 78);
  c.fillStyle = '#6B7A93'; c.beginPath(); c.arc(52, 39, 24, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#E9EDEF'; c.font = 'bold 30px Arial'; c.fillText('Mãe', 94, 50);
  c.fillStyle = '#8696A0'; c.font = '20px Arial'; c.fillText('online', 160, 50);
  // mensagens
  c.fillStyle = '#202C33'; arred(c, 34, 112, 330, 62, 12); c.fill();
  c.fillStyle = '#E9EDEF'; c.font = '28px Arial'; c.fillText('Filho, tá aí?', 54, 153);
  c.fillStyle = '#8696A0'; c.font = '17px Arial'; c.fillText('21:14', 304, 166);
  if (e.enviada > 0.01) {
    const dy = (1 - e.enviada) * 20;
    c.globalAlpha = e.enviada;
    c.fillStyle = '#005C4B'; arred(c, TW - 184, 200 + dy, 150, 72, 12); c.fill();
    letra(c, LETRA_O, TW - 164, 212 + dy, 7);
    letra(c, LETRA_I, TW - 124, 212 + dy, 7);
    c.globalAlpha = 1;
  }
  // caixa de texto
  const yb = TH - 100;
  c.fillStyle = '#2A3942'; arred(c, 30, yb, TW - 160, 74, 37); c.fill();
  c.fillStyle = '#00A884'; c.beginPath(); c.arc(TW - 66, yb + 37, 37, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#0B141A'; c.beginPath(); c.moveTo(TW - 80, yb + 22); c.lineTo(TW - 46, yb + 37); c.lineTo(TW - 80, yb + 52); c.closePath(); c.fill();
  if (e.realce > 0.01) {
    c.strokeStyle = `rgba(255,107,44,${e.realce})`; c.lineWidth = 8;
    arred(c, 22, yb - 8, TW - 144, 90, 45); c.stroke();
  }
  const digitando = e.enviada < 0.5;
  if (digitando && e.pixelsO > 0) {
    letra(c, LETRA_O, 70, yb + 9, 8, e.pixelsO);
    if (e.temI) letra(c, LETRA_I, 116, yb + 9, 8);
  } else {
    c.fillStyle = '#8696A0'; c.font = '28px Arial'; c.fillText('Mensagem', 70, yb + 47);
  }
  if (digitando && Math.floor(e.t * 2.2) % 2 === 0) {
    c.fillStyle = '#00A884';
    c.fillRect(e.temI ? 162 : e.pixelsO > 0 ? 116 : 62, yb + 14, 4, 48);
  }
};

export const Notebook: React.FC<{ e: Estado }> = ({ e }) => {
  const g = useMemo(() => ({
    fundo: new THREE.BoxGeometry(BASE.w, 0.04, BASE.d).translate(0, 0.02, 0),
    paredeX: new THREE.BoxGeometry(BASE.w, Y, 0.04),
    paredeZ: new THREE.BoxGeometry(0.04, Y, BASE.d - 0.08),
    deck: new THREE.BoxGeometry(BASE.w, 0.03, BASE.d),
    tecla: new THREE.BoxGeometry(TECLA.w, 0.04, TECLA.d),
    espaco: new THREE.BoxGeometry(TECLA.passo * 5 - 0.03, 0.04, TECLA.d),
    touch: new THREE.BoxGeometry(0.9, 0.006, 0.5),
    placa: new THREE.BoxGeometry(2.6, 0.025, 1.7),
    cpuBase: new THREE.BoxGeometry(0.8, 0.02, 0.8),
    cpuTampa: new THREE.BoxGeometry(0.58, 0.03, 0.58),
    miolo: new THREE.BoxGeometry(0.56, 0.008, 0.56),
    gpu: new THREE.BoxGeometry(0.46, 0.03, 0.46),
    gpuMiolo: new THREE.BoxGeometry(0.26, 0.012, 0.26),
    ec: new THREE.BoxGeometry(0.26, 0.03, 0.26),
    pente: new THREE.BoxGeometry(0.3, 0.015, 0.95),
    chipRam: new THREE.BoxGeometry(0.2, 0.02, 0.17),
    conector: new THREE.BoxGeometry(0.22, 0.04, 0.08),
    tampa: new THREE.BoxGeometry(BASE.w, TAMPA.h, TAMPA.esp).translate(0, TAMPA.h / 2, 0),
    tela: new THREE.PlaneGeometry(TELA.w, TELA.h),
  }), []);
  const tela = useMemo(() => {
    const cv = document.createElement('canvas');
    cv.width = TW; cv.height = TH;
    const tx = new THREE.CanvasTexture(cv);
    tx.colorSpace = THREE.SRGBColorSpace;
    tx.anisotropy = 8;
    return { ctx: cv.getContext('2d')!, tx, mat: new THREE.MeshBasicMaterial({ map: tx, toneMapped: false }) };
  }, []);
  const m = useMemo(() => ({
    objeto: toon(COR.objeto),
    sombra: toon(COR.sombra),
    deck: toon(COR.objeto),
    teclas: toon(COR.objeto, { transparent: true, opacity: 0.45, depthWrite: false }),
    teclaO: toon(COR.objeto),
    touch: toon('#E2DED3'),
    placa: toon(COR.placa),
    escuro: toon(COR.escuro),
    metal: toon('#DDE0E5'),
    miolo: new THREE.MeshBasicMaterial({ color: '#1B2638' }),
    ramA: brilho(COR.move, 2.2),
    ramB: brilho(COR.move, 2.2),
    gpuLuz: brilho(COR.move, 2.2),
    fita: toon('#D9C9A8'),
  }), []);
  const teclas = useMemo(() => {
    const out: { x: number; z: number; f: number; k: number }[] = [];
    for (let r = 0; r < 4; r++) for (let k = 0; k < 12; k++) out.push({ x: TECLA.x0 + k * TECLA.passo, z: TECLA.z0 + r * TECLA.passo, f: r, k });
    return out;
  }, []);
  const matriz = useMemo(() => ({
    fileiras: [0, 1, 2, 3].map((r) => curva([[TECLA.x0 - 0.12, YD + 0.02, TECLA.z0 + r * TECLA.passo + PUXA], [TECLA.x0 + 11 * TECLA.passo + 0.12, YD + 0.02, TECLA.z0 + r * TECLA.passo + PUXA]])),
    colunas: Array.from({ length: 12 }, (_, k) => curva([[TECLA.x0 + k * TECLA.passo, YD + 0.021, TECLA.z0 - 0.12 + PUXA], [TECLA.x0 + k * TECLA.passo, YD + 0.021, TECLA.z0 + 3 * TECLA.passo + 0.12 + PUXA]])),
  }), []);

  const t = e.t;
  const ev = E();
  // varredura: uma fileira por vez; quando passa pela fileira do O (apertado), a coluna do O responde
  const fileiraVarre = e.achou ? FIL_OI : Math.floor(t * 9) % 4;
  const colunaO = e.varre > 0.01 && (e.achou || (fileiraVarre === FIL_OI && e.teclaO > 0.5)) ? e.varre : 0;

  desenhaTela(tela.ctx, e);
  tela.tx.needsUpdate = true;

  const ehO = t < ev.rebobina;
  const L = L_VIAGEM[ehO ? 0 : 1];
  const cometa = [0, 1, 2, 3, 4, 5].map((k) => e.viagem * (L + 0.7) - k * 0.12);

  return (
    <group rotation={[0, e.giro, 0]}>
      {/* casca da base */}
      <Peca geo={g.fundo} mat={m.objeto} />
      <Peca geo={g.paredeX} mat={m.objeto} position={[0, Y / 2, BASE.d / 2 - 0.02]} />
      <Peca geo={g.paredeX} mat={m.objeto} position={[0, Y / 2, -BASE.d / 2 + 0.02]} />
      <Peca geo={g.paredeZ} mat={m.sombra} position={[BASE.w / 2 - 0.02, Y / 2, 0]} />
      <Peca geo={g.paredeZ} mat={m.sombra} position={[-BASE.w / 2 + 0.02, Y / 2, 0]} />

      {/* placa e fios */}
      <Peca geo={g.placa} mat={m.placa} position={[0, 0.055, 0]} sombra={false} />
      {FIOS_DECOR.map((c, i) => <Trilha key={i} c={c} aceso={0} />)}
      <Trilha c={F_TECLA_O} aceso={e.circuito} />
      {[F_EC_CPU, F_CPU_RAM, F_CPU_GPU, F_GPU_RAM, F_RAM_GPU, F_GPU_TELA].map((c, i) => <Trilha key={i} c={c} aceso={0} />)}
      <Peca geo={g.conector} mat={m.escuro} position={[FITA[0], 0.08, FITA[2]]} />
      {e.puxa > 0.05 && <Haste a={[FITA[0], 0.1, FITA[2]]} b={[FITA[0], Y + 0.015 + (YD - Y - 0.015) * e.puxa, TRAS * e.puxa + (FITA[2] - 0.1) * (1 - e.puxa)]} r={0.014} mat={m.fita} />}

      {/* chip do teclado */}
      <Peca geo={g.ec} mat={m.escuro} position={EC} quente={e.destEc} />

      {/* processador: a tampa de metal sobe e mostra as chavinhas */}
      <group position={CPU}>
        <Peca geo={g.cpuBase} mat={m.escuro} quente={e.destCpu} />
        <Peca geo={g.miolo} mat={m.miolo} position={[0, 0.012, 0]} contorno={false} />
        <group position={[0, 0.016, 0]}><Chaves e={e} /></group>
        <Peca geo={g.cpuTampa} mat={m.metal} position={[0, 0.03 + e.abreChip * 0.4, 0]} quente={e.destCpu} />
      </group>

      {/* chip de vídeo */}
      <group position={GPU}>
        <Peca geo={g.gpu} mat={m.escuro} quente={e.destGpu} />
        <mesh geometry={g.gpuMiolo} material={m.gpuLuz} position={[0, 0.02, 0]} />
      </group>
      <Opac m={m.gpuLuz} v={Math.max(e.destGpu, e.leitura) * 0.9} />

      {/* memória: pente A guarda a mensagem, pente B guarda a imagem da tela */}
      {([[RAM_A, m.ramA, e.destRam], [RAM_B, m.ramB, e.destRamB]] as const).map(([p, luz, q], i) => (
        <group key={i} position={[p[0], p[1] + q * 0.08, p[2]]}>
          <Peca geo={g.pente} mat={m.objeto} quente={q} />
          {[-0.33, -0.11, 0.11, 0.33].map((dz, k) => (
            <group key={k} position={[0, 0.015, dz]}>
              <Peca geo={g.chipRam} mat={m.escuro} />
              <mesh geometry={g.chipRam} material={luz} scale={[0.8, 1.1, 0.8]} position={[0, 0.003, 0]} />
            </group>
          ))}
        </group>
      ))}
      <Opac m={m.ramA} v={e.ramA} />
      <Opac m={m.ramB} v={Math.max(e.ramB, e.leitura * (0.6 + 0.4 * Math.sin(t * 30)))} />

      {/* corrente de fundo e a leitura da tela (60 vezes por segundo) */}
      {[F_EC_CPU, F_CPU_RAM, F_CPU_GPU, ...FIOS_DECOR].map((c, i) => <Fluxo key={i} curva={c} n={6} t={t + i * 0.37} vel={0.35} v={e.fluxo * 0.5} r={0.02} />)}
      <Fluxo curva={F_RAM_GPU} n={18} t={t} vel={0.9} v={e.leitura} r={0.026} />
      <Fluxo curva={F_GPU_TELA} n={14} t={t} vel={0.9} v={e.leitura} r={0.026} />

      {/* bits */}
      <Trem c={F_EC_CPU} bits={COD_O} d={e.tremCodigo} />
      <Trem c={F_CPU_RAM} bits={NUM_O} d={e.tremRam} />
      <Trem c={F_CPU_GPU} bits={NUM_O} d={e.tremGpu} />
      <Trem c={F_GPU_RAM} bits={[1, 1, 0, 1, 0, 1, 1, 0]} d={e.tremImagem} />
      <Trem c={ehO ? VIAGEM_O : VIAGEM_I} bits={[1, 0, 1, 1, 0, 1]} d={cometa} v={e.viajando} />

      {/* teclado erguido, com a grade de fios que liga as teclas */}
      <group position={[0, Y + 0.015 + (YD - Y - 0.03) * e.puxa, PUXA * e.puxa]}>
        <Peca geo={g.deck} mat={m.deck} />
        {teclas.map((k, i) => {
          const eO = k.f === FIL_OI && k.k === COL_O, eI = k.f === FIL_OI && k.k === 8;
          const desce = eO ? e.teclaO : eI ? e.teclaI : 0;
          return (
            <Peca key={i} geo={g.tecla} mat={eO || eI ? m.teclaO : m.teclas} position={[k.x, 0.035 - desce * 0.03, k.z]}
              quente={eO ? e.destTecla : 0} opacidade={eO || eI ? 1 : 0.5} sombra={eO || eI} />
          );
        })}
        <Peca geo={g.espaco} mat={m.teclas} position={[0, 0.035, TECLA.z0 + 4 * TECLA.passo]} opacidade={0.5} sombra={false} />
        <Peca geo={g.touch} mat={m.touch} position={[0, 0.018, 0.6]} />
      </group>
      {e.varre > 0.01 && matriz.fileiras.map((c, r) => <Trilha key={r} c={c} r={0.008} aceso={r === fileiraVarre ? e.varre : 0} />)}
      {e.varre > 0.01 && matriz.colunas.map((c, k) => <Trilha key={k} c={c} r={0.008} aceso={k === COL_O ? colunaO : 0} />)}

      {/* tampa com a tela */}
      <group position={[0, Y, -BASE.d / 2]} rotation={[-TAMPA.ang, 0, 0]}>
        <Peca geo={g.tampa} mat={m.objeto} />
        <group position={[0, TELA.y, TAMPA.esp / 2 + 0.002]}>
          <mesh geometry={g.tela} material={tela.mat} />
          <Contorno geo={g.tela} quente={Math.max(e.destTela, e.destWhats)} largura={2} />
        </group>
      </group>
    </group>
  );
};
