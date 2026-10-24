import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, BracoRobotico, FECHADO, FundoSaida, Som, type CenaEp } from '../components';
import { ESTEIRA_Y, CENTRO_X } from '../theme';
import { entra, lin, mola } from '../anim';
import { palavra } from './tempo';
import { CaixaChat } from './comum';

const B = 7;
const TEXTO = 'Claro, já vou…';
const TOPO_CHAT = 780;

/** Frase final: a caixa de chat digita e, em vez de texto, sai um braço que acena. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tResponder = palavra(B, 'responder') - 6;
  const tPode = palavra(B, 'pode', 1);
  const tBraco = palavra(B, 'braco.');
  const letras = Math.floor(lin(frame, tResponder, tResponder + 26, 0, TEXTO.length));
  const pBraco = frame >= tPode ? mola(frame, tPode, 0, 1) : 0;
  const aceno = frame >= tBraco ? Math.sin((frame - tBraco) / 4) * 22 : 0;
  return (
    <>
      {Array.from({ length: 5 }).map((_, k) => <Som key={k} nome="tique" em={tResponder + k * 6} volume={0.3} />)}
      <Som nome="carimbo" em={tPode + 4} volume={0.35} />
      <Som nome="tique" em={tBraco} />
      {pBraco > 0 ? (
        <BracoRobotico
          x={CENTRO_X + 150}
          base={TOPO_CHAT + 14}
          pose={{ ombro: 70 + aceno * 0.4, cotovelo: 30 + aceno, pulso: aceno * 0.6 }}
          garra={0.2}
          l1={150}
          l2={130}
          coluna={44}
          escala={pBraco}
        />
      ) : null}
      <CaixaChat x={CENTRO_X} top={TOPO_CHAT} texto={TEXTO.slice(0, letras)} cursor={frame % 20 < 12 && pBraco < 0.5} escala={entra(frame, 0, 170)} opacidadeTexto={1 - pBraco * 0.6} />
    </>
  );
};

export const Final: CenaEp = {
  Conteudo,
  Fundo: () => <FundoSaida />,
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'braco.'), CENTRO_X, 800, 1.1)],
};
