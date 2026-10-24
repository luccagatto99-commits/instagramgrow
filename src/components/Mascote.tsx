import React from 'react';
import { COR } from '../theme';

// nós do visor (rede 3-4-2), na ordem em que acendem
const NOS: [number, number][] = [
  [398, 497.5], [398, 553.5], [398, 609.5],
  [530, 484.5], [530, 530.5], [530, 576.5], [530, 622.5],
  [662, 525.5], [662, 581.5],
];
const AZUIS_FIXOS = [4, 7];

/**
 * O mascote da página (01-marca/logo/mascote.svg): caixa branca com visor de rede
 * neural e dois olhos. Posicionado pelo centro x e pela base. `pensa` (0 → 1) acende
 * os nós do visor em sequência; `olhar` desloca os olhos (−1 esquerda, 1 direita).
 */
export const Mascote: React.FC<{ x: number; base: number; largura?: number; pensa?: number; olhar?: number; escala?: number; pulo?: number }> = ({
  x, base, largura = 200, pensa = 0, olhar = 0, escala = 1, pulo = 0,
}) => {
  const h = largura * (460 / 560);
  const acesos = Math.floor(pensa * NOS.length);
  return (
    <svg
      width={largura}
      height={h}
      viewBox="262 382 580 476"
      style={{ position: 'absolute', left: x - largura / 2, top: base - h - pulo, transform: `scale(${escala})`, transformOrigin: '50% 100%', overflow: 'visible' }}
    >
      <rect x="320" y="440" width="500" height="400" rx="66" fill={COR.preto} />
      <rect x="280" y="400" width="500" height="400" rx="66" fill={COR.branco} stroke={COR.preto} strokeWidth="32" />
      <rect x="336" y="446" width="388" height="215" rx="40" fill={COR.preto} />
      {NOS.slice(0, 3).flatMap(([x1, y1]) => NOS.slice(3, 7).map(([x2, y2]) => <line key={`${y1}-${y2}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={COR.amarelo} strokeWidth="8" strokeLinecap="round" />))}
      {NOS.slice(3, 7).flatMap(([x1, y1]) => NOS.slice(7).map(([x2, y2]) => <line key={`${y1}-${y2}b`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={COR.amarelo} strokeWidth="8" strokeLinecap="round" />))}
      {NOS.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="19" fill={i < acesos || (pensa === 0 && AZUIS_FIXOS.includes(i)) ? COR.azul : COR.branco} stroke={COR.amarelo} strokeWidth="6" />
      ))}
      <circle cx={430 + olhar * 14} cy="728" r="36" fill={COR.preto} />
      <circle cx={630 + olhar * 14} cy="728" r="36" fill={COR.preto} />
    </svg>
  );
};
