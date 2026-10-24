import React from 'react';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA } from '../theme';

/** 95000000 → "95.000.000" */
export const formataEuros = (v: number) => Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/**
 * Contador de dinheiro: caixa branca com o valor em euros (número = azul, JetBrains Mono).
 * Posicionado pelo centro x e pelo topo; a largura acompanha o valor final.
 */
export const ContadorDinheiro: React.FC<{
  x: number;
  top: number;
  valor: number;
  final?: number; // reserva a largura do valor final (o número não "pula")
  rotulo?: string;
  tamanho?: number;
  escala?: number;
  opacidade?: number;
}> = ({ x, top, valor, final = valor, rotulo, tamanho = 84, escala = 1, opacidade = 1 }) => {
  const largura = (formataEuros(final).length + 2) * tamanho * 0.6 + 70;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - largura / 2,
        top,
        width: largura,
        transform: `scale(${escala})`,
        transformOrigin: '50% 0%',
        opacity: opacidade,
        background: COR.branco,
        border: `${CONTORNO}px solid ${COR.preto}`,
        borderRadius: RAIO.caixa,
        boxShadow: SOMBRA,
        boxSizing: 'border-box',
        padding: '12px 0 10px',
        textAlign: 'center',
      }}
    >
      {rotulo ? (
        <div style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 30, letterSpacing: 3, color: COR.preto, lineHeight: 1, marginBottom: 6 }}>{rotulo}</div>
      ) : null}
      <div style={{ fontFamily: FONTE.numero, fontWeight: 800, fontSize: tamanho, color: COR.azul, lineHeight: 1.05, whiteSpace: 'nowrap' }}>
        € {formataEuros(valor)}
      </div>
    </div>
  );
};
