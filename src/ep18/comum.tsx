import React from 'react';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA } from '../theme';

const P = COR.preto;
const B = COR.branco;
const CINZA = '#8A8A8A';

/** pseudo-aleatório fixo por índice (0..1) */
export const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// ---------------------------------------------------------------------------------------------
/** Tabuleiro de xadrez de contorno com um cavalo. `cavalo` = casa [col, lin] (pode ser fracionária, anda entre casas). Centro x, topo. */
export const Tabuleiro: React.FC<{ x: number; top: number; tam?: number; cavalo: [number, number]; cursor?: [number, number] | null; escala?: number; pegou?: boolean }> = ({
  x, top, tam = 360, cavalo, cursor = null, escala = 1, pegou = false,
}) => {
  const c = tam / 6;
  return escala > 0.01 ? (
    <svg width={tam + 20} height={tam + 20} viewBox={`-10 -10 ${tam + 20} ${tam + 20}`}
      style={{ position: 'absolute', left: x - tam / 2 - 10, top: top - 10, transform: `scale(${escala})`, transformOrigin: '50% 0', overflow: 'visible' }}>
      <rect x={8} y={8} width={tam} height={tam} rx={14} fill={COR.amarelo} />
      <rect width={tam} height={tam} rx={14} fill={B} stroke={P} strokeWidth={8} />
      {Array.from({ length: 36 }, (_, i) => {
        const col = i % 6, lin = Math.floor(i / 6);
        return (col + lin) % 2 ? <rect key={i} x={col * c} y={lin * c} width={c} height={c} fill={P} opacity={0.85} /> : null;
      })}
      <rect width={tam} height={tam} rx={14} fill="none" stroke={P} strokeWidth={8} />
      {/* peões parados */}
      {[[1, 1], [4, 1], [2, 4]].map(([cl, ln], i) => (
        <g key={i} transform={`translate(${cl * c + c / 2} ${ln * c + c / 2})`}>
          <circle r={c * 0.22} fill={B} stroke={P} strokeWidth={5} />
        </g>
      ))}
      {/* cavalo */}
      <g transform={`translate(${cavalo[0] * c + c / 2} ${cavalo[1] * c + c / 2 - (pegou ? 10 : 0)})`}>
        <path d={`M ${-c * 0.28} ${c * 0.36} L ${c * 0.3} ${c * 0.36} L ${c * 0.22} ${-c * 0.05} L ${c * 0.3} ${-c * 0.18} L ${c * 0.02} ${-c * 0.4} L ${-c * 0.2} ${-c * 0.22} L ${-c * 0.05} ${-c * 0.05} L ${-c * 0.24} ${c * 0.1} Z`}
          fill={COR.vermelho} stroke={P} strokeWidth={5} strokeLinejoin="round" />
      </g>
      {cursor ? <Cursor x={cursor[0] * c + c / 2 + 6} y={cursor[1] * c + c / 2 + 4} /> : null}
    </svg>
  ) : null;
};

/** Cursor de mouse (seta branca de contorno), ponta em (x, y), dentro de um svg. */
export const Cursor: React.FC<{ x: number; y: number; tam?: number }> = ({ x, y, tam = 1 }) => (
  <path transform={`translate(${x} ${y}) scale(${tam})`} d="M0 0 L0 44 L11 33 L19 52 L27 48 L19 30 L34 30 Z" fill={B} stroke={P} strokeWidth={5} strokeLinejoin="round" />
);

// ---------------------------------------------------------------------------------------------
/**
 * Pessoa de traço numa cadeira de rodas, de perfil, olhando para a direita. Centro x, base (chão).
 * `cinza` (0 → 1): tudo dos ombros para baixo fica cinza (paralisado). `giro` = ângulo das rodas (graus).
 */
