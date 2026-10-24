import React from 'react';
import { interpolate, Easing, useCurrentFrame } from 'remotion';
import {
  ABERTO, CaixaToken, FECHADO, FitaDeNumeros, FundoPrateleiras, MapaSemantico, Maquina, Som, VALORES_FITA, type CenaEp,
} from '../components';
import { COR, FONTE, CONTORNO, CENTRO_X, ESTEIRA_Y } from '../theme';
import { entra, lin, mola, naEsteira, segue, tranco } from '../anim';
import { palavra } from './tempo';
import { CACHORRO, DIM_GPT3, SP } from './dados';

const B = 3;
const MAQ_TOP = 540;
const MAQ_H = 170;
const MAPA = { top: 470, w: 760, h: 330 };

/** Gaveteiro: a tabela de embeddings. A gaveta desliza para baixo quando abre. */
const Gaveteiro: React.FC<{ dy: number; abre: number; golpe: number }> = ({ dy, abre, golpe }) => (
  <div style={{ position: 'absolute', left: 0, top: 0, transform: `translateY(${dy}px)` }}>
    <div
      style={{
        position: 'absolute',
        left: CENTRO_X - 140,
        top: MAQ_TOP + MAQ_H - 90 + abre * 100,
        width: 280,
        height: 90,
        background: COR.branco,
        border: `${CONTORNO}px solid ${COR.preto}`,
        borderRadius: 16,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ position: 'absolute', left: 90, right: 90, top: 30, height: 14, background: COR.preto, borderRadius: 7 }} />
    </div>
    <Maquina x={CENTRO_X - 190} y={MAQ_TOP} w={380} h={MAQ_H} nome="GAVETEIRO" termo="tabela de embeddings" dy={golpe * 10}>
      <svg width="150" height="90" viewBox="0 0 150 90" fill="none" stroke={COR.preto} strokeWidth="9" strokeLinejoin="round" strokeLinecap="round">
        <rect x="8" y="8" width="134" height="74" rx="10" />
        <line x1="8" y1="45" x2="142" y2="45" />
        <line x1="60" y1="26" x2="90" y2="26" />
        <line x1="60" y1="64" x2="90" y2="64" />
      </svg>
    </Maquina>
  </div>
);

const Coordenada: React.FC<{ x: number; rotulo: string; valor: string; p: number }> = ({ x, rotulo, valor, p }) =>
  p <= 0 ? null : (
    <div style={{ position: 'absolute', left: x, top: 840, transform: `translateX(-50%) scale(${p})`, textAlign: 'center', whiteSpace: 'nowrap' }}>
      <div style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 32, letterSpacing: 2, color: COR.preto, lineHeight: 1 }}>{rotulo}</div>
      <div style={{ fontFamily: FONTE.numero, fontWeight: 800, fontSize: 64, color: COR.azul, lineHeight: 1.2 }}>{valor}</div>
    </div>
  );

