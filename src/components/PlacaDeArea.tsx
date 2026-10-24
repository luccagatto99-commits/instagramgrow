import React from 'react';
import { useCurrentFrame } from 'remotion';
import { COR, FONTE, RAIO, SOMBRA, CENTRO_X } from '../theme';
import { entra } from '../anim';

/** Placa preta com texto amarelo no topo da cena. Desce com spring. */
export const PlacaDeArea: React.FC<{
  nome: string;
  termo?: string;
  inicio?: number;
  x?: number; // centro horizontal
  y?: number; // topo
  saida?: number; // frame em que começa a subir e sair
}> = ({ nome, termo, inicio = 0, x = CENTRO_X, y = 268, saida }) => {
  const frame = useCurrentFrame();
  const p = entra(frame, inicio, 150);
  const sai = saida === undefined ? 0 : Math.min(1, Math.max(0, (frame - saida) / 8));
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, ${(p - 1) * 420 - sai * sai * 420}px)`,
        background: `var(--placa, ${COR.preto})`,
        color: `var(--placa-texto, ${COR.amarelo})`,
        borderRadius: RAIO.placa,
        boxShadow: `var(--sombra-placa, ${SOMBRA})`,
        padding: termo ? '18px 40px 14px' : '22px 40px',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        opacity: Math.min(1, p * 2) * (1 - sai),
      }}
    >
      <div style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 44, letterSpacing: 2, lineHeight: 1 }}>
        {nome}
      </div>
      {termo ? (
        <div style={{ fontFamily: FONTE.rotulo, fontWeight: 700, fontSize: 36, letterSpacing: 2, lineHeight: 1, marginTop: 8, opacity: 0.85 }}>
          {termo}
        </div>
      ) : null}
    </div>
  );
};
