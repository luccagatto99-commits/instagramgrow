import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate } from 'remotion';
import { Cena, Legenda, PlacaDeArea, Som, agrupar } from '../components';
import { COR, FPS } from '../theme';
import { PALAVRAS, DUR_TOTAL, DUR_NARRACAO, inicioBloco, durBloco, palavra } from './tempo';
import { Bloco1 } from './Bloco1';
import { Bloco2 } from './Bloco2';
import { Bloco3 } from './Bloco3';
import { Bloco4 } from './Bloco4';
import { Bloco5 } from './Bloco5';
import { Bloco6 } from './Bloco6';
import { Bloco7 } from './Bloco7';
import { Bloco8 } from './Bloco8';
import { Bloco9 } from './Bloco9';
import { Bloco10 } from './Bloco10';
import { Bloco11 } from './Bloco11';
import './dados'; // valida os tokens contra o roteiro

const BLOCOS = [Bloco1, Bloco2, Bloco3, Bloco4, Bloco5, Bloco6, Bloco7, Bloco8, Bloco9, Bloco10, Bloco11];
const GRUPOS = agrupar(PALAVRAS, FPS);
const PARADO = Math.round(DUR_NARRACAO * FPS); // últimos 1,5 s parados

/** Placas de área: ficam paradas enquanto a fábrica está no mesmo setor. */
const TRILHA: { nome: string; termo?: string; de: number; ate?: number }[] = [
  { nome: 'LINHA DE MONTAGEM', termo: 'rede neural', de: inicioBloco(2) + 4, ate: inicioBloco(3) - 10 },
  { nome: 'TOKENIZADOR', termo: 'tokenização', de: inicioBloco(4) + 4, ate: inicioBloco(6) - 10 },
  { nome: 'CARIMBADORA', termo: 'ID do token', de: inicioBloco(6) + 4, ate: inicioBloco(7) - 10 },
  { nome: 'TOKENIZADOR', termo: 'tokenização', de: inicioBloco(7) + 4, ate: inicioBloco(9) - 10 },
  { nome: 'TURNO ENCERRADO', de: inicioBloco(10) + palavra(10, 'turno') },
];

export const Ep01: React.FC = () => {
  const frame = useCurrentFrame();
  const virada = inicioBloco(7);
  // zoom só na virada
  const zoom = 1 + interpolate(frame, [virada, virada + 5, virada + 24], [0, 0.05, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ background: COR.amarelo }}>
      <Audio src={staticFile('narracao.mp3')} />
      <Som nome="cartao_ponto" em={0} />
      <Som nome="maquina_loop" em={0} volume={0.1} loop duracao={PARADO} />

      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: '540px 900px' }}>
        {BLOCOS.map((C, b) => {
          const ultimo = b === BLOCOS.length - 1;
          return (
            <Sequence key={b} from={inicioBloco(b)} durationInFrames={durBloco(b)} name={`Bloco ${b + 1}`}>
              <Cena dur={durBloco(b)} inicioAbs={inicioBloco(b)} transicao={ultimo ? 0 : 8} esteira={!ultimo} paraEm={ultimo ? PARADO - inicioBloco(b) : undefined}>
                <C />
              </Cena>
            </Sequence>
          );
        })}
        {TRILHA.map((p) => (
          <Sequence key={p.nome + p.de} from={p.de} durationInFrames={(p.ate ?? DUR_TOTAL) + 10 - p.de} layout="none">
            <PlacaDeArea nome={p.nome} termo={p.termo} saida={p.ate === undefined ? undefined : p.ate - p.de} />
          </Sequence>
        ))}
      </AbsoluteFill>

      <Legenda grupos={GRUPOS} />
    </AbsoluteFill>
  );
};

export const EP01_DURACAO = DUR_TOTAL;
