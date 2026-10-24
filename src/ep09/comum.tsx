import React from 'react';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA } from '../theme';

const TINTA = `var(--tinta, ${COR.preto})`;

/** Casa de traço (na cor da tinta) com a porta em volta de quem está dentro. `p` 0 → 1 desenha. */
export const Casa: React.FC<{ x: number; base: number; largura?: number; altura?: number; p: number }> = ({ x, base, largura = 600, altura = 330, p }) => {
  const l = x - largura / 2;
  const r = x + largura / 2;
  const topo = base - altura;
  const d = `M${l} ${base} L${l} ${topo} L${x} ${topo - 130} L${r} ${topo} L${r} ${base}`;
  const comp = 2 * altura + 2 * Math.hypot(largura / 2, 130);
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', color: TINTA }}>
      <path d={d} fill="none" stroke="currentColor" strokeWidth={12} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={comp} strokeDashoffset={comp * (1 - p)} />
      <path d={`M${x - 150} ${base} L${x - 150} ${topo + 40} L${x + 150} ${topo + 40} L${x + 150} ${base}`} fill="none" stroke="currentColor" strokeWidth={8} strokeLinejoin="round" opacity={Math.max(0, p * 2 - 1)} />
      <rect x={x + 200} y={topo + 50} width={70} height={70} rx={8} fill="none" stroke="currentColor" strokeWidth={8} opacity={Math.max(0, p * 2 - 1)} />
      <rect x={x - 270} y={topo + 50} width={70} height={70} rx={8} fill="none" stroke="currentColor" strokeWidth={8} opacity={Math.max(0, p * 2 - 1)} />
    </svg>
  );
};

/** Cartão com ícone de traço de um movimento (braço, pulso, mão) e o número da ação. Centro x, base. */
export const CartaoAcao: React.FC<{ x: number; base: number; icone: 'braco' | 'pulso' | 'mao'; rotulo: string; numero?: number; pNumero?: number; escala?: number }> = ({
  x, base, icone, rotulo, numero, pNumero = 0, escala = 1,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x - 100,
      top: base - 210,
      width: 200,
      height: 210,
      transform: `scale(${escala})`,
      transformOrigin: '50% 100%',
      background: COR.branco,
      border: `${CONTORNO}px solid ${COR.preto}`,
      borderRadius: RAIO.caixa,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: 10,
    }}
  >
    <svg width={110} height={84} viewBox="0 0 110 84" fill="none" stroke={COR.preto} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round">
      {icone === 'braco' ? (
        <>
          <path d="M14 74 L44 40 L88 30" />
          <path d="M78 18 L98 30 L78 42" />
          <circle cx={44} cy={40} r={7} fill={COR.amarelo} />
        </>
      ) : icone === 'pulso' ? (
        <>
          <path d="M30 70 L30 40" />
          <path d="M62 14 A28 28 0 1 1 22 30" />
          <path d="M14 22 L22 32 L32 22" />
        </>
      ) : (
        <>
          <path d="M20 64 L20 22 M20 22 L44 14 M20 64 L44 72" />
          <path d="M60 14 L88 22 M60 72 L88 64" />
          <path d="M66 30 L54 42 L66 54" />
        </>
      )}
    </svg>
    <div style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 24, letterSpacing: 1, color: COR.preto, marginTop: 2 }}>{rotulo}</div>
    <div style={{ fontFamily: FONTE.numero, fontWeight: 800, fontSize: 46, color: COR.azul, lineHeight: 1.1, transform: `scale(${pNumero})` }}>{numero ?? ''}</div>
  </div>
);

