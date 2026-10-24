import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Carimbo, Destaque, FECHADO, FichaDocumento, FundoPrateleiras, Som, type CenaEp } from '../components';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA, CENTRO_X, ESTEIRA_Y } from '../theme';
import { entra, lin, tranco } from '../anim';
import { palavra } from './tempo';
import { PROCESSOS } from './dados';

const B = 2;
const CAIXA_TOP = 770;

/** Isso se chama alucinação: a ficha vai para a caixa de defeitos. Não é mentira. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tAluc = palavra(B, 'alucinação.');
  const tMentira = palavra(B, 'mentira.');
  const tErrada = palavra(B, 'errada.');
  const cai = lin(frame, tAluc - 6, tAluc + 6);
  const baque = tranco(frame, tAluc + 6);
  const pCaixa = entra(frame, 2, 130);

  return (
    <>
      <Som nome="tique" em={2} />
      <Som nome="carimbo" em={tAluc + 6} volume={0.5} />

      {/* a ficha carimbada cai dentro da caixa (fica atrás da frente da caixa) */}
      {frame >= tAluc - 8 ? (
      <FichaDocumento x={CENTRO_X} base={-100 + (ESTEIRA_Y - 8 + 100) * cai * cai} nome={PROCESSOS[0].nome} numero={PROCESSOS[0].numero} largura={260} tamanho={26} rot={cai * 8} anulada={1}>
        <Carimbo x={130} y={60} texto="NÃO EXISTE" em={-30} tamanho={30} rot={-14} />
      </FichaDocumento>
      ) : null}
      <div
        style={{
          position: 'absolute',
          left: CENTRO_X - 230,
          top: CAIXA_TOP + (1 - pCaixa) * 400,
          width: 460,
          height: ESTEIRA_Y - CAIXA_TOP,
          background: COR.branco,
          border: `${CONTORNO}px solid ${COR.preto}`,
          borderRadius: `${RAIO.caixa}px ${RAIO.caixa}px 0 0`,
          boxShadow: SOMBRA,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scaleY(${1 - baque * 0.05})`,
          transformOrigin: '50% 100%',
        }}
      >
        <div style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 44, letterSpacing: 4, color: COR.preto }}>DEFEITOS</div>
      </div>

      <Destaque de={tMentira - 4} ate={tErrada - 10} top={480} tamanho={72}>
        não é mentira
      </Destaque>
      <Destaque de={tErrada - 6} top={470} tamanho={64}>
        ela não sabe
        <br />
        que está errada
      </Destaque>
    </>
  );
};

export const Nome: CenaEp = {
  Conteudo,
  Fundo: () => <FundoPrateleiras />,
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'alucinação.') - 6, CENTRO_X, 860, 1.1), ABERTO(palavra(B, 'mentira.') - 4)],
};
