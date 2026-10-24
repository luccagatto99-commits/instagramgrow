// Linha do tempo do elevador. Tudo sai daqui, em função do tempo (s).
// Coordenadas: poço x -1.8..1.4, y 0 (fundo) .. 5.6 (teto), casa de máquinas em cima até 6.3; frente em +z.
import { B, BE, T, clamp, janela, lerp, prog, saida, suave, entrada } from './tempo';

export const COR = {
  fundo: '#0E1A2B',
  objeto: '#F4F1EA',
  move: '#FF6B2C', // só o que se move/trabalha: cabos puxando, faíscas da garra
  rotulo: '#8FB8FF',
  sombra: '#B5AE9C',
  traco: '#0E1A2B',
  escuro: '#2A3446',
  madeira: '#C9A77A',
};

export type V2 = [number, number];
export type V3 = [number, number, number];

// ---- medidas do elevador de hoje ----
export const POCO = { x0: -1.95, x1: 1.45, h: 5.6, z: 0.85 };
export const CABINE = { cx: -0.65, w: 1.5, h: 1.6, d: 1.4 };
export const TRILHO_X = [CABINE.cx - CABINE.w / 2 - 0.1, CABINE.cx + CABINE.w / 2 + 0.1];
export const CONTRA = { cx: 0.95, w: 0.5, h: 1.1, d: 0.5, soma: 4.4 }; // y do contrapeso = soma − y da cabine
export const POLIA = { cx: 0.15, y: 5.95, r: 0.8 };
export const N_CABOS = 6;
export const LIMIT = { x: -1.72, y: 6.0, r: 0.2 }; // limitador de velocidade (rodinha), cabo dele em x = LIMIT.x ± r
export const PE_LIMIT = 0.25; // polia de baixo do cabo do limitador

// ---- plataforma do Otis (1854) ----
export const OTIS = { postoX: 1.15, alto: 4.9, larg: 1.9, yAlta: 2.9, queda: 0.22 };

// ---- eventos ----
const ev = () => ({
  arrebenta0: T(0, 'arrebentar') + 0.05,
  otis: B(1) - 0.5,
  sobe: T(1, 'subiu') - 0.1,
  corta: T(1, 'plataforma', 1) - 0.35,
  caiu: T(1, 'caiu') - 0.1,
  travou: T(1, 'travou') - 0.1,
  mola: T(1, 'mola,') - 0.15,
  antes: T(1, 'antes') - 0.1,
  soltou: T(1, 'soltou') - 0.15,
  empurrou: T(1, 'empurrou') - 0.1,
  dentes: T(1, 'dentes') - 0.15,
  hoje: B(2) - 0.6,
  motor: T(2, 'motor') - 0.15,
  gira: T(2, 'gira') - 0.1,
  cabos: T(2, 'cabos') - 0.15,
  cabine: T(2, 'cabine,') - 0.15,
  contrapeso: T(2, 'contrapeso') - 0.15,
  equilibra: T(2, 'equilibra') - 0.15,
  varios: T(3, 'vários,') - 0.2,
  aco: T(3, 'aço') - 0.15,
  sozinho: T(3, 'aguenta') - 0.2,
  arrebentam: T(4, 'arrebentarem,') - 0.05,
  outro: T(4, 'outro') - 0.15,
  rodinha: T(4, 'rodinha', 0) - 0.15,
  desce: T(4, 'desce') - 0.15,
  giraRapido: T(4, 'gira') - 0.15,
  abrem: T(4, 'abrem') - 0.2,
  travam: T(4, 'travam') - 0.1,
  alavanca: T(5, 'alavanca,') - 0.2,
  garras: T(5, 'garras') - 0.15,
  apertam: T(5, 'apertam') - 0.1,
  para: T(5, 'para') - 0.1,
  ideia: T(5, 'ideia') - 0.2,
  fim: B(6),
});
let EV: ReturnType<typeof ev> | null = null;
export const E = () => (EV ??= ev());
export type Estado = ReturnType<typeof estado>;

// ---- movimento da cabine ----
const QUEDA_A = 0.026; // aceleração da queda em câmera lenta
const yCabine = (t: number): number => {
  const e = E();
  if (t < e.otis + 0.6) {
    // gancho: subindo; o cabo arrebenta, cai um pouco, as garras travam
    const subida = 0.8 + 0.34 * Math.min(t, e.arrebenta0);
    if (t < e.arrebenta0) return subida;
    const dt = t - e.arrebenta0;
    const freia = 0.42, dur = 0.3;
    if (dt < freia) return subida - 2.1 * dt * dt;
    const v = 4.2 * freia;
    const u = clamp((dt - freia) / dur);
    return subida - 2.1 * freia * freia - v * dur * (u - 0.5 * u * u);
  }
  // hoje: parada embaixo, sobe com o motor
  const sobe = lerp(1.0, 3.4, prog(t, e.gira + 0.3, 8.5, suave));
  if (t < e.arrebentam) return sobe;
  if (t < e.fim - 0.2) {
    // cabos arrebentam: cai acelerando (câmera lenta) até as garras apertarem, depois freia até parar
    const dt = Math.min(t, e.apertam) - e.arrebentam;
    let y = 3.4 - 0.5 * QUEDA_A * dt * dt;
    if (t > e.apertam) {
      const v0 = QUEDA_A * (e.apertam - e.arrebentam);
      const dur = 2.4;
      const u = clamp((t - e.apertam) / dur);
      y -= v0 * dur * (u - 0.5 * u * u);
    }
    return y;
  }
  // fechamento: volta a funcionar
  const parado = yCabine(e.fim - 0.25);
  return lerp(parado, 2.2, prog(t, e.fim + 0.3, 3.5, suave));
};
export const Y_CABINE = yCabine;

