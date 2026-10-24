// Linha do tempo da máquina de lavar brasileira (abertura superior, batedor no meio). Tudo sai daqui, em função do tempo (s).
// Coordenadas: gabinete x -1..1, y 0..2.9, z -1..1 (frente em +z); cesto e tanque em pé, no eixo y.
import { B, BE, T, clamp, janela, lerp, prog, saida, suave, entrada } from './tempo';

export const COR = {
  fundo: '#0E1A2B',
  objeto: '#F4F1EA',
  move: '#FF6B2C', // só o que se move: a água
  rotulo: '#8FB8FF',
  sombra: '#B5AE9C',
  traco: '#0E1A2B',
  escuro: '#2A3446',
  batedor: '#6E8CC4',
};
export const ROUPAS = ['#C9D6EE', '#9FB3D6', '#D9D2C2', '#7F94BE', '#E9E4D8', '#B7C4DF'];

export type V2 = [number, number];
export type V3 = [number, number, number];

// ---- medidas ----
export const GAB = { w: 2.0, h: 2.9, d: 2.0 };
export const TANQUE = { r: 0.88, y0: 0.5, y1: 2.45 };
export const CESTO = { r: 0.78, y0: 0.62, y1: 2.38 };
export const ANEL = { r: 0.72, tubo: 0.075, y: 2.4 };
export const BATEDOR = { r: 0.13, y0: 0.66, y1: 2.0 };
export const VALVULA: V3 = [0.62, 2.78, -0.82];
export const SABAO: V3 = [-0.45, 2.62, -0.55]; // dispenser de sabão, atrás da boca
export const PAINEL: V3 = [0, 3.08, -0.82];
export const PRESSO: V3 = [-0.62, 3.05, -0.82];
export const MOTOR: V3 = [0.5, 0.28, -0.35];
export const BOMBA: V3 = [-0.55, 0.22, 0.55];

// ---- eventos ----
const ev = () => ({
  anelGancho: T(0, 'anel') - 0.1,
  rebobina: T(0, 'Em') + 0.1,
  tampa: T(1, 'tampa') - 0.2,
  cesto: T(1, 'cesto') - 0.15,
  roupa: T(1, 'roupa') - 0.6,
  tanque: T(1, 'tanque') - 0.15,
  fechaTampa: BE(1) - 0.2,
  liga: T(2, 'liga') - 0.2,
  valvula: T(2, 'válvula') - 0.15,
  abre: T(2, 'abre') - 0.1,
  sabao: T(2, 'sabão') - 0.3,
  tubinho: T(2, 'tubinho') - 0.15,
  avisa: T(2, 'avisa') - 0.1,
  motor: T(3, 'motor') - 0.15,
  batedor: T(3, 'batedor') - 0.15,
  desce: T(3, 'desce') - 0.15,
  bomba: T(4, 'bomba') - 0.15,
  tira: T(4, 'tira') - 0.1,
  gira: T(4, 'gira') - 0.2,
  joga: T(4, 'jogada') - 0.4,
  fimCentrifuga: BE(4) + 0.3,
  embolada: T(5, 'embolada') - 0.3,
  tremer: T(5, 'tremer') - 0.25,
  andar: T(5, 'andar') - 0.15,
  anel: T(5, 'anel', 0) - 0.15,
  corre: T(5, 'corre') - 0.2,
  varetas: T(5, 'varetas') - 0.15,
  fim: B(6),
});
let EV: ReturnType<typeof ev> | null = null;
export const E = () => (EV ??= ev());
export type Estado = ReturnType<typeof estado>;

/** velocidade de giro do cesto (rad/s): só na centrifugação e na demonstração do desequilíbrio */
const velCesto = (t: number) => {
  const e = E();
  const cen = 22 * prog(t, e.gira, 1.6, entrada) * (1 - prog(t, e.fimCentrifuga, 0.8));
  const deseq = 16 * prog(t, e.embolada, 1.0) * (1 - prog(t, e.fim - 0.5, 1.0));
  return Math.max(cen, deseq);
};
const PASSO = 1 / 60;
let ANG: Float64Array | null = null;
export const anguloCesto = (t: number) => {
  if (!ANG) {
    const n = Math.ceil(120 / PASSO);
    ANG = new Float64Array(n + 1);
    for (let i = 1; i <= n; i++) ANG[i] = ANG[i - 1] + velCesto(i * PASSO) * PASSO;
  }
  return ANG[Math.min(ANG.length - 1, Math.max(0, Math.floor(t / PASSO)))];
};

