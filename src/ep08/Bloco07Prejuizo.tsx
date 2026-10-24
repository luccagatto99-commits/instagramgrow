import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, ContadorDinheiro, FundoPrateleiras, Som, type CenaEp } from '../components';
import { COR, FONTE, CENTRO_X } from '../theme';
import { entra, lin, mola } from '../anim';
import { palavra } from './tempo';
import { VALOR } from './Bloco01Gancho';

const B = 6;
const X0 = 170;
const LARG = 700; // 100% = €95 mi
const ALT = 72;
const CEL = 24; // pedacinhos em que a barra vermelha se desfaz

/** Rótulo solto ao lado da barra (texto na cor da tinta do tema). */
const Rotulo: React.FC<{ x: number; y: number; valor: string; texto: string; p: number }> = ({ x, y, valor, texto, p }) => (
  <div style={{ position: 'absolute', left: x, top: y, opacity: Math.min(1, p * 1.5), transform: `translateX(${(1 - p) * -30}px)`, color: `var(--tinta, ${COR.preto})`, whiteSpace: 'nowrap' }}>
    <div style={{ fontFamily: FONTE.titulo, fontSize: 46, lineHeight: 1 }}>{valor}</div>
    <div style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 26, letterSpacing: 2, lineHeight: 1, marginTop: 4 }}>{texto}</div>
  </div>
);

/** Moeda digital genérica (sem marca): círculo branco com "01" em azul. */
const Moeda: React.FC<{ x: number; y: number; escala: number; opacidade?: number }> = ({ x, y, escala, opacidade = 1 }) => (
  <svg width={80} height={80} viewBox="0 0 80 80" style={{ position: 'absolute', left: x - 40, top: y - 40, transform: `scale(${escala})`, opacity: opacidade, overflow: 'visible' }}>
    <circle cx={40} cy={40} r={34} fill={COR.branco} stroke={COR.preto} strokeWidth={8} />
    <circle cx={40} cy={40} r={22} fill="none" stroke={COR.preto} strokeWidth={4} />
    <text x={40} y={41} textAnchor="middle" dominantBaseline="central" fontFamily={FONTE.numero} fontWeight={800} fontSize={22} fill={COR.azul}>01</text>
  </svg>
);

/** O prejuízo: €95 mi → pouco mais da metade recuperada (verde); o resto vira cripto e some. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tRecuperou = palavra(B, 'recuperou');
  const tMetade = palavra(B, 'metade.');
  const tResto = palavra(B, 'resto');
  const tCripto = palavra(B, 'criptomoeda');
  const tSumiu = palavra(B, 'sumiu.');
  const wVerde = (LARG * 53) / 95;
  const wVermelho = (LARG * 36) / 95;
  const pVerde = frame >= tRecuperou ? mola(frame, tRecuperou, 0, 1) : 0;
  const pVermelho = frame >= tResto ? mola(frame, tResto, 0, 1) : 0;
  const yVerde = 805;
  const yVermelho = 905;
  const nCel = Math.floor(wVermelho / CEL);
  const nLin = Math.floor(ALT / CEL);
  return (
    <>
      <Som nome="tique" em={tRecuperou} />
      <Som nome="tique" em={tResto} />
      <Som nome="carimbo" em={tCripto} volume={0.35} />
      <Som nome="guilhotina" em={tSumiu} volume={0.25} />

      <ContadorDinheiro x={CENTRO_X} top={620} valor={VALOR} rotulo="TRANSFERIDO" tamanho={72} escala={entra(frame, 0, 170)} />

      {pVerde > 0 ? (
        <>
          <div style={{ position: 'absolute', left: X0, top: yVerde, width: wVerde * pVerde, height: ALT, background: COR.verde, border: `8px solid ${COR.preto}`, borderRadius: 14, boxSizing: 'border-box' }} />
          <Rotulo x={X0 + wVerde + 24} y={yVerde + 2} valor="€53 mi" texto={frame >= tMetade ? 'RECUPERADOS' : 'RECUPERANDO…'} p={lin(frame, tRecuperou + 6, tRecuperou + 16)} />
        </>
      ) : null}

      {pVermelho > 0 && frame < tSumiu ? (
        <div style={{ position: 'absolute', left: X0, top: yVermelho, width: wVermelho * pVermelho, height: ALT, background: COR.vermelho, border: `8px solid ${COR.preto}`, borderRadius: 14, boxSizing: 'border-box' }} />
      ) : null}
      {frame >= tSumiu
        ? Array.from({ length: nCel * nLin }).map((_, k) => {
            const c = k % nCel;
            const l = Math.floor(k / nCel);
            const atraso = (c / nCel) * 10 + ((k * 7) % 5);
            const p = lin(frame, tSumiu + atraso, tSumiu + atraso + 18);
            return (
              <div
                key={k}
                style={{
                  position: 'absolute',
                  left: X0 + c * CEL + p * (60 + ((k * 13) % 50)),
                  top: yVermelho + l * CEL - p * (80 + ((k * 17) % 70)),
                  width: CEL - 2,
                  height: CEL - 2,
                  background: COR.vermelho,
                  border: `3px solid ${COR.preto}`,
                  boxSizing: 'border-box',
                  opacity: 1 - p,
                  transform: `rotate(${p * 90}deg) scale(${1 - p * 0.5})`,
                }}
              />
            );
          })
        : null}
      {pVermelho > 0 ? (
        <>
          <Moeda x={X0 + wVermelho + 54} y={yVermelho + ALT / 2} escala={frame >= tCripto ? entra(frame, tCripto, 200) : 0} opacidade={1 - lin(frame, tSumiu + 6, tSumiu + 22)} />
          <div style={{ position: 'absolute', inset: 0, opacity: 1 - lin(frame, tSumiu + 10, tSumiu + 26) * 0.6 }}>
            <Rotulo x={X0 + wVermelho + 110} y={yVermelho + 2} valor="€36 mi" texto={frame >= tSumiu ? 'SUMIRAM' : 'VIROU CRIPTO'} p={lin(frame, tResto + 6, tResto + 16)} />
          </div>
        </>
      ) : null}
    </>
  );
};

export const Prejuizo: CenaEp = {
  Conteudo,
  Fundo: () => <FundoPrateleiras />,
  planos: () => [ABERTO(0), ABERTO(palavra(B, 'resto'))],
};
