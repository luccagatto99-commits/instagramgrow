import React from 'react';
import { useCurrentFrame } from 'remotion';
import { COR, CONTORNO, RAIO, SOMBRA } from '../theme';

/** Hash inteiro determinístico → 0..1 (mesma semente, mesmo ruído em todo render). */
export const hash01 = (a: number, b = 0, c = 0) => {
  let h = (a * 374761393 + b * 668265263 + c * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
};

// a imagem por baixo é desenhada num viewBox fixo de 400 × 300
export const QUADRO_VB = { w: 400, h: 300 };

/**
 * Quadro branco com pontos aleatórios em tons de cinza por cima de uma imagem.
 * `nivel` 0 → 1 mistura: 0 = imagem limpa, 1 = só ruído. Cada ponto tem um limiar
 * fixo (semente), então a imagem some e aparece aos poucos, sempre do mesmo jeito.
 * `nivelEm(cx)` permite um nível por coluna (0..1 da esquerda para a direita).
 * `palpite` 0 → 1 contorna em azul alguns pontos (os que a IA acha que foram colocados).
 * `sobre`: traços extras por cima, no mesmo viewBox da imagem.
 * `cols`: colunas da grade (40 padrão; 20 em quadros pequenos, mais leve). Posicionado pelo centro x e pela base.
 */
export const QuadroRuido: React.FC<{
  x: number;
  base: number;
  largura?: number;
  nivel?: number;
  nivelEm?: (cx: number) => number;
  semente?: number;
  palpite?: number;
  escala?: number;
  sombra?: boolean;
  children?: React.ReactNode; // a imagem (viewBox 400 × 300)
  sobre?: React.ReactNode;
  cols?: number;
}> = ({ x, base, largura = 400, nivel = 1, nivelEm, semente = 1, palpite = 0, escala = 1, sombra = true, children, sobre, cols: COLS = 40 }) => {
  const LINHAS = (COLS * 3) / 4;
  const CEL = QUADRO_VB.w / COLS;
  const frame = useCurrentFrame();
  const altura = (largura * QUADRO_VB.h) / QUADRO_VB.w;
  const pisca = Math.floor(frame / 2); // o ruído troca a cada 2 frames
  const pontos: React.ReactNode[] = [];
  const marcas: React.ReactNode[] = [];
  for (let l = 0; l < LINHAS; l++) {
    for (let c = 0; c < COLS; c++) {
      const i = l * COLS + c;
      const n = nivelEm ? nivelEm((c + 0.5) / COLS) : nivel;
      const limiar = hash01(i, semente, 7);
      const op = Math.min(1, Math.max(0, (n * 1.3 - limiar) / 0.3));
      if (op <= 0.01) continue;
      const cinza = Math.round(40 + hash01(i, pisca, semente) * 200);
      pontos.push(<rect key={i} x={c * CEL} y={l * CEL} width={CEL + 0.4} height={CEL + 0.4} fill={`rgb(${cinza},${cinza},${cinza})`} opacity={op} />);
      if (palpite > 0 && op > 0.5 && hash01(i, semente, 11) < palpite * 0.05) {
        marcas.push(<rect key={`m${i}`} x={c * CEL + 1} y={l * CEL + 1} width={CEL - 2} height={CEL - 2} fill="none" stroke={COR.azul} strokeWidth={2.6} />);
      }
    }
  }
  return (
    <div
      style={{
        position: 'absolute',
        left: x - largura / 2,
        top: base - altura,
        width: largura,
        height: altura,
        transform: `scale(${escala})`,
        transformOrigin: '50% 100%',
        background: COR.branco,
        border: `${CONTORNO}px solid ${COR.preto}`,
        borderRadius: RAIO.caixa,
        boxShadow: sombra ? SOMBRA : undefined,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <svg width="100%" height="100%" viewBox={`0 0 ${QUADRO_VB.w} ${QUADRO_VB.h}`} preserveAspectRatio="none" style={{ display: 'block' }}>
        {children}
        <g shapeRendering="crispEdges">{pontos}</g>
        {marcas}
        {sobre}
      </svg>
    </div>
  );
};