export const Cadeirante: React.FC<{ x: number; base: number; escala?: number; cinza?: number; giro?: number; aceso?: number; opacidade?: number }> = ({
  x, base, escala = 1, cinza = 0, giro = 0, aceso = 0, opacidade = 1,
}) => {
  const corpo = cinza > 0.5 ? CINZA : B;
  return (
    <svg width={260} height={300} viewBox="0 0 260 300"
      style={{ position: 'absolute', left: x - 130, top: base - 300, transform: `scale(${escala})`, transformOrigin: '50% 100%', overflow: 'visible', opacity: opacidade }}
      strokeLinejoin="round" strokeLinecap="round">
      {aceso > 0.01 ? <circle cx={108} cy={58} r={44} fill="none" stroke={COR.amarelo} strokeWidth={10} opacity={aceso} /> : null}
      {/* cadeira */}
      <path d="M70 120 L70 200 L170 200" fill="none" stroke={P} strokeWidth={22} />
      <path d="M70 120 L70 200 L170 200" fill="none" stroke={B} strokeWidth={10} />
      <path d="M170 200 L185 250" fill="none" stroke={P} strokeWidth={9} />
      <circle cx={185} cy={272} r={14} fill={B} stroke={P} strokeWidth={8} />
      <g transform={`rotate(${giro} 95 232)`}>
        <circle cx={95} cy={232} r={62} fill="none" stroke={P} strokeWidth={22} />
        <circle cx={95} cy={232} r={62} fill="none" stroke={B} strokeWidth={10} />
        <line x1={95} y1={176} x2={95} y2={288} stroke={P} strokeWidth={6} />
        <line x1={39} y1={232} x2={151} y2={232} stroke={P} strokeWidth={6} />
        <circle cx={95} cy={232} r={10} fill={P} />
      </g>
      {/* corpo: tronco, coxa, perna e braço */}
      <g fill={corpo} stroke={P} strokeWidth={9}>
        <path d="M84 196 L176 196 L180 176 L92 172 Z" />
        <path d="M172 186 L196 186 L200 262 L178 262 Z" />
        <path d="M80 190 L84 92 Q104 80 126 92 L120 186 Z" />
        <path d="M118 104 L150 150 L172 156" fill="none" strokeWidth={16} stroke={P} />
        <path d="M118 104 L150 150 L172 156" fill="none" strokeWidth={6} stroke={corpo} />
      </g>
      {/* cabeça (sempre branca: o cérebro funciona) */}
      <circle cx={108} cy={58} r={30} fill={B} stroke={P} strokeWidth={9} />
    </svg>
  );
};

// ---------------------------------------------------------------------------------------------
const CONTORNO_CEREBRO =
  'M -205 25 C -215 -80 -120 -150 -10 -152 C 110 -154 210 -95 208 5 C 206 60 175 92 128 96 C 100 128 40 126 14 104 C -40 124 -130 112 -168 82 C -196 70 -204 50 -205 25 Z';
const SULCOS = [
  'M -150 -60 C -120 -40 -100 -80 -60 -60',
  'M -170 20 C -130 0 -100 40 -60 20 C -30 4 -10 40 30 30',
  'M 60 -110 C 80 -80 70 -50 100 -30',
  'M 110 20 C 130 0 160 30 180 0',
  'M -80 70 C -50 50 -20 80 10 60',
];
/** faixa do movimento (córtex motor): do alto da cabeça descendo para a frente */
const MOTOR = 'M -18 -151 C 0 -100 10 -40 30 30 L 62 18 C 46 -40 40 -100 30 -148 Z';
export const PONTO_CHIP: [number, number] = [6, -158]; // topo da faixa do movimento (no referencial do cérebro)

/**
 * Cérebro de perfil (frente à direita), branco de contorno. Centro (x, y), escala.
 * `motor` acende a faixa do movimento; `faiscas` (0 → 1) mostra neurônios disparando; `cranio` desenha o osso;
 * `chip` encaixa o chip no topo; `fios` (0 → 1) desce os fios do chip para dentro; `medula` desenha o tronco e a medula
 * até `medulaFim` (y) com o X da lesão em `lesao` (0 → 1); `sinal` = posição (0 → 1) de um pulso descendo.
 */
