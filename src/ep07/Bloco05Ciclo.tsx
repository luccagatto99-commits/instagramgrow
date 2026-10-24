import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, CarroEsportivo, CicloDeControle, FECHADO, FundoSaida, Som, type CenaEp } from '../components';
import { COR, FONTE, ESTEIRA_Y, CENTRO_X } from '../theme';
import { entra, lin, segue } from '../anim';
import { palavra } from './tempo';
import { Foguete } from './comum';

const B = 4;
const CICLO_Y = 800;

/** Ângulo do ponto do ciclo: devagar até cada estação na hora da fala, depois acelera até virar borrão. */
const giroCiclo = (frame: number, tMede: number, tCompara: number, tCorrige: number) => {
  if (frame < tMede) return -90 - 360 + lin(frame, 0, tMede, 0, 360);
  if (frame < tCompara) return -90 + lin(frame, tMede + 4, tCompara, 0, 120);
  if (frame < tCorrige) return 30 + lin(frame, tCompara + 4, tCorrige, 0, 120);
  const t = frame - tCorrige;
  // depois de "corrige": volta ao topo e acelera
  return 150 + 120 * Math.min(1, t / 8) + Math.max(0, t - 8) ** 1.6 * 4;
};

/** O ciclo de controle: mede a inclinação, compara com a manobra, dispara o jato que corrige. Igual ao foguete. */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tRepete = palavra(B, 'repete');
  const tMede = palavra(B, 'mede');
  const tCompara = palavra(B, 'compara');
  const tDispara = palavra(B, 'dispara');
  const tCorrige = palavra(B, 'corrige.');
  const tIgual = palavra(B, 'igual');
  const tFoguetes = palavra(B, 'foguetes');
  const tPe = palavra(B, 'pé.');

  const giro = giroCiclo(frame, tMede, tCompara, tCorrige);
  const ativa = frame >= tCorrige - 6 && frame < tCorrige + 14 ? 2 : frame >= tCompara - 2 && frame < tCorrige - 6 ? 1 : frame >= tMede - 2 && frame < tCompara - 2 ? 0 : -1;
  const rapido = frame > tCorrige + 14;
  const rastro = rapido ? lin(frame, tCorrige + 14, tIgual, 0, 300) : 0;
  const sai = segue(frame, tIgual - 6, 14);

  // o carro no meio: torto 12°, o jato da frente corrige, e no ritmo rápido só treme de leve
  const corrige = lin(frame, tDispara + 4, tCorrige + 8);
  const rot = 12 * (1 - corrige) + (rapido ? Math.sin(frame * 1.3) * 2 : 0);
  const jato6 = frame >= tDispara && frame < tCorrige + 10 ? 1 : rapido ? (Math.sin(frame * 1.3) > 0.6 ? 0.6 : 0) : 0;
  const angulo = frame < tCompara - 2 ? '12°' : frame < tCorrige ? '−12°' : '0°';

  // foguete: desce de pé e pousa no "pé", com o mesmo ciclo pequeno ao lado girando rápido
  const yFoguete = lin(frame, tFoguetes - 8, tPe, 940, ESTEIRA_Y);

  return (
    <>
      <Som nome="tique" em={tRepete - 2} />
      <Som nome="tique" em={tMede - 2} />
      <Som nome="tique" em={tCompara - 2} />
      <Som nome="carimbo" em={tDispara + 2} volume={0.35} />
      {[0, 6, 11, 15, 18, 21].map((k) => <Som key={k} nome="tique" em={tCorrige + 14 + k} volume={0.3} />)}
      <Som nome="tique" em={tFoguetes - 6} />
      <Som nome="guilhotina" em={tPe} volume={0.35} />

      {sai < 1200 ? (
        <div style={{ position: 'absolute', left: sai, top: 0, width: 1080, height: 1920 }}>
          <CicloDeControle x={CENTRO_X} y={CICLO_Y} raio={190} giro={giro} ativa={ativa} rastro={rastro} tamanho={40} escala={entra(frame, -6, 140)}>
            <div style={{ position: 'absolute', left: -60, top: -118, width: 120, textAlign: 'center', fontFamily: FONTE.numero, fontWeight: 800, fontSize: 44, color: COR.azul, opacity: lin(frame, tMede - 2, tMede + 4) }}>{angulo}</div>
            {frame >= tCompara - 2 && frame < tCorrige + 14 ? (
              <svg width={240} height={10} style={{ position: 'absolute', left: -120, top: -5 }}>
                <line x1={0} y1={5} x2={240} y2={5} stroke={COR.preto} strokeWidth={6} strokeDasharray="14 12" />
              </svg>
            ) : null}
            <CarroEsportivo x={0} y={0} escala={0.62} rot={rot} jatos={[0, 0, 0, 0, 0, 0, jato6]} frame={frame} />
          </CicloDeControle>
        </div>
      ) : null}

      {frame >= tFoguetes - 8 ? (
        <>
          <Foguete x={330} base={yFoguete} jato={frame < tPe + 6 ? 1 : 0} escala={entra(frame, tFoguetes - 8, 160) * 0.9} frame={frame} />
          <CicloDeControle x={710} y={810} raio={175} giro={frame * 30} rastro={200} escala={entra(frame, tFoguetes, 150) * 0.58} tamanho={38} />
        </>
      ) : null}
    </>
  );
};

export const Ciclo: CenaEp = {
  Conteudo,
  Fundo: () => { const f = useCurrentFrame(); return <FundoSaida ponteiro={f * 0.1} />; },
  planos: () => [ABERTO(0), FECHADO(palavra(B, 'mede') - 4, 540, 800, 1.08), ABERTO(palavra(B, 'dispara') - 4), ABERTO(palavra(B, 'igual') - 4)],
};
