import React from 'react';
import { interpolate, Easing, useCurrentFrame } from 'remotion';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA, CENTRO_X } from '../theme';
import { entra, lin } from '../anim';
import { useVisivelNoHud } from './Camada';

/** Ano que rola de `de` para `para` entre os frames t e t + dur (para o Calendario). */
export const rolaAno = (frame: number, t: number, de: number, para: number, dur = 24) =>
  Math.round(interpolate(frame, [t, t + dur], [de, para], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) }));

/**
 * Folha de calendário do arquivo histórico: desce em `de`, mostra o ano (azul) e sobe em `ate`.
 * Fica na camada fixa (hud), logo abaixo da placa de área.
 */
export const Calendario: React.FC<{ ano: number; de: number; ate?: number; top?: number; x?: number }> = ({ ano, de, ate, top = 440, x = CENTRO_X }) => {
  const frame = useCurrentFrame();
  const vis = useVisivelNoHud();
  if (frame < de - 2 || (ate !== undefined && frame > ate + 10)) return null;
  const p = entra(frame, de, 150);
  const sai = ate === undefined ? 0 : lin(frame, ate, ate + 10);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top,
        width: 280,
        transform: `translateX(-50%) scale(${Math.max(0, p * (1 - sai))})`,
        transformOrigin: '50% 50%',
        background: COR.branco,
        border: `${CONTORNO}px solid ${COR.preto}`,
        borderRadius: RAIO.caixa,
        boxShadow: SOMBRA,
        overflow: 'hidden',
        ...vis,
      }}
    >
      <div style={{ background: COR.preto, height: 34, display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        {[0, 1].map((i) => (
          <div key={i} style={{ width: 18, height: 18, borderRadius: '50%', background: COR.amarelo }} />
        ))}
      </div>
      <div style={{ textAlign: 'center', padding: '8px 0 6px', fontFamily: FONTE.numero, fontWeight: 800, fontSize: 88, lineHeight: 1, color: COR.azul }}>{ano}</div>
    </div>
  );
};
