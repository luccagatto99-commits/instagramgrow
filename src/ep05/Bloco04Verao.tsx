import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Balao, Bonequinho, Calendario, FECHADO, FichaArquivo, FichaDocumento, FundoReuniao, Num, Som, rolaAno, type CenaEp } from '../components';
import { CENTRO_X, ESTEIRA_Y } from '../theme';
import { entra, mola, segue } from '../anim';
import { palavra } from './tempo';
import { PROMESSA, Sol } from './comum';

const B = 3;
const LUGARES = [190, 400, 610, 820];

/** 1956: o verão de estudos, o nome nasce, e a promessa dos vinte anos. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tCientistas = palavra(B, 'cientistas');
  const tVerao = palavra(B, 'verão.');
  const tNome = palavra(B, 'nome');
  const tPais = palavra(B, 'pais');
  const tPrometeu = palavra(B, 'prometeu:');
  const tVinte = palavra(B, 'vinte');

  const ano = rolaAno(frame, 2, 1950, 1956, 22);
  const saiGrupo = segue(frame, tNome - 10, 14);
  const pFicha = entra(frame, tNome - 6, 130);
  const saiFicha = segue(frame, tPais - 8, 14);

  return (
    <>
      {LUGARES.map((_, i) => <Som key={i} nome="tique" em={tCientistas - 4 + i * 4} volume={0.5} />)}
      <Som nome="carimbo" em={tNome} volume={0.5} />
      <Som nome="tique" em={tPais - 2} />
      <Som nome="tique" em={tVinte} />

      <Calendario ano={ano} de={0} ate={tCientistas + 6} />

      {/* os cientistas chegam pela esquerda; o sol do verão */}
      {saiGrupo < 1400 && frame >= tCientistas - 6 ? (
        <>
          {LUGARES.map((x, i) => {
            const t = tCientistas - 6 + i * 4;
            const xi = mola(frame, t, -150, x) + saiGrupo;
            return <Bonequinho key={i} x={xi} base={ESTEIRA_Y} escala={0.9} passo={frame < t + 24 ? frame * 0.5 + i : 0} />;
          })}
          {frame >= tVerao - 8 ? <Sol x={850 + saiGrupo} y={610} r={52} giro={frame * 0.6} escala={entra(frame, tVerao - 8, 150)} /> : null}
        </>
      ) : null}

      {/* nasce o nome */}
      {frame >= tNome - 6 && saiFicha < 1400 ? (
        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${saiFicha}px) scale(${pFicha})`, transformOrigin: '540px 700px' }}>
          <FichaArquivo x={CENTRO_X} top={600} ano="1956" titulo={<>“inteligência<br />artificial”</>} detalhes={['NASCE O NOME']} largura={760} tamanhoTitulo={74} />
        </div>
      ) : null}

      {/* a promessa */}
      {frame >= tPais - 4 ? (
        <>
          <Bonequinho x={mola(frame, tPais - 4, -150, 190)} base={ESTEIRA_Y} passo={frame < tPais + 20 ? frame * 0.5 : 0} />
          {frame >= tPrometeu - 2 ? (
            <Balao x={270} base={740} rabo="esq" largura={260} tamanho={40} escala={entra(frame, tPrometeu - 2, 170)}>
              eu prometo!
            </Balao>
          ) : null}
          {frame >= tVinte - 6 ? (
            <FichaDocumento
              x={655}
              base={ESTEIRA_Y}
              escala={entra(frame, tVinte - 6, 150)}
              rotulo={PROMESSA.rotulo}
              nome={PROMESSA.nome}
              numero={<>prazo: <Num>20</Num> anos</>}
              largura={510}
              tamanho={40}
              rot={2}
            />
          ) : null}
        </>
      ) : null}
    </>
  );
};

export const Verao: CenaEp = {
  Conteudo,
  Fundo: () => { const f = useCurrentFrame(); return <FundoReuniao ponteiro={f * 0.05} />; },
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'cientistas') + 10, CENTRO_X, 820, 1.08), ABERTO(palavra(B, 'nome') - 8), FECHADO(palavra(B, 'vinte') + 6, 620, 820, 1.08)],
};
