import React from 'react';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA } from '../theme';

export type CaixaTokenProps = {
  texto: React.ReactNode;
  id?: number | string; // ID em azul embaixo
  x: number; // centro horizontal
  base: number; // y da base da caixa (apoiada na esteira)
  tamanho?: number; // fonte do texto (64–84)
  escala?: number;
  rot?: number;
  destaque?: boolean; // sombra dura
  verde?: boolean; // token escolhido / saída
  numero?: boolean; // texto é número (JetBrains Mono azul)
  opacidade?: number;
  idOpacidade?: number;
  idEscala?: number;
  fantasma?: boolean; // letras só como contorno (escondidas dentro)
  larguraMax?: number; // permite quebrar linha
  style?: React.CSSProperties;
  children?: React.ReactNode; // extras desenhados sobre a caixa
};

/** Caixa branca contornada = um token. Posicionada pelo centro da base. */
export const CaixaToken: React.FC<CaixaTokenProps> = ({
  texto, id, x, base, tamanho = 72, escala = 1, rot = 0, destaque, verde, numero,
  opacidade = 1, idOpacidade = 1, idEscala = 1, fantasma, larguraMax, style, children,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: base,
      transform: `translate(-50%, -100%) scale(${escala}) rotate(${rot}deg)`,
      transformOrigin: '50% 100%',
      opacity: opacidade,
      ...style,
    }}
  >
    <div
      style={{
        position: 'relative',
        background: verde ? COR.verde : COR.branco,
        border: `${CONTORNO}px solid ${COR.preto}`,
        borderRadius: RAIO.caixa,
        boxShadow: destaque ? SOMBRA : undefined,
        padding: `${Math.round(tamanho * 0.18)}px ${Math.round(tamanho * 0.36)}px`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        whiteSpace: larguraMax ? 'normal' : 'pre',
        width: larguraMax ? 'max-content' : undefined,
        maxWidth: larguraMax,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: numero ? FONTE.numero : FONTE.titulo,
          fontWeight: numero ? 800 : 400,
          fontSize: tamanho,
          lineHeight: 1.1,
          color: numero ? COR.azul : fantasma ? 'transparent' : COR.preto,
          WebkitTextStroke: fantasma ? `3px ${COR.preto}` : undefined,
        }}
      >
        {texto}
      </div>
      {id !== undefined ? (
        <div
          style={{
            fontFamily: FONTE.numero,
            fontWeight: 800,
            fontSize: Math.max(40, Math.round(tamanho * 0.62)),
            lineHeight: 1,
            color: COR.azul,
            marginTop: 6,
            background: verde ? COR.branco : undefined,
            borderRadius: 10,
            padding: verde ? '2px 8px' : undefined,
            opacity: idOpacidade,
            transform: `scale(${idEscala})`,
          }}
        >
          {id}
        </div>
      ) : null}
      {children}
    </div>
  </div>
);

/** Largura estimada de uma CaixaToken de uma linha (para posicionar fileiras). */
export const larguraCaixa = (texto: string, tamanho = 72) =>
  texto.length * tamanho * 0.64 + Math.round(tamanho * 0.36) * 2 + 20;

/** Centros x de uma fileira de caixas centralizada em `cx`. */
export const fileira = (textos: string[], cx: number, tamanho = 72, gap = 24) => {
  const ws = textos.map((t) => larguraCaixa(t, tamanho));
  const total = ws.reduce((a, b) => a + b, 0) + gap * (ws.length - 1);
  let x = cx - total / 2;
  return ws.map((w) => {
    const c = x + w / 2;
    x += w + gap;
    return c;
  });
};

/** Mostra o espaço inicial de um token como ␣. */
export const comEspaco = (t: string) => t.replace(/^ /, '␣');
