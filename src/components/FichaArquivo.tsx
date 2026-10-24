import React from 'react';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA } from '../theme';
import { Logo, type Marca } from './SeloMarca';

/**
 * Ficha do arquivo histórico: cartão branco com faixa preta no topo (ano),
 * título e linhas de detalhe. Usada para citar artigos, datas e empresas.
 * Posicionada pelo centro x e pelo topo.
 */
export const FichaArquivo: React.FC<{
  x: number;
  top: number;
  ano: string;
  titulo: React.ReactNode;
  detalhes?: string[];
  marca?: Marca;
  largura?: number;
  escala?: number;
  rot?: number;
  opacidade?: number;
  tamanhoTitulo?: number;
  logoEmCima?: boolean; // fichas estreitas: logo acima do título
}> = ({ x, top, ano, titulo, detalhes = [], marca, largura = 760, escala = 1, rot = 0, opacidade = 1, tamanhoTitulo = 60, logoEmCima }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top,
      width: largura,
      transform: `translateX(-50%) scale(${escala}) rotate(${rot}deg)`,
      transformOrigin: '50% 0%',
      opacity: opacidade,
      background: COR.branco,
      border: `${CONTORNO}px solid ${COR.preto}`,
      borderRadius: RAIO.caixa,
      boxShadow: SOMBRA,
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        background: COR.preto,
        color: COR.amarelo,
        padding: '14px 26px 10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: FONTE.rotulo,
        fontWeight: 900,
        fontSize: 34,
        letterSpacing: 2,
      }}
    >
      <span>ARQUIVO</span>
      <span style={{ fontFamily: FONTE.numero, fontWeight: 800, fontSize: 40, letterSpacing: 0 }}>{ano}</span>
    </div>
    <div style={{ padding: '26px 30px 28px', display: 'flex', flexDirection: logoEmCima ? 'column' : 'row', gap: logoEmCima ? 14 : 26, alignItems: 'flex-start' }}>
      {marca ? (
        <div style={{ flex: '0 0 auto', marginTop: 6 }}>
          <Logo marca={marca} tamanho={logoEmCima ? 64 : 84} />
        </div>
      ) : null}
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: FONTE.titulo, fontSize: tamanhoTitulo, lineHeight: 1.08, color: COR.preto }}>{titulo}</div>
        {detalhes.map((d, i) => (
          <div key={i} style={{ marginTop: i === 0 ? 18 : 6, fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 32, letterSpacing: 2, color: COR.preto, opacity: 0.85 }}>
            {d}
          </div>
        ))}
      </div>
    </div>
  </div>
);
