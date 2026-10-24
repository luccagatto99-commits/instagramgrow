import React from 'react';
import { useCurrentFrame } from 'remotion';
import { COR, FONTE, CONTORNO, SOMBRA } from '../theme';

export const CELULAR = { w: 250, h: 470 };

/**
 * Celular de contorno (genérico, sem marca): corpo branco, tela branca com borda.
 * Posicionado pelo centro x e pela base. `vibra` = amplitude do tremor (px) quando toca.
 */
export const Celular: React.FC<{
  x: number;
  base: number;
  escala?: number;
  vibra?: number;
  rot?: number;
  opacidade?: number;
  children?: React.ReactNode; // conteúdo da tela
}> = ({ x, base, escala = 1, vibra = 0, rot = 0, opacidade = 1, children }) => {
  const frame = useCurrentFrame();
  const dx = vibra * Math.sin(frame * 2.3);
  const dr = vibra * 0.35 * Math.sin(frame * 1.7);
  return (
    <div
      style={{
        position: 'absolute',
        left: x - CELULAR.w / 2,
        top: base - CELULAR.h,
        width: CELULAR.w,
        height: CELULAR.h,
        transform: `translateX(${dx}px) scale(${escala}) rotate(${rot + dr}deg)`,
        transformOrigin: '50% 100%',
        opacity: opacidade,
        background: COR.branco,
        border: `${CONTORNO}px solid ${COR.preto}`,
        borderRadius: 44,
        boxShadow: SOMBRA,
        boxSizing: 'border-box',
      }}
    >
      {/* alto-falante */}
      <div style={{ position: 'absolute', left: '50%', top: 14, width: 60, height: 12, marginLeft: -30, borderRadius: 6, background: COR.preto }} />
      {/* tela */}
      <div
        style={{
          position: 'absolute',
          left: 14,
          right: 14,
          top: 40,
          bottom: 50,
          border: `6px solid ${COR.preto}`,
          borderRadius: 20,
          background: COR.branco,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          fontFamily: FONTE.rotulo,
          color: COR.preto,
        }}
      >
        {children}
      </div>
      {/* botão */}
      <div style={{ position: 'absolute', left: '50%', bottom: 12, width: 26, height: 26, marginLeft: -13, borderRadius: 13, border: `5px solid ${COR.preto}`, boxSizing: 'border-box' }} />
    </div>
  );
};

/** Pontos dentro da silhueta (cabeça + ombros), para a silhueta se desfazer em números. */
const PONTOS_SILHUETA: [number, number][] = (() => {
  const pts: [number, number][] = [];
  for (let y = 8; y < 140; y += 15) {
    for (let x = 8; x < 140; x += 15) {
      const cabeca = (x - 70) ** 2 + (y - 48) ** 2 < 26 ** 2;
      const ombros = y > 84 && Math.abs(x - 70) < 18 + (y - 84) * 0.9;
      if (cabeca || ombros) pts.push([x, y]);
    }
  }
  return pts;
})();

/**
 * Silhueta de terno (sem rosto) dentro de um círculo. `desfaz` 0 → 1 troca
 * a silhueta por números azuis que sobem e somem (voz que era IA).
 */
export const AvatarTerno: React.FC<{ tamanho?: number; desfaz?: number; vazio?: boolean }> = ({ tamanho = 140, desfaz = 0, vazio }) => (
  <svg width={tamanho} height={tamanho} viewBox="0 0 140 140" style={{ overflow: 'visible' }}>
    <defs>
      <clipPath id="avatar-circ">
        <circle cx={70} cy={70} r={64} />
      </clipPath>
    </defs>
    <circle cx={70} cy={70} r={64} fill={COR.branco} stroke={COR.preto} strokeWidth={6} />
    {vazio ? (
      <text x={70} y={92} textAnchor="middle" fontFamily={FONTE.titulo} fontSize={64} fill={COR.preto}>?</text>
    ) : (
      <g opacity={1 - Math.min(1, desfaz * 1.6)} clipPath="url(#avatar-circ)">
        <circle cx={70} cy={48} r={24} fill={COR.preto} />
        <path d="M18 140 Q22 90 70 84 Q118 90 122 140 Z" fill={COR.preto} />
        {/* gola em V e gravata */}
        <path d="M58 86 L70 108 L82 86 Z" fill={COR.branco} />
        <path d="M66 94 L74 94 L77 128 L70 136 L63 128 Z" fill={COR.preto} stroke={COR.branco} strokeWidth={3} />
      </g>
    )}
    {desfaz > 0
      ? PONTOS_SILHUETA.map(([x, y], i) => {
          const atraso = ((i * 37) % 11) / 22; // 0..0.5
          const p = Math.min(1, Math.max(0, (desfaz - atraso) * 2));
          const sobe = p * p * (40 + ((i * 13) % 30));
          const op = p < 0.15 ? p / 0.15 : 1 - Math.max(0, (p - 0.6) / 0.4);
          return (
            <text
              key={i}
              x={x}
              y={y - sobe}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily={FONTE.numero}
              fontWeight={800}
              fontSize={16}
              fill={COR.azul}
              opacity={desfaz >= 1 ? 0 : op}
            >
              {(i * 7) % 10}
            </text>
          );
        })
      : null}
  </svg>
);
