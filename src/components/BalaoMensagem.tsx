import React from 'react';
import { COR, FONTE, CONTORNO, SOMBRA } from '../theme';

/**
 * Balão de mensagem de chat (genérico, sem logo de aplicativo): remetente em cima,
 * texto e hora. Rabinho no canto inferior esquerdo. Posicionado pelo centro x e pela base.
 */
export const BalaoMensagem: React.FC<{
  x: number;
  base: number;
  remetente: string;
  texto: string;
  hora?: string;
  largura?: number;
  tamanho?: number;
  escala?: number;
  opacidade?: number;
}> = ({ x, base, remetente, texto, hora = '09:41', largura = 360, tamanho = 40, escala = 1, opacidade = 1 }) => (
  <div
    style={{
      position: 'absolute',
      left: x - largura / 2,
      top: base,
      width: largura,
      transform: `translateY(-100%) scale(${escala})`,
      transformOrigin: '0% 100%',
      opacity: opacidade,
    }}
  >
    <div
      style={{
        background: COR.branco,
        border: `${CONTORNO}px solid ${COR.preto}`,
        borderRadius: '30px 30px 30px 6px',
        boxShadow: SOMBRA,
        padding: '16px 24px 12px',
      }}
    >
      <div style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 28, letterSpacing: 2, color: COR.preto, lineHeight: 1, opacity: 0.75 }}>{remetente}</div>
      <div style={{ fontFamily: FONTE.titulo, fontSize: tamanho, lineHeight: 1.1, color: COR.preto, marginTop: 10 }}>{texto}</div>
      <div style={{ fontFamily: FONTE.numero, fontWeight: 700, fontSize: 24, color: COR.preto, opacity: 0.6, textAlign: 'right', marginTop: 6 }}>{hora}</div>
    </div>
  </div>
);
