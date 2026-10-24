import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Calendario, FECHADO, FundoPrensa, Som, rolaAno, type CenaEp } from '../components';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA, CENTRO_X, ESTEIRA_Y } from '../theme';
import { entra, lin, pop, segue, tranco } from '../anim';
import { palavra } from './tempo';
import { IconeMaquina } from './comum';

const B = 7;
const TAB = 260; // lado do tabuleiro: abaixo do calendário (que termina em y≈630)
const TAB_X = 360;

/** Rei de traço (peça branca). Posicionado pelo centro x e pela base. */
const Rei: React.FC<{ x: number; base: number; tamanho?: number; queda?: number }> = ({ x, base, tamanho = 120, queda = 0 }) => (
  <svg width={tamanho} height={tamanho * 1.4} viewBox="0 0 100 140" style={{ position: 'absolute', left: x - tamanho / 2, top: base - tamanho * 1.4, transform: `rotate(${queda * 90}deg)`, transformOrigin: '85% 100%', overflow: 'visible' }} fill={COR.branco} stroke={COR.preto} strokeWidth={9} strokeLinejoin="round" strokeLinecap="round">
    <line x1={50} y1={4} x2={50} y2={30} />
    <line x1={38} y1={16} x2={62} y2={16} />
    <path d="M30 40 Q50 28 70 40 L62 98 L38 98 Z" />
    <rect x={18} y={98} width={64} height={34} rx={10} />
  </svg>
);

/** Tabuleiro 8×8 de traço. */
const Tabuleiro: React.FC<{ x: number; top: number }> = ({ x, top }) => (
  <svg width={TAB} height={TAB} viewBox="0 0 8 8" style={{ position: 'absolute', left: x - TAB / 2, top, border: `${CONTORNO}px solid ${COR.preto}`, borderRadius: 12, boxSizing: 'content-box', background: COR.branco }} shapeRendering="crispEdges">
    {Array.from({ length: 64 }).map((_, i) => ((i + Math.floor(i / 8)) % 2 ? <rect key={i} x={i % 8} y={Math.floor(i / 8)} width={1} height={1} fill={COR.preto} /> : null))}
  </svg>
);

