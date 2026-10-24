import React from 'react';
import { useCurrentFrame } from 'remotion';
import { COR, FONTE, CENTRO_X } from '../theme';
import { entra, lin } from '../anim';
import { useVisivelNoHud } from './Camada';

/** A ideia-chave da cena: uma frase curta, centralizada, uma de cada vez. */
export const Destaque: React.FC<{ children: React.ReactNode; de: number; ate?: number; top?: number; tamanho?: number }> = ({
  children, de, ate, top = 470, tamanho = 76,
}) => {
  const frame = useCurrentFrame();
  const vis = useVisivelNoHud();
  if (frame < de || (ate !== undefined && frame >= ate + 8)) return null;
  const p = entra(frame, de, 140);
  const fora = ate === undefined ? 0 : lin(frame, ate, ate + 8);
  return (
    <div
      style={{
        position: 'absolute',
        left: CENTRO_X,
        top,
        width: 900,
        transform: `translate(-50%, ${(1 - p) * 30 - fora * 30}px)`,
        opacity: Math.min(1, p * 1.5) * (1 - fora),
        textAlign: 'center',
        fontFamily: FONTE.titulo,
        fontSize: tamanho,
        lineHeight: 1.08,
        color: COR.preto,
        ...vis,
      }}
    >
      {children}
    </div>
  );
};

/** Número dentro de um destaque (JetBrains Mono azul). */
export const Num: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ fontFamily: FONTE.numero, fontWeight: 800, color: COR.azul }}>{children}</span>
);
