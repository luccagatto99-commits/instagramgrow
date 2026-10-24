import React from 'react';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA } from '../theme';

/**
 * Velocímetro de traço: meio mostrador branco, ponteiro preto e o valor em azul embaixo.
 * Posicionado pelo centro do eixo do ponteiro. `rodape` = linha pequena sob o valor (ex.: "≈ 1 s").
 */
export const Velocimetro: React.FC<{ x: number; y: number; valor: number; max?: number; unidade?: string; rodape?: string; r?: number; escala?: number }> = ({
  x, y, valor, max = 100, unidade = 'km/h', rodape, r = 90, escala = 1,
}) => {
  if (escala < 0.01) return null;
  const a = Math.PI + (Math.min(valor, max) / max) * Math.PI;
  return (
    <div style={{ position: 'absolute', left: x - r - 10, top: y - r - 10, width: r * 2 + 20, transform: `scale(${escala})`, transformOrigin: `${r + 10}px ${r + 10}px`, textAlign: 'center' }}>
      <svg width={r * 2 + 20} height={r + 24} viewBox={`${-r - 10} ${-r - 10} ${r * 2 + 20} ${r + 24}`} strokeLinecap="round">
        <path d={`M${-r} 0 A${r} ${r} 0 0 1 ${r} 0 Z`} fill={COR.branco} stroke={COR.preto} strokeWidth={CONTORNO} strokeLinejoin="round" />
        {Array.from({ length: 6 }).map((_, i) => {
          const t = Math.PI + (i / 5) * Math.PI;
          return <line key={i} x1={Math.cos(t) * r * 0.72} y1={Math.sin(t) * r * 0.72} x2={Math.cos(t) * r * 0.86} y2={Math.sin(t) * r * 0.86} stroke={COR.preto} strokeWidth={6} />;
        })}
        <line x1={0} y1={0} x2={Math.cos(a) * r * 0.78} y2={Math.sin(a) * r * 0.78} stroke={COR.preto} strokeWidth={10} />
        <circle r={12} fill={COR.preto} />
      </svg>
      <div style={{ fontFamily: FONTE.numero, fontWeight: 800, fontSize: 52, lineHeight: 1, color: COR.azul, whiteSpace: 'nowrap' }}>
        {Math.round(valor)}
        <span style={{ fontSize: 28 }}> {unidade}</span>
      </div>
      {rodape ? <div style={{ marginTop: 6, fontFamily: FONTE.numero, fontWeight: 800, fontSize: 34, color: COR.azul, whiteSpace: 'nowrap' }}>{rodape}</div> : null}
    </div>
  );
};

/** Cronômetro digital: caixa branca com os segundos em azul (3 casas, milissegundos). Centro x e topo. */
export const Cronometro: React.FC<{ x: number; top: number; segundos: number; escala?: number; casas?: number }> = ({ x, top, segundos, escala = 1, casas = 3 }) =>
  escala > 0.01 ? (
    <div
      style={{
        position: 'absolute',
        left: x,
        top,
        transform: `translateX(-50%) scale(${escala})`,
        transformOrigin: '50% 0%',
        background: COR.branco,
        border: `${CONTORNO}px solid ${COR.preto}`,
        borderRadius: RAIO.caixa,
        boxShadow: SOMBRA,
        padding: '12px 30px 8px',
        fontFamily: FONTE.numero,
        fontWeight: 800,
        fontSize: 60,
        lineHeight: 1,
        color: COR.azul,
        whiteSpace: 'nowrap',
      }}
    >
      {segundos.toFixed(casas).replace('.', ',')} s
    </div>
  ) : null;
