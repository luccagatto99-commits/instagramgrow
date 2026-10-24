import React from 'react';
import { Balao, Bonequinho } from '../components';
import { COR, FONTE, CONTORNO, RAIO, ESTEIRA_Y } from '../theme';

/** A promessa do começo da área (reaparece carimbada no inverno). */
export const PROMESSA = { rotulo: 'PROMESSA', nome: 'máquinas farão qualquer trabalho humano', numero: 'prazo: 20 anos' };

export const PAREDE_X = 540;
export const CAIXA_X = 800;

/** Caixa fechada do outro lado da parede: mostra "?" ou o que estiver escondido. */
export const CaixaOculta: React.FC<{ x: number; base: number; lado?: number; children?: React.ReactNode; escala?: number }> = ({ x, base, lado = 220, children, escala = 1 }) => (
  <div
    style={{
      position: 'absolute',
      left: x - lado / 2,
      top: base - lado,
      width: lado,
      height: lado,
      boxSizing: 'border-box',
      background: COR.branco,
      border: `${CONTORNO}px solid ${COR.preto}`,
      borderRadius: RAIO.caixa,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transform: `scale(${escala})`,
      transformOrigin: '50% 100%',
    }}
  >
    {children ?? <span style={{ fontFamily: FONTE.titulo, fontSize: 150, lineHeight: 1, color: COR.vermelho, WebkitTextStroke: `6px ${COR.preto}` }}>?</span>}
  </div>
);

/** Parede de traço (tijolos) que separa quem pergunta de quem responde. */
export const Parede: React.FC<{ x: number; base: number; altura?: number; escala?: number }> = ({ x, base, altura = 400, escala = 1 }) => (
  <svg width={100} height={altura} viewBox={`0 0 100 ${altura}`} style={{ position: 'absolute', left: x - 50, top: base - altura, transform: `scaleY(${escala})`, transformOrigin: '50% 100%' }}>
    <rect x={5} y={5} width={90} height={altura - 10} rx={10} fill={COR.branco} stroke={COR.preto} strokeWidth={CONTORNO} />
    {Array.from({ length: Math.floor(altura / 50) - 1 }).map((_, i) => (
      <g key={i} stroke={COR.preto} strokeWidth={6}>
        <line x1={8} y1={55 + i * 50} x2={92} y2={55 + i * 50} />
        <line x1={i % 2 ? 35 : 65} y1={55 + i * 50} x2={i % 2 ? 35 : 65} y2={105 + i * 50 > altura - 8 ? altura - 8 : 105 + i * 50} />
      </g>
    ))}
  </svg>
);

/** Silhueta de pessoa (dentro da caixa oculta). */
export const IconePessoa: React.FC<{ tamanho?: number }> = ({ tamanho = 130 }) => (
  <svg width={tamanho} height={tamanho} viewBox="0 0 100 100" fill={COR.branco} stroke={COR.preto} strokeWidth={8} strokeLinejoin="round">
    <circle cx={50} cy={30} r={18} />
    <path d="M18 92 Q18 56 50 56 Q82 56 82 92 Z" />
  </svg>
);

/** Máquina de traço (gabinete com luzes e fita), sem rosto. */
export const IconeMaquina: React.FC<{ tamanho?: number }> = ({ tamanho = 130 }) => (
  <svg width={tamanho} height={tamanho} viewBox="0 0 100 100" fill={COR.branco} stroke={COR.preto} strokeWidth={8} strokeLinejoin="round">
    <rect x={14} y={10} width={72} height={80} rx={8} />
    {[32, 50, 68].map((x) => <circle key={x} cx={x} cy={28} r={5} fill={COR.preto} stroke="none" />)}
    {[46, 60, 74].map((y) => <line key={y} x1={26} y1={y} x2={74} y2={y} strokeWidth={6} />)}
  </svg>
);

/**
 * O teste de Turing: quem pergunta (bonequinho) à esquerda, parede no meio,
 * caixa oculta à direita. `p` 0 → 1 monta a cena; balões entram com pA/pB.
 */
