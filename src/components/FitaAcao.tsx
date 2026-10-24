import React from 'react';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA } from '../theme';

export type GrupoAcao = { numeros: number[]; rotulo: string };

/**
 * Fita de ação: uma tira branca com os números de um movimento (azul, JetBrains Mono)
 * em grupos, cada grupo com o rótulo do que controla. `revela` (0 → 1) mostra os números
 * em ordem; `destaque` = índice do grupo em evidência. Posicionada pelo centro x e pelo topo.
 */
export const FitaAcao: React.FC<{
  x: number;
  top: number;
  grupos: GrupoAcao[];
  revela?: number;
  destaque?: number;
  tamanho?: number;
  escala?: number;
}> = ({ x, top, grupos, revela = 1, destaque, tamanho = 46, escala = 1 }) => {
  const total = grupos.reduce((a, g) => a + g.numeros.length, 0);
  const visiveis = Math.round(revela * total);
  let n = 0;
  return (
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
        padding: '14px 18px 12px',
        display: 'flex',
        gap: 18,
        whiteSpace: 'nowrap',
      }}
    >
      {grupos.map((g, gi) => {
        const nums = g.numeros.map((v) => {
          const k = n++;
          return (
            <span key={k} style={{ opacity: k < visiveis ? 1 : 0.12 }}>
              {v}
            </span>
          );
        });
        const on = destaque === gi;
        return (
          <div key={gi} style={{ textAlign: 'center', borderRadius: 12, padding: '2px 6px', background: on ? COR.amarelo : undefined }}>
            <div style={{ fontFamily: FONTE.numero, fontWeight: 800, fontSize: tamanho, color: COR.azul, lineHeight: 1.05, display: 'flex', gap: tamanho * 0.3, justifyContent: 'center' }}>{nums}</div>
            <div style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 20, letterSpacing: 1, color: COR.preto, marginTop: 6, opacity: 0.8 }}>{g.rotulo}</div>
          </div>
        );
      })}
    </div>
  );
};
