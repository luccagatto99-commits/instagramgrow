import React from 'react';
import { useCurrentFrame } from 'remotion';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA, ESTEIRA_Y } from '../theme';

const P = COR.preto;

/** Posições simétricas em volta do centro (radar A à esquerda, radar B à direita). */
export const RADAR_A = 325;
export const RADAR_B = 755;
export const LENTE_Y = 640; // altura da câmera no poste
export const PLACA = 'BRA2E19';

/** Escala do carro de lado sobre a esteira e o y do centro dele. */
export const CARRO_ESC = 0.9;
export const CARRO_Y = ESTEIRA_Y - 46 * CARRO_ESC;

/**
 * Radar de lado: poste branco de contorno e, no alto, a câmera virada para a esquerda (de onde vêm
 * os carros), com o anel de luz infravermelha em volta da lente. `flash` 0 → 1 acende o anel.
 * Posicionado pelo x do poste; `filhos` ficam presos no poste (ex.: placa EM TESTE).
 */
export const Radar: React.FC<{ x: number; flash?: number; opacidade?: number; escala?: number; children?: React.ReactNode }> = ({ x, flash = 0, opacidade = 1, escala = 1, children }) => {
  if (opacidade < 0.01 || escala < 0.01) return null;
  const y = LENTE_Y;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: opacidade, transform: `scale(${escala})`, transformOrigin: `${x}px ${ESTEIRA_Y}px` }}>
      <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} strokeLinejoin="round">
        {/* poste e base */}
        <rect x={x - 14} y={y + 20} width={28} height={ESTEIRA_Y - y - 20} fill={COR.branco} stroke={P} strokeWidth={8} />
        <rect x={x - 44} y={ESTEIRA_Y - 22} width={88} height={22} rx={6} fill={COR.branco} stroke={P} strokeWidth={8} />
        {/* sombra dura da câmera */}
        <rect x={x - 116} y={y - 34} width={150} height={78} rx={18} fill={`var(--sombra, ${P})`} />
        {/* corpo da câmera e aba de sol */}
        <rect x={x - 130} y={y - 48} width={150} height={78} rx={18} fill={COR.branco} stroke={P} strokeWidth={CONTORNO} />
        <path d={`M${x - 150} ${y - 58} L${x + 30} ${y - 58}`} stroke={P} strokeWidth={CONTORNO} strokeLinecap="round" />
        {/* anel de LEDs infravermelhos em volta da lente */}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return <circle key={i} cx={x - 92 + Math.cos(a) * 28} cy={y - 9 + Math.sin(a) * 28} r={6} fill={flash > 0.05 ? COR.vermelho : COR.branco} stroke={P} strokeWidth={3} opacity={flash > 0.05 ? 0.4 + 0.6 * flash : 1} />;
        })}
        <circle cx={x - 92} cy={y - 9} r={17} fill={P} />
        <circle cx={x - 97} cy={y - 14} r={5} fill={COR.branco} />
      </svg>
      {children}
    </div>
  );
};

/** Lente do radar (origem do feixe). */
export const lenteRadar = (x: number): [number, number] => [x - 108, LENTE_Y - 9];

/**
 * Placa Mercosul: faixa azul com BRASIL e os caracteres pretos. `lidas` = quantos caracteres a IA
 * já leu (ficam azuis, um a um); `cursor` mostra a moldura de leitura no próximo caractere.
 */
