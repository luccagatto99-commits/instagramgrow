import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { ABERTO, BotaoJogar, CaixaToken, Cofre, FECHADO, FolhaCodigo, FundoSaida, JanelaNavegador, Som, type CenaEp } from '../components';
import { ESTEIRA_Y } from '../theme';
import { entra, lin, naEsteira, segue } from '../anim';
import { palavra } from './tempo';

const B = 7;
const JAN_X = 680;
const JAN_TOP = 700;

/** Do código reconstruído até o navegador; no caso do GTA, o código já tinha vazado. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tLevar = palavra(B, 'levar');
  const tNavegador = palavra(B, 'navegador.');
  const tGta = palavra(B, 'gta');
  const tVazado = palavra(B, 'vazado.');

  // a caixa de código voa para dentro da janela
  const voo = lin(frame, tNavegador - 6, tNavegador + 6);
  const caixaX = interpolate(voo, [0, 1], [naEsteira(frame, tLevar - 14, 250), JAN_X]);
  const caixaBase = ESTEIRA_Y - Math.sin(voo * Math.PI) * 200 - voo * 120;
  const saiJanela = segue(frame, tGta - 12, 14);
  const abre = lin(frame, tVazado - 2, tVazado + 8);
  const escapa = lin(frame, tVazado + 4, tVazado + 22);

  return (
    <>
      <Som nome="tique" em={tLevar - 4} />
      <Som nome="tique" em={tNavegador + 6} />
      <Som nome="tique" em={tGta - 4} />
      <Som nome="carimbo" em={tVazado} volume={0.4} />

      {saiJanela < 1200 ? (
        <>
          <JanelaNavegador x={JAN_X} top={JAN_TOP} aba="GTA 5" largura={420} altura={190} escala={entra(frame, 0, 140)} dx={saiJanela}>
            <BotaoJogar x={200} y={95} escala={entra(frame, tNavegador + 6, 170)} tamanho={44} />
          </JanelaNavegador>
          {voo < 1 && frame >= tLevar - 14 ? <CaixaToken texto="código" x={caixaX + saiJanela} base={caixaBase} tamanho={56} escala={1 - voo * 0.7} destaque /> : null}
        </>
      ) : null}

      <Cofre x={540} base={ESTEIRA_Y} rotulo="EMPRESA" abertura={abre} tamanho={290} escala={entra(frame, tGta - 6, 150)} />
      {escapa > 0 ? (
        <FolhaCodigo
          x={interpolate(escapa, [0, 1], [540, 800])}
          base={interpolate(escapa, [0, 1], [900, 820])}
          largura={220}
          tamanho={26}
          rotulo="CÓDIGO"
          escala={0.4 + 0.6 * escapa}
          linhas={['se vida = 0:', '  fim_de_jogo()']}
        />
      ) : null}
    </>
  );
};

export const Navegador: CenaEp = {
  Conteudo,
  Fundo: () => { const f = useCurrentFrame(); return <FundoSaida ponteiro={f * 0.08} />; },
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'vazado.') - 4, 600, 860, 1.06)],
};
