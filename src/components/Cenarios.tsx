import React from 'react';
import { AbsoluteFill } from 'remotion';
import { COR, FONTE, W, ESTEIRA_Y } from '../theme';

/**
 * Cenários da fábrica: ilustração de traço preto sobre o amarelo (sem preenchimento,
 * sem degradê). Ficam ATRÁS dos objetos e mudam de estação para estação.
 */

const T = 8; // espessura do traço de fundo (mais fino que o contorno dos objetos)
const P = 'currentColor'; // traço do tema (preto no amarelo, amarelo no preto)

const Svg: React.FC<{ children: React.ReactNode; opacidade?: number }> = ({ children, opacidade = 1 }) => (
  <AbsoluteFill style={{ opacity: opacidade, color: `var(--traco, ${COR.preto})` }}>
    <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} fill="none" stroke={P} strokeWidth={T} strokeLinejoin="round" strokeLinecap="round">
      {children}
    </svg>
  </AbsoluteFill>
);

/** Chão: linha de rodapé + linhas de perspectiva abaixo da esteira. */
const Chao: React.FC<{ y?: number }> = ({ y = ESTEIRA_Y + 46 }) => (
  <>
    <line x1={-20} y1={y + 40} x2={W + 20} y2={y + 40} />
    {[-300, 0, 300, 600, 900, 1200].map((x) => (
      <line key={x} x1={x + 90} y1={y + 40} x2={x - 60} y2={y + 110} />
    ))}
  </>
);

const Janela: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => (
  <>
    <rect x={x} y={y} width={w} height={h} rx={14} />
    <line x1={x + w / 3} y1={y} x2={x + w / 3} y2={y + h} />
    <line x1={x + (2 * w) / 3} y1={y} x2={x + (2 * w) / 3} y2={y + h} />
    <line x1={x} y1={y + h / 2} x2={x + w} y2={y + h / 2} />
  </>
);

const Lampada: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <>
    <line x1={x} y1={y} x2={x} y2={y + 60} />
    <path d={`M${x - 50} ${y + 110} L${x - 22} ${y + 60} L${x + 22} ${y + 60} L${x + 50} ${y + 110} Z`} fill={P} />
  </>
);

/** Galpão principal: janelas altas, cano no teto, lâmpadas penduradas. */
export const FundoGalpao: React.FC<{ opacidade?: number }> = ({ opacidade = 0.22 }) => (
  <Svg opacidade={opacidade}>
    <line x1={-20} y1={440} x2={W + 20} y2={440} strokeWidth={14} />
    {[120, 470, 820].map((x) => (
      <Lampada key={x} x={x} y={440} />
    ))}
    <Janela x={60} y={620} w={260} h={250} />
    <Janela x={410} y={620} w={260} h={250} />
    <Janela x={760} y={620} w={260} h={250} />
    <Chao />
  </Svg>
);

/** Portaria: portão com a placa da fábrica. */
export const FundoPortaria: React.FC<{ opacidade?: number; placa?: number }> = ({ opacidade = 1, placa = 1 }) => (
  <AbsoluteFill>
    <Svg opacidade={opacidade * 0.9}>
      <rect x={90} y={520} width={110} height={520} rx={12} />
      <rect x={880} y={520} width={110} height={520} rx={12} />
      {[290, 380, 470, 560, 650, 740].map((x) => (
        <line key={x} x1={x + 40} y1={700} x2={x + 40} y2={1040} />
      ))}
      <line x1={200} y1={760} x2={880} y2={760} />
      <line x1={200} y1={980} x2={880} y2={980} />
      <path d={`M200 700 Q540 610 880 700`} />
      <Chao />
    </Svg>
    <div
      style={{
        position: 'absolute',
        left: W / 2,
        top: 470,
        transform: 'translateX(-50%)',
        background: COR.preto,
        color: COR.amarelo,
        borderRadius: 30,
        padding: '18px 48px 14px',
        fontFamily: FONTE.rotulo,
        fontWeight: 900,
        fontSize: 52,
        letterSpacing: 4,
        whiteSpace: 'nowrap',
        textAlign: 'center',
        lineHeight: 1,
        opacity: placa,
      }}
    >
      A FÁBRICA
      <div style={{ fontSize: 30, fontWeight: 700, marginTop: 8, opacity: 0.85 }}>ENTRADA DE CARGA</div>
    </div>
  </AbsoluteFill>
);