export const estado = (t: number) => {
  const e = E();
  const phi = anguloCesto(t);
  const vel = velCesto(t);

  // --- lavando: no gancho (prévia) e na lavagem de verdade ---
  const lavGancho = 1 - prog(t, e.rebobina, 0.8);
  const lavReal = prog(t, e.batedor, 0.5) * (1 - prog(t, e.bomba, 0.6));
  const lavando = Math.max(lavGancho, lavReal);
  const batedorAng = 1.1 * Math.sin(t * 5.2) * lavando; // vai e vem

  // --- água ---
  const nivelGancho = 1 - prog(t, e.rebobina, 1.0, suave);
  const enche = prog(t, e.abre + 0.3, e.avisa - e.abre - 0.3, suave);
  const esvazia = prog(t, e.tira, 1.8, suave);
  const nivel = Math.max(nivelGancho, enche * (1 - esvazia));
  const fluxoEntrada = janela(t, e.abre, e.avisa + 0.2, 0.2, 0.3);
  const fluxoBomba = janela(t, e.tira, e.tira + 2.2, 0.2, 0.4);

  // --- tampa e roupa caindo pela boca ---
  const tampa = prog(t, e.tampa, 0.6, saida) * (1 - prog(t, e.fechaTampa, 0.6, suave));
  const roupasDentro = t < e.rebobina + 0.7 ? 1 : prog(t, e.roupa, 1.4); // fração que já caiu
  const sobeGancho = t < e.roupa - 0.2 ? prog(t, e.rebobina, 0.7, entrada) : 0; // rebobinada: a roupa sai pela boca
  const caindo = janela(t, e.roupa - 0.1, e.roupa + 1.7, 0.1, 0.2);

  // --- destaques ---
  const destAnel = Math.max(janela(t, e.anelGancho, e.rebobina + 0.8, 0.15, 0.4), janela(t, e.anel, e.varetas, 0.2, 0.3));
  const destCesto = janela(t, e.cesto, e.tanque, 0.2, 0.3);
  const destTanque = janela(t, e.tanque, BE(1) + 0.5, 0.2, 0.3);
  const destValvula = janela(t, e.valvula, e.sabao, 0.2, 0.3);
  const destSabao = janela(t, e.sabao, e.tubinho, 0.2, 0.3);
  const destTubo = janela(t, e.tubinho, B(3) - 0.2, 0.2, 0.3);
  const avisa = janela(t, e.avisa, B(3) - 0.2, 0.1, 0.3);
  const destMotor = janela(t, e.motor, e.batedor + 0.3, 0.2, 0.3);
  const destBatedor = janela(t, e.batedor, e.desce + 0.6, 0.2, 0.3);
  const destBomba = janela(t, e.bomba, e.gira, 0.2, 0.3);
  const destVaretas = janela(t, e.varetas, e.fim + 0.2, 0.2, 0.3);
  const ligada = prog(t, e.liga, 0.2) * (1 - prog(t, e.fim, 0.4));

  // --- centrifugação ---
  const centrifuga = janela(t, e.gira + 0.4, e.fimCentrifuga + 0.5, 0.6, 0.6);
  const gotas = janela(t, e.joga, e.fimCentrifuga + 0.3, 0.3, 0.5);

  // --- anel e desequilíbrio ---
  const embolada = prog(t, e.embolada, 0.6) * (1 - prog(t, e.fim - 0.5, 1.0));
  // primeiro sem o anel agir (treme e anda); quando o anel "corre", acalma
  const forte = prog(t, e.tremer, 0.4) * (1 - prog(t, e.corre + 0.3, 1.0));
  const fraco = prog(t, e.corre + 0.3, 1.0) * (1 - prog(t, e.fim - 0.4, 0.8));
  const anelCorre = prog(t, e.corre, 0.9, suave); // a água do anel vai para o lado oposto da roupa
  const vib = (a: number, f: number, s = 0) => a * Math.sin(t * f + s);
  const tremeGancho = 0.02 * lavGancho;
  const tanqueTreme = tremeGancho + 0.05 * centrifuga + 0.15 * forte + 0.025 * fraco;
  const tanqueOff: V3 = [vib(tanqueTreme, 41), 0, vib(tanqueTreme * 0.8, 37, 1)];
  const maqTreme = 0.06 * forte;
  const andar = prog(t, e.andar, 1.6) * (1 - prog(t, e.corre + 0.2, 1.2, suave));
  const pulo = forte > 0.05 && t > e.andar ? Math.abs(Math.sin(t * 13)) * 0.05 * forte : 0;
  const maqOff: V3 = [0.45 * andar + vib(maqTreme, 47), pulo + Math.abs(vib(maqTreme * 0.6, 53)), vib(maqTreme * 0.5, 43, 2)];

  return {
    t, phi, vel, lavando, batedorAng, nivel, fluxoEntrada, fluxoBomba, tampa, roupasDentro, caindo, sobeGancho,
    destAnel, destCesto, destTanque, destValvula, destSabao, destTubo, avisa, destMotor, destBatedor, destBomba, destVaretas, ligada,
    centrifuga, gotas, embolada, anelCorre, tanqueOff, maqOff,
  };
};

export { clamp, lerp, BE };
