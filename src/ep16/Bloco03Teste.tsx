import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Celular, Som, Visto, type CenaEp } from '../components';
import { COR, FONTE, CONTORNO, RAIO } from '../theme';
import { entra, lin, suave } from '../anim';
import { palavra } from './tempo';
import { Etiqueta } from '../ep12/comum';
import { Contador, IconeApp, Microfone, PontoMicrofone } from './comum';

const B = 2;
const P = COR.preto;

/** Fileira de apps passando pelo scanner (moldura preta com laser vermelho). */
const Scanner: React.FC<{ frame: number; inicio: number; abre: number }> = ({ frame, inicio, abre }) => {
  const TAM = 104;
  const PASSO = 140;
  const desloc = Math.max(0, frame - inicio) * 9; // px por frame
  return (
    <div style={{ position: 'absolute', left: 160, top: 690, width: 760, height: 190, overflow: 'hidden', opacity: abre }}>
      {Array.from({ length: 12 }).map((_, k) => {
        const n = Math.floor((desloc + k * PASSO) / PASSO);
        const x = ((k * PASSO + desloc) % (12 * PASSO)) - 2 * PASSO;
        return (
          <div key={k} style={{ position: 'absolute', left: x, top: 40 }}>
            <IconeApp i={(n * 5 + k) % 6} tam={TAM} />
          </div>
        );
      })}
    </div>
  );
};

/**
 * "17 mil aplicativos": apps passam pelo scanner e o contador sobe até 17.000. "Nenhum enviava":
 * ÁUDIO ESCONDIDO: 0 com ✓. "Celulares": entra um celular; "microfone": o microfone liga e o
 * pontinho verde acende no topo da tela.
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tPesq = palavra(B, 'pesquisadores');
  const t17 = palavra(B, '17');
  const tNenhum = palavra(B, 'nenhum');
  const tCelulares = palavra(B, 'celulares');
  const tPontinho = palavra(B, 'pontinho');
  const tMicro = palavra(B, 'microfone');

  const sai1 = suave(frame, tCelulares - 10, 10);
  const pScanner = entra(frame, 0, 150) * (1 - sai1);
  const valor = 17000 * lin(frame, t17, tNenhum - 6) ** 0.7;
  const pCont = entra(frame, t17 - 4, 170) * (1 - sai1);
  const pZero = entra(frame, tNenhum, 180) * (1 - sai1);
  const pFicha = entra(frame, tPesq, 170) * (1 - sai1);

  const pFone = frame >= tCelulares - 6 ? entra(frame, tCelulares - 6, 150) : 0;
  const pMic = entra(frame, tMicro, 180);
  const ponto = Math.max(entra(frame, tPontinho, 200) * (frame < tMicro - 6 ? Math.round((frame / 6) % 2) : 1), frame >= tMicro ? 1 : 0);
  return (
    <>
      <Som nome="chiado" em={t17} volume={0.12} />
      <Som nome="ding" em={tNenhum} volume={0.3} />
      <Som nome="tique" em={tPontinho} volume={0.35} />

      {/* scanner */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `scale(${pScanner})`, transformOrigin: '540px 790px' }}>
        <div style={{ position: 'absolute', left: 150, top: 680, width: 780, height: 210, border: `${CONTORNO}px solid ${P}`, borderRadius: RAIO.maquina, background: COR.branco, boxSizing: 'border-box' }} />
        <Scanner frame={frame} inicio={4} abre={1} />
        {/* janela do scanner com laser */}
        <div style={{ position: 'absolute', left: 470, top: 650, width: 140, height: 270, border: `${CONTORNO}px solid ${P}`, borderRadius: 24, boxSizing: 'border-box' }} />
        <div style={{ position: 'absolute', left: 536, top: 660, width: 8, height: 250, background: COR.vermelho, opacity: 0.6 + 0.4 * Math.abs(Math.sin(frame / 3)) }} />
      </div>
      <div style={{ position: 'absolute', left: 0, top: 0 }}>
        <Contador x={540} top={540} valor={valor} escala={pCont} />
        <Etiqueta x={540} top={940} texto="NORTHEASTERN · 2018" escala={pFicha * (1 - pZero)} />
        <Etiqueta x={500} top={935} texto="ÁUDIO ESCONDIDO: 0" cor={COR.verde} escala={pZero} />
        <Visto x={790} y={970} r={34} escala={pZero} />
      </div>

      {/* celular com o pontinho do microfone */}
      {pFone > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, transform: `translateY(${(1 - pFone) * 900}px)` }}>
          <Celular x={540} base={1000} escala={0.9}>
            <div style={{ transform: `scale(${pMic})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <Microfone tam={110} />
              <div style={{ fontFamily: FONTE.rotulo, fontWeight: 900, fontSize: 24, letterSpacing: 2 }}>MICROFONE</div>
            </div>
          </Celular>
          {/* topo da tela: base 1000, altura 470×0,9 ≈ 423; tela começa ~36 px abaixo */}
          <PontoMicrofone x={640} y={1000 - 423 + 58} aceso={ponto} />
        </div>
      ) : null}
    </>
  );
};

export const Teste: CenaEp = {
  Conteudo,
  Fundo: () => null,
  planos: () => [ABERTO(0)],
};