/** Prateleiras do catálogo (vocabulário): estantes com caixas vazias. */
export const FundoPrateleiras: React.FC<{ opacidade?: number }> = ({ opacidade = 0.22 }) => (
  <Svg opacidade={opacidade}>
    {[560, 760, 960].map((y) => (
      <line key={y} x1={40} y1={y} x2={W - 40} y2={y} strokeWidth={12} />
    ))}
    {[40, W - 40].map((x) => (
      <line key={x} x1={x} y1={420} x2={x} y2={1040} strokeWidth={12} />
    ))}
    {[560, 760, 960].flatMap((y) =>
      [100, 260, 420, 600, 760, 900].map((x, i) => (
        <rect key={`${x}-${y}`} x={x} y={y - 70 - (i % 2) * 20} width={110 + (i % 3) * 20} height={70 + (i % 2) * 20} rx={10} />
      )),
    )}
  </Svg>
);

/** Sala da prensa: engrenagens e manômetro. */
const Engrenagem: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => (
  <>
    <circle cx={x} cy={y} r={r} />
    <circle cx={x} cy={y} r={r * 0.35} />
    {Array.from({ length: 8 }).map((_, i) => {
      const a = (i / 8) * Math.PI * 2;
      return <line key={i} x1={x + Math.cos(a) * r} y1={y + Math.sin(a) * r} x2={x + Math.cos(a) * (r + 30)} y2={y + Math.sin(a) * (r + 30)} strokeWidth={22} />;
    })}
  </>
);
export const FundoPrensa: React.FC<{ opacidade?: number; giro?: number }> = ({ opacidade = 0.22, giro = 0 }) => (
  <Svg opacidade={opacidade}>
    <g transform={`rotate(${giro} 150 600)`}>
      <Engrenagem x={150} y={600} r={110} />
    </g>
    <g transform={`rotate(${-giro * 1.4} 930 820)`}>
      <Engrenagem x={930} y={820} r={80} />
    </g>
    <circle cx={900} cy={540} r={70} />
    <line x1={900} y1={540} x2={940} y2={500} />
    <line x1={-20} y1={440} x2={W + 20} y2={440} strokeWidth={14} />
    <Chao />
  </Svg>
);

/** Alerta (virada): faixas de perigo pretas em diagonal no topo e na base. */
export const FundoAlerta: React.FC<{ deslocamento?: number }> = ({ deslocamento = 0 }) => {
  const faixa = (y: number) => (
    <g>
      {Array.from({ length: 16 }).map((_, i) => {
        const x = i * 100 - 100 + (deslocamento % 100);
        return <path key={i} d={`M${x} ${y} L${x + 50} ${y} L${x + 10} ${y + 60} L${x - 40} ${y + 60} Z`} fill={P} stroke="none" />;
      })}
      <line x1={-20} y1={y} x2={W + 20} y2={y} strokeWidth={6} />
      <line x1={-20} y1={y + 60} x2={W + 20} y2={y + 60} strokeWidth={6} />
    </g>
  );
  return (
    <Svg>
      {faixa(450)}
    </Svg>
  );
};

/** Saída: porta com placa SAÍDA e relógio de ponto. */
export const FundoSaida: React.FC<{ opacidade?: number; ponteiro?: number }> = ({ opacidade = 0.22, ponteiro = 0 }) => (
  <Svg opacidade={opacidade}>
    <rect x={720} y={560} width={260} height={480} rx={16} />
    <circle cx={930} cy={820} r={14} fill={P} />
    <circle cx={200} cy={1000 - 330} r={110} />
    <line x1={200} y1={670} x2={200 + Math.cos(ponteiro) * 80} y2={670 + Math.sin(ponteiro) * 80} />
    <line x1={200} y1={670} x2={250} y2={670} />
    <line x1={-20} y1={440} x2={W + 20} y2={440} strokeWidth={14} />
    <Chao />
  </Svg>
);