export const estado = (t: number) => {
  const e = E();
  const yc = yCabine(t);
  const ycw = CONTRA.soma - yc;

  // --- cena: elevador de hoje × plataforma de 1854 ---
  const hoje = 1 - janela(t, e.otis, e.hoje, 0.45, 0.5);
  const otis = janela(t, e.otis + 0.2, e.hoje + 0.1, 0.45, 0.45);
  const giro = 0.65 * (1 - prog(t, 0, 3.2, saida));

  // --- polia: gira com o movimento da cabine (o cabo não escorrega) ---
  const angPolia = (yc - 0.8) / POLIA.r;

  // --- cabos ---
  const cortadoGancho = t >= e.arrebenta0 && t < e.otis + 0.6;
  const cortado = cortadoGancho || (t >= e.arrebentam && t < e.fim);
  const voltam = prog(t, e.fim, 0.6);
  const cabos = Array.from({ length: N_CABOS }, (_, i) => {
    const conta = prog(t, e.varios + i * 0.22, 0.2) * (1 - prog(t, BE(3) + 0.4, 0.4)); // contagem de um por um
    const sozinho = i > 0 ? prog(t, e.sozinho, 0.5) * (1 - prog(t, e.arrebentam - 0.3, 0.3)) : 0; // só o 1º fica
    return { conta, apagado: sozinho, vivo: !cortado || voltam > 0.5 };
  });
  const puxando = Math.max(janela(t, 0, e.arrebenta0, 0.01, 0.05), janela(t, e.gira, e.equilibra + 2.4, 0.3, 0.5), 0.8 * voltam); // cabos laranja (trabalhando)
  const estalo = Math.max(1 - Math.abs(t - e.arrebenta0) / 0.15, 1 - Math.abs(t - e.arrebentam) / 0.15, 0);

  // --- limitador: a rodinha gira com o cabo dele, preso à cabine; trava em "travam" ---
  const travaLimit = (t >= e.travam && t < e.fim) || (t >= e.arrebenta0 + 0.3 && t < e.otis + 0.6);
  const tTrava = t < e.otis + 0.6 ? e.arrebenta0 + 0.3 : e.travam;
  const angLimit = (travaLimit ? yCabine(tTrava) : yc) / LIMIT.r;
  const pesos = Math.max(prog(t, e.abrem, 0.45), janela(t, e.arrebenta0 + 0.15, e.otis + 0.4, 0.12, 0.3));
  const alavanca = Math.max(prog(t, e.alavanca, 0.4) * (1 - prog(t, e.fim, 0.5)), janela(t, e.arrebenta0 + 0.3, e.otis + 0.4, 0.1, 0.3));
  const garras = Math.max(prog(t, e.apertam, 0.25) * (1 - prog(t, e.fim, 0.5)), janela(t, e.arrebenta0 + 0.38, e.otis + 0.4, 0.08, 0.3));
  const vel = t >= e.arrebentam && t < e.apertam ? QUEDA_A * (t - e.arrebentam) : t >= e.apertam && t < e.apertam + 2.4 ? QUEDA_A * (e.apertam - e.arrebentam) * (1 - (t - e.apertam) / 2.4) : 0;
  const faiscas = Math.max(janela(t, e.apertam, e.apertam + 2.4, 0.05, 0.3), janela(t, e.arrebenta0 + 0.38, e.arrebenta0 + 0.75, 0.05, 0.2));

  // --- plataforma do Otis ---
  const sobeOtis = prog(t, e.sobe, 1.6, suave);
  const voltaOtis = prog(t, e.antes, 0.6, suave); // "antes": volta para o começo para mostrar a mola
  const corte1 = t >= e.corta && t < e.antes + 0.3;
  const corte2 = t >= e.soltou;
  const cordaInteira = !(corte1 || corte2);
  const solta = corte1 ? prog(t, e.corta, 0.12, saida) : corte2 ? prog(t, e.soltou, 0.18, saida) : 0; // a mola se abre
  const travasFora = corte1 ? prog(t, e.corta + 0.04, 0.12, saida) : corte2 ? prog(t, e.empurrou, 0.35, saida) : 0;
  const quedaOtis = corte1 ? prog(t, e.corta, 0.2, entrada) : corte2 ? prog(t, e.dentes, 0.2, entrada) : 0;
  const yPlat = lerp(0.45, OTIS.yAlta, sobeOtis) - OTIS.queda * quedaOtis * (corte1 ? 1 - voltaOtis : 1);

  // --- destaques ---
  const dest = {
    mola: Math.max(janela(t, e.mola, e.soltou + 0.6, 0.2, 0.3), 0),
    travas: janela(t, e.empurrou, B(2) - 0.2, 0.2, 0.3),
    motor: janela(t, e.motor, e.cabos, 0.2, 0.3),
    polia: janela(t, e.gira, e.cabos + 0.5, 0.2, 0.3),
    cabos: janela(t, e.cabos, e.cabine, 0.2, 0.3),
    cabine: janela(t, e.cabine, e.contrapeso, 0.2, 0.3),
    contra: janela(t, e.contrapeso, e.equilibra + 2.4, 0.2, 0.3),
    limit: janela(t, e.outro, e.alavanca, 0.2, 0.3),
    alav: janela(t, e.alavanca, e.garras, 0.2, 0.3),
    garras: janela(t, e.garras, e.ideia, 0.2, 0.3),
  };

  return {
    t, yc, ycw, hoje, otis, giro, angPolia, cabos, cortado, puxando, estalo, voltam,
    angLimit, travaLimit, pesos, alavanca, garras, vel, faiscas,
    yPlat, cordaInteira, solta, travasFora, dest,
  };
};

export { clamp, lerp, BE };
