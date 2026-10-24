import React from 'react';
import { COR, FONTE, CONTORNO } from '../theme';

/**
 * Fita horizontal de números decimais (JetBrains Mono azul), como a lista de
 * um embedding. `largura` estica a fita a partir de `x`; `deslocamento` rola os
 * números para a direita (sentido da esteira).
 */
export const FitaDeNumeros: React.FC<{
  x: number; // borda esquerda
  y: number; // topo
  largura: number;
  valores: string[];
  deslocamento?: number;
  tamanho?: number;
}> = ({ x, y, largura, valores, deslocamento = 0, tamanho = 44 }) => {
  if (largura <= 0) return null;
  const altura = Math.round(tamanho * 1.9);
  const celula = Math.round(Math.max(...valores.map((v) => v.length)) * tamanho * 0.62 + 56);
  const ciclo = celula * valores.length;
  const off = ((deslocamento % ciclo) + ciclo) % ciclo;
  const n = Math.ceil(largura / celula) + valores.length + 1;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: largura,
        height: altura,
        background: COR.branco,
        border: `${CONTORNO}px solid ${COR.preto}`,
        borderRadius: 16,
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {Array.from({ length: n }).map((_, i) => {
        const left = i * celula - ciclo + off;
        if (left > largura || left + celula < 0) return null;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left,
              top: 0,
              width: celula,
              height: altura - CONTORNO * 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRight: `5px solid ${COR.preto}`,
              fontFamily: FONTE.numero,
              fontWeight: 800,
              fontSize: tamanho,
              color: COR.azul,
              whiteSpace: 'nowrap',
            }}
          >
            {valores[i % valores.length]}
          </div>
        );
      })}
    </div>
  );
};

/** Valores ilustrativos de um embedding (formato pt-BR, com sinal). */
export const VALORES_FITA = ['0,021', '−0,734', '0,412', '−0,088', '0,965', '−0,301', '0,157', '−0,612', '0,330', '−0,047'];
