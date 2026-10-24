import React from 'react';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA, CENTRO_X } from '../theme';

export type Questao = { texto: string; resposta: string; marca?: '✓' | '✗' | ''; pontos?: string; p?: number; pPontos?: number };

/** Folha de prova: questões com a resposta dada, a correção e os pontos (em azul). */
export const FolhaDeProva: React.FC<{ top: number; questoes: Questao[]; largura?: number; titulo?: string; escala?: number }> = ({
  top, questoes, largura = 760, titulo = 'PROVA', escala = 1,
}) => (
  <div
    style={{
      position: 'absolute',
      left: CENTRO_X,
      top,
      width: largura,
      transform: `translateX(-50%) scale(${escala})`,
      transformOrigin: '50% 0%',
      background: COR.branco,
      border: `${CONTORNO}px solid ${COR.preto}`,
      borderRadius: RAIO.caixa,
      boxShadow: SOMBRA,
      padding: '18px 30px 24px',
    }}
  >
    <div style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 34, letterSpacing: 2, color: COR.preto, borderBottom: `6px solid ${COR.preto}`, paddingBottom: 10, marginBottom: 14 }}>
      {titulo}
    </div>
    {questoes.map((q, i) => {
      const p = q.p ?? 1;
      return (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '10px 0', opacity: Math.min(1, p * 1.5) }}>
          <div style={{ fontFamily: FONTE.titulo, fontSize: 44, color: COR.preto, flex: '0 0 auto' }}>{i + 1}.</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONTE.rotulo, fontWeight: 700, fontSize: 30, color: COR.preto }}>{q.texto}</div>
            <div style={{ fontFamily: FONTE.titulo, fontSize: 44, color: COR.preto }}>{q.resposta}</div>
          </div>
          {q.marca ? (
            <div style={{ fontFamily: FONTE.titulo, fontSize: 64, color: q.marca === '✓' ? COR.verde : COR.vermelho, WebkitTextStroke: `2px ${COR.preto}`, transform: `scale(${q.pPontos ?? 1})` }}>{q.marca}</div>
          ) : null}
          {q.pontos !== undefined ? (
            <div style={{ fontFamily: FONTE.numero, fontWeight: 800, fontSize: 56, color: COR.azul, minWidth: 90, textAlign: 'right', transform: `scale(${q.pPontos ?? 1})` }}>{q.pontos}</div>
          ) : null}
        </div>
      );
    })}
  </div>
);
