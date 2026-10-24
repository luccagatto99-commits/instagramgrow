// Linha do tempo do airbag: tudo que acontece na cena sai daqui, em função do tempo (s).
// Coordenadas: volante de frente para +z, centro em C; a central (ECU) fica embaixo; câmera dos cortes em +x.
// O gancho é outra cena no mesmo lugar: o carro batendo no muro (só aparece antes do corte).
import { B, BE, T, clamp, janela, lerp, prog, saida, suave, entrada } from './tempo';

export const COR = {
  fundo: '#0E1A2B',
  objeto: '#F4F1EA',
  move: '#FF6B2C', // só o que se move: sinal elétrico, fogo, gás
  rotulo: '#8FB8FF',
  sombra: '#B5AE9C',
  traco: '#0E1A2B',
  escuro: '#2A3446',
  tecido: '#ECE6D8',
};

export type V2 = [number, number];
export type V3 = [number, number, number];

// ---- medidas ----
export const C: V3 = [0, 2.2, 0]; // centro do volante
export const ARO = 1.45;
export const CUBO = { r: 0.72, z0: -0.26, z1: 0.26 }; // miolo do volante
export const GERADOR = { r: 0.42, h: 0.2, z: -0.13 }; // a cápsula
export const ECU: V3 = [0, 0.18, 0.55]; // central com o sensor
export const ECU_TAM: V3 = [1.1, 0.34, 0.8];
export const SACO = { rx: 1.25, ry: 1.12, rz: 0.62 }; // bolsa cheia (semieixos)

// ---- eventos ----
const ev = () => ({
  // gancho: o carro bate
  batidaCarro: T(0, 'explosão') - 0.15,
  corteCarro: T(0, 'você') - 0.12, // troca para o volante grande
  // peças
  tampa: T(1, 'tampa') - 0.15,
  abrePecas: T(1, 'peças') - 0.3,
  bolsa: T(1, 'bolsa') - 0.15,
  capsula: T(1, 'cápsula') - 0.15,
  fechaPecas: B(2) + 0.2,
  // sensor
  sensor: T(2, 'sensor') - 0.1,
  buraco: T(2, 'buraco') - 0.05,
  batida: T(2, 'batida') - 0.05,
  corrente: T(2, 'sinal') - 0.15,
  chega: T(2, 'cápsula') - 0.05,
  // dentro da cápsula
  abreCapsula: B(3) - 0.3,
  faisca: T(3, 'faísca', 0) - 0.05,
  acende: T(3, 'acende') - 0.05,
  queima: T(3, 'queima') - 0.05,
  gas: T(3, 'gás') - 0.35,
  // enche
  empurra: T(4, 'empurra') - 0.1,
  rasga: T(4, 'rasga') - 0.05,
  enche: T(4, 'enche') - 0.2,
  // furos e cabeça
  furos: T(5, 'furos', 0) - 0.15,
  cabeca: T(5, 'cabeça') - 0.6,
  encosta: T(5, 'bate') + 0.05,
  // pó
  po: T(6, 'pó', 0) - 0.3,
  fim: B(7),
});
let EV: ReturnType<typeof ev> | null = null;
export const E = () => (EV ??= ev());

export type Estado = ReturnType<typeof estado>;

// ---------------- gancho: carro em alta velocidade batendo no muro ----------------
export const CARRO = { v: 15, esmaga: 0.6, lento: 0.28 };
/** tempo do carro: normal até a batida, depois em câmera lenta */
export const tCarro = (t: number) => {
  const b = E().batidaCarro;
  return t < b ? t : b + (t - b) * CARRO.lento;
};
export const carro = (t: number) => {
  const e = E();
  const tc = tCarro(t);
  const dt = tc - e.batidaCarro; // tempo do carro depois da batida
  const antes = dt < 0;
  const esm = antes ? 0 : saida(clamp(dt / 0.09));
  const x = antes ? CARRO.v * dt : CARRO.esmaga * esm;
  // boneco: continua andando dentro do carro e gira para a frente; a bolsa segura
  const tronco = antes ? 0 : Math.sin(clamp(dt / 0.32) * Math.PI * 0.5) * (1 - 0.35 * clamp((dt - 0.32) / 0.3));
  const bolsa = antes ? 0 : saida(clamp((dt - 0.03) / 0.06)) * (1 - 0.45 * clamp((dt - 0.3) / 0.4));
  const flash = antes ? 0 : 1 - clamp(dt / 0.06);
  return { x, esm, tronco, bolsa, flash, giroRodas: x / 0.36, visivel: t < e.corteCarro };
};

/** visibilidade do volante grande e do resto (só depois do corte) */
export const vVolante = (t: number) => (t >= E().corteCarro ? 1 : 0);