export const PlacaMercosul: React.FC<{ x: number; top: number; texto?: string; lidas?: number; escala?: number; largura?: number }> = ({
  x, top, texto = PLACA, lidas = 0, escala = 1, largura = 520,
}) => {
  if (escala < 0.01) return null;
  const n = texto.length;
  const passo = (largura - 60) / n;
  return (
    <div style={{ position: 'absolute', left: x, top, transform: `translateX(-50%) scale(${escala})`, transformOrigin: '50% 0%' }}>
      <div style={{ width: largura, background: COR.branco, border: `${CONTORNO}px solid ${P}`, borderRadius: RAIO.caixa, boxShadow: SOMBRA, overflow: 'hidden' }}>
        <div style={{ height: 40, background: COR.azul, borderBottom: `6px solid ${P}`, color: COR.branco, fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 24, letterSpacing: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>BRASIL</div>
        <div style={{ position: 'relative', height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {texto.split('').map((c, i) => {
            const lida = lidas >= i + 1;
            const atual = Math.floor(lidas) === i && lidas < n;
            return (
              <div
                key={i}
                style={{
                  width: passo,
                  textAlign: 'center',
                  fontFamily: FONTE.numero,
                  fontWeight: 800,
                  fontSize: 96,
                  lineHeight: 1,
                  color: lida ? COR.azul : P,
                  outline: atual ? `6px solid ${COR.azul}` : 'none',
                  outlineOffset: -2,
                  borderRadius: 8,
                }}
              >
                {c}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/**
 * Carro de frente (genérico, sem marca): para-brisa, faróis, grade, placa e rodas. Dentro do
 * para-brisa pode ir o motorista (`motorista`), com celular na mão (`celular`) e cinto (`cinto`).
 * Centro x e base (chão). Medidas locais: 460 × 330.
 */
export const CarroFrente: React.FC<{ x: number; base: number; escala?: number; motorista?: boolean; celular?: boolean; cinto?: boolean; placa?: string; opacidade?: number }> = ({
  x, base, escala = 1, motorista = false, celular = false, cinto = false, placa = PLACA, opacidade = 1,
}) => {
  if (escala < 0.01 || opacidade < 0.01) return null;
  const sw = CONTORNO / Math.max(0.6, escala);
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: opacidade }} strokeLinejoin="round" strokeLinecap="round">
      <g transform={`translate(${x} ${base}) scale(${escala})`}>
        {/* rodas */}
        {[-160, 160].map((rx) => (
          <rect key={rx} x={rx - 36} y={-50} width={72} height={50} rx={14} fill={P} />
        ))}
        {/* sombra dura */}
        <path d="M-206 -46 L-206 -170 Q-200 -196 -170 -204 L-130 -300 Q-122 -316 -100 -316 L100 -316 Q122 -316 130 -300 L170 -204 Q200 -196 206 -170 L206 -46 Z" fill={`var(--sombra, ${P})`} transform="translate(16 14)" />
        {/* carroceria */}
        <path d="M-206 -46 L-206 -170 Q-200 -196 -170 -204 L-130 -300 Q-122 -316 -100 -316 L100 -316 Q122 -316 130 -300 L170 -204 Q200 -196 206 -170 L206 -46 Z" fill={COR.branco} stroke={P} strokeWidth={sw} />
        {/* retrovisores */}
        {[-1, 1].map((s) => (
          <rect key={s} x={s > 0 ? 176 : -216} y={-232} width={40} height={28} rx={8} fill={COR.branco} stroke={P} strokeWidth={sw * 0.7} />
        ))}
        {/* para-brisa */}
        <path d="M-150 -208 L-114 -292 L114 -292 L150 -208 Z" fill={COR.branco} stroke={P} strokeWidth={sw * 0.8} />
        {motorista ? <Motorista celular={celular} cinto={cinto} sw={sw} /> : null}
        {/* faróis e grade */}
        {[-1, 1].map((s) => (
          <g key={s}>
            <rect x={s > 0 ? 112 : -182} y={-168} width={70} height={36} rx={14} fill={COR.branco} stroke={P} strokeWidth={sw * 0.7} />
            <circle cx={s * 128} cy={-150} r={9} fill={P} />
          </g>
        ))}
        <rect x={-86} y={-166} width={172} height={30} rx={12} fill={P} />
        {/* placa */}
        <rect x={-92} y={-118} width={184} height={54} rx={8} fill={COR.branco} stroke={P} strokeWidth={sw * 0.6} />
        <rect x={-92} y={-118} width={184} height={14} rx={4} fill={COR.azul} />
        <text x={0} y={-72} textAnchor="middle" fontFamily={FONTE.numero} fontWeight={800} fontSize={34} fill={P}>
          {placa}
        </text>
      </g>
    </svg>
  );
};

/** Motorista visto pelo para-brisa (coordenadas do CarroFrente): cabeça, ombros, volante. */
const Motorista: React.FC<{ celular: boolean; cinto: boolean; sw: number }> = ({ celular, cinto, sw }) => (
  <g>
    {/* banco */}
    <path d="M-10 -208 L-10 -262 Q-10 -280 8 -280 L56 -280 Q74 -280 74 -262 L74 -208" fill={COR.branco} stroke={P} strokeWidth={sw * 0.5} />
    {/* ombros e cabeça: no Brasil o motorista fica à direita de quem vê o carro de frente */}
    <path d="M-4 -208 Q-2 -238 32 -240 Q66 -238 68 -208 Z" fill={COR.branco} stroke={P} strokeWidth={sw * 0.6} />
    <circle cx={32} cy={-258} r={20} fill={COR.branco} stroke={P} strokeWidth={sw * 0.6} />
    {cinto ? <line x1={60} y1={-238} x2={8} y2={-210} stroke={P} strokeWidth={sw * 0.8} /> : null}
    {/* volante */}
    <path d="M6 -208 Q32 -226 58 -208" fill="none" stroke={P} strokeWidth={sw * 0.6} />
    {celular ? (
      <g>
        <line x1={-2} y1={-220} x2={2} y2={-250} stroke={P} strokeWidth={sw * 0.5} />
        <rect x={-6} y={-276} width={18} height={30} rx={4} fill={P} />
      </g>
    ) : null}
  </g>
);

/** Partes do motorista (coordenadas locais do CarroFrente) para as molduras da IA. */
export const ALVO_CELULAR = { x: 3, y: -261, w: 44, h: 52 };
export const ALVO_PEITO = { x: 32, y: -224, w: 92, h: 40 };

/** Moldura de detecção da IA (vermelha = infração; azul = dado, como a placa) com o rótulo em cima. Coordenadas da tela. */
export const Deteccao: React.FC<{ cx: number; cy: number; w: number; h: number; texto: string; p: number; lado?: 'esq' | 'dir'; cor?: string }> = ({ cx, cy, w, h, texto, p, lado = 'esq', cor = COR.vermelho }) => {
  const frame = useCurrentFrame();
  if (p < 0.02) return null;
  const s = 0.6 + 0.4 * Math.min(1, p);
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: cx - (w * s) / 2,
          top: cy - (h * s) / 2,
          width: w * s,
          height: h * s,
          border: `6px solid ${cor}`,
          borderRadius: 10,
          opacity: Math.min(1, p) * (0.85 + 0.15 * Math.sin(frame / 3)),
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: lado === 'esq' ? cx - w / 2 - 14 : cx + w / 2 + 14,
          top: cy - h / 2 - 66,
          transform: `translateX(${lado === 'esq' ? '-100%' : '0'}) scale(${Math.min(1, p)})`,
          transformOrigin: lado === 'esq' ? '100% 100%' : '0% 100%',
          background: cor,
          color: COR.branco,
          border: `5px solid ${P}`,
          borderRadius: 12,
          padding: '6px 16px 3px',
          fontFamily: FONTE.rotulo,
          fontWeight: 900,
          fontSize: 30,
          letterSpacing: 2,
          whiteSpace: 'nowrap',
        }}
      >
        {texto}
      </div>
    </>
  );
};

/** Placa de limite de velocidade: círculo branco com anel vermelho e o número. Centro x/y. */
export const PlacaLimite: React.FC<{ x: number; y: number; r?: number; valor: number; escala?: number }> = ({ x, y, r = 86, valor, escala = 1 }) =>
  escala > 0.01 ? (
    <svg width={r * 2 + 40} height={r * 2 + 40} viewBox={`${-r - 20} ${-r - 20} ${r * 2 + 40} ${r * 2 + 40}`} style={{ position: 'absolute', left: x - r - 20, top: y - r - 20, transform: `scale(${escala})`, overflow: 'visible' }}>
      <circle cx={12} cy={12} r={r} fill={`var(--sombra, ${P})`} />
      <circle r={r} fill={COR.branco} stroke={P} strokeWidth={8} />
      <circle r={r - 16} fill={COR.branco} stroke={COR.vermelho} strokeWidth={22} />
      <text y={r * 0.26} textAnchor="middle" fontFamily={FONTE.titulo} fontSize={r * 0.74} fill={P}>
        {valor}
      </text>
    </svg>
  ) : null;

/**
 * Cartão de registro do radar: placa e hora (em azul, são dados). Centro x e topo.
 * `rotulo` pequeno, em preto, na primeira linha do cartão.
 */
export const Registro: React.FC<{ x: number; top: number; linhas: string[]; rotulo?: string; escala?: number; largura?: number }> = ({ x, top, linhas, rotulo, escala = 1, largura = 290 }) =>
  escala > 0.01 ? (
    <div style={{ position: 'absolute', left: x, top, transform: `translateX(-50%) scale(${escala})`, transformOrigin: '50% 100%' }}>
      <div style={{ width: largura, background: COR.branco, border: `${CONTORNO}px solid ${P}`, borderRadius: RAIO.caixa, boxShadow: SOMBRA, padding: '10px 0 6px' }}>
        {rotulo ? <div style={{ textAlign: 'center', fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 26, letterSpacing: 3, color: P, lineHeight: 1 }}>{rotulo}</div> : null}
        {linhas.map((l, i) => (
          <div key={i} style={{ textAlign: 'center', fontFamily: FONTE.numero, fontWeight: 800, fontSize: 46, lineHeight: 1.15, color: COR.azul }}>
            {l}
          </div>
        ))}
      </div>
    </div>
  ) : null;

/** Cota entre dois pontos (linha com batentes) e o valor num selo azul no meio. */
export const Cota: React.FC<{ x1: number; x2: number; y: number; texto: string; p: number }> = ({ x1, x2, y, texto, p }) => {
  if (p < 0.02) return null;
  const meio = (x1 + x2) / 2;
  const meia = ((x2 - x1) / 2) * Math.min(1, p);
  return (
    <>
      <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} strokeLinecap="round">
        <line x1={meio - meia} y1={y} x2={meio + meia} y2={y} stroke="var(--tinta)" strokeWidth={6} strokeDasharray="18 12" />
        {p > 0.9 ? (
          <>
            <line x1={x1} y1={y - 22} x2={x1} y2={y + 22} stroke="var(--tinta)" strokeWidth={6} />
            <line x1={x2} y1={y - 22} x2={x2} y2={y + 22} stroke="var(--tinta)" strokeWidth={6} />
          </>
        ) : null}
      </svg>
      <div
        style={{
          position: 'absolute',
          left: meio,
          top: y - 32,
          transform: `translateX(-50%) scale(${Math.min(1, p)})`,
          background: COR.azul,
          color: COR.branco,
          border: `5px solid ${P}`,
          borderRadius: 999,
          padding: '4px 22px 1px',
          fontFamily: FONTE.numero,
          fontWeight: 800,
          fontSize: 40,
          whiteSpace: 'nowrap',
        }}
      >
        {texto}
      </div>
    </>
  );
};

/** Carro de lado sobre a esteira (rodas girando conforme anda). */
export const rodas = (x: number) => (x / (22 * CARRO_ESC)) * (180 / Math.PI);

/**
 * Câmera do radar vista de frente, grande: corpo branco, aba de sol, lente no meio e o anel de LEDs
 * infravermelhos (`luz` 0 → 1 acende em vermelho). Suporte até a esteira. Centro x/y do corpo.
 */
export const CameraGrande: React.FC<{ x: number; y: number; luz?: number; escala?: number; opacidade?: number }> = ({ x, y, luz = 0, escala = 1, opacidade = 1 }) => {
  if (escala < 0.01 || opacidade < 0.01) return null;
  const w = 400;
  const h = 250;
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: opacidade }} strokeLinejoin="round" strokeLinecap="round">
      <g transform={`translate(${x} ${y}) scale(${escala})`}>
        <rect x={-18} y={h / 2} width={36} height={ESTEIRA_Y - y - h / 2} fill={COR.branco} stroke={P} strokeWidth={8} />
        <rect x={-w / 2 + 20} y={-h / 2 + 20} width={w} height={h} rx={RAIO.maquina} fill={`var(--sombra, ${P})`} />
        <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={RAIO.maquina} fill={COR.branco} stroke={P} strokeWidth={CONTORNO} />
        <path d={`M${-w / 2 - 24} ${-h / 2 - 16} L${w / 2 + 24} ${-h / 2 - 16}`} stroke={P} strokeWidth={14} />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const acesa = luz > 0.05;
          return <circle key={i} cx={Math.cos(a) * 88} cy={Math.sin(a) * 88} r={13} fill={acesa ? COR.vermelho : COR.branco} stroke={P} strokeWidth={5} opacity={acesa ? 0.35 + 0.65 * luz : 1} />;
        })}
        <circle r={58} fill={P} />
        <circle r={30} fill={COR.branco} stroke={P} strokeWidth={6} opacity={0.25} />
        <circle cx={-18} cy={-18} r={10} fill={COR.branco} />
      </g>
    </svg>
  );
};

