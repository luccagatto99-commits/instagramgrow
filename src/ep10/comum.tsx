import React from 'react';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA } from '../theme';
import { useVisivelNoHud } from '../components';

const P = COR.preto;
const TINTA = `var(--tinta, ${COR.preto})`;

/** Cachorro de contorno, de lado, olhando para a direita (caixa local ≈ 0..235 × −15..126). */
export const Cachorro: React.FC<{ transform?: string; traco?: number }> = ({ transform, traco = 7 }) => (
  <g transform={transform} stroke={P} strokeWidth={traco} strokeLinejoin="round" strokeLinecap="round">
    <path d="M22 48 Q2 22 14 0" fill="none" strokeWidth={traco + 2} />
    {[34, 58, 124, 148].map((lx) => (
      <rect key={lx} x={lx} y={58} width={20} height={68} rx={9} fill={COR.branco} />
    ))}
    <polygon points="138,42 164,2 196,20 170,64" fill={COR.branco} />
    <ellipse cx={95} cy={55} rx={80} ry={34} fill={COR.branco} />
    <circle cx={180} cy={14} r={30} fill={COR.branco} />
    <ellipse cx={210} cy={26} rx={21} ry={13} fill={COR.branco} />
    <circle cx={229} cy={21} r={6} fill={P} stroke="none" />
    <path d="M166 -10 Q148 10 158 38 Q172 22 178 -6 Z" fill={P} />
    <circle cx={190} cy={7} r={5} fill={P} stroke="none" />
  </g>
);

/** Foto ilustrada "um cachorro na praia" (viewBox 400 × 300). `nova` = outra composição (a foto que nunca existiu). */
export const CenaPraia: React.FC<{ nova?: boolean }> = ({ nova }) => (
  <g>
    <rect width={400} height={300} fill={COR.branco} />
    {nova ? (
      <g stroke={P} strokeWidth={6} strokeLinecap="round">
        <circle cx={78} cy={72} r={30} fill={COR.amarelo} />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
          const r = (a * Math.PI) / 180;
          return <line key={a} x1={78 + Math.cos(r) * 42} y1={72 + Math.sin(r) * 42} x2={78 + Math.cos(r) * 56} y2={72 + Math.sin(r) * 56} />;
        })}
      </g>
    ) : (
      <circle cx={330} cy={68} r={34} fill={COR.amarelo} stroke={P} strokeWidth={6} />
    )}
    <g fill="none" stroke={P} strokeWidth={5} strokeLinecap="round">
      <path d="M0 176 Q25 166 50 176 T100 176 T150 176 T200 176 T250 176 T300 176 T350 176 T400 176" />
      <path d={nova ? 'M20 194 Q45 184 70 194 T120 194 T170 194' : 'M230 194 Q255 184 280 194 T330 194 T380 194'} />
    </g>
    <path d="M0 212 Q200 196 400 212 L400 300 L0 300 Z" fill={COR.amarelo} stroke={P} strokeWidth={6} />
    {nova ? (
      <>
        <Cachorro transform="translate(330 140) scale(-0.9 0.9)" />
        <g stroke={P} strokeWidth={6}>
          <circle cx={92} cy={256} r={20} fill={COR.branco} />
          <path d="M74 250 Q92 262 110 250" fill="none" />
        </g>
      </>
    ) : (
      <Cachorro transform="translate(70 140) scale(0.9)" />
    )}
  </g>
);

// mão de traço com 6 dedos: base de cada dedo, ângulo (graus, 0 = para cima), comprimento e largura
const DEDOS: { bx: number; by: number; a: number; len: number; w: number }[] = [
  { bx: 146, by: 214, a: -58, len: 62, w: 26 }, // polegar
  { bx: 152, by: 172, a: -16, len: 70, w: 22 },
  { bx: 176, by: 166, a: -7, len: 82, w: 22 },
  { bx: 200, by: 164, a: 0, len: 88, w: 22 },
  { bx: 224, by: 166, a: 7, len: 82, w: 22 },
  { bx: 248, by: 172, a: 16, len: 68, w: 22 },
];
/** Pontas dos 6 dedos (viewBox 400 × 300), na ordem do polegar para o mindinho. */
export const PONTAS_MAO: [number, number][] = DEDOS.map((d) => {
  const r = (d.a * Math.PI) / 180;
  return [d.bx + Math.sin(r) * d.len, d.by - Math.cos(r) * d.len];
});

/** Mão aberta de contorno com 6 dedos (viewBox 400 × 300). */
/** Ampliação da mão dentro do quadro (a mesma vale para traços por cima). */
export const ZOOM_MAO = 'translate(200 300) scale(1.25) translate(-200 -300)';

export const MaoSeisDedos: React.FC = () => (
  <g>
    <rect width={400} height={300} fill={COR.branco} />
    <g transform={ZOOM_MAO}>
    <g stroke={P} strokeWidth={7} strokeLinejoin="round" fill={COR.branco}>
      <rect x={170} y={250} width={74} height={70} rx={10} />
      {DEDOS.map((d, i) => (
        <rect key={i} x={d.bx - d.w / 2} y={d.by - d.len} width={d.w} height={d.len + 20} rx={d.w / 2} transform={`rotate(${d.a} ${d.bx} ${d.by})`} />
      ))}
      <rect x={138} y={160} width={130} height={112} rx={42} />
    </g>
    <path d="M168 230 Q200 246 236 226" fill="none" stroke={P} strokeWidth={5} strokeLinecap="round" />
    </g>
  </g>
);