export const TesteTuring: React.FC<{
  p: number;
  dx?: number;
  oculto?: React.ReactNode;
  pA?: number;
  pB?: number;
  textoA?: React.ReactNode;
  textoB?: React.ReactNode;
}> = ({ p, dx = 0, oculto, pA = 0, pB = 0, textoA, textoB }) => (
  <div style={{ position: 'absolute', inset: 0, transform: `translateX(${dx}px)` }}>
    <Bonequinho x={250 - (1 - p) * 700} base={ESTEIRA_Y} />
    <Parede x={PAREDE_X} base={ESTEIRA_Y} escala={Math.min(1, p * 1.2)} />
    <CaixaOculta x={CAIXA_X} base={ESTEIRA_Y} escala={p}>{oculto}</CaixaOculta>
    {pA > 0.01 ? <Balao x={270} base={750} rabo="esq" largura={320} escala={pA}>{textoA}</Balao> : null}
    {pB > 0.01 ? <Balao x={790} base={760} rabo="dir" largura={290} escala={pB}>{textoB}</Balao> : null}
  </div>
);

/** Sol de traço (o verão de 1956). Posicionado pelo centro. */
export const Sol: React.FC<{ x: number; y: number; r?: number; giro?: number; escala?: number }> = ({ x, y, r = 60, giro = 0, escala = 1 }) => (
  <svg width={r * 4} height={r * 4} viewBox={`${-r * 2} ${-r * 2} ${r * 4} ${r * 4}`} style={{ position: 'absolute', left: x - r * 2, top: y - r * 2, transform: `scale(${escala}) rotate(${giro}deg)` }}>
    {Array.from({ length: 10 }).map((_, i) => {
      const a = (i / 10) * Math.PI * 2;
      return <line key={i} x1={Math.cos(a) * r * 1.3} y1={Math.sin(a) * r * 1.3} x2={Math.cos(a) * r * 1.75} y2={Math.sin(a) * r * 1.75} stroke={COR.preto} strokeWidth={9} strokeLinecap="round" />;
    })}
    <circle r={r} fill={COR.branco} stroke={COR.preto} strokeWidth={CONTORNO} />
  </svg>
);

/** Floco de neve de traço (inverno da IA). */
export const Floco: React.FC<{ x: number; y: number; tamanho?: number; giro?: number }> = ({ x, y, tamanho = 60, giro = 0 }) => (
  <svg width={tamanho} height={tamanho} viewBox="-50 -50 100 100" style={{ position: 'absolute', left: x - tamanho / 2, top: y - tamanho / 2, transform: `rotate(${giro}deg)` }}>
    {[0, 60, 120].map((a) => (
      <g key={a} transform={`rotate(${a})`}>
        <line x1={-42} y1={0} x2={42} y2={0} stroke={COR.preto} strokeWidth={16} strokeLinecap="round" />
        <line x1={-42} y1={0} x2={42} y2={0} stroke={COR.branco} strokeWidth={6} strokeLinecap="round" />
      </g>
    ))}
  </svg>
);

/** Placa preta grande com texto amarelo (nome de um conceito: EFEITO ELIZA, INVERNO DA IA). */
export const PlacaConceito: React.FC<{ texto: string; top: number; p: number; tamanho?: number }> = ({ texto, top, p, tamanho = 64 }) =>
  p > 0.01 ? (
    <div
      style={{
        position: 'absolute',
        left: 540,
        top,
        transform: `translateX(-50%) scale(${p})`,
        background: COR.preto,
        color: COR.amarelo,
        borderRadius: RAIO.placa,
        boxShadow: `20px 20px 0 ${COR.preto}`,
        padding: '24px 48px 20px',
        fontFamily: FONTE.rotulo,
        fontWeight: 900,
        fontSize: tamanho,
        letterSpacing: 4,
        whiteSpace: 'nowrap',
      }}
    >
      {texto}
    </div>
  ) : null;
