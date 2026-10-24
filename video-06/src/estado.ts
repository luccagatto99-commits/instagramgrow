// Linha do tempo do notebook: a viagem da letra "o" (digitando "oi" no WhatsApp). Tudo sai daqui, em função do tempo (s).
// Coordenadas: base x -1.4..1.4, y 0..0.16, z -0.95..0.95 (frente em +z); tampa presa na dobradiça de trás.
import { B, BE, T, clamp, janela, lerp, prog, saida, suave } from './tempo';

export const COR = {
  fundo: '#0E1A2B',
  objeto: '#F4F1EA',
  move: '#FF6B2C', // só o que se move: a corrente (os bits) e a luz da tela
  rotulo: '#8FB8FF',
  sombra: '#B5AE9C',
  traco: '#0E1A2B',
  escuro: '#2A3446',
  placa: '#C9C2B0',
  tela: '#132840',
};

export type V2 = [number, number];
export type V3 = [number, number, number];

// ---- medidas ----
export const BASE = { w: 2.8, h: 0.16, d: 1.9 };
export const ERGUE = 0.14; // o teclado sai da base: um pouco acima dela
export const PUXA = 1.7; // ... e puxado para a frente (vista explodida), deixando a placa e a tela livres
export const TAMPA = { h: 1.75, esp: 0.05, ang: 0.26 }; // ang: inclinação para trás (rad)
export const TELA = { w: 2.5, h: 1.42, y: 0.98 }; // no referencial da tampa
export const CPU: V3 = [0, 0.08, -0.3];
export const RAM_A: V3 = [0.78, 0.07, -0.3]; // pente da mensagem
export const RAM_B: V3 = [1.12, 0.07, -0.3]; // pente com a imagem da tela
export const GPU: V3 = [-0.95, 0.08, -0.3];
export const EC: V3 = [-0.75, 0.08, 0.5]; // chip do teclado
export const FITA: V3 = [-0.35, 0.08, 0.55];
// teclas: 12 colunas, 4 fileiras + barra de espaço
export const TECLA = { passo: 0.21, w: 0.18, d: 0.17, x0: -1.155, z0: -0.72 };
/** posição da tecla no mundo (já com o teclado puxado) */
export const tecla = (fileira: number, coluna: number): V2 => [TECLA.x0 + coluna * TECLA.passo, TECLA.z0 + fileira * TECLA.passo + PUXA];
export const COL_O = 9, COL_I = 8, FIL_OI = 1;
export const TECLA_O = tecla(FIL_OI, COL_O);
export const TECLA_I = tecla(FIL_OI, COL_I);

/** ponto no referencial da tampa → mundo (sem o giro do notebook) */
export const naTampa = (x: number, y: number, z: number): V3 => {
  const c = Math.cos(TAMPA.ang), s = Math.sin(TAMPA.ang);
  return [x, BASE.h + y * c + z * s, -BASE.d / 2 + (-y * s + z * c)];
};

// letras em 5 × 7 pontinhos
export const LETRA_O = ['.....', '.....', '.###.', '#...#', '#...#', '#...#', '.###.'];
export const LETRA_I = ['..#..', '.....', '.##..', '..#..', '..#..', '..#..', '.###.'];

export const COD_O = [0, 0, 0, 1, 1, 0, 0, 0]; // código da tecla O que o chip do teclado manda (0x18)
export const NUM_O = [0, 1, 1, 0, 1, 1, 1, 1]; // "o" = 111

// ---- eventos ----
const ev = () => ({
  abre: T(0, 'dentro') - 0.3,
  apertaGancho: T(0, 'aperta') + 0.05,
  rebobina: BE(0) + 0.15,
  embaixo: T(1, 'Embaixo') - 0.2,
  apertou: T(1, 'Apertou') - 0.05,
  fecham: T(1, 'fecham') - 0.1,
  chipzinho: T(1, 'chipzinho') - 0.2,
  testa: T(1, 'testa') - 0.2,
  acha: T(1, 'acha') - 0.05,
  mandando: T(2, 'mandando') - 0.1,
  temUm: T(2, 'Tem') - 0.1,
  naoTem: T(2, 'Não') - 0.1,
  processador: T(3, 'processador') - 0.2,
  chavinhas: T(3, 'chavinhas') - 0.2,
  atender: T(3, 'para', 0) - 0.1,
  windows: T(3, 'Windows') - 0.2,
  descobre: T(3, 'descobre') - 0.1,
  dai: T(3, 'Daí') - 0.1,
  numero: T(3, '111') - 0.1,
  vai: T(4, 'vai') - 0.2,
  whatsapp: T(4, 'WhatsApp') - 0.2,
  guarda: T(4, 'guarda') - 0.2,
  desenhar: T(5, 'desenhar') - 0.3,
  fonte: T(5, 'fonte') - 0.2,
  chipVideo: T(5, 'chip') - 0.15,
  pinta: T(5, 'pinta') - 0.1,
  imagem: T(5, 'imagem') - 0.3,
  le: T(6, 'lê') - 0.2,
  pontinho: T(6, 'pontinho') - 0.2,
  aparece: T(6, 'aparece') - 0.3,
  denovo: T(6, 'tudo') - 0.2,
  segue: T(7, 'Segue') - 0.3,
  fim: B(7),
});
let EV: ReturnType<typeof ev> | null = null;
export const E = () => (EV ??= ev());
export type Estado = ReturnType<typeof estado>;

