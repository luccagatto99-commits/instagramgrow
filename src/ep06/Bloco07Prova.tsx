import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Bonequinho, FECHADO, FichaDocumento, FundoEscritorio, Mascote, Num, Som, type CenaEp } from '../components';
import { ESTEIRA_Y } from '../theme';
import { entra, lin, naEsteira, segue } from '../anim';
import { palavra } from './tempo';
import { CartaoNumero } from './comum';

const B = 6;
const N_IAS = 17;

/** Prova real: um programador, 17 IAs em paralelo, 3 meses, 99% das funções. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tProgramador = palavra(B, 'programador');
  const tCall = palavra(B, 'call');
  const t17 = palavra(B, '17');
  const t3 = palavra(B, '3');
  const t99 = palavra(B, '99');

  const saiFicha = segue(frame, t17 - 10, 14);
  const ias = Math.round(lin(frame, t17 - 2, t17 + 20, 0, 17));
  const pct = Math.round(lin(frame, t99 - 2, t99 + 22, 0, 99));

  return (
    <>
      <Som nome="tique" em={tProgramador - 2} />
      <Som nome="tique" em={tCall - 2} />
      {[0, 4, 8, 12, 16].map((i) => <Som key={i} nome="tique" em={t17 + i * 2} volume={0.4} />)}
      <Som nome="tique" em={t3 - 2} />
      <Som nome="tique" em={t99 - 2} />

      <Bonequinho x={naEsteira(frame, tProgramador - 12, 210)} base={ESTEIRA_Y} passo={frame < tProgramador + 10 ? frame * 0.5 : 0} />
      {frame >= tCall - 6 && saiFicha < 1200 ? (
        <FichaDocumento x={620 + saiFicha} base={ESTEIRA_Y} escala={entra(frame, tCall - 6, 150)} rotulo="JOGO" nome="Call of Duty" numero={<Num>2009</Num>} largura={440} tamanho={52} />
      ) : null}

      {/* 17 IAs entram em duas fileiras, cada uma pensando: a de trás (8) primeiro, a da frente (9) por cima */}
      {Array.from({ length: N_IAS }).map((_, k) => {
        const i = (k + 9) % N_IAS; // desenha 9..16 e depois 0..8
        const frente = i < 9;
        const alvo = frente ? 340 + i * 72 : 376 + (i - 9) * 72;
        return frame >= t17 - 4 + i * 2 ? (
          <Mascote key={i} x={naEsteira(frame, t17 - 4 + i * 2, alvo)} base={frente ? ESTEIRA_Y : ESTEIRA_Y - 52} largura={70} pensa={((frame + i * 7) % 30) / 30} />
        ) : null;
      })}

      <CartaoNumero x={290} top={530} valor={String(ias)} legenda="IAs" escala={entra(frame, t17 - 4, 160)} />
      <CartaoNumero x={540} top={530} valor="3" legenda="MESES" escala={entra(frame, t3 - 4, 160)} />
      <CartaoNumero x={790} top={530} valor={`${pct}%`} legenda="DAS FUNÇÕES" escala={entra(frame, t99 - 4, 160)} />
    </>
  );
};

export const Prova: CenaEp = {
  Conteudo,
  Fundo: () => <FundoEscritorio />,
  planos: () => [FECHADO(0, 540, 860, 1.06), ABERTO(palavra(B, 'call') - 6)],
};
