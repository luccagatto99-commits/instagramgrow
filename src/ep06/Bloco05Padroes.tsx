import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, FECHADO, FolhaCodigo, FundoPrateleiras, Mascote, Palpites, Som, Trecho, type CenaEp } from '../components';
import { COR, CONTORNO, ESTEIRA_Y } from '../theme';
import { entra, lin, naEsteira } from '../anim';
import { palavra } from './tempo';

const B = 4;
const N_ESTANTE = 8;
const ACHADA = 5; // a folha da estante parecida com var_8

/** Mini folha de código da estante (as bilhões de linhas que a IA já viu). */
const MiniFolha: React.FC<{ x: number; top: number; p: number; achada: number }> = ({ x, top, p, achada }) =>
  p > 0.01 ? (
    <div style={{ position: 'absolute', left: x - 36, top, width: 72, height: 90, transform: `scale(${p * (1 + 0.15 * achada)})`, background: COR.branco, border: `6px solid ${achada > 0.5 ? COR.azul : COR.preto}`, borderRadius: 10, padding: '12px 10px', boxSizing: 'border-box' }}>
      {[0, 1, 2].map((i) => <div key={i} style={{ height: 8, marginBottom: 10, width: `${[90, 60, 75][i]}%`, background: achada > 0.5 && i === 0 ? COR.azul : COR.preto, borderRadius: 4 }} />)}
    </div>
  ) : null;

/** A IA reconhece o padrão: compara com o que já viu, dá os palpites e reescreve com nomes. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tIA = palavra(B, 'ia.');
  const tBilhoes = palavra(B, 'bilhões');
  const tReconhece = palavra(B, 'reconhece');
  const tPadrao = palavra(B, 'padrão:');
  const tChega = palavra(B, 'chega');
  const tVida = palavra(B, 'vida.');
  const tReescreve = palavra(B, 'reescreve');

  const saiEstante = lin(frame, tChega - 10, tChega - 2);
  const pPalpites = entra(frame, tChega - 2, 150) * (1 - lin(frame, tReescreve - 10, tReescreve - 2));
  const reescrito = frame >= tReescreve + 4;
  const verde = (velho: string, novo: string) =>
    reescrito ? <Trecho cor={COR.preto} fundo={COR.verde}>{novo}</Trecho> : <Trecho cor={COR.vermelho}>{velho}</Trecho>;

  return (
    <>
      <Som nome="tique" em={tIA - 4} />
      {Array.from({ length: N_ESTANTE }).map((_, i) => <Som key={i} nome="tique" em={tBilhoes - 2 + i * 3} volume={0.35} />)}
      <Som nome="tique" em={tPadrao} />
      <Som nome="tique" em={tChega} />
      <Som nome="carimbo" em={tVida} volume={0.45} />
      <Som nome="tique" em={tReescreve + 4} />

      <FolhaCodigo
        x={naEsteira(frame, -2, 720)}
        base={ESTEIRA_Y}
        largura={430}
        tamanho={36}
        escala={reescrito ? 1 + 0.06 * Math.sin(lin(frame, tReescreve + 4, tReescreve + 14) * Math.PI) : 1}
        linhas={[<>se {verde('var_8', 'vida')} = 0:</>, <>{'  '}{verde('func_12', 'fim_de_jogo')}()</>]}
      />
      {frame >= tIA - 8 ? <Mascote x={280} base={ESTEIRA_Y} largura={200} escala={entra(frame, tIA - 8, 150)} olhar={0.8} pensa={lin(frame, tReconhece - 4, tPadrao + 10) * (1 - lin(frame, tReescreve + 10, tReescreve + 20))} /> : null}

      {/* estante: o que ela já viu */}
      {saiEstante < 1
        ? Array.from({ length: N_ESTANTE }).map((_, i) => (
            <div key={i} style={{ opacity: 1 - saiEstante }}>
              <MiniFolha x={225 + i * 90} top={540} p={entra(frame, tBilhoes - 2 + i * 3, 170)} achada={i === ACHADA ? lin(frame, tPadrao, tPadrao + 4) : 0} />
            </div>
          ))
        : null}
      {/* a ligação entre o padrão visto e a folha */}
      {frame >= tPadrao && saiEstante < 1 ? (
        <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, opacity: 1 - saiEstante }}>
          <line x1={225 + ACHADA * 90} y1={636} x2={225 + ACHADA * 90 + (680 - 225 - ACHADA * 90) * lin(frame, tPadrao, tPadrao + 8)} y2={636 + (850 - 636) * lin(frame, tPadrao, tPadrao + 8)} stroke={COR.azul} strokeWidth={CONTORNO} strokeDasharray="18 14" strokeLinecap="round" />
        </svg>
      ) : null}

      <Palpites
        x={540}
        top={480}
        largura={560}
        escala={pPalpites}
        p={lin(frame, tChega, tChega + 30)}
        venceu={lin(frame, tVida - 2, tVida + 10)}
        palpites={[{ rotulo: 'vida', pct: 87 }, { rotulo: 'tempo', pct: 9 }, { rotulo: 'munição', pct: 4 }]}
      />
    </>
  );
};

export const Padroes: CenaEp = {
  Conteudo,
  Fundo: () => <FundoPrateleiras />,
  planos: () => [
    ABERTO(0),
    FECHADO(palavra(B, 'ia.') - 2, 540, 860, 1.06),
    ABERTO(palavra(B, 'bilhões') - 6),
    FECHADO(palavra(B, 'reescreve') + 2, 540, 860, 1.06),
  ],
};