/** fila de 8 bits saindo em t0 com velocidade vel (distância de cada bit ao longo do fio) */
const trem = (t: number, t0: number, vel: number, n = 8) => Array.from({ length: n }, (_, k) => (t < t0 ? -1 : (t - t0) * vel - k * 0.14));
/** cometa que faz a viagem inteira: fração 0..1 do caminho */
export const VIAGEM = { gancho: 2.7, denovo: 1.7 };

export const estado = (t: number) => {
  const e = E();

  // --- gancho: o notebook entra girando uma volta inteira e para de frente ---
  // já aberto e funcionando desde o 1º quadro: entra de lado, girando, e para de frente
  const giro = 1.75 * (1 - prog(t, 0, e.apertaGancho - 0.2, saida));
  const puxa = 1; // o teclado fica fora da base, puxado para a frente

  // --- viagem completa (gancho e a letra i) ---
  const viagemO = t < e.rebobina ? clamp((t - e.apertaGancho - 0.15) / VIAGEM.gancho) : 0;
  const viagemI = clamp((t - e.denovo - 0.15) / VIAGEM.denovo);
  const viagem = t < e.rebobina ? viagemO : viagemI;
  const viajando = t < e.rebobina ? janela(t, e.apertaGancho, e.rebobina, 0.1, 0.3) : janela(t, e.denovo, e.denovo + VIAGEM.denovo + 0.6, 0.1, 0.3);

  // --- teclas ---
  const aperto = (a: number, dur = 0.35) => Math.max(0, 1 - Math.abs(t - a - dur / 2) / (dur / 2));
  const teclaO = Math.max(aperto(e.apertaGancho), clamp(prog(t, e.apertou, 0.2) * (1 - prog(t, e.fecham + 1.2, 0.3))));
  const teclaI = aperto(e.denovo);

  // --- circuito da tecla e varredura ---
  const circuito = prog(t, e.fecham, 0.3) * (1 - prog(t, B(3) - 0.3, 0.5)); // fio da tecla até o chip do teclado aceso
  const varre = janela(t, e.testa, B(2) - 0.3, 0.2, 0.3);
  const achou = t >= e.acha;

  // --- trens de bits ---
  const tremCodigo = trem(t, e.mandando, 0.3); // chip do teclado → processador (código da tecla)
  const tremRam = trem(t, e.guarda - 0.9, 0.9); // processador → memória ("o" = 111)
  const tremGpu = trem(t, e.desenhar, 0.9); // processador → chip de vídeo
  const tremImagem = trem(t, e.pinta - 0.2, 1.3); // chip de vídeo → imagem da tela na memória
  const leitura = janela(t, e.le, e.aparece + 1.2, 0.3, 0.4); // a tela lê a imagem sem parar

  // --- chip ---
  const abreChip = prog(t, e.processador, 0.8, suave) * (1 - prog(t, B(4) - 0.2, 0.8, suave));
  const atende = janela(t, e.atender, e.atender + 0.9, 0.1, 0.3); // para tudo: as chavinhas congelam acesas
  const chaveando = Math.max(1 - prog(t, e.apertaGancho, 0.6), janela(t, e.processador + 0.4, B(4) - 0.1, 0.3, 0.3), 0.8 * viajando);
  const ritmo = 6;
  const fluxo = Math.max(0.8 * (1 - prog(t, e.apertaGancho, 0.6)), 0.35 * janela(t, e.rebobina + 0.6, e.fim, 0.6, 0.6), viajando);

  // --- tela (WhatsApp) ---
  const digitadoGancho = t < e.rebobina - 0.2 && viagemO >= 1 ? 1 : 0;
  const pixelsO = Math.max(digitadoGancho, prog(t, e.aparece, 0.55, (u) => u)); // fração dos pontinhos do "o" acesos
  const temI = t >= e.denovo + 0.15 + VIAGEM.denovo;
  const enviada = prog(t, e.segue, 0.5, saida);
  const realce = janela(t, e.aparece, e.aparece + 1.6, 0.15, 0.4); // contorno na caixa de texto quando a letra aparece

  // --- memória ---
  const ramA = prog(t, e.guarda, 0.5);
  const ramB = prog(t, e.pinta + 0.6, 0.6);

  // --- destaques ---
  const destTecla = janela(t, e.embaixo, e.chipzinho, 0.2, 0.3);
  const destEc = janela(t, e.chipzinho, B(2) + 1.0, 0.2, 0.3);
  const destCpu = janela(t, e.processador, e.dai, 0.2, 0.3);
  const destRam = janela(t, e.vai + 0.6, B(5) - 0.2, 0.2, 0.3);
  const destWhats = janela(t, e.whatsapp, e.guarda, 0.2, 0.3);
  const destGpu = janela(t, e.chipVideo, e.imagem, 0.2, 0.3);
  const destRamB = janela(t, e.imagem, BE(5) + 0.4, 0.2, 0.3);
  const destTela = janela(t, e.le, e.pontinho, 0.2, 0.3);

  return {
    t, giro, puxa, viagem, viajando, teclaO, teclaI, circuito, varre, achou,
    tremCodigo, tremRam, tremGpu, tremImagem, leitura,
    abreChip, atende, chaveando, ritmo, fluxo,
    pixelsO, temI, enviada, realce, ramA, ramB,
    destTecla, destEc, destCpu, destRam, destWhats, destGpu, destRamB, destTela,
  };
};

export { clamp, lerp, BE };
