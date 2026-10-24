import React from 'react';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA, CENTRO_X } from '../theme';

/**
 * Duas metades lado a lado para comparar (antes × depois). Cada painel é um
 * quadro branco com título; o conteúdo de cada lado usa coordenadas do painel.
 */
export const TelaDividida: React.FC<{
  top: number;
  altura: number;
  largura?: number; // largura total (os dois painéis + vão)
  vao?: number;
  titulos: [string, string];
  esquerda: React.ReactNode;
  direita: React.ReactNode;
  entrada?: [number, number]; // 0 → 1 de cada painel
}> = ({ top, altura, largura = 820, vao = 24, titulos, esquerda, direita, entrada = [1, 1] }) => {
  const w = (largura - vao) / 2;
  const x0 = CENTRO_X - largura / 2;
  return (
    <>
      {[esquerda, direita].map((conteudo, i) => {
        const p = entrada[i];
        if (p <= 0.01) return null;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x0 + i * (w + vao),
              top,
              width: w,
              height: altura,
              transform: `translateY(${(1 - p) * 60}px) scale(${0.9 + 0.1 * p})`,
              opacity: Math.min(1, p * 1.5),
              background: COR.branco,
              border: `${CONTORNO}px solid ${COR.preto}`,
              borderRadius: RAIO.placa,
              boxShadow: SOMBRA,
              overflow: 'hidden',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                background: COR.preto,
                color: COR.amarelo,
                textAlign: 'center',
                padding: '14px 0 10px',
                fontFamily: FONTE.rotulo,
                fontWeight: 900,
                fontSize: 34,
                letterSpacing: 2,
              }}
            >
              {titulos[i]}
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 58, bottom: 0 }}>{conteudo}</div>
          </div>
        );
      })}
    </>
  );
};
