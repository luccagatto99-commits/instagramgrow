import React from 'react';
import { useCurrentFrame } from 'remotion';
import { CaixaToken, Cadeado, Destaque, Num, Som, larguraCaixa } from '../components';
import { COR, FONTE, CENTRO_X, ESTEIRA_Y, CONTORNO } from '../theme';
import { entra, lin, naEsteira, tranco } from '../anim';
import { palavra } from './tempo';

const B = 0;

/** Caixa "morango" trancada (usada no gancho e na volta do bloco 7). */
export const MorangoTrancado: React.FC<{ x: number; base: number; escala?: number; abertura?: number; cadeadoDy?: number; semCadeado?: boolean }> = ({
  x, base, escala = 1, abertura = 0, cadeadoDy = 0, semCadeado,
}) => {
  const T = 84;
  const L = larguraCaixa('morango', T);
  const alt = T * 1.1 + 30 + 20;
  return (
    <>
      <CaixaToken texto="morango" tamanho={T} x={x} base={base} escala={escala} destaque />
      {semCadeado ? null : (
        <Cadeado x={x + (L / 2) * escala + 4} y={base - alt * escala - 26 * escala + cadeadoDy} tamanho={120 * escala} abertura={abertura} />
      )}
    </>
  );
};

/** Gancho: a pergunta chega, a IA erra, o "?" cai, e a caixa é trancada e guardada. */
export const Bloco1: React.FC = () => {
  const frame = useCurrentFrame();
  const tErrou = palavra(B, 'errou');
  const tNao = palavra(B, 'não');
  const tBurrice = palavra(B, 'burrice.');
  const tUma = palavra(B, 'uma.');
  const tE = palavra(B, 'nunca') - 6; // "É que ela nunca viu..."
  const tEnxerga = palavra(B, 'palavra.');

  // a pergunta já está chegando no frame 0
  const x = naEsteira(frame, -14, CENTRO_X);
  const virouMorango = frame >= tE;

  // balão com a resposta errada
  const pBalao = entra(frame, tErrou, 160);
  const balaoFora = lin(frame, tNao - 2, tNao + 4);

  // "?" cai sobre a pergunta
  const pQ = lin(frame, tNao, tBurrice);
  const qTop = -600 + (440 + 600) * pQ * pQ;
  const baque = tranco(frame, tBurrice);
  const qFora = lin(frame, tE - 6, tE);

  // morango trancado e levado embora pela esteira
  const pM = entra(frame, tE, 170);
  const trava = lin(frame, tEnxerga - 4, tEnxerga + 4);
  const xM = naEsteira(frame, -999, CENTRO_X, tEnxerga + 14);

  return (
    <>
      <Som nome="tique" em={0} />
      <Destaque de={tUma - 2} ate={tErrou - 10} top={520} tamanho={84}>
        resposta: <Num>1</Num>
      </Destaque>

      {!virouMorango ? (
        <CaixaToken
          texto="Quantas letras R tem em morango?"
          larguraMax={760}
          tamanho={72}
          x={x}
          base={ESTEIRA_Y}
          escala={1 - baque * 0.06}
          destaque
        />
      ) : (
        <MorangoTrancado x={xM} base={ESTEIRA_Y} escala={0.6 + 0.4 * pM} abertura={1 - trava} />
      )}

      {frame >= tErrou && balaoFora < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: CENTRO_X,
            top: 520,
            transform: `translateX(-50%) scale(${pBalao * (1 - balaoFora)})`,
            transformOrigin: '50% 100%',
            background: COR.branco,
            border: `${CONTORNO}px solid ${COR.preto}`,
            borderRadius: 40,
            padding: '20px 44px',
            fontFamily: FONTE.titulo,
            fontSize: 72,
            color: COR.preto,
            whiteSpace: 'nowrap',
          }}
        >
          Tem 2 letras R.
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: -40,
              marginLeft: -22,
              borderLeft: '22px solid transparent',
              borderRight: '22px solid transparent',
              borderTop: `40px solid ${COR.preto}`,
            }}
          />
        </div>
      ) : null}

      {frame >= tNao && qFora < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: CENTRO_X,
            top: qTop,
            transform: 'translateX(-50%)',
            opacity: 1 - qFora,
            fontFamily: FONTE.titulo,
            fontSize: 300,
            lineHeight: 1,
            color: COR.vermelho,
            WebkitTextStroke: `${CONTORNO}px ${COR.preto}`,
          }}
        >
          ?
        </div>
      ) : null}
    </>
  );
};
