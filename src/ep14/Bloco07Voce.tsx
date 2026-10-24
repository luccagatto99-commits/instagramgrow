import React from 'react';
import { interpolate, Easing, useCurrentFrame } from 'remotion';
import { ABERTO, Celular, Som, Visto, type CenaEp } from '../components';
import { COR } from '../theme';
import { entra, lin, suave } from '../anim';
import { palavra } from './tempo';
import { Cartao, CarroTopo, Mapa, Numero, Pino, PinoMini, Rotulo, Trecho, X_V1, X_V3, Y_AV, Y_R1, aTela, misturaCam, pontoEm, type Cam, type Pt } from './comum';

const B = 6;
const X_EU = 290;
const FILA = [345, 400, 455, 510, 565]; // carros parados na frente
const DESVIO: Pt[] = [[-80, Y_AV], [X_V1, Y_AV], [X_V1, Y_R1], [X_V3, Y_R1], [X_V3, Y_AV], [840, Y_AV]];
const PARA = 195; // distância (no desvio) onde os carros de trás esperam, antes da esquina

/**
 * Você também: a câmera está no seu carro parado no engarrafamento (pino VOCÊ, 0 km/h). "Celular no
 * bolso": o celular aparece. "Avisando": a câmera abre e um balão PARADO vai do seu celular para os
 * carros que vêm atrás; "quem vem atrás": eles ganham ✓ e o caminho verde desvia pela rua de cima.
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tParado = palavra(B, 'parado');
  const tCelular = palavra(B, 'celular');
  const tAvisando = palavra(B, 'avisando');
  const tAtras = palavra(B, 'atras.');

  const perto: Cam = { zoom: 2, foco: [X_EU + 60, Y_AV - 70] };
  const cam = misturaCam(perto, { zoom: 1.15, foco: [380, 250] }, suave(frame, tAvisando - 8, 30));
  const [ex, ey] = aTela(cam, [X_EU, Y_AV]);

  // carros de trás: chegam e esperam antes da esquina; depois do aviso, pegam o desvio
  const parte = tAtras + 10;
  const dA = frame < parte
    ? interpolate(frame, [tAvisando - 50, tAtras], [-60, PARA], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })
    : PARA + 0.5 * 6 * Math.min(frame - parte, 12) ** 2 / 12 + 6 * Math.max(0, frame - parte - 12);
  const atras = [dA, dA - 75];
  const [ax, ay] = aTela(cam, pontoEm(DESVIO, dA).slice(0, 2) as Pt);

  const pZero = frame >= tParado ? entra(frame, tParado, 180) * (1 - suave(frame, tAvisando - 8, 8)) : 0;
  const pCel = frame >= tCelular - 4 ? entra(frame, tCelular - 4, 160) : 0;
  const escCel = 0.5 + (0.36 - 0.5) * suave(frame, tAvisando - 8, 30);
  const voo = suave(frame, tAvisando, 18);
  const pBalao = frame >= tAvisando ? entra(frame, tAvisando, 190) * (1 - suave(frame, tAtras + 6, 8)) : 0;
  const bx = ex + (ax - ex) * voo;
  const by = ey - 230 + (ay - 150 - (ey - 230)) * voo;
  const pOk = frame >= tAtras ? entra(frame, tAtras, 180) : 0;
  const pDesvio = lin(frame, tAtras, tAtras + 34);
  return (
    <>
      <Som nome="tique" em={tParado} volume={0.3} />
      <Som nome="tique" em={tCelular - 4} volume={0.4} />
      <Som nome="chiado" em={tAvisando} volume={0.15} />
      <Som nome="ding" em={tAtras} volume={0.35} />

      <Mapa cam={cam}>
        <Trecho pts={[[X_EU - 30, Y_AV], [600, Y_AV]]} cor={COR.vermelho} />
        <Trecho pts={DESVIO.slice(1)} cor={COR.verde} p={pDesvio} />
        {FILA.map((x) => (
          <CarroTopo key={x} x={x} y={Y_AV} celular={1} corPonto={COR.vermelho} />
        ))}
        <CarroTopo x={X_EU} y={Y_AV} />
        {atras.map((d, i) => {
          if (d < -40) return null;
          const [x, y, ang] = pontoEm(DESVIO, d);
          return <CarroTopo key={i} x={x} y={y} ang={ang} celular={1} corPonto={COR.verde} />;
        })}
      </Mapa>

      <Pino x={ex} y={ey - 18 * cam.zoom} escala={1 - pCel} rotulo="VOCÊ" tam={60} />
      <Cartao x={ex + 250} top={ey - 190} largura={220} escala={pZero}>
        <Rotulo tam={22}>VOCÊ</Rotulo>
        <Numero tam={46}>0 km/h</Numero>
      </Cartao>
      {pCel > 0.01 ? (
        <Celular x={ex} base={ey - 20 * cam.zoom} escala={escCel * Math.min(1.1, pCel)}>
          <PinoMini tam={110} />
        </Celular>
      ) : null}
      <Cartao x={bx} top={by} largura={210} escala={pBalao * (1 - 0.3 * voo)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width={30} height={30}>
            <circle cx={15} cy={15} r={11} fill={COR.vermelho} stroke={COR.preto} strokeWidth={4} />
          </svg>
          <Rotulo tam={28}>PARADO</Rotulo>
        </div>
      </Cartao>
      <Visto x={ax} y={ay - 90} r={34} escala={pOk * (1 - suave(frame, tAtras + 40, 8))} />
    </>
  );
};

export const Voce: CenaEp = {
  Conteudo,
  Fundo: () => null,
  planos: () => [ABERTO(0)],
  esteira: false,
};