/** Quadro da câmera do robô: cena simples (mesa e lata) com o ponto vermelho de gravação. Centro x, topo. */
export const QuadroCamera: React.FC<{ x: number; top: number; escala?: number }> = ({ x, top, escala = 1 }) => (
  <div
    style={{
      position: 'absolute',
      left: x - 130,
      top,
      width: 260,
      height: 190,
      transform: `scale(${escala})`,
      background: COR.branco,
      border: `${CONTORNO}px solid ${COR.preto}`,
      borderRadius: RAIO.caixa,
      boxShadow: SOMBRA,
      boxSizing: 'border-box',
    }}
  >
    <svg width={240} height={170} viewBox="0 0 240 170" fill="none" stroke={COR.preto} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={22} cy={22} r={9} fill={COR.vermelho} stroke="none" />
      <path d="M20 118 L220 118 M44 118 L44 160 M196 118 L196 160" />
      <rect x={96} y={68} width={34} height={50} rx={6} />
      <path d="M150 118 Q150 86 170 86 Q190 86 190 118" />
      {[[8, 46, 8, 8, 46, 8], [232, 46, 232, 8, 194, 8]].map((p, i) => (
        <path key={i} d={`M${p[0]} ${p[1]} L${p[2]} ${p[3]} L${p[4]} ${p[5]}`} strokeWidth={5} />
      ))}
    </svg>
  </div>
);

/** Pilha de páginas da internet (folhas brancas com linhas). Centro x, base. */
export const PilhaPaginas: React.FC<{ x: number; base: number; escala?: number; rotulo?: string }> = ({ x, base, escala = 1, rotulo }) => (
  <div style={{ position: 'absolute', left: x - 110, top: base - 230, width: 220, height: 230, transform: `scale(${escala})`, transformOrigin: '50% 100%' }}>
    {[2, 1, 0].map((k) => (
      <div
        key={k}
        style={{
          position: 'absolute',
          left: 20 + k * 14,
          top: 10 + k * -10,
          width: 160,
          height: 190,
          background: COR.branco,
          border: `${CONTORNO * 0.8}px solid ${COR.preto}`,
          borderRadius: 14,
          boxSizing: 'border-box',
          padding: '18px 16px',
        }}
      >
        {k === 0
          ? [100, 80, 92, 60, 86, 70].map((w, i) => <div key={i} style={{ width: `${w}%`, height: 9, background: COR.preto, borderRadius: 5, marginBottom: 12, opacity: 0.85 }} />)
          : null}
      </div>
    ))}
    {rotulo ? (
      <div style={{ position: 'absolute', left: 0, right: 0, top: -30, textAlign: 'center', fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 26, letterSpacing: 2, color: TINTA }}>{rotulo}</div>
    ) : null}
  </div>
);

/** Cozinha de traço: balcão, armários e dois braços pequenos trabalhando. Centro x, base. */
export const Cozinha: React.FC<{ x: number; base: number; p: number; frame: number }> = ({ x, base, p, frame }) => {
  const l = x - 170;
  const braco = (bx: number, fase: number) => {
    const a = Math.sin(frame / 7 + fase) * 18;
    const ex = bx + Math.cos(((60 + a) * Math.PI) / 180) * 60;
    const ey = base - 110 - Math.sin(((60 + a) * Math.PI) / 180) * 60;
    return (
      <g key={bx}>
        <path d={`M${bx} ${base - 110} L${ex} ${ey} L${ex + 40} ${ey + 20}`} fill="none" stroke="currentColor" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={ex} cy={ey} r={9} fill={COR.amarelo} stroke="none" />
      </g>
    );
  };
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', color: TINTA, opacity: p }}>
      <g fill="none" stroke="currentColor" strokeWidth={9} strokeLinejoin="round">
        <rect x={l} y={base - 110} width={340} height={110} rx={8} />
        <line x1={l + 113} y1={base - 110} x2={l + 113} y2={base} />
        <line x1={l + 226} y1={base - 110} x2={l + 226} y2={base} />
        <rect x={l} y={base - 330} width={150} height={90} rx={8} />
        <rect x={l + 190} y={base - 330} width={150} height={90} rx={8} />
      </g>
      {braco(l + 70, 0)}
      {braco(l + 250, 2)}
    </svg>
  );
};

