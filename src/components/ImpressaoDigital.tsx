import React from 'react';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA } from '../theme';

const N_LINHAS = 9;
const DIGITOS = '4120879031204567713859260418372';

/** Arco em "U" invertido (uma linha da digital), do pé esquerdo ao pé direito. */
const arco = (k: number) => {
  const cx = 150;
  const cy = 176;
  const rx = 18 + k * 15.5;
  const ry = 24 + k * 19;
  const pe = cy + 30 + k * 6;
  return `M${cx - rx} ${pe} L${cx - rx} ${cy} A${rx} ${ry} 0 0 1 ${cx + rx} ${cy} L${cx + rx} ${pe}`;
};

/**
 * Impressão digital desenhada com linhas de números azuis (o padrão da voz).
 * `revela` 0 → 1 escreve as linhas de dentro para fora. Posicionada pelo centro x e pelo topo.
 */
export const ImpressaoDigital: React.FC<{
  x: number;
  top: number;
  revela: number;
  escala?: number;
  rotulo?: string;
}> = ({ x, top, revela, escala = 1, rotulo }) => (
  <div
    style={{
      position: 'absolute',
      left: x - 170,
      top,
      width: 340,
      transform: `scale(${escala})`,
      transformOrigin: '50% 100%',
      background: COR.branco,
      border: `${CONTORNO}px solid ${COR.preto}`,
      borderRadius: RAIO.maquina,
      boxShadow: SOMBRA,
      boxSizing: 'border-box',
      padding: '10px 0 14px',
      textAlign: 'center',
    }}
  >
    <svg width={300} height={330} viewBox="0 0 300 330">
      <defs>
        {Array.from({ length: N_LINHAS }).map((_, k) => (
          <path key={k} id={`digital-${k}`} d={arco(k)} />
        ))}
      </defs>
      {Array.from({ length: N_LINHAS }).map((_, k) => {
        const p = Math.min(1, Math.max(0, revela * (N_LINHAS + 2) - k));
        if (p <= 0) return null;
        const comprimento = 6 + k * 6; // caracteres que cabem na linha
        const texto = Array.from({ length: comprimento }, (_, i) => DIGITOS[(i * 3 + k * 5) % DIGITOS.length]).join('');
        return (
          <text key={k} fontFamily={FONTE.numero} fontWeight={800} fontSize={13} fill={COR.azul} letterSpacing={2.5}>
            <textPath href={`#digital-${k}`}>{texto.slice(0, Math.ceil(texto.length * p))}</textPath>
          </text>
        );
      })}
    </svg>
    {rotulo ? (
      <div style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 30, letterSpacing: 2, color: COR.preto, lineHeight: 1 }}>{rotulo}</div>
    ) : null}
  </div>
);
