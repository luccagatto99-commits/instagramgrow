import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, FichaDocumento, Som, Visto, type CenaEp } from '../components';
import { COR, CENTRO_X } from '../theme';
import { entra, mola } from '../anim';
import { palavra } from './tempo';
import { Etiqueta } from '../ep12/comum';
import { Radar, RADAR_B } from './comum';

const B = 5;

/**
 * No Brasil: um radar sobe no meio com a placa EM TESTE presa no poste; "8 estados" num selo azul em
 * cima. "Por enquanto, ainda não multa": o radar vai para a esquerda e a ficha de MULTA chega à
 * direita, com ✗.
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tTeste = palavra(B, 'teste');
  const t8 = palavra(B, '8');
  const tEnquanto = palavra(B, 'enquanto');
  const tMulta = palavra(B, 'multa');

  // o poste fica um pouco à direita do centro para a câmera (que aponta para a esquerda) ficar centrada
  const xRadar = frame < tEnquanto - 6 ? CENTRO_X + 60 : mola(frame, tEnquanto - 6, CENTRO_X + 60, 400);
  const pTeste = frame >= tTeste - 4 ? entra(frame, tTeste - 4, 170) : 0;
  const p8 = frame >= t8 - 4 ? entra(frame, t8 - 4, 170) : 0;
  const pFicha = frame >= tEnquanto ? entra(frame, tEnquanto, 150) : 0;
  const xis = frame >= tMulta ? entra(frame, tMulta, 180) : 0;
  return (
    <>
      <Som nome="tique" em={tTeste - 4} volume={0.35} />
      <Som nome="tique" em={t8 - 4} volume={0.35} />
      <Som nome="carimbo" em={tMulta} volume={0.35} />

      <Radar x={xRadar} escala={entra(frame, -6, 150)}>
        <Etiqueta x={xRadar} top={760} texto="EM TESTE" escala={pTeste} />
      </Radar>
      <Etiqueta x={xRadar - 50} top={470} texto="8 ESTADOS" cor={COR.azul} escala={p8} />

      <FichaDocumento x={RADAR_B} base={960} rotulo="AUTUAÇÃO" nome="MULTA" largura={260} escala={pFicha} anulada={0} />
      <Visto x={RADAR_B + 110} y={700} r={40} ok={false} escala={xis} />
    </>
  );
};

export const Brasil: CenaEp = {
  Conteudo,
  Fundo: () => null,
  planos: () => [ABERTO(0)],
};
