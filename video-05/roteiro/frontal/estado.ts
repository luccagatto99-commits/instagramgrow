// Linha do tempo da máquina de lavar (abertura frontal): tudo que acontece na cena sai daqui, em função do tempo (s).
// Coordenadas: gabinete de x -1..1, y 0..2.8, z -1..1 (frente em +z); tanque e tambor deitados no eixo z.
import { B, BE, T, clamp, janela, lerp, prog, saida, suave, entrada } from './tempo';

export const COR = {
  fundo: '#0E1A2B',
  objeto: '#F4F1EA',
  move: '#FF6B2C', // só o que se move: a água
  rotulo: '#8FB8FF',
  sombra: '#B5AE9C',
  traco: '#0E1A2B',
  escuro: '#2A3446',
  roupa: '#D9D2C2',
  concreto: '#A39D90',
};

export type V2 = [number, number];
export type V3 = [number, number, number];

// ---- medidas ----
export const GAB = { w: 2.0, h: 2.8, d: 2.0 };
export const EIXO: V3 = [0, 1.35, -0.05]; // centro do tanque/tambor
export const TANQUE = { r: 0.86, z0: -0.78, z1: 0.68 };
export const TAMBOR = { r: 0.76, z0: -0.7, z1: 0.6 };
export const PORTA = { y: 1.35, r: 0.6, z: 1.03 };
export const VALVULA: V3 = [0.6, 2.58, -0.8];
export const GAVETA: V3 = [-0.55, 2.52, 0.75];
export const PRESSO: V3 = [0.62, 2.5, 0.35]; // sensor de nível (pressostato)
export const MOTOR: V3 = [0.42, 0.42, -0.62];
export const POLIA_Z = -0.98;
export const BOMBA: V3 = [0.55, 0.28, 0.62];
export const CONCRETO: V3 = [0, 2.33, 0.35];

// ---- eventos ----
const ev = () => ({
  concretoGancho: T(0, 'concreto') - 0.1,
  tambor: T(1, 'tambor') - 0.15,
  tanque: T(1, 'tanque') - 0.15,
  fechaPorta: T(1, 'cesto') - 0.1,
  sabao: T(2, 'sabão', 0) - 0.6,
  liga: T(2, 'liga') - 0.25,
  sai: T(2, 'liga') + 0.5,
  valvula: T(2, 'válvula') - 0.15,
  abre: T(2, 'abre') - 0.1,
  gaveta: T(2, 'gaveta', 1) - 0.15,
  tubinho: T(2, 'tubinho') - 0.15,
  avisa: T(2, 'avisa') - 0.1,
  motor: T(3, 'motor') - 0.15,
  correia: T(3, 'correia') - 0.3,
  pas: T(3, 'pás') - 0.15,
  batida: T(3, 'batida') - 0.1,
  bomba: T(4, 'bomba') - 0.15,
  tira: T(4, 'tira') - 0.1,
  gira: T(4, 'gira') - 0.2,
  joga: T(4, 'jogada') - 0.4,
  fimCentrifuga: BE(4) + 0.3,
  embolada: T(5, 'embolada') - 0.3,
  tremer: T(5, 'tremer') - 0.25,
  andar: T(5, 'andar') - 0.15,
  bloco: T(5, 'bloco') - 0.15,
  molas: T(5, 'molas') - 0.15,
  fim: B(6),
  volta: B(6) - 0.6,
});
let EV: ReturnType<typeof ev> | null = null;
export const E = () => (EV ??= ev());

export type Estado = ReturnType<typeof estado>;

/** ângulo do tambor: integra a velocidade (rad/s) em passos de 1/60 s (determinístico) */
const velTambor = (t: number) => {
  const e = E();
  // gancho: centrifugando forte e parando
  const gancho = 0;
  // lavagem: lento, de vai e volta
  const lav = t > e.correia && t < e.bomba + 0.6 ? 3.2 * prog(t, e.correia, 0.6) * (1 - prog(t, e.bomba - 0.6, 0.6)) : 0;
  // centrifugação
  const cen = 16 * prog(t, e.gira, 1.6, entrada) * (1 - prog(t, e.fimCentrifuga, 0.8));
  // demonstração do desequilíbrio
  const deseq = 13 * prog(t, e.embolada, 1.0) * (1 - prog(t, e.fim - 0.5, 1.0));
  return Math.max(gancho, lav, cen, deseq);
};
const PASSO = 1 / 60;
let ANG: Float64Array | null = null;
export const anguloTambor = (t: number) => {
  if (!ANG) {
    const n = Math.ceil(120 / PASSO);
    ANG = new Float64Array(n + 1);
    for (let i = 1; i <= n; i++) ANG[i] = ANG[i - 1] + velTambor(i * PASSO) * PASSO;
  }
  const i = Math.min(ANG.length - 1, Math.max(0, Math.floor(t / PASSO)));
  return ANG[i];
};

