import React from 'react';
import { interpolate, Easing, useCurrentFrame } from 'remotion';
import { ABERTO, Destaque, FECHADO, FundoPrensa, Som, TelaDividida, type CenaEp } from '../components';
import { COR, FONTE, CONTORNO, CENTRO_X } from '../theme';
import { entra, lin, pop } from '../anim';
import { palavra } from './tempo';

const B = 5;
const W_PAINEL = (800 - 24) / 2; // 388
const TOPO = 470;
const ALTURA = 440;

const Mini: React.FC<{ x: number; y: number; aceso?: boolean; opacidade?: number; escala?: number }> = ({ x, y, aceso, opacidade = 1, escala = 1 }) => (
  <div
    style={{
      position: 'absolute',
      left: x - 26,
      top: y - 20,
      width: 52,
      height: 40,
      background: aceso ? COR.preto : COR.branco,
      border: `6px solid ${COR.preto}`,
      borderRadius: 10,
      boxSizing: 'border-box',
      opacity: opacidade,
      transform: `scale(${escala})`,
    }}
  />
);

const Barra: React.FC<{ p: number }> = ({ p }) => (
  <div style={{ position: 'absolute', left: 24, right: 24, bottom: 22 }}>
    <div style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 24, letterSpacing: 2, color: COR.preto, marginBottom: 6 }}>TEXTO LIDO</div>
    <div style={{ height: 30, border: `6px solid ${COR.preto}`, borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ width: `${p * 100}%`, height: '100%', background: COR.preto }} />
    </div>
  </div>
);

/** Chip de traço com a etiqueta GPU. */
const Chip: React.FC<{ p: number }> = ({ p }) => (
  <div style={{ position: 'absolute', left: W_PAINEL / 2, top: 20, transform: `translateX(-50%) scale(${p})` }}>
    <svg width={150} height={100} viewBox="0 0 150 100" fill={COR.branco} stroke={COR.preto} strokeWidth={8}>
      {[30, 55, 80, 105, 120].map((x) => <line key={x} x1={x} y1={4} x2={x} y2={16} />)}
      {[30, 55, 80, 105, 120].map((x) => <line key={-x} x1={x} y1={84} x2={x} y2={96} />)}
      <rect x={14} y={16} width={122} height={68} rx={10} fill={COR.vermelho} />
      <text x={75} y={62} textAnchor="middle" fontFamily={FONTE.rotulo} fontWeight={900} fontSize={30} fill={COR.preto} stroke="none">GPU</text>
    </svg>
  </div>
);

/** Sem fila: tudo ao mesmo tempo, e a placa de vídeo faz isso muito bem. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tSem = palavra(B, 'sem');
  const tMesmo = palavra(B, 'mesmo', 0);
  const tPlaca = palavra(B, 'placa');
  const tTreinar = palavra(B, 'treinar');

  // esquerda: uma caixinha por vez passa pela máquina
  const u = Math.max(0, (frame - tSem) / 22);
  const passo = Math.floor(u) + interpolate(u - Math.floor(u), [0, 0.4], [0, 1], { extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
  // direita: todas acendem juntas, num pulso
  const pulso = (frame - tMesmo) % 18 < 9 && frame >= tMesmo;
  const pChip = entra(frame, tPlaca - 2, 160);

  return (
    <>
      <Som nome="tique" em={tSem} />
      <Som nome="tique" em={tMesmo} />
      <Som nome="carimbo" em={tPlaca} volume={0.5} />

      <Destaque de={2} ate={tSem - 8} top={600} tamanho={80}>
        por que foi
        <br />
        tão grande?
      </Destaque>

      <TelaDividida
        top={TOPO}
        altura={ALTURA}
        titulos={['EM FILA', 'TUDO JUNTO']}
        entrada={[entra(frame, tSem - 4, 140), entra(frame, tMesmo - 6, 140)]}
        esquerda={
          <>
            <div style={{ position: 'absolute', left: W_PAINEL / 2 - 50, top: 40, width: 100, height: 70, background: COR.vermelho, border: `${CONTORNO}px solid ${COR.preto}`, borderRadius: 18, boxSizing: 'border-box' }} />
            {Array.from({ length: 30 }).map((_, i) => {
              const d = passo - i;
              const x = W_PAINEL / 2 + d * 90;
              if (x < -40 || x > W_PAINEL + 40) return null;
              return <Mini key={i} x={x} y={170} aceso={Math.abs(d) < 0.3} opacidade={d > 0.5 ? 0.35 : 1} />;
            })}
            <Barra p={0.1 * lin(frame, tTreinar, tTreinar + 90)} />
          </>
        }
        direita={
          <>
            {pChip > 0.01 ? (
              <Chip p={pChip} />
            ) : (
              <div style={{ position: 'absolute', left: W_PAINEL / 2 - 110, top: 40, width: 220, height: 70, background: COR.vermelho, border: `${CONTORNO}px solid ${COR.preto}`, borderRadius: 18, boxSizing: 'border-box' }} />
            )}
            {Array.from({ length: 10 }).map((_, i) => (
              <Mini key={i} x={60 + (i % 5) * 67} y={160 + Math.floor(i / 5) * 56} aceso={pulso} escala={pulso ? pop(frame, tMesmo + Math.floor((frame - tMesmo) / 18) * 18, 0.1) : 1} />
            ))}
            <Barra p={lin(frame, tTreinar, tTreinar + 50)} />
          </>
        }
      />
    </>
  );
};

export const Paralelo: CenaEp = {
  Conteudo,
  Fundo: () => { const f = useCurrentFrame(); return <FundoPrensa giro={f * 1.2} />; },
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'placa') - 2, CENTRO_X, 700, 1.06), ABERTO(palavra(B, 'treinar'))],
};
