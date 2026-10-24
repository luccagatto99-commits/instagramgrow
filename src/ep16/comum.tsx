import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA } from '../theme';

const P = COR.preto;
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/** Posições fixas do jantar: as duas pessoas simétricas em volta do centro. */
export const PESSOA = { esq: 300, dir: 780 };
export const MESA = { top: 880, base: 1000, w: 700 };

/** Mesa de jantar de contorno (tampo + toalha), por cima das pernas das pessoas. Centro x. */
export const Mesa: React.FC<{ x?: number; w?: number }> = ({ x = 540, w = MESA.w }) => (
  <div style={{ position: 'absolute', left: x - w / 2, top: MESA.top, width: w, height: MESA.base - MESA.top + 4 }}>
    <div style={{ position: 'absolute', inset: 0, background: COR.branco, border: `${CONTORNO}px solid ${P}`, borderRadius: '20px 20px 0 0', boxSizing: 'border-box' }} />
    {/* barra da toalha */}
    <div style={{ position: 'absolute', left: 0, right: 0, top: 38, height: 10, background: P }} />
  </div>
);

/** Prato com xícara (detalhe do jantar). Centro x, base. */
export const Prato: React.FC<{ x: number; base: number }> = ({ x, base }) => (
  <svg width={120} height={50} viewBox="0 0 120 50" style={{ position: 'absolute', left: x - 60, top: base - 50 }}>
    <ellipse cx={60} cy={38} rx={54} ry={10} fill={COR.branco} stroke={P} strokeWidth={7} />
    <path d="M38 34 L42 8 L78 8 L82 34 Z" fill={COR.branco} stroke={P} strokeWidth={7} strokeLinejoin="round" />
  </svg>
);

/** Ouvido de traço vermelho (o medo de "estar sendo ouvido"). Centro do desenho em (0,0) do svg pai. */
export const Ouvido: React.FC<{ tam?: number; escala?: number; cor?: string }> = ({ tam = 120, escala = 1, cor = COR.vermelho }) => (
  <svg width={tam} height={tam * 1.25} viewBox="0 0 100 125" style={{ transform: `scale(${escala})`, overflow: 'visible' }}>
    <path
      d="M30 92 Q22 70 24 50 Q28 14 58 12 Q88 12 88 44 Q88 64 72 76 Q62 84 62 98 Q62 116 46 116 Q34 116 30 104"
      fill="none"
      stroke={cor}
      strokeWidth={11}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M44 62 Q40 36 58 34 Q72 34 70 50 Q68 60 58 64" fill="none" stroke={cor} strokeWidth={10} strokeLinecap="round" />
  </svg>
);

/** Ondas saindo de algo (som): arcos que se afastam em loop. */
export const Ondas: React.FC<{ x: number; y: number; abre?: number; cor?: string; lado?: 1 | -1 }> = ({ x, y, abre = 1, cor = P, lado = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={120} height={140} viewBox="-10 -70 120 140" style={{ position: 'absolute', left: x - 10, top: y - 70, transform: `scaleX(${lado})`, transformOrigin: '10px 70px', overflow: 'visible' }}>
      {[0, 1, 2].map((i) => {
        const t = ((frame / 24 + i / 3) % 1);
        const r = 20 + t * 60;
        return (
          <path
            key={i}
            d={`M${r * Math.cos(-0.7)} ${r * Math.sin(-0.7)} A${r} ${r} 0 0 1 ${r * Math.cos(0.7)} ${r * Math.sin(0.7)}`}
            fill="none"
            stroke={cor}
            strokeWidth={7}
            strokeLinecap="round"
            opacity={abre * (1 - t)}
          />
        );
      })}
    </svg>
  );
};

/** Cafeteira de contorno (o produto do exemplo). Centro x, base. */
export const Cafeteira: React.FC<{ x: number; base: number; tam?: number; cinza?: boolean }> = ({ x, base, tam = 90, cinza }) => {
  const c = cinza ? '#9a9a9a' : P;
  return (
    <svg width={tam} height={tam} viewBox="0 0 100 100" style={{ position: 'absolute', left: x - tam / 2, top: base - tam }}>
      <rect x={48} y={8} width={40} height={84} rx={8} fill={COR.branco} stroke={c} strokeWidth={8} />
      <rect x={14} y={8} width={74} height={22} rx={8} fill={COR.branco} stroke={c} strokeWidth={8} />
      <path d="M16 50 L44 50 L40 86 L20 86 Z" fill={COR.branco} stroke={c} strokeWidth={8} strokeLinejoin="round" />
      <line x1={8} y1={94} x2={92} y2={94} stroke={c} strokeWidth={8} strokeLinecap="round" />
    </svg>
  );
};