export const Cerebro: React.FC<{
  x: number; y: number; escala?: number; motor?: number; faiscas?: number; frame?: number; cranio?: number; chip?: number; fios?: number;
  medula?: number; lesao?: number; sinais?: number[]; escuta?: number;
}> = ({ x, y, escala = 1, motor = 0, faiscas = 0, frame = 0, cranio = 0, chip = 0, fios = 0, medula = 0, lesao = 0, sinais = [], escuta = 0 }) => {
  const yLesao = 250;
  const ptsFios = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 15 - 0.5) * 1.3;
    const comp = 70 + rnd(i) * 60;
    return [PONTO_CHIP[0] + Math.sin(a) * comp * 0.9, PONTO_CHIP[1] + 14 + Math.cos(a) * comp] as const;
  });
  return (
    <svg width={600} height={800} viewBox="-300 -300 600 800"
      style={{ position: 'absolute', left: x - 300, top: y - 300, transform: `scale(${escala})`, transformOrigin: '300px 300px', overflow: 'visible' }}
      strokeLinejoin="round" strokeLinecap="round">
      {/* medula: tronco descendo até o pescoço */}
      {medula > 0.01 ? (
        <g opacity={medula}>
          <path d={`M 60 100 C 66 150 62 ${yLesao - 40} 58 ${yLesao + 160}`} fill="none" stroke={P} strokeWidth={34} />
          <path d={`M 60 100 C 66 150 62 ${yLesao - 40} 58 ${yLesao + 160}`} fill="none" stroke={B} strokeWidth={20} />
          {sinais.map((s, i) =>
            s > 0 && s < 1 ? <circle key={i} cx={60 - s * 2} cy={100 + s * (yLesao - 100)} r={13} fill={COR.amarelo} stroke={P} strokeWidth={5} /> : null,
          )}
          {lesao > 0.01 ? (
            <g transform={`translate(60 ${yLesao}) scale(${lesao})`}>
              <path d="M -30 -30 L 30 30 M 30 -30 L -30 30" stroke={P} strokeWidth={26} />
              <path d="M -30 -30 L 30 30 M 30 -30 L -30 30" stroke={COR.vermelho} strokeWidth={14} />
            </g>
          ) : null}
        </g>
      ) : null}
      {/* sombra dura + cérebro */}
      <path d={CONTORNO_CEREBRO} transform="translate(14 14)" fill={COR.amarelo} />
      <path d={CONTORNO_CEREBRO} fill={B} stroke={P} strokeWidth={CONTORNO} />
      {motor > 0.01 ? <path d={MOTOR} fill={COR.amarelo} opacity={motor} stroke={P} strokeWidth={6} /> : null}
      {SULCOS.map((d, i) => <path key={i} d={d} fill="none" stroke={P} strokeWidth={7} />)}
      {/* fios do chip para dentro do cérebro */}
      {fios > 0.01 ? ptsFios.map(([fx, fy], i) => (
        <line key={i} x1={PONTO_CHIP[0]} y1={PONTO_CHIP[1] + 10} x2={PONTO_CHIP[0] + (fx - PONTO_CHIP[0]) * fios} y2={PONTO_CHIP[1] + 10 + (fy - PONTO_CHIP[1] - 10) * fios}
          stroke={P} strokeWidth={2.5} />
      )) : null}
      {/* neurônios disparando: faíscas na faixa do movimento */}
      {faiscas > 0.01 ? Array.from({ length: 9 }, (_, i) => {
        const fx = -6 + rnd(i + 3) * 46 + (i % 3) * 6, fy = -130 + rnd(i + 11) * 150;
        const fase = (frame / 5 + rnd(i) * 7) % 3;
        const brilha = fase < 0.9 ? 1 - fase / 0.9 : 0;
        return (
          <g key={i} transform={`translate(${fx} ${fy})`} opacity={faiscas}>
            <circle r={7} fill={P} />
            {brilha > 0 ? <path d="M 0 -22 L 5 -6 L 22 0 L 5 6 L 0 22 L -5 6 L -22 0 L -5 -6 Z" fill={COR.amarelo} stroke={P} strokeWidth={3} transform={`scale(${0.5 + brilha})`} /> : null}
            {escuta > 0.01 && brilha > 0 ? (
              <line x1={0} y1={0} x2={(PONTO_CHIP[0] - fx) * (1 - brilha)} y2={(PONTO_CHIP[1] - fy) * (1 - brilha)} stroke={COR.amarelo} strokeWidth={5} opacity={escuta} />
            ) : null}
          </g>
        );
      }) : null}
      {/* crânio: osso de contorno por cima, com a janelinha do chip */}
      {cranio > 0.01 ? (
        <path d="M -232 40 C -246 -110 -120 -186 -10 -188 C 120 -190 240 -120 236 20" fill="none" stroke={P} strokeWidth={30} opacity={cranio} />
      ) : null}
      {cranio > 0.01 ? (
        <path d="M -232 40 C -246 -110 -120 -186 -10 -188 C 120 -190 240 -120 236 20" fill="none" stroke="#D9D9D9" strokeWidth={16} opacity={cranio} strokeDasharray={chip > 0.01 ? '930 70 1000' : undefined} />
      ) : null}
      {chip > 0.01 ? (
        <g transform={`translate(${PONTO_CHIP[0]} ${PONTO_CHIP[1] - (cranio > 0.5 ? 26 : 8) - (1 - chip) * 140})`}>
          <ellipse rx={36} ry={14} cy={14} fill={P} />
          <rect x={-36} y={-6} width={72} height={20} fill={B} stroke={P} strokeWidth={6} />
          <ellipse rx={36} ry={14} cy={-6} fill={B} stroke={P} strokeWidth={6} />
        </g>
      ) : null}
    </svg>
  );
};

