import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, BotaoJogar, Carimbo, FECHADO, FundoEscritorio, JanelaNavegador, Relogio, Som, type CenaEp } from '../components';
import { COR, CONTORNO, CENTRO_X } from '../theme';
import { entra, lin, tranco } from '../anim';
import { palavra } from './tempo';
import { Instalador } from './comum';

const B = 0;
export const JANELA_TOP = 612;

/** A janela do gancho: aba GTA 5, barra de carregamento e ▶ JOGAR. Reaparece no fim. */
export const JanelaGta: React.FC<{ carrega: number; jogar: number; apagada?: number; escala?: number; dx?: number; children?: React.ReactNode }> = ({
  carrega, jogar, apagada = 0, escala = 1, dx = 0, children,
}) => (
  <JanelaNavegador x={CENTRO_X} top={JANELA_TOP} aba="GTA 5" largura={720} altura={280} apagada={apagada} escala={escala} dx={dx}>
    {jogar < 0.05 && apagada < 0.5 ? (
      <div style={{ position: 'absolute', left: 90, right: 90, top: 118, height: 44, border: `${CONTORNO}px solid ${COR.preto}`, borderRadius: 22, overflow: 'hidden' }}>
        <div style={{ width: `${carrega * 100}%`, height: '100%', background: COR.azul }} />
      </div>
    ) : null}
    <BotaoJogar x={350} y={140} escala={jogar * (1 - apagada)} />
    {children}
  </JanelaNavegador>
);

/** Gancho: o GTA 5 abre numa aba, sem instalar nada, e horas depois some. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tNavegador = palavra(B, 'navegador.');
  const tSem = palavra(B, 'sem');
  const tNada = palavra(B, 'nada.');
  const tHoras = palavra(B, 'horas');
  const tSumiu = palavra(B, 'sumiu.');

  const pInst = entra(frame, tSem - 4, 160) * (1 - lin(frame, tHoras - 8, tHoras - 2));
  const pRel = entra(frame, tHoras - 2, 160) * (1 - lin(frame, tSumiu - 8, tSumiu - 2));
  const treme = Math.sin(frame * 2.2) * 14 * tranco(frame, tSumiu);

  return (
    <>
      <Som nome="tique" em={0} />
      <Som nome="tique" em={tNavegador} />
      <Som nome="tique" em={tSem - 2} />
      <Som nome="tique" em={tHoras - 2} />
      <Som nome="carimbo" em={tSumiu} volume={0.6} />

      <JanelaGta
        carrega={lin(frame, 0, tNavegador - 2)}
        jogar={entra(frame, tNavegador, 170)}
        apagada={lin(frame, tSumiu - 4, tSumiu + 4)}
        escala={0.92 + 0.08 * entra(frame, -8, 120)}
        dx={treme}
      />
      <Carimbo x={CENTRO_X} y={JANELA_TOP + 230} texto="SAIU DO AR" em={tSumiu} tamanho={78} rot={-10} />

      <Instalador x={CENTRO_X} y={470} risco={lin(frame, tNada - 2, tNada + 6)} escala={pInst} />
      {pRel > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, transform: `scale(${pRel})`, transformOrigin: `${CENTRO_X}px 470px` }}>
          <Relogio x={CENTRO_X} y={470} r={80} giro={frame * 14} />
        </div>
      ) : null}
    </>
  );
};

export const Gancho: CenaEp = {
  Conteudo,
  Fundo: () => <FundoEscritorio />,
  planos: () => [
    FECHADO(0, CENTRO_X, 800, 1.08),
    ABERTO(palavra(B, 'sem') - 6),
    FECHADO(palavra(B, 'sumiu.') - 4, CENTRO_X, 800, 1.06),
  ],
};
