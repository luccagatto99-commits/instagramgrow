import React from 'react';
import { useCurrentFrame } from 'remotion';
import { CaixaToken, Destaque, FundoGalpao } from '../components';
import { COR, FONTE, CENTRO_X, ESTEIRA_Y, CONTORNO, SOMBRA } from '../theme';
import { entra, naEsteira, pop } from '../anim';
import { palavra } from './tempo';
import { ABERTO, FECHADO, type CenaEp } from './comum';

const B = 10;
const EXEMPLOS = ['abacaxi', 'saudade', 'paralelepípedo', 'sua palavra'];

/** Pedido de comentário: a próxima caixa da esteira é a palavra de quem assiste. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tComenta = palavra(B, 'comenta');
  const i = Math.min(EXEMPLOS.length - 1, Math.floor(frame / 14));
  const atual = frame >= tComenta ? 'sua palavra' : EXEMPLOS[i];
  return (
    <>
      <Destaque de={2} top={470} tamanho={72}>
        qual palavra passa
        <br />
        pela guilhotina?
      </Destaque>
      <CaixaToken
        texto={
          <>
            {atual}
            <span style={{ opacity: frame % 16 < 8 ? 1 : 0 }}>|</span>
          </>
        }
        tamanho={84}
        x={naEsteira(frame, 2, CENTRO_X)}
        base={ESTEIRA_Y}
        destaque
      />
      {frame >= tComenta ? (
        <div
          style={{
            position: 'absolute',
            left: CENTRO_X,
            top: 690,
            transform: `translateX(-50%) scale(${entra(frame, tComenta, 180) * pop(frame, tComenta + 20, 0.06)})`,
            background: COR.vermelho,
            border: `${CONTORNO}px solid ${COR.preto}`,
            boxShadow: SOMBRA,
            borderRadius: 30,
            padding: '16px 40px',
            fontFamily: FONTE.titulo,
            fontSize: 60,
            color: COR.preto,
            whiteSpace: 'nowrap',
          }}
        >
          COMENTA AQUI ↓
        </div>
      ) : null}
    </>
  );
};

export const Comenta: CenaEp = {
  Conteudo,
  Fundo: () => <FundoGalpao />,
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'comenta') - 2, CENTRO_X, 800, 1.15)],
};
