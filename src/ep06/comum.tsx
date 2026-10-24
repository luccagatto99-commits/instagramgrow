import React from 'react';
import { Maquina } from '../components';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA } from '../theme';

/** Bytes de "se vida = 0: fim_de_jogo()" compilado (x86: mov, cmp, jge, call). */
export const BYTES = ['8B', '45', 'F8', '83', 'F8', '00', '7D', '05', 'E8'];

/** Linhas da folha de código, em três versões. */
export const CODIGO_ORIGINAL = ['se vida = 0:', '  fim_de_jogo()'];

/**
 * Prensa vermelha (máquina com placa) e um pistão que desce `golpe` (0 → 1) até a folha.
 * `x` é o centro; a máquina fica com o topo em `top`.
 */
export const Prensa: React.FC<{ x: number; top: number; golpe: number; nome: string; termo: string; curso?: number; escala?: number }> = ({
  x, top, golpe, nome, termo, curso = 120, escala = 1,
}) => {
  const W = 360;
  return escala > 0.01 ? (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `scale(${escala})`, transformOrigin: `${x}px ${top}px` }}>
      <div style={{ position: 'absolute', left: x - 16, top: top + 120, width: 32, height: 20 + golpe * curso, background: COR.preto }} />
      <div
        style={{
          position: 'absolute',
          left: x - 200,
          top: top + 136 + golpe * curso,
          width: 400,
          height: 44,
          background: COR.vermelho,
          border: `${CONTORNO}px solid ${COR.preto}`,
          borderRadius: 14,
        }}
      />
      <Maquina x={x - W / 2} y={top} w={W} h={130} nome={nome} termo={termo}>
        <svg width="90" height="60" viewBox="0 0 90 60">
          <path d="M10 30 H80 M58 12 L80 30 L58 48" fill="none" stroke={COR.preto} strokeWidth="10" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      </Maquina>
    </div>
  ) : null;
};

/** Lixeira de traço, posicionada pelo centro x e pela base. */
export const Lixeira: React.FC<{ x: number; base: number; escala?: number; tranco?: number }> = ({ x, base, escala = 1, tranco = 0 }) =>
  escala > 0.01 ? (
    <svg width={130} height={160} viewBox="0 0 130 160" style={{ position: 'absolute', left: x - 65, top: base - 160, transform: `scale(${escala}) rotate(${tranco * 6}deg)`, transformOrigin: '50% 100%' }} fill={COR.branco} stroke={COR.preto} strokeWidth={9} strokeLinejoin="round" strokeLinecap="round">
      <path d="M20 40 L30 152 H100 L110 40 Z" />
      <line x1={10} y1={34} x2={120} y2={34} />
      <path d="M48 34 V20 H82 V34" fill="none" />
      <line x1={50} y1={62} x2={54} y2={130} />
      <line x1={80} y1={62} x2={76} y2={130} />
    </svg>
  ) : null;

/** Lupa de traço. Centro da lente em (x, y). */
export const Lupa: React.FC<{ x: number; y: number; tamanho?: number; rot?: number; escala?: number }> = ({ x, y, tamanho = 120, rot = -30, escala = 1 }) =>
  escala > 0.01 ? (
    <svg width={tamanho * 1.6} height={tamanho * 1.6} viewBox="0 0 160 160" style={{ position: 'absolute', left: x - tamanho * 0.5, top: y - tamanho * 0.5, transform: `rotate(${rot}deg) scale(${escala})`, transformOrigin: `${tamanho * 0.5}px ${tamanho * 0.5}px`, overflow: 'visible' }}>
      <line x1={80} y1={80} x2={150} y2={150} stroke={COR.preto} strokeWidth={22} strokeLinecap="round" />
      <circle cx={50} cy={50} r={44} fill={COR.branco} fillOpacity={0.55} stroke={COR.preto} strokeWidth={12} />
    </svg>
  ) : null;

/** Caixa fechada (o programa): branca, fita no meio e rótulo. Centro x e base. */
export const CaixaFechada: React.FC<{ x: number; base: number; rotulo: string; largura?: number; escala?: number }> = ({ x, base, rotulo, largura = 240, escala = 1 }) =>
  escala > 0.01 ? (
    <div style={{ position: 'absolute', left: x - largura / 2, top: base - largura * 0.85, width: largura, height: largura * 0.85, transform: `scale(${escala})`, transformOrigin: '50% 100%', background: COR.branco, border: `${CONTORNO}px solid ${COR.preto}`, borderRadius: RAIO.caixa, boxShadow: SOMBRA, boxSizing: 'border-box' }}>
      <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 34, transform: 'translateX(-50%)', background: COR.preto }} />
      <div style={{ position: 'absolute', left: '50%', bottom: 26, transform: 'translateX(-50%)', background: COR.branco, border: `6px solid ${COR.preto}`, borderRadius: 10, padding: '6px 14px 2px', fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 28, letterSpacing: 2, color: COR.preto, whiteSpace: 'nowrap' }}>{rotulo}</div>
    </div>
  ) : null;

