// Linha do tempo do caminhão de lixo: tudo que acontece na cena sai daqui, em função do tempo (s).
// Coordenadas do caminhão: frente (cabine) para -x, traseira (boca) para +x, chão em y = 0, lado da câmera em +z.
import { B, BE, T, clamp, janela, lerp, prog, saida, suave, aleatorio } from './tempo';

export const COR = {
  fundo: '#0E1A2B',
  objeto: '#F4F1EA',
  move: '#FF6B2C', // só o que se move: óleo sob pressão, chorume
  rotulo: '#8FB8FF',
  sombra: '#B5AE9C',
  traco: '#0E1A2B',
  escuro: '#2A3446',
  saco: '#4A5770',
};

export type V2 = [number, number];
export type V3 = [number, number, number];

// ---- medidas ----
export const RODA = 0.5;
export const EIXOS = [-2.75, 1.25, 2.3];
export const CAIXA = { x0: -1.85, x1: 2.55, y0: 1.15, y1: 3.35, z: 1.2 };
export const DOBRA: V2 = [2.55, 3.4]; // dobradiça da tampa
export const G_TOPO: V2 = [3.05, 3.05]; // trilho da placa deslizante (alto)
export const G_BAIXO: V2 = [3.75, 1.75]; // (baixo)
export const PA = 0.95; // comprimento da pá
export const R_FUNDO = 1.0; // raio do fundo da boca (centro em G_BAIXO)
export const ANG_BORDA = (-52 * Math.PI) / 180; // borda da boca
export const ANG_FIM = (-140 * Math.PI) / 180; // onde o fundo encontra a caixa
export const BOTAO: V3 = [4.06, 1.56, 1.26];
export const X_FUNDO = 2.5; // até onde o lixo compactado chega (entrada da caixa)
export const DX_MASSA = 0.34;

const GU: V2 = (() => {
  const dx = G_BAIXO[0] - G_TOPO[0], dy = G_BAIXO[1] - G_TOPO[1];
  const l = Math.hypot(dx, dy);
  return [dx / l, dy / l];
})();
export const LEN_GUIA = Math.hypot(G_BAIXO[0] - G_TOPO[0], G_BAIXO[1] - G_TOPO[1]);
export const GUIA_U = GU;
export const dir = (a: number): V2 => [Math.cos(a), Math.sin(a)];
export const pino = (s: number): V2 => [G_TOPO[0] + GU[0] * LEN_GUIA * s, G_TOPO[1] + GU[1] * LEN_GUIA * s];

// ---- ciclos da pá ----
// abre: a pá gira para trás · desce: a placa desliza até o fundo · raspa: a pá varre o fundo · sobe: empurra para a caixa
type Ciclo = { o: number; d: number; s: number; r: number; dO: number; dD: number; dS: number; dR: number };
const ciclo = (o: number, d: number, s: number, r: number, dO = 0.9, dD = 0.9, dS = 1.7, dR = 1.8): Ciclo => ({ o, d, s, r, dO, dD, dS, dR });

const A_FECHA = ANG_FIM, A_ABRE = (-45 * Math.PI) / 180;

const montaCiclos = () => {
  const c1 = ciclo(T(3, 'ciclo') - 0.1, T(3, 'desce') - 0.4, T(3, 'raspa') - 0.05, T(3, 'sobe') - 0.15, 1.0, 0.9, 1.75, 1.9);
  const c2 = ciclo(T(4, 'manda') - 0.1, T(4, 'pressão') - 0.2, T(4, 'haste') - 0.1, T(4, 'toneladas') + 0.5, 0.9, 1.0, 1.8, 1.6);
  // lixo entrando sem parar: três ciclos rápidos enquanto a placa ejetora recua
  const a = T(5, 'Conforme') - 0.6;
  const p = 1.75;
  const rapidos = [0, 1, 2].map((i) => ciclo(a + i * p, a + i * p + 0.3, a + i * p + 0.6, a + i * p + 1.15, 0.3, 0.3, 0.55, 0.55));
  return [c1, c2, ...rapidos];
};
let CICLOS: Ciclo[] | null = null;
export const ciclos = () => (CICLOS ??= montaCiclos());

