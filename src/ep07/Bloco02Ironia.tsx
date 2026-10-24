import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Balao, Bonequinho, CarroEsportivo, FECHADO, FundoGalpao, Mascote, RODA_CARRO, Som, type CenaEp } from '../components';
import { COR, FONTE, ESTEIRA_Y, CENTRO_X } from '../theme';
import { entra, lin, naEsteira, segue } from '../anim';
import { palavra } from './tempo';

const B = 1;
export const ESC_IRONIA = 2.0;
export const IRONIA_Y = ESTEIRA_Y - RODA_CARRO * ESC_IRONIA;
const PLATEIA_X = [240, 360, 480, 600, 720];

/** Ironia: plateia para provar que não é IA… e quem pilotou foi um computador (mascote no banco). */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tPlateia = palavra(B, 'plateia');
  const tProvar = palavra(B, 'provar');
  const tIronia = palavra(B, 'ironia:');
  const tComputador = palavra(B, 'computador.');

  const sai = segue(frame, tIronia - 8, 14);
  const pBalao = entra(frame, tProvar - 4, 150) * (1 - lin(frame, tIronia - 10, tIronia - 4));
  // janela do carro grande: o mascote senta no banco do motorista
  const bancoX = CENTRO_X - 52 * ESC_IRONIA;
  const bancoBase = IRONIA_Y - 19 * ESC_IRONIA;

  return (
    <>
      <Som nome="tique" em={tPlateia - 4} />
      <Som nome="tique" em={tProvar - 4} />
      <Som nome="tique" em={tIronia - 4} />
      <Som nome="tique" em={tComputador - 4} />

      {sai < 1200
        ? PLATEIA_X.map((x, i) => (
            <Bonequinho key={x} x={naEsteira(frame, tPlateia - 14 + i * 3, x) + sai} base={ESTEIRA_Y} escala={0.75} passo={frame < tPlateia + 10 + i * 3 ? frame * 0.5 : 0} />
          ))
        : null}
      <Balao x={CENTRO_X} base={790} largura={720} tamanho={42} escala={pBalao}>
        “Precisamos de público para provar que não é IA”
        <div style={{ marginTop: 8, fontFamily: FONTE.rotulo, fontWeight: 700, fontSize: 28, letterSpacing: 2, color: COR.preto }}>ELON MUSK</div>
      </Balao>

      {frame >= tIronia + 4 ? <CarroEsportivo x={naEsteira(frame, tIronia + 4, CENTRO_X)} y={IRONIA_Y} escala={ESC_IRONIA} /> : null}
      {frame >= tComputador - 4 ? <Mascote x={bancoX} base={bancoBase} largura={110} escala={entra(frame, tComputador - 4, 160)} pensa={((frame - tComputador) % 24) / 24} /> : null}
    </>
  );
};

export const Ironia: CenaEp = {
  Conteudo,
  Fundo: () => <FundoGalpao />,
  planos: () => [ABERTO(0), ABERTO(palavra(B, "ironia:") + 4), FECHADO(palavra(B, 'computador.') - 4, 540, 850, 1.1)],
  transicao: 0,
};
