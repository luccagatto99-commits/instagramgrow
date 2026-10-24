import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { CamadaCtx, Camera, Cena, Legenda, PlacaDeArea, Progresso, Som, agrupar } from '../components';
import { COR, FPS } from '../theme';
import { PALAVRAS, DUR_TOTAL, DUR_NARRACAO, inicioBloco, durBloco, palavra } from './tempo';
import { Gancho } from './Bloco01Gancho';
import { Promessa } from './Bloco02Promessa';
import { Conta } from './Bloco03Conta';
import { Letras } from './Bloco04Letras';
import { Tokens } from './Bloco05Tokens';
import { Exemplo } from './Bloco06Exemplo';
import { Numero } from './Bloco07Numero';
import { Virada } from './Bloco08Virada';
import { Dica } from './Bloco09Dica';
import { Resumo } from './Bloco10Resumo';
import { Fechamento } from './Bloco12Fechamento';
import './dados'; // valida os tokens contra o roteiro

const CENAS = [Gancho, Promessa, Conta, Letras, Tokens, Exemplo, Numero, Virada, Dica, Resumo, Fechamento];
const GRUPOS = agrupar(PALAVRAS, FPS);
const PARADO = Math.round(DUR_NARRACAO * FPS); // últimos 1,5 s parados
const PLACA_Y = 300; // abaixo da barra de progresso

/** Placas de setor: ficam paradas enquanto a fábrica está no mesmo setor. */
const TRILHA: { nome: string; termo?: string; de: number; ate?: number }[] = [
  { nome: 'LINHA DE MONTAGEM', termo: 'rede neural', de: inicioBloco(2) + 4, ate: inicioBloco(3) - 10 },
  { nome: 'SETOR 01 · TOKENIZADOR', termo: 'tokenização', de: inicioBloco(4) + palavra(4, 'dividir'), ate: inicioBloco(6) - 10 },
  { nome: 'SETOR 01 · TOKENIZADOR', termo: 'tokenização', de: inicioBloco(8) + 4, ate: inicioBloco(9) - 10 },
  { nome: 'TURNO ENCERRADO', de: inicioBloco(10) + palavra(10, 'turno') },
];

export const Ep01: React.FC = () => (
  <AbsoluteFill style={{ background: COR.amarelo }}>
    <Audio src={staticFile('narracao.mp3')} />
    {/* trilha própria (scripts/musica.py), bem baixa: ~20 dB abaixo da voz */}
    <Audio src={staticFile('musica.mp3')} volume={0.13} />
    <Som nome="cartao_ponto" em={0} />
    <Som nome="maquina_loop" em={0} volume={0.05} loop duracao={PARADO} />

    {CENAS.map((c, b) => {
      const ultimo = b === CENAS.length - 1;
      const { Conteudo, Fundo } = c;
      return (
        <Sequence key={b} from={inicioBloco(b)} durationInFrames={durBloco(b)} name={`Bloco ${b + 1}`}>
          <CamadaCtx.Provider value="mundo">
            <Camera planos={c.planos()}>
              <Fundo />
              <Cena dur={durBloco(b)} inicioAbs={inicioBloco(b)} transicao={ultimo ? 0 : 8} esteira={!ultimo} paraEm={ultimo ? PARADO - inicioBloco(b) : undefined}>
                <Conteudo />
              </Cena>
            </Camera>
          </CamadaCtx.Provider>
          <CamadaCtx.Provider value="hud">
            <Cena dur={durBloco(b)} inicioAbs={inicioBloco(b)} transicao={ultimo ? 0 : 8} esteira={false}>
              <div style={{ visibility: 'hidden' }}>
                <Conteudo />
              </div>
            </Cena>
          </CamadaCtx.Provider>
        </Sequence>
      );
    })}

    {TRILHA.map((p) => (
      <Sequence key={p.nome + p.de} from={p.de} durationInFrames={(p.ate ?? DUR_TOTAL) + 10 - p.de} layout="none">
        <PlacaDeArea nome={p.nome} termo={p.termo} y={PLACA_Y} saida={p.ate === undefined ? undefined : p.ate - p.de} />
      </Sequence>
    ))}

    <Progresso total={PARADO} />
    <Legenda grupos={GRUPOS} />
  </AbsoluteFill>
);

export const EP01_DURACAO = DUR_TOTAL;
