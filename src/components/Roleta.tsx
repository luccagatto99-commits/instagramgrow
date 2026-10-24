import React from 'react';
import { COR, FONTE, CONTORNO } from '../theme';

export type Fatia = { peso: number; rotulo?: string };

/**
 * Roleta de probabilidades: fatias em azul (cada cor tem um papel: azul = probabilidade),
 * a vencedora em verde. `giro` em graus; o ponteiro fica no topo. Posicionada pelo centro.
 */
export const Roleta: React.FC<{
  x: number;
  y: number;
  raio: number;
  fatias: Fatia[];
  giro?: number;
  vencedora?: number; // índice pintado de verde
  escala?: number;
  rotulos?: boolean;
}> = ({ x, y, raio, fatias, giro = 0, vencedora, escala = 1, rotulos = true }) => {
  const total = fatias.reduce((a, f) => a + f.peso, 0);
  let acc = 0;
  const arcos = fatias.map((f, i) => {
    const a0 = (acc / total) * Math.PI * 2;
    acc += f.peso;
    const a1 = (acc / total) * Math.PI * 2;
    return { ...f, a0, a1, i };
  });
  const p = (a: number, r: number) => [Math.sin(a) * r, -Math.cos(a) * r];
  const tam = raio * 2 + 40;
  return (
    <div style={{ position: 'absolute', left: x - tam / 2, top: y - tam / 2, width: tam, height: tam, transform: `scale(${escala})` }}>
      <svg style={{ overflow: 'visible', color: `var(--tinta, ${COR.preto})` }} width={tam} height={tam} viewBox={`${-tam / 2} ${-tam / 2} ${tam} ${tam}`}>
        <g transform={`rotate(${giro})`}>
          {arcos.map((f) => {
            const [x0, y0] = p(f.a0, raio);
            const [x1, y1] = p(f.a1, raio);
            const grande = f.a1 - f.a0 > Math.PI ? 1 : 0;
            const d = arcos.length === 1 ? `M0 ${-raio} A${raio} ${raio} 0 1 1 -0.1 ${-raio} Z` : `M0 0 L${x0} ${y0} A${raio} ${raio} 0 ${grande} 1 ${x1} ${y1} Z`;
            const fill = f.i === vencedora ? COR.verde : f.i % 2 === 0 ? COR.azul : COR.branco;
            return <path key={f.i} d={d} fill={fill} stroke={COR.preto} strokeWidth={CONTORNO * 0.8} strokeLinejoin="round" />;
          })}
          {rotulos
            ? arcos.map((f) => {
                if (!f.rotulo) return null;
                const meio = (f.a0 + f.a1) / 2;
                const [lx, ly] = p(meio, raio * 0.62);
                const escuro = f.i !== vencedora && f.i % 2 === 0;
                return (
                  <text
                    key={`t${f.i}`}
                    x={lx}
                    y={ly}
                    textAnchor="middle"
                    dominantBaseline="central"
                    transform={`rotate(${-giro} ${lx} ${ly})`}
                    fontFamily={FONTE.titulo}
                    fontSize={raio * 0.2}
                    fill={escuro ? COR.branco : COR.preto}
                  >
                    {f.rotulo}
                  </text>
                );
              })
            : null}
        </g>
        <circle r={raio * 0.1} fill="currentColor" />
        {/* ponteiro */}
        <path d={`M0 ${-raio + 18} L-22 ${-raio - 26} L22 ${-raio - 26} Z`} fill="currentColor" />
      </svg>
    </div>
  );
};
