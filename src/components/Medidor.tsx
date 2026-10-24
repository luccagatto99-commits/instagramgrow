import React from 'react';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA } from '../theme';

/**
 * Medidor: cartão branco com mostrador semicircular (arco azul = valor medido)
 * e rótulo embaixo. Posicionado pelo centro x e pelo topo.
 */
export const Medidor: React.FC<{
  x: number;
  top: number;
  rotulo: string;
  valor: number; // 0 → 1
  largura?: number;
  escala?: number;
  opacidade?: number;
}> = ({ x, top, rotulo, valor, largura = 172, escala = 1, opacidade = 1 }) => {
  const r = 58;
  const a = Math.PI * (1 - Math.min(1, Math.max(0, valor))); // π (esq.) → 0 (dir.)
  const px = (ang: number, rr: number) => 80 + Math.cos(ang) * rr;
  const py = (ang: number, rr: number) => 78 - Math.sin(ang) * rr;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - largura / 2,
        top,
        width: largura,
        transform: `scale(${escala})`,
        transformOrigin: '50% 0%',
        opacity: opacidade,
        background: COR.branco,
        border: `${CONTORNO}px solid ${COR.preto}`,
        borderRadius: RAIO.caixa,
        boxShadow: SOMBRA,
        padding: '14px 0 12px',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      <svg width={160} height={96} viewBox="0 0 160 96">
        <path d={`M${px(Math.PI, r)} ${py(Math.PI, r)} A${r} ${r} 0 0 1 ${px(0, r)} ${py(0, r)}`} fill="none" stroke={COR.preto} strokeWidth={8} strokeLinecap="round" />
        {valor > 0.01 ? (
          <path d={`M${px(Math.PI, r)} ${py(Math.PI, r)} A${r} ${r} 0 0 1 ${px(a, r)} ${py(a, r)}`} fill="none" stroke={COR.azul} strokeWidth={16} strokeLinecap="round" />
        ) : null}
        {[0.25, 0.5, 0.75].map((t) => {
          const ang = Math.PI * (1 - t);
          return <line key={t} x1={px(ang, r - 22)} y1={py(ang, r - 22)} x2={px(ang, r - 12)} y2={py(ang, r - 12)} stroke={COR.preto} strokeWidth={5} strokeLinecap="round" />;
        })}
        <line x1={80} y1={78} x2={px(a, r - 14)} y2={py(a, r - 14)} stroke={COR.preto} strokeWidth={8} strokeLinecap="round" />
        <circle cx={80} cy={78} r={10} fill={COR.preto} />
      </svg>
      <div style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: Math.min(28, (largura - 24) / (rotulo.length * 0.72)), letterSpacing: 1, color: COR.preto, lineHeight: 1, marginTop: 4 }}>{rotulo}</div>
    </div>
  );
};
