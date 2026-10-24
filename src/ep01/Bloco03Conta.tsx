import React from 'react';
import { useCurrentFrame } from 'remotion';
import { CaixaToken, Destaque, FundoGalpao, Maquina, Som } from '../components';
import { COR, FONTE, ESTEIRA_Y } from '../theme';
import { lin, naEsteira, tranco } from '../anim';
import { palavra } from './tempo';
import { ABERTO, FECHADO, type CenaEp } from './comum';

const B = 2;
const MAQ = { x: 600, y: 690, w: 290, h: 310 };
const ESPERA = 360;

/** Por dentro só tem conta: a letra é devolvida, o número entra. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tConta = palavra(B, 'números:');
  const tMult = Math.max(8, palavra(B, 'entende') - 12);
  const tLetra = palavra(B, 'letras.');
  const tEntao = palavra(B, 'por');
  const tVirar = palavra(B, 'transformar');
  const tNumero = palavra(B, 'números.', 1);

  const aX = naEsteira(frame, 6, ESPERA) + lin(frame, tMult, tLetra, 0, 180);
  const rejeita = lin(frame, tLetra + 2, tLetra + 26);
  const aBase = ESTEIRA_Y - 220 * Math.sin(rejeita * Math.PI);
  const nX = naEsteira(frame, tEntao, ESPERA) + lin(frame, tVirar, tNumero + 4, 0, 400);
  const tr = tranco(frame, tLetra + 2) * 14 + tranco(frame, tNumero + 4) * 28;
  const chacoalha = frame >= tLetra + 2 && frame < tLetra + 12 ? Math.sin((frame - tLetra) * 2.4) * 10 : 0;

  return (
    <>
      <Som nome="tique" em={6} />
      <Som nome="tique" em={tEntao} />
      <Destaque de={tConta - 6} top={470}>
        só entende <span style={{ color: COR.preto }}>números</span>
      </Destaque>
      {rejeita < 1 ? <CaixaToken texto="A" tamanho={84} x={aX - rejeita * 900} base={aBase} rot={rejeita * -35} destaque /> : null}
      {frame >= tEntao ? <CaixaToken texto="42" numero tamanho={84} x={nX} base={ESTEIRA_Y} destaque /> : null}
      <Maquina {...MAQ} nome="CALCULADORA" termo="multiplica e soma" dy={tr} dx={chacoalha}>
        <div style={{ fontFamily: FONTE.titulo, fontSize: 120, color: COR.preto, lineHeight: 1 }}>× +</div>
      </Maquina>
    </>
  );
};

export const Conta: CenaEp = {
  Conteudo,
  Fundo: () => <FundoGalpao />,
  planos: () => [
    ABERTO(0),
    FECHADO(palavra(B, 'entende') - 2, 660, 820, 1.2),
    ABERTO(palavra(B, 'letras.') - 2),
    FECHADO(palavra(B, 'por') - 2, 560, 860, 1.2),
  ],
};
