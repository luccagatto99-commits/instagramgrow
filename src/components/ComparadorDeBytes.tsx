import React from 'react';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA } from '../theme';

/** Estado de um byte comparado: '' ainda não comparado, 'ok' igual, 'erro' diferente. */
export type EstadoByte = '' | 'ok' | 'erro';

/**
 * Duas fitas de bytes alinhadas (ORIGINAL em cima, NOVO embaixo), cada uma com o
 * rótulo acima. Cada byte do novo fica verde (igual) ou vermelho (diferente)
 * conforme `estados`. Centro x e topo. `pOriginal`/`pNovo` (0 → 1) mostram cada fita.
 */
export const ComparadorDeBytes: React.FC<{
  x: number;
  top: number;
  original: string[];
  novo: string[];
  estados: EstadoByte[];
  pOriginal?: number;
  pNovo?: number;
}> = ({ x, top, original, novo, estados, pOriginal = 1, pNovo = 1 }) => {
  const cel = 76;
  const linha = (rotulo: string, bytes: string[], p: number, est?: EstadoByte[]) =>
    p > 0.01 ? (
      <div style={{ opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 30}px)` }}>
        <div style={{ display: 'inline-block', marginBottom: 6, background: COR.preto, color: COR.amarelo, borderRadius: 10, padding: '4px 14px 2px', fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 24, letterSpacing: 2 }}>{rotulo}</div>
        <div style={{ display: 'flex', border: `${CONTORNO}px solid ${COR.preto}`, borderRadius: 14, overflow: 'hidden', background: COR.branco, boxShadow: SOMBRA }}>
          {bytes.map((b, i) => {
            const e = est?.[i] ?? '';
            return (
              <div
                key={i}
                style={{
                  width: cel,
                  height: 66,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderLeft: i ? `5px solid ${COR.preto}` : undefined,
                  background: e === 'ok' ? COR.verde : e === 'erro' ? COR.vermelho : COR.branco,
                  fontFamily: FONTE.numero,
                  fontWeight: 800,
                  fontSize: 36,
                  color: e ? COR.preto : COR.azul,
                }}
              >
                {b}
              </div>
            );
          })}
        </div>
      </div>
    ) : <div style={{ height: 112 }} />;
  return (
    <div style={{ position: 'absolute', left: x, top, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', gap: 22 }}>
      {linha('ORIGINAL', original, pOriginal)}
      {linha('NOVO', novo, pNovo, estados)}
    </div>
  );
};

/** Placa redonda com ✓ (verde) ou ✗ (vermelho), centrada no ponto. */
export const Veredito: React.FC<{ x: number; y: number; marca: '✓' | '✗'; escala: number; tamanho?: number }> = ({ x, y, marca, escala, tamanho = 120 }) =>
  escala > 0.01 ? (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: tamanho,
        height: tamanho,
        transform: `translate(-50%, -50%) scale(${escala})`,
        borderRadius: '50%',
        background: marca === '✓' ? COR.verde : COR.vermelho,
        border: `${CONTORNO}px solid ${COR.preto}`,
        boxShadow: SOMBRA,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONTE.titulo,
        fontSize: tamanho * 0.6,
        color: COR.preto,
        lineHeight: 1,
      }}
    >
      {marca}
    </div>
  ) : null;

/** Rótulo verde do veredito final (ex.: IDÊNTICO), centrado no ponto. */
export const RotuloVeredito: React.FC<{ x: number; y: number; texto: string; escala: number }> = ({ x, y, texto, escala }) =>
  escala > 0.01 ? (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${escala})`, background: COR.verde, border: `${CONTORNO}px solid ${COR.preto}`, borderRadius: RAIO.caixa, boxShadow: SOMBRA, padding: '14px 34px 10px', fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 44, letterSpacing: 3, color: COR.preto, whiteSpace: 'nowrap' }}>
      {texto}
    </div>
  ) : null;