export const estado = (t: number) => {
  const e = E();

  // --- volante: aparece no corte e dá uma volta inteira ---
  const giro0 = (1 - prog(t, e.corteCarro, 1.6, saida)) * Math.PI * 2;

  // --- vista explodida: a tampa abre, a bolsa sai, a cápsula sai ---
  const fecha = prog(t, e.fechaPecas, 0.8);
  const destTampa = janela(t, e.tampa, e.abrePecas + 0.6, 0.2, 0.3);
  const abrePecas = prog(t, e.abrePecas, 0.6, saida) * (1 - fecha);
  const sobeBolsa = prog(t, e.bolsa, 0.7, saida) * (1 - fecha);
  const destBolsa = janela(t, e.bolsa, e.capsula, 0.2, 0.3);
  const sobeCapsula = prog(t, e.capsula, 0.7, saida) * (1 - fecha);
  const destCapsula = janela(t, e.capsula, e.fechaPecas + 0.3, 0.2, 0.3);

  // --- solavancos do sensor ---
  const shake = (t0: number, amp: number, d: number) => {
    const u = t - t0;
    if (u < 0 || u > d) return 0;
    return amp * Math.sin(u * 55) * (1 - u / d);
  };
  const tremor = shake(e.buraco + 0.1, 0.03, 0.5) + shake(e.batida + 0.15, 0.1, 1.0);
  const trancoSensor = Math.max(
    Math.exp(-Math.pow((t - (e.buraco + 0.2)) / 0.15, 2)) * 0.3,
    janela(t, e.batida + 0.05, e.batida + 1.2, 0.1, 0.5),
  );
  const destSensor = janela(t, e.sensor, e.corrente, 0.2, 0.3);

  // --- corte da cápsula: tampa e bolsa ficam transparentes para ver dentro ---
  const corteGerador = prog(t, e.abreCapsula, 0.8) * (1 - prog(t, e.empurra - 0.2, 0.5));

  // --- sinal elétrico e faísca ---
  const corrente = janela(t, e.corrente, e.faisca + 0.4, 0.2, 0.3);
  const capsulaQuente = janela(t, e.chega, e.abreCapsula + 0.4, 0.15, 0.3);
  const iniciador = prog(t, e.faisca, 0.3) * (1 - prog(t, e.gas, 1.0));
  const faisca = janela(t, e.faisca, e.faisca + 1.0, 0.05, 0.6);

  // --- combustível: acende em onda e queima ---
  const pastilhaAcesa = (i: number, n: number) => prog(t, e.acende + (i / n) * 0.7, 0.25);
  const pastilhaTam = 1 - prog(t, e.queima, 1.2, suave);
  const gasCamara = prog(t, e.queima + 0.1, 0.9) * (1 - prog(t, e.empurra + 0.6, 0.6));
  const gasFiltro = prog(t, e.gas, 0.5) * (1 - prog(t, e.empurra + 0.6, 0.6));

  // --- bolsa: rasga a tampa e enche; murcha depois que a cabeça encosta ---
  const abreRasga = prog(t, e.rasga, 0.35, saida);
  const encheReal = prog(t, e.enche - 0.25, 0.7, saida);
  const murcha = prog(t, e.encosta + 0.4, 2.8, suave);
  const enchendo = janela(t, e.enche - 0.3, e.enche + 0.8, 0.1, 0.4);
  const vazando = janela(t, e.encosta + 0.4, e.encosta + 3.4, 0.2, 0.6);
  const furos = janela(t, e.furos, e.po, 0.3, 0.4);

  // --- cabeça do boneco ---
  const zCabeca0 = 4.2;
  const zEncosta = C[2] + 0.3 + 0.55 + SACO.rz + 0.24;
  let zCabeca = zCabeca0;
  if (t >= e.cabeca) zCabeca = lerp(zCabeca0, zEncosta, prog(t, e.cabeca, e.encosta - e.cabeca, entrada));
  if (t >= e.encosta) zCabeca = zEncosta - 0.62 * prog(t, e.encosta, 3.0, saida);
  const cabeca = janela(t, e.cabeca - 0.6, e.encosta + 3.7, 0.4, 0.7);
  if (t > e.po - 0.4) zCabeca += 1.6 * prog(t, e.po - 0.4, 1.0, entrada);

  // --- pó ---
  const po = prog(t, e.po, 4.5);
  const poV = janela(t, e.po, e.fim + 0.6, 0.3, 1.0);

  // --- fechamento: a bolsa volta a ficar guardada ---
  const fim = prog(t, e.fim - 0.4, 1.2);
  const cheio = encheReal * (1 - 0.6 * murcha) * (1 - fim);
  const giroFinal = t > e.fim ? 0.35 * Math.sin((t - e.fim) * 0.6) : 0;

  return {
    t, giro: giro0 + giroFinal, xEntrada: 0, tremor, corte: 0, corteGerador,
    abrePecas, sobeBolsa, sobeCapsula, destTampa, destBolsa, destCapsula: Math.max(destCapsula, capsulaQuente), destSensor, trancoSensor,
    corrente, iniciador, faisca, pastilhaAcesa, pastilhaTam, gasCamara, gasFiltro,
    abreTampa: Math.max(abrePecas * 0.75, abreRasga) * (1 - fim), cheio, enchendo, vazando, furos,
    zCabeca, cabeca, po, poV, tranco: trancoSensor, dobrada: cheio < 0.04,
  };
};

export { clamp, lerp, BE };
