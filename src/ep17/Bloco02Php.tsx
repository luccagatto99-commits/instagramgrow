import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Som, type CenaEp } from '../components';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA } from '../theme';
import { entra, lin } from '../anim';
import { palavra } from './tempo';
import { Etiqueta } from '../ep12/comum';
import { MiniSite } from './comum';

const B = 1;
const PHP = [0, 1, 2, 4, 5, 6, 8]; // 7 de 10 sites

/**
 * "Roda por trás": 10 sites entram; o selo PHP acende em 7 deles. "70%": o número em azul.
 * "WordPress": etiqueta embaixo.
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tRoda = palavra(B, 'roda');
  const t70 = palavra(B, '70%');
  const tWp = palavra(B, 'wordpress.');
  return (
    <>
      <Som nome="tique" em={tRoda} volume={0.3} />
      <Som nome="ding" em={t70} volume={0.3} />
      {Array.from({ length: 10 }, (_, i) => {
        const col = i % 5, lin2 = Math.floor(i / 5);
        const k = PHP.indexOf(i);
        const php = k >= 0 && frame >= tRoda + k * 3 ? entra(frame, tRoda + k * 3, 200) : 0;
        return <MiniSite key={i} x={252 + col * 144} top={740 + lin2 * 118} php={php} escala={entra(frame, i * 2, 170)} />;
      })}
      {frame >= t70 - 4 ? (
        <div
          style={{
            position: 'absolute',
            left: 540,
            top: 570,
            transform: `translateX(-50%) scale(${entra(frame, t70 - 4, 180)})`,
            background: COR.branco,
            border: `${CONTORNO}px solid ${COR.preto}`,
            borderRadius: RAIO.caixa,
            boxShadow: SOMBRA,
            padding: '2px 30px 0',
            fontFamily: FONTE.numero,
            fontWeight: 800,
            fontSize: 84,
            color: COR.azul,
            lineHeight: 1.15,
            whiteSpace: 'nowrap',
          }}
        >
          {Math.round(70 * lin(frame, t70 - 4, t70 + 14))}%
          <span style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 30, color: COR.preto, marginLeft: 14, letterSpacing: 2 }}>DOS SITES</span>
        </div>
      ) : null}
      <Etiqueta x={540} top={1000 - 6 + 14} texto="INCLUSIVE QUASE TODO WORDPRESS" escala={frame >= tWp - 6 ? entra(frame, tWp - 6, 180) : 0} />
    </>
  );
};

export const Php: CenaEp = { Conteudo, Fundo: () => null, planos: () => [ABERTO(0)], esteira: false };
