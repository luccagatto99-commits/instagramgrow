import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, CarroEsportivo, Carimbo, FichaDocumento, FundoGalpao, Som, type CenaEp } from '../components';
import { ESTEIRA_Y, CENTRO_X } from '../theme';
import { entra, lin, mola, segue } from '../anim';
import { palavra } from './tempo';
import { CHAO_Y, ESC_MANOBRA, POUSO_X, RampaSalto, SoproChao, manobra } from './comum';
import { Carrinhos, ESC_GRANDE, GRANDE_Y, temposGancho } from './Bloco01Gancho';

const B = 8;

/** Volta ao gancho: a frase do Musk e o mortal em câmera lenta, sem humano nenhum no banco. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tChamou = palavra(B, 'chamou');
  const tHumanos = palavra(B, 'humanos.');
  const tMas = palavra(B, 'mas');
  const tNenhum = palavra(B, 'nenhum.');

  const sai = segue(frame, tMas - 8, 14);
  const t = temposGancho();
  // câmera lenta: do começo do mortal até o pouso, ~0,65× da velocidade original
  const fim = tNenhum - 10;
  const fOrig = lin(frame, tMas + 6, fim, t.mortal - 6, t.pouso + 4);
  const e = manobra(fOrig, t);
  const z = frame >= fim + 2;
  const esc = z ? mola(frame, fim + 2, ESC_MANOBRA, ESC_GRANDE) : ESC_MANOBRA;
  const cx = z ? mola(frame, fim + 2, POUSO_X, CENTRO_X) : e.x;
  const cy = z ? mola(frame, fim + 2, CHAO_Y, GRANDE_Y) : e.y;

  return (
    <>
      <Som nome="tique" em={tChamou - 4} />
      <Som nome="tique" em={tHumanos - 2} />
      <Som nome="tique" em={tMas - 2} />
      <Som nome="guilhotina" em={fim - 6} volume={0.35} />
      <Som nome="carimbo" em={tNenhum} volume={0.6} />

      {sai < 1200 ? (
        <FichaDocumento
          x={CENTRO_X + sai}
          base={930}
          rotulo="ELON MUSK"
          nome="“um dos últimos carros dirigidos por humanos”"
          largura={660}
          tamanho={50}
          escala={entra(frame, tChamou - 6, 150)}
          revela={lin(frame, tChamou, tHumanos + 6)}
        />
      ) : null}

      {frame >= tMas + 6 ? (
        <>
          {!z ? <RampaSalto /> : null}
          {!z ? <Carrinhos /> : null}
          {!z ? <SoproChao x={e.x} p={e.sopro} frame={frame} /> : null}
          <CarroEsportivo x={cx} y={cy} escala={esc} rot={z ? 0 : e.rot} giro={z ? 1 : e.giro} jatos={z ? [] : e.jatos} frame={frame} />
          <Carimbo x={CENTRO_X} y={GRANDE_Y - 170} texto="NENHUM HUMANO" em={tNenhum} tamanho={64} rot={-8} />
        </>
      ) : null}
    </>
  );
};

export const Volta: CenaEp = {
  Conteudo,
  Fundo: () => <FundoGalpao />,
  planos: () => [ABERTO(0), ABERTO(palavra(B, "mas") + 6)],
};
