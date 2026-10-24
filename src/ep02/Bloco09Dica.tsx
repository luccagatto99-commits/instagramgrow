import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, CaixaToken, Destaque, FECHADO, FundoEscritorio, MapaSemantico, SetaVetor, Som, comEspaco, type CenaEp } from '../components';
import { COR, CENTRO_X, ESTEIRA_Y } from '../theme';
import { entra, lin, mola, naEsteira } from '../anim';
import { palavra } from './tempo';
import { MAPA_MEDIO } from './Bloco06Treino';
import { MANGA } from './dados';

const B = 8;
const ESQ = CENTRO_X - MAPA_MEDIO.w / 2;
const MEIO: [number, number] = [410, 190];
const FRUTAS: [number, number] = [330, 215];

/** Dica: palavra de dois sentidos fica no meio; o contexto puxa para um lado. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tManga = palavra(B, 'manga', 0);
  const tFicam = palavra(B, 'ficam');
  const tFruta = palavra(B, 'fruta', 0);
  const tRoupa = palavra(B, 'roupa.');
  const tPuxam = palavra(B, 'puxam');
  const tEscreva = palavra(B, 'escreva');
  const tFruta2 = palavra(B, 'fruta', 1);

  const voa = lin(frame, tFicam - 4, tFicam + 8);
  const noMapa = frame >= tFicam + 6;
  const balanca = frame >= tPuxam && frame < tFruta2 ? Math.sin((frame - tPuxam) * 0.35) * 40 * (1 - lin(frame, tEscreva, tFruta2)) : 0;
  const xManga = frame >= tFruta2 ? mola(frame, tFruta2, MEIO[0], FRUTAS[0]) : MEIO[0] + balanca;
  const yManga = frame >= tFruta2 ? mola(frame, tFruta2, MEIO[1], FRUTAS[1]) : MEIO[1];
  const pSetas = lin(frame, tPuxam - 2, tPuxam + 10) * (1 - lin(frame, tFruta2 - 4, tFruta2 + 4));

  return (
    <>
      <Som nome="tique" em={tManga - 6} />
      <Som nome="tique" em={tEscreva - 4} />
      <Som nome="carimbo" em={tFruta2} volume={0.4} />

      <Destaque de={0} ate={tManga - 10} top={560} tamanho={96}>
        dica prática
      </Destaque>

      {frame >= tManga - 10 ? (
        <MapaSemantico
          x={CENTRO_X}
          top={MAPA_MEDIO.top}
          w={MAPA_MEDIO.w}
          h={MAPA_MEDIO.h}
          escala={0.7 + 0.3 * entra(frame, tManga - 10, 150)}
          opacidade={Math.min(1, entra(frame, tManga - 10, 150) * 1.5)}
          pontos={[
            { texto: 'banana', x: 110, y: 90, rotulo: 'baixo', escala: entra(frame, tFruta - 2, 170), destaque: frame >= tFruta && frame < tRoupa },
            { texto: 'uva', x: 110, y: 270, rotulo: 'direita', escala: entra(frame, tFruta + 4, 170), destaque: frame >= tFruta && frame < tRoupa },
            { texto: 'camisa', x: 660, y: 100, rotulo: 'baixo', escala: entra(frame, tRoupa - 2, 170), destaque: frame >= tRoupa && frame < tPuxam },
            { texto: 'calça', x: 720, y: 270, rotulo: 'esquerda', escala: entra(frame, tRoupa + 4, 170), destaque: frame >= tRoupa && frame < tPuxam },
            { texto: 'manga', x: xManga, y: yManga, escala: noMapa ? entra(frame, tFicam + 6, 200) : 0, destaque: true, verde: frame >= tFruta2 },
          ]}
        >
          <SetaVetor de={MEIO} para={[250, 190]} p={pSetas} espessura={10} recuo={30} />
          <SetaVetor de={MEIO} para={[570, 190]} p={pSetas} espessura={10} recuo={30} />
        </MapaSemantico>
      ) : null}

      {/* a caixa "manga" chega pela esteira e sobe para o meio do mapa */}
      {frame >= tManga - 6 && !noMapa ? (
        <CaixaToken
          texto={comEspaco(MANGA.t)}
          id={MANGA.id}
          tamanho={72}
          x={mola(frame, tFicam - 4, naEsteira(frame, tManga - 6, CENTRO_X), ESQ + MEIO[0])}
          base={mola(frame, tFicam - 4, ESTEIRA_Y, MAPA_MEDIO.top + MEIO[1])}
          escala={1 - 0.5 * voa}
          destaque
        />
      ) : null}

      {frame >= tEscreva - 4 ? (
        <CaixaToken
          texto={
            <>
              manga, a fruta <span style={{ color: COR.verde, WebkitTextStroke: `2px ${COR.preto}`, opacity: frame >= tFruta2 ? 1 : 0 }}>✓</span>
            </>
          }
          tamanho={64}
          x={naEsteira(frame, tEscreva - 4, CENTRO_X)}
          base={ESTEIRA_Y}
          destaque
        />
      ) : null}
    </>
  );
};

export const Dica: CenaEp = {
  Conteudo,
  Fundo: () => <FundoEscritorio />,
  planos: () => [
    ABERTO(0),
    FECHADO(palavra(B, 'manga', 0) - 2, CENTRO_X, 900, 1.15),
    ABERTO(palavra(B, 'ficam')),
    ABERTO(palavra(B, 'puxam') - 2),
    FECHADO(palavra(B, 'escreva'), CENTRO_X, 880, 1.12),
    ABERTO(palavra(B, 'fruta', 1) + 6),
  ],
};
