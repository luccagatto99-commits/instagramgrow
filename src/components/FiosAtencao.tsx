import React from 'react';
import { COR } from '../theme';

export type Fio = { de: [number, number]; para: [number, number]; peso: number; p?: number };

/**
 * Sala de reunião (atenção): fios pretos entre caixas, mais grossos quanto
 * mais uma palavra presta atenção na outra. Coordenadas absolutas da cena.
 * Curvos (arco para cima) para não passar por cima das caixas da mesma fileira.
 */
export const FiosAtencao: React.FC<{ fios: Fio[]; opacidade?: number }> = ({ fios, opacidade = 1 }) => (
  <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: opacidade }} width={1} height={1}>
    {fios.map((f, i) => {
      const p = f.p ?? 1;
      if (p <= 0) return null;
      const [x1, y1] = f.de;
      const [x2, y2] = f.para;
      const cx = (x1 + x2) / 2;
      const cy = Math.min(y1, y2) - 40 - Math.abs(x2 - x1) * 0.18;
      const d = `M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`;
      const comp = Math.hypot(x2 - x1, y2 - y1) * 1.3 + 60;
      return (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={COR.preto}
          strokeWidth={f.peso}
          strokeLinecap="round"
          strokeDasharray={comp}
          strokeDashoffset={comp * (1 - Math.min(1, p))}
        />
      );
    })}
  </svg>
);