/** Caixa de texto do pedido (campo de digitação genérico). Posicionada pelo centro x e pelo topo. */
export const CaixaPrompt: React.FC<{ x: number; top: number; texto: string; cursor?: boolean; largura?: number; escala?: number; opacidade?: number }> = ({
  x, top, texto, cursor, largura = 700, escala = 1, opacidade = 1,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x - largura / 2,
      top,
      width: largura,
      height: 104,
      transform: `scale(${escala})`,
      transformOrigin: '50% 0%',
      opacity: opacidade,
      background: COR.branco,
      border: `${CONTORNO}px solid ${P}`,
      borderRadius: RAIO.caixa,
      boxShadow: SOMBRA,
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      padding: '0 28px',
      fontFamily: FONTE.titulo,
      fontSize: 46,
      color: P,
      whiteSpace: 'pre',
    }}
  >
    {texto}
    <span style={{ display: 'inline-block', width: 6, height: 54, marginLeft: 6, background: P, opacity: cursor ? 1 : 0 }} />
  </div>
);

/** Pilha de fotos (folhas com a praia em miniatura) e uma tesoura ao lado: "copiar e colar". Centro x, base. */
export const PilhaFotos: React.FC<{ x: number; base: number; escala?: number }> = ({ x, base, escala = 1 }) => (
  <div style={{ position: 'absolute', left: x - 260, top: base - 300, width: 520, height: 300, transform: `scale(${escala})`, transformOrigin: '50% 100%' }}>
    {[
      { l: 20, t: 60, r: -9 },
      { l: 60, t: 40, r: 5 },
      { l: 40, t: 70, r: -2 },
    ].map((f, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: f.l,
          top: f.t,
          width: 280,
          height: 210,
          transform: `rotate(${f.r}deg)`,
          background: COR.branco,
          border: `${CONTORNO}px solid ${P}`,
          borderRadius: 14,
          boxShadow: i === 2 ? SOMBRA : undefined,
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="none">
          <CenaPraia nova={i === 1} />
        </svg>
      </div>
    ))}
    {/* tesoura de traço */}
    <svg width={170} height={200} viewBox="0 0 170 200" style={{ position: 'absolute', left: 350, top: 70, overflow: 'visible' }}>
      <g stroke={P} strokeWidth={9} strokeLinecap="round" fill={COR.branco}>
        <line x1={50} y1={130} x2={150} y2={20} />
        <line x1={120} y1={130} x2={20} y2={20} />
        <circle cx={40} cy={160} r={26} />
        <circle cx={130} cy={160} r={26} />
        <circle cx={85} cy={82} r={6} fill={P} />
      </g>
    </svg>
  </div>
);

/** Ponto de interrogação vermelho grande, com contorno. Centro x, topo. */
export const Interrogacao: React.FC<{ x: number; top: number; escala?: number; rot?: number }> = ({ x, top, escala = 1, rot = 0 }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top,
      transform: `translateX(-50%) scale(${escala}) rotate(${rot}deg)`,
      transformOrigin: '50% 80%',
      fontFamily: FONTE.titulo,
      fontSize: 300,
      lineHeight: 1,
      color: COR.vermelho,
      WebkitTextStroke: `10px ${P}`,
      paintOrder: 'stroke fill',
      textShadow: `14px 14px 0 ${P}`,
    }}
  >
    ?
  </div>
);

/** Aviso do hud: seta grossa para a esquerda + "AO CONTRÁRIO" (a esteira volta). Centro x, y. */
export const SetaVolta: React.FC<{ x?: number; y?: number; escala?: number }> = ({ x = 540, y = 500, escala = 1 }) => {
  const vis = useVisivelNoHud();
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${escala})`, display: 'flex', alignItems: 'center', gap: 20, ...vis }}>
      <svg width={120} height={70} viewBox="0 0 120 70">
        <path d="M112 35 L34 35 M52 10 L16 35 L52 60" fill="none" stroke={TINTA} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 40, letterSpacing: 2, color: TINTA }}>AO CONTRÁRIO</span>
    </div>
  );
};

/** Rótulo solto do hud (caixa alta). Centro x, y. */
export const RotuloHud: React.FC<{ texto: string; x?: number; y?: number; escala?: number; cor?: string; opacidade?: number }> = ({
  texto, x = 540, y = 500, escala = 1, cor = TINTA, opacidade = 1,
}) => {
  const vis = useVisivelNoHud();
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${escala})`,
        fontFamily: FONTE.rotulo,
        fontWeight: 900,
        fontSize: 40,
        letterSpacing: 2,
        color: cor,
        whiteSpace: 'nowrap',
        opacity: opacidade,
        textShadow: 'var(--halo, none)',
        ...vis,
      }}
    >
      {texto}
    </div>
  );
};

/** Etiqueta branca pendurada (descrição da foto). Centro x, topo. */
export const Etiqueta: React.FC<{ x: number; top: number; texto: string; escala?: number }> = ({ x, top, texto, escala = 1 }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top,
      transform: `translateX(-50%) scale(${escala})`,
      transformOrigin: '50% 100%',
      background: COR.branco,
      border: `8px solid ${P}`,
      borderRadius: 14,
      padding: '6px 22px',
      fontFamily: FONTE.titulo,
      fontSize: 38,
      color: P,
      whiteSpace: 'nowrap',
    }}
  >
    “{texto}”
  </div>
);
