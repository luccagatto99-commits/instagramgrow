import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ABERTO, Mascote, Som, type CenaEp } from '../components';
import { COR, FONTE } from '../theme';
import { entra, lin, mola, segue, suave } from '../anim';
import { palavra } from './tempo';
import { CAM_ABERTA, CarroTopo, Cartao, Mapa, Pino, RUAS, Rotulo, Trecho, X_V2, Y_AV, aTela } from './comum';
import { CartaoChegada, X_VOCE } from './Bloco04Dificil';

const B = 4;
const P = COR.preto;
const HORAS = [6, 8, 10, 12, 14, 16, 18, 20, 22];
const TIPICO = [30, 72, 48, 52, 46, 62, 96, 58, 24];

const Pilula: React.FC<{ texto: string; escala: number; mono?: boolean }> = ({ texto, escala, mono }) => (
  <div
    style={{
      transform: `scale(${escala})`,
      background: P,
      color: COR.branco,
      borderRadius: 999,
      padding: '5px 16px 3px',
      fontFamily: mono ? FONTE.numero : FONTE.rotulo,
      fontWeight: mono ? 800 : 900,
      fontSize: 24,
      letterSpacing: mono ? 0 : 2,
    }}
  >
    {texto}
  </div>
);

/** Gráfico do trânsito típico por horário (barras azuis; o horário marcado fica vermelho). */
const GraficoTipico: React.FC<{ x: number; top: number; escala: number; cresce: number; pDia: number; pHora: number }> = ({ x, top, escala, cresce, pDia, pHora }) => (
  <Cartao x={x} top={top} largura={510} escala={escala}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 54 }}>
      <Rotulo tam={24}>COSTUMA ESTAR</Rotulo>
      <Pilula texto="TERÇA" escala={pDia} />
      <Pilula texto="18h" escala={pHora} mono />
    </div>
    <svg width={460} height={250} style={{ display: 'block', marginTop: 8 }}>
      <line x1={0} y1={212} x2={460} y2={212} stroke={P} strokeWidth={5} />
      {HORAS.map((h, i) => {
        const alt = TIPICO[i] * 1.9 * Math.min(1, Math.max(0, cresce * 1.6 - i * 0.07));
        const x0 = 6 + i * 50;
        const marcada = h === 18 && pHora > 0.5;
        return (
          <g key={h}>
            <rect x={x0} y={212 - alt} width={38} height={alt} rx={6} fill={marcada ? COR.vermelho : COR.azul} stroke={P} strokeWidth={5} />
            <text x={x0 + 19} y={244} textAnchor="middle" fontFamily={FONTE.numero} fontWeight={800} fontSize={20} fill={P}>
              {h}h
            </text>
          </g>
        );
      })}
    </svg>
  </Cartao>
);

/**
 * A IA: o mascote da fábrica chega no meio (visor acendendo) ("IA criada pela DeepMind"). "Olha como a rua costuma estar": o mascote vai
 * para o canto e chega o gráfico do trânsito típico; "dia e horário": TERÇA e 18h (barra vermelha).
 * "Ruas vizinhas": o gráfico sai e o mapa volta, virando uma rede de pontos ligados. "Rua lateral":
 * a rua lateral fica vermelha; "vai chegar na sua": a onda vermelha escorre pela avenida.
 * "Já sabe disso": CHEGADA 18h42 em verde.
 */
