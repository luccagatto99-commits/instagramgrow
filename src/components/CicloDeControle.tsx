import React from 'react';
import { COR, FONTE, CONTORNO, RAIO } from '../theme';

const ANGULOS = [-90, 30, 150]; // topo, baixo-direita, baixo-esquerda (sentido horário)
const rad = (g: number) => (g * Math.PI) / 180;

/**
 * Ciclo de controle (realimentação): 3 estações num círculo, ligadas por setas no sentido
 * horário, e um ponto que corre pelo anel (`giro`, em graus; −90 = estação do topo).
 * `ativa` acende uma estação (placa preta, texto amarelo); `rastro` (graus) desenha o borrão
 * atrás do ponto quando o ciclo acelera. `children` fica no centro (posição absoluta, origem no centro).
 */
export const CicloDeControle: React.FC<{
  x: number;
  y: number;
  raio?: number;
  giro: number;
  ativa?: number;
  rastro?: number;
  rotulos?: string[];
  escala?: number;
  tamanho?: number;
  children?: React.ReactNode;
}> = ({ x, y, raio = 180, giro, ativa = -1, rastro = 0, rotulos = ['MEDE', 'COMPARA', 'CORRIGE'], escala = 1, tamanho = 34, children }) => {
  if (escala < 0.01) return null;
  const L = raio + 140;
  const ponto = (g: number, r = raio) => [Math.cos(rad(g)) * r, Math.sin(rad(g)) * r];
  const arco = (g1: number, g2: number) => {
    const [x1, y1] = ponto(g1);
    const [x2, y2] = ponto(g2);
    return `M${x1} ${y1} A${raio} ${raio} 0 ${g2 - g1 > 180 ? 1 : 0} 1 ${x2} ${y2}`;
  };
  const [px, py] = ponto(giro);
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: 0, height: 0, transform: `scale(${escala})` }}>
      <svg width={L * 2} height={L * 2} viewBox={`${-L} ${-L} ${L * 2} ${L * 2}`} style={{ position: 'absolute', left: -L, top: -L, overflow: 'visible' }} fill="none" strokeLinecap="round" strokeLinejoin="round">
        {ANGULOS.map((g, i) => {
          // seta do fim do arco: da estação i até a próxima, deixando espaço para as placas
          const g1 = g + 28;
          const g2 = g + 120 - 28;
          const [ax, ay] = ponto(g2);
          const t = rad(g2 + 90); // tangente no sentido horário
          const n = rad(g2);
          return (
            <g key={i} stroke={COR.preto} strokeWidth={CONTORNO}>
              <path d={arco(g1, g2)} />
              <path
                d={`M${ax - Math.cos(t) * 22 + Math.cos(n) * 16} ${ay - Math.sin(t) * 22 + Math.sin(n) * 16} L${ax + Math.cos(t) * 6} ${ay + Math.sin(t) * 6} L${ax - Math.cos(t) * 22 - Math.cos(n) * 16} ${ay - Math.sin(t) * 22 - Math.sin(n) * 16}`}
              />
            </g>
          );
        })}
        {rastro > 1 ? <path d={arco(giro - Math.min(rastro, 340), giro)} stroke={COR.azul} strokeWidth={18} opacity={0.6} /> : null}
        <circle cx={px} cy={py} r={16} fill={COR.azul} stroke={COR.preto} strokeWidth={6} />
      </svg>
      {ANGULOS.map((g, i) => {
        const [sx, sy] = ponto(g);
        const on = i === ativa;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: sx,
              top: sy,
              transform: `translate(-50%, -50%) scale(${on ? 1.08 : 1})`,
              background: on ? COR.preto : COR.branco,
              color: on ? COR.amarelo : COR.preto,
              border: `${CONTORNO}px solid ${COR.preto}`,
              borderRadius: RAIO.caixa,
              padding: '10px 22px 6px',
              fontFamily: FONTE.rotulo,
              fontWeight: 900,
              fontSize: tamanho,
              letterSpacing: 2,
              whiteSpace: 'nowrap',
            }}
          >
            {rotulos[i]}
          </div>
        );
      })}
      {children}
    </div>
  );
};
