import React from 'react';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA } from '../theme';

/**
 * Marco de linha do tempo: cartão branco com faixa preta e o ano em amarelo,
 * conteúdo livre e legenda curta embaixo. Posicionado pelo centro x e pela base.
 */
export const MarcoTempo: React.FC<{
  x: number;
  base: number;
  ano: string;
  legenda?: string;
  largura?: number;
  altura?: number;
  escala?: number;
  opacidade?: number;
  children?: React.ReactNode;
}> = ({ x, base, ano, legenda, largura = 230, altura = 300, escala = 1, opacidade = 1, children }) => (
  <div
    style={{
      position: 'absolute',
      left: x - largura / 2,
      top: base - altura,
      width: largura,
      height: altura,
      transform: `scale(${escala})`,
      transformOrigin: '50% 100%',
      opacity: opacidade,
      background: COR.branco,
      border: `${CONTORNO}px solid ${COR.preto}`,
      borderRadius: RAIO.caixa,
      boxShadow: SOMBRA,
      boxSizing: 'border-box',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <div style={{ background: COR.preto, color: COR.amarelo, textAlign: 'center', fontFamily: FONTE.numero, fontWeight: 800, fontSize: 40, lineHeight: 1, padding: '10px 0 8px' }}>{ano}</div>
    <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>
    {legenda ? (
      <div style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 22, letterSpacing: 1, color: COR.preto, textAlign: 'center', padding: '0 6px 12px', lineHeight: 1.1 }}>{legenda}</div>
    ) : null}
  </div>
);