export const estado = (t: number) => {
  const e = E();
  const phi = anguloTambor(t);
  const vel = velTambor(t);

  // --- gancho: a máquina está no lugar; no "concreto" um flash de raio-x; depois o raio-x fica ---
  const giroGab = 0;
  const xEntra = 0;
  const raioX = Math.max(janela(t, e.concretoGancho, e.concretoGancho + 1.5, 0.15, 0.5), prog(t, e.tambor - 0.2, 0.6)) * (1 - prog(t, e.volta, 1.0));
  const destConcretoGancho = janela(t, e.concretoGancho, e.concretoGancho + 1.5, 0.1, 0.5);

  // --- peças citadas: mexem e acendem ---
  const saiTanque = 0.08 * Math.sin(Math.min(1, Math.max(0, (t - e.tanque) / 0.8)) * Math.PI);
  const saiTambor = 0;
  const destTanque = janela(t, e.tanque, BE(1) + 0.4, 0.2, 0.3);
  const destTambor = janela(t, e.tambor, e.tanque, 0.2, 0.3);
  // a roupa: cada peça entra no tambor depois de ser jogada
  const nRoupas = ARREMESSOS.filter((a0) => t >= a0 + VOO).length;
  const roupas = 1;
  // porta, gaveta, painel
  const porta = (1 - prog(t, e.fechaPorta, 0.6, suave)) + prog(t, e.volta + 1.0, 0.8, suave) * (t > e.volta ? 1 : 0);
  const gavetaAberta = prog(t, e.sabao - 0.2, 0.4, saida) * (1 - prog(t, e.sabao + 1.8, 0.4, suave));
  const despeja = janela(t, e.sabao + 0.45, e.sabao + 1.6, 0.15, 0.2);
  const ligada = prog(t, e.liga + 0.25, 0.2) * (1 - prog(t, e.volta, 0.4));

  // --- água entrando ---
  const fluxoEntrada = janela(t, e.abre, e.avisa + 0.2, 0.2, 0.3);
  const enche = prog(t, e.abre + 0.4, e.avisa - e.abre - 0.4, suave);
  const esvazia = prog(t, e.tira, 1.8, suave);
  const nivel = enche * (1 - esvazia); // 0 = vazio, 1 = cheio (um terço do tanque)
  const fluxoBomba = janela(t, e.tira, e.tira + 2.2, 0.2, 0.4);
  const destValvula = janela(t, e.valvula, e.gaveta, 0.2, 0.3);
  const destGaveta = janela(t, e.gaveta, e.tubinho, 0.2, 0.3);
  const destTubo = janela(t, e.tubinho, B(3) - 0.2, 0.2, 0.3);
  const avisa = janela(t, e.avisa, B(3) - 0.2, 0.1, 0.3);

  // --- lavagem ---
  const destMotor = janela(t, e.motor, e.correia + 0.2, 0.2, 0.3);
  const destCorreia = janela(t, e.correia, e.pas, 0.2, 0.3);
  const destPas = janela(t, e.pas, e.batida + 0.8, 0.2, 0.3);
  const lavando = janela(t, e.correia, e.gira, 0.3, 0.3);
  const respingo = janela(t, e.pas, e.bomba, 0.3, 0.3);

  // --- centrifugação ---
  const destBomba = janela(t, e.bomba, e.gira, 0.2, 0.3);
  const centrifuga = janela(t, e.gira + 0.4, e.fimCentrifuga + 0.5, 0.6, 0.6);
  const gotas = janela(t, e.joga, e.fimCentrifuga + 0.3, 0.3, 0.5);

  // --- concreto e desequilíbrio ---
  const tiraConcreto = prog(t, e.embolada - 0.2, 0.7, saida) * (1 - prog(t, e.bloco, 0.6, entrada));
  const embolada = prog(t, e.embolada, 0.6) * (1 - prog(t, e.fim - 0.5, 1.0));
  const forte = prog(t, e.tremer, 0.4) * (1 - prog(t, e.bloco + 0.4, 0.8));
  const fraco = prog(t, e.bloco + 0.4, 0.8) * (1 - prog(t, e.fim - 0.4, 0.8));
  const destConcreto = Math.max(destConcretoGancho, janela(t, e.bloco, e.molas, 0.2, 0.3));
  const destMolas = janela(t, e.molas, e.fim + 0.2, 0.2, 0.3);

  // tremor do tanque (sobre as molas) e da máquina inteira
  const vib = (a: number, f: number, s = 0) => a * Math.sin(t * f + s);
  const tremeGancho = 0;
  const tanqueTreme = tremeGancho + 0.07 * centrifuga + 0.16 * forte + 0.03 * fraco;
  const tanqueOff: V3 = [vib(tanqueTreme, 41), vib(tanqueTreme * 0.8, 37, 1), 0];
  const maqTreme = tremeGancho * 0.5 + 0.06 * forte;
  // "anda pela casa": pulinhos para o lado
  const andar = prog(t, e.andar, 2.0) * (1 - prog(t, e.bloco + 0.2, 1.0, suave));
  const xAndar = 0.5 * andar;
  const pulo = forte > 0.05 && t > e.andar ? Math.abs(Math.sin(t * 13)) * 0.05 * forte : 0;
  const maqOff: V3 = [xEntra + xAndar + vib(maqTreme, 47), pulo + Math.abs(vib(maqTreme * 0.6, 53)), vib(maqTreme * 0.5, 43, 2)];

  return {
    t, phi, vel, giroGab, raioX, maqOff, tanqueOff,
    saiTanque, saiTambor, destTanque, destTambor, roupas, nRoupas, porta, gavetaAberta, despeja, ligada,
    fluxoEntrada, nivel, fluxoBomba, destValvula, destGaveta, destTubo, avisa,
    destMotor, destCorreia, destPas, lavando, respingo,
    destBomba, centrifuga, gotas,
    tiraConcreto, embolada, destConcreto, destMolas,
  };
};