/** Anúncio genérico (sem logo): faixa PATROCINADO + cafeteira + nome. Centro x, topo. */
export const Anuncio: React.FC<{ x: number; top: number; w?: number; escala?: number; cinza?: number; data?: string; acende?: number }> = ({
  x, top, w = 190, escala = 1, cinza = 0, data, acende = 1,
}) => {
  const apagado = cinza > 0.5 && acende < 0.5;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - w / 2,
        top,
        width: w,
        transform: `scale(${escala})`,
        transformOrigin: '50% 0%',
        background: COR.branco,
        border: `6px solid ${apagado ? '#9a9a9a' : P}`,
        borderRadius: 16,
        overflow: 'hidden',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      <div style={{ background: apagado ? '#9a9a9a' : COR.verde, color: COR.branco, fontFamily: FONTE.numero, fontWeight: 800, fontSize: w * 0.1, padding: '4px 0 2px', letterSpacing: 1 }}>
        PATROCINADO
      </div>
      <div style={{ position: 'relative', height: w * 0.52 }}>
        <Cafeteira x={w / 2 - 6} base={w * 0.5} tam={w * 0.44} cinza={apagado} />
      </div>
      <div style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: w * 0.12, letterSpacing: 1, color: apagado ? '#9a9a9a' : P, paddingBottom: 8 }}>CAFETEIRA</div>
      {data ? (
        <div style={{ position: 'absolute', right: 8, top: w * 0.16, fontFamily: FONTE.numero, fontWeight: 800, fontSize: w * 0.09, color: apagado ? '#9a9a9a' : COR.azul }}>{data}</div>
      ) : null}
    </div>
  );
};

/** Barra de busca dentro da tela do celular, digitando `texto` conforme `p` (0 → 1). */
export const Busca: React.FC<{ texto: string; p: number }> = ({ texto, p }) => {
  const n = Math.round(texto.length * Math.min(1, Math.max(0, p)));
  const frame = useCurrentFrame();
  return (
    <div style={{ width: 176, border: `5px solid ${P}`, borderRadius: 30, padding: '8px 10px 6px', display: 'flex', alignItems: 'center', gap: 8, boxSizing: 'border-box' }}>
      <svg width={24} height={24} viewBox="0 0 24 24" style={{ flex: 'none' }}>
        <circle cx={10} cy={10} r={7} fill="none" stroke={P} strokeWidth={4} />
        <line x1={15} y1={15} x2={22} y2={22} stroke={P} strokeWidth={4} strokeLinecap="round" />
      </svg>
      <span style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 22, whiteSpace: 'nowrap' }}>
        {texto.slice(0, n)}
        <span style={{ opacity: n < texto.length && frame % 16 < 8 ? 1 : 0 }}>|</span>
      </span>
    </div>
  );
};

/** Ícone de microfone (traço). */
export const Microfone: React.FC<{ tam?: number; cor?: string }> = ({ tam = 70, cor = P }) => (
  <svg width={tam} height={tam} viewBox="0 0 60 60">
    <rect x={20} y={4} width={20} height={32} rx={10} fill="none" stroke={cor} strokeWidth={6} />
    <path d="M12 28 Q12 46 30 46 Q48 46 48 28" fill="none" stroke={cor} strokeWidth={6} strokeLinecap="round" />
    <line x1={30} y1={46} x2={30} y2={56} stroke={cor} strokeWidth={6} strokeLinecap="round" />
  </svg>
);

