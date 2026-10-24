import React from 'react';
import { COR, FONTE, CONTORNO, RAIO } from '../theme';

/** Bloco contornado (cor pelo papel) com placa de nome e, menor, o termo técnico. */
export const Maquina: React.FC<{
  x: number; // esquerda
  y: number; // topo
  w: number;
  h: number;
  cor?: string;
  nome: string;
  termo?: string;
  dy?: number; // deslocamento (tranco)
  dx?: number;
  children?: React.ReactNode; // ícone de traço
}> = ({ x, y, w, h, cor = COR.vermelho, nome, termo, dy = 0, dx = 0, children }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, transform: `translate(${dx}px, ${dy}px)` }}>
    <div
      style={{
        height: h,
        background: cor,
        border: `${CONTORNO}px solid ${COR.preto}`,
        borderRadius: RAIO.maquina,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {children}
    </div>
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: -40,
        transform: 'translateX(-50%)',
        background: COR.preto,
        color: COR.amarelo,
        borderRadius: 16,
        padding: '10px 22px 8px',
        whiteSpace: 'nowrap',
        textAlign: 'center',
      }}
    >
      <div style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 36, letterSpacing: 2, lineHeight: 1 }}>{nome}</div>
      {termo ? (
        <div style={{ fontFamily: FONTE.rotulo, fontWeight: 700, fontSize: 26, letterSpacing: 2, lineHeight: 1.15, opacity: 0.85 }}>{termo}</div>
      ) : null}
    </div>
  </div>
);