/** A etiqueta puxa uma lista de números: um endereço num mapa. No GPT-3, 12.288. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tBusca = palavra(B, 'busca');
  const tLista = palavra(B, 'lista', 0);
  const tMapa = palavra(B, 'mapa.');
  const tCidade = palavra(B, 'cidade');
  const tLat = palavra(B, 'latitude');
  const tLong = palavra(B, 'longitude.');
  const tPalavra = palavra(B, 'palavra');
  const tMilhares = palavra(B, 'milhares.');
  const tGpt = palavra(B, 'gpt3');
  const t12 = palavra(B, '12288');
  const tEssa = palavra(B, 'essa', 1);

  // fase 1: a etiqueta entra no gaveteiro e sai a fita
  const fase1 = frame < tMapa + 10;
  const sai1 = segue(frame, tMapa - 8, 14);
  const sobe = lin(frame, tBusca - 4, tBusca + 8);
  const abre = entra(frame, tBusca + 8, 150);
  const fita1 = interpolate(frame, [tLista - 4, tLista + 22], [0, 820], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });

  // fase 2: a cidade num mapa
  const fase2 = frame >= tMapa - 6 && frame < tPalavra + 10;
  const dxMapa = naEsteira(frame, tMapa - 6, 0, tPalavra - 8, -1000);

  // fase 3: a fita de uma palavra, longa, e o contador
  const fase3 = frame >= tPalavra - 6;
  const dxFita = naEsteira(frame, tPalavra - 6, 0, undefined, -1300);
  const conta = Math.round(
    interpolate(frame, [tMilhares, t12 + 20], [2, DIM_GPT3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }),
  );
  const pConta = entra(frame, tMilhares - 4, 160);
  const ehEmbedding = frame >= tEssa;

  return (
    <>
      <Som nome="tique" em={0} />
      <Som nome="carimbo" em={tBusca + 8} volume={0.5} />
      <Som nome="tique" em={tLista} />
      <Som nome="tique" em={tMapa - 6} />
      <Som nome="carimbo" em={tCidade} volume={0.4} />
      {[0, 6, 12, 18, 26, 36].map((d) => <Som key={d} nome="tique" em={tMilhares + d} volume={0.5} />)}

      {fase1 ? (
        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${sai1}px)` }}>
          <FitaDeNumeros x={CENTRO_X - 140} y={MAQ_TOP + MAQ_H + 120} largura={fita1} valores={VALORES_FITA} deslocamento={Math.max(0, frame - tLista) * 3} tamanho={40} />
          <Gaveteiro dy={-1100 * (1 - entra(frame, 4, 120))} abre={abre} golpe={tranco(frame, tBusca + 8)} />
          {sobe < 1 ? (
            <CaixaToken
              texto={String(CACHORRO.id)}
              numero
              tamanho={72}
              x={naEsteira(frame, -6, CENTRO_X)}
              base={mola(frame, tBusca - 4, ESTEIRA_Y, MAQ_TOP + MAQ_H + 20)}
              escala={1 - 0.6 * sobe}
              opacidade={1 - lin(frame, tBusca + 2, tBusca + 8)}
              destaque
            />
          ) : null}
        </div>
      ) : null}

      {fase2 ? (
        <>
          <MapaSemantico
            x={CENTRO_X}
            top={MAPA.top}
            w={MAPA.w}
            h={MAPA.h}
            dx={dxMapa}
            pontos={[{ texto: 'São Paulo', x: 470, y: 205, escala: entra(frame, tCidade, 170), destaque: true }]}
          >
            {/* linhas de latitude e longitude */}
            <svg width={MAPA.w} height={MAPA.h} style={{ position: 'absolute', left: -CONTORNO, top: -CONTORNO }}>
              {[110, 220].map((y) => <line key={y} x1={20} y1={y} x2={MAPA.w - 20} y2={y} stroke={COR.preto} strokeWidth={4} strokeDasharray="14 14" opacity={0.35} />)}
              {[190, 380, 570].map((x) => <line key={x} x1={x} y1={20} x2={x} y2={MAPA.h - 20} stroke={COR.preto} strokeWidth={4} strokeDasharray="14 14" opacity={0.35} />)}
            </svg>
          </MapaSemantico>
          <div style={{ position: 'absolute', inset: 0, transform: `translateX(${dxMapa}px)` }}>
            <Coordenada x={345} rotulo="LATITUDE" valor={SP.lat} p={entra(frame, tLat - 2, 170)} />
            <Coordenada x={735} rotulo="LONGITUDE" valor={SP.long} p={entra(frame, tLong - 2, 170)} />
          </div>
        </>
      ) : null}

      {fase3 ? (
        <>
          <FitaDeNumeros x={-40 + dxFita} y={850} largura={1160} valores={VALORES_FITA} deslocamento={frame * 9} tamanho={40} />
          {frame >= tMilhares - 4 ? (
            <CaixaToken texto={conta.toLocaleString('pt-BR')} numero tamanho={84} x={CENTRO_X} base={790} escala={pConta} destaque />
          ) : null}
          {frame >= tGpt - 2 ? (
            <div
              style={{
                position: 'absolute',
                left: CENTRO_X,
                top: 500,
                transform: `translateX(-50%) scale(${entra(frame, ehEmbedding ? tEssa : tGpt - 2, 170)})`,
                background: ehEmbedding ? COR.preto : 'transparent',
                color: ehEmbedding ? COR.amarelo : COR.preto,
                borderRadius: 20,
                padding: '12px 28px 10px',
                fontFamily: FONTE.rotulo,
                fontWeight: 900,
                fontSize: 38,
                letterSpacing: 2,
                whiteSpace: 'nowrap',
                lineHeight: 1,
              }}
            >
              {ehEmbedding ? 'EMBEDDING' : 'GPT-3 · NÚMEROS POR TOKEN'}
            </div>
          ) : null}
        </>
      ) : null}
    </>
  );
};

export const Lista: CenaEp = {
  Conteudo,
  Fundo: () => <FundoPrateleiras />,
  planos: () => [
    ABERTO(0),
    FECHADO(palavra(B, 'busca') - 4, CENTRO_X, 760, 1.15),
    ABERTO(palavra(B, 'lista', 0) + 6),
    FECHADO(palavra(B, 'cidade') - 2, CENTRO_X, 700, 1.12),
    ABERTO(palavra(B, 'latitude') - 4),
    FECHADO(palavra(B, 'milhares.') - 2, CENTRO_X, 760, 1.12),
    ABERTO(palavra(B, 'gpt3') - 2),
    FECHADO(palavra(B, '12288'), CENTRO_X, 740, 1.15),
    ABERTO(palavra(B, 'essa', 1) - 2),
  ],
};
