import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, CarroEsportivo, Carimbo, FundoGalpao, RODA_CARRO, Som, Velocimetro, type CenaEp } from '../components';
import { ESTEIRA_Y, CENTRO_X } from '../theme';
import { entra, lin, mola } from '../anim';
import { palavra } from './tempo';
import { CARRINHOS_X, CHAO_Y, ESC_MANOBRA, POUSO_X, PistaLoop, RampaSalto, SoproChao, manobra, type TemposManobra } from './comum';

const B = 0;
export const ESC_GRANDE = 1.9;
export const GRANDE_Y = ESTEIRA_Y - RODA_CARRO * ESC_GRANDE;

export const temposGancho = (): TemposManobra => ({
  largada: palavra(B, '0'),
  corte: palavra(B, 'salta') + 4,
  mortal: palavra(B, 'mortal') - 9,
  pouso: palavra(B, 'ar.') + 22,
});

/** Os 5 carros parados que o Roadster salta (contorno pequeno). */
export const Carrinhos: React.FC = () => (
  <>
    {CARRINHOS_X.map((x) => (
      <CarroEsportivo key={x} x={x} y={ESTEIRA_Y - RODA_CARRO * 0.22} escala={0.22} />
    ))}
  </>
);

/** Gancho: arranca (0 a 100), faz o loop (de cabeça para baixo no topo), salta 5 carros, mortal lateral, pousa nos jatos. Banco vazio. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const t = temposGancho();
  const tSem = palavra(B, 'sem');
  const tDirigindo = palavra(B, 'dirigindo.');
  const e = manobra(frame, t);

  // depois do pouso, o carro vem para o centro e cresce: dá para ver o banco vazio
  const z = frame >= tSem ? 1 : 0;
  const esc = z ? mola(frame, tSem, ESC_MANOBRA, ESC_GRANDE) : ESC_MANOBRA;
  const cx = z ? mola(frame, tSem, POUSO_X, CENTRO_X) : e.x;
  const cy = z ? mola(frame, tSem, CHAO_Y, GRANDE_Y) : e.y;

  const pVel = entra(frame, 56, 150) * (1 - lin(frame, t.largada + 50, t.largada + 58));
  const vel = lin(frame, t.largada, t.largada + 32, 0, 100);

  return (
    <>
      <Som nome="tique" em={0} />
      <Som nome="tique" em={56} />
      <Som nome="guilhotina" em={t.largada} volume={0.35} />
      <Som nome="tique" em={palavra(B, 'cabeça')} />
      <Som nome="tique" em={t.corte + 18} />
      <Som nome="tique" em={t.mortal} />
      <Som nome="guilhotina" em={t.pouso} volume={0.4} />
      <Som nome="carimbo" em={tDirigindo} volume={0.6} />

      {e.plano === 1 ? (
        <>
          <PistaLoop />
          <Velocimetro x={260} y={720} valor={vel} rodape={frame >= t.largada + 32 ? '≈ 1 s' : undefined} r={84} escala={pVel} />
        </>
      ) : (
        <>
          {!z ? <RampaSalto /> : null}
          {frame < tSem ? <Carrinhos /> : null}
          {!z ? <SoproChao x={e.x} p={e.sopro} frame={frame} /> : null}
        </>
      )}

      <CarroEsportivo x={cx} y={cy} escala={esc} rot={z ? 0 : e.rot} giro={z ? 1 : e.giro} jatos={z ? [] : e.jatos} rodas={e.rodas} frame={frame} />
      <Carimbo x={CENTRO_X} y={GRANDE_Y - 170} texto="SEM MOTORISTA" em={tDirigindo} tamanho={64} rot={-8} />
    </>
  );
};

export const Gancho: CenaEp = {
  Conteudo,
  Fundo: () => <FundoGalpao />,
  planos: () => {
    const t = temposGancho();
    return [ABERTO(0), ABERTO(t.corte), ABERTO(palavra(B, 'sem'))];
  },
};
