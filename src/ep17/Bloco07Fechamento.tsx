import React from 'react';
import { Img, staticFile, useCurrentFrame } from 'remotion';
import { ABERTO, PlacaDeAviso, Som, useVisivelNoHud, type CenaEp } from '../components';
import { COR, FONTE, CENTRO_X } from '../theme';
import { entra } from '../anim';
import { palavra } from './tempo';

const B = 6;
import { PERFIL } from '../ep07/Bloco10Fechamento';

/** Faixa zebrada da marca (listras a −45°, 34 px), na largura da tela. */
const Zebra: React.FC<{ top: number; altura?: number }> = ({ top, altura = 90 }) => (
  <svg width={1080} height={altura} style={{ position: 'absolute', left: 0, top }}>
    <rect width={1080} height={altura} fill={COR.amarelo} />
    {Array.from({ length: 24 }).map((_, i) => {
      const x = i * 96 - altura;
      return <polygon key={i} points={`${x},${altura} ${x + 48},${altura} ${x + 48 + altura},0 ${x + altura},0`} fill={COR.preto} />;
    })}
  </svg>
);

/** Fechamento: siga a fábrica + placa de aviso + selo da marca acima do @. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const vis = useVisivelNoHud();
  const tFabrica = palavra(B, 'fábrica.');
  const tUma = palavra(B, 'uma');
  const pSelo = entra(frame, tFabrica, 170);
  return (
    <>
      <PlacaDeAviso
        linha1="Uma peça nova todo dia."
        faixa="SIGA A FÁBRICA"
        perfil=""
        inicio={0}
        inicioFaixa={palavra(B, 'siga')}
        inicioPerfil={tUma}
        top={440}
      />
      <div style={{ position: 'absolute', left: CENTRO_X, top: 860, transform: `translateX(-50%) scale(${pSelo})`, textAlign: 'center', ...vis }}>
        {/* tema preto: o selo ganha moldura amarela (selo FÁBRICA sobre fundo amarelo) */}
        <div style={{ background: COR.amarelo, borderRadius: 34, padding: 12, display: 'inline-block' }}>
          <Img src={staticFile('marca/selo-transparente.png')} style={{ width: 300, display: 'block' }} />
        </div>
        <div style={{ marginTop: 10, fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 52, letterSpacing: 2, color: COR.branco }}>{PERFIL}</div>
      </div>
    </>
  );
};

export const Fechamento: CenaEp = {
  Conteudo,
  Fundo: () => (
    <>
      <Zebra top={0} />
      <Zebra top={1830} />
    </>
  ),
  planos: () => [ABERTO(0)],
};
