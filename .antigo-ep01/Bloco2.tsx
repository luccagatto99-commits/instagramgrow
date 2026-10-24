import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Quadro } from '../components';
import { ESTEIRA_Y, CENTRO_X } from '../theme';
import { naEsteira } from '../anim';
import { MorangoTrancado } from './Bloco1';
import { palavra } from './tempo';

const B = 1;

/** Promessa: o que você vai entender neste turno. */
export const Bloco2: React.FC = () => {
  const frame = useCurrentFrame();
  const tMorango = palavra(B, 'morango');
  return (
    <>
    {frame >= tMorango - 6 ? <MorangoTrancado x={naEsteira(frame, tMorango - 6, CENTRO_X)} base={ESTEIRA_Y} escala={0.7} /> : null}
    <Quadro
      top={410}
      titulo="HOJE NA FÁBRICA"
      inicio={2}
      itens={[
        { texto: 'como a IA lê o texto', em: palavra(B, 'como') },
        { texto: 'o que é um token', em: palavra(B, 'token,') },
        { texto: 'o truque do morango', em: palavra(B, 'morango') },
      ]}
      destaque={{ indice: 2, em: palavra(B, 'fica') }}
    />
    </>
  );
};
