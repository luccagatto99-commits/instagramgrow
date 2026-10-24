import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, ContadorPassos, FECHADO, FundoMapa, Mascote, QuadroRuido, Som, type CenaEp } from '../components';
import { COR, ESTEIRA_Y, CENTRO_X, FONTE } from '../theme';
import { entra, lin, mola } from '../anim';
import { palavra } from './tempo';
import { Interrogacao, MaoSeisDedos, PONTAS_MAO, RotuloHud, ZOOM_MAO } from './comum';

const B = 5;
const BASE = ESTEIRA_Y - 10;
const LARG = 400;
const ALT = (LARG * 3) / 4;

// pontos vizinhos ao longo do dedo do meio e do vizinho (viewBox 400 × 300)
const VIZINHOS: [number, number][] = [
  [200, 92], [200, 120], [200, 148], [231, 104], [228, 132],
];
const LIGACOES: [number, number][] = [[0, 1], [1, 2], [1, 3], [3, 4], [2, 4]];

/**
 * As mãos: uma mão se forma dos pontos com 6 dedos (contador vermelho 1…6). Em "não sabem"
 * o mascote olha sem entender; em "costumam ficar" a câmera fecha nos dedos e setas ligam
 * pontos vizinhos.
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tMaos = palavra(B, 'mãos.');
  const tElas = palavra(B, 'elas');
  const tSo = palavra(B, 'só');
  const tPontos = palavra(B, 'pontos');
  const tCostumam = palavra(B, 'costumam');

  const nivel = 1 - lin(frame, 0, tMaos - 4);
  const conta = frame < tMaos ? 0 : Math.min(6, 1 + Math.floor((frame - tMaos) / 5));
  const lado = (frame >= tElas - 4 ? mola(frame, tElas - 4, 0, 1) : 0) - (frame >= tSo - 4 ? mola(frame, tSo - 4, 0, 1) : 0);
  const pViz = frame >= tPontos ? lin(frame, tPontos, tCostumam + 6) : 0;
  const xQuadro = CENTRO_X - 150 * lado;
  const esc = 1 - 0.12 * lado;

  const marcas = PONTAS_MAO.slice(0, conta).map(([px, py], i) => (
    <g key={i}>
      <circle cx={px} cy={py - 14} r={15} fill={COR.vermelho} stroke={COR.preto} strokeWidth={4} />
      <text x={px} y={py - 7} textAnchor="middle" fontFamily={FONTE.numero} fontWeight={800} fontSize={20} fill={COR.branco}>
        {i + 1}
      </text>
    </g>
  ));
  const viz =
    pViz > 0 ? (
      <g>
        {LIGACOES.map(([a, b], i) => {
          const p = Math.min(1, Math.max(0, pViz * LIGACOES.length - i));
          const [x1, y1] = VIZINHOS[a];
          const [x2, y2] = VIZINHOS[b];
          return p > 0 ? <line key={i} x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke={COR.azul} strokeWidth={5} strokeLinecap="round" /> : null;
        })}
        {VIZINHOS.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={7} fill={COR.azul} stroke={COR.preto} strokeWidth={2} opacity={Math.min(1, pViz * 3)} />
        ))}
      </g>
    ) : null;
  return (
    <>
      <Som nome="chiado" em={0} volume={0.3} />
      {Array.from({ length: 6 }).map((_, i) => <Som key={i} nome="tique" em={tMaos + i * 5} />)}
      <Som nome="guilhotina" em={tMaos + 27} volume={0.3} />
      {Array.from({ length: 5 }).map((_, i) => <Som key={`v${i}`} nome="tique" em={tPontos + i * 6} volume={0.3} />)}

      {conta > 0 && frame < tPontos - 4 ? <ContadorPassos rotulo="DEDOS" valor={conta} cor={COR.vermelho} escala={entra(frame, tMaos, 200)} /> : null}
      {frame >= tPontos - 4 ? <RotuloHud texto="COSTUMA FICAR PERTO" escala={entra(frame, tPontos - 4, 200)} /> : null}

      <QuadroRuido x={xQuadro} base={BASE} largura={LARG} nivel={nivel} semente={9} escala={esc} sobre={<g transform={ZOOM_MAO}>{pViz > 0 ? null : marcas}{viz}</g>}>
        <MaoSeisDedos />
      </QuadroRuido>

      {lado > 0.02 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: Math.min(1, lado * 1.5) }}>
          <Mascote x={770 + (1 - lado) * 60} base={BASE} largura={200} olhar={-1} />
          <Interrogacao x={810} top={BASE - 200 - 210} escala={0.55 * lado} rot={Math.sin(frame / 8) * 6} />
        </div>
      ) : null}
    </>
  );
};

export const Maos: CenaEp = {
  Conteudo,
  Fundo: () => <FundoMapa />,
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'mãos.'), CENTRO_X, 800, 1.1), ABERTO(palavra(B, 'elas') - 4), FECHADO(palavra(B, 'pontos'), CENTRO_X, 800, 1.2)],
};
