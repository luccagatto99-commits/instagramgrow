import React from 'react';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA } from '../theme';

const P = COR.preto;

/** Linhas de código genéricas do PHP (ilustrativas, sem código real de ataque). */
export const LINHAS_PHP = ['<?php', '$pedido = ler();', 'guardar($pedido);', 'if ($memoria > $limite)', '    parar();', 'responder();'];

/** Mini site: cartão branco com barra de abas e conteúdo de traço. `php` (0 → 1) acende o selo azul. Centro x, topo. */
export const MiniSite: React.FC<{ x: number; top: number; php?: number; apagado?: number; escala?: number; w?: number }> = ({ x, top, php = 0, apagado = 0, escala = 1, w = 128 }) => (
  <div
    style={{
      position: 'absolute',
      left: x - w / 2,
      top,
      width: w,
      height: w * 0.78,
      transform: `scale(${escala})`,
      background: COR.branco,
      border: `7px solid ${P}`,
      borderRadius: 16,
      boxSizing: 'border-box',
      overflow: 'hidden',
      opacity: 1 - 0.55 * apagado,
    }}
  >
    <div style={{ height: 20, borderBottom: `6px solid ${P}`, display: 'flex', gap: 5, alignItems: 'center', paddingLeft: 8 }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: 8, height: 8, borderRadius: 4, background: P }} />
      ))}
    </div>
    <div style={{ margin: '8px 10px', height: 8, borderRadius: 4, background: P, width: '70%' }} />
    <div style={{ margin: '0 10px', height: 8, borderRadius: 4, background: P, width: '45%' }} />
    {php > 0.02 ? (
      <div
        style={{
          position: 'absolute',
          right: 6,
          bottom: 6,
          transform: `scale(${php})`,
          background: COR.azul,
          color: COR.branco,
          fontFamily: FONTE.numero,
          fontWeight: 800,
          fontSize: w * 0.17,
          borderRadius: 8,
          padding: '2px 7px',
          border: `4px solid ${P}`,
        }}
      >
        PHP
      </div>
    ) : null}
  </div>
);

/** Servidor: gabinete branco com tela; `linhas` (0 → 1) escreve comandos em vermelho na tela. Centro x, base. */
export const Servidor: React.FC<{ x: number; base: number; linhas?: number; escala?: number; tranco?: number }> = ({ x, base, linhas = 0, escala = 1, tranco = 0 }) => {
  const W = 300, H = 330;
  const n = Math.floor(linhas * 4 + 0.001);
  return (
    <div style={{ position: 'absolute', left: x - W / 2, top: base - H, width: W, height: H, transform: `scale(${escala}) translateY(${tranco * 6}px)`, transformOrigin: '50% 100%' }}>
      <div style={{ position: 'absolute', inset: 0, background: COR.branco, border: `${CONTORNO}px solid ${P}`, borderRadius: RAIO.maquina, boxShadow: SOMBRA, boxSizing: 'border-box' }} />
      <div style={{ position: 'absolute', left: 30, right: 30, top: 30, height: 150, background: P, borderRadius: 16, padding: '12px 14px', boxSizing: 'border-box' }}>
        {Array.from({ length: n }, (_, i) => (
          <div key={i} style={{ fontFamily: FONTE.numero, fontWeight: 800, fontSize: 24, color: COR.vermelho, lineHeight: 1.25 }}>
            {'>'} comando
          </div>
        ))}
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: 'absolute', left: 40, right: 40, top: 205 + i * 34, height: 14, borderRadius: 7, background: P }} />
      ))}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: -52, textAlign: 'center', fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 30, letterSpacing: 2, color: 'var(--tinta)' }}>SERVIDOR</div>
    </div>
  );
};

/** Barra de memória: enche em azul e vira vermelha ao passar do limite. Centro x, topo. */
export const BarraMemoria: React.FC<{ x: number; top: number; v: number; escala?: number }> = ({ x, top, v, escala = 1 }) => {
  const W = 600;
  const LIM = 0.78;
  const passou = v > LIM;
  return (
    <div style={{ position: 'absolute', left: x - W / 2, top, width: W, transform: `scale(${escala})`, transformOrigin: '50% 0%' }}>
      <div style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 34, letterSpacing: 2, color: 'var(--tinta)', marginBottom: 12, textAlign: 'center' }}>MEMÓRIA DO PEDIDO</div>
      <div style={{ position: 'relative', height: 70, background: COR.branco, border: `${CONTORNO}px solid ${P}`, borderRadius: 20, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${Math.min(1, v) * 100}%`, background: passou ? COR.vermelho : COR.azul }} />
        <div style={{ position: 'absolute', left: `${LIM * 100}%`, top: -4, bottom: -4, width: 8, background: P }} />
      </div>
      <div style={{ position: 'relative', height: 40 }}>
        <div style={{ position: 'absolute', left: `${LIM * 100}%`, transform: 'translateX(-50%)', top: 8, fontFamily: FONTE.numero, fontWeight: 800, fontSize: 26, color: 'var(--tinta)' }}>LIMITE</div>
      </div>
    </div>
  );
};

/** Item de checklist: selo ✓/✗ + texto, numa faixa branca. Centro x, topo. */
export const ItemLista: React.FC<{ x: number; top: number; texto: string; ok: boolean; escala?: number }> = ({ x, top, texto, ok, escala = 1 }) =>
  escala > 0.01 ? (
    <div
      style={{
        position: 'absolute',
        left: x,
        top,
        transform: `translateX(-50%) scale(${escala})`,
        width: 740,
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        background: COR.branco,
        border: `${CONTORNO}px solid ${P}`,
        borderRadius: RAIO.caixa,
        boxShadow: SOMBRA,
        padding: '14px 22px',
        boxSizing: 'border-box',
      }}
    >
      <svg width={56} height={56} viewBox="-30 -30 60 60" style={{ flex: 'none' }}>
        <circle r={26} fill={ok ? COR.verde : COR.vermelho} stroke={P} strokeWidth={6} />
        {ok ? (
          <path d="M-12 1 L-3 10 L13 -9" fill="none" stroke={COR.branco} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M-10 -10 L10 10 M10 -10 L-10 10" fill="none" stroke={COR.branco} strokeWidth={7} strokeLinecap="round" />
        )}
      </svg>
      <div style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 34, letterSpacing: 1, lineHeight: 1.15, color: P }}>{texto}</div>
    </div>
  ) : null;