export const poseCiclo = (c: Ciclo, t: number) => {
  let phi = A_FECHA, s = 0;
  if (t >= c.o) phi = lerp(A_FECHA, A_ABRE, prog(t, c.o, c.dO));
  if (t >= c.d) s = prog(t, c.d, c.dD);
  if (t >= c.s) phi = lerp(A_ABRE, A_FECHA, prog(t, c.s, c.dS));
  if (t >= c.r) s = 1 - prog(t, c.r, c.dR);
  const ativoDesliza = Math.max(janela(t, c.d, c.d + c.dD, 0.1, 0.1), janela(t, c.r, c.r + c.dR, 0.1, 0.1));
  const ativoPa = Math.max(janela(t, c.o, c.o + c.dO, 0.1, 0.1), janela(t, c.s, c.s + c.dS, 0.1, 0.1));
  return { phi, s, ativoDesliza, ativoPa };
};

export const pose = (t: number) => {
  const cs = ciclos();
  let c = cs[0];
  for (const k of cs) if (t >= k.o) c = k;
  return { ...poseCiclo(c, t), c };
};

// ---- placa ejetora ----
const montaEjetora = (): [number, number][] => {
  const cs = ciclos();
  const k: [number, number][] = [[0, 2.15]];
  const passos = [1.9, 1.6, 1.05, 0.55, 0.1];
  cs.forEach((c, i) => {
    k.push([c.r, k[k.length - 1][1]]);
    k.push([c.r + c.dR + 0.25, passos[i]]);
  });
  k.push([T(7, 'placa') - 0.3, 0.1]);
  k.push([T(7, 'fora') + 0.4, 2.45]);
  k.push([B(8) + 0.1, 2.45]);
  k.push([B(8) + 1.6, 2.15]);
  return k;
};
let EJ: [number, number][] | null = null;
export const ejetora = (t: number) => {
  const k = (EJ ??= montaEjetora());
  if (t <= k[0][0]) return k[0][1];
  for (let i = 0; i + 1 < k.length; i++) {
    const [a, xa] = k[i], [b, xb] = k[i + 1];
    if (t <= b) return lerp(xa, xb, suave(clamp((t - a) / Math.max(0.001, b - a))));
  }
  return k[k.length - 1][1];
};
export const DESCARGA = () => ({ a: T(7, 'placa') - 0.3, b: T(7, 'fora') + 0.4 });

// ---- coletor ----
export const COLETOR_BASE: V3 = [5.75, 0, 0.2];
type Arremesso = { tp: number; saco: number };

// sacos: no chão (arremessados pelo coletor) ou vindos de fora do quadro (ciclos rápidos)
export type Saco = {
  id: number; ciclo: number; ang: number; r: number; z: number; delta: number;
  chao?: V3; tp?: number; // coletor pega em tp
  ceu?: V3; tc?: number; // entra voando de fora do quadro
  tam: number; rot: number;
};

const montaSacos = (): Saco[] => {
  const rnd = aleatorio(11);
  const cs = ciclos();
  const sacos: Saco[] = [];
  const pousos = [
    { ang: -1.25, r: 0.78, z: 0.35, delta: 0.3 },
    { ang: -1.55, r: 0.78, z: -0.35, delta: 0.42 },
    { ang: -1.85, r: 0.62, z: 0.1, delta: 0.62 },
  ];
  const chao: V3[] = [[6.3, 0.2, 0.55], [6.7, 0.2, 0.1], [6.35, 0.2, -0.4], [6.9, 0.2, 0.6], [7.05, 0.2, -0.2]];
  // ciclo 1: três sacos
  const a1 = T(2, 'coletor') - 0.25;
  const t1 = [a1, a1 + 0.95, a1 + 1.9];
  t1.forEach((tp, i) => sacos.push({ id: sacos.length, ciclo: 0, ...pousos[i], chao: chao[i], tp, tam: 0.9 + rnd() * 0.25, rot: rnd() * 6 }));
  // ciclo 2: dois sacos, logo no começo do bloco 4
  const t2 = [B(4) + 0.05, B(4) + 1.2];
  t2.forEach((tp, i) => sacos.push({ id: sacos.length, ciclo: 1, ...pousos[i], chao: chao[3 + i], tp, tam: 0.9 + rnd() * 0.25, rot: rnd() * 6 }));
  // ciclos rápidos: dois sacos cada, entram voando antes do ciclo
  [2, 3, 4].forEach((ci) => {
    [0, 1].forEach((j) => {
      sacos.push({
        id: sacos.length, ciclo: ci, ...pousos[j], ceu: [6.6, 2.6 + j * 0.3, j ? -0.2 : 0.4], tc: cs[ci].o - 0.75 + j * 0.2,
        tam: 0.9 + rnd() * 0.25, rot: rnd() * 6,
      });
    });
  });
  return sacos;
};
let SACOS: Saco[] | null = null;
export const sacos = () => (SACOS ??= montaSacos());

