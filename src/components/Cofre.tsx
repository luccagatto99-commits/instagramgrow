import React from 'react';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA } from '../theme';

/**
 * Cofre preto com porta branca que abre (`abertura` 0 → 1) e rótulo amarelo.
 * Centro x e base. `children` aparece dentro (o que escapa quando abre).
 */
export const Cofre: React.FC<{ x: number; base: number; rotulo: string; abertura: number; tamanho?: number; escala?: number; children?: React.ReactNode }> = ({
  x, base, rotulo, abertura, tamanho = 300, escala = 1, children,
}) =>
  escala > 0.01 ? (
    <div style={{ position: 'absolute', left: x - tamanho / 2, top: base - tamanho, width: tamanho, height: tamanho, transform: `scale(${escala})`, transformOrigin: '50% 100%' }}>
      <div style={{ position: 'absolute', inset: 0, background: COR.preto, borderRadius: RAIO.maquina, boxShadow: SOMBRA }} />
      <div style={{ position: 'absolute', left: 30, top: 30, right: 30, bottom: 30, background: COR.amarelo, borderRadius: 16, overflow: 'visible' }}>{children}</div>
      {/* porta: gira pela dobradiça da esquerda */}
      <div style={{ position: 'absolute', left: 30, top: 30, right: 30, bottom: 30, transformOrigin: '0% 50%', transform: `perspective(900px) rotateY(${-abertura * 105}deg)` }}>
        <div style={{ position: 'absolute', inset: 0, background: COR.branco, border: `${CONTORNO}px solid ${COR.preto}`, borderRadius: 16 }}>
          <div style={{ position: 'absolute', left: '50%', top: '50%', width: 90, height: 90, transform: 'translate(-50%, -50%)', borderRadius: '50%', border: `${CONTORNO}px solid ${COR.preto}` }} />
          {[0, 60, 120].map((r) => (
            <div key={r} style={{ position: 'absolute', left: '50%', top: '50%', width: 130, height: 10, transform: `translate(-50%, -50%) rotate(${r}deg)`, background: COR.preto, borderRadius: 5 }} />
          ))}
        </div>
      </div>
      <div style={{ position: 'absolute', left: '50%', top: -26, transform: 'translateX(-50%)', background: COR.preto, color: COR.amarelo, borderRadius: 14, padding: '8px 22px 4px', fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 36, letterSpacing: 3, whiteSpace: 'nowrap' }}>{rotulo}</div>
    </div>
  ) : null;
