import React from 'react';
import { Easing, interpolate } from 'remotion';
import { JatoAr, RODA_CARRO } from '../components';
import { COR, FONTE, CONTORNO, RAIO, ESTEIRA_Y } from '../theme';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// ---------------------------------------------------------------------------
// A manobra do gancho (reaparece em câmera lenta no bloco 9)
// ---------------------------------------------------------------------------

export const ESC_MANOBRA = 0.7;
const H = RODA_CARRO * ESC_MANOBRA; // centro do carro → base das rodas
export const CHAO_Y = ESTEIRA_Y - H; // centro do carro rodando na esteira
export const POUSO_X = 800;
export const CARRINHOS_X = [350, 420, 490, 560, 630];

// plano 1: loop de montanha-russa
const PARADO_X = 230; // onde o carro espera a largada
export const LOOP_X = 560; // entrada do loop (ponto mais baixo)
const R = 125; // raio do caminho do centro do carro dentro do loop
export const LOOP_CY = CHAO_Y - R;
export const LOOP_RAIO_PISTA = R + H + 9;
const V = 16; // px por frame no loop
const ACEL = 20; // frames até chegar a V

// plano 2: rampa de salto
export const RAMPA = { x0: 90, x1: 290, alt: 90 };
const ANG_RAMPA = Math.atan2(RAMPA.alt, RAMPA.x1 - RAMPA.x0);
const V2 = 24;

/** Momentos da manobra (frames do bloco do gancho), tirados da narração. */
export type TemposManobra = { largada: number; corte: number; mortal: number; pouso: number };

export type EstadoCarro = { plano: 1 | 2; x: number; y: number; rot: number; giro: number; jatos: number[]; rodas: number; sopro: number };

const grau = (r: number) => (r * 180) / Math.PI;

/**
 * Estado do carro no frame f. Plano 1: chega, arranca e faz um loop completo (de cabeça para
 * baixo no topo) e segue para a direita. Plano 2: sobe a rampa, salta os 5 carros, dá o mortal
 * lateral e desce freando com os jatos de baixo até pousar. Sempre com a frente para a direita.
 */