// ---------------------------------------------------------------------------------------------
/** O chip visto de cima (disco) com os 64 fios saindo. `fios` (0 → 1) estica os fios. Centro (x, y). */
export const ChipFios: React.FC<{ x: number; y: number; r?: number; fios?: number; escala?: number }> = ({ x, y, r = 90, fios = 0, escala = 1 }) =>
  escala > 0.01 ? (
    <svg width={800} height={800} viewBox="-400 -400 800 800" style={{ position: 'absolute', left: x - 400, top: y - 400, transform: `scale(${escala})`, overflow: 'visible' }}>
      {fios > 0.01 ? Array.from({ length: 64 }, (_, i) => {
        const a = Math.PI * (0.15 + 0.7 * (i / 63));
        const comp = (r + 40 + rnd(i) * 150) * fios;
        const cx = Math.cos(a) * (r + comp * 0.5) + (rnd(i + 7) - 0.5) * 60 * fios;
        return <path key={i} d={`M ${Math.cos(a) * r * 0.9} ${Math.sin(a) * r * 0.9} Q ${cx} ${Math.sin(a) * (r + comp * 0.5)} ${Math.cos(a) * (r + comp)} ${Math.sin(a) * (r + comp)}`} fill="none" stroke={B} strokeWidth={2.2} />;
      }) : null}
      <circle r={r} cx={12} cy={12} fill={COR.amarelo} />
      <circle r={r} fill={B} stroke={P} strokeWidth={CONTORNO} />
      <circle r={r * 0.62} fill="none" stroke={P} strokeWidth={6} />
      <rect x={-r * 0.3} y={-r * 0.3} width={r * 0.6} height={r * 0.6} rx={8} fill={P} />
    </svg>
  ) : null;

/** Moeda de 1 real de contorno. Centro (x, y). */
export const Moeda: React.FC<{ x: number; y: number; r?: number; escala?: number }> = ({ x, y, r = 100, escala = 1 }) =>
  escala > 0.01 ? (
    <svg width={r * 2 + 40} height={r * 2 + 40} viewBox={`${-r - 20} ${-r - 20} ${r * 2 + 40} ${r * 2 + 40}`} style={{ position: 'absolute', left: x - r - 20, top: y - r - 20, transform: `scale(${escala})`, overflow: 'visible' }}>
      <circle r={r} cx={12} cy={12} fill={COR.amarelo} />
      <circle r={r} fill="#E8E8E8" stroke={P} strokeWidth={CONTORNO} />
      <circle r={r * 0.68} fill={B} stroke={P} strokeWidth={6} />
      <text y={r * 0.22} textAnchor="middle" fontFamily={FONTE.titulo} fontSize={r * 0.75} fill={P}>1</text>
      <text y={r * 0.5} textAnchor="middle" fontFamily={FONTE.rotulo} fontWeight={900} fontSize={r * 0.17} letterSpacing={2} fill={P}>REAL</text>
    </svg>
  ) : null;

// ---------------------------------------------------------------------------------------------
/** Cartão branco (centro x, topo). */
export const Ficha: React.FC<{ x: number; top: number; escala?: number; largura?: number; children: React.ReactNode }> = ({ x, top, escala = 1, largura, children }) =>
  escala > 0.01 ? (
    <div style={{
      position: 'absolute', left: x, top, width: largura, transform: `translateX(-50%) scale(${escala})`, transformOrigin: '50% 0',
      background: B, border: `${CONTORNO}px solid ${P}`, borderRadius: RAIO.caixa, boxShadow: SOMBRA, padding: '18px 30px 16px',
      boxSizing: 'border-box', textAlign: 'center', color: P, whiteSpace: 'nowrap',
    }}>
      {children}
    </div>
  ) : null;
export const Rot: React.FC<{ children: React.ReactNode; tam?: number; cor?: string }> = ({ children, tam = 30, cor = P }) => (
  <div style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: tam, letterSpacing: 2, color: cor, lineHeight: 1.15 }}>{children}</div>
);
export const Num: React.FC<{ children: React.ReactNode; tam?: number; cor?: string }> = ({ children, tam = 64, cor = COR.azul }) => (
  <div style={{ fontFamily: FONTE.numero, fontWeight: 800, fontSize: tam, color: cor, lineHeight: 1.05 }}>{children}</div>
);

// ---------------------------------------------------------------------------------------------
/**
 * Gráfico de disparos: `canais` linhas com picos andando para a esquerda. `ordem` (0 → 1) troca a bagunça por
 * um padrão repetido e alinhado. Centro x, topo.
 */
