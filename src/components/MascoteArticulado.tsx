import React from 'react';
import { COR } from '../theme';
import { Mascote } from './Mascote';

/**
 * O mascote com corpo articulado de contorno (nunca um humanoide realista): pernas e
 * braços brancos com juntas amarelas que encaixam peça por peça.
 * `pernas`/`bracos` = [esq, dir] de 0 → 1 (encaixe). `aceno` levanta o braço direito (0 → 1).
 * Posicionado pelo centro x e pelos pés.
 */
export const MascoteArticulado: React.FC<{
  x: number;
  base: number;
  largura?: number;
  pernas?: [number, number];
  bracos?: [number, number];
  aceno?: number;
  balanco?: number; // ângulo extra (graus) do aceno, para mexer a mão
  pensa?: number;
  olhar?: number;
  membros?: number; // opacidade dos membros (o corpo "apaga" no bloco do cérebro)
  escala?: number;
}> = ({ x, base, largura = 220, pernas = [1, 1], bracos = [1, 1], aceno = 0, balanco = 0, pensa = 0, olhar = 0, membros = 1, escala = 1 }) => {
  const s = largura / 580;
  const perna = largura * 0.42;
  const baseCorpo = base - perna + 58 * s; // o svg do mascote tem 58·s de sombra abaixo do corpo
  const topoSvg = baseCorpo - largura * (460 / 560);
  const esq = x - largura / 2 + (280 - 262) * s;
  const dir = x - largura / 2 + (780 - 262) * s;
  const yOmbro = topoSvg + (600 - 382) * s;
  const yQuadril = topoSvg + (800 - 382) * s;
  const traco = Math.max(14, largura * 0.075);

  const segmento = (pts: [number, number][], p: number, k: string) => {
    if (p <= 0) return null;
    const d = pts.map(([px, py], i) => `${i ? 'L' : 'M'}${px} ${py}`).join(' ');
    const [ox, oy] = pts[0];
    const esc = Math.min(1.15, p);
    return (
      <g key={k} transform={`translate(${ox} ${oy}) scale(${esc}) translate(${-ox} ${-oy})`} opacity={Math.min(1, p * 2) * membros}>
        <path d={d} fill="none" stroke={COR.preto} strokeWidth={traco + 12} strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} fill="none" stroke={COR.branco} strokeWidth={traco} strokeLinecap="round" strokeLinejoin="round" />
        {pts.slice(1, -1).map(([px, py], i) => (
          <circle key={i} cx={px} cy={py} r={traco * 0.62} fill={COR.amarelo} stroke={COR.preto} strokeWidth={6} />
        ))}
        <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={traco * 0.72} fill={COR.branco} stroke={COR.preto} strokeWidth={7} />
      </g>
    );
  };

  const L = largura * 0.2; // segmento do braço
  const ang = (g: number) => (g * Math.PI) / 180;
  // braço esquerdo: desce aberto; direito: desce ou acena
  const bE: [number, number][] = [
    [esq, yOmbro],
    [esq - L * 0.8, yOmbro + L * 0.6],
    [esq - L * 0.9, yOmbro + L * 1.55],
  ];
  const a1 = -40 + aceno * 95; // ombro direito (graus, 0 = horizontal)
  const a2 = a1 + 20 + aceno * (40 + balanco);
  const cot = [dir + L * Math.cos(ang(a1)), yOmbro - L * Math.sin(ang(a1))] as [number, number];
  const mao = [cot[0] + L * Math.cos(ang(a2)), cot[1] - L * Math.sin(ang(a2))] as [number, number];
  const bD: [number, number][] = [[dir, yOmbro], cot, mao];
  const pernaPts = (px: number, lado: number): [number, number][] => [
    [px, yQuadril],
    [px + lado * 6, yQuadril + perna * 0.5],
    [px + lado * 2, base - traco * 0.5],
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, transform: `scale(${escala})`, transformOrigin: `${x}px ${base}px` }}>
      <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {segmento(pernaPts(x - largura * 0.22, -1), pernas[0], 'pe')}
        {segmento(pernaPts(x + largura * 0.14, 1), pernas[1], 'pd')}
        {segmento(bE, bracos[0], 'be')}
        {segmento(bD, bracos[1], 'bd')}
      </svg>
      <Mascote x={x} base={baseCorpo} largura={largura} pensa={pensa} olhar={olhar} />
    </div>
  );
};
