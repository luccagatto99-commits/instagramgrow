import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Cadeado, Celular, CELULAR, Rosto3D, Visto } from '../components';
import { COR, CONTORNO, FONTE, RAIO, SOMBRA } from '../theme';

const P = COR.preto;

// ─── Composição fixa ─────────────────────────────────────────────────────────────
// Rosto à esquerda e celular à direita, à mesma distância do centro (x = 540), os dois retos,
// apoiados na esteira. Quando um sai, o outro vai para o meio.
export const ROSTO = { x: 325, y: 735, R: 108 };
export const FONE = { x: 755, base: 1000, escala: 0.8 };
/** Topo do celular (lentes), para um celular reto em (x, base) com `escala`. */
const topo = (x: number, base: number, escala: number) => base - (CELULAR.h - 30) * escala;
/** Lente do projetor (vermelha, à esquerda do alto-falante) e da câmera infravermelha (à direita). */
export const lentes = (x = FONE.x, base = FONE.base, escala = FONE.escala) => ({
  projetor: [x - 50 * escala, topo(x, base, escala)] as [number, number],
  camera: [x + 50 * escala, topo(x, base, escala)] as [number, number],
});

/** Fundo da tela: cadeado (abre 0 → 1) e selo ✓/✗ embaixo. */
export const TelaCadeado: React.FC<{ abre?: number; visto?: number; ok?: boolean; treme?: number }> = ({ abre = 0, visto = 0, ok = true, treme = 0 }) => {
  const frame = useCurrentFrame();
  const dx = treme * Math.sin(frame * 2.1) * 8;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', inset: 0, transform: `translateX(${dx}px)` }}>
        <Cadeado x={95} y={130} tamanho={96} abertura={abre} />
      </div>
      {visto > 0.01 ? <Visto x={95} y={272} r={42} ok={ok} escala={visto} /> : null}
    </div>
  );
};

/** Tela de senha: quatro bolinhas e uma digital de traço. `preenche` 0 → 4 bolinhas. */
export const TelaSenha: React.FC<{ preenche: number }> = ({ preenche }) => (
  <div style={{ position: 'absolute', inset: 0 }}>
    <div style={{ position: 'absolute', top: 70, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 16 }}>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{ width: 26, height: 26, borderRadius: 13, border: `5px solid ${P}`, boxSizing: 'border-box', background: preenche > i ? P : COR.branco }} />
      ))}
    </div>
    <svg width={110} height={130} viewBox="0 0 110 130" style={{ position: 'absolute', left: 40, top: 160 }}>
      {[0, 1, 2, 3, 4].map((k) => {
        const rx = 10 + k * 10;
        const ry = 14 + k * 12;
        return <path key={k} d={`M${55 - rx} ${80 + k * 4} V70 A${rx} ${ry} 0 0 1 ${55 + rx} 70 V${80 + k * 4}`} fill="none" stroke={P} strokeWidth={6} strokeLinecap="round" />;
      })}
    </svg>
  </div>
);

/**
 * Celular genérico (sem marca), reto, com duas lentes no topo: o projetor (vermelho quando ligado) e a
 * câmera infravermelha (pisca em `clique`). `comum` = só uma lente comum (celular sem os pontos).
 */
export const CelularRosto: React.FC<{
  x?: number;
  base?: number;
  escala?: number;
  projetor?: boolean;
  clique?: number;
  comum?: boolean;
  children?: React.ReactNode;
}> = ({ x = FONE.x, base = FONE.base, escala = FONE.escala, projetor = true, clique = -99, comum = false, children }) => {
  const frame = useCurrentFrame();
  const l = lentes(x, base, escala);
  const flash = frame >= clique && frame < clique + 6;
  const lente = (p: [number, number], cor: string, k: string) => (
    <svg key={k} width={40} height={40} viewBox="-20 -20 40 40" style={{ position: 'absolute', left: p[0] - 20, top: p[1] - 20, overflow: 'visible' }}>
      <circle r={11} fill={cor} stroke={P} strokeWidth={5} />
    </svg>
  );
  return (
    <>
      <Celular x={x} base={base} escala={escala}>
        {children}
      </Celular>
      {comum
        ? lente([x, l.camera[1]], COR.branco, 'c')
        : [lente(l.projetor, projetor ? COR.vermelho : COR.branco, 'p'), lente(l.camera, flash ? COR.vermelho : P, 'c')]}
    </>
  );
};

/**
 * Feixe do projetor: linhas tracejadas vermelhas da lente até o rosto, em leque fechado,
 * com os traços andando para o rosto. `abre` 0 → 1 estica as linhas.
 */
