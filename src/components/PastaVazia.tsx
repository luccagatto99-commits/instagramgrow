import React from 'react';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA } from '../theme';

/**
 * Pasta de arquivo aberta e vazia: aba com o rótulo e o contador em azul por dentro.
 * Posicionada pelo centro x e pela base. `treme` (0 → 1) sacode a pasta.
 */
export const PastaVazia: React.FC<{ x: number; base: number; rotulo: string; valor: string; largura?: number; escala?: number; treme?: number }> = ({
  x, base, rotulo, valor, largura = 460, escala = 1, treme = 0,
}) => {
  if (escala < 0.01) return null;
  const alt = largura * 0.62;
  return (
    <div style={{ position: 'absolute', left: x - largura / 2, top: base - alt, width: largura, height: alt, transform: `scale(${escala}) rotate(${treme * 3}deg)`, transformOrigin: '50% 100%' }}>
      {/* aba */}
      <div style={{ position: 'absolute', left: 0, top: 0, height: 70, padding: '10px 26px 0', background: COR.branco, border: `${CONTORNO}px solid ${COR.preto}`, borderBottom: 'none', borderRadius: `${RAIO.caixa}px ${RAIO.caixa}px 0 0`, fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 30, letterSpacing: 2, color: COR.preto, whiteSpace: 'nowrap', boxSizing: 'border-box' }}>
        {rotulo}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 60, bottom: 0, background: COR.branco, border: `${CONTORNO}px solid ${COR.preto}`, borderRadius: `0 ${RAIO.caixa}px ${RAIO.caixa}px ${RAIO.caixa}px`, boxShadow: SOMBRA, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', inset: 22, border: `5px dashed ${COR.preto}`, borderRadius: 14, opacity: 0.3 }} />
        <span style={{ fontFamily: FONTE.numero, fontWeight: 800, fontSize: 120, lineHeight: 1, color: COR.azul }}>{valor}</span>
      </div>
    </div>
  );
};
