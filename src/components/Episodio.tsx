import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { CamadaCtx } from './Camada';
import { Camera } from './Camera';
import { Cena } from './Cena';
import { Legenda, agrupar, type PalavraTempo } from './Legenda';
import { PlacaDeArea } from './PlacaDeArea';
import { Progresso } from './Progresso';
import { Som } from './Som';
import type { CenaEp } from './CenaEp';
import { FPS } from '../theme';
import { TEMA_AMARELO, TemaCtx, type Tema } from './Tema';

/** Placa de setor: fica parada enquanto a fábrica está no mesmo setor. */
export type PlacaTrilha = { nome: string; termo?: string; de: number; ate?: number };

const PLACA_Y = 300; // abaixo da barra de progresso

/** Variáveis CSS lidas pelos componentes (SOMBRA, Esteira, PlacaDeArea, Legenda, Cenários...). */
const varsDoTema = (t: Tema): React.CSSProperties =>
  ({
    background: t.fundo,
    '--sombra': t.corSombra,
    '--tinta': t.tinta,
    '--traco': t.traco,
    '--esteira': t.esteira,
    '--rolete': t.rolete,
    '--placa': t.placa,
    '--placa-texto': t.placaTexto,
    '--fala-texto': t.falaTexto,
    ...(t.falaFundo
      ? { '--fala-fundo': t.falaFundo, '--fala-pad': '0 14px', '--fala-margem': '0 -14px', '--sombra-placa': 'none' }
      : {}),
  }) as React.CSSProperties;

/** Contorno de 5 px na cor `c`, feito com sombras (para texto sobre cenário). */
const contorno = (c: string) =>
  [[-5, 0], [5, 0], [0, -5], [0, 5], [-4, -4], [4, -4], [-4, 4], [4, 4]].map(([x, y]) => `${x}px ${y}px 0 ${c}`).join(', ');

/**
 * Esqueleto de todo episódio: narração, trilha, cenas em duas camadas
 * (mundo com câmera + hud fixo), placas de setor, progresso e legenda.
 */
export const Episodio: React.FC<{
  cenas: CenaEp[];
  palavras: PalavraTempo[];
  inicioBloco: (b: number) => number;
  durBloco: (b: number) => number;
  durTotal: number;
  durNarracao: number; // segundos
  narracao: string; // arquivo em public/
  musica?: string;
  trilha: PlacaTrilha[];
  assinatura?: boolean; // cartão de ponto no frame 0
  tema?: Tema;
  extra?: React.ReactNode; // hud fixo do episódio inteiro (ex.: cronômetro)
  progressoDireita?: number;
  musicaVolume?: number; // padrão 0.13 (lo-fi bem baixa); a trilha eletrônica do ep11 vai em 0.22
  halo?: boolean; // contorno na cor do fundo nos textos do hud (cenário 3D atrás)
}> = ({ cenas, palavras, inicioBloco, durBloco, durTotal, durNarracao, narracao, musica = 'musica.mp3', trilha, assinatura = true, tema = TEMA_AMARELO, extra, progressoDireita, halo, musicaVolume = 0.13 }) => {
  const grupos = agrupar(palavras, FPS);
  const parado = Math.round(durNarracao * FPS); // últimos 1,5 s parados
  return (
    <TemaCtx.Provider value={tema}>
    <AbsoluteFill style={{ ...varsDoTema(tema), ...(halo ? ({ '--halo': contorno(tema.fundo) } as React.CSSProperties) : {}) }}>
      <Audio src={staticFile(narracao)} />
      {/* trilha própria (scripts/musica.py ou musica_tech.py), abaixo da voz */}
      <Audio src={staticFile(musica)} volume={musicaVolume} />
      {assinatura ? <Som nome="cartao_ponto" em={0} /> : null}
      <Som nome="maquina_loop" em={0} volume={0.05} loop duracao={parado} />

      {cenas.map((c, b) => {
        const ultimo = b === cenas.length - 1;
        const transicao = ultimo ? 0 : c.transicao ?? 8;
        const { Conteudo, Fundo } = c;
        return (
          <Sequence key={b} from={inicioBloco(b)} durationInFrames={durBloco(b)} name={`Bloco ${b + 1}`}>
            <CamadaCtx.Provider value="mundo">
              <Camera planos={c.planos()}>
                <Fundo />
                <Cena dur={durBloco(b)} inicioAbs={inicioBloco(b)} transicao={transicao} esteira={!ultimo && c.esteira !== false} paraEm={ultimo ? parado - inicioBloco(b) : undefined} sentido={c.sentido}>
                  <Conteudo />
                </Cena>
              </Camera>
            </CamadaCtx.Provider>
            <CamadaCtx.Provider value="hud">
              <Cena dur={durBloco(b)} inicioAbs={inicioBloco(b)} transicao={transicao} esteira={false}>
                <div style={{ visibility: 'hidden' }}>
                  <Conteudo />
                </div>
              </Cena>
            </CamadaCtx.Provider>
          </Sequence>
        );
      })}

      {trilha.map((p) => (
        <Sequence key={p.nome + p.de} from={p.de} durationInFrames={(p.ate ?? durTotal) + 10 - p.de} layout="none">
          <PlacaDeArea nome={p.nome} termo={p.termo} y={PLACA_Y} saida={p.ate === undefined ? undefined : p.ate - p.de} />
        </Sequence>
      ))}

      <Progresso total={parado} direita={progressoDireita} />
      {extra}
      <Legenda grupos={grupos} />
    </AbsoluteFill>
    </TemaCtx.Provider>
  );
};
