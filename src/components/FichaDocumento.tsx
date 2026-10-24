import React from 'react';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA } from '../theme';

/**
 * Documento (processo, certidão, citação): cartão branco com rótulo no topo,
 * nome e número. Posicionado pelo centro x e pela base. `children` desenha por cima (carimbo).
 */
export const FichaDocumento: React.FC<{
  x: number;
  base: number;
  rotulo?: string;
  nome: React.ReactNode;
  numero?: React.ReactNode;
  largura?: number;
  escala?: number;
  rot?: number;
  opacidade?: number;
  tamanho?: number; // fonte do nome
  revela?: number; // 0 → 1: o conteúdo aparece da esquerda para a direita (sendo escrito)
  anulada?: number; // 0 → 1: o texto apaga (documento carimbado), para o carimbo não brigar com ele
  children?: React.ReactNode;
}> = ({ x, base, rotulo = 'PROCESSO', nome, numero, largura = 300, escala = 1, rot = 0, opacidade = 1, tamanho = 34, revela = 1, anulada = 0, children }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: base,
      width: largura,
      transform: `translate(-50%, -100%) scale(${escala}) rotate(${rot}deg)`,
      transformOrigin: '50% 100%',
      opacity: opacidade,
      background: COR.branco,
      border: `${CONTORNO}px solid ${COR.preto}`,
      borderRadius: RAIO.caixa,
      boxShadow: SOMBRA,
    }}
  >
    <div
      style={{
        background: COR.preto,
        color: COR.amarelo,
        padding: '8px 16px 6px',
        fontFamily: FONTE.rotulo,
        fontWeight: 900,
        fontSize: Math.round(tamanho * 0.7),
        letterSpacing: 2,
        borderRadius: `${RAIO.caixa - 10}px ${RAIO.caixa - 10}px 0 0`,
      }}
    >
      {rotulo}
    </div>
    <div style={{ padding: `${Math.round(tamanho * 0.4)}px 18px ${Math.round(tamanho * 0.5)}px`, clipPath: `inset(0 ${(1 - revela) * 100}% 0 0)`, opacity: 1 - 0.8 * anulada }}>
      <div style={{ fontFamily: FONTE.titulo, fontSize: tamanho, lineHeight: 1.1, color: COR.preto }}>{nome}</div>
      {numero ? (
        <div style={{ fontFamily: FONTE.numero, fontWeight: 800, fontSize: Math.round(tamanho * 0.8), color: COR.azul, marginTop: 6 }}>{numero}</div>
      ) : null}
    </div>
    {children}
  </div>
);