export const manobra = (f: number, t: TemposManobra): EstadoCarro => {
  const jatos = Array(10).fill(0) as number[];
  if (f < t.corte) {
    if (f < t.largada) {
      const x = interpolate(f, [0, 50], [70, PARADO_X], { ...clamp, easing: Easing.out(Easing.cubic) });
      return { plano: 1, x, y: CHAO_Y, rot: 0, giro: 1, jatos, rodas: grau(x / (22 * ESC_MANOBRA)), sopro: 0 };
    }
    const dt = f - t.largada;
    const s = dt < ACEL ? (0.5 * V * dt * dt) / ACEL : (V * ACEL) / 2 + V * (dt - ACEL);
    const arranque = interpolate(dt, [0, 3, 26], [0, 1, 0], clamp);
    jatos[0] = jatos[1] = jatos[2] = arranque;
    const rodas = grau(s / (22 * ESC_MANOBRA));
    const naLoop = s - (LOOP_X - PARADO_X);
    if (naLoop < 0) return { plano: 1, x: PARADO_X + s, y: CHAO_Y, rot: 0, giro: 1, jatos, rodas, sopro: 0 };
    if (naLoop < 2 * Math.PI * R) {
      const th = naLoop / R;
      return { plano: 1, x: LOOP_X + R * Math.sin(th), y: LOOP_CY + R * Math.cos(th), rot: -grau(th), giro: 1, jatos, rodas, sopro: 0 };
    }
    // saiu do loop: os jatos de trás empurram até sair do quadro
    const fSaida = t.largada + ACEL + (LOOP_X - PARADO_X + 2 * Math.PI * R - (V * ACEL) / 2) / V;
    const te = f - fSaida;
    const ac = (2 * (1150 - LOOP_X - V * (t.corte - fSaida))) / (t.corte - fSaida) ** 2;
    jatos[0] = jatos[1] = jatos[2] = interpolate(te, [0, 3], [0, 1], clamp);
    return { plano: 1, x: LOOP_X + V * te + 0.5 * Math.max(0, ac) * te * te, y: CHAO_Y, rot: 0, giro: 1, jatos, rodas, sopro: 0 };
  }
  // plano 2: chega pela esquerda e sobe a rampa
  const s2 = V2 * (f - t.corte) - 240; // 0 = pé da rampa
  const fSobe = t.corte + 240 / V2;
  const lenRampa = (RAMPA.x1 - RAMPA.x0) / Math.cos(ANG_RAMPA);
  const fSalta = fSobe + lenRampa / V2;
  if (f < fSobe) return { plano: 2, x: RAMPA.x0 + s2, y: CHAO_Y, rot: 0, giro: 1, jatos, rodas: f * 50, sopro: 0 };
  if (f < fSalta) {
    const a = Math.min(1, (f - fSobe) / 2); // dobra a quina da rampa
    return { plano: 2, x: RAMPA.x0 + s2 * Math.cos(ANG_RAMPA), y: CHAO_Y - s2 * Math.sin(ANG_RAMPA), rot: -grau(ANG_RAMPA) * a, giro: 1, jatos, rodas: f * 50, sopro: 0 };
  }
  // no ar
  const yIni = CHAO_Y - RAMPA.alt;
  const u = Math.min(1, (f - fSalta) / (t.pouso - fSalta));
  const vx = V2 * Math.cos(ANG_RAMPA);
  const k = (vx * (t.pouso - fSalta)) / (POUSO_X - RAMPA.x1);
  const x = RAMPA.x1 + (POUSO_X - RAMPA.x1) * (1 - (1 - u) ** k);
  const pico = fSalta + 16;
  const desce = t.pouso - 30;
  const y =
    f < pico
      ? interpolate(f, [fSalta, pico], [yIni, 650], { ...clamp, easing: Easing.out(Easing.quad) })
      : f < desce
        ? interpolate(f, [pico, desce], [650, 735], { ...clamp, easing: Easing.inOut(Easing.quad) })
        : interpolate(f, [desce, t.pouso], [735, CHAO_Y], { ...clamp, easing: Easing.out(Easing.cubic) });
  // mortal lateral: uma volta inteira em torno do próprio eixo
  const ug = interpolate(f, [t.mortal, t.mortal + 26], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const giro = Math.cos(2 * Math.PI * ug);
  const rot = interpolate(f, [fSalta, fSalta + 14, desce, desce + 8, t.pouso, t.pouso + 6], [-grau(ANG_RAMPA), 0, 0, -4, -4, 0], clamp);
  const freio = interpolate(f, [fSalta + 4, fSalta + 8, t.mortal - 4, t.mortal], [0, 0.8, 0.8, 0], clamp);
  const gira = interpolate(f, [t.mortal, t.mortal + 3, t.mortal + 22, t.mortal + 26], [0, 0.8, 0.8, 0], clamp);
  const pousa = interpolate(f, [desce - 4, desce + 2, t.pouso, t.pouso + 10], [0, 1, 1, 0], clamp);
  [3, 4, 5, 6].forEach((i) => (jatos[i] = pousa));
  jatos[9] = freio;
  jatos[3] = Math.max(jatos[3], gira);
  jatos[7] = gira;
  // o ar dos jatos de baixo só bate no chão perto do pouso
  const sopro = pousa * interpolate(y, [CHAO_Y - 120, CHAO_Y], [0, 1], clamp);
  return { plano: 2, x, y, rot, giro, jatos, rodas: 0, sopro };
};

/** O loop do plano 1: pista circular apoiada no chão, com dois pés. */
export const PistaLoop: React.FC = () => (
  <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} fill="none" strokeLinecap="round">
    {[-1, 1].map((l) => (
      <line key={l} x1={LOOP_X + l * LOOP_RAIO_PISTA * 0.7} y1={LOOP_CY + LOOP_RAIO_PISTA * 0.7} x2={LOOP_X + l * (LOOP_RAIO_PISTA + 40)} y2={ESTEIRA_Y} stroke={COR.preto} strokeWidth={6} opacity={0.45} />
    ))}
    <circle cx={LOOP_X} cy={LOOP_CY} r={LOOP_RAIO_PISTA} stroke={COR.preto} strokeWidth={18} />
  </svg>
);

