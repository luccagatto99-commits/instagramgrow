import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, FECHADO, FolhaCodigo, FundoGalpao, Mascote, Som, type CenaEp } from '../components';
import { COR, ESTEIRA_Y } from '../theme';
import { entra, mola, naEsteira } from '../anim';
import { palavra } from './tempo';
import { CaixaFechada, Lupa } from './comum';

const B = 1;

/** O nome: engenharia reversa (o programa fechado, o código que ninguém tem) e a IA pega a lupa. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tPrograma = palavra(B, 'programa');
  const tFeito = palavra(B, 'feito');
  const tCodigo = palavra(B, 'código');
  const tIA = palavra(B, 'ia');
  const tFacil = palavra(B, 'fácil.');

  // a lupa examina a caixa e, em "IA", passa para o mascote
  const lupaX = mola(frame, tIA + 6, 330, 465);
  const lupaY = mola(frame, tIA + 6, 760, 770) + Math.sin(frame * 0.18) * 8;

  return (
    <>
      <Som nome="tique" em={tPrograma - 2} />
      <Som nome="tique" em={tFeito} />
      <Som nome="tique" em={tCodigo - 2} />
      <Som nome="tique" em={tIA - 4} />

      <CaixaFechada x={naEsteira(frame, 2, 300)} base={ESTEIRA_Y} rotulo="PROGRAMA" largura={230} />
      <FolhaCodigo
        x={780}
        base={ESTEIRA_Y}
        largura={230}
        rotulo="CÓDIGO"
        escala={entra(frame, tCodigo - 4, 150)}
        linhas={[<div key="q" style={{ textAlign: 'center', fontSize: 120, lineHeight: 1, color: COR.preto }}>?</div>]}
      />
      {frame >= tIA - 6 ? <Mascote x={540} base={ESTEIRA_Y} largura={180} escala={entra(frame, tIA - 6, 150)} pulo={Math.max(0, Math.sin((frame - tFacil) / 5) * 30) * (frame >= tFacil && frame < tFacil + 16 ? 1 : 0)} olhar={-0.6} /> : null}
      <Lupa x={lupaX} y={lupaY} tamanho={100} escala={entra(frame, tFeito - 4, 150)} />
    </>
  );
};

export const Nome: CenaEp = {
  Conteudo,
  Fundo: () => <FundoGalpao />,
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'ia') - 2, 540, 860, 1.06)],
};
