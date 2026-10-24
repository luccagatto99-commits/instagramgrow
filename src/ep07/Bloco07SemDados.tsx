import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Destaque, FECHADO, FundoPrateleiras, Som, type CenaEp } from '../components';
import { FONTE, ESTEIRA_Y } from '../theme';
import { lin, naEsteira } from '../anim';
import { palavra } from './tempo';
import { Prateleira } from './comum';

const B = 6;

/** Sem dados: prateleira da rua cheia, a do Roadster vazia → versão limitada do piloto automático. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tRoadster = palavra(B, 'roadster');
  const tVersao = palavra(B, 'versão');
  const tSem = palavra(B, 'sem');
  const tAprende = palavra(B, 'aprende.');

  return (
    <>
      <Som nome="tique" em={0} />
      <Som nome="tique" em={tRoadster - 4} />
      <Som nome="tique" em={tVersao - 2} />
      <Som nome="carimbo" em={tSem} volume={0.4} />

      <Destaque de={tVersao - 2} ate={tSem - 6} top={470} tamanho={64}>
        “versão limitada”
        <div style={{ fontFamily: FONTE.rotulo, fontWeight: 700, fontSize: 32, letterSpacing: 2, marginTop: 6 }}>DO PILOTO AUTOMÁTICO · DESIGNER DA TESLA</div>
      </Destaque>
      <Destaque de={tSem - 2} top={450} tamanho={58}>
        sem dados, a IA não aprende
      </Destaque>

      <Prateleira x={naEsteira(frame, -4, 340)} base={ESTEIRA_Y} rotulo="RUA" cheia={lin(frame, 4, 24)} />
      {frame >= tRoadster - 8 ? (
        <Prateleira x={naEsteira(frame, tRoadster - 8, 740)} base={ESTEIRA_Y} rotulo="ROADSTER" cheia={0} treme={Math.sin(Math.PI * lin(frame, tAprende - 4, tAprende + 16)) * Math.sin(frame * 1.6)} />
      ) : null}
    </>
  );
};

export const SemDados: CenaEp = {
  Conteudo,
  Fundo: () => <FundoPrateleiras opacidade={0.12} />,
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'sem') - 4, 740, 860, 1.08)],
};
