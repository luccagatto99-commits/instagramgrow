import React from 'react';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA } from '../theme';

/** Catálogo de peças (vocabulário do tokenizador): placa branca com cabeçalho preto. */
export const Catalogo: React.FC<{
  x: number; // centro
  top: number;
  w: number;
  h: number;
  escala?: number;
  dy?: number;
  titulo?: string;
  termo?: string;
  opacidade?: number;
  children?: React.ReactNode;
}> = ({ x, top, w, h, escala = 1, dy = 0, titulo = 'CATÁLOGO DE PEÇAS', termo = 'vocabulário', opacidade = 1, children }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top,
      width: w,
      height: h,
      transform: `translate(-50%, ${dy}px) scale(${escala})`,
      transformOrigin: '50% 0%',
      background: COR.branco,
      border: `${CONTORNO}px solid ${COR.preto}`,
      borderRadius: RAIO.placa,
      boxShadow: SOMBRA,
      overflow: 'hidden',
      opacity: opacidade,
    }}
  >
    <div
      style={{
        background: COR.preto,
        color: COR.amarelo,
        padding: '14px 0 10px',
        textAlign: 'center',
        fontFamily: FONTE.rotulo,
        fontWeight: 900,
        fontSize: 36,
        letterSpacing: 2,
        lineHeight: 1,
      }}
    >
      {titulo}
      {termo ? <div style={{ fontWeight: 700, fontSize: 26, opacity: 0.85, marginTop: 4 }}>{termo}</div> : null}
    </div>
    <div style={{ position: 'relative', width: '100%', height: h - 90 }}>{children}</div>
  </div>
);
