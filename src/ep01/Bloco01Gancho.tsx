import React from 'react';
import { useCurrentFrame } from 'remotion';
import { CaixaToken, FundoPortaria, Som } from '../components';
import { COR, FONTE, CENTRO_X, ESTEIRA_Y, CONTORNO } from '../theme';
import { entra, lin, naEsteira, tranco } from '../anim';
import { palavra } from './tempo';
import { ABERTO, Balao, FECHADO, type CenaEp } from './comum';

const B = 0;

/** Gancho: a pergunta chega pela portaria; a IA acerta medicina e erra o morango. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tMedicina = palavra(B, 'medicina.');
  const tErra = palavra(B, 'errar.');
  const tSabe = palavra(B, 'por');

  const x = naEsteira(frame, -14, CENTRO_X);
  const pQ = lin(frame, tSabe - 2, tSabe + 6);
  const qTop = -500 + (430 + 500) * pQ * pQ;
  const baque = tranco(frame, tSabe + 6);
  const balao = frame >= tMedicina && frame < tSabe - 2;
  const errou = frame >= tErra;

  return (
    <>
      <Som nome="tique" em={0} />
      <CaixaToken texto="Quantas letras R tem em morango?" larguraMax={760} tamanho={72} x={x} base={ESTEIRA_Y} escala={1 - baque * 0.06} destaque />
      {balao ? (
        <Balao top={590} escala={entra(frame, errou ? tErra : tMedicina, 200)}>
          {errou ? (
            <>
              Tem 2 letras R. <span style={{ color: COR.vermelho, WebkitTextStroke: `2px ${COR.preto}` }}>✗</span>
            </>
          ) : (
            <>
              Medicina: aprovada <span style={{ color: COR.verde, WebkitTextStroke: `2px ${COR.preto}` }}>✓</span>
            </>
          )}
        </Balao>
      ) : null}
      {frame >= tSabe - 2 ? (
        <div
          style={{
            position: 'absolute',
            left: CENTRO_X,
            top: qTop,
            transform: 'translateX(-50%)',
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

export const Gancho: CenaEp = {
  Conteudo,
  // a placa da portaria sai antes do balão e do "?" ocuparem o topo
  Fundo: () => {
    const f = useCurrentFrame();
    return <FundoPortaria placa={1 - lin(f, palavra(B, 'medicina.') - 8, palavra(B, 'medicina.'))} />;
  },
  planos: () => [FECHADO(0, CENTRO_X, 860, 1.3), ABERTO(palavra(B, 'medicina.') - 2), FECHADO(palavra(B, 'por') - 2, CENTRO_X, 780, 1.2)],
};