/** Sala de mapas (almoxarifado de endereços): mapas enrolados na parede e rosa dos ventos. */
export const FundoMapa: React.FC<{ opacidade?: number; giro?: number }> = ({ opacidade = 0.22, giro = 0 }) => (
  <Svg opacidade={opacidade}>
    <line x1={-20} y1={440} x2={W + 20} y2={440} strokeWidth={14} />
    {[90, 250, 410, 670, 830].map((x, i) => (
      <g key={x}>
        <line x1={x} y1={440} x2={x} y2={500 + (i % 2) * 30} />
        <rect x={x - 50} y={500 + (i % 2) * 30} width={100} height={260 + (i % 3) * 40} rx={14} />
        <line x1={x - 50} y1={560 + (i % 2) * 30} x2={x + 50} y2={560 + (i % 2) * 30} />
      </g>
    ))}
    <g transform={`rotate(${giro} 540 640)`}>
      <circle cx={540} cy={640} r={90} />
      <path d="M540 530 L560 640 L540 750 L520 640 Z" fill={P} />
      <path d="M430 640 L540 620 L650 640 L540 660 Z" />
    </g>
    <Chao />
  </Svg>
);

/** Escritório: mesa com luminária e quadro de avisos. */
export const FundoEscritorio: React.FC<{ opacidade?: number }> = ({ opacidade = 0.22 }) => (
  <Svg opacidade={opacidade}>
    <line x1={-20} y1={440} x2={W + 20} y2={440} strokeWidth={14} />
    <rect x={120} y={540} width={360} height={260} rx={16} />
    {[[170, 580], [300, 600], [200, 690], [340, 700]].map(([x, y]) => (
      <rect key={`${x}-${y}`} x={x} y={y} width={90} height={70} rx={8} />
    ))}
    <line x1={600} y1={850} x2={1000} y2={850} strokeWidth={12} />
    <line x1={640} y1={850} x2={640} y2={1040} />
    <line x1={960} y1={850} x2={960} y2={1040} />
    <line x1={880} y1={850} x2={830} y2={690} />
    <line x1={830} y1={690} x2={900} y2={610} />
    <path d="M870 590 L950 600 L930 660 Z" fill={P} />
    <Chao />
  </Svg>
);

/** Sala de reunião (atenção): mesa comprida, cadeiras e relógio na parede. */
export const FundoReuniao: React.FC<{ opacidade?: number; ponteiro?: number }> = ({ opacidade = 0.22, ponteiro = 0 }) => (
  <Svg opacidade={opacidade}>
    <line x1={-20} y1={440} x2={W + 20} y2={440} strokeWidth={14} />
    <circle cx={W / 2} cy={560} r={70} />
    <line x1={W / 2} y1={560} x2={W / 2 + Math.cos(ponteiro) * 50} y2={560 + Math.sin(ponteiro) * 50} />
    <line x1={W / 2} y1={560} x2={W / 2} y2={515} />
    <rect x={60} y={660} width={200} height={150} rx={12} />
    <rect x={820} y={660} width={200} height={150} rx={12} />
    <line x1={60} y1={880} x2={W - 60} y2={880} strokeWidth={12} />
    {[140, 340, 540, 740, 940].map((x) => (
      <path key={x} d={`M${x - 40} 880 L${x - 40} 820 Q${x} 790 ${x + 40} 820 L${x + 40} 880`} />
    ))}
    <Chao />
  </Svg>
);

/** Relógio de parede de traço (lentidão). Posicionado pelo centro. */
export const Relogio: React.FC<{ x: number; y: number; r?: number; giro: number; opacidade?: number }> = ({ x, y, r = 70, giro, opacidade = 1 }) => (
  <svg style={{ position: 'absolute', left: x - r - 10, top: y - r - 10, opacity: opacidade }} width={r * 2 + 20} height={r * 2 + 20}>
    <circle cx={r + 10} cy={r + 10} r={r} fill={COR.branco} stroke={COR.preto} strokeWidth={10} />
    <line x1={r + 10} y1={r + 10} x2={r + 10 + Math.cos(giro) * r * 0.7} y2={r + 10 + Math.sin(giro) * r * 0.7} stroke={COR.preto} strokeWidth={10} strokeLinecap="round" />
    <line x1={r + 10} y1={r + 10} x2={r + 10} y2={r * 0.55} stroke={COR.preto} strokeWidth={10} strokeLinecap="round" />
  </svg>
);