export { clamp, lerp, BE };

// ---------------- a pessoa ----------------
export const ARREMESSOS = [0.15, 1.25, 2.45, 3.75, 5.0, 6.25, 7.6];
export const VOO = 0.6;
export type PoseP = {
  pos: V3; yaw: number; dobra: number; agacha: number;
  bracoD: [number, number]; cotD: number; bracoE: [number, number]; cotE: number; v: number;
};
const P_CESTO: PoseP = { pos: [-1.95, 0, 1.45], yaw: 1.85, dobra: 0.45, agacha: 0.35, bracoD: [0.35, 0.1], cotD: 0.4, bracoE: [0.55, 0.15], cotE: 1.3, v: 1 };
const P_SABAO: PoseP = { pos: [-1.55, 0, 1.1], yaw: 1.75, dobra: 0.12, agacha: 0, bracoD: [1.45, 0.05], cotD: 0.55, bracoE: [0.1, 0.1], cotE: 0.2, v: 1 };
const P_LIGA: PoseP = { pos: [-1.45, 0, 1.55], yaw: 1.95, dobra: 0.18, agacha: 0, bracoD: [1.25, -0.25], cotD: 0.25, bracoE: [0.1, 0.1], cotE: 0.2, v: 1 };
const P_SAI: PoseP = { ...P_LIGA, pos: [-3.6, 0, 1.4], yaw: -1.5, bracoD: [0.1, 0.1], cotD: 0.2, v: 0 };
const mixP = (a: PoseP, b: PoseP, u: number): PoseP => ({
  pos: [lerp(a.pos[0], b.pos[0], u), lerp(a.pos[1], b.pos[1], u), lerp(a.pos[2], b.pos[2], u)],
  yaw: lerp(a.yaw, b.yaw, u), dobra: lerp(a.dobra, b.dobra, u), agacha: lerp(a.agacha, b.agacha, u),
  bracoD: [lerp(a.bracoD[0], b.bracoD[0], u), lerp(a.bracoD[1], b.bracoD[1], u)], cotD: lerp(a.cotD, b.cotD, u),
  bracoE: [lerp(a.bracoE[0], b.bracoE[0], u), lerp(a.bracoE[1], b.bracoE[1], u)], cotE: lerp(a.cotE, b.cotE, u), v: lerp(a.v, b.v, u),
});
export const pessoa = (t: number): PoseP & { cesto: number; frasco: number } => {
  const e = E();
  let p = P_CESTO;
  // arremessos: o braço direito vai do cesto até a porta
  let arr = 0;
  for (const a0 of ARREMESSOS) arr = Math.max(arr, Math.sin(clamp((t - a0 + 0.25) / (VOO + 0.25)) * Math.PI));
  p = { ...p, bracoD: [0.35 + 0.95 * arr, 0.1 - 0.35 * arr], cotD: 0.4 - 0.2 * arr, dobra: p.dobra + 0.08 * arr };
  // fecha a porta: braço empurra
  const fecha = Math.sin(clamp((t - e.fechaPorta + 0.3) / 0.9) * Math.PI);
  p = { ...p, bracoD: [p.bracoD[0] + 0.9 * fecha, p.bracoD[1] - 0.3 * fecha], cotD: p.cotD * (1 - fecha) };
  // levanta e vai para a gaveta com o sabão
  p = mixP(p, P_SABAO, prog(t, e.sabao - 1.4, 1.0, suave));
  // inclina o frasco (braço sobe mais)
  p = { ...p, cotD: p.cotD + 0.35 * janela(t, e.sabao + 0.4, e.sabao + 1.6, 0.2, 0.2) };
  // aperta o botão
  p = mixP(p, P_LIGA, prog(t, e.sabao + 1.9, 0.7, suave));
  // sai de cena
  p = mixP(p, P_SAI, prog(t, e.sai, 1.4, suave));
  // volta no fim e abre a porta
  const volta = prog(t, e.volta - 0.8, 1.2, suave);
  if (t > e.volta - 0.8) p = mixP(P_SAI, { ...P_CESTO, bracoD: [1.3, -0.2], cotD: 0.2, bracoE: [0.1, 0.1], cotE: 0.2 }, volta);
  const cesto = t < e.sabao - 1.2 ? 1 : 0;
  const frasco = janela(t, e.sabao - 1.0, e.sabao + 2.0, 0.2, 0.2);
  return { ...p, cesto, frasco };
};
