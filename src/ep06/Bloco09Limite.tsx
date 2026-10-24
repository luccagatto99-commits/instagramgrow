import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Carimbo, FECHADO, FundoGalpao, Som, useVisivelNoHud, type CenaEp } from '../components';
import { COR, FONTE, CONTORNO, SOMBRA, CENTRO_X, ESTEIRA_Y } from '../theme';
import { entra, lin, naEsteira, segue } from '../anim';
import { palavra } from './tempo';
import { PlayerVazio } from './comum';
import { JANELA_TOP, JanelaGta } from './Bloco01Gancho';

const B = 8;

/** Frase em faixa colorida (hud), uma por linha. */
const Faixa: React.FC<{ texto: string; cor: string; top: number; de: number; ate: number }> = ({ texto, cor, top, de, ate }) => {
  const frame = useCurrentFrame();
  const vis = useVisivelNoHud();
  if (frame < de - 2 || frame > ate + 8) return null;
  const p = entra(frame, de, 160) * (1 - lin(frame, ate, ate + 8));
  return (
    <div style={{ position: 'absolute', left: CENTRO_X, top, transform: `translateX(-50%) scale(${p})`, background: cor, border: `${CONTORNO}px solid ${COR.preto}`, borderRadius: 20, boxShadow: SOMBRA, padding: '18px 40px 12px', fontFamily: FONTE.titulo, fontSize: 70, lineHeight: 1, color: COR.preto, whiteSpace: 'nowrap', ...vis }}>
      {texto}
    </div>
  );
};

/** O limite: copia o que o programa faz, não o que ele tem; por isso o site do GTA sumiu. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tCopia = palavra(B, 'copia');
  const tNao = palavra(B, 'não');
  const tClone = palavra(B, 'clone');
  const tSem = palavra(B, 'sem');
  const tProibido = palavra(B, 'proibido:');
  const tPor = palavra(B, 'por');
  const tSumiu = palavra(B, 'sumiu.');

  const saiPlayer = segue(frame, tPor - 12, 14);

  return (
    <>
      <Som nome="tique" em={tCopia - 2} />
      <Som nome="tique" em={tNao - 2} />
      <Som nome="tique" em={tClone - 2} />
      <Som nome="carimbo" em={tProibido} volume={0.5} />
      <Som nome="tique" em={tPor} />
      <Som nome="carimbo" em={tSumiu} volume={0.6} />

      <Faixa texto="copia o que faz" cor={COR.verde} top={560} de={tCopia - 2} ate={tClone - 10} />
      <Faixa texto="não o que tem" cor={COR.vermelho} top={720} de={tNao - 2} ate={tClone - 10} />

      {frame >= tClone - 6 && saiPlayer < 1200 ? (
        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${saiPlayer}px)` }}>
          <PlayerVazio x={CENTRO_X} base={ESTEIRA_Y} nome="Spotify" escala={entra(frame, tClone - 6, 150)} vazio={lin(frame, tSem, tSem + 10)} />
          <Carimbo x={CENTRO_X} y={810} texto="SEM PERMISSÃO" em={tProibido} tamanho={50} rot={-8} />
        </div>
      ) : null}

      {frame >= tPor - 4 ? (
        <>
          <div style={{ position: 'absolute', inset: 0, transform: `translateX(${naEsteira(frame, tPor - 4, 0)}px)` }}>
            <JanelaGta carrega={1} jogar={1} apagada={lin(frame, tSumiu - 4, tSumiu + 4)} />
          </div>
          <Carimbo x={CENTRO_X} y={JANELA_TOP + 230} texto="SAIU DO AR" em={tSumiu} tamanho={78} rot={-10} />
        </>
      ) : null}
    </>
  );
};

export const Limite: CenaEp = {
  Conteudo,
  Fundo: () => <FundoGalpao />,
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'clone') + 4, 540, 840, 1.06), ABERTO(palavra(B, 'por') - 4), FECHADO(palavra(B, 'sumiu.') - 4, 540, 800, 1.06)],
};