const Conteudo: React.FC = () => {
  const frame = useCurrentFrame();
  const tIA = palavra(B, 'ia');
  const tOlha = palavra(B, 'olha');
  const tDia = palavra(B, 'dia');
  const tHorario = palavra(B, 'horario.');
  const tTambem = palavra(B, 'tambem');
  const tVizinhas = palavra(B, 'vizinhas.');
  const tEngarrafamento = palavra(B, 'engarrafamento');
  const tLateral = palavra(B, 'lateral');
  const tChegar = palavra(B, 'chegar');
  const tSabe = palavra(B, 'sabe');

  // chip: cai no meio, depois vai para o canto
  const pChip = entra(frame, 0, 150);
  const canto = suave(frame, tOlha - 4, 14);
  const sai = segue(frame, tTambem - 6, 14);
  const xChip = 540 + (245 - 540) * canto + sai;
  const baseChip = 960 + (800 - 960) * canto;
  const largChip = 380 + (200 - 380) * canto;
  const pGrafico = frame >= tOlha + 2 ? entra(frame, tOlha + 2, 160) : 0;
  const cresce = lin(frame, tOlha + 4, tOlha + 34);
  const pDia = frame >= tDia - 2 ? entra(frame, tDia - 2, 190) : 0;
  const pHora = frame >= tHorario - 2 ? entra(frame, tHorario - 2, 190) : 0;

  // mapa: entra pela esquerda em "também"
  const dxMapa = frame < tTambem ? -1300 : mola(frame, tTambem, -1300, 0);
  const grafo = suave(frame, tVizinhas - 6, 18);
  const larg = 32 - 20 * grafo;
  const pLateral = lin(frame, tEngarrafamento, tLateral + 12);
  const pulsa = frame >= tLateral && frame < tChegar ? 3 * Math.sin((frame - tLateral) / 2.5) : 0;
  const pOnda = lin(frame, tChegar - 6, tChegar + 40);
  const [vx, vy] = aTela(CAM_ABERTA, [X_VOCE, Y_AV - 18], dxMapa);
  const pChegada = frame >= tSabe - 4 ? entra(frame, tSabe - 4, 170) : 0;
  return (
    <>
      <Som nome="tique" em={0} volume={0.3} />
      <Som nome="chiado" em={tIA} volume={0.12} />
      <Som nome="tique" em={tOlha + 2} volume={0.3} />
      <Som nome="tique" em={tDia - 2} volume={0.3} />
      <Som nome="tique" em={tHorario - 2} volume={0.3} />
      <Som nome="chiado" em={tVizinhas - 6} volume={0.15} />
      <Som nome="tique" em={tEngarrafamento} volume={0.3} />
      <Som nome="chiado" em={tChegar - 6} volume={0.15} />
      <Som nome="ding" em={tSabe - 4} volume={0.35} />

      {frame < tTambem + 14 ? <Mascote x={xChip} base={baseChip} largura={largChip} escala={pChip} olhar={canto * 0.8} pensa={frame >= tIA ? ((frame - tIA) % 40) / 40 : 0} /> : null}
      {frame < tTambem + 14 ? (
        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${sai}px)` }}>
          <GraficoTipico x={648} top={540} escala={pGrafico} cresce={cresce} pDia={pDia} pHora={pHora} />
        </div>
      ) : null}

      {frame >= tTambem ? (
        <>
          <Mapa cam={CAM_ABERTA} grafo={grafo} dx={dxMapa}>
            {Object.values(RUAS).map((pts, i) => (
              <Trecho key={i} pts={pts} cor={COR.verde} largura={larg} />
            ))}
            <Trecho pts={[[X_V2, -80], [X_V2, Y_AV]]} cor={COR.vermelho} p={pLateral} largura={larg + 6 + pulsa} />
            <Trecho pts={[[X_V2, Y_AV], [840, Y_AV]]} cor={COR.vermelho} p={pOnda} largura={larg + 6} />
            <Trecho pts={[[X_V2, Y_AV], [230, Y_AV]]} cor={COR.vermelho} p={pOnda} largura={larg + 6} />
            <CarroTopo x={X_VOCE} y={Y_AV} />
          </Mapa>
          <Pino x={vx} y={vy} escala={1} rotulo="VOCÊ" tam={56} />
          <CartaoChegada valor="18h42" cor={COR.verde} escala={pChegada} />
        </>
      ) : null}
    </>
  );
};

export const IA: CenaEp = {
  Conteudo,
  Fundo: () => null,
  planos: () => [ABERTO(0)],
  esteira: false,
};
