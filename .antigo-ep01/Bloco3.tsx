import React from 'react';
import { useCurrentFrame } from 'remotion';
import { CaixaToken, Destaque, Maquina, Som } from '../components';
import { COR, FONTE, ESTEIRA_Y } from '../theme';
import { lin, naEsteira, tranco } from '../anim';
import { palavra } from './tempo';

const B = 2;
const MAQ = { x: 660, y: 640, w: 290, h: 360 };
const ESPERA = 370; // onde as caixas param antes da máquina

/** A IA só faz conta: a letra é devolvida, o número entra. */
export const Bloco3: React.FC = () => {
  const frame = useCurrentFrame();
  const tConta = palavra(B, 'conta:');
  const tMult = palavra(B, 'multiplicar');
  const tNao = palavra(B, 'não');
  const tEntao = palavra(B, 'então,');
  const tTexto = palavra(B, 'texto');
  const tNumero = palavra(B, 'número.');

  // caixa "A": chega, tenta entrar, é devolvida e cai
  const aX = naEsteira(frame, 6, ESPERA) + lin(frame, tMult, tNao, 0, 170);
  const rejeita = lin(frame, tNao + 2, tNao + 26);
  const aBase = ESTEIRA_Y - 180 * Math.sin(Math.min(rejeita, 0.6) * Math.PI) + Math.max(0, rejeita - 0.5) * 1800;
  const aXr = aX - rejeita * 160;

  // caixa "42": chega e entra
  const nX = naEsteira(frame, tEntao, ESPERA) + lin(frame, tTexto, tNumero, 0, 360);

  const tr = tranco(frame, tNao + 2) * 14 + tranco(frame, tNumero) * 28;
  const chacoalha = frame >= tNao + 2 && frame < tNao + 12 ? Math.sin((frame - tNao) * 2.4) * 10 : 0;

  return (
    <>
      <Som nome="tique" em={6} />
      <Som nome="tique" em={tEntao} />

      <Destaque de={tConta - 6}>
        rede neural = <span style={{ color: COR.preto }}>conta</span>
      </Destaque>

      {rejeita < 1 ? <CaixaToken texto="A" tamanho={84} x={aXr} base={aBase} rot={rejeita * -35} destaque /> : null}
      {frame >= tEntao ? <CaixaToken texto="42" numero tamanho={84} x={nX} base={ESTEIRA_Y} destaque /> : null}

      <Maquina {...MAQ} nome="CALCULADORA" termo="multiplica e soma" dy={tr} dx={chacoalha}>
        <div style={{ fontFamily: FONTE.titulo, fontSize: 120, color: COR.preto, lineHeight: 1 }}>× +</div>
      </Maquina>
    </>
  );
};
