import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, ContadorPassos, FECHADO, FundoPrateleiras, Mascote, QuadroRuido, Som, Visto, type CenaEp } from '../components';
import { ESTEIRA_Y, CENTRO_X } from '../theme';
import { entra, lin, mola, pop } from '../anim';
import { palavra } from './tempo';
import { CenaPraia, SetaVolta } from './comum';

const B = 3;
const BASE = ESTEIRA_Y - 10;
const LARG = 380;
const ALT = (LARG * 3) / 4;
const X_FOTO = 690;
const X_MASCOTE = 300;

const milhar = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/**
 * Aprender o contrário: a esteira volta; o mascote olha a foto estragada e marca (em azul) os pontos
 * que acha que foram colocados. ✗ em "erra", ✓ em "corrige"; o ciclo acelera em "milhões de vezes"
 * e, em "limpar", a foto fica limpa de novo.
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tContrario = palavra(B, 'contrário.');
  const tRecebe = palavra(B, 'recebe');
  const tAdivinhar = palavra(B, 'adivinhar');
  const tErra = palavra(B, 'erra,');
  const tCorrige = palavra(B, 'corrige');
  const tMilhoes = palavra(B, 'milhões');
  const tLimpar = palavra(B, 'limpar');
  const tFim = palavra(B, 'imagem.', 0, true);

  // chegam pela direita (esteira ao contrário)
  const xMascote = X_MASCOTE + (1 - mola(frame, 0, 0, 1)) * 900;
  const xFoto = X_FOTO + (1 - mola(frame, tRecebe - 10, 0, 1)) * 700;

  const pensa = lin(frame, tAdivinhar, tErra, 0, 1);
  const palpite = frame < tLimpar ? lin(frame, tAdivinhar, tErra - 6) : 1 - lin(frame, tLimpar, tLimpar + 10);
  const nivel = 1 - lin(frame, tLimpar, tFim + 4);

  // ✗ → ✓ e depois o ciclo acelerando (período cai de 14 para 3 frames)
  let ok = frame >= tCorrige;
  let marca = tErra;
  if (frame >= tMilhoes && frame < tLimpar) {
    let t = tMilhoes;
    let n = 0;
    while (t + Math.max(3, 14 - n) <= frame) {
      t += Math.max(3, 14 - n);
      n++;
    }
    ok = n % 2 === 1;
    marca = t;
  }
  if (frame >= tLimpar) {
    ok = true;
    marca = tLimpar;
  }
  const reps = frame < tMilhoes ? 1 : Math.pow(10, lin(frame, tMilhoes, tLimpar, 0, 6));

  const ticks: number[] = [];
  for (let t = tMilhoes, n = 0; t < tLimpar; t += Math.max(3, 14 - n), n++) ticks.push(t);
  return (
    <>
      <Som nome="tique" em={tRecebe - 10} />
      <Som nome="guilhotina" em={tErra} volume={0.3} />
      <Som nome="tique" em={tCorrige} volume={0.6} />
      {ticks.map((t) => <Som key={t} nome="tique" em={t} volume={0.25} />)}
      <Som nome="ding" em={tFim} volume={0.4} />

      {frame >= tContrario - 6 && frame < tErra - 4 ? <SetaVolta escala={entra(frame, tContrario - 6, 200)} /> : null}
      {frame >= tErra - 4 ? <ContadorPassos rotulo="REPETIÇÕES" valor={milhar(reps)} escala={entra(frame, tErra - 4, 200)} /> : null}

      <Mascote x={xMascote} base={BASE} largura={220} pensa={pensa} olhar={1} pulo={frame >= tFim ? Math.max(0, Math.sin(((frame - tFim) / 10) * Math.PI)) * 30 : 0} />
      <QuadroRuido x={xFoto} base={BASE} largura={LARG} nivel={nivel} palpite={palpite} semente={3}>
        <CenaPraia />
      </QuadroRuido>
      {frame >= tErra ? <Visto x={xFoto + LARG / 2 - 10} y={BASE - ALT + 6} r={44} ok={ok} escala={entra(frame, tErra, 220) * pop(frame, marca, 0.25)} /> : null}
    </>
  );
};

export const Contrario: CenaEp = {
  Conteudo,
  Fundo: () => <FundoPrateleiras />,
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'adivinhar'), X_FOTO - 60, 830, 1.1), ABERTO(palavra(B, 'erra,')), FECHADO(palavra(B, 'limpar'), CENTRO_X, 820, 1.08)],
  sentido: -1,
};
