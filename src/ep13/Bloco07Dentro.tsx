import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Bonequinho, Carimbo, Som, Visto, type CenaEp } from '../components';
import { COR, CENTRO_X } from '../theme';
import { entra, lin, mola, suave } from '../anim';
import { palavra } from './tempo';
import { CarroFrente, Deteccao, RADAR_A, RADAR_B } from './comum';

const B = 6;

/**
 * Dentro do carro: o carro vem de frente, crescendo (chegando perto do radar). "A IA olha dentro do
 * carro": linha azul varre o para-brisa. Molduras vermelhas no celular e no peito (sem cinto).
 * "Uma pessoa confere": o carro vira a foto à esquerda, a pessoa chega à direita (✓) e o carimbo MULTA.
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tOlha = palavra(B, 'olha');
  const tCelular = palavra(B, 'celular');
  const tCinto = palavra(B, 'sem');
  const tAponta = palavra(B, 'aponta');
  const tPessoa = palavra(B, 'pessoa');
  const tConfere = palavra(B, 'confere');
  const tMulta = palavra(B, 'multa');

  const vai = suave(frame, tPessoa - 8, 16);
  const sChega = 0.35 + 0.95 * suave(frame, 0, 50) + 0.2 * suave(frame, tOlha - 10, 20);
  const s = sChega + (0.8 - sChega) * vai;
  const x = CENTRO_X + (RADAR_A - CENTRO_X) * vai;
  const varre = frame >= tOlha && frame < tOlha + 40 ? lin(frame, tOlha, tOlha + 40) : -1;
  const pulso = frame >= tAponta && frame < tAponta + 24 ? 1 + 0.08 * Math.sin((frame - tAponta) / 2) : 1;
  const fora = 1 - suave(frame, tPessoa - 10, 8);
  const pCel = frame >= tCelular ? entra(frame, tCelular, 170) * fora * pulso : 0;
  const pCinto = frame >= tCinto ? entra(frame, tCinto, 170) * fora * pulso : 0;
  const pPessoa = frame >= tPessoa ? mola(frame, tPessoa, 0, 1) : 0;
  const ok = frame >= tConfere + 8 ? entra(frame, tConfere + 8, 180) : 0;
  return (
    <>
      <Som nome="chiado" em={tOlha} volume={0.18} />
      <Som nome="tique" em={tCelular} volume={0.45} />
      <Som nome="tique" em={tCinto} volume={0.45} />
      <Som nome="ding" em={tConfere + 8} volume={0.35} />

      <CarroFrente x={x} base={1000} escala={s} motorista celular />
      {varre >= 0 ? (
        <div style={{ position: 'absolute', left: x - 200, top: 1000 - 292 * s + 126 * s * varre, width: 400, height: 8, borderRadius: 4, background: COR.azul, border: `3px solid ${COR.preto}` }} />
      ) : null}
      <Deteccao cx={x + 3 * s} cy={1000 - 261 * s} w={34 * s + 24} h={40 * s + 20} texto="CELULAR" p={pCel} lado="esq" />
      <Deteccao cx={x + 32 * s} cy={1000 - 222 * s} w={100 * s} h={42 * s} texto="SEM CINTO" p={pCinto} lado="dir" />

      {pPessoa > 0.01 ? <Bonequinho x={RADAR_B} base={1000} escala={1.4 * pPessoa} virado /> : null}
      <Visto x={RADAR_B} y={600} r={44} escala={ok} />
      {frame >= tMulta ? <Carimbo x={RADAR_A} y={680} texto="MULTA" em={tMulta + 4} tamanho={48} /> : null}
    </>
  );
};

export const Dentro: CenaEp = {
  Conteudo,
  Fundo: () => null,
  planos: () => [ABERTO(0)],
};
