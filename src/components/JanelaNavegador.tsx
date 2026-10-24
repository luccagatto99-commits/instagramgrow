import React from 'react';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA } from '../theme';

/**
 * Janela de navegador genérica (sem marca): três bolinhas, uma aba com nome e a
 * área de conteúdo. Posicionada pelo centro x e pelo topo. `apagada` (0 → 1)
 * deixa a aba e o conteúdo desbotados (site fora do ar). `children` vai no conteúdo.
 */
export const JanelaNavegador: React.FC<{
  x: number;
  top: number;
  aba: string;
  largura?: number;
  altura?: number; // altura da área de conteúdo
  escala?: number;
  dx?: number;
  rot?: number;
  apagada?: number;
  children?: React.ReactNode;
}> = ({ x, top, aba, largura = 720, altura = 300, escala = 1, dx = 0, rot = 0, apagada = 0, children }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top,
      width: largura,
      transform: `translateX(-50%) translateX(${dx}px) rotate(${rot}deg) scale(${escala})`,
      transformOrigin: '50% 100%',
      background: COR.branco,
      border: `${CONTORNO}px solid ${COR.preto}`,
      borderRadius: RAIO.maquina,
      boxShadow: SOMBRA,
      overflow: 'hidden',
    }}
  >
    <div style={{ height: 78, borderBottom: `${CONTORNO}px solid ${COR.preto}`, display: 'flex', alignItems: 'flex-end', paddingLeft: 26, gap: 14 }}>
      <div style={{ display: 'flex', gap: 12, alignSelf: 'center' }}>
        {[COR.vermelho, COR.amarelo, COR.verde].map((c) => (
          <div key={c} style={{ width: 24, height: 24, borderRadius: '50%', background: c, border: `5px solid ${COR.preto}` }} />
        ))}
      </div>
      <div
        style={{
          marginLeft: 18,
          marginBottom: -CONTORNO,
          padding: '10px 30px 8px',
          border: `${CONTORNO}px solid ${COR.preto}`,
          borderBottom: `${CONTORNO}px solid ${COR.branco}`,
          borderRadius: '18px 18px 0 0',
          background: COR.branco,
          fontFamily: FONTE.rotulo,
          fontWeight: 900,
          fontSize: 36,
          letterSpacing: 2,
          color: COR.preto,
          opacity: 1 - 0.6 * apagada,
          whiteSpace: 'nowrap',
        }}
      >
        {aba}
      </div>
    </div>
    <div style={{ position: 'relative', height: altura, opacity: 1 - 0.65 * apagada }}>{children}</div>
  </div>
);

/** Botão ▶ JOGAR (preto, texto amarelo), centralizado no ponto dado. */
export const BotaoJogar: React.FC<{ x: number; y: number; escala?: number; tamanho?: number }> = ({ x, y, escala = 1, tamanho = 64 }) =>
  escala > 0.01 ? (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${escala})`,
        background: COR.preto,
        color: COR.amarelo,
        borderRadius: RAIO.caixa,
        padding: `${tamanho * 0.25}px ${tamanho * 0.6}px ${tamanho * 0.2}px`,
        display: 'flex',
        alignItems: 'center',
        gap: tamanho * 0.35,
        fontFamily: FONTE.titulo,
        fontSize: tamanho,
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}
    >
      <svg width={tamanho * 0.7} height={tamanho * 0.8} viewBox="0 0 10 12">
        <path d="M0 0 L10 6 L0 12 Z" fill={COR.amarelo} />
      </svg>
      JOGAR
    </div>
  ) : null;
