import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, FundoGalpao, No3D, Som, type CenaEp } from '../components';
import { COR } from '../theme';
import { entra, lin, mola } from '../anim';
import { inicioBloco, palavra } from './tempo';
import { ALTURA_ESTEIRA, CenaPraiaViva, Fabrica3D, PE_TELA, QuadroFilme3D, Tela3D, cameraPor } from './comum';
import { BarraPlay } from './Bloco01Gancho';
import { RotuloHud } from '../ep10/comum';

const B = 4;
const W_TELA = 500;
const ESC = W_TELA / 400; // viewBox da cena → mundo
const TOPO_TELA = -ALTURA_ESTEIRA - PE_TELA - (W_TELA * 3) / 4;
const naTela = (px: number, py: number): [number, number, number] => [-W_TELA / 2 + px * ESC, TOPO_TELA + py * ESC, 0];

// arquivo de vídeos ao fundo: quadros pequenos no chão, em duas fileiras
const ARQUIVO = [-1, 1].flatMap((lado) => [0, 1, 2].map((k) => ({ x: lado * (430 + k * 330), z: -380 - k * 260 })));

/** Riscos de vento atravessando o céu da cena (viewBox 400 × 300). */
const Vento: React.FC<{ t: number; forca: number }> = ({ t, forca }) =>
  forca > 0 ? (
    <g stroke={COR.preto} strokeWidth={5} strokeLinecap="round" fill="none" opacity={forca}>
      {[60, 100, 135].map((y, i) => {
        const x = 420 - ((t * 9 + i * 140) % 520);
        return <path key={y} d={`M${x} ${y} q 30 -10 60 0 t 60 0`} />;
      })}
    </g>
  ) : null;

/**
 * O movimento: a tela grande desce do alto com a cena tocando (o cachorro anda, o mar corre). Atrás,
 * um arquivo de vídeos aparece no chão, em profundidade. Em "onda" a câmera vai até a onda que quebra;
 * em "pelo" volta para o cachorro, com vento.
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tVendo = palavra(B, 'vendo');
  const tOnda = palavra(B, 'onda');
  const tPelo = palavra(B, 'pelo');
  const tVento = palavra(B, 'vento.', 0, true);

  const desce = 1 - entra(frame, -4, 210);
  const passo = 30 + Math.sin(frame / 26) * 30;
  const quebra = lin(frame, tOnda - 2, tOnda + 16);
  const vento = lin(frame, tPelo - 4, tPelo + 8);

  const cam = cameraPor(frame, [
    { em: 0, rx: 12, ry: -24, zoom: 60, foco: [0, -260, 0] },
    { em: tVendo - 6, rx: 18, ry: 22, zoom: -60, foco: [0, -220, -200] },
    { em: tOnda - 6, rx: 12, ry: -10, zoom: 330, foco: naTela(330, 175), centra: 1 },
    { em: tPelo - 6, ry: 12, zoom: 300, foco: naTela(150, 175) },
  ], 2, B);
  return (
    <>
      <Som nome="tique" em={10} volume={0.3} />
      {ARQUIVO.map((_, i) => <Som key={i} nome="tique" em={tVendo + i * 4} volume={0.2} />)}
      <Som nome="chiado" em={tOnda} volume={0.3} />
      <Som nome="chiado" em={tPelo} volume={0.2} />

      <Fabrica3D bloco={B} cam={cam} poeira={0}>
        {ARQUIVO.map((a, i) => {
          const p = frame >= tVendo + i * 4 ? entra(frame, tVendo + i * 4, 170) : 0;
          return p > 0.01 ? (
            <No3D key={i} x={a.x} z={a.z} escala={p}>
              <QuadroFilme3D w={220} cols={20}>
                <CenaPraiaViva t={frame + i * 17} passo={(i % 3) * 25} />
              </QuadroFilme3D>
            </No3D>
          ) : null;
        })}
        <No3D y={-ALTURA_ESTEIRA - desce * 500}>
          <Tela3D w={W_TELA} semente={80} sobre={<BarraPlay p={lin(frame, 0, tVento + 20)} />}>
            <CenaPraiaViva t={frame} passo={passo} quebra={quebra} vento={vento} />
            <Vento t={frame} forca={vento} />
          </Tela3D>
        </No3D>
      </Fabrica3D>

      {frame >= tVendo - 2 && frame < tOnda - 6 ? <RotuloHud texto="VIU MILHÕES DE VÍDEOS" escala={entra(frame, tVendo - 2, 200)} /> : null}
    </>
  );
};

export const Movimento: CenaEp = {
  Conteudo,
  Fundo: () => null,
  planos: () => [ABERTO(0)],
  esteira: false,
  transicao: 0,
};
