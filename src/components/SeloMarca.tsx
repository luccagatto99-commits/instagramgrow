import React from 'react';
import { siClaude, siGoogle, siGooglegemini, siOpenai } from 'simple-icons';
import { COR, FONTE, CONTORNO, SOMBRA } from '../theme';

/** Logos reais (simple-icons), desenhadas em preto para não brigar com as cores da fábrica. */
export const MARCAS = { google: siGoogle, openai: siOpenai, claude: siClaude, gemini: siGooglegemini } as const;
export type Marca = keyof typeof MARCAS;

export const Logo: React.FC<{ marca: Marca; tamanho: number; cor?: string }> = ({ marca, tamanho, cor = COR.preto }) => (
  <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" style={{ display: 'block' }}>
    <path d={MARCAS[marca].path} fill={cor} />
  </svg>
);

/**
 * Selo redondo branco com a logo da empresa e, opcional, o nome embaixo.
 * Posicionado pelo centro do círculo.
 */
export const SeloMarca: React.FC<{
  marca: Marca;
  x: number;
  y: number;
  tamanho?: number; // diâmetro do círculo
  nome?: string;
  escala?: number;
  opacidade?: number;
  destaque?: boolean;
}> = ({ marca, x, y, tamanho = 150, nome, escala = 1, opacidade = 1, destaque = true }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: `translate(-50%, -${tamanho / 2}px) scale(${escala})`,
      transformOrigin: `50% ${tamanho / 2}px`,
      opacity: opacidade,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}
  >
    <div
      style={{
        width: tamanho,
        height: tamanho,
        borderRadius: '50%',
        background: COR.branco,
        border: `${CONTORNO}px solid ${COR.preto}`,
        boxShadow: destaque ? SOMBRA : undefined,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Logo marca={marca} tamanho={tamanho * 0.52} />
    </div>
    {nome ? (
      <div style={{ marginTop: 14, fontFamily: FONTE.titulo, fontSize: Math.round(tamanho * 0.3), color: COR.preto, whiteSpace: 'nowrap', lineHeight: 1 }}>{nome}</div>
    ) : null}
  </div>
);