/** Mesa de traço com tampo na altura `tampo`. Centro x. */
export const Mesa: React.FC<{ x: number; tampo: number; base: number; largura?: number }> = ({ x, tampo, base, largura = 320 }) => (
  <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', color: TINTA }}>
    <g fill="none" stroke="currentColor" strokeWidth={12} strokeLinecap="round">
      <line x1={x - largura / 2} y1={tampo} x2={x + largura / 2} y2={tampo} />
      <line x1={x - largura / 2 + 30} y1={tampo} x2={x - largura / 2 + 30} y2={base} />
      <line x1={x + largura / 2 - 30} y1={tampo} x2={x + largura / 2 - 30} y2={base} />
    </g>
  </svg>
);

/** Saco de papel (branco, contorno). Posicionado pelo centro da base, com rotação em volta dela. */
export const Saco: React.FC<{ x: number; base: number; rot?: number }> = ({ x, base, rot = 0 }) => (
  <svg width={100} height={110} viewBox="0 0 100 110" style={{ position: 'absolute', left: x - 50, top: base - 110, overflow: 'visible', transform: `rotate(${rot}deg)`, transformOrigin: '50% 100%' }}>
    <path d="M14 30 L86 30 L92 106 L8 106 Z" fill={COR.branco} stroke={COR.preto} strokeWidth={8} strokeLinejoin="round" />
    <path d="M14 30 L22 8 L78 8 L86 30" fill={COR.branco} stroke={COR.preto} strokeWidth={8} strokeLinejoin="round" />
    <path d="M36 52 Q50 64 64 52" fill="none" stroke={COR.preto} strokeWidth={6} strokeLinecap="round" />
  </svg>
);

/** Cubo mágico genérico (faces brancas com grade), girando a camada de cima. */
export const CuboMagico: React.FC<{ giro: number; tamanho?: number }> = ({ giro, tamanho = 110 }) => {
  const c = tamanho / 3;
  return (
    <svg width={tamanho + 20} height={tamanho + 20} viewBox={`-10 -10 ${tamanho + 20} ${tamanho + 20}`} style={{ overflow: 'visible' }}>
      {Array.from({ length: 9 }).map((_, i) => {
        const cx = (i % 3) * c;
        const cy = Math.floor(i / 3) * c;
        const linha0 = i < 3;
        return (
          <rect
            key={i}
            x={cx + 3 + (linha0 ? Math.sin((giro * Math.PI) / 180) * 10 : 0)}
            y={cy + 3}
            width={c - 6}
            height={c - 6}
            rx={6}
            fill={i % 4 === 0 ? COR.azul : COR.branco}
            stroke={COR.preto}
            strokeWidth={6}
          />
        );
      })}
    </svg>
  );
};

/** Caixa de chat genérica (sem logo): texto digitando e cursor. Centro x, topo. */
export const CaixaChat: React.FC<{ x: number; top: number; texto: string; cursor?: boolean; largura?: number; escala?: number; opacidadeTexto?: number }> = ({
  x, top, texto, cursor, largura = 620, escala = 1, opacidadeTexto = 1,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x - largura / 2,
      top,
      width: largura,
      transform: `scale(${escala})`,
      transformOrigin: '50% 100%',
      background: COR.branco,
      border: `${CONTORNO}px solid ${COR.preto}`,
      borderRadius: 36,
      boxShadow: SOMBRA,
      boxSizing: 'border-box',
      padding: '24px 30px',
      minHeight: 120,
      fontFamily: FONTE.titulo,
      fontSize: 54,
      color: COR.preto,
      lineHeight: 1.1,
    }}
  >
    <span style={{ opacity: opacidadeTexto }}>{texto}</span>
    {cursor ? <span style={{ display: 'inline-block', width: 8, height: 52, background: COR.preto, marginLeft: 6, verticalAlign: '-6px' }} /> : null}
  </div>
);
