import React from 'react';
import { AvatarTerno, BalaoMensagem, Celular, Visto } from '../components';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA } from '../theme';
import envelope from './envelope.json';

const ENV = envelope as number[];

/** Volume da narração (0 → 1) no frame absoluto `f` (scripts: envelope por frame, 30 fps). */
export const volumeEm = (f: number) => (f < 0 || f >= ENV.length ? 0 : ENV[Math.floor(f)]);

/** Texto pequeno da tela do celular. */
export const TextoTela: React.FC<{ children: React.ReactNode; tamanho?: number; cor?: string; mono?: boolean }> = ({ children, tamanho = 30, cor = COR.preto, mono }) => (
  <div
    style={{
      fontFamily: mono ? FONTE.numero : FONTE.rotulo,
      fontWeight: mono ? 800 : 900,
      fontSize: tamanho,
      letterSpacing: mono ? 0 : 1,
      color: cor,
      lineHeight: 1.05,
      textAlign: 'center',
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </div>
);

/** Tela de chamada: avatar + nome + estado. */
export const TelaChamada: React.FC<{ nome: string; estado: string; vazio?: boolean; desfaz?: number }> = ({ nome, estado, vazio, desfaz = 0 }) => (
  <>
    <AvatarTerno tamanho={130} vazio={vazio} desfaz={desfaz} />
    <TextoTela tamanho={nome.length > 7 ? 25 : 30}>{nome}</TextoTela>
    <TextoTela tamanho={24} cor={COR.preto}>
      <span style={{ opacity: 0.6 }}>{estado}</span>
    </TextoTela>
  </>
);

/** Cartão pequeno de uma confirmação (mensagem ou ligação) com o selo ✓/✗. Centro x, base. */
export const CartaoConfirmacao: React.FC<{ x: number; base: number; tipo: 'mensagem' | 'ligacao'; ok: boolean; vira?: number; escala?: number }> = ({
  x, base, tipo, ok, vira = 0, escala = 1,
}) => (
  <div style={{ position: 'absolute', left: x, top: base, transform: `scale(${escala})`, transformOrigin: '0 0' }}>
    {tipo === 'mensagem' ? (
      <BalaoMensagem x={0} base={0} remetente="CHEFE" texto="Transfira agora." hora="" largura={230} tamanho={34} />
    ) : (
      <Celular x={0} base={0} escala={0.5}>
        <AvatarTerno tamanho={130} />
      </Celular>
    )}
    <Visto x={tipo === 'mensagem' ? 100 : 64} y={tipo === 'mensagem' ? -150 : -235} r={40} ok={ok} vira={vira} />
  </div>
);

/** Porta de enrolar da fábrica: `abre` 0 → 1 sobe as ripas. Centro x, base. */
export const PortaFabrica: React.FC<{ x: number; base: number; largura?: number; altura?: number; abre: number; escala?: number }> = ({
  x, base, largura = 230, altura = 330, abre, escala = 1,
}) => {
  const fechada = altura * (1 - Math.min(1, Math.max(0, abre)));
  return (
    <div
      style={{
        position: 'absolute',
        left: x - largura / 2,
        top: base - altura,
        width: largura,
        height: altura,
        transform: `scale(${escala})`,
        transformOrigin: '50% 100%',
        border: `${CONTORNO}px solid var(--tinta, ${COR.preto})`,
        borderBottom: 'none',
        borderRadius: `${RAIO.caixa}px ${RAIO.caixa}px 0 0`,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: fechada,
          background: COR.branco,
          backgroundImage: `repeating-linear-gradient(180deg, transparent 0 34px, ${COR.preto} 34px 40px)`,
          backgroundPosition: `0 ${fechada}px`,
          borderBottom: fechada > 2 ? `${CONTORNO}px solid ${COR.preto}` : 'none',
        }}
      />
    </div>
  );
};

/** Cartão branco com um ícone de traço (vídeo, microfone, áudio). Centro x, base. */
export const CartaoIcone: React.FC<{ x: number; base: number; icone: 'video' | 'microfone' | 'audio'; rotulo: string; dy?: number; opacidade?: number; rot?: number }> = ({
  x, base, icone, rotulo, dy = 0, opacidade = 1, rot = 0,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x - 100,
      top: base - 200,
      width: 200,
      height: 200,
      transform: `translateY(${dy}px) rotate(${rot}deg)`,
      opacity: opacidade,
      background: COR.branco,
      border: `${CONTORNO}px solid ${COR.preto}`,
      borderRadius: RAIO.caixa,
      boxShadow: SOMBRA,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    }}
  >
    <svg width={110} height={100} viewBox="0 0 110 100" fill="none" stroke={COR.preto} strokeWidth={9} strokeLinejoin="round" strokeLinecap="round">
      {icone === 'video' ? (
        <>
          <rect x={6} y={12} width={98} height={76} rx={14} />
          <path d="M44 34 L72 50 L44 66 Z" fill={COR.preto} />
        </>
      ) : icone === 'microfone' ? (
        <>
          <rect x={38} y={6} width={34} height={56} rx={17} />
          <path d="M22 44 Q22 78 55 78 Q88 78 88 44" />
          <line x1={55} y1={78} x2={55} y2={94} />
        </>
      ) : (
        <>
          <path d="M10 14 H100 V72 H44 L24 92 V72 H10 Z" />
          {[30, 44, 58, 72, 86].map((x, i) => (
            <line key={x} x1={x - 6} y1={43 - [8, 16, 10, 18, 6][i]} x2={x - 6} y2={43 + [8, 16, 10, 18, 6][i]} strokeWidth={7} />
          ))}
        </>
      )}
    </svg>
    <div style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 24, letterSpacing: 1, color: COR.preto, lineHeight: 1 }}>{rotulo}</div>
  </div>
);
