import React from 'react';
import { COR, FONTE } from '../theme';

/**
 * Bicos de jato em coordenadas locais do carro (320 × 92, frente para a direita, centro em 0,0).
 * `a` = direção do jato em graus (0 = para a frente, 90 = para baixo, 180 = para trás).
 * 1–3 traseiros, 4–7 embaixo, 8–9 em cima, 10 na frente.
 */
export const BICOS_CARRO = [
  { x: -164, y: -14, a: 180 }, { x: -164, y: 2, a: 180 }, { x: -164, y: 18, a: 180 },
  { x: -150, y: 22, a: 90 }, { x: -40, y: 22, a: 90 }, { x: 40, y: 22, a: 90 }, { x: 150, y: 22, a: 90 },
  { x: -70, y: -47, a: -90 }, { x: 96, y: -12, a: -90 },
  { x: 164, y: 12, a: 0 },
];

/** Distância (local) do centro do carro até a base das rodas: base = y + RODA_CARRO * escala. */
export const RODA_CARRO = 46;

const CORPO =
  'M164 22 L164 4 Q160 -4 140 -6 L44 -18 Q14 -50 -30 -50 Q-100 -48 -150 -26 L-164 -22 L-164 22 L-128 22 A28 28 0 0 1 -72 22 L76 22 A28 28 0 0 1 132 22 Z';
const JANELA = 'M38 -18 Q12 -43 -30 -43 Q-82 -41 -112 -22 Z';

/**
 * Jato de ar comprimido saindo de um bico: cone branco de contorno que abre para fora,
 * com traços tracejados correndo no sentido do jato. O comprimento pulsa com `semente` (frame).
 */
export const JatoAr: React.FC<{ x: number; y: number; a: number; v: number; sw: number; semente: number; comprimento?: number }> = ({ x, y, a, v, sw, semente, comprimento = 84 }) => {
  if (v < 0.02) return null;
  const dx = Math.cos((a * Math.PI) / 180);
  const dy = Math.sin((a * Math.PI) / 180);
  const px = -dy;
  const py = dx;
  const L = comprimento * v * (0.85 + 0.15 * Math.sin(semente * 1.9));
  const w0 = 4;
  const w1 = comprimento * 0.3 * v;
  const p = (d: number, w: number) => `${x + dx * d + px * w} ${y + dy * d + py * w}`;
  return (
    <g>
      <path d={`M${p(4, w0)} L${p(L, w1)} Q${p(L + w1 * 0.6, 0)} ${p(L, -w1)} L${p(4, -w0)} Z`} fill={COR.branco} stroke={COR.preto} strokeWidth={sw * 0.6} strokeLinejoin="round" />
      {[-0.4, 0.4].map((k) => (
        <line key={k} x1={x + dx * 10 + px * w0 * k} y1={y + dy * 10 + py * w0 * k} x2={x + dx * (L - 4) + px * w1 * k} y2={y + dy * (L - 4) + py * w1 * k} stroke={COR.preto} strokeWidth={sw * 0.35} strokeDasharray="7 7" strokeDashoffset={-semente * 5} />
      ))}
    </g>
  );
};

/**
 * Carro esportivo genérico de contorno (sem marca), de lado, frente para a direita.
 * Posicionado pelo centro. `giro` é o mortal lateral: 1 = em pé, −1 = de cabeça para baixo
 * (passa por 0 achatado, como num giro em torno do próprio eixo). `jatos` = intensidade de
 * cada um dos 10 bicos (0 → 1); `numeros` mostra o número de cada bico em azul.
 * `corte` mostra os tanques de ar por dentro; `ventoinhas` as ventoinhas embaixo.
 */
