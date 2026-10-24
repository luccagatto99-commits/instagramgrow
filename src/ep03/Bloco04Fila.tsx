import React from 'react';
import { interpolate, Easing, useCurrentFrame } from 'remotion';
import { ABERTO, CaixaToken, Destaque, FECHADO, FundoPrateleiras, Maquina, Relogio, Som, type CenaEp } from '../components';
import { COR, CENTRO_X, ESTEIRA_Y } from '../theme';
import { entra, tranco } from '../anim';
import { palavra } from './tempo';
import { FRASE } from './comum';

const B = 3;
const T = 56;
const ESPACO = 240;
const MAQ_TOP = 660;
const MAQ_H = 150;

/** Antes de 2017: uma palavra por vez, em fila; o começo vai se apagando. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tLia = palavra(B, 'lia');
  const tImagine = palavra(B, 'imagine');
  const tLento = palavra(B, 'lento.');
  const tPerdido = palavra(B, 'perdido.');
  const passo = (tPerdido - tLia) / (FRASE.length + 0.5);

  // avanço em degraus: cada palavra anda rápido até a leitora e espera
  const u = Math.max(0, (frame - tLia) / passo);
  const inteiro = Math.floor(u);
  const k = inteiro + interpolate(u - inteiro, [0, 0.35], [0, 1], { extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
  const entrada = interpolate(frame, [-6, tLia], [-900, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });

  return (
    <>
      {FRASE.map((_, i) => <Som key={i} nome="tique" em={Math.round(tLia + i * passo + passo * 0.35)} volume={0.5} />)}

      {/* fio de leitura da máquina até a caixa */}
      <div style={{ position: 'absolute', left: CENTRO_X - 4, top: MAQ_TOP + MAQ_H, width: 8, height: 70, background: COR.preto, opacity: 0.8 }} />
      {FRASE.map((w, i) => {
        const d = k - i; // > 0: já passou pela leitora
        const x = CENTRO_X + d * ESPACO + entrada;
        if (x < -300 || x > 1400) return null;
        const apaga = d > 0.6 ? Math.max(0.12, 1 - 0.32 * (d - 0.6)) : 1;
        return <CaixaToken key={i} texto={w} tamanho={T} x={x} base={ESTEIRA_Y} opacidade={apaga} destaque={Math.abs(d) < 0.3} />;
      })}
      <Maquina
        x={CENTRO_X - 160}
        y={MAQ_TOP}
        w={320}
        h={MAQ_H}
        nome="LEITORA"
        termo="uma palavra por vez"
        dy={tranco(frame, Math.round(tLia + inteiro * passo + passo * 0.35)) * 12 - 1100 * (1 - entra(frame, 2, 120))}
      >
        <svg width="90" height="60" viewBox="0 0 90 60" fill="none" stroke={COR.preto} strokeWidth="9" strokeLinecap="round">
          <line x1="10" y1="30" x2="80" y2="30" />
          <path d="M55 12 L80 30 L55 48" />
        </svg>
      </Maquina>

      {frame >= tLento - 4 ? <Relogio x={150} y={700} giro={(frame - tLento) * 0.25} opacidade={Math.min(1, entra(frame, tLento - 4, 160))} /> : null}

      <Destaque de={tImagine} ate={tLento - 6} top={456} tamanho={46}>
        só um resumo curto
        <br />
        do que veio antes
      </Destaque>
      <Destaque de={tPerdido - 30} top={470} tamanho={64}>
        o começo se perde
      </Destaque>
    </>
  );
};

export const Fila: CenaEp = {
  Conteudo,
  Fundo: () => <FundoPrateleiras />,
  planos: () => [
    ABERTO(0),
    FECHADO(palavra(B, 'fila.') - 2, CENTRO_X, 880, 1.06),
    ABERTO(palavra(B, 'lento.')),
    FECHADO(palavra(B, 'perdido.') - 30, CENTRO_X, 900, 1.08),
  ],
};
