import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Som, Visto, type CenaEp } from '../components';
import { COR, CONTORNO, RAIO, SOMBRA } from '../theme';
import { entra } from '../anim';
import { palavra } from './tempo';
import { Etiqueta } from '../ep12/comum';
import { MaquinaAnuncios, Ouvido } from './comum';

const B = 5;
const ESQ = 325;
const DIR = 755;

/**
 * Resumo lado a lado, simétrico: "não ouviu" → ouvido com ✗ (esq.); "adivinhou" → a máquina de
 * anúncios com ✓ (dir.).
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tOuviu = palavra(B, 'ouviu');
  const tAdivinhou = palavra(B, 'adivinhou');

  const pOuvido = entra(frame, 0, 150);
  const pNao = frame >= tOuviu - 2 ? entra(frame, tOuviu - 2, 180) : 0;
  const pMaq = frame >= tAdivinhou - 6 ? entra(frame, tAdivinhou - 6, 150) : 0;
  const pSim = frame >= tAdivinhou + 4 ? entra(frame, tAdivinhou + 4, 180) : 0;
  return (
    <>
      <Som nome="carimbo" em={tOuviu - 2} volume={0.35} />
      <Som nome="ding" em={tAdivinhou + 4} volume={0.3} />

      {/* esquerda: o microfone/ouvido, descartado */}
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${pOuvido})`, transformOrigin: `${ESQ}px 1000px` }}>
        <div
          style={{
            position: 'absolute',
            left: ESQ - 130,
            top: 720,
            width: 260,
            height: 280,
            background: COR.branco,
            border: `${CONTORNO}px solid ${COR.preto}`,
            borderRadius: RAIO.caixa,
            boxShadow: SOMBRA,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
          }}
        >
          <Ouvido tam={150} />
        </div>
      </div>
      <Visto x={ESQ + 120} y={730} r={40} ok={false} escala={pNao} />
      <Etiqueta x={ESQ} top={610} texto="NÃO OUVIU" escala={pNao} />

      {/* direita: a máquina que adivinha */}
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${pMaq})`, transformOrigin: `${DIR}px 1000px` }}>
        <MaquinaAnuncios x={DIR + 10} base={1000} escala={0.66} acesos={[1, 1, 1, 1]} giro={frame * 6} />
      </div>
      <Visto x={DIR + 140} y={760} r={40} escala={pSim} />
      <Etiqueta x={DIR} top={610} texto="ADIVINHOU" cor={COR.verde} escala={pSim} />
    </>
  );
};

export const Resumo: CenaEp = {
  Conteudo,
  Fundo: () => null,
  planos: () => [ABERTO(0)],
};