export const FeixeIR: React.FC<{ de: [number, number]; alvo: [number, number]; altura: number; abre?: number; opacidade?: number }> = ({ de, alvo, altura, abre = 1, opacidade = 1 }) => {
  const frame = useCurrentFrame();
  if (abre <= 0.01 || opacidade <= 0.01) return null;
  const n = 7;
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: opacidade }}>
      {Array.from({ length: n }).map((_, i) => {
        const ay = alvo[1] - altura / 2 + (altura * i) / (n - 1);
        return (
          <line
            key={i}
            x1={de[0]}
            y1={de[1]}
            x2={de[0] + (alvo[0] - de[0]) * abre}
            y2={de[1] + (ay - de[1]) * abre}
            stroke={COR.vermelho}
            strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray="16 14"
            strokeDashoffset={frame * 3}
          />
        );
      })}
    </svg>
  );
};

/** Pescoço e ombros de traço sob o rosto (busto de manequim sobre a esteira). */
export const Busto: React.FC<{ x: number; yRosto: number; R: number; base?: number; opacidade?: number }> = ({ x, yRosto, R, base = 1000, opacidade = 1 }) => {
  const larg = R * 1.5;
  const pesc = R * 0.4;
  const topoB = yRosto + R * 0.9;
  const ombro = base - R * 0.6;
  const d = `M${x - pesc} ${topoB} L${x - pesc} ${ombro - 10} Q${x - larg * 0.92} ${ombro - 6} ${x - larg} ${base} L${x + larg} ${base} Q${x + larg * 0.92} ${ombro - 6} ${x + pesc} ${ombro - 10} L${x + pesc} ${topoB} Z`;
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: opacidade }}>
      <path d={d} transform="translate(16 16)" fill={`var(--sombra, ${P})`} />
      <path d={d} fill={COR.branco} stroke={P} strokeWidth={8} strokeLinejoin="round" />
    </svg>
  );
};

/** Haste reta com base, que segura a foto de pé na esteira. */
export const Suporte: React.FC<{ x: number; de: number; base?: number }> = ({ x, de, base = 1000 }) => (
  <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
    <rect x={x - 14} y={de} width={28} height={base - de - 18} fill={COR.branco} stroke={P} strokeWidth={7} />
    <rect x={x - 80} y={base - 24} width={160} height={24} rx={10} fill={COR.branco} stroke={P} strokeWidth={7} />
  </svg>
);

/** Foto impressa de um rosto: cartão reto com o rosto achatado. Gira em volta do eixo vertical (de lado vira linha). */
export const Foto3D: React.FC<{ x: number; y: number; R: number; giro?: number; malha?: number; pontos?: number; varredura?: number; id: string }> = ({
  x, y, R, giro = 0, malha = 0, pontos = 0, varredura = 9, id,
}) => {
  const D = 5;
  const cs = [[-1.3, -1.6], [1.3, -1.6], [1.3, 1.55], [-1.3, 1.55]].map(([cx, cy]) => {
    const xr = cx * Math.cos((giro * Math.PI) / 180);
    const zr = -cx * Math.sin((giro * Math.PI) / 180);
    const k = D / (D - zr);
    return `${(xr * R * k).toFixed(1)},${(cy * R * k).toFixed(1)}`;
  });
  const S = R * 2;
  return (
    <div style={{ position: 'absolute', left: x, top: y }}>
      <svg width={S * 2} height={S * 2} viewBox={`${-S} ${-S} ${S * 2} ${S * 2}`} style={{ position: 'absolute', left: -S, top: -S, overflow: 'visible' }}>
        <polygon points={cs.join(' ')} transform="translate(14 14)" fill={`var(--sombra, ${P})`} />
        <polygon points={cs.join(' ')} fill={COR.branco} stroke={P} strokeWidth={8} strokeLinejoin="round" />
      </svg>
      <Rosto3D id={id} x={0} y={-R * 0.05} R={R * 0.82} giro={giro} plano={1} sombra={false} malha={malha} pontos={pontos} varredura={varredura} />
    </div>
  );
};

