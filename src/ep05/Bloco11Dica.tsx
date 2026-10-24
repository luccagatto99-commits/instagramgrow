import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Balao, Destaque, FECHADO, FundoEscritorio, Som, type CenaEp } from '../components';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA, CENTRO_X, ESTEIRA_Y } from '../theme';
import { entra, lin } from '../anim';
import { palavra } from './tempo';
import { CaixaOculta, IconeMaquina } from './comum';

const B = 10;

/** Lupa de traço. Posicionada pelo centro da lente. */
const Lupa: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <svg width={200} height={200} viewBox="0 0 100 100" style={{ position: 'absolute', left: x - 60, top: y - 60, overflow: 'visible' }}>
    <line x1={52} y1={52} x2={88} y2={88} stroke={COR.preto} strokeWidth={14} strokeLinecap="round" />
    <circle cx={30} cy={30} r={24} fill="none" stroke={COR.preto} strokeWidth={8} />
  </svg>
);

/** Dica: parecer humana não é estar certa; confira antes de confiar. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tQuando = palavra(B, 'quando');
  const tEntende = palavra(B, 'entende');
  const tHumana = palavra(B, 'humana');
  const tConfira = palavra(B, 'confira');
  const tConfiar = palavra(B, 'confiar.');

  const pCaixa = entra(frame, tQuando - 6, 150);
  const xLupa = lin(frame, tConfira - 2, tConfiar + 4, 300, 800);
  const pOk = entra(frame, tConfiar + 4, 170);

  return (
    <>
      <Som nome="tique" em={tQuando - 4} />
      <Som nome="tique" em={tEntende - 2} />
      <Som nome="carimbo" em={tHumana} volume={0.5} />
      <Som nome="tique" em={tConfira} />
      <Som nome="tique" em={tConfiar + 4} />

      <Destaque de={2} ate={tQuando - 8} top={600} tamanho={84}>
        o cuidado prático
      </Destaque>

      {pCaixa > 0.01 ? (
        <CaixaOculta x={220} base={ESTEIRA_Y} lado={200} escala={pCaixa}>
          <IconeMaquina tamanho={130} />
        </CaixaOculta>
      ) : null}
      {frame >= tEntende - 4 ? (
        <Balao x={570} base={780} rabo="esq" largura={620} tamanho={44} escala={entra(frame, tEntende - 4, 160)}>
          Entendo exatamente como você se sente.
        </Balao>
      ) : null}

      {frame >= tHumana - 6 ? (
        <div
          style={{
            position: 'absolute',
            left: CENTRO_X,
            top: 440,
            transform: `translateX(-50%) scale(${entra(frame, tHumana - 6, 160)})`,
            background: COR.branco,
            border: `${CONTORNO}px solid ${COR.preto}`,
            borderRadius: RAIO.placa,
            boxShadow: SOMBRA,
            padding: '14px 28px 10px',
            whiteSpace: 'nowrap',
            fontFamily: FONTE.titulo,
            fontSize: 38,
            color: COR.preto,
          }}
        >
          parecer humana <span style={{ color: COR.vermelho }}>≠</span> estar certa
        </div>
      ) : null}

      {frame >= tConfira - 2 ? <Lupa x={xLupa} y={680} /> : null}
      {pOk > 0.01 ? (
        <div style={{ position: 'absolute', left: 880, top: 590, transform: `translate(-50%, -50%) scale(${pOk})`, width: 100, height: 100, borderRadius: '50%', background: COR.verde, border: `${CONTORNO}px solid ${COR.preto}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTE.titulo, fontSize: 56, color: COR.preto }}>✓</div>
      ) : null}
    </>
  );
};

export const Dica: CenaEp = {
  Conteudo,
  Fundo: () => <FundoEscritorio />,
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'entende') - 4, 560, 760, 1.08), ABERTO(palavra(B, 'humana') - 8), FECHADO(palavra(B, 'confira') - 2, 560, 720, 1.06)],
};
