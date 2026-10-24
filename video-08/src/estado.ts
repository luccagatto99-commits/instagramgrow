// Linha do tempo da fechadura. Tudo sai daqui, em função do tempo (s).
// Coordenadas: eixo do cilindro em x (a chave entra pela esquerda), y para cima, corte no plano z = 0 (vemos a metade de trás).
import { B, T, clamp, janela, lerp, prog, saida, suave, entrada } from './tempo';

export const COR = {
  fundo: '#0E1A2B',
  objeto: '#F4F1EA',
  move: '#FF6B2C', // só o que se move/trabalha: linha de corte quando os pinos alinham, pinos subindo
  rotulo: '#8FB8FF',
  sombra: '#B5AE9C',
  traco: '#0E1A2B',
  escuro: '#2A3446',
  mola: '#CFCBC2',
};

export type V2 = [number, number];
export type V3 = [number, number, number];

// ---- medidas ----
export const X0 = -1.8; // frente (entrada da chave)
export const X1 = 1.6; // fundo
export const R = 0.62; // raio do cilindro = LINHA DE CORTE (topo do cilindro)
export const KT = 0.2; // topo do canal da chave
export const KB = -0.45; // fundo do canal da chave
export const KE = 1.5; // fim do canal
export const TOPO = 2.15; // topo do corpo
export const FURO_TOPO = 1.95; // fim dos furos no corpo
export const PROF = 0.95; // espessura da metade do corpo (em z)
export const PX = [-1.2, -0.6, 0, 0.6, 1.2]; // furos (5 pinos)
export const RF = 0.11; // raio do furo
export const RP = 0.09; // raio do pino
export const L_CIMA = 0.5; // pino de cima (todos iguais)
export const REPOUSO = -0.15; // sem chave, a ponta do pino de baixo desce até aqui (dentro do canal)

// ---- chave ----
export const PONTA_DENTRO = 1.45; // x da ponta com a chave toda dentro
export const LAMINA = 3.15; // comprimento da lâmina (da ponta até o ombro)
export const CHAVE_BAIXO = -0.42;
export const TETO_CHAVE = 0.17;
export const altura = (corte: number) => 0.16 - (corte - 1) * 0.07; // corte 1 (raso) .. 6 (fundo)
export const CERTA = [3, 5, 2, 4, 1];
export const VIZINHO = [3, 2, 2, 4, 1]; // só o 2º corte muda: o 2º pino sobe demais
export const L_BAIXO = CERTA.map((c) => R - altura(c)); // pinos de baixo: cada um do tamanho que a chave certa pede
const U_CORTE = PX.map((x) => PONTA_DENTRO - x); // posição de cada corte medida a partir da ponta

/** topo da lâmina a `u` da ponta (null fora da lâmina) */
export const topoChave = (cortes: number[], u: number): number | null => {
  if (u < 0 || u > LAMINA) return null;
  let y = Math.min(TETO_CHAVE, -0.3 + 2.2 * u);
  cortes.forEach((c, j) => { y = Math.min(y, altura(c) + Math.abs(u - U_CORTE[j]) * 1.0); });
  return y;
};

export type Chave = { nome: 'sua' | 'vizinho' | 'outra'; cortes: number[] };
export const CHAVES: Chave[] = [
  { nome: 'sua', cortes: CERTA },
  { nome: 'vizinho', cortes: VIZINHO },
  { nome: 'outra', cortes: CERTA }, // outra porta, mesmos cortes
];
const FORA = -4.6; // x da ponta com a chave fora

// ---- eventos ----
const ev = () => ({
  vizinhoEntra: T(0, 'vizinho') - 0.2,
  tranco0: T(0, 'abre') - 0.05,
  em90: T(0, 'Em') - 0.1,
  abre: T(1, 'Aberta') - 0.15,
  cilindro: T(1, 'cilindro,', 0) - 0.15,
  corpo: T(1, 'corpo') - 0.15,
  girar: T(1, 'girar.') - 0.25,
  travando: T(1, 'travando.') - 0.1,
  furos: T(2, 'furos') - 0.15,
  mola: T(2, 'mola,') - 0.15,
  cima: T(2, 'cima,') - 0.35,
  baixo: T(2, 'baixo.') - 0.35,
  empurra: T(2, 'empurra') - 0.15,
  metade: T(2, 'metade', 0) - 0.15,
  trava: T(2, 'trava.') - 0.2,
  tamanhos: T(3, 'tamanhos') - 0.2,
  chave: T(3, 'chave,') - 0.25,
  dente: T(3, 'dente') - 0.15,
  certa: T(4, 'certa,') - 0.15,
  emenda: T(4, 'emenda') - 0.15,
  linha: T(4, 'linha', 0) - 0.15,
  todos: T(4, 'todos') - 0.15,
  gira: T(4, 'gira.') - 0.15,
  atras: T(4, 'Atrás') - 0.15,
  pecinha: T(4, 'pecinha') - 0.15,
  puxa: T(4, 'puxa') - 0.1,
  errada: T(5, 'errada,') - 0.4,
  pino: T(5, 'pino') - 0.15,
  atravessa: T(5, 'atravessa') - 0.15,
  sai: T(5, 'sai') - 0.1,
  asVezes: B(6) - 0.2,
  abre6: T(6, 'abre.') - 0.15,
  poucos: T(6, 'poucos') - 0.15,
  combinacoes: T(6, 'combinações') - 0.15,
  milhoes: T(6, 'milhões') - 0.15,
  alguma: T(6, 'Alguma,') - 0.15,
  cortes: T(6, 'cortes') - 0.2,
  fim: B(7) - 0.2,
  segue: T(7, 'Segue') - 0.3,
});
let EV: ReturnType<typeof ev> | null = null;
export const E = () => (EV ??= ev());
export type Estado = ReturnType<typeof estado>;

