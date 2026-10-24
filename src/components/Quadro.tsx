import React from 'react';
import { useCurrentFrame } from 'remotion';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA, CENTRO_X } from '../theme';
import { entra, pop } from '../anim';
import { useVisivelNoHud } from './Camada';

export type ItemQuadro = { texto: string; em: number };

/**
 * Quadro de turno: lista curta de 3 itens.
 * No começo do vídeo é a promessa ("HOJE NA FÁBRICA"); no fim, o resumo com ✓ ("RESUMO DO TURNO").
 */
export const Quadro: React.FC<{
  titulo: string;
  itens: ItemQuadro[];
  inicio?: number;
  feito?: boolean; // resumo: selo verde com ✓ no lugar do número
  destaque?: { indice: number; em: number }; // pulso num item (ex.: "fica até o fim")
  top?: number;
}> = ({ titulo, itens, inicio = 0, feito, destaque, top = 450 }) => {
  const frame = useCurrentFrame();
  const p = entra(frame, inicio, 130);
  const vis = useVisivelNoHud();
  return (
    <div
      style={{
        position: 'absolute',
        left: CENTRO_X,
        top,
        width: 880,
        transform: `translate(-50%, ${(1 - p) * 40}px) scale(${0.9 + 0.1 * p})`,
        opacity: Math.min(1, p * 1.6),
        background: COR.branco,
        border: `${CONTORNO}px solid ${COR.preto}`,
        borderRadius: RAIO.placa,
        boxShadow: SOMBRA,
        overflow: 'hidden',
        ...vis,
      }}
    >
      <div
        style={{
          background: COR.preto,
          color: COR.amarelo,
          padding: '20px 0 16px',
          textAlign: 'center',
          fontFamily: FONTE.rotulo,
          fontWeight: 900,
          fontSize: 44,
          letterSpacing: 2,
          lineHeight: 1,
        }}
      >
        {titulo}
      </div>
      <div style={{ padding: '26px 30px 30px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {itens.map((it, i) => {
          const pi = entra(frame, it.em, 150);
          const visivel = frame >= it.em;
          const pulso = destaque && destaque.indice === i ? pop(frame, destaque.em, 0.08) : 1;
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 24,
                opacity: visivel ? Math.min(1, pi * 1.6) : 0.18,
                transform: `translateX(${visivel ? (1 - pi) * -60 : 0}px) scale(${pulso})`,
                transformOrigin: '0% 50%',
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  flex: '0 0 auto',
                  border: `8px solid ${COR.preto}`,
                  borderRadius: 18,
                  background: feito && visivel ? COR.verde : COR.branco,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: feito ? FONTE.titulo : FONTE.numero,
                  fontWeight: 800,
                  fontSize: feito ? 48 : 44,
                  color: feito ? COR.preto : COR.azul,
                }}
              >
                {feito ? (visivel ? '✓' : '') : i + 1}
              </div>
              <div style={{ fontFamily: FONTE.titulo, fontSize: 56, lineHeight: 1.1, color: COR.preto, whiteSpace: 'nowrap' }}>{it.texto}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
