import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Bonequinho, Carimbo, FECHADO, FundoAlerta, Som, type CenaEp } from '../components';
import { COR, FONTE, CONTORNO, RAIO, CENTRO_X, ESTEIRA_Y } from '../theme';
import { entra, lin } from '../anim';
import { palavra } from './tempo';
import { PlacaConceito } from './comum';

const B = 5;

/** Efeito ELIZA: a caixa ganha olhos por um segundo, e o carimbo lembra que é truque. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tEfeito = palavra(B, 'efeito');
  const tEnxerga = palavra(B, 'enxerga');
  const tTruque = palavra(B, 'truque.');

  const pCaixa = entra(frame, 2, 150);
  const olhos = frame >= tEnxerga && frame < tTruque - 4;
  const piscada = olhos && (frame - tEnxerga) % 24 > 20;

  return (
    <>
      <Som nome="tique" em={2} />
      <Som nome="carimbo" em={tEfeito} volume={0.5} />
      <Som nome="tique" em={tEnxerga} />
      <Som nome="carimbo" em={tTruque} volume={0.6} />

      <PlacaConceito texto="EFEITO ELIZA" top={600} p={entra(frame, tEfeito - 4, 150)} />

      <Bonequinho x={240} base={ESTEIRA_Y} triste={0} />
      <div
        style={{
          position: 'absolute',
          left: 640,
          top: ESTEIRA_Y,
          width: 260,
          height: 220,
          transform: `translate(-50%, -100%) scale(${pCaixa})`,
          transformOrigin: '50% 100%',
          background: COR.branco,
          border: `${CONTORNO}px solid ${COR.preto}`,
          borderRadius: RAIO.caixa,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 18,
        }}
      >
        <div style={{ display: 'flex', gap: 46, height: 30, opacity: olhos ? 1 : 0 }}>
          {[0, 1].map((i) => (
            <div key={i} style={{ width: 26, height: piscada ? 6 : 26, marginTop: piscada ? 10 : 0, borderRadius: 13, background: COR.preto }} />
          ))}
        </div>
        <div style={{ fontFamily: FONTE.titulo, fontSize: 48, color: COR.preto, lineHeight: 1, opacity: 1 - 0.8 * lin(frame, tTruque - 2, tTruque + 4) }}>ELIZA</div>
        <Carimbo x={130} y={110} texto="TRUQUE" em={tTruque} tamanho={46} rot={-12} />
      </div>
    </>
  );
};

export const Efeito: CenaEp = {
  Conteudo,
  Fundo: () => { const f = useCurrentFrame(); return <FundoAlerta deslocamento={f * 4} />; },
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'enxerga') - 4, 520, 840, 1.12), ABERTO(palavra(B, 'truque.') - 4)],
};
