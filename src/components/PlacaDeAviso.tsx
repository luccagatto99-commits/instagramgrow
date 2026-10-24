import React from 'react';
import { useCurrentFrame } from 'remotion';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA, CENTRO_X } from '../theme';
import { entra } from '../anim';

/** Placa branca com sombra dura + faixa vermelha com o CTA (fechamento padrão). */
export const PlacaDeAviso: React.FC<{
  linha1: string;
  faixa: string;
  perfil: string;
  inicio: number;
  inicioFaixa: number;
  inicioPerfil: number;
  top?: number;
}> = ({ linha1, faixa, perfil, inicio, inicioFaixa, inicioPerfil, top = 440 }) => {
  const frame = useCurrentFrame();
  const p = entra(frame, inicio, 150);
  const pf = entra(frame, inicioFaixa, 200);
  const pp = entra(frame, inicioPerfil, 200);
  return (
    <div style={{ position: 'absolute', left: CENTRO_X, top, width: 800, transform: `translateX(-50%) scale(${p})`, transformOrigin: '50% 0%' }}>
      <div
        style={{
          background: COR.branco,
          border: `${CONTORNO}px solid ${COR.preto}`,
          borderRadius: RAIO.placa,
          boxShadow: SOMBRA,
          padding: '44px 40px 40px',
        }}
      >
        <div style={{ fontFamily: FONTE.titulo, fontSize: 64, lineHeight: 1.12, color: COR.preto, textAlign: 'center' }}>{linha1}</div>
        <div
          style={{
            marginTop: 34,
            background: COR.vermelho,
            border: `${CONTORNO}px solid ${COR.preto}`,
            borderRadius: RAIO.caixa,
            padding: '22px 20px',
            fontFamily: FONTE.titulo,
            fontSize: 52,
            lineHeight: 1.1,
            color: COR.preto,
            textAlign: 'center',
            transform: `scale(${pf})`,
            display: frame < inicioFaixa ? 'none' : undefined,
          }}
        >
          {faixa}
        </div>
      </div>
      <div
        style={{
          marginTop: 50,
          textAlign: 'center',
          fontFamily: FONTE.rotulo,
          fontWeight: 900,
          fontSize: 56,
          letterSpacing: 2,
          color: `var(--tinta, ${COR.preto})`,
          transform: `scale(${pp})`,
        }}
      >
        {perfil}
      </div>
    </div>
  );
};
