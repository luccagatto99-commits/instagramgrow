import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Calendario, FECHADO, FundoReuniao, Logo, Som, rolaAno, type CenaEp } from '../components';
import { COR, FONTE, CONTORNO, RAIO, SOMBRA, CENTRO_X } from '../theme';
import { entra, lin, pop, segue } from '../anim';
import { palavra } from './tempo';
import { TesteTuring } from './comum';

const B = 9;
const BARRA_W = 340;

const Barra: React.FC<{ nome: React.ReactNode; valor: number; p: number; vis: number; pulso?: number }> = ({ nome, valor, p, vis, pulso = 1 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 20, opacity: vis, transform: `scale(${pulso})`, transformOrigin: '0% 50%' }}>
    <div style={{ width: 240, display: 'flex', alignItems: 'center', gap: 10, fontFamily: FONTE.titulo, fontSize: 40, color: COR.preto, whiteSpace: 'nowrap' }}>{nome}</div>
    <div style={{ width: BARRA_W, height: 56, border: `8px solid ${COR.preto}`, borderRadius: 14, background: COR.branco, boxSizing: 'border-box', overflow: 'hidden' }}>
      <div style={{ width: `${valor * p}%`, height: '100%', background: COR.azul }} />
    </div>
    <div style={{ width: 120, fontFamily: FONTE.numero, fontWeight: 800, fontSize: 52, color: COR.azul }}>{Math.round(valor * Math.min(1, p))}%</div>
  </div>
);

/** 2025: o teste de Turing de verdade, com pessoas; GPT-4.5 em 73%, ELIZA em 23%. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const t2025 = palavra(B, '2025,');
  const tReais = palavra(B, 'reais.');
  const tGpt = palavra(B, 'gpt-4.5');
  const t73 = palavra(B, '73%');
  const tHumanos = palavra(B, 'humanos.');
  const tEliza = palavra(B, 'eliza,');
  const t23 = palavra(B, '23%.');

  const ano = rolaAno(frame, t2025 - 4, 2022, 2025, 16);
  const sai = segue(frame, t73 - 12, 12);
  const pPainel = entra(frame, t73 - 4, 140);

  return (
    <>
      <Som nome="tique" em={2} />
      <Som nome="tique" em={tReais} volume={0.6} />
      <Som nome="carimbo" em={tGpt} volume={0.5} />
      <Som nome="tique" em={t73} />
      <Som nome="tique" em={tEliza} />

      <Calendario ano={ano} de={t2025 - 4} ate={tReais - 12} x={250} />

      {sai < 1400 ? (
        <TesteTuring
          p={entra(frame, 2, 110)}
          dx={sai}
          oculto={frame >= tGpt - 2 ? <Logo marca="openai" tamanho={130} /> : undefined}
          pA={entra(frame, tReais - 6, 160)}
          pB={entra(frame, tReais + 12, 160)}
          textoA="de onde você é?"
          textoB="de Recife, e você?"
        />
      ) : null}

      {pPainel > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: CENTRO_X,
            top: 600,
            width: 820,
            transform: `translateX(-50%) scale(${pPainel})`,
            background: COR.branco,
            border: `${CONTORNO}px solid ${COR.preto}`,
            borderRadius: RAIO.placa,
            boxShadow: SOMBRA,
            overflow: 'hidden',
          }}
        >
          <div style={{ background: COR.preto, color: COR.amarelo, padding: '16px 0 12px', textAlign: 'center', fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 36, letterSpacing: 2 }}>APONTADO COMO HUMANO</div>
          <div style={{ padding: '30px 30px 34px', display: 'flex', flexDirection: 'column', gap: 30 }}>
            <Barra nome={<><Logo marca="openai" tamanho={44} />GPT-4.5</>} valor={73} p={lin(frame, t73 - 2, t73 + 14)} vis={1} pulso={pop(frame, tHumanos, 0.06)} />
            <Barra nome="ELIZA" valor={23} p={lin(frame, t23 - 2, t23 + 12)} vis={lin(frame, tEliza - 4, tEliza + 4)} />
          </div>
        </div>
      ) : null}
    </>
  );
};

export const Hoje: CenaEp = {
  Conteudo,
  Fundo: () => { const f = useCurrentFrame(); return <FundoReuniao ponteiro={f * 0.05} />; },
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'gpt-4.5') - 4, 680, 840, 1.1), ABERTO(palavra(B, '73%') - 8), FECHADO(palavra(B, 'eliza,') - 2, CENTRO_X, 760, 1.06)],
};