/** Rampa de salto do plano 2 (cunha branca com contorno). */
export const RampaSalto: React.FC = () => (
  <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
    <polygon points={`${RAMPA.x0},${ESTEIRA_Y} ${RAMPA.x1},${ESTEIRA_Y - RAMPA.alt} ${RAMPA.x1},${ESTEIRA_Y}`} fill={COR.branco} stroke={COR.preto} strokeWidth={CONTORNO} strokeLinejoin="round" />
  </svg>
);

/** O ar dos jatos batendo no chão no pouso: traços que correm para os lados (sem nuvem). */
export const SoproChao: React.FC<{ x: number; p: number; frame: number }> = ({ x, p, frame }) => {
  if (p < 0.02) return null;
  return (
    <svg width={1080} height={60} style={{ position: 'absolute', left: x - 540, top: ESTEIRA_Y - 40, overflow: 'visible', opacity: Math.min(1, p * 1.5) }} strokeLinecap="round">
      {[-1, 1].flatMap((lado) =>
        [0, 1].map((k) => {
          const corre = ((frame * 9 + k * 40) % 80) / 80;
          const x0 = 540 + lado * (70 + corre * 90 * p);
          return <line key={`${lado}-${k}`} x1={x0} y1={18 + k * 14} x2={x0 + lado * 34 * p} y2={18 + k * 14} stroke={COR.preto} strokeWidth={6} />;
        }),
      )}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Peças das outras cenas
// ---------------------------------------------------------------------------

/** Telinha de vídeo: carro pequeno rodando numa estrada. Centro x, topo. */
export const Telinha: React.FC<{ x: number; top: number; anda: number; escala: number; largura?: number }> = ({ x, top, anda, escala, largura = 190 }) => {
  if (escala < 0.01) return null;
  const alt = largura * 0.62;
  const cx = ((anda % (largura + 60)) + largura + 60) % (largura + 60) - 30;
  return (
    <div style={{ position: 'absolute', left: x - largura / 2, top, width: largura, height: alt, transform: `scale(${escala})`, background: COR.branco, border: `8px solid ${COR.preto}`, borderRadius: 16, overflow: 'hidden', boxSizing: 'border-box' }}>
      <svg width={largura} height={alt} style={{ position: 'absolute', left: -8, top: -8 }}>
        <line x1={0} y1={alt * 0.72} x2={largura} y2={alt * 0.72} stroke={COR.preto} strokeWidth={6} />
        {[0, 1, 2, 3].map((i) => <line key={i} x1={((i * 60 - anda * 0.6) % 240 + 240) % 240 - 20} y1={alt * 0.86} x2={((i * 60 - anda * 0.6) % 240 + 240) % 240 + 10} y2={alt * 0.86} stroke={COR.preto} strokeWidth={4} />)}
        <g transform={`translate(${cx} ${alt * 0.72 - 13}) scale(0.16)`}>
          <path d="M164 22 L164 4 Q160 -4 140 -6 L44 -18 Q14 -50 -30 -50 Q-100 -48 -150 -26 L-164 -22 L-164 22 Z" fill={COR.branco} stroke={COR.preto} strokeWidth={30} strokeLinejoin="round" />
          <circle cx={-100} cy={30} r={26} fill={COR.preto} />
          <circle cx={104} cy={30} r={26} fill={COR.preto} />
        </g>
      </svg>
    </div>
  );
};

/** Botão do painel de 10 jatos (o humano se embola). */
export const PainelBotoes: React.FC<{ x: number; top: number; acesos: boolean[]; escala: number }> = ({ x, top, acesos, escala }) => {
  if (escala < 0.01) return null;
  return (
    <div style={{ position: 'absolute', left: x, top, transform: `translateX(-50%) scale(${escala})`, transformOrigin: '50% 100%', background: COR.branco, border: `${CONTORNO}px solid ${COR.preto}`, borderRadius: RAIO.maquina, padding: '22px 26px 16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 62px)', gap: 18 }}>
        {acesos.map((on, i) => (
          <div key={i} style={{ width: 62, height: 62, borderRadius: 31, border: `8px solid ${COR.preto}`, background: on ? COR.preto : COR.branco, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTE.numero, fontWeight: 800, fontSize: 24, color: on ? COR.branco : COR.azul }}>
            {i + 1}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, textAlign: 'center', fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 28, letterSpacing: 2, color: COR.preto }}>10 JATOS</div>
    </div>
  );
};

/** Foguete genérico de traço que pousa de pé, com pernas e jato de ar embaixo. Centro x e base (pés). */
export const Foguete: React.FC<{ x: number; base: number; jato: number; escala?: number; rot?: number; frame: number }> = ({ x, base, jato, escala = 1, rot = 0, frame }) => {
  if (escala < 0.01) return null;
  return (
    <svg width={200} height={420} viewBox="-100 -380 200 420" style={{ position: 'absolute', left: x - 100, top: base - 380, transform: `scale(${escala}) rotate(${rot}deg)`, transformOrigin: '50% 90%', overflow: 'visible' }} strokeLinejoin="round" strokeLinecap="round">
      <JatoAr x={0} y={-30} a={90} v={jato} sw={10} semente={frame} comprimento={110} />
      <path d="M-34 -300 Q0 -380 34 -300 L34 -40 L-34 -40 Z" fill={COR.branco} stroke={COR.preto} strokeWidth={CONTORNO} />
      <line x1={-34} y1={-250} x2={34} y2={-250} stroke={COR.preto} strokeWidth={6} />
      <path d="M-34 -40 L-74 0 M34 -40 L74 0" fill="none" stroke={COR.preto} strokeWidth={CONTORNO} />
      <rect x={-20} y={-44} width={40} height={20} rx={4} fill={COR.preto} />
    </svg>
  );
};

/** Prateleira de traço com 3 andares: cheia de fitas de vídeo ou vazia (contornos tracejados). Centro x e base. */
export const Prateleira: React.FC<{ x: number; base: number; rotulo: string; cheia: number; escala?: number; treme?: number }> = ({ x, base, rotulo, cheia, escala = 1, treme = 0 }) => {
  if (escala < 0.01) return null;
  const L = 320;
  const A = 300;
  const andares = [0, 1, 2];
  return (
    <div style={{ position: 'absolute', left: x - L / 2, top: base - A, width: L, height: A, transform: `scale(${escala}) translateX(${treme * 10}px)`, transformOrigin: '50% 100%' }}>
      <svg width={L} height={A} style={{ position: 'absolute', left: 0, top: 0 }} strokeLinecap="round">
        <line x1={8} y1={0} x2={8} y2={A} stroke={COR.preto} strokeWidth={CONTORNO} />
        <line x1={L - 8} y1={0} x2={L - 8} y2={A} stroke={COR.preto} strokeWidth={CONTORNO} />
        {andares.map((i) => <line key={i} x1={8} y1={(i + 1) * 92} x2={L - 8} y2={(i + 1) * 92} stroke={COR.preto} strokeWidth={CONTORNO} />)}
        {andares.flatMap((i) =>
          [0, 1, 2, 3, 4].map((k) => {
            const on = k + i * 5 < cheia * 15;
            return (
              <rect key={`${i}-${k}`} x={26 + k * 56} y={(i + 1) * 92 - 66} width={42} height={60} rx={6} fill={on ? COR.branco : 'none'} stroke={COR.preto} strokeWidth={on ? 6 : 4} strokeDasharray={on ? undefined : '8 8'} opacity={on ? 1 : 0.35} />
            );
          }),
        )}
      </svg>
      <div style={{ position: 'absolute', left: '50%', top: -56, transform: 'translateX(-50%)', background: COR.preto, color: COR.amarelo, borderRadius: 12, padding: '6px 18px 2px', fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 28, letterSpacing: 2, whiteSpace: 'nowrap' }}>{rotulo}</div>
    </div>
  );
};
