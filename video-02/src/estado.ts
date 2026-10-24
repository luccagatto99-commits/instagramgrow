// Linha do tempo da impressora 3D: tudo que acontece na cena sai daqui, em função do tempo (s).
import * as THREE from 'three';
import { B, BE, T, clamp, janela, lerp, prog, saida, suave } from './tempo';

export const COR = {
  fundo: '#0E1A2B',
  objeto: '#F4F1EA',
  move: '#FF6B2C', // só o que se move: calor, plástico derretido
  rotulo: '#8FB8FF',
  sombra: '#B5AE9C',
  traco: '#0E1A2B',
  escuro: '#2A3446',
};

// ---- medidas da impressora ----
export const Y_MESA = 0.36; // topo da mesa
export const LADO = 0.5; // lado do cubo impresso
export const N_CAMADAS = 25; // camadas desenhadas (cada uma vale 4 camadas reais de 0,2 mm)
export const ALT_CAMADA = LADO / N_CAMADAS;
export const BICO_ABAIXO = 0.33; // distância do eixo da viga até a ponta do bico
export const CARRETEL = { x: 0, y: 2.66, z: -0.05 };
export const MOTOR = { x: -1.16, y: 1.95, z: 0.12 };
export const DET = { x: -6, y: 0, z: 0.8 }; // estação de detalhe (engrenagens + bico)
export const FATIA = { x: 0, y: 1.5, z: 1.5 }; // cubo do "computador"

// ---- caminho da primeira camada (coordenadas da mesa: x e z) ----
const caminho = (() => {
  const h = LADO / 2 - 0.02;
  const pts: THREE.Vector2[] = [];
  // contorno
  pts.push(new THREE.Vector2(-h, -h), new THREE.Vector2(h, -h), new THREE.Vector2(h, h), new THREE.Vector2(-h, h), new THREE.Vector2(-h, -h + 0.03));
  // preenchimento em zigue-zague
  const passos = 12;
  for (let i = 0; i <= passos; i++) {
    const x = -h + 0.04 + (i / passos) * (2 * h - 0.08);
    const z0 = i % 2 ? h - 0.04 : -h + 0.04;
    const z1 = i % 2 ? -h + 0.04 : h - 0.04;
    pts.push(new THREE.Vector2(x, z0), new THREE.Vector2(x, z1));
  }
  return pts;
})();
const comp = caminho.slice(1).reduce((s, p, i) => s + p.distanceTo(caminho[i]), 0);
export const CAMINHO = caminho;
export const COMP_CAMINHO = comp;
export const pontoCaminho = (s: number) => {
  let r = clamp(s, 0, comp);
  for (let i = 0; i + 1 < caminho.length; i++) {
    const l = caminho[i].distanceTo(caminho[i + 1]);
    if (r <= l) return caminho[i].clone().lerp(caminho[i + 1], l ? r / l : 0);
    r -= l;
  }
  return caminho[caminho.length - 1].clone();
};

export type Estado = ReturnType<typeof estado>;