const Cartao: React.FC<{ x: number; titulo: string; marca: '✓' | '✗'; p: number; children: React.ReactNode }> = ({ x, titulo, marca, p, children }) =>
  p > 0.01 ? (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: ESTEIRA_Y,
        width: 330,
        height: 340,
        transform: `translate(-50%, -100%) scale(${p})`,
        transformOrigin: '50% 100%',
        background: COR.branco,
        border: `${CONTORNO}px solid ${COR.preto}`,
        borderRadius: RAIO.caixa,
        boxShadow: SOMBRA,
      }}
    >
      <div style={{ position: 'absolute', left: 0, right: 0, top: 30, height: 180 }}>{children}</div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 26, textAlign: 'center', fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 38, letterSpacing: 2, color: COR.preto }}>{titulo}</div>
      <div
        style={{
          position: 'absolute',
          right: -30,
          top: -30,
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: marca === '✓' ? COR.verde : COR.vermelho,
          border: `${CONTORNO}px solid ${COR.preto}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FONTE.titulo,
          fontSize: 46,
          color: COR.preto,
        }}
      >
        {marca}
      </div>
    </div>
  ) : null;

/** 1997: o computador da IBM vence o campeão de xadrez, mas só sabe jogar xadrez. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tComputador = palavra(B, 'computador');
  const tCampeao = palavra(B, 'campeão');
  const tXadrez = palavra(B, 'xadrez.', 0);
  const tAnalisava = palavra(B, 'analisava');
  const t200 = palavra(B, '200');
  const tSo = palavra(B, 'só');
  const tXadrez2 = palavra(B, 'xadrez.', 1);

  const ano = rolaAno(frame, 0, 1966, 1997, 26);
  const saiJogo = segue(frame, tAnalisava - 8, 14);
  const pJogo = entra(frame, 4, 120);
  const queda = lin(frame, tXadrez, tXadrez + 8);
  const conta = Math.round(lin(frame, t200 - 4, t200 + 16, 0, 200_000_000));
  const saiConta = segue(frame, tSo - 10, 12);

  return (
    <>
      <Som nome="tique" em={4} />
      <Som nome="tique" em={tComputador - 2} />
      <Som nome="carimbo" em={tXadrez + 4} volume={0.6} />
      <Som nome="tique" em={t200 - 4} />
      <Som nome="tique" em={tSo - 2} />
      <Som nome="tique" em={tXadrez2 - 2} />

      <Calendario ano={ano} de={0} ate={tCampeao - 6} />

      {saiJogo < 1400 ? (
        <>
          <div style={{ position: 'absolute', inset: 0, transform: `translateX(${(1 - pJogo) * -900 + saiJogo}px)` }}>
            <Tabuleiro x={TAB_X} top={ESTEIRA_Y - TAB - 20} />
            {frame >= tCampeao - 6 ? <Rei x={TAB_X + 16} base={ESTEIRA_Y - 90} tamanho={90} queda={queda} /> : null}
          </div>
          {frame >= tComputador - 6 ? (
            <div style={{ position: 'absolute', left: 740 + saiJogo, top: ESTEIRA_Y, transform: `translate(-50%, -100%) translateY(${tranco(frame, tXadrez) * 10}px) scale(${entra(frame, tComputador - 6, 150)})`, transformOrigin: '50% 100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ background: COR.preto, color: COR.amarelo, borderRadius: 14, padding: '8px 22px 4px', fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 40, letterSpacing: 3, marginBottom: 12 }}>IBM</div>
              <div style={{ background: COR.branco, border: `${CONTORNO}px solid ${COR.preto}`, borderRadius: RAIO.maquina, padding: 18, lineHeight: 0 }}>
                <IconeMaquina tamanho={160} />
              </div>
            </div>
          ) : null}
        </>
      ) : null}

      {frame >= t200 - 6 && saiConta < 1400 ? (
        <div
          style={{
            position: 'absolute',
            left: CENTRO_X + saiConta,
            top: 620,
            transform: `translateX(-50%) scale(${entra(frame, t200 - 6, 150) * pop(frame, t200 + 16, 0.06)})`,
            background: COR.branco,
            border: `${CONTORNO}px solid ${COR.preto}`,
            borderRadius: RAIO.placa,
            boxShadow: SOMBRA,
            padding: '30px 40px 26px',
            textAlign: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          <div style={{ fontFamily: FONTE.numero, fontWeight: 800, fontSize: 84, color: COR.azul, lineHeight: 1 }}>{conta.toLocaleString('pt-BR')}</div>
          <div style={{ marginTop: 16, fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 38, letterSpacing: 2, color: COR.preto }}>POSIÇÕES POR SEGUNDO</div>
        </div>
      ) : null}

      <Cartao x={320} titulo="XADREZ" marca="✓" p={entra(frame, tSo + 4, 150)}>
        <Rei x={165} base={180} tamanho={110} />
      </Cartao>
      <Cartao x={700} titulo="CONVERSAR" marca="✗" p={entra(frame, tXadrez2 + 2, 150)}>
        <svg width={330} height={180} viewBox="0 0 330 180">
          <path d="M85 30 H245 Q265 30 265 50 V115 Q265 135 245 135 H140 L105 165 L110 135 H85 Q65 135 65 115 V50 Q65 30 85 30 Z" fill={COR.branco} stroke={COR.preto} strokeWidth={CONTORNO} strokeLinejoin="round" />
          {[125, 165, 205].map((x) => <circle key={x} cx={x} cy={83} r={10} fill={COR.preto} />)}
        </svg>
      </Cartao>
    </>
  );
};

export const Xadrez: CenaEp = {
  Conteudo,
  Fundo: () => { const f = useCurrentFrame(); return <FundoPrensa giro={f * 2} />; },
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'campeão') - 4, 520, 820, 1.1), ABERTO(palavra(B, 'analisava') - 6), FECHADO(palavra(B, 'só') - 2, CENTRO_X, 800, 1.06)],
};