export const arremessos = (): Arremesso[] => sacos().filter((s) => s.tp !== undefined).map((s) => ({ tp: s.tp!, saco: s.id }));

const BOTAO_T = () => ({ vai: T(2, 'Quando') + 0.1, aperta: T(2, 'aperta') - 0.05, volta: BE(2) + 0.1 });

/** posição do coletor e ângulo do braço (0 = para baixo, π/2 = para a frente) */
export const coletor = (t: number) => {
  const bt = BOTAO_T();
  const perto: V3 = [4.72, 0, 1.38];
  const ida = prog(t, bt.vai, 0.8);
  const volta = prog(t, bt.volta, 0.8);
  const u = ida * (1 - volta);
  // antes do aterro ele vai embora pela direita
  const sai = prog(t, B(6) - 1.0, 2.6, (k) => k);
  const pos: V3 = [lerp(COLETOR_BASE[0], perto[0], u) + 6 * sai, 0, lerp(COLETOR_BASE[2], perto[2], u)];
  const andando = Math.max(janela(t, bt.vai, bt.vai + 0.8, 0.1, 0.1), janela(t, bt.volta, bt.volta + 0.8, 0.1, 0.1), janela(t, B(6) - 1.0, B(6) + 1.6, 0.1, 0.1));
  let braco = 0.15, curva = 0;
  for (const a of arremessos()) {
    const k = t - a.tp;
    if (k < -0.05 || k > 1.1) continue;
    if (k < 0.3) { braco = lerp(0.15, -0.35, saida(clamp(k / 0.3))); curva = saida(clamp(k / 0.3)); }
    else if (k < 0.6) { braco = lerp(-0.35, 2.3, suave(clamp((k - 0.3) / 0.3))); curva = 1 - suave(clamp((k - 0.3) / 0.3)); }
    else { braco = lerp(2.3, 0.15, suave(clamp((k - 0.6) / 0.5))); }
  }
  const aperto = janela(t, bt.aperta - 0.35, bt.aperta + 0.75, 0.3, 0.3);
  braco = lerp(braco, 1.5, aperto);
  return { pos, braco, curva, andando, aperto, luzBotao: janela(t, bt.aperta, bt.aperta + 0.9, 0.08, 0.4) };
};

export const OMBRO = { y: 1.42, z: 0.22, braco: 0.62 };
export const mao = (t: number): V3 => {
  const c = coletor(t);
  return [c.pos[0] - Math.sin(c.braco) * OMBRO.braco, OMBRO.y + c.curva * -0.12 - Math.cos(c.braco) * OMBRO.braco, c.pos[2] + OMBRO.z];
};

/** onde está cada saco solto (coordenadas do caminhão, que já está parado em x = 0 quando os sacos voam) */
export const posSaco = (k: Saco, t: number): { p: V3; esc: number; giro: number } | null => {
  const c = ciclos()[k.ciclo];
  const pouso: V3 = [G_BAIXO[0] + k.r * Math.cos(k.ang), G_BAIXO[1] + k.r * Math.sin(k.ang), k.z];
  let tSolta: number, origem: V3;
  if (k.tp !== undefined) {
    const dt = t - k.tp;
    if (dt < 0) return { p: k.chao!, esc: aparece(t), giro: k.rot };
    if (dt < 0.55) {
      const m = mao(t);
      const u = saida(clamp(dt / 0.32));
      return { p: [lerp(k.chao![0], m[0], u), lerp(k.chao![1], m[1] - 0.12, u), lerp(k.chao![2], m[2], u)], esc: 1, giro: k.rot };
    }
    tSolta = k.tp + 0.55;
    origem = mao(tSolta);
    origem = [origem[0], origem[1] - 0.12, origem[2]];
  } else {
    if (t < k.tc!) return null;
    tSolta = k.tc!;
    origem = k.ceu!;
  }
  const voo = 0.62;
  const dt = t - tSolta;
  if (dt < voo) {
    const u = dt / voo;
    const h = k.tp !== undefined ? 0.45 : 0.25;
    return {
      p: [lerp(origem[0], pouso[0], u), lerp(origem[1], pouso[1], u) + 4 * h * u * (1 - u), lerp(origem[2], pouso[2], u)],
      esc: 1, giro: k.rot + u * 3,
    };
  }
  // na boca: a pá varre e depois sobe empurrando
  const pc = poseCiclo(c, t);
  const angFim = Math.min(k.ang, ANG_FIM - k.delta);
  let ang = k.ang;
  if (t >= c.s) ang = Math.min(k.ang, pc.phi - k.delta);
  let centro: V2 = G_BAIXO;
  let r = k.r;
  if (t >= c.r) { ang = angFim; centro = pino(pc.s); r = lerp(k.r, k.r * 0.85, 1 - pc.s); }
  const fimSubida = c.r + c.dR;
  const some = clamp((t - fimSubida + 0.15) / 0.3);
  if (some >= 1) return null;
  const aperto = t >= c.r ? 1 - pc.s : 0;
  return {
    p: [centro[0] + r * Math.cos(ang), centro[1] + r * Math.sin(ang), k.z * (1 - 0.3 * aperto)],
    esc: (1 - some) * (1 - 0.25 * aperto), giro: k.rot + 3 + (t >= c.s ? (k.ang - ang) * 1.2 : 0),
  };
};