export const CarroEsportivo: React.FC<{
  x: number;
  y: number;
  escala?: number;
  rot?: number;
  giro?: number;
  jatos?: number[];
  numeros?: number[];
  corte?: number;
  ventoinhas?: number;
  giroVentoinha?: number;
  rodas?: number; // giro das rodas em graus
  frame?: number; // para o tremor dos jatos
  opacidade?: number;
}> = ({ x, y, escala = 1, rot = 0, giro = 1, jatos = [], numeros = [], corte = 0, ventoinhas = 0, giroVentoinha = 0, rodas = 0, frame = 0, opacidade = 1 }) => {
  if (escala < 0.01) return null;
  // contorno de 10 px em tamanho grande; um pouco mais fino quando o carro é pequeno
  const sw = (escala < 1 ? 7 : 10) / escala;
  const roda = (cx: number) => (
    <g transform={`translate(${cx} 24) rotate(${rodas})`}>
      <circle r={22} fill={COR.branco} stroke={COR.preto} strokeWidth={sw} />
      <circle r={7} fill={COR.preto} />
      <line x1={-14} y1={0} x2={14} y2={0} stroke={COR.preto} strokeWidth={sw * 0.5} />
    </g>
  );
  return (
    <svg
      width={560 * escala}
      height={360 * escala}
      viewBox="-280 -180 560 360"
      style={{ position: 'absolute', left: x - 280 * escala, top: y - 180 * escala, overflow: 'visible', opacity: opacidade }}
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <g transform={`rotate(${rot}) scale(1 ${giro})`}>
        {BICOS_CARRO.map((b, i) => (
          <JatoAr key={i} x={b.x} y={b.y} a={b.a} v={jatos[i] ?? 0} sw={sw} semente={frame + i * 5} />
        ))}
        {ventoinhas > 0.01
          ? [-30, 30].map((cx) => (
              <g key={cx} transform={`translate(${cx} 34) scale(${ventoinhas})`}>
                <circle r={11} fill={COR.branco} stroke={COR.preto} strokeWidth={sw * 0.6} />
                {[0, 120, 240].map((a) => (
                  <line key={a} x1={0} y1={0} x2={9 * Math.cos(((a + giroVentoinha) * Math.PI) / 180)} y2={9 * Math.sin(((a + giroVentoinha) * Math.PI) / 180)} stroke={COR.preto} strokeWidth={sw * 0.5} />
                ))}
              </g>
            ))
          : null}
        <path d={CORPO} fill={COR.branco} stroke={COR.preto} strokeWidth={sw} />
        <path d={JANELA} fill={COR.branco} stroke={COR.preto} strokeWidth={sw * 0.8} />
        {/* banco e volante (vazios: ninguém dirige) */}
        <path d="M-62 -20 L-72 -35 Q-72 -41 -64 -40 L-50 -21" fill="none" stroke={COR.preto} strokeWidth={sw * 0.6} />
        <line x1={14} y1={-20} x2={6} y2={-32} stroke={COR.preto} strokeWidth={sw * 0.6} />
        {corte > 0.01 ? (
          <g opacity={corte}>
            {[-150, -76].map((tx) => (
              <g key={tx}>
                <rect x={tx} y={-12} width={66} height={28} rx={14} fill={COR.branco} stroke={COR.preto} strokeWidth={sw * 0.7} />
                <text x={tx + 33} y={8} textAnchor="middle" fontFamily={FONTE.rotulo} fontWeight={900} fontSize={15} fill={COR.preto}>AR</text>
              </g>
            ))}
          </g>
        ) : null}
        {BICOS_CARRO.map((b, i) => (
          <rect key={i} x={b.x - 5} y={b.y - 4} width={10} height={8} rx={2} fill={COR.preto} transform={`rotate(${b.a} ${b.x} ${b.y})`} />
        ))}
        {roda(-100)}
        {roda(104)}
        {BICOS_CARRO.map((b, i) => {
          const p = numeros[i] ?? 0;
          if (p < 0.02) return null;
          const dx = Math.cos((b.a * Math.PI) / 180);
          const dy = Math.sin((b.a * Math.PI) / 180);
          // os de baixo são numerados por dentro da lataria (embaixo fica a pista)
          const d = b.a === 90 ? -16 : 26;
          return (
            <text key={i} x={b.x + dx * d} y={b.y + dy * d + 6} textAnchor="middle" fontFamily={FONTE.numero} fontWeight={800} fontSize={17 * p} fill={COR.azul}>
              {i + 1}
            </text>
          );
        })}
      </g>
    </svg>
  );
};