/** Sol de traço (dia). Centro x/y. */
export const Sol: React.FC<{ x: number; y: number; escala?: number }> = ({ x, y, escala = 1 }) =>
  escala > 0.01 ? (
    <svg width={200} height={200} viewBox="-100 -100 200 200" style={{ position: 'absolute', left: x - 100, top: y - 100, transform: `scale(${escala})`, overflow: 'visible' }} strokeLinecap="round">
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return <line key={i} x1={Math.cos(a) * 58} y1={Math.sin(a) * 58} x2={Math.cos(a) * 82} y2={Math.sin(a) * 82} stroke={COR.branco} strokeWidth={10} />;
      })}
      <circle r={42} fill={COR.branco} stroke={P} strokeWidth={8} />
    </svg>
  ) : null;

/** Lua crescente de traço (noite). Centro x/y. */
export const Lua: React.FC<{ x: number; y: number; escala?: number }> = ({ x, y, escala = 1 }) =>
  escala > 0.01 ? (
    <svg width={200} height={200} viewBox="-100 -100 200 200" style={{ position: 'absolute', left: x - 100, top: y - 100, transform: `scale(${escala})`, overflow: 'visible' }}>
      <path d="M20 -66 A70 70 0 1 0 66 20 A54 54 0 1 1 20 -66 Z" fill={COR.branco} stroke={P} strokeWidth={8} strokeLinejoin="round" />
    </svg>
  ) : null;