export const GraficoPicos: React.FC<{ x: number; top: number; frame: number; canais?: number; w?: number; h?: number; escala?: number; ordem?: number; destaque?: number[] }> = ({
  x, top, frame, canais = 6, w = 640, h = 300, escala = 1, ordem = 0, destaque = [],
}) => {
  if (escala <= 0.01) return null;
  const dy = h / (canais + 1);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: 'absolute', left: x - w / 2, top, transform: `scale(${escala})`, transformOrigin: '50% 0', overflow: 'visible' }}>
      <rect x={12} y={12} width={w} height={h} rx={RAIO.caixa} fill={COR.amarelo} />
      <rect width={w} height={h} rx={RAIO.caixa} fill={B} stroke={P} strokeWidth={CONTORNO} />
      {Array.from({ length: canais }, (_, c) => {
        const y0 = dy * (c + 1);
        let d = `M 24 ${y0}`;
        const passo = 6;
        for (let px = 24; px <= w - 24; px += passo) {
          const t = (px + frame * 6) / passo;
          // bagunça: picos em lugares aleatórios; ordem: pico a cada 22 passos, todos os canais juntos
          const ale = rnd(Math.floor(t) * 13 + c * 101) > 0.9 ? 1 : 0;
          const org = Math.floor(t) % 22 === c % 3 ? 1 : 0;
          const pico = ordem > 0.5 ? org : ale;
          d += pico ? ` L ${px} ${y0} L ${px + 2} ${y0 - dy * 0.42} L ${px + 4} ${y0 + dy * 0.18} L ${px + 6} ${y0}` : ` L ${px + passo} ${y0}`;
        }
        return <path key={c} d={d} fill="none" stroke={destaque.includes(c) ? COR.vermelho : P} strokeWidth={4} strokeLinejoin="round" />;
      })}
    </svg>
  );
};

// ---------------------------------------------------------------------------------------------
/** Monitor de contorno (centro x, topo) com conteúdo em svg (viewBox 0 0 w h). */
export const Monitor: React.FC<{ x: number; top: number; w?: number; h?: number; escala?: number; children?: React.ReactNode }> = ({ x, top, w = 560, h = 340, escala = 1, children }) =>
  escala > 0.01 ? (
    <div style={{ position: 'absolute', left: x - w / 2 - 24, top, width: w + 48, transform: `scale(${escala})`, transformOrigin: '50% 0' }}>
      <div style={{ position: 'relative', background: B, border: `${CONTORNO}px solid ${P}`, borderRadius: 26, boxShadow: SOMBRA, padding: 14 }}>
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', border: `6px solid ${P}`, borderRadius: 12, background: '#F2F2F2', boxSizing: 'content-box' }}>
          {children}
        </svg>
      </div>
      <div style={{ margin: '0 auto', width: 60, height: 44, background: B, borderLeft: `${CONTORNO}px solid ${P}`, borderRight: `${CONTORNO}px solid ${P}` }} />
      <div style={{ margin: '0 auto', width: 220, height: 26, background: B, border: `${CONTORNO}px solid ${P}`, borderRadius: 14 }} />
    </div>
  ) : null;

/** Seta de direção numa caixa (saída do decodificador). */
export const CaixaSaida: React.FC<{ x: number; base: number; tipo: 'esq' | 'dir' | 'clique'; escala?: number; acende?: number }> = ({ x, base, tipo, escala = 1, acende = 0 }) => {
  if (escala <= 0.01) return null;
  const txt = tipo === 'esq' ? 'ESQUERDA' : tipo === 'dir' ? 'DIREITA' : 'CLIQUE';
  return (
    <div style={{
      position: 'absolute', left: x, top: base, transform: `translate(-50%, -100%) scale(${escala})`, transformOrigin: '50% 100%',
      width: 230, padding: '12px 0 10px', background: acende > 0.5 ? COR.verde : B, border: `${CONTORNO}px solid ${P}`, borderRadius: RAIO.caixa,
      boxShadow: SOMBRA, textAlign: 'center',
    }}>
      <svg width={80} height={60} viewBox="-40 -30 80 60" style={{ display: 'block', margin: '0 auto' }}>
        {tipo === 'clique' ? <circle r={20} fill={P} /> : (
          <path d={tipo === 'dir' ? 'M -30 0 L 20 0 M 4 -18 L 24 0 L 4 18' : 'M 30 0 L -20 0 M -4 -18 L -24 0 L -4 18'} fill="none" stroke={P} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
      <div style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 28, letterSpacing: 2, color: P, marginTop: 4 }}>{txt}</div>
    </div>
  );
};
