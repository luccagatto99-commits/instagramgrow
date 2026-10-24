import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Carimbo, Som, type CenaEp } from '../components';
import { COR, FONTE, CONTORNO, SOMBRA } from '../theme';
import { entra, mola, suave } from '../anim';
import { palavra } from './tempo';
import { Ouvido } from './comum';

const B = 1;
const P = COR.preto;

/**
 * Pasta do arquivo com a aba "2024" (azul = número). `abre` 0 → 1 levanta a folha de dentro:
 * "ANÚNCIOS PELO QUE VOCÊ FALA", com o ouvido. Centro x, base.
 */
export const PastaVazada: React.FC<{ x: number; base: number; abre: number; escala?: number; linhas?: number }> = ({ x, base, abre, escala = 1, linhas = 1 }) => {
  const W = 560;
  const H = 300;
  return (
    <div style={{ position: 'absolute', left: x - W / 2, top: base - H, width: W, height: H, transform: `scale(${escala})`, transformOrigin: '50% 100%' }}>
      {/* fundo da pasta + aba */}
      <div style={{ position: 'absolute', left: 0, top: -40, width: 200, height: 60, background: COR.branco, border: `${CONTORNO}px solid ${P}`, borderRadius: '20px 20px 0 0', boxSizing: 'border-box', textAlign: 'center', fontFamily: FONTE.numero, fontWeight: 800, fontSize: 30, color: COR.azul, lineHeight: '42px' }}>
        2024
      </div>
      <div style={{ position: 'absolute', inset: 0, background: COR.branco, border: `${CONTORNO}px solid ${P}`, borderRadius: '0 24px 24px 24px', boxSizing: 'border-box' }} />
      {/* folha que sobe */}
      <div
        style={{
          position: 'absolute',
          left: 50,
          width: W - 100,
          height: 300,
          top: 20 - 225 * abre,
          background: COR.branco,
          border: `8px solid ${P}`,
          borderRadius: 14,
          boxSizing: 'border-box',
          padding: '22px 26px',
          display: 'flex',
          gap: 18,
          alignItems: 'flex-start',
        }}
      >
        <Ouvido tam={74} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 30, letterSpacing: 1, lineHeight: 1.1 }}>ANÚNCIOS PELO QUE VOCÊ FALA</div>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ marginTop: 16, height: 12, borderRadius: 6, background: P, width: `${[92, 70, 84][i] * Math.min(1, Math.max(0, linhas * 3 - i))}%` }} />
          ))}
        </div>
      </div>
      {/* frente da pasta (cobre a parte de baixo da folha) */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: H - 90, background: COR.branco, border: `${CONTORNO}px solid ${P}`, borderRadius: 24, boxShadow: SOMBRA, boxSizing: 'border-box' }}>
        <div style={{ position: 'absolute', left: 40, right: 40, top: 40, fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 30, letterSpacing: 3, textAlign: 'center' }}>EMPRESA DE MARKETING · EUA</div>
        <div style={{ position: 'absolute', left: 40, right: 40, top: 96, height: 10, background: P, borderRadius: 5 }} />
      </div>
    </div>
  );
};

/**
 * "Em 2024": a pasta do arquivo desce. "Vazou": a folha sai de dentro e o carimbo VAZOU bate.
 * "Google": a folha volta e o carimbo FORA DO PROGRAMA crava na pasta ("parceiros").
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const t2024 = palavra(B, '2024');
  const tVazou = palavra(B, 'vazou');
  const tOferecia = palavra(B, 'oferecia');
  const tGoogle = palavra(B, 'google');
  const tPrograma = palavra(B, 'programa');

  const pPasta = entra(frame, Math.max(0, t2024 - 20), 150);
  const abre = mola(frame, tVazou - 4, 0, 1) * (1 - suave(frame, tGoogle - 4, 14));
  const linhas = suave(frame, tOferecia, 50);
  return (
    <>
      <Som nome="tique" em={Math.max(0, t2024 - 20)} volume={0.3} />
      <Som nome="carimbo" em={tVazou + 6} volume={0.4} />
      <Som nome="carimbo" em={tPrograma} volume={0.4} />

      <div style={{ position: 'absolute', inset: 0, transform: `translateX(${(1 - pPasta) * -1100}px)` }}>
        <PastaVazada x={540} base={990} abre={abre} linhas={linhas} />
      </div>
      {frame >= tVazou + 2 && frame < tGoogle - 4 ? <Carimbo x={600} y={700} texto="VAZOU" em={tVazou + 6} tamanho={58} rot={-10} /> : null}
      {frame >= tPrograma - 4 ? <Carimbo x={540} y={930} texto="FORA DO PROGRAMA" em={tPrograma} tamanho={50} rot={-8} /> : null}
      {/* nome do Google só em texto */}
      {frame >= tGoogle - 2 ? (
        <div
          style={{
            position: 'absolute',
            left: 540,
            top: 570,
            transform: `translateX(-50%) scale(${entra(frame, tGoogle - 2, 180)})`,
            fontFamily: FONTE.rotulo,
            fontWeight: 900,
            fontSize: 34,
            letterSpacing: 2,
            background: COR.branco,
            border: `6px solid ${P}`,
            borderRadius: 14,
            padding: '8px 22px 5px',
            whiteSpace: 'nowrap',
          }}
        >
          GOOGLE: PROGRAMA DE PARCEIROS
        </div>
      ) : null}
    </>
  );
};

export const Motivo: CenaEp = {
  Conteudo,
  Fundo: () => null,
  planos: () => [ABERTO(0)],
};