/** Ícone de instalador (caixa com seta para baixo); `risco` (0 → 1) passa um traço vermelho. Centro. */
export const Instalador: React.FC<{ x: number; y: number; risco: number; escala?: number }> = ({ x, y, risco, escala = 1 }) =>
  escala > 0.01 ? (
    <svg width={200} height={200} viewBox="0 0 200 200" style={{ position: 'absolute', left: x - 100, top: y - 100, transform: `scale(${escala})`, overflow: 'visible' }} strokeLinejoin="round" strokeLinecap="round">
      <rect x={30} y={70} width={140} height={110} rx={18} fill={COR.branco} stroke={COR.preto} strokeWidth={10} />
      <path d="M100 14 V112 M64 78 L100 114 L136 78" fill="none" stroke={COR.preto} strokeWidth={14} />
      <line x1={10} y1={190} x2={10 + 180 * risco} y2={190 - 180 * risco} stroke={COR.vermelho} strokeWidth={22} />
    </svg>
  ) : null;

/** Player de música genérico com lista vazia. Centro x e base. */
export const PlayerVazio: React.FC<{ x: number; base: number; nome: string; escala?: number; vazio: number }> = ({ x, base, nome, escala = 1, vazio }) =>
  escala > 0.01 ? (
    <div style={{ position: 'absolute', left: x, top: base, width: 560, transform: `translate(-50%, -100%) scale(${escala})`, transformOrigin: '50% 100%', background: COR.branco, border: `${CONTORNO}px solid ${COR.preto}`, borderRadius: RAIO.maquina, boxShadow: SOMBRA, overflow: 'hidden' }}>
      <div style={{ background: COR.preto, color: COR.amarelo, padding: '14px 28px 10px', display: 'flex', justifyContent: 'space-between', fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 34, letterSpacing: 2 }}>
        <span>CLONE DO {nome.toUpperCase()}</span>
        <span>♪</span>
      </div>
      <div style={{ padding: '22px 28px 26px' }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ height: 46, marginBottom: 14, border: `5px dashed ${COR.preto}`, borderRadius: 12, opacity: 0.35 + 0.65 * (1 - vazio) }} />
        ))}
        <div style={{ textAlign: 'center', fontFamily: FONTE.numero, fontWeight: 800, fontSize: 52, color: COR.azul, opacity: vazio }}>0 músicas</div>
      </div>
    </div>
  ) : null;

/** Seta circular de "tenta de novo" (traço preto). Centro. */
export const SetaLoop: React.FC<{ x: number; y: number; giro: number; escala: number }> = ({ x, y, giro, escala }) =>
  escala > 0.01 ? (
    <svg width={150} height={150} viewBox="0 0 100 100" style={{ position: 'absolute', left: x - 75, top: y - 75, transform: `rotate(${giro}deg) scale(${escala})` }} fill="none" stroke={COR.preto} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round">
      <path d="M80 50 A30 30 0 1 1 62 22" />
      <path d="M50 12 L66 22 L56 38" />
    </svg>
  ) : null;

/** Cartão de número (contador azul + legenda), para a prova real. Centro x e topo. */
export const CartaoNumero: React.FC<{ x: number; top: number; valor: string; legenda: string; escala: number }> = ({ x, top, valor, legenda, escala }) =>
  escala > 0.01 ? (
    <div style={{ position: 'absolute', left: x, top, width: 230, transform: `translateX(-50%) scale(${escala})`, transformOrigin: '50% 0%', background: COR.branco, border: `${CONTORNO}px solid ${COR.preto}`, borderRadius: RAIO.caixa, boxShadow: SOMBRA, padding: '18px 0 14px', textAlign: 'center' }}>
      <div style={{ fontFamily: FONTE.numero, fontWeight: 800, fontSize: 72, lineHeight: 1, color: COR.azul }}>{valor}</div>
      <div style={{ marginTop: 10, fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 28, letterSpacing: 2, color: COR.preto }}>{legenda}</div>
    </div>
  ) : null;
