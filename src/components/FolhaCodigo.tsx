import React from 'react';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA } from '../theme';

/**
 * Folha de código: cartão branco com faixa preta no topo (rótulo) e linhas em
 * JetBrains Mono. Posicionada pelo centro x e pela base. Cada linha é um nó React,
 * para quem usa destacar trechos com <Trecho>.
 */
export const FolhaCodigo: React.FC<{
  x: number;
  base: number;
  linhas: React.ReactNode[];
  rotulo?: string;
  largura?: number;
  tamanho?: number;
  escala?: number;
  opacidade?: number;
  children?: React.ReactNode;
}> = ({ x, base, linhas, rotulo = 'CÓDIGO', largura = 560, tamanho = 44, escala = 1, opacidade = 1, children }) =>
  escala > 0.01 ? (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: base,
        width: largura,
        transform: `translate(-50%, -100%) scale(${escala})`,
        transformOrigin: '50% 100%',
        opacity: opacidade,
        background: COR.branco,
        border: `${CONTORNO}px solid ${COR.preto}`,
        borderRadius: RAIO.caixa,
        boxShadow: SOMBRA,
      }}
    >
      <div style={{ background: COR.preto, color: COR.amarelo, padding: '10px 22px 6px', fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 30, letterSpacing: 3, borderRadius: '8px 8px 0 0' }}>{rotulo}</div>
      <div style={{ padding: '22px 26px 26px', fontFamily: FONTE.numero, fontWeight: 800, fontSize: tamanho, lineHeight: 1.45, color: COR.preto, whiteSpace: 'nowrap' }}>
        {linhas.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
      {children}
    </div>
  ) : null;

/** Trecho destacado numa linha de código: cor do texto e fundo opcionais. */
export const Trecho: React.FC<{ children: React.ReactNode; cor?: string; fundo?: string; opacidade?: number }> = ({ children, cor = COR.preto, fundo, opacidade = 1 }) => (
  <span style={{ color: cor, background: fundo, borderRadius: 8, padding: fundo ? '0 6px' : undefined, opacity: opacidade }}>{children}</span>
);
