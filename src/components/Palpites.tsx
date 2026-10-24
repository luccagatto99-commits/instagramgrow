import React from 'react';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA } from '../theme';

export type Palpite = { rotulo: string; pct: number };

/**
 * Painel de palpites: uma barra azul por opção com a porcentagem; quando `venceu`
 * passa de 0, a primeira opção (a mais provável) fica verde. Centro x e topo.
 * `p` (0 → 1) enche as barras.
 */
export const Palpites: React.FC<{ x: number; top: number; palpites: Palpite[]; p: number; venceu?: number; largura?: number; escala?: number }> = ({
  x, top, palpites, p, venceu = 0, largura = 620, escala = 1,
}) =>
  escala > 0.01 ? (
    <div
      style={{
        position: 'absolute',
        left: x,
        top,
        width: largura,
        transform: `translateX(-50%) scale(${escala})`,
        transformOrigin: '50% 0%',
        background: COR.branco,
        border: `${CONTORNO}px solid ${COR.preto}`,
        borderRadius: RAIO.caixa,
        boxShadow: SOMBRA,
        padding: '22px 28px 14px',
      }}
    >
      {palpites.map((pp, i) => {
        const cor = i === 0 && venceu > 0.5 ? COR.verde : COR.azul;
        return (
          <div key={pp.rotulo} style={{ display: 'flex', alignItems: 'center', height: 64, marginBottom: 8, transform: i === 0 ? `scale(${1 + 0.06 * Math.sin(Math.min(1, venceu) * Math.PI)})` : undefined, transformOrigin: '0% 50%' }}>
            <div style={{ width: 170, fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 34, color: COR.preto }}>{pp.rotulo}</div>
            <div style={{ flex: 1, height: 36, border: `6px solid ${COR.preto}`, borderRadius: 10, overflow: 'hidden', background: COR.branco }}>
              <div style={{ width: `${pp.pct * p}%`, height: '100%', background: cor }} />
            </div>
            <div style={{ width: 120, textAlign: 'right', fontFamily: FONTE.numero, fontWeight: 800, fontSize: 38, color: cor }}>{Math.round(pp.pct * p)}%</div>
          </div>
        );
      })}
    </div>
  ) : null;
