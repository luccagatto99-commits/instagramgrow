import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { ABERTO, CarroEsportivo, Som, Velocimetro, Visto, type CenaEp } from '../components';
import { COR, ESTEIRA_Y } from '../theme';
import { entra, lin } from '../anim';
import { palavra } from './tempo';
import { FeixeIR } from '../ep12/comum';
import { CARRO_ESC, CARRO_Y, PLACA, Radar, Registro, lenteRadar, rodas } from './comum';

const B = 0;

/** Pulso de flash (0 → 1 → 0) em t. */
export const flashEm = (frame: number, t: number) => lin(frame, t, t + 3) * (1 - lin(frame, t + 6, t + 16));

/** Feixe do radar até o carro, enquanto o flash dura. */
export const FeixeRadar: React.FC<{ radar: number; carro: number; f: number; esc?: number; y?: number }> = ({ radar, carro, f, esc = CARRO_ESC, y = CARRO_Y }) => (
  <FeixeIR de={lenteRadar(radar)} alvo={[carro + 70 * esc, y - 10]} altura={70} opacidade={f} />
);

const ESC = 1.2; // carro maior no gancho
const Y = ESTEIRA_Y - 46 * ESC;
const X_CARRO = 350; // a câmera acompanha o carro: ele fica parado na tela e a pista corre
const X_FLASH = 690; // x do poste na tela quando o radar fotografa o carro

/**
 * Gancho: o carro entra correndo com o radar A parado lá na frente, piscando; daí a câmera acompanha o carro
 * e a pista corre (faixas e traços de velocidade). O carro freia em cima do radar A (velocímetro cai, flash) e acelera de novo. "Lê a sua placa":
 * cartão com a placa. "Espera você lá na frente": o radar B entra pela direita, com a luz acesa,
 * e fotografa o carro: ✓ (mesma placa).
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tFrente = palavra(B, 'frente');
  const tAdianta = palavra(B, 'adianta');
  const tPlaca = palavra(B, 'placa');
  const tEspera = palavra(B, 'espera');
  const tFrente2 = palavra(B, 'frente', 1);

  // até tInicio o carro anda na tela, com o radar A parado lá na frente; depois a câmera acompanha
  const tInicio = tFrente - 8;
  // velocidade da pista (px/frame) e o deslocamento acumulado
  const vel = (f: number) =>
    interpolate(f, [tInicio - 1, tInicio, tFrente + 14, tAdianta, tAdianta + 26, tPlaca, tEspera - 6], [0, 16, 10, 10, 28, 28, 14], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  let s = 0;
  for (let f = 0; f < frame; f++) s += vel(f);
  const sEm = (alvo: number) => {
    let a = 0;
    for (let f = 0; f < alvo; f++) a += vel(f);
    return a;
  };
  const tFlashA = tFrente + 16;
  const tFlashB = tFrente2 + 2;
  const xA = sEm(tFlashA) + X_FLASH - s;
  const xB = sEm(tFlashB) + X_FLASH - s;
  const v = frame < tInicio ? 26 : vel(frame);
  const xCarro = interpolate(frame, [0, tInicio], [170, X_CARRO], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const kmh = interpolate(frame, [0, tFrente - 2, tFrente + 16, tAdianta + 4, tAdianta + 26], [130, 130, 60, 60, 130], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fA = flashEm(frame, tFlashA);
  const fB = flashEm(frame, tFlashB);
  const luzA = frame < tFlashA ? 0.5 + 0.5 * Math.sin(frame / 3) : fA;
  const luzB = frame >= tEspera - 10 && frame < tFlashB ? 0.5 + 0.5 * Math.sin(frame / 3) : fB;
  const freia = lin(frame, tFrente - 4, tFrente + 4) * (1 - lin(frame, tAdianta, tAdianta + 8));
  const pCartao = frame >= tPlaca - 4 ? entra(frame, tPlaca - 4, 170) : 0;
  const ok = frame >= tFlashB + 8 ? entra(frame, tFlashB + 8, 180) : 0;
  return (
    <>
      <Som nome="chiado" em={tFrente - 4} volume={0.2} />
      <Som nome="tique" em={tFlashA} volume={0.5} />
      <Som nome="tique" em={tFlashB} volume={0.5} />
      <Som nome="ding" em={tFlashB + 8} volume={0.35} />

      <Pista s={s} />
      {xA > -300 && xA < 1300 ? <Radar x={xA} flash={luzA} /> : null}
      {xB > -300 && xB < 1300 ? <Radar x={xB} flash={luzB} /> : null}

      <VelocidadeTracos x={xCarro - 170 * ESC} y={Y} v={v} />
      <CarroEsportivo x={xCarro} y={Y} escala={ESC} rot={-2.5 * freia} rodas={rodas(s + xCarro)} />
      <FeixeRadar radar={xA} carro={X_CARRO} f={fA} esc={ESC} y={Y} />
      <FeixeRadar radar={xB} carro={X_CARRO} f={fB} esc={ESC} y={Y} />

      <Velocimetro x={300} y={500} r={72} max={140} valor={kmh} escala={entra(frame, -10, 160)} />
      <Registro x={760} top={440} linhas={[PLACA]} escala={pCartao} largura={270} />
      <Visto x={580} y={490} r={34} escala={ok} />
    </>
  );
};

/** Pista que corre: faixa amarela (chão) e traços brancos da faixa central, presos ao deslocamento. */
const Pista: React.FC<{ s: number }> = ({ s }) => {
  const passo = 220;
  const desl = s % passo;
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0 }}>
      <rect x={0} y={ESTEIRA_Y} width={1080} height={16} fill={COR.amarelo} />
      {Array.from({ length: 7 }).map((_, i) => (
        <rect key={i} x={i * passo - desl - 40} y={ESTEIRA_Y + 50} width={110} height={14} rx={7} fill={COR.branco} />
      ))}
    </svg>
  );
};

/** Traços de velocidade atrás do carro (mais longos quanto mais rápido). */
const VelocidadeTracos: React.FC<{ x: number; y: number; v: number }> = ({ x, y, v }) => {
  const L = Math.max(0, (v - 12) * 7);
  if (L < 5) return null;
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0 }} strokeLinecap="round">
      {[-40, -5, 30].map((dy, i) => (
        <line key={i} x1={x - 10 - i * 18} y1={y + dy} x2={x - 10 - i * 18 - L} y2={y + dy} stroke={COR.branco} strokeWidth={8} />
      ))}
    </svg>
  );
};

export const Gancho: CenaEp = {
  Conteudo,
  Fundo: () => null,
  planos: () => [ABERTO(0)],
  esteira: false,
};
