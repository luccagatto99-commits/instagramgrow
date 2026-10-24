import React from 'react';
import { CaixaToken } from './CaixaToken';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA } from '../theme';

/** Um ponto do mapa: posição em px dentro do quadro, com rótulo em caixinha. */
export type PontoMapa = {
  texto: string;
  x: number;
  y: number;
  escala?: number; // entrada (0 = invisível)
  rotulo?: 'cima' | 'baixo' | 'esquerda' | 'direita' | 'nenhum';
  destaque?: boolean; // sombra dura na caixinha
  verde?: boolean; // resultado / palavra escolhida
  vazio?: boolean; // posição ainda sem palavra: círculo tracejado com "?"
  opacidade?: number;
  tamanho?: number;
};

const R = 15; // raio do ponto
const T = 40; // fonte do rótulo

/**
 * Mapa de significados: quadro branco contornado, sem eixos numerados.
 * Palavras viram pontos com rótulo. `children` são desenhados por cima, em
 * coordenadas do quadro (setas, anéis). O quadro é posicionado pelo centro x e o topo.
 */
export const MapaSemantico: React.FC<{
  x: number;
  top: number;
  w: number;
  h: number;
  pontos: PontoMapa[];
  escala?: number;
  dx?: number;
  dy?: number;
  opacidade?: number;
  children?: React.ReactNode; // camada sobre o quadro (abaixo dos pontos)
}> = ({ x, top, w, h, pontos, escala = 1, dx = 0, dy = 0, opacidade = 1, children }) => (
  <div
    style={{
      position: 'absolute',
      left: x - w / 2,
      top,
      width: w,
      height: h,
      transform: `translate(${dx}px, ${dy}px) scale(${escala})`,
      transformOrigin: '50% 50%',
      opacity: opacidade,
      background: COR.branco,
      border: `${CONTORNO}px solid ${COR.preto}`,
      borderRadius: RAIO.placa,
      boxShadow: SOMBRA,
    }}
  >
    <div style={{ position: 'absolute', inset: 0 }}>{children}</div>
    {pontos.map((p, i) => {
      const e = p.escala ?? 1;
      if (e <= 0.01) return null;
      const tam = p.tamanho ?? T;
      const lado = p.rotulo ?? 'cima';
      const caixaAlt = tam * 1.1 + Math.round(tam * 0.18) * 2 + 20;
      const desloc: Record<string, [number, number]> = {
        cima: [0, -R - 8],
        baixo: [0, R + 8 + caixaAlt],
        esquerda: [-(R + 10) - (p.texto.length * tam * 0.64 + Math.round(tam * 0.36) * 2 + 20) / 2, caixaAlt / 2],
        direita: [R + 10 + (p.texto.length * tam * 0.64 + Math.round(tam * 0.36) * 2 + 20) / 2, caixaAlt / 2],
        nenhum: [0, 0],
      };
      const [ox, oy] = desloc[lado];
      return (
        <div key={i} style={{ position: 'absolute', left: 0, top: 0, opacity: p.opacidade ?? 1 }}>
          {p.vazio ? (
            <div
              style={{
                position: 'absolute',
                left: p.x - 34 * e,
                top: p.y - 34 * e,
                width: 68 * e,
                height: 68 * e,
                borderRadius: '50%',
                border: `6px dashed ${COR.preto}`,
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: FONTE.titulo,
                fontSize: 40 * e,
                color: COR.preto,
              }}
            >
              ?
            </div>
          ) : (
            <div
              style={{
                position: 'absolute',
                left: p.x - R * e,
                top: p.y - R * e,
                width: R * 2 * e,
                height: R * 2 * e,
                borderRadius: '50%',
                background: p.verde ? COR.verde : COR.preto,
                border: p.verde ? `5px solid ${COR.preto}` : undefined,
                boxSizing: 'border-box',
              }}
            />
          )}
          {lado === 'nenhum' || p.vazio ? null : (
            <CaixaToken texto={p.texto} tamanho={tam} x={p.x + ox * e} base={p.y + oy * e} escala={e} destaque={p.destaque} verde={p.verde} />
          )}
        </div>
      );
    })}
  </div>
);

/** Anel tracejado em volta de uma região do mapa (coordenadas do quadro). */
export const AnelMapa: React.FC<{ x: number; y: number; rx: number; ry: number; p?: number; rotulo?: string; rotuloY?: number }> = ({
  x, y, rx, ry, p = 1, rotulo, rotuloY,
}) => {
  if (p <= 0) return null;
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: x - rx,
          top: y - ry,
          width: rx * 2,
          height: ry * 2,
          borderRadius: '50%',
          border: `7px dashed ${COR.preto}`,
          transform: `scale(${p})`,
          opacity: Math.min(1, p * 1.5),
        }}
      />
      {rotulo ? (
        <div
          style={{
            position: 'absolute',
            left: x,
            top: rotuloY ?? y + ry + 8,
            transform: `translateX(-50%) scale(${p})`,
            fontFamily: FONTE.rotulo,
            fontWeight: 900,
            fontSize: 30,
            letterSpacing: 2,
            color: COR.preto,
            whiteSpace: 'nowrap',
          }}
        >
          {rotulo}
        </div>
      ) : null}
    </>
  );
};
