import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Bonequinho, Destaque, FECHADO, FundoPortaria, Logo, Som, type CenaEp } from '../components';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA, CENTRO_X, ESTEIRA_Y } from '../theme';
import { entra, lin, mola, naEsteira, segue, tranco } from '../anim';
import { palavra } from './tempo';
import { GRADE, GradeProcessos } from './comum';

const B = 0;
const X_CHAT = 760;

/** Mesa do juiz com martelo (traço). Posicionada pelo centro x e pela base. */
export const MesaJuiz: React.FC<{ x: number; base: number; golpe: number }> = ({ x, base, golpe }) => (
  <div style={{ position: 'absolute', left: x - 150, top: base - 150, width: 300, height: 150 }}>
    <svg width={300} height={150} viewBox="0 0 300 150" style={{ overflow: 'visible' }} fill={COR.branco} stroke={COR.preto} strokeWidth={10} strokeLinejoin="round" strokeLinecap="round">
      <rect x={10} y={50} width={280} height={100} rx={16} />
      <g transform={`rotate(${-35 + golpe * 35} 210 46)`}>
        <rect x={150} y={10} width={70} height={34} rx={8} />
        <line x1={185} y1={44} x2={250} y2={44} />
      </g>
      <rect x={180} y={40} width={50} height={12} rx={4} fill={COR.preto} />
    </svg>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 78, textAlign: 'center', fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 32, letterSpacing: 2, color: COR.preto }}>JUIZ</div>
  </div>
);

/** Gancho: o caso real de Nova York (2023): seis processos que não existiam. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tChat = palavra(B, 'chatgpt');
  const tEntregou = palavra(B, 'entregou');
  const tJuiz = palavra(B, 'juiz');
  const tNenhum = palavra(B, 'nenhum');
  const tExistia = palavra(B, 'existia.');
  const tPor = palavra(B, 'por');

  const xBoneco = mola(frame, -10, -150, 230);
  const pChat = entra(frame, tChat - 4, 150);
  const saiChat = segue(frame, tJuiz - 8, 12);
  const sai = segue(frame, tPor - 4, 14);
  const pQ = lin(frame, tPor + 2, tPor + 10);

  return (
    <>
      <Som nome="tique" em={0} />
      <Som nome="tique" em={tChat - 4} />
      {GRADE.map((_, i) => <Som key={i} nome="tique" em={tEntregou - 2 + i * 4} volume={0.5} />)}
      <Som nome="carimbo" em={tExistia} volume={0.6} />
      {GRADE.map((_, i) => <Som key={`c${i}`} nome="carimbo" em={tNenhum + i * 4} volume={0.45} />)}
      <Som nome="carimbo" em={tPor + 10} volume={0.4} />

      <Destaque de={0} ate={tEntregou - 12} top={672} tamanho={60}>
        <div style={{ display: 'inline-block', background: COR.preto, color: COR.amarelo, borderRadius: 20, padding: '10px 30px 14px' }}>
          Nova York · <span style={{ fontFamily: FONTE.numero, fontWeight: 800 }}>2023</span>
        </div>
      </Destaque>

      <Bonequinho x={xBoneco} base={ESTEIRA_Y} maleta escala={1} passo={frame < 26 ? frame * 0.5 : 0} triste={lin(frame, tPor, tPor + 10)} />

      {/* a tela do chat */}
      {saiChat < 1400 && frame >= tChat - 4 ? (
        <div
          style={{
            position: 'absolute',
            left: X_CHAT + saiChat,
            top: ESTEIRA_Y,
            transform: `translate(-50%, -100%) translateY(${(1 - pChat) * -700}px)`,
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            background: COR.branco,
            border: `${CONTORNO}px solid ${COR.preto}`,
            borderRadius: RAIO.placa,
            boxShadow: SOMBRA,
            padding: '14px 30px',
            whiteSpace: 'nowrap',
          }}
        >
          <Logo marca="openai" tamanho={60} />
          <span style={{ fontFamily: FONTE.titulo, fontSize: 54, color: COR.preto, lineHeight: 1 }}>ChatGPT</span>
        </div>
      ) : null}

      {frame >= tJuiz + 2 && sai < 1400 ? <MesaJuiz x={naEsteira(frame, tJuiz + 2, X_CHAT) + sai} base={ESTEIRA_Y} golpe={tranco(frame, tExistia)} /> : null}

      {/* os seis processos saem da tela do chat */}
      {frame >= tEntregou - 2 && sai < 1400 ? (
        <GradeProcessos
          visiveis={Math.min(6, Math.floor((frame - (tEntregou - 2)) / 4) + 1)}
          carimbo={tNenhum}
          pos={(i) => {
            const t = tEntregou - 2 + i * 4;
            return {
              x: mola(frame, t, X_CHAT, GRADE[i].x) + sai,
              base: mola(frame, t, ESTEIRA_Y - 140, GRADE[i].base),
              escala: 0.4 + 0.6 * entra(frame, t, 180),
            };
          }}
        />
      ) : null}

      {frame >= tPor + 2 ? (
        <div
          style={{
            position: 'absolute',
            left: CENTRO_X,
            top: -500 + (440 + 500) * pQ * pQ,
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
  Fundo: () => {
    const f = useCurrentFrame();
    const s = lin(f, palavra(B, 'entregou') - 12, palavra(B, 'entregou') - 4);
    return <FundoPortaria placa={1 - s} opacidade={1 - 0.6 * s} />;
  },
  planos: () => [
    FECHADO(0, CENTRO_X, 880, 1.1),
    ABERTO(palavra(B, 'entregou') - 4),
    FECHADO(palavra(B, 'nenhum') - 2, CENTRO_X, 740, 1.06),
    ABERTO(palavra(B, 'por') - 2),
  ],
};
