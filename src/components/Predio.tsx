import React from 'react';
import { COR, CONTORNO, RAIO, SOMBRA } from '../theme';

/**
 * Prédio de camadas: `andares` blocos empilhados a partir da base.
 * Com poucos andares cada um mostra duas salas (troca | processa);
 * com muitos, vira uma torre de faixas finas. Posicionado pelo centro x e pela base.
 */
export const Predio: React.FC<{
  x: number;
  base: number;
  largura: number;
  altura: number; // altura total disponível
  andares: number; // pode ser fracionário durante a animação
  alturaMaxAndar?: number;
}> = ({ x, base, largura, altura, andares, alturaMaxAndar = 160 }) => {
  const n = Math.max(1, andares);
  const inteiros = Math.ceil(n);
  const h = Math.min(alturaMaxAndar, altura / n);
  const salas = h > 60;
  const traco = Math.max(2, Math.min(CONTORNO, h * 0.18));
  return (
    <div
      style={{
        position: 'absolute',
        left: x - largura / 2,
        top: base - h * n,
        width: largura,
        height: h * n,
        background: COR.branco,
        border: `${CONTORNO}px solid ${COR.preto}`,
        borderRadius: RAIO.caixa,
        boxShadow: SOMBRA,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {Array.from({ length: inteiros }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: i * h,
            height: h,
            borderTop: i === inteiros - 1 ? undefined : `${traco}px solid ${COR.preto}`,
            boxSizing: 'border-box',
          }}
        >
          {salas ? <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: traco, background: COR.preto }} /> : null}
        </div>
      ))}
    </div>
  );
};
