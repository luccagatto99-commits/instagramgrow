import React from 'react';
import { useCurrentFrame } from 'remotion';
import { CaixaToken, Destaque, FundoGalpao, Num, Som, fileira } from '../components';
import { COR, CENTRO_X, ESTEIRA_Y } from '../theme';
import { entra, mola, segue } from '../anim';
import { palavra } from './tempo';
import { ABERTO, Balao, FECHADO, type CenaEp } from './comum';
import { SOLETRADO } from './dados';

const B = 8;
const T = 72;
const ESCRITO = 'm-o-r-a-n-g-o';

/** Como ela acerta (letra por letra) + a dica prática pra você usar. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tEscreveu = palavra(B, 'separar');
  const tLetra = palavra(B, 'cada');
  const tAntes = palavra(B, 'fácil.');
  const tDica = palavra(B, 'prática:');
  const tPede = palavra(B, 'peça');

  const nChars = Math.max(0, Math.min(ESCRITO.length, Math.floor((frame - (tEscreveu - 6)) / 5)));
  const separa = frame >= tLetra;
  const x1 = fileira(SOLETRADO.slice(0, 4).map((k) => k.t), CENTRO_X, T, 26);
  const x2 = fileira(SOLETRADO.slice(4).map((k) => k.t), CENTRO_X, T, 26);
  const linha1 = ESTEIRA_Y - 205;
  const iR = SOLETRADO.findIndex((k) => k.t.includes('r'));
  const acende = frame >= tAntes;
  const sai = segue(frame, tDica - 6, 14);

  return (
    <>
      {frame >= tEscreveu - 6 && !separa ? (
        <CaixaToken texto={ESCRITO.slice(0, nChars) + (frame % 16 < 8 ? '|' : ' ')} tamanho={84} x={CENTRO_X} base={ESTEIRA_Y} destaque />
      ) : null}

      {separa && sai < 1400
        ? SOLETRADO.map((k, i) => {
            const t = tLetra + i * 3;
            const ehR = i === iR;
            return (
              <React.Fragment key={i}>
                <Som nome="tique" em={t} volume={0.6} />
                <CaixaToken
                  texto={k.t}
                  id={frame >= tLetra + 10 + i * 2 ? k.id : undefined}
                  idEscala={entra(frame, tLetra + 10 + i * 2, 220)}
                  tamanho={T}
                  x={mola(frame, t, CENTRO_X, i < 4 ? x1[i] : x2[i - 4]) + sai}
                  base={mola(frame, t, ESTEIRA_Y, i < 4 ? linha1 : ESTEIRA_Y)}
                  escala={0.7 + 0.3 * entra(frame, t, 180)}
                  verde={ehR && acende}
                  destaque={ehR && acende}
                />
              </React.Fragment>
            );
          })
        : null}

      <Destaque de={4} ate={tEscreveu - 4} top={520} tamanho={72}>
        letra por letra
      </Destaque>

      <Destaque de={tAntes} ate={tDica - 6} top={500} tamanho={84}>
        “r” = <Num>1</Num>
      </Destaque>

      {/* a dica */}
      <Destaque de={tDica - 2} top={470} tamanho={68}>
        na prática
      </Destaque>
      {frame >= tPede - 4 ? (
        <Balao top={620} largura={820} tamanho={60} escala={entra(frame, tPede - 4, 160)}>
          Soletre “morango” letra por letra e depois conte os <span style={{ color: COR.verde, WebkitTextStroke: `2px ${COR.preto}` }}>R</span>.
        </Balao>
      ) : null}
    </>
  );
};

export const Dica: CenaEp = {
  Conteudo,
  Fundo: () => <FundoGalpao />,
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'cada') - 2, CENTRO_X, 760, 1.05), ABERTO(palavra(B, 'prática:') - 4), FECHADO(palavra(B, 'peça') - 2, CENTRO_X, 720, 1.1)],
};
