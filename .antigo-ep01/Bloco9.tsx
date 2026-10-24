import React from 'react';
import { useCurrentFrame } from 'remotion';
import { CaixaToken, Destaque, Num, Som, fileira } from '../components';
import { CENTRO_X, ESTEIRA_Y } from '../theme';
import { entra, mola } from '../anim';
import { palavra } from './tempo';
import { SOLETRADO } from './dados';

const B = 8;
const T = 72;
const ESCRITO = 'm-o-r-a-n-g-o';

/** Como ela acerta: escrevendo letra por letra, cada letra vira um token. */
export const Bloco9: React.FC = () => {
  const frame = useCurrentFrame();
  const tPrimeiro = palavra(B, 'escreveu');
  const tLetra = palavra(B, 'letra', 1); // "letra por letra."
  const tToken = palavra(B, 'token,');
  const tConsegue = palavra(B, 'dá') - 4; // "e dá pra contar"

  const nChars = Math.max(0, Math.min(ESCRITO.length, Math.floor((frame - tPrimeiro) / 2)));
  const separa = frame >= tLetra;
  const x1 = fileira(SOLETRADO.slice(0, 4).map((k) => k.t), CENTRO_X, T, 26);
  const x2 = fileira(SOLETRADO.slice(4).map((k) => k.t), CENTRO_X, T, 26);
  const linha1 = ESTEIRA_Y - 205;
  const iR = SOLETRADO.findIndex((k) => k.t.includes('r'));
  const acende = frame >= tConsegue;

  return (
    <>

      {frame >= tPrimeiro && !separa ? (
        <CaixaToken texto={ESCRITO.slice(0, nChars) + (frame % 16 < 8 ? '|' : ' ')} tamanho={84} x={CENTRO_X} base={ESTEIRA_Y} destaque />
      ) : null}

      {separa
        ? SOLETRADO.map((k, i) => {
            const t = tLetra + i * 3;
            const linha = i < 4 ? linha1 : ESTEIRA_Y;
            const x = i < 4 ? x1[i] : x2[i - 4];
            const ehR = i === iR;
            return (
              <React.Fragment key={i}>
                <Som nome="tique" em={t} volume={0.6} />
                <CaixaToken
                  texto={k.t}
                  id={frame >= tToken + i * 2 ? k.id : undefined}
                  idEscala={entra(frame, tToken + i * 2, 220)}
                  tamanho={T}
                  x={mola(frame, t, CENTRO_X, x)}
                  base={mola(frame, t, ESTEIRA_Y, linha)}
                  escala={0.7 + 0.3 * entra(frame, t, 180)}
                  verde={ehR && acende}
                  destaque={ehR && acende}
                />
              </React.Fragment>
            );
          })
        : null}

      <Destaque de={tConsegue + 2} top={500} tamanho={84}>
        “r” = <Num>1</Num>
      </Destaque>
    </>
  );
};
