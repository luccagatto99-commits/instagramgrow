import React from 'react';
import { COR, FONTE, CONTORNO, RAIO } from '../theme';

/**
 * Balão de conversa: branco, contorno preto, rabinho embaixo (à esquerda ou à direita).
 * Posicionado pelo centro x e pela base (ponta do rabinho).
 */
export const Balao: React.FC<{
  x: number;
  base: number;
  children: React.ReactNode;
  rabo?: 'esq' | 'dir';
  largura?: number;
  tamanho?: number;
  escala?: number;
  opacidade?: number;
}> = ({ x, base, children, rabo = 'esq', largura = 300, tamanho = 36, escala = 1, opacidade = 1 }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: base - 34,
      width: largura,
      transform: `translate(-50%, -100%) scale(${escala})`,
      transformOrigin: `${rabo === 'esq' ? 25 : 75}% calc(100% + 34px)`,
      opacity: opacidade,
    }}
  >
    <div
      style={{
        background: COR.branco,
        border: `${CONTORNO}px solid ${COR.preto}`,
        borderRadius: RAIO.caixa + 6,
        padding: '14px 22px 12px',
        textAlign: 'center',
        fontFamily: FONTE.titulo,
        fontSize: tamanho,
        lineHeight: 1.1,
        color: COR.preto,
      }}
    >
      {children}
    </div>
    <svg width={60} height={44} viewBox="0 0 60 44" style={{ position: 'absolute', top: '100%', marginTop: -10, left: rabo === 'esq' ? '22%' : undefined, right: rabo === 'dir' ? '22%' : undefined, overflow: 'visible' }}>
      <path d={rabo === 'esq' ? 'M4 0 L10 40 L40 0' : 'M56 0 L50 40 L20 0'} fill={COR.branco} stroke={COR.preto} strokeWidth={CONTORNO} strokeLinejoin="round" />
      <rect x={rabo === 'esq' ? 8 : 24} y={-12} width={28} height={12} fill={COR.branco} />
    </svg>
  </div>
);
