import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { SFX_DISPONIVEIS } from '../sfx-disponiveis';
import { useCamada } from './Camada';

export type NomeSom = 'cartao_ponto' | 'tique' | 'guilhotina' | 'carimbo' | 'sirene' | 'apito' | 'maquina_loop' | 'toque' | 'chiado' | 'ding';

export const temSom = (nome: NomeSom) => SFX_DISPONIVEIS.includes(`${nome}.mp3`);

/** Toca um som de public/sfx/ no frame indicado; se o arquivo não existir, não toca. */
export const Som: React.FC<{ nome: NomeSom; em: number; volume?: number; duracao?: number; loop?: boolean }> = ({
  nome, em, volume = 0.8, duracao, loop,
}) => {
  const camada = useCamada();
  if (!temSom(nome) || camada === 'hud') return null;
  return (
    <Sequence from={em} durationInFrames={duracao} layout="none">
      <Audio src={staticFile(`sfx/${nome}.mp3`)} volume={volume} loop={loop} />
    </Sequence>
  );
};