/** Ícone de Wi-Fi (três arcos + ponto). Centro x, y = ponto de baixo. */
export const Wifi: React.FC<{ x: number; y: number; tam?: number; escala?: number; pulso?: number }> = ({ x, y, tam = 150, escala = 1, pulso = 0 }) => (
  <svg width={tam} height={tam * 0.8} viewBox="-60 -84 120 96" style={{ position: 'absolute', left: x - tam / 2, top: y - tam * 0.7, transform: `scale(${escala * (1 + 0.06 * pulso)})`, transformOrigin: '50% 87%', overflow: 'visible' }}>
    {[24, 48, 72].map((r) => (
      <path key={r} d={`M${-r * 0.74} ${-r * 0.67} A${r} ${r} 0 0 1 ${r * 0.74} ${-r * 0.67}`} fill="none" stroke={P} strokeWidth={12} strokeLinecap="round" />
    ))}
    <circle cx={0} cy={0} r={10} fill={P} />
  </svg>
);

/** Ícones dos sinais que alimentam a máquina de anúncios. */
export type Sinal = 'curte' | 'local' | 'sites' | 'perto';
export const IconeSinal: React.FC<{ tipo: Sinal; tam?: number }> = ({ tipo, tam = 64 }) => (
  <svg width={tam} height={tam} viewBox="0 0 60 60" fill="none" stroke={P} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round">
    {tipo === 'curte' ? <path d="M30 52 L8 30 Q0 18 10 10 Q22 2 30 16 Q38 2 50 10 Q60 18 52 30 Z" fill={COR.vermelho} /> : null}
    {tipo === 'local' ? (
      <>
        <path d="M30 56 Q10 34 10 22 Q10 4 30 4 Q50 4 50 22 Q50 34 30 56 Z" fill={COR.branco} />
        <circle cx={30} cy={22} r={7} />
      </>
    ) : null}
    {tipo === 'sites' ? (
      <>
        <circle cx={30} cy={30} r={24} fill={COR.branco} />
        <ellipse cx={30} cy={30} rx={10} ry={24} />
        <line x1={6} y1={30} x2={54} y2={30} />
      </>
    ) : null}
    {tipo === 'perto' ? (
      <>
        <circle cx={20} cy={18} r={9} fill={COR.branco} />
        <path d="M4 52 Q4 32 20 32 Q36 32 36 52 Z" fill={COR.branco} />
        <circle cx={42} cy={22} r={8} fill={COR.branco} />
        <path d="M30 52 Q32 36 42 36 Q56 36 56 52 Z" fill={COR.branco} />
      </>
    ) : null}
  </svg>
);

export const ROTULO_SINAL: Record<Sinal, string> = { curte: 'CURTIDAS', local: 'LOCAL', sites: 'SITES', perto: 'PERTO DE VOCÊ' };

/** Caixa de sinal (token de entrada): ícone + rótulo. Centro x, base. */
export const CaixaSinal: React.FC<{ tipo: Sinal; x: number; base: number; escala?: number }> = ({ tipo, x, base, escala = 1 }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: base,
      transform: `translate(-50%, -100%) scale(${escala})`,
      transformOrigin: '50% 100%',
      background: COR.branco,
      border: `${CONTORNO}px solid ${P}`,
      borderRadius: RAIO.caixa,
      padding: '10px 18px 8px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 4,
      whiteSpace: 'nowrap',
    }}
  >
    <IconeSinal tipo={tipo} tam={60} />
    <div style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 24, letterSpacing: 2 }}>{ROTULO_SINAL[tipo]}</div>
  </div>
);

/**
 * Máquina de anúncios (vermelha = transforma): boca de entrada à esquerda, painel 2×2 com os sinais
 * que já entraram, engrenagem que gira e placa com o nome. Centro x, base.
 */