/** Etiqueta curta (placa branca de traço). Centro x, topo. */
export const Etiqueta: React.FC<{ x: number; top: number; texto: string; cor?: string; escala?: number }> = ({ x, top, texto, cor = COR.branco, escala = 1 }) =>
  escala > 0.01 ? (
    <div
      style={{
        position: 'absolute',
        left: x,
        top,
        transform: `translateX(-50%) scale(${escala})`,
        background: cor,
        color: cor === COR.branco ? P : COR.branco,
        border: `6px solid ${P}`,
        borderRadius: 14,
        boxShadow: `10px 10px 0 var(--sombra, ${P})`,
        padding: '8px 20px 5px',
        fontFamily: FONTE.rotulo,
        fontWeight: 900,
        fontSize: 32,
        letterSpacing: 2,
        whiteSpace: 'nowrap',
      }}
    >
      {texto}
    </div>
  ) : null;

/** Chip de IA (máquina vermelha que transforma): quadrado com pinos e a rede no meio. Centro x, base. */
export const ChipIA: React.FC<{ x: number; base: number; tam?: number; pisca?: number }> = ({ x, base, tam = 280, pisca = 0 }) => {
  const pinos = 5;
  const corpo = tam - 70;
  const nos = [[-50, -40], [-50, 0], [-50, 40], [0, -55], [0, -18], [0, 18], [0, 55], [50, -22], [50, 22]];
  return (
    <svg width={tam} height={tam} viewBox={`${-tam / 2} ${-tam / 2} ${tam} ${tam}`} style={{ position: 'absolute', left: x - tam / 2, top: base - tam, overflow: 'visible' }}>
      {Array.from({ length: pinos }).map((_, i) => {
        const p = -corpo / 2 + (corpo / (pinos + 1)) * (i + 1);
        return (
          <g key={i} fill={COR.branco} stroke={P} strokeWidth={6}>
            <rect x={p - 9} y={-tam / 2 + 2} width={18} height={40} rx={4} />
            <rect x={-tam / 2 + 2} y={p - 9} width={40} height={18} rx={4} />
            <rect x={tam / 2 - 42} y={p - 9} width={40} height={18} rx={4} />
          </g>
        );
      })}
      <rect x={-corpo / 2 + 14} y={-corpo / 2 + 14} width={corpo} height={corpo} rx={28} fill={`var(--sombra, ${P})`} />
      <rect x={-corpo / 2} y={-corpo / 2} width={corpo} height={corpo} rx={28} fill={COR.vermelho} stroke={P} strokeWidth={CONTORNO} />
      <rect x={-corpo / 2 + 26} y={-corpo / 2 + 26} width={corpo - 52} height={corpo - 52} rx={14} fill={P} />
      <g stroke={COR.amarelo} strokeWidth={4}>
        {nos.filter(([a]) => a === -50).flatMap(([a, b]) => nos.filter(([c]) => c === 0).map(([c, d]) => <line key={`${a}${b}${c}${d}`} x1={a} y1={b} x2={c} y2={d} />))}
        {nos.filter(([a]) => a === 0).flatMap(([a, b]) => nos.filter(([c]) => c === 50).map(([c, d]) => <line key={`${a}${b}${c}${d}`} x1={a} y1={b} x2={c} y2={d} />))}
      </g>
      {nos.map(([a, b], i) => (
        <circle key={i} cx={a} cy={b} r={9} fill={pisca > 0 && (Math.floor(pisca) + i) % 4 === 0 ? COR.azul : COR.branco} />
      ))}
    </svg>
  );
};

/** Fita de números (assinatura): cartão branco com 4 valores em azul, centrado em x. */
export const FitaAssinatura: React.FC<{ x: number; top: number; valores: string[]; rotulo: string; escala?: number }> = ({ x, top, valores, rotulo, escala = 1 }) =>
  escala > 0.01 ? (
    <div style={{ position: 'absolute', left: x, top, transform: `translateX(-50%) scale(${escala})` }}>
      <div style={{ display: 'flex', background: COR.branco, border: `${CONTORNO}px solid ${P}`, borderRadius: RAIO.caixa, boxShadow: SOMBRA, overflow: 'hidden' }}>
        {valores.map((v, i) => (
          <div key={i} style={{ width: 140, height: 76, display: 'flex', alignItems: 'center', justifyContent: 'center', borderLeft: i ? `5px solid ${P}` : 'none', fontFamily: FONTE.numero, fontWeight: 800, fontSize: 42, color: COR.azul, background: COR.branco }}>
            {v}
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: -48, textAlign: 'center', fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 30, letterSpacing: 3, color: 'var(--tinta)' }}>{rotulo}</div>
    </div>
  ) : null;

/** Valores ilustrativos da assinatura (leitura de agora e cadastro, parecidos). */
export const AGORA = ['0,82', '0,14', '0,67', '0,31'];
export const CADASTRO = ['0,81', '0,15', '0,66', '0,33'];
