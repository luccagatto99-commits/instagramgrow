import React from 'react';
import { COR } from '../theme';

export type Ponto = { x: number; y: number };
export type PoseBraco = { ombro: number; cotovelo: number; pulso?: number }; // graus; 0 = para a direita, positivo = sobe

const rad = (g: number) => (g * Math.PI) / 180;

/** Juntas do braço (ombro, cotovelo, pulso) para uma pose. `ombroPos` = topo da coluna. */
export const juntasBraco = (ombroPos: Ponto, pose: PoseBraco, l1: number, l2: number) => {
  const a1 = rad(pose.ombro);
  const a2 = rad(pose.ombro + pose.cotovelo);
  const cot = { x: ombroPos.x + l1 * Math.cos(a1), y: ombroPos.y - l1 * Math.sin(a1) };
  const pul = { x: cot.x + l2 * Math.cos(a2), y: cot.y - l2 * Math.sin(a2) };
  return { cot, pul, angPulso: pose.ombro + pose.cotovelo + (pose.pulso ?? 0) };
};

/** Cinemática inversa de 2 segmentos: pose que leva o pulso até `alvo`. Com o alvo à esquerda do ombro, `cotoveloAcima` dobra o cotovelo para o alto. */
export const poseParaAlvo = (ombroPos: Ponto, alvo: Ponto, l1: number, l2: number, pulso = 0, cotoveloAcima = true): PoseBraco => {
  const dx = alvo.x - ombroPos.x;
  const dy = ombroPos.y - alvo.y;
  const d = Math.min(l1 + l2 - 0.01, Math.max(Math.abs(l1 - l2) + 0.01, Math.hypot(dx, dy)));
  const c2 = (d * d - l1 * l1 - l2 * l2) / (2 * l1 * l2);
  const t2 = (cotoveloAcima ? 1 : -1) * Math.acos(Math.max(-1, Math.min(1, c2)));
  const t1 = Math.atan2(dy, dx) - Math.atan2(l2 * Math.sin(t2), l1 + l2 * Math.cos(t2));
  return { ombro: (t1 * 180) / Math.PI, cotovelo: (t2 * 180) / Math.PI, pulso };
};

/** Mistura duas poses (0 → a, 1 → b). */
export const misturaPose = (a: PoseBraco, b: PoseBraco, t: number): PoseBraco => ({
  ombro: a.ombro + (b.ombro - a.ombro) * t,
  cotovelo: a.cotovelo + (b.cotovelo - a.cotovelo) * t,
  pulso: (a.pulso ?? 0) + ((b.pulso ?? 0) - (a.pulso ?? 0)) * t,
});

/**
 * Braço robótico de contorno: base, coluna, dois segmentos brancos, juntas amarelas
 * e garra. `acesas` pinta juntas de azul (0 ombro, 1 cotovelo, 2 pulso, 3 garra).
 * Posicionado pela base (centro x, chão y).
 */
export const BracoRobotico: React.FC<{
  x: number;
  base: number;
  pose: PoseBraco;
  garra?: number; // 0 aberta → 1 fechada
  l1?: number;
  l2?: number;
  coluna?: number;
  escala?: number;
  acesas?: number[];
  opacidade?: number;
}> = ({ x, base, pose, garra = 0, l1 = 170, l2 = 150, coluna = 90, escala = 1, acesas = [], opacidade = 1 }) => {
  const ombro = { x, y: base - coluna };
  const { cot, pul, angPulso } = juntasBraco(ombro, pose, l1, l2);
  const g = rad(angPulso);
  const ux = Math.cos(g);
  const uy = -Math.sin(g);
  const px = -uy; // perpendicular
  const py = ux;
  const ab = 22 - 14 * Math.min(1, Math.max(0, garra)); // abertura da garra
  const dedo = (lado: 1 | -1) => {
    const bx = pul.x + ux * 18 + px * ab * lado;
    const by = pul.y + uy * 18 + py * ab * lado;
    return `M${pul.x + ux * 10 + px * 20 * lado} ${pul.y + uy * 10 + py * 20 * lado} L${bx} ${by} L${bx + ux * 34} ${by + uy * 34}`;
  };
  const junta = (p: Ponto, i: number, r = 17) => (
    <circle cx={p.x} cy={p.y} r={r} fill={acesas.includes(i) ? COR.azul : COR.amarelo} stroke={COR.preto} strokeWidth={7} />
  );
  return (
    <svg
      width={1080}
      height={1920}
      style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: opacidade, transform: `scale(${escala})`, transformOrigin: `${x}px ${base}px`, pointerEvents: 'none' }}
    >
      {/* base e coluna */}
      <rect x={x - 70} y={base - 26} width={140} height={26} rx={10} fill={COR.branco} stroke={COR.preto} strokeWidth={7} />
      <rect x={x - 18} y={ombro.y} width={36} height={coluna - 24} fill={COR.branco} stroke={COR.preto} strokeWidth={7} />
      {/* segmentos: traço preto grosso por baixo + branco por cima = contorno */}
      <path d={`M${ombro.x} ${ombro.y} L${cot.x} ${cot.y} L${pul.x} ${pul.y}`} fill="none" stroke={COR.preto} strokeWidth={40} strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M${ombro.x} ${ombro.y} L${cot.x} ${cot.y} L${pul.x} ${pul.y}`} fill="none" stroke={COR.branco} strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" />
      {/* garra */}
      {[1, -1].map((l) => (
        <path key={l} d={dedo(l as 1 | -1)} fill="none" stroke={COR.preto} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {[1, -1].map((l) => (
        <path key={`b${l}`} d={dedo(l as 1 | -1)} fill="none" stroke={acesas.includes(3) ? COR.azul : COR.branco} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {junta(ombro, 0, 20)}
      {junta(cot, 1)}
      {junta(pul, 2, 14)}
    </svg>
  );
};