export const estado = (t: number) => {
  const d = (a: number, b: number) => janela(t, a, b, 0.3, 0.35);

  // ---------- gancho: a impressora se abre ----------
  const abre = janela(t, T(0, 'por') - 0.3, B(1) + 0.6, 0.9, 0.9);

  // ---------- computador: cubo fatiado ----------
  const fatia = janela(t, T(1, 'desenho') - 0.3, B(2) + 0.6, 0.5, 0.6);
  const separa = prog(t, T(1, 'camadas') - 0.2, 0.9);
  const tracado = prog(t, T(1, 'caminho') - 0.3, 1.0, (u) => u);
  const voa = prog(t, B(2) - 0.1, 0.8); // as fatias vão para a mesa

  // ---------- carretel ----------
  const giroCarretel = Math.max(0, t - T(2, 'fio')) * 0.6;

  // ---------- detalhe: engrenagens e bico ----------
  const detalhe = janela(t, T(3, 'O') - 0.6, B(5) + 0.4, 0.6, 0.6);
  const empurra = clamp((t - T(3, 'puxado') + 0.2) / 0.6); // engrenagens começam a girar
  const giroEngrenagem = Math.max(0, t - T(3, 'puxado') + 0.2) * 1.6 * empurra;
  const calor = prog(t, T(4, 'esquenta') - 0.2, 1.2);
  const derrete = prog(t, T(4, 'derrete') - 0.4, 0.8);
  const escorre = prog(t, T(4, 'sai') - 0.2, 0.6);
  const linhaDet = clamp((t - T(4, 'sai')) / 2.4) * 0.9; // linha que sai na plaquinha

  // ---------- primeira camada ----------
  const c0 = T(5, 'Enquanto') + 0.2;
  const c1 = T(5, 'camada') + 0.1;
  const s1 = prog(t, c0, c1 - c0, (u) => u) * comp; // quanto do caminho já foi desenhado
  const resfria = 0.55; // s até a linha ficar creme (mais rápido depois do ventilador)
  const ventilador = Math.max(0, t - T(5, 'ventilador') + 0.3);

  // ---------- camadas ----------
  const cresce = prog(t, T(6, 'sobe') - 0.2, T(6, 'crescendo') + 0.4 - T(6, 'sobe'), (u) => u);
  const nCamadas = t < T(6, 'sobe') - 0.2 ? (s1 > 0 ? 1 : 0) : Math.max(1, Math.round(lerp(1, N_CAMADAS, cresce)));

  // ---------- peça aberta: favo de mel ----------
  const levanta = prog(t, T(7, 'maciça') - 0.4, 1.0);
  const corta = prog(t, T(7, 'dentro') - 0.2, 1.0);
  const volta = prog(t, B(8) - 0.2, 1.0);

  // posição do bico (relativa à mesa) e deslocamento da mesa em z
  let bx = 0, bz = 0;
  if (t >= c0 && t < T(6, 'sobe') - 0.2) {
    const p = pontoCaminho(s1);
    bx = p.x; bz = p.y;
  } else if (nCamadas > 1 && cresce < 1) {
    bx = Math.sin(t * 7.3) * 0.2; bz = Math.cos(t * 5.1) * 0.2;
  }
  // quando parado, o bico descansa de lado
  const imprimindo = t >= c0 - 0.4 && cresce < 1;
  const descanso = 1 - (imprimindo ? 1 : 0);
  const xBico = lerp(bx, 0.55, suave(clamp(descanso)));
  const zMesa = 0.14 - bz; // o bico fica em z = 0.14
  const alturaBico = Y_MESA + Math.max(1, nCamadas) * ALT_CAMADA + (imprimindo ? 0 : 0.35);

  const destaque = {
    carretel: d(T(2, 'carretel') - 0.15, BE(2) + 0.3),
    motor: d(T(3, 'motor') - 0.2, T(3, 'tubo') - 0.1),
    tubo: d(T(3, 'tubo') - 0.2, B(4) + 0.2),
    bico: Math.max(d(T(4, 'bico') - 0.2, T(4, 'esquenta') - 0.2), d(T(5, 'bico') - 0.15, T(5, 'mesa') - 0.2)),
    mesa: d(T(5, 'mesa') - 0.15, T(5, 'Juntos') + 0.2),
    ventilador: d(T(5, 'ventilador') - 0.15, BE(5) + 0.3),
    peca: d(T(7, 'maciça') - 0.2, T(7, 'dentro') + 0.2),
  };

  return {
    t, abre, fatia, separa, tracado, voa, giroCarretel, detalhe, empurra, giroEngrenagem, calor, derrete, escorre, linhaDet,
    s1, resfria, ventilador, c0, c1, nCamadas, cresce, levanta, corta, volta,
    xBico, zMesa, alturaBico, imprimindo, destaque,
    aquecido: t > T(4, 'esquenta') - 0.2, // bico da impressora já quente
  };
};

export const sd = saida;