export const MaquinaAnuncios: React.FC<{
  x: number;
  base: number;
  escala?: number;
  acesos?: number[]; // 0 → 1 por sinal (curte, local, sites, perto)
  giro?: number; // graus da engrenagem
  tranco?: number;
}> = ({ x, base, escala = 1, acesos = [0, 0, 0, 0], giro = 0, tranco = 0 }) => {
  const W = 420;
  const H = 330;
  const tipos: Sinal[] = ['curte', 'local', 'sites', 'perto'];
  return (
    <div style={{ position: 'absolute', left: x - W / 2, top: base - H, width: W, height: H, transform: `scale(${escala}) translateY(${tranco * 8}px)`, transformOrigin: '50% 100%' }}>
      {/* boca de entrada */}
      <div style={{ position: 'absolute', left: -46, bottom: 0, width: 70, height: 130, background: P, borderRadius: '18px 0 0 0' }} />
      <div style={{ position: 'absolute', inset: 0, background: COR.vermelho, border: `${CONTORNO}px solid ${P}`, borderRadius: RAIO.maquina, boxShadow: SOMBRA, boxSizing: 'border-box' }} />
      {/* painel 2x2 */}
      <div style={{ position: 'absolute', left: 30, top: 30, width: 236, height: 236, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {tipos.map((t, i) => (
          <div
            key={t}
            style={{
              background: acesos[i] > 0.5 ? COR.branco : '#d24a2c',
              border: `7px solid ${P}`,
              borderRadius: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${0.85 + 0.15 * Math.min(1, acesos[i])})`,
            }}
          >
            <div style={{ opacity: acesos[i] > 0.5 ? 1 : 0.25 }}>
              <IconeSinal tipo={t} tam={64} />
            </div>
          </div>
        ))}
      </div>
      {/* engrenagem */}
      <svg width={110} height={110} viewBox="-55 -55 110 110" style={{ position: 'absolute', right: 22, top: 40, transform: `rotate(${giro}deg)` }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={i} x={-9} y={-52} width={18} height={22} rx={4} fill={COR.branco} stroke={P} strokeWidth={6} transform={`rotate(${i * 45})`} />
        ))}
        <circle r={34} fill={COR.branco} stroke={P} strokeWidth={8} />
        <circle r={10} fill={P} />
      </svg>
      {/* saída */}
      <div style={{ position: 'absolute', right: 30, bottom: 36, width: 100, height: 70, background: P, borderRadius: 14 }} />
    </div>
  );
};

/** Ícone de app genérico (sem marca): quadrado arredondado com uma forma simples. */
export const IconeApp: React.FC<{ i: number; tam?: number; cinza?: boolean }> = ({ i, tam = 96, cinza }) => {
  const forma = i % 6;
  return (
    <svg width={tam} height={tam} viewBox="0 0 100 100">
      <rect x={5} y={5} width={90} height={90} rx={24} fill={COR.branco} stroke={cinza ? '#9a9a9a' : P} strokeWidth={8} />
      <g fill="none" stroke={cinza ? '#9a9a9a' : P} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round">
        {forma === 0 ? <circle cx={50} cy={50} r={20} /> : null}
        {forma === 1 ? <rect x={30} y={30} width={40} height={40} rx={6} /> : null}
        {forma === 2 ? <path d="M50 28 L72 70 L28 70 Z" /> : null}
        {forma === 3 ? <path d="M28 40 L72 40 M28 60 L60 60" /> : null}
        {forma === 4 ? <path d="M50 26 L56 44 L74 44 L60 56 L66 74 L50 63 L34 74 L40 56 L26 44 L44 44 Z" /> : null}
        {forma === 5 ? <path d="M30 66 Q30 34 50 34 Q70 34 70 66" /> : null}
      </g>
    </svg>
  );
};

/** Ponto do indicador de microfone no topo do celular (verde quando aceso). */
export const PontoMicrofone: React.FC<{ x: number; y: number; aceso: number }> = ({ x, y, aceso }) => {
  const frame = useCurrentFrame();
  const pulso = aceso > 0 ? 1 + 0.12 * Math.sin(frame / 4) : 1;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - 20,
        top: y - 20,
        width: 40,
        height: 40,
        borderRadius: 14,
        background: COR.verde,
        border: `5px solid ${P}`,
        boxSizing: 'border-box',
        transform: `scale(${aceso * pulso})`,
      }}
    />
  );
};

/** Contador em números azuis (JetBrains Mono). */
export const Contador: React.FC<{ x: number; top: number; valor: number; escala?: number }> = ({ x, top, valor, escala = 1 }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top,
      transform: `translateX(-50%) scale(${escala})`,
      background: COR.branco,
      border: `${CONTORNO}px solid ${P}`,
      borderRadius: RAIO.caixa,
      boxShadow: SOMBRA,
      padding: '8px 26px 4px',
      fontFamily: FONTE.numero,
      fontWeight: 800,
      fontSize: 56,
      color: COR.azul,
      whiteSpace: 'nowrap',
    }}
  >
    {Math.round(valor).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
    <span style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 30, color: P, marginLeft: 12, letterSpacing: 2 }}>APPS</span>
  </div>
);

/** Interpolação com clamp. */
export const faixa = (frame: number, de: number[], para: number[]) => interpolate(frame, de, para, clamp);
