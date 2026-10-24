import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Destaque, FECHADO, FundoAlerta, Som, type CenaEp } from '../components';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA, CENTRO_X, ESTEIRA_Y } from '../theme';
import { entra, lin, segue } from '../anim';
import { palavra } from './tempo';

const B = 5;
const PW = 380;
const PH = 420;
const PX = CENTRO_X - PW / 2;
const PY = ESTEIRA_Y - PH;

/** Teia de aranha de traço, no canto de cima da sala vazia. */
const Teia: React.FC<{ p: number }> = ({ p }) => (
  <svg width={170} height={170} viewBox="0 0 170 170" style={{ position: 'absolute', left: 0, top: 0, opacity: p }} fill="none" stroke={COR.preto} strokeWidth={4} strokeLinecap="round">
    {[0, 22, 45, 68, 90].map((a) => {
      const r = (a * Math.PI) / 180;
      return <line key={a} x1={0} y1={0} x2={Math.cos(r) * 160} y2={Math.sin(r) * 160} />;
    })}
    {[45, 85, 125].map((r) => (
      <path key={r} d={`M${r} 0 Q${r * 0.78} ${r * 0.3} ${r * 0.92} ${r * 0.39} Q${r * 0.6} ${r * 0.6} ${r * 0.71} ${r * 0.71} Q${r * 0.4} ${r * 0.78} ${r * 0.39} ${r * 0.92} Q${r * 0.25} ${r * 0.8} 0 ${r}`} />
    ))}
  </svg>
);

/** Virada: a porta da CONFERÊNCIA DE FATOS abre e a sala está vazia. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tExiste = palavra(B, 'existe');
  const tParece = palavra(B, 'parece');
  const pPorta = entra(frame, 4, 130);
  const abre = lin(frame, tExiste - 2, tExiste + 10);

  return (
    <>
      <Som nome="sirene" em={0} duracao={30} volume={0.2} />
      <Som nome="carimbo" em={tExiste - 2} volume={0.4} />

      <div style={{ position: 'absolute', inset: 0, transform: `translate(${segue(frame, tParece - 12, 12)}px, ${(1 - pPorta) * 600}px)` }}>
        {/* a sala por trás da porta */}
        <div style={{ position: 'absolute', left: PX, top: PY, width: PW, height: PH, background: COR.branco, border: `${CONTORNO}px solid ${COR.preto}`, borderRadius: `${RAIO.caixa}px ${RAIO.caixa}px 0 0`, boxShadow: SOMBRA, overflow: 'hidden', boxSizing: 'border-box' }}>
          <Teia p={lin(frame, tExiste + 6, tExiste + 16)} />
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 40, textAlign: 'center', fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 36, letterSpacing: 4, color: COR.preto, opacity: 0.35 * lin(frame, tExiste + 8, tExiste + 18) }}>
            VAZIA
          </div>
        </div>
        {/* a folha da porta gira para fora (fica estreita, presa à esquerda) */}
        <div
          style={{
            position: 'absolute',
            left: PX,
            top: PY,
            width: PW,
            height: PH,
            transform: `scaleX(${1 - 0.86 * abre})`,
            transformOrigin: '0% 50%',
            background: COR.branco,
            border: `${CONTORNO}px solid ${COR.preto}`,
            borderRadius: `${RAIO.caixa}px ${RAIO.caixa}px 0 0`,
            boxSizing: 'border-box',
          }}
        >
          <div style={{ position: 'absolute', right: 40, top: PH / 2, width: 26, height: 26, borderRadius: 13, background: COR.preto }} />
        </div>
        {/* placa da porta */}
        <div
          style={{
            position: 'absolute',
            left: CENTRO_X,
            top: PY - 76,
            transform: 'translateX(-50%)',
            background: COR.preto,
            color: COR.amarelo,
            borderRadius: 16,
            padding: '10px 24px 8px',
            fontFamily: FONTE.rotulo,
            fontWeight: 900,
            fontSize: 34,
            letterSpacing: 2,
            whiteSpace: 'nowrap',
          }}
        >
          CONFERÊNCIA DE FATOS
        </div>
      </div>

      <Destaque de={tParece - 4} top={640} tamanho={60}>
        <div style={{ display: 'inline-block', background: COR.preto, color: COR.amarelo, borderRadius: 20, padding: '12px 32px 16px' }}>
          parece certo ≠ é certo
        </div>
      </Destaque>
    </>
  );
};

export const Conferencia: CenaEp = {
  Conteudo,
  Fundo: () => { const f = useCurrentFrame(); return <FundoAlerta deslocamento={f * 4} />; },
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'existe') - 2, CENTRO_X, 820, 1.12), ABERTO(palavra(B, 'parece') - 4)],
};
