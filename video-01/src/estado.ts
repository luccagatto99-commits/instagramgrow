// Linha do tempo do vídeo: tudo que acontece na cena sai daqui, em função do tempo (s).
import { B, BE, T, clamp, janela, lerp, prog, saida, suave } from './tempo';

export const COR = {
  fundo: '#0E1A2B', // azul-noite
  objeto: '#F4F1EA',
  move: '#FF6B2C', // só o que se move: luz, corrente
  rotulo: '#8FB8FF',
  sombra: '#B5AE9C',
  traco: '#0E1A2B',
  carbono: '#1A2230',
};

// ---- medidas do controle (unidades da cena; o controle tem 2,4 de altura) ----
export const W = 0.64;
export const H = 2.4;
export const RAIO = 0.2;
export const Y_LED = 2.36;
export const X_TV = 7.2; // centro da TV (ela olha para -x)
export const FRENTE_TV = X_TV - 0.06;
export const SENSOR = { x: FRENTE_TV - 0.004, y: 0.6, z: 0.95 };
export const X_CEL = 2.6;
export const DETALHE = { x: -5.5, y: 0, z: 1.0 }; // vista de detalhe do botão

export type Botao = { id: string; x: number; y: number; w: number; h: number; redondo?: boolean };
const num: Botao[] = [];
[1.86, 1.7, 1.54, 1.38].forEach((y, l) =>
  [-0.17, 0, 0.17].forEach((x, c) => num.push({ id: `n${l * 3 + c}`, x, y, w: 0.12, h: 0.1 })),
);
export const BOTOES: Botao[] = [
  { id: 'power', x: -0.17, y: 2.12, w: 0.13, h: 0.13, redondo: true },
  ...num,
  { id: 'ok', x: 0, y: 1.0, w: 0.17, h: 0.17, redondo: true },
  { id: 'cima', x: 0, y: 1.18, w: 0.13, h: 0.07 },
  { id: 'baixo', x: 0, y: 0.82, w: 0.13, h: 0.07 },
  { id: 'esq', x: -0.18, y: 1.0, w: 0.07, h: 0.13 },
  { id: 'dir', x: 0.18, y: 1.0, w: 0.07, h: 0.13 },
  { id: 'vol+', x: -0.18, y: 0.62, w: 0.11, h: 0.12 },
  { id: 'vol-', x: -0.18, y: 0.46, w: 0.11, h: 0.12 },
  { id: 'ch+', x: 0.18, y: 0.62, w: 0.11, h: 0.12 },
  { id: 'ch-', x: 0.18, y: 0.46, w: 0.11, h: 0.12 },
  { id: 'mudo', x: 0, y: 0.54, w: 0.1, h: 0.1, redondo: true },
];
export const VOLMAIS = BOTOES.find((b) => b.id === 'vol+')!;
export const CHIP = { x: 0, y: 0.2, l: 0.17 };

// alturas das camadas (z local, montado)
export const Z = {
  fundo: -0.14, // a bandeja vai de -0.14 até 0
  placa: 0.004, // placa de 0.004 a 0.026
  borracha: 0.03, // lâmina de 0.03 a 0.05; botões sobem até 0.15
  tampa: 0.05, // tampa de 0.05 a 0.13
};

export type Estado = ReturnType<typeof estado>;

