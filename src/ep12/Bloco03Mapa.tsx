import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Rosto3D, Som, useCamada, type CenaEp } from '../components';
import { COR, CENTRO_X } from '../theme';
import { entra, lin, mola, segue, suave } from '../anim';
import { palavra } from './tempo';
import { Busto, CelularRosto, Etiqueta, FeixeIR, ROSTO, TelaCadeado, lentes } from './comum';

const B = 2;
const R_CENTRO = 128;

/**
 * Mapa 3D: a câmera infravermelha fotografa (a lente pisca). O celular sai e o rosto vai para o meio.
 * Os pontos do nariz ficam grandes (PERTO) e os da bochecha pequenos (LONGE). Em "mapa em 3D" a
 * cabeça vira malha e dá uma volta inteira.
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const camada = useCamada();
  const tFoto = palavra(B, 'fotografa');
  const tPontos = palavra(B, 'pontos', 0, true);
  const tPerto = palavra(B, 'perto');
  const tLonge = palavra(B, 'longe');
  const tMapa = palavra(B, 'mapa');

  const vai = frame >= tPontos ? suave(frame, tPontos, 16) : 0;
  const x = ROSTO.x + (CENTRO_X - ROSTO.x) * vai;
  const R = ROSTO.R + (R_CENTRO - ROSTO.R) * vai;
  const y = ROSTO.y - 10 * vai;
  const malha = suave(frame, tMapa - 2, 12);
  const realce = lin(frame, tPerto - 10, tPerto + 4) * (1 - malha);
  const giro = frame >= tMapa ? lin(frame, tMapa, tMapa + 70, 0, 360) : 0;
  const pPerto = frame >= tPerto - 2 ? entra(frame, tPerto - 2, 170) * (1 - suave(frame, tMapa - 8, 6)) : 0;
  const pLonge = frame >= tLonge - 2 ? entra(frame, tLonge - 2, 170) * (1 - suave(frame, tMapa - 8, 6)) : 0;
  const l = lentes();
  // fios das etiquetas até o nariz e a bochecha
  const fio = (de: [number, number], ate: [number, number], p: number) =>
    p > 0.05 ? <line x1={de[0]} y1={de[1]} x2={de[0] + (ate[0] - de[0]) * Math.min(1, p)} y2={de[1] + (ate[1] - de[1]) * Math.min(1, p)} stroke={COR.branco} strokeWidth={6} strokeLinecap="round" /> : null;
  return (
    <>
      <Som nome="tique" em={tFoto + 2} volume={0.5} />
      <Som nome="tique" em={tPerto - 2} volume={0.3} />
      <Som nome="tique" em={tLonge - 2} volume={0.3} />
      <Som nome="chiado" em={tMapa} volume={0.2} />

      <Busto x={x} yRosto={y} R={R} opacidade={1 - malha} />
      {camada !== 'hud' ? (
        <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0 }}>
          {fio([290, 640], [x - 4, y + R * 0.05], pPerto)}
          {fio([790, 640], [x + R * 0.55, y + R * 0.35], pLonge)}
        </svg>
      ) : null}
      <Rosto3D id="m-rosto" x={x} y={y} R={R} giro={giro} contorno={1 - malha} pele={malha} malha={malha} pontos={1 - 0.6 * malha} realce={realce} />
      <Etiqueta x={290} top={590} texto="PERTO" escala={pPerto} />
      <Etiqueta x={790} top={590} texto="LONGE" escala={pLonge} />

      {vai < 1 ? (
        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${segue(frame, tPontos, 16)}px)` }}>
          <CelularRosto clique={tFoto}>
            <TelaCadeado />
          </CelularRosto>
          <FeixeIR de={l.projetor} alvo={[ROSTO.x + ROSTO.R * 0.6, ROSTO.y]} altura={ROSTO.R * 2} opacidade={1 - lin(frame, tPontos - 6, tPontos)} />
        </div>
      ) : null}
    </>
  );
};

export const Mapa: CenaEp = {
  Conteudo,
  Fundo: () => null,
  planos: () => [ABERTO(0)],
};