// ---- caminhão chegando ----
const chegada = (t: number) => clamp(t / (T(0, 'Em') - 0.1));
/** coletor e sacos do chão só aparecem depois que o caminhão para (o giro passaria por cima deles) */
export const aparece = (t: number) => saida(clamp((t - T(0, 'Em') - 0.1) / 0.45));
export const xCaminhao = (t: number) => {
  // entra pela direita desacelerando até parar
  // no fechamento ele sai da frente do monte e volta ao trabalho
  return 6 * Math.pow(1 - chegada(t), 2.2) - 1.1 * prog(t, B(8) - 0.2, 2.6);
};
/** giro de vitrine na entrada: uma volta inteira, terminando de perfil */
export const giroCaminhao = (t: number) => -2 * Math.PI * (1 - Math.pow(1 - chegada(t), 2.2));

export type Estado = ReturnType<typeof estado>;

export const estado = (t: number) => {
  const d = (a: number, b: number) => janela(t, a, b, 0.3, 0.35);
  const x = xCaminhao(t);
  const p = pose(t);

  // corte lateral: a parede de cá some (fica só o contorno) em "por dentro" e volta no fechamento
  const corte = Math.min(prog(t, T(0, 'por') - 0.1, 0.9), 1 - prog(t, T(8, 'Segue') - 1.6, 1.0));

  // óleo à mostra só no bloco do óleo
  const oleo = janela(t, T(4, 'bomba') - 0.2, BE(4) + 0.8, 0.4, 0.5);
  const motorVisivel = janela(t, T(4, 'motor') - 0.3, T(4, 'pistões') + 0.2, 0.4, 0.5);

  // tampa levantando no aterro
  const levanta = Math.min(prog(t, T(7, 'tampa') - 0.1, 1.4), 1 - prog(t, B(8) + 0.2, 1.5));
  const angTampa = 1.2 * levanta;
  const pistaoTampa = Math.max(janela(t, T(7, 'tampa') - 0.1, T(7, 'tampa') + 1.3, 0.1, 0.2), janela(t, B(8) + 0.2, B(8) + 1.7, 0.1, 0.2));

  // chorume
  const chorume = janela(t, T(6, 'espreme') - 0.2, BE(6) + 0.9, 0.4, 0.6);
  const nivelChorume = lerp(0, 0.75, prog(t, T(6, 'escorre'), 3.2));

  const destaque = {
    cabine: d(T(1, 'cabine') - 0.15, T(1, 'caixa') - 0.05),
    caixa: d(T(1, 'caixa') - 0.15, T(1, 'tampa') - 0.1),
    tampa: d(T(1, 'tampa') - 0.15, T(1, 'boca') - 0.05),
    boca: Math.max(d(T(1, 'boca') - 0.15, BE(1) + 0.6), d(T(2, 'boca') - 0.2, T(2, 'Quando') + 0.2)),
    pa: Math.max(d(T(3, 'pá') - 0.15, T(3, 'lixo') + 0.3), d(T(4, 'pá') - 0.2, BE(4) + 0.3)),
    motor: d(T(4, 'motor') - 0.15, T(4, 'gira') + 0.6),
    bomba: d(T(4, 'bomba') - 0.15, T(4, 'pressão') + 0.1),
    pistoes: d(T(4, 'pistões') - 0.15, T(4, 'sai') + 0.3),
    ejetora: d(T(5, 'placa') - 0.15, T(5, 'apertado') + 0.4),
    tanque: d(T(6, 'tanque') - 0.15, BE(6) + 0.6),
  };

  return {
    t, x, ...p, corte, oleo, motorVisivel, angTampa, levanta, pistaoTampa, chorume, nivelChorume, destaque,
    xEj: ejetora(t),
    luzBotao: coletor(t).luzBotao,
    giroRoda: -x / RODA,
    giro: giroCaminhao(t),
  };
};