// ---- quando cada chave está dentro: [começa a entrar, dura, começa a sair, dura] ----
const percursos = () => {
  const e = E();
  return {
    sua: [e.chave, 2.6, B(5) - 0.45, 0.6],
    vizinho: [-0.9, e.vizinhoEntra + 0.6 + 0.9, e.em90 + 0.5, 0.9, e.errada, 1.3, B(6) - 0.55, 0.6],
    outra: [B(6) + 0.1, 1.15, e.fim - 0.75, 0.7],
  } as Record<Chave['nome'], number[]>;
};
let PERC: ReturnType<typeof percursos> | null = null;
const pontaChave = (nome: Chave['nome'], t: number) => {
  const p = (PERC ??= percursos())[nome];
  let x = FORA;
  for (let k = 0; k < p.length; k += 4) {
    const [a, da, s, ds] = p.slice(k, k + 4);
    if (t < a) break;
    x = t < s ? lerp(FORA, PONTA_DENTRO, prog(t, a, da, saida)) : lerp(PONTA_DENTRO, FORA, prog(t, s, ds, entrada));
  }
  return x;
};

/** tranco: tenta girar e volta (cilindro travado) */
const tranco = (t: number, a: number) => {
  const u = clamp((t - a) / 0.45);
  return u <= 0 || u >= 1 ? 0 : 0.085 * Math.sin(u * Math.PI) * (1 - u * 0.4);
};
const giro = (t: number) => {
  const e = E();
  const g1 = prog(t, e.gira, 0.9, suave) * (1 - prog(t, B(5) - 1.0, 0.5, suave));
  const g2 = prog(t, e.abre6, 0.75, suave) * (1 - prog(t, e.fim - 1.45, 0.6, suave));
  return (Math.PI / 2) * Math.max(g1, g2) + tranco(t, e.tranco0) + tranco(t, e.travando) + tranco(t, e.sai);
};

export const estado = (t: number) => {
  const e = E();

  // metade da frente: fechada no gancho, abre em "Aberta ao meio", volta no fechamento
  const abertura = prog(t, e.abre, 1.1, suave) * (1 - prog(t, e.fim + 0.6, 1.2, suave));
  const giroInicial = 0.5 * (1 - prog(t, 0, 3.2, saida));

  const chaves = CHAVES.map((c) => ({ ...c, ponta: pontaChave(c.nome, t) }));
  const rot = giro(t);
  const girou = clamp(rot / (Math.PI / 2));

  // pinos: a ponta do pino de baixo apoia na lâmina (se tiver chave embaixo dele)
  const pinos = PX.map((px, i) => {
    let base = REPOUSO;
    for (const c of chaves) {
      const y = topoChave(c.cortes, c.ponta - px);
      if (y !== null) base = Math.max(base, y);
    }
    const topoBaixo = base + L_BAIXO[i];
    const baseCima = rot > 0.02 ? Math.max(R, topoBaixo) : topoBaixo; // com o cilindro girado, o pino de cima fica no corpo
    const alinhado = Math.abs(topoBaixo - R) < 0.012;
    return { px, base, topoBaixo, baseCima, alinhado, passa: topoBaixo - R };
  });
  const todosAlinhados = pinos.every((p) => p.alinhado);

  // destaques (contorno laranja/claro do que a narração cita)
  const dest = {
    cilindro: janela(t, e.cilindro, e.corpo, 0.2, 0.3),
    corpo: janela(t, e.corpo, e.girar, 0.2, 0.3),
    furos: janela(t, e.furos, e.mola, 0.2, 0.3),
    mola: janela(t, e.mola, e.cima, 0.2, 0.3),
    cima: janela(t, e.cima, e.baixo, 0.2, 0.3) + janela(t, e.metade, e.trava + 0.9, 0.2, 0.3),
    baixo: janela(t, e.baixo, e.empurra, 0.2, 0.3) + janela(t, e.tamanhos, e.chave, 0.2, 0.3),
    pino2: janela(t, e.pino, e.sai + 0.6, 0.2, 0.3),
    came: janela(t, e.atras, e.puxa + 0.4, 0.2, 0.3),
    lingueta: janela(t, e.puxa, B(5) - 0.6, 0.2, 0.3),
  };
  // linha de corte: aparece em "metade" (trava) e acende laranja quando os 5 alinham
  const linhaVisivel = Math.max(janela(t, e.metade, e.trava + 1.2, 0.3, 0.4), janela(t, e.emenda, B(5) - 0.4, 0.3, 0.4), janela(t, e.errada + 1.0, e.sai + 0.9, 0.3, 0.4), janela(t, e.abre6 - 0.6, e.abre6 + 1.2, 0.2, 0.4));
  const linhaQuente = todosAlinhados ? 1 : 0;
  const mola = janela(t, e.empurra, e.metade, 0.2, 0.3); // molas acesas enquanto "empurra"

  // lingueta: recua quando o cilindro gira (a came puxa)
  const lingueta = -0.75 * clamp((girou - 0.15) / 0.75);

  // lingueta só aparece quando a narração chega nela (antes, só poluiria a cena)
  const linguetaVisivel = Math.max(janela(t, e.atras - 0.3, B(5) - 0.3, 0.35, 0.4), janela(t, e.abre6 - 0.2, e.fim - 0.6, 0.35, 0.4));

  return { t, abertura, linguetaVisivel, giroInicial, chaves, rot, girou, pinos, todosAlinhados, dest, linhaVisivel, linhaQuente, mola, lingueta };
};

export { clamp, lerp };