export const estado = (t: number) => {
  // ---------- montagem / explosão das camadas ----------
  // offsets extras em z de cada camada (0 = montado)
  const abre = prog(t, T(0, 'por') - 0.25, 1.4); // abre ao meio no gancho
  const perto = prog(t, B(3) - 0.9, 1.1); // tampa sai para a esquerda para mostrar a placa
  const tiraBorracha = prog(t, B(3) - 0.9, 1.1); // borracha sai para a direita
  const fecha = prog(t, T(4, 'Ele') - 0.2, 0.9); // fecha o controle para piscar (câmera já afastada)
  const aberto = abre * (1 - fecha);

  const aperto = janela(t, T(2, 'aperta') - 0.15, B(3) - 0.2, 0.35, 0.4); // VOL+ apertado
  const off = {
    // no close do botão a tampa sai para a esquerda e, na placa, a borracha sai para a direita
    tampaX: aberto * -2.0 * perto,
    borrachaX: aberto * 2.0 * tiraBorracha,
    tampa: aberto * lerp(1.05, 1.75, perto),
    borracha: aberto * lerp(0.35, 0.16, perto),
    placa: aberto * lerp(-0.45, 0, perto),
    fundo: aberto * lerp(-1.25, -1.45, perto),
  };

  // ---------- destaques (levanta + borda laranja) ----------
  const d = (a: number, b: number) => janela(t, a, b, 0.3, 0.35);
  const destaque = {
    tampa: d(T(1, 'tampa') - 0.15, T(1, 'botões') - 0.2),
    borracha: d(T(1, 'botões') - 0.15, T(1, 'placa') - 0.2),
    placa: d(T(1, 'placa') - 0.15, T(1, 'fundo') - 0.2),
    fundo: d(T(1, 'fundo') - 0.15, BE(1) + 0.45),
    botao: d(B(2) - 0.1, T(2, 'pontinho') + 0.1),
    carbono: d(T(2, 'pontinho') - 0.1, T(2, 'Na') + 0.1),
    trilhas: d(T(2, 'caminhos') - 0.2, BE(2) + 0.3),
    chip: d(T(3, 'chip') - 0.15, BE(3) + 0.35),
    led: d(T(4, 'LED') - 0.15, T(4, 'Ele') - 0.3),
    sensor: d(T(5, 'sensor') - 0.15, BE(5) + 0.3),
    cameraCel: d(T(6, 'câmera') - 0.15, T(6, 'Ela') + 0.2),
  };

  // ---------- corrente (o que se move) ----------
  const corrente = janela(t, T(2, 'corrente') - 0.25, B(3) + 0.3, 0.25, 0.4);
  const detalhe = janela(t, T(2, 'botão') + 0.2, B(3) - 0.1, 0.6, 0.5);
  const vigia = janela(t, T(3, 'vigiando') - 0.1, T(3, 'Cada') + 0.3, 0.3, 0.4);

  // ---------- pose do controle ----------
  // de pé no centro → deitado apontando para a TV (+x) → de pé de novo no fim
  const deita = prog(t, T(4, 'Ele') + 0.05, 1.1) * (1 - prog(t, B(7) - 0.2, 1.3));
  const giroGancho = -0.55 + t * 0.55;
  const giro0 = lerp(giroGancho, 0, prog(t, T(0, 'por') - 0.6, 1.5));
  // no fim, uma volta inteira devagar, terminando de frente
  const rotY = t < B(7) ? giro0 : Math.PI * 2 * prog(t, B(7) + 0.4, BE(7) + 1.2 - B(7));
  const pose = {
    pos: [lerp(0, -1.2, deita), lerp(0.25, 1.22, deita), 0] as [number, number, number],
    rotZ: -Math.PI / 2 * suave(deita),
    rotY,
  };

  // ---------- pulsos de luz do LED ----------
  const pulsosTV = { a: T(4, 'rajadas') + 0.15, b: BE(5) + 0.2 };
  const pulsosCel = { a: T(6, 'aperte') - 0.1, b: BE(6) + 0.2 };
  const apertaCel = janela(t, T(6, 'aperte') - 0.1, BE(6) + 0.2, 0.2, 0.3);

  // ---------- TV ----------
  const tv = janela(t, T(4, 'pisca') - 0.5, B(6) + 1.2, 0.6, 0.6);
  const raioTV = janela(t, T(5, 'sensor') - 0.2, T(5, 'monta') + 0.2, 0.4, 0.5);
  const sol = janela(t, T(5, 'sol') - 0.35, T(5, 'sensor', 1) + 0.2, 0.4, 0.4);
  const volume = prog(t, T(5, 'aumenta') - 0.1, 0.9) * (1 - prog(t, B(6) + 0.6, 0.4));
  const telaVolume = janela(t, T(5, 'aumenta') - 0.3, B(6) + 0.9, 0.3, 0.3);

  // ---------- celular ----------
  const cel = janela(t, T(6, 'Aponte') - 0.4, B(7) + 0.1, 0.6, 0.5);
  const brilhoCel = janela(t, T(6, 'aparece') - 0.5, BE(6) + 0.3, 0.2, 0.3);

  return {
    t, off, destaque, corrente, vigia, detalhe, aperto: Math.max(aperto * (1 - tiraBorracha), apertaCel), pose,
    pulsosTV, pulsosCel, tv, raioTV, sol, volume, telaVolume, cel, brilhoCel,
    aberto, fecha,
  };
};

export const cl = clamp;
export const sd = saida;
